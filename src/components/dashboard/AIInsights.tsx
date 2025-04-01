
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAIInsights } from '@/hooks/useAIInsights';
import { Lightbulb, RefreshCw, Search } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';

const AIInsights = () => {
  const { getCareerPaths, getSpecificCareerPath, getUserProfile, loading, error } = useAIInsights();
  const { user } = useAuth();
  const [insight, setInsight] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [jobInput, setJobInput] = useState('');
  const [showJobInput, setShowJobInput] = useState(false);

  const generateInsight = async (specificJob?: string) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to get personalized career insights.",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    try {
      // Try to get user profile from database first
      let userProfile = await getUserProfile();
      console.log("Retrieved user profile for insights:", userProfile);
      
      // Fall back to mock profile if user profile is empty or incomplete
      if (!userProfile || !userProfile.skills || userProfile.skills.length === 0) {
        console.log("Using fallback data for insights - user needs to complete profile");
        setInsight("Please complete your profile with skills and experience to get personalized insights. Go to the Profile page to add your information.");
        setIsLoading(false);
        return;
      }
      
      if (specificJob) {
        // Get insight for specific job
        const jobInsight = await getSpecificCareerPath(userProfile, specificJob);
        if (jobInsight) {
          setInsight(`For a ${jobInsight.title} role, you have a ${jobInsight.matchPercentage}% match. ${jobInsight.description} To improve your chances, focus on developing these skills: ${jobInsight.requiredSkills?.join(', ')}.`);
        } else {
          setInsight(`We couldn't generate insights for a ${specificJob} role. Please try another job title.`);
        }
      } else {
        // Get general career path insights
        const paths = await getCareerPaths(userProfile);
        if (paths && paths.length > 0) {
          // Pick a random path from the returned array
          const randomPath = paths[Math.floor(Math.random() * paths.length)];
          setInsight(`Based on your profile, you have a ${randomPath.matchPercentage}% match for a ${randomPath.title} role. ${randomPath.description}`);
        } else {
          console.log("No career paths returned from API");
          setInsight("We couldn't generate career insights at this time. Please update your profile with more information about your skills and experience.");
        }
      }
    } catch (err) {
      console.error('Error generating insight:', err);
      setInsight("We encountered an error while generating career insights. Please try again later.");
    } finally {
      setIsLoading(false);
      setShowJobInput(false);
      setJobInput('');
    }
  };

  const handleSpecificJobSearch = () => {
    if (jobInput.trim()) {
      generateInsight(jobInput.trim());
    }
  };

  useEffect(() => {
    // Load initial insight
    if (user) {
      generateInsight();
    }
  }, [user]);

  return (
    <Card className="bg-gradient-to-br from-careervision-50 to-insight-50 dark:from-careervision-950 dark:to-insight-950 border-careervision-100 dark:border-careervision-800">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center">
            <Lightbulb className="mr-2 h-5 w-5 text-careervision-500" />
            AI Career Insight
          </div>
          <Button 
            size="sm" 
            variant="outline" 
            className="bg-white/50 dark:bg-gray-800/50"
            onClick={() => setShowJobInput(!showJobInput)}
          >
            <Search className="h-4 w-4 mr-1" />
            Specific Job
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="min-h-[100px] flex flex-col justify-between">
          {showJobInput ? (
            <div className="space-y-2 mb-4">
              <div className="flex gap-2">
                <Input 
                  placeholder="Enter job title (e.g. Data Scientist)" 
                  value={jobInput}
                  onChange={(e) => setJobInput(e.target.value)}
                  className="flex-1"
                />
                <Button 
                  size="sm" 
                  onClick={handleSpecificJobSearch}
                  disabled={!jobInput.trim() || isLoading}
                >
                  Search
                </Button>
              </div>
            </div>
          ) : isLoading ? (
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-[90%]" />
              <Skeleton className="h-4 w-[80%]" />
            </div>
          ) : (
            <p className="text-sm mb-4">{insight || "Generating insights based on your profile..."}</p>
          )}
          
          <Button 
            size="sm" 
            variant="outline" 
            className="w-full mt-2 flex items-center justify-center bg-white/50 dark:bg-gray-800/50"
            onClick={() => generateInsight()}
            disabled={isLoading || !user}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Generate New Insight
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default AIInsights;
