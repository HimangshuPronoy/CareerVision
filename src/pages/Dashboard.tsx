import React, { useEffect, useState } from 'react';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import StatsCard from '@/components/dashboard/StatsCard';
import SkillsRadarChart from '@/components/dashboard/SkillsRadarChart';
import TrendingJobsChart from '@/components/dashboard/TrendingJobsChart';
import CareerPathCard from '@/components/dashboard/CareerPathCard';
import RecommendedSkills from '@/components/dashboard/RecommendedSkills';
import IndustryTrendsCard from '@/components/dashboard/IndustryTrendsCard';
import AIInsights from '@/components/dashboard/AIInsights';
import { Award, TrendingUp, BarChart2, GraduationCap } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useAIInsights } from '@/hooks/useAIInsights';
import { useGeminiInsights } from '@/hooks/useGeminiInsights';
import { toast } from '@/components/ui/use-toast';
import { useNavigate } from 'react-router-dom';

interface UserProfileType {
  skills?: string[];
  experience?: number;
  jobTitle?: string;
  industry?: string;
  education?: string;
  interests?: string[];
  location?: string;
  [key: string]: any;
}

const Dashboard = () => {
  const { user } = useAuth();
  const { getSkillRecommendations, getCareerPaths, getUserProfile } = useAIInsights();
  const { getInsights } = useGeminiInsights();
  const [userName, setUserName] = useState('User');
  const [careerPaths, setCareerPaths] = useState([]);
  const [recommendedSkills, setRecommendedSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [skillMatchScore, setSkillMatchScore] = useState(0);
  const [careerOpportunities, setCareerOpportunities] = useState(0);
  const [industryGrowthRate, setIndustryGrowthRate] = useState(0);
  const [userProfile, setUserProfile] = useState<UserProfileType | null>(null);
  const navigate = useNavigate();
  
  // Default skill data (will be replaced with real data when available)
  const [skillsData, setSkillsData] = useState([
    { skill: "Add your skills", userScore: 50, marketDemand: 50 }
  ]);

  const trendingJobsData = [
    { name: "Data Scientist", growthRate: 35, averageSalary: 120 },
    { name: "DevOps Engineer", growthRate: 30, averageSalary: 115 },
    { name: "ML Engineer", growthRate: 28, averageSalary: 130 },
    { name: "Full Stack Dev", growthRate: 25, averageSalary: 110 },
    { name: "Product Manager", growthRate: 22, averageSalary: 125 },
  ];

  const industryTrendsData = [
    { name: "2019", "Technology": 15, "Healthcare": 10, "Finance": 8, "Education": 5 },
    { name: "2020", "Technology": 18, "Healthcare": 15, "Finance": 10, "Education": 7 },
    { name: "2021", "Technology": 25, "Healthcare": 20, "Finance": 15, "Education": 12 },
    { name: "2022", "Technology": 30, "Healthcare": 25, "Finance": 18, "Education": 15 },
    { name: "2023", "Technology": 35, "Healthcare": 30, "Finance": 22, "Education": 18 },
    { name: "2024 (Projected)", "Technology": 40, "Healthcare": 35, "Finance": 25, "Education": 22 },
  ];

  // Calculate statistics based on user profile
  const calculateStats = async (userProfile: UserProfileType | null, paths: any[], recommendations: any[]) => {
    if (!userProfile) {
      setSkillMatchScore(0);
      setCareerOpportunities(0);
      setIndustryGrowthRate(10.5); // Default growth rate
      return;
    }

    // Calculate skill match score (0-100)
    const hasSkills = userProfile.skills && userProfile.skills.length > 0;
    
    // If we have career paths with match percentages, use the highest as skill match score
    if (paths && paths.length > 0) {
      const highestMatch = Math.max(...paths.map(path => path.matchPercentage));
      setSkillMatchScore(highestMatch);
    } else if (hasSkills) {
      // If we have skills but no paths, estimate based on number of skills
      const skillCount = userProfile.skills.length;
      const estimatedScore = Math.min(Math.max(50 + (skillCount * 5), 30), 95);
      setSkillMatchScore(estimatedScore);
    } else {
      setSkillMatchScore(0);
    }
    
    // Calculate available positions based on skills and industry
    if (hasSkills) {
      // Base positions from skills (each skill typically has 5-8 positions)
      const basePositions = userProfile.skills.length * 6;
      
      // Industry multipliers for different sectors
      const industryMultipliers: { [key: string]: number } = {
        'Technology': 2.0,
        'Healthcare': 1.8,
        'Finance': 1.6,
        'Education': 1.4,
        'Manufacturing': 1.3,
        'Retail': 1.2,
        'Other': 1.0
      };
      
      // Calculate total positions with industry multiplier
      const multiplier = industryMultipliers[userProfile.industry || 'Other'];
      const totalPositions = Math.round(basePositions * multiplier);
      setCareerOpportunities(totalPositions);

      // Set industry growth rate based on industry
      const industryGrowthRates: { [key: string]: number } = {
        'Technology': 15.8,
        'Healthcare': 14.3,
        'Finance': 10.5,
        'Education': 8.2,
        'Manufacturing': 6.7,
        'Retail': 5.9,
        'Other': 7.5
      };
      
      setIndustryGrowthRate(industryGrowthRates[userProfile.industry || 'Other']);
    } else {
      setCareerOpportunities(0);
      setIndustryGrowthRate(7.5); // Default growth rate
    }
  };

  // Fetch user profile data and career recommendations on component mount
  useEffect(() => {
    const fetchUserData = async () => {
      if (!user) return;

      setLoading(true);
      try {
        // Fetch user profile
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (profileError) throw profileError;
        
        // Set user name from profile data
        if (profileData && profileData.full_name) {
          setUserName(profileData.full_name);
        } else {
          setUserName(user.email.split('@')[0]);
        }

        // Fetch user settings and skills
        const fetchedProfile = await getUserProfile();
        setUserProfile(fetchedProfile);
        
        if (!fetchedProfile) {
          setLoading(false);
          return;
        }
        
        let fetchedPaths = [];
        let fetchedRecommendations = [];
        
        // Only fetch insights if we have skills
        if (fetchedProfile.skills && fetchedProfile.skills.length > 0) {
          // Transform user skills into the format needed for the radar chart
          const formattedSkills = fetchedProfile.skills.slice(0, 6).map(skill => {
            // Generate a random user score and market demand for visualization
            const userScore = Math.floor(Math.random() * 40) + 40; // 40-80
            const marketDemand = Math.floor(Math.random() * 30) + 60; // 60-90
            return {
              skill,
              userScore,
              marketDemand,
            };
          });
          
          if (formattedSkills.length > 0) {
            setSkillsData(formattedSkills);
          }
          
          // Get skill recommendations from AI
          const recommendationData = await getSkillRecommendations(fetchedProfile);
          if (recommendationData && recommendationData.length > 0) {
            setRecommendedSkills(recommendationData);
            fetchedRecommendations = recommendationData;
          }
          
          // Get career paths from AI
          const pathsData = await getCareerPaths(fetchedProfile);
          if (pathsData && pathsData.length > 0) {
            setCareerPaths(pathsData);
            fetchedPaths = pathsData;
          }
          
          // Calculate statistics based on actual data
          calculateStats(fetchedProfile, fetchedPaths, fetchedRecommendations);
        } else {
          // Reset to default values if no skills
          setSkillsData([{ skill: "Add your skills", userScore: 50, marketDemand: 50 }]);
          calculateStats({skills: []}, [], []);
        }

      } catch (error) {
        console.error("Error fetching user data:", error);
        toast({
          title: "Error",
          description: "Failed to load your profile data. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [user, getUserProfile, getCareerPaths, getSkillRecommendations]);

  const handleViewCareerPath = (path: any) => {
    // Navigate to career paths page with the selected path
    navigate('/career-paths', { state: { selectedPath: path } });
  };

  return (
    <DashboardLayout>
      <DashboardHeader userName={userName} />
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        <StatsCard 
          title="Skill Match Score" 
          value={`${skillMatchScore}%`} 
          change={5} 
          icon={<Award className="h-5 w-5 text-careervision-500" />} 
          description="Your skills match with market demand"
        />
        <StatsCard 
          title="Available Positions" 
          value={careerOpportunities.toString() + "+"} 
          change={3} 
          icon={<TrendingUp className="h-5 w-5 text-insight-500" />} 
          description="Open positions matching your skills"
        />
        <StatsCard 
          title="Industry Growth Rate" 
          value={`${industryGrowthRate}%`} 
          change={2.1} 
          icon={<BarChart2 className="h-5 w-5 text-careervision-500" />} 
          description={userProfile?.industry || "Technology"} 
        />
      </div>
      
      <div className="mb-6">
        <AIInsights />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <SkillsRadarChart data={skillsData} />
        <TrendingJobsChart data={trendingJobsData} />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {careerPaths && careerPaths.length > 0 ? (
          careerPaths.map((path, index) => (
            <CareerPathCard 
              key={index}
              title={path.title} 
              description={path.description} 
              matchPercentage={path.matchPercentage} 
              skillsNeeded={path.skillsNeeded}
              onViewDetails={() => handleViewCareerPath(path)}
            />
          ))
        ) : (
          <>
            <CareerPathCard 
              title="Add Skills to See Matches" 
              description="Update your skills profile to get personalized career path recommendations." 
              matchPercentage={0} 
              skillsNeeded={["Update your profile"]}
              onViewDetails={() => navigate('/profile')}
            />
            <CareerPathCard 
              title="Complete Your Profile" 
              description="Fill in your education, experience, and industry to improve career matching." 
              matchPercentage={0} 
              skillsNeeded={["Go to Profile"]}
              onViewDetails={() => navigate('/profile')}
            />
            <CareerPathCard 
              title="Explore Career Paths" 
              description="Visit the Career Paths page to explore options and test specific job matches." 
              matchPercentage={0} 
              skillsNeeded={["Visit Career Paths"]}
              onViewDetails={() => navigate('/career-paths')}
            />
          </>
        )}
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <IndustryTrendsCard data={industryTrendsData} industries={["Technology", "Healthcare", "Finance", "Education"]} />
        <RecommendedSkills skills={recommendedSkills.length > 0 ? recommendedSkills : [
          {
            name: "Add Skills to Your Profile",
            demandScore: 0,
            growthRate: 0,
            relevanceScore: 0,
            resources: [
              { title: "Update Your Profile", url: "/profile" },
              { title: "Explore Skills Analysis", url: "/skills" },
            ],
          }
        ]} />
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
