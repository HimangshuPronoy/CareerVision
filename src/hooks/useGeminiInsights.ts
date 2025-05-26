import { useState } from 'react';

interface GeminiInsightsResponse {
  careerOpportunities: number;
  industryGrowth: number;
  insights: string[];
}

export const useGeminiInsights = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getInsights = async (skills: string[], industry: string): Promise<GeminiInsightsResponse> => {
    setLoading(true);
    setError(null);
    
    try {
      // Replace this with your actual Gemini API key and endpoint
      const GEMINI_API_KEY = process.env.VITE_GEMINI_API_KEY;
      const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${GEMINI_API_KEY}`
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `Analyze the following skills and industry for career opportunities and growth:
                     Skills: ${skills.join(', ')}
                     Industry: ${industry}
                     
                     Please provide:
                     1. Number of potential career opportunities (as a number)
                     2. Industry growth rate (as a percentage)
                     3. Three key insights about career prospects
                     
                     Format the response as JSON:
                     {
                       "careerOpportunities": number,
                       "industryGrowth": number,
                       "insights": [string, string, string]
                     }`
            }]
          }]
        })
      });

      if (!response.ok) {
        throw new Error('Failed to fetch insights from Gemini');
      }

      const data = await response.json();
      const jsonResponse = JSON.parse(data.candidates[0].content.parts[0].text);

      return {
        careerOpportunities: jsonResponse.careerOpportunities,
        industryGrowth: jsonResponse.industryGrowth,
        insights: jsonResponse.insights
      };
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      // Return default values if there's an error
      return {
        careerOpportunities: 0,
        industryGrowth: 0,
        insights: []
      };
    } finally {
      setLoading(false);
    }
  };

  return {
    getInsights,
    loading,
    error
  };
}; 