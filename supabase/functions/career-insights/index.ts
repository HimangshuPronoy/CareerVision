
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { GoogleGenerativeAI } from "https://esm.sh/@google/generative-ai@0.2.0";

const geminiApiKey = Deno.env.get("GEMINI_API_KEY");

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { userProfile, requestType } = await req.json();
    console.log(`Processing ${requestType} request for user profile:`, JSON.stringify(userProfile));

    if (!geminiApiKey) {
      throw new Error("Missing Gemini API key");
    }

    const genAI = new GoogleGenerativeAI(geminiApiKey);
    // Using the updated Gemini model
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    let prompt = "";
    switch (requestType) {
      case "careerPath":
        prompt = `Based on this professional profile: ${JSON.stringify(userProfile)}, 
        recommend 3 potential career paths. For each path include: job title, 
        match percentage based on skills (as a number between 0-100), key skills needed, and a brief career trajectory. 
        Format as JSON with array of objects containing: title, matchPercentage (number), 
        skillsNeeded (array of strings), and description (string).`;
        break;
      case "specificCareer":
        prompt = `Based on this professional profile: ${JSON.stringify(userProfile)}, 
        analyze the match for the specific job role: "${userProfile.specificJobTitle}".
        Provide a detailed assessment including: job title, match percentage based on current skills (number between 0-100),
        skills already possessed that match the role, skills that need to be developed,
        estimated time to achieve the needed skills, and a career development plan.
        Format as JSON with fields: title, matchPercentage (number), skillsNeeded (array of all required skills),
        requiredSkills (array of skills still needed), timeToAchieve (string), and description (string with career plan).`;
        break;
      case "skillGap":
        prompt = `Given this professional profile: ${JSON.stringify(userProfile)}, 
        identify the top 3 skills this person should develop to improve their 
        marketability. For each skill include: name, current demand score (0-100), 
        growth rate percentage, relevance to their profile (0-100), and learning resources. 
        Format as JSON with array of objects containing: name, demandScore (number), 
        growthRate (number), relevanceScore (number), and resources (array of objects with title and url).`;
        break;
      case "marketInsight":
        prompt = `Analyze this professional profile: ${JSON.stringify(userProfile)}, 
        and provide insights on current job market trends relevant to their background. 
        Include industry growth projections, most in-demand roles, average compensation, 
        and geographic hotspots. Format as JSON with these sections.`;
        break;
      default:
        throw new Error("Invalid request type");
    }

    console.log("Sending prompt to Gemini:", prompt);
    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();
    console.log("Received response from Gemini:", text);
    
    // Try to parse the response as JSON
    let parsedResponse;
    try {
      // Extract JSON if it's wrapped in code blocks
      const jsonMatch = text.match(/```json\n([\s\S]*?)\n```/) || 
                         text.match(/```\n([\s\S]*?)\n```/) ||
                         text.match(/\{[\s\S]*\}/) ||
                         text.match(/\[[\s\S]*\]/);
                         
      const jsonString = jsonMatch ? jsonMatch[1] || jsonMatch[0] : text;
      console.log("Extracted JSON string:", jsonString);
      parsedResponse = JSON.parse(jsonString);
      console.log("Successfully parsed JSON response");
    } catch (error) {
      console.error("Failed to parse JSON response:", error);
      // If parsing fails, return the raw text
      parsedResponse = { rawResponse: text };
    }

    return new Response(JSON.stringify(parsedResponse), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error("Error in career-insights function:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
