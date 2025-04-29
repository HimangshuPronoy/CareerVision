
import React, { useEffect, useState } from 'react';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAIInsights } from '@/hooks/useAIInsights';
import { Button } from '@/components/ui/button';
import { RefreshCw, Search } from 'lucide-react';
import CareerPathCard from '@/components/dashboard/CareerPathCard';
import { Skeleton } from '@/components/ui/skeleton';
import { Input } from '@/components/ui/input';

const CareerPaths = () => {
  const { getCareerPaths, getSpecificCareerPath, getUserProfile } = useAIInsights();
  const [careerPaths, setCareerPaths] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [specificJobTitle, setSpecificJobTitle] = useState('');
  const [specificResult, setSpecificResult] = useState(null);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    fetchGeneralPaths();
  }, []);

  const fetchGeneralPaths = async () => {
    setIsLoading(true);
    try {
      const userProfile = await getUserProfile();
      
      if (userProfile) {
        // Get AI recommended career paths
        const paths = await getCareerPaths(userProfile);
        if (paths && paths.length > 0) {
          setCareerPaths(paths);
        } else {
          // Fallback data if AI returns nothing
          setCareerPaths([
            {
              title: "Senior Frontend Developer",
              description: "Lead frontend development for web applications with focus on React and modern JavaScript frameworks.",
              matchPercentage: 85,
              skillsNeeded: ["React", "TypeScript", "UI/UX", "Testing"],
            },
            {
              title: "Full Stack Engineer",
              description: "Develop end-to-end applications with both frontend and backend technologies.",
              matchPercentage: 78,
              skillsNeeded: ["Node.js", "React", "MongoDB", "AWS"],
            },
            {
              title: "DevOps Engineer",
              description: "Implement and manage CI/CD pipelines and cloud infrastructure.",
              matchPercentage: 65,
              skillsNeeded: ["Docker", "Kubernetes", "AWS", "CI/CD"],
            },
          ]);
        }
      }
    } catch (error) {
      console.error("Error fetching career paths:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const searchSpecificCareer = async () => {
    if (!specificJobTitle.trim()) return;
    
    setIsSearching(true);
    try {
      const userProfile = await getUserProfile();
      
      if (userProfile) {
        const result = await getSpecificCareerPath(userProfile, specificJobTitle);
        setSpecificResult(result);
      }
    } catch (error) {
      console.error("Error searching for specific career:", error);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Career Paths</h1>
        <p className="text-muted-foreground">
          Explore potential career paths based on your skills and experience
        </p>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Search Specific Career Path</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2">
            <Input 
              placeholder="Enter job title (e.g., Machine Learning Engineer)" 
              value={specificJobTitle}
              onChange={(e) => setSpecificJobTitle(e.target.value)}
              className="flex-1"
            />
            <Button 
              onClick={searchSpecificCareer}
              disabled={isSearching || !specificJobTitle.trim()}
              className="flex items-center gap-2"
            >
              <Search className="h-4 w-4" />
              Search
            </Button>
          </div>
          
          {isSearching && (
            <div className="mt-4">
              <Skeleton className="h-40 w-full" />
            </div>
          )}
          
          {specificResult && !isSearching && (
            <div className="mt-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex justify-between items-center mb-2">
                    <h2 className="text-xl font-bold">{specificResult.title}</h2>
                    <div className="bg-careervision-50 dark:bg-careervision-900 text-careervision-600 dark:text-careervision-300 text-sm font-medium py-1 px-2 rounded-full">
                      {specificResult.matchPercentage}% Match
                    </div>
                  </div>
                  
                  <div className="space-y-4 mt-4">
                    <div>
                      <h3 className="font-medium mb-1">Career Path Description</h3>
                      <p className="text-sm text-muted-foreground">{specificResult.description}</p>
                    </div>
                    
                    <div>
                      <h3 className="font-medium mb-1">Skills Needed</h3>
                      <div className="flex flex-wrap gap-2">
                        {specificResult.skillsNeeded && specificResult.skillsNeeded.map((skill, index) => (
                          <div key={index} className="bg-muted text-xs px-2 py-1 rounded-full">
                            {skill}
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    {specificResult.requiredSkills && (
                      <div>
                        <h3 className="font-medium mb-1">Skills to Develop</h3>
                        <div className="flex flex-wrap gap-2">
                          {specificResult.requiredSkills.map((skill, index) => (
                            <div key={index} className="bg-insight-50 dark:bg-insight-900 text-insight-600 dark:text-insight-300 text-xs px-2 py-1 rounded-full">
                              {skill}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {specificResult.timeToAchieve && (
                      <div>
                        <h3 className="font-medium mb-1">Estimated Time to Achieve</h3>
                        <p className="text-sm">{specificResult.timeToAchieve}</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">Recommended Career Paths</h2>
          <Button 
            onClick={fetchGeneralPaths}
            disabled={isLoading}
            variant="outline"
            className="flex items-center gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
        
        {isLoading ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Skeleton className="h-64 w-full" />
            <Skeleton className="h-64 w-full" />
            <Skeleton className="h-64 w-full" />
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {careerPaths.map((path, index) => (
              <CareerPathCard
                key={index}
                title={path.title}
                description={path.description}
                matchPercentage={path.matchPercentage}
                skillsNeeded={path.skillsNeeded}
              />
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default CareerPaths;
