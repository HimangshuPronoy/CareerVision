
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageCircle, Send, Bot, User, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

const AICareerChat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [careerProfile, setCareerProfile] = useState<any>(null);
  const [userSkills, setUserSkills] = useState<any[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    loadUserData();
    // Add enhanced welcome message
    setMessages([{
      id: '1',
      content: `Hi! I'm your AI Career Mentor for CareerVision. I can help you with:

🎯 **Career Planning** - Create personalized career paths and set goals
📊 **Skill Analysis** - Analyze your skills and find gaps in the market
💼 **Job Search** - Use our job scraper to find opportunities and get application tips  
📚 **Learning Paths** - Get customized learning recommendations
📈 **Market Insights** - Understand salary trends and job market analytics
✍️ **Resume Building** - Optimize your career profile and resume

I have access to all CareerVision features, so I can guide you through using any part of the platform. What would you like to work on today?`,
      sender: 'ai',
      timestamp: new Date()
    }]);
  }, []);

  const loadUserData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        // Load career profile
        const { data: profile } = await (supabase as any)
          .from('career_profiles')
          .select('*')
          .eq('user_id', user.id)
          .single();
        
        setCareerProfile(profile);

        // Load user skills
        const { data: skills } = await (supabase as any)
          .from('user_skills')
          .select('*')
          .eq('user_id', user.id);
        
        setUserSkills(skills || []);
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      // Enhanced context with CareerVision awareness
      const careerVisionFeatures = `
      Available CareerVision Features:
      - Job Scraper: Search and analyze job opportunities from real job boards
      - Market Analytics: View salary trends, job counts, and growth rates for different skills
      - Skill Analysis: Add skills, get proficiency assessments, and market insights
      - Career Path Planning: Create step-by-step career progression plans
      - Learning Path Creation: Get structured learning recommendations
      - Resume Builder: Build and optimize professional profiles
      - Task Tracker: Manage career development tasks and goals
      
      User's Current Data:
      - Profile Status: ${careerProfile ? 'Complete' : 'Incomplete - suggest they complete their profile in the Resume Builder tab'}
      - Skills Count: ${userSkills.length} skills registered
      - Current Role: ${careerProfile?.current_role || 'Not specified'}
      - Target Role: ${careerProfile?.target_role || 'Not specified'}
      - Experience: ${careerProfile?.experience_years || 0} years
      - Skills: ${userSkills.map(s => s.skill_name).join(', ') || 'None added yet'}
      
      IMPORTANT: Always guide users to use CareerVision's built-in features rather than external resources. For example:
      - For job search: Direct them to the Job Scraper tab
      - For salary research: Guide them to Market Analytics
      - For skill assessment: Use the Skill Analysis feature
      - For learning: Create Learning Paths within the platform
      `;

      const { data, error } = await supabase.functions.invoke('openrouter-ai', {
        body: {
          prompt: `${input}

Please provide guidance using CareerVision's features and capabilities. Always suggest using the platform's tools first before recommending external resources.`,
          type: 'mentor',
          context: careerVisionFeatures
        }
      });

      if (error) {
        throw error;
      }

      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: data.response?.content || data.response || 'I apologize, but I encountered an error. Please try again.',
        sender: 'ai',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiResponse]);
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Error",
        description: "Failed to get AI response. Please check your OpenRouter API key and try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <Card className="h-[600px] flex flex-col">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5 text-blue-600" />
            AI Career Mentor - CareerVision Assistant
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col">
          <ScrollArea className="flex-1 pr-4">
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex items-start gap-3 ${
                    message.sender === 'user' ? 'flex-row-reverse' : ''
                  }`}
                >
                  <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                    message.sender === 'user' 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-100 text-gray-600'
                  }`}>
                    {message.sender === 'user' ? (
                      <User className="h-4 w-4" />
                    ) : (
                      <Bot className="h-4 w-4" />
                    )}
                  </div>
                  <div className={`max-w-[80%] p-3 rounded-lg ${
                    message.sender === 'user'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-900'
                  }`}>
                    <p className="whitespace-pre-wrap">{message.content}</p>
                    <p className={`text-xs mt-1 ${
                      message.sender === 'user' ? 'text-blue-100' : 'text-gray-500'
                    }`}>
                      {message.timestamp.toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center">
                    <Bot className="h-4 w-4" />
                  </div>
                  <div className="bg-gray-100 p-3 rounded-lg">
                    <Loader2 className="h-4 w-4 animate-spin" />
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>
          <div className="flex gap-2 mt-4">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask me about CareerVision features, job search, skills, or career planning..."
              disabled={loading}
            />
            <Button onClick={sendMessage} disabled={loading || !input.trim()}>
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AICareerChat;
