
import React, { useEffect, useState } from 'react';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAIInsights } from '@/hooks/useAIInsights';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';
import SkillsRadarChart from '@/components/dashboard/SkillsRadarChart';
import RecommendedSkills from '@/components/dashboard/RecommendedSkills';
import { Skeleton } from '@/components/ui/skeleton';
import SkillsInput from '@/components/profile/SkillsInput';

const Skills = () => {
  const { getSkillRecommendations, getUserProfile, saveUserSkills, loading: insightsLoading } = useAIInsights();
  const [skillsData, setSkillsData] = useState<any[]>([]);
  const [recommendedSkills, setRecommendedSkills] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [userSkills, setUserSkills] = useState<string[]>([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const userProfile = await getUserProfile();
      
      if (userProfile) {
        console.log("User profile loaded:", userProfile);
        
        // Set user skills
        setUserSkills(userProfile.skills || []);
        
        // Transform skills for the radar chart if we have skills
        if (userProfile.skills && userProfile.skills.length > 0) {
          const formattedSkills = userProfile.skills.slice(0, 6).map(skill => {
            // Generate a score and demand for visualization
            const userScore = Math.floor(Math.random() * 40) + 40; // 40-80
            const marketDemand = Math.floor(Math.random() * 30) + 60; // 60-90
            return {
              skill,
              userScore,
              marketDemand,
            };
          });
          
          setSkillsData(formattedSkills);
          
          // Get AI recommendations if we have skills
          const recommendations = await getSkillRecommendations(userProfile);
          if (recommendations && recommendations.length > 0) {
            setRecommendedSkills(recommendations);
          }
        } else {
          console.log("No skills found in user profile");
        }
      } else {
        console.log("No user profile found");
      }
    } catch (error) {
      console.error("Error fetching skills data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSkillsChange = async (newSkills: string[]) => {
    setUserSkills(newSkills);
    await saveUserSkills(newSkills);
    // Refresh data after skills are updated
    fetchData();
  };

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Skills Analysis</h1>
        <p className="text-muted-foreground">
          Analyze your current skills and discover what to learn next
        </p>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>My Skills</CardTitle>
        </CardHeader>
        <CardContent>
          <SkillsInput initialSkills={userSkills} onChange={handleSkillsChange} />
        </CardContent>
      </Card>

      <div className="mb-6">
        <Button 
          onClick={fetchData}
          disabled={isLoading || userSkills.length === 0}
          className="flex items-center gap-2"
        >
          <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          {userSkills.length === 0 ? 'Add skills above to analyze' : 'Refresh Analysis'}
        </Button>
      </div>

      {userSkills.length === 0 ? (
        <Card className="bg-muted/50 border-dashed border-2 mb-6">
          <CardContent className="flex flex-col items-center justify-center p-6">
            <p className="text-center text-muted-foreground mt-4">
              Please add some skills above to see your skills analysis and get recommendations
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {isLoading ? (
            <Card>
              <CardHeader>
                <CardTitle>Skills Radar</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80 flex items-center justify-center">
                  <Skeleton className="h-full w-full" />
                </div>
              </CardContent>
            </Card>
          ) : (
            <SkillsRadarChart data={skillsData.length > 0 ? skillsData : [
              { skill: "Add your skills", userScore: 50, marketDemand: 50 },
            ]} />
          )}

          {isLoading ? (
            <Card>
              <CardHeader>
                <CardTitle>Recommended Skills</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80 flex items-center justify-center">
                  <Skeleton className="h-full w-full" />
                </div>
              </CardContent>
            </Card>
          ) : (
            <RecommendedSkills skills={recommendedSkills.length > 0 ? recommendedSkills : [
              {
                name: "Add more skills to get personalized recommendations",
                demandScore: 50,
                growthRate: 0,
                relevanceScore: 50,
                resources: [
                  { title: "Update your profile", url: "/profile" },
                ],
              },
            ]} />
          )}
        </div>
      )}
    </DashboardLayout>
  );
};

export default Skills;
