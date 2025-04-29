import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Sparkles } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';

interface AIResumeSuggestionsProps {
  resumeData: {
    personalInfo: {
      name: string;
      email: string;
      phone: string;
      location: string;
      summary: string;
    };
    experiences: Array<{
      company: string;
      position: string;
      startDate: string;
      endDate: string;
      description: string;
    }>;
    education: Array<{
      institution: string;
      degree: string;
      field: string;
      startDate: string;
      endDate: string;
    }>;
    skills: Array<{
      name: string;
      level: string;
    }>;
  };
  onApplySuggestion: (suggestion: string) => void;
}

const AIResumeSuggestions = ({ resumeData, onApplySuggestion }: AIResumeSuggestionsProps) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [suggestion, setSuggestion] = useState('');
  const [lastGeneratedTime, setLastGeneratedTime] = useState<number>(0);
  const RATE_LIMIT_DELAY = 60000; // 1 minute delay between generations

  const generateSuggestion = async () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to get personalized resume suggestions.",
        variant: "destructive",
      });
      return;
    }

    // Check rate limiting
    const now = Date.now();
    if (now - lastGeneratedTime < RATE_LIMIT_DELAY) {
      const remainingTime = Math.ceil((RATE_LIMIT_DELAY - (now - lastGeneratedTime)) / 1000);
      toast({
        title: "Please Wait",
        description: `You can generate new suggestions in ${remainingTime} seconds to avoid excessive API usage.`,
        variant: "default",
      });
      return;
    }
    
    setLoading(true);
    try {
      // Get Gemini API key from Supabase
      const { data: geminiKey, error: keyError } = await supabase
        .from('api_keys')
        .select('value')
        .eq('name', 'gemini')
        .single();

      if (keyError || !geminiKey) {
        throw new Error('Unable to access AI services. Please try again later.');
      }

      // Validate resume data before making API call
      if (!resumeData.personalInfo.summary && resumeData.experiences.length === 0) {
        toast({
          title: "Incomplete Resume",
          description: "Please add some basic information to your resume first.",
          variant: "destructive",
        });
        return;
      }

      // Prepare the prompt for Gemini
      const prompt = `Analyze this resume and provide specific suggestions for improvement:
        Name: ${resumeData.personalInfo.name}
        Summary: ${resumeData.personalInfo.summary}
        Experience: ${resumeData.experiences.map(exp => 
          `${exp.position} at ${exp.company} (${exp.startDate} - ${exp.endDate}): ${exp.description}`
        ).join('\n')}
        Education: ${resumeData.education.map(edu => 
          `${edu.degree} in ${edu.field} from ${edu.institution} (${edu.startDate} - ${edu.endDate})`
        ).join('\n')}
        Skills: ${resumeData.skills.map(skill => 
          `${skill.name} (${skill.level})`
        ).join(', ')}

        Please provide specific, actionable suggestions for:
        1. Improving the professional summary
        2. Enhancing experience descriptions
        3. Highlighting key achievements
        4. Optimizing skills presentation
        5. Overall resume structure and formatting

        Format the response as a clear, structured list of suggestions.`;

      const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${geminiKey.value}`,
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompt
            }]
          }]
        })
      });

      if (!response.ok) {
        throw new Error('Failed to generate suggestions. Please try again later.');
      }

      const data = await response.json();
      if (!data.candidates?.[0]?.content?.parts?.[0]?.text) {
        throw new Error('Invalid response from AI service');
      }

      const generatedSuggestion = data.candidates[0].content.parts[0].text;
      setSuggestion(generatedSuggestion);
      setLastGeneratedTime(Date.now());
    } catch (error) {
      console.error('Error generating suggestion:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to generate resume suggestions. Please try again later.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>AI Resume Suggestions</CardTitle>
          <Button 
            onClick={generateSuggestion} 
            disabled={loading || Date.now() - lastGeneratedTime < RATE_LIMIT_DELAY}
            className="flex items-center gap-2"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Sparkles className="h-4 w-4" />
            )}
            Generate Suggestions
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {suggestion ? (
          <div className="space-y-4">
            <Textarea
              value={suggestion}
              readOnly
              className="min-h-[200px] font-mono text-sm"
            />
            <div className="flex justify-end">
              <Button
                onClick={() => onApplySuggestion(suggestion)}
                variant="outline"
              >
                Apply Suggestions
              </Button>
            </div>
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <p>Click "Generate Suggestions" to get AI-powered recommendations for improving your resume.</p>
            <p className="text-xs mt-2">Limited to one generation per minute to prevent excessive API usage.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AIResumeSuggestions; 