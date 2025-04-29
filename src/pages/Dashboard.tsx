import { useEffect, useState } from 'react';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import StatsCard from '@/components/dashboard/StatsCard';
import SkillsRadarChart from '@/components/dashboard/SkillsRadarChart';
import TrendingJobsChart from '@/components/dashboard/TrendingJobsChart';
import CareerPathCard from '@/components/dashboard/CareerPathCard';
import RecommendedSkills from '@/components/dashboard/RecommendedSkills';
import IndustryTrendsCard from '@/components/dashboard/IndustryTrendsCard';
import AIInsights from '@/components/dashboard/AIInsights';
import ResumeBuilder from '@/components/resume/ResumeBuilder';
import { Award, TrendingUp, BarChart2, GraduationCap } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useAIInsights } from '@/hooks/useAIInsights';
import { toast } from '@/components/ui/use-toast';

interface UserProfileType {
  skills?: string[];
  experience?: number;
  jobTitle?: string;
  industry?: string;
  education?: string;
  interests?: string[];
  location?: string;
  full_name?: string;
}

interface CareerPath {
  title: string;
  description: string;
  matchPercentage: number;
  skillsNeeded: string[];
}

interface SkillData {
  skill: string;
  userScore: number;
  marketDemand: number;
}

interface TrendingJob {
  name: string;
  growthRate: number;
  averageSalary: number;
}

interface IndustryTrend {
  name: string;
  Technology: number;
  Healthcare: number;
  Finance: number;
  Education: number;
  [key: string]: string | number;
}

const Dashboard = () => {
  const { user } = useAuth();
  const { getSkillRecommendations, getCareerPaths, getUserProfile } = useAIInsights();
  const [userProfile, setUserProfile] = useState<UserProfileType>({});
  const [recommendedSkills, setRecommendedSkills] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [skillsData, setSkillsData] = useState<SkillData[]>([
    { skill: "Add your skills", userScore: 50, marketDemand: 50 }
  ]);

  const trendingJobsData: TrendingJob[] = [
    { name: "Data Scientist", growthRate: 35, averageSalary: 120 },
    { name: "DevOps Engineer", growthRate: 30, averageSalary: 115 },
    { name: "ML Engineer", growthRate: 28, averageSalary: 130 },
    { name: "Full Stack Dev", growthRate: 25, averageSalary: 110 },
    { name: "Product Manager", growthRate: 22, averageSalary: 125 },
  ];

  const industryTrendsData: IndustryTrend[] = [
    { name: "2019", Technology: 15, Healthcare: 10, Finance: 8, Education: 5 },
    { name: "2020", Technology: 18, Healthcare: 15, Finance: 10, Education: 7 },
    { name: "2021", Technology: 25, Healthcare: 20, Finance: 15, Education: 12 },
    { name: "2022", Technology: 30, Healthcare: 25, Finance: 18, Education: 15 },
    { name: "2023", Technology: 35, Healthcare: 30, Finance: 22, Education: 18 },
    { name: "2024 (Projected)", Technology: 40, Healthcare: 35, Finance: 25, Education: 22 },
  ];

  useEffect(() => {
    const fetchUserData = async () => {
      if (!user) return;
      
      try {
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (profileError) throw profileError;
        setUserProfile(profile || {});

        // Fetch other dashboard data...
        setIsLoading(false);
      } catch (err) {
        console.error('Error fetching user data:', err);
        setError('Failed to load user data. Please refresh the page.');
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [user]);

  return (
    <DashboardLayout>
      <div className="container mx-auto p-6 space-y-6">
        <DashboardHeader userName={userProfile.full_name || 'User'} />

        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-4 rounded-lg text-red-600 dark:text-red-400">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard
            title="Profile Strength"
            value={userProfile?.skills?.length ? `${Math.min(userProfile.skills.length * 10, 100)}%` : "0%"}
            icon={<Award className="h-4 w-4" />}
            description="Complete your profile to improve matches"
          />
          <StatsCard
            title="Industry Growth"
            value="+12.5%"
            icon={<TrendingUp className="h-4 w-4" />}
            description="Tech industry growth rate"
          />
          <StatsCard
            title="Skills in Demand"
            value={userProfile?.skills?.length || "0"}
            icon={<BarChart2 className="h-4 w-4" />}
            description="Skills matching current trends"
          />
          <StatsCard
            title="Career Readiness"
            value={userProfile?.experience ? "Ready" : "In Progress"}
            icon={<GraduationCap className="h-4 w-4" />}
            description="Based on your profile completion"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <AIInsights />
          <CareerPathCard 
            title="Recommended Path"
            description="Complete your profile to get personalized career path recommendations"
            matchPercentage={0}
            skillsNeeded={["Update your profile"]}
          />
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

        <div className="mb-6">
          <ResumeBuilder />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
