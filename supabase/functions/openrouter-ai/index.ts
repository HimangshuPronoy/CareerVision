
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { prompt, type, context } = await req.json()

    const OPENROUTER_API_KEY = Deno.env.get('OPENROUTER_API_KEY')
    if (!OPENROUTER_API_KEY) {
      throw new Error('OpenRouter API key not configured')
    }

    // Enhanced prompts based on type
    let systemPrompt = ""
    let enhancedPrompt = prompt

    switch (type) {
      case 'career_path':
        systemPrompt = `You are an expert career advisor. Create a detailed, actionable career path plan. Always respond with a JSON object with this exact structure:
{
  "title": "Career Path to [Target Career]",
  "description": "Brief overview of the career path",
  "timeline": "Expected timeframe (e.g., '2-3 years')",
  "steps": [
    {
      "phase": "Phase name (e.g., 'Foundation Building')",
      "duration": "Time needed (e.g., '3-6 months')",
      "description": "What to focus on in this phase",
      "skills": ["skill1", "skill2", "skill3"],
      "milestones": ["milestone1", "milestone2"],
      "resources": ["resource1", "resource2"]
    }
  ],
  "final_outcome": "What you'll achieve at the end"
}`
        break

      case 'learning_path':
        systemPrompt = `You are an expert learning strategist. Create a comprehensive learning path. Always respond with a JSON object with this exact structure:
{
  "title": "Master [Skill/Field]",
  "description": "Overview of what you'll learn",
  "difficulty": "Beginner/Intermediate/Advanced",
  "duration": "Total time needed (e.g., '6-12 months')",
  "modules": [
    {
      "name": "Module name",
      "duration": "Module duration (e.g., '2-3 weeks')",
      "description": "What this module covers",
      "topics": ["topic1", "topic2", "topic3"],
      "resources": ["resource1", "resource2"],
      "projects": ["project1", "project2"],
      "certification": "Certification or assessment info"
    }
  ],
  "career_outcomes": ["outcome1", "outcome2", "outcome3"]
}`
        break

      case 'skill_analysis':
        systemPrompt = `You are an expert career analyst. Analyze skills and provide career matches. Always respond with a JSON object with this exact structure:
{
  "analysis": "Overall analysis of the user's skills and career potential",
  "top_careers": [
    {
      "title": "Job Title",
      "match_percentage": 85,
      "description": "Why this career matches",
      "required_skills": ["skill1", "skill2"],
      "missing_skills": ["skill1", "skill2"],
      "salary_range": "$XX,000 - $XX,000",
      "growth_potential": "High/Medium/Low"
    }
  ],
  "skill_gaps": [
    {
      "skill": "Skill name",
      "importance": "High/Medium/Low",
      "learning_time": "Time to learn (e.g., '1-2 months')",
      "resources": ["resource1", "resource2"]
    }
  ],
  "recommendations": ["recommendation1", "recommendation2", "recommendation3"]
}`
        break

      case 'mentor':
        systemPrompt = `You are an experienced career mentor and advisor. Provide practical, actionable career advice. Be encouraging, specific, and helpful. Draw from real-world experience and current industry trends.`
        break

      default:
        systemPrompt = `You are a helpful AI assistant specializing in career development and professional growth.`
    }

    // Add context if provided
    if (context) {
      enhancedPrompt = `Context about the user: ${context}\n\nUser's request: ${prompt}`
    }

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'X-Title': 'CareerVision AI'
      },
      body: JSON.stringify({
        model: 'qwen/qwen-2.5-72b-instruct',
        messages: [
          {
            role: 'system',
            content: systemPrompt
          },
          {
            role: 'user',
            content: enhancedPrompt
          }
        ],
        temperature: 0.7,
        max_tokens: 4000,
        stream: false
      })
    })

    if (!response.ok) {
      const errorData = await response.text()
      console.error('OpenRouter API error:', errorData)
      throw new Error(`OpenRouter API error: ${response.status}`)
    }

    const data = await response.json()
    console.log('OpenRouter response:', data)

    let aiResponse = data.choices[0]?.message?.content || 'No response generated'

    // Parse JSON response for structured types
    if (['career_path', 'learning_path', 'skill_analysis'].includes(type)) {
      try {
        const parsedResponse = JSON.parse(aiResponse)
        return new Response(
          JSON.stringify({ response: parsedResponse }),
          { 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        )
      } catch (parseError) {
        console.error('Failed to parse JSON response:', parseError)
        console.log('Raw response:', aiResponse)
        // Fallback for non-JSON responses
        return new Response(
          JSON.stringify({ response: aiResponse }),
          { 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        )
      }
    }

    return new Response(
      JSON.stringify({ response: aiResponse }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    console.error('Error in openrouter-ai function:', error)
    return new Response(
      JSON.stringify({ 
        error: error.message || 'Internal server error',
        details: 'Check function logs for more information'
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})
