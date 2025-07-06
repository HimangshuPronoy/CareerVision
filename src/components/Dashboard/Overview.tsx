
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, User, MessageSquare, TrendingUp, Zap, Search, Target, BookOpen, Loader2, Briefcase } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface OverviewProps {
  userName: string;
  setActiveTab: (tab: string) => void;
}

const Overview = ({ userName, setActiveTab }: OverviewProps) => {
  const [careerData, setCareerData] = useState<any>(null);
  const [userSkills, setUserSkills] = useState<any[]>([]);
  const [marketInsights, setMarketInsights] = useState<any[]>([]);
  const [recentJobs, setRecentJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        // Load career profile
        const { data: careerData } = await (supabase as any)
          .from('career_profiles')
          .select('*')
          .eq('user_id', user.id)
          .single();
        
        setCareerData(careerData);

        // Load user skills
        const { data: skillsData } = await (supabase as any)
          .from('user_skills')
          .select('*')
          .eq('user_id', user.id)
          .limit(5);
        
        setUserSkills(skillsData || []);

        // Load market insights
        const { data: marketData } = await (supabase as any)
          .from('job_market_analytics')
          .select('*')
          .order('avg_salary', { ascending: false })
          .limit(3);
        
        setMarketInsights(marketData || []);

        // Load recent jobs
        const { data: jobsData } = await (supabase as any)
          .from('jobs')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(3);
        
        setRecentJobs(jobsData || []);
      }
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateProfileCompletion = () => {
    if (!careerData) return 25;
    
    let completion = 25; // Base for having account
    if (careerData.current_role) completion += 15;
    if (careerData.target_role) completion += 15;
    if (careerData.experience_years) completion += 10;
    if (careerData.skills && careerData.skills.length > 0) completion += 15;
    if (careerData.career_goals) completion += 10;
    if (userSkills.length > 0) completion += 10;
    
    return Math.min(completion, 100);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  const profileCompletion = calculateProfileCompletion();

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-8 text-white">
        <h1 className="text-3xl font-bold mb-2">Welcome back, {userName}! 🚀</h1>
        <p className="text-blue-100 text-lg">Ready to accelerate your career journey?</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-600 text-sm font-medium">Your Skills</p>
                <p className="text-2xl font-bold text-green-800">{userSkills.length}</p>
              </div>
              <Star className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-600 text-sm font-medium">Profile Complete</p>
                <p className="text-2xl font-bold text-blue-800">{profileCompletion}%</p>
              </div>
              <User className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-violet-50 border-purple-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-600 text-sm font-medium">Available Jobs</p>
                <p className="text-2xl font-bold text-purple-800">{recentJobs.length > 0 ? '1000+' : 'Search Now'}</p>
              </div>
              <Briefcase className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-amber-50 border-orange-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-600 text-sm font-medium">Market Insights</p>
                <p className="text-2xl font-bold text-orange-800">{marketInsights.length > 0 ? marketInsights.length : 'Available'}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Your Skills */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="h-5 w-5 text-blue-600" />
              Your Skills
            </CardTitle>
          </CardHeader>
          <CardContent>
            {userSkills.length > 0 ? (
              <div className="space-y-3">
                {userSkills.map((skill, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="font-medium">{skill.skill_name}</span>
                    <Badge variant="secondary" className="capitalize">
                      {skill.proficiency_level}
                    </Badge>
                  </div>
                ))}
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setActiveTab('skill-analysis')}
                  className="w-full mt-4"
                >
                  Manage Skills
                </Button>
              </div>
            ) : (
              <div className="text-center py-8">
                <Star className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-4">No skills added yet</p>
                <Button onClick={() => setActiveTab('skill-analysis')}>
                  Add Skills
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Market Insights */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-green-600" />
              Market Insights
            </CardTitle>
          </CardHeader>
          <CardContent>
            {marketInsights.length > 0 ? (
              <div className="space-y-4">
                {marketInsights.map((insight, index) => (
                  <div key={index} className="p-3 bg-gray-50 rounded-lg">
                    <h4 className="font-medium">{insight.skill_name}</h4>
                    <div className="text-sm text-gray-600 mt-1">
                      <p>Avg Salary: £{insight.avg_salary?.toLocaleString() || 'N/A'}</p>
                      <p>Jobs: {insight.job_count?.toLocaleString() || 'N/A'}</p>
                      {insight.growth_rate && (
                        <p className="text-green-600">Growth: +{insight.growth_rate}%</p>
                      )}
                    </div>
                  </div>
                ))}
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setActiveTab('analytics')}
                  className="w-full"
                >
                  View Full Analytics
                </Button>
              </div>
            ) : (
              <div className="text-center py-8">
                <TrendingUp className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-4">Market data loading...</p>
                <Button onClick={() => setActiveTab('analytics')}>
                  Explore Market
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-purple-600" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => setActiveTab('ai-chat')}
              >
                <MessageSquare className="h-4 w-4 mr-2" />
                Ask Career Mentor
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => setActiveTab('job-scraper')}
              >
                <Search className="h-4 w-4 mr-2" />
                Find Jobs
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => setActiveTab('career-path')}
              >
                <Target className="h-4 w-4 mr-2" />
                Plan Career Path
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => setActiveTab('learning-path')}
              >
                <BookOpen className="h-4 w-4 mr-2" />
                Learning Resources
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Jobs Preview */}
      {recentJobs.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Briefcase className="h-5 w-5 text-blue-600" />
              Recent Job Opportunities
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {recentJobs.map((job, index) => (
                <div key={index} className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                  <h4 className="font-medium text-gray-900 mb-2">{job.title}</h4>
                  <p className="text-sm text-gray-600 mb-1">{job.company}</p>
                  <p className="text-sm text-gray-500">{job.location}</p>
                  {(job.salary_min || job.salary_max) && (
                    <p className="text-sm text-green-600 font-medium mt-2">
                      £{job.salary_min?.toLocaleString()}{job.salary_max ? ` - £${job.salary_max.toLocaleString()}` : '+'}
                    </p>
                  )}
                </div>
              ))}
            </div>
            <Button 
              variant="outline" 
              onClick={() => setActiveTab('job-scraper')}
              className="w-full mt-4"
            >
              View More Jobs
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Overview;
