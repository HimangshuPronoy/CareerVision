
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { TrendingUp, DollarSign, Briefcase, Zap, Target, Award, Rocket, Search, RefreshCw } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, RadialBarChart, RadialBar } from 'recharts';
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface MarketData {
  skill_name: string;
  avg_salary: number;
  job_count: number;
  growth_rate: number;
}

interface JobData {
  title: string;
  company: string;
  location: string;
  salary_min: number;
  salary_max: number;
  posted_date: string;
}

const COLORS = ['#8b5cf6', '#06b6d4', '#10b981', '#f59e0b', '#ef4444', '#ec4899'];

const JobMarketAnalytics = () => {
  const [marketData, setMarketData] = useState<MarketData[]>([]);
  const [recentJobs, setRecentJobs] = useState<JobData[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchSkill, setSearchSkill] = useState('');
  const [searchLocation, setSearchLocation] = useState('london');

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    setLoading(true);
    await Promise.all([
      loadMarketData(),
      loadRecentJobs()
    ]);
    setLoading(false);
  };

  const loadMarketData = async () => {
    try {
      const { data } = await supabase
        .from('job_market_analytics')
        .select('*')
        .order('avg_salary', { ascending: false })
        .limit(10);
      
      console.log('Market data loaded:', data);
      setMarketData(data || []);
    } catch (error) {
      console.error('Error loading market data:', error);
      toast.error('Failed to load market data');
    }
  };

  const loadRecentJobs = async () => {
    try {
      const { data } = await supabase
        .from('jobs')
        .select('title, company, location, salary_min, salary_max, posted_date')
        .order('created_at', { ascending: false })
        .limit(20);
      
      console.log('Recent jobs loaded:', data);
      setRecentJobs(data || []);
    } catch (error) {
      console.error('Error loading recent jobs:', error);
      toast.error('Failed to load recent jobs');
    }
  };

  const analyzeSkill = async () => {
    if (!searchSkill.trim()) {
      toast.error('Please enter a skill to analyze');
      return;
    }

    setRefreshing(true);
    try {
      const { data, error } = await supabase.functions.invoke('job-market-analytics', {
        body: { 
          skill_name: searchSkill.trim(),
          region: 'UK'
        }
      });

      if (error) throw error;

      if (data?.success) {
        toast.success(`Analysis complete for ${searchSkill}`);
        await loadMarketData();
      } else {
        throw new Error(data?.error || 'Analysis failed');
      }
    } catch (error) {
      console.error('Error analyzing skill:', error);
      toast.error('Failed to analyze skill. Please try again.');
    } finally {
      setRefreshing(false);
    }
  };

  const scrapeJobs = async () => {
    if (!searchSkill.trim()) {
      toast.error('Please enter a skill/job title to search');
      return;
    }

    setRefreshing(true);
    try {
      const { data, error } = await supabase.functions.invoke('adzuna-job-scraper', {
        body: { 
          what: searchSkill.trim(),
          where: searchLocation.trim(),
          results_per_page: 50
        }
      });

      if (error) throw error;

      if (data?.success) {
        toast.success(`Found ${data.jobs?.length || 0} new jobs`);
        await loadRecentJobs();
      } else {
        throw new Error(data?.error || 'Job scraping failed');
      }
    } catch (error) {
      console.error('Error scraping jobs:', error);
      toast.error('Failed to scrape jobs. Please try again.');
    } finally {
      setRefreshing(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <div className="flex items-center justify-center h-64">
          <RefreshCw className="h-8 w-8 animate-spin text-blue-600" />
          <span className="ml-2 text-lg">Loading market data...</span>
        </div>
      </div>
    );
  }

  const topSkillsBySalary = marketData.filter(item => item.avg_salary && item.avg_salary > 0).slice(0, 6);
  const hotSkills = marketData.filter(item => item.growth_rate && item.growth_rate > 5).slice(0, 5);
  
  const totalJobs = marketData.reduce((sum, item) => sum + (item.job_count || 0), 0);
  const validSalaries = marketData.filter(item => item.avg_salary && item.avg_salary > 0);
  const avgSalary = validSalaries.length > 0 ? validSalaries.reduce((sum, item) => sum + item.avg_salary, 0) / validSalaries.length : 0;

  const pieData = topSkillsBySalary.map((item, index) => ({
    name: item.skill_name,
    value: item.job_count || 0,
    fill: COLORS[index % COLORS.length]
  }));

  const salaryData = topSkillsBySalary.map(item => ({
    skill: item.skill_name.length > 10 ? item.skill_name.substring(0, 10) + '...' : item.skill_name,
    salary: item.avg_salary || 0,
    jobs: item.job_count || 0
  }));

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Search and Analysis Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5 text-blue-600" />
            Market Research Tools
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="skill">Skill/Job Title</Label>
              <Input
                id="skill"
                value={searchSkill}
                onChange={(e) => setSearchSkill(e.target.value)}
                placeholder="e.g., React Developer, Data Scientist"
              />
            </div>
            <div>
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={searchLocation}
                onChange={(e) => setSearchLocation(e.target.value)}
                placeholder="e.g., London, Manchester"
              />
            </div>
            <div className="flex items-end gap-2">
              <Button 
                onClick={analyzeSkill} 
                disabled={refreshing}
                className="flex-1"
              >
                {refreshing ? <RefreshCw className="h-4 w-4 animate-spin mr-2" /> : <Target className="h-4 w-4 mr-2" />}
                Analyze Market
              </Button>
              <Button 
                onClick={scrapeJobs} 
                disabled={refreshing}
                variant="outline"
                className="flex-1"
              >
                {refreshing ? <RefreshCw className="h-4 w-4 animate-spin mr-2" /> : <Search className="h-4 w-4 mr-2" />}
                Find Jobs
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Hero Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-purple-500 to-purple-700 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm">Total Jobs</p>
                <p className="text-3xl font-bold">{totalJobs.toLocaleString()}</p>
              </div>
              <Briefcase className="h-12 w-12 text-purple-200" />
            </div>
            <div className="mt-4 flex items-center">
              <TrendingUp className="h-4 w-4 mr-1" />
              <span className="text-sm">Live data from {recentJobs.length} recent posts</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-500 to-blue-700 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm">Avg Salary</p>
                <p className="text-3xl font-bold">
                  {avgSalary > 0 ? `£${Math.round(avgSalary).toLocaleString()}` : '£0'}
                </p>
              </div>
              <DollarSign className="h-12 w-12 text-blue-200" />
            </div>
            <div className="mt-4 flex items-center">
              <TrendingUp className="h-4 w-4 mr-1" />
              <span className="text-sm">Based on {validSalaries.length} analyzed skills</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-500 to-green-700 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm">Hot Skills</p>
                <p className="text-3xl font-bold">{hotSkills.length}</p>
              </div>
              <Zap className="h-12 w-12 text-green-200" />
            </div>
            <div className="mt-4 flex items-center">
              <Target className="h-4 w-4 mr-1" />
              <span className="text-sm">High growth potential</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-500 to-orange-700 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100 text-sm">Market Score</p>
                <p className="text-3xl font-bold">{marketData.length > 0 ? '92' : '--'}</p>
              </div>
              <Award className="h-12 w-12 text-orange-200" />
            </div>
            <div className="mt-4 flex items-center">
              <Rocket className="h-4 w-4 mr-1" />
              <span className="text-sm">{marketData.length > 0 ? 'Excellent' : 'Analyze skills to see score'}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {marketData.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <Target className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Market Data Yet</h3>
            <p className="text-gray-600 mb-6">Use the search tools above to analyze skills and discover market insights.</p>
            <Button onClick={() => setSearchSkill('React Developer')}>
              Try Sample Analysis
            </Button>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Salary Bar Chart */}
            {topSkillsBySalary.length > 0 && (
              <Card className="col-span-1">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <DollarSign className="h-5 w-5 text-green-600" />
                    Top Skills by Salary
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={salaryData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis 
                        dataKey="skill" 
                        tick={{ fontSize: 12 }}
                        angle={-45}
                        textAnchor="end"
                        height={60}
                      />
                      <YAxis 
                        tick={{ fontSize: 12 }}
                        tickFormatter={(value) => `£${(value / 1000).toFixed(0)}k`}
                      />
                      <Tooltip 
                        formatter={(value: any) => [`£${value.toLocaleString()}`, 'Salary']}
                        labelStyle={{ color: '#374151' }}
                      />
                      <Bar 
                        dataKey="salary" 
                        fill="#8b5cf6"
                        radius={[4, 4, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            )}

            {/* Job Distribution Pie Chart */}
            {pieData.length > 0 && (
              <Card className="col-span-1">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Briefcase className="h-5 w-5 text-blue-600" />
                    Job Distribution
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={120}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                      </Pie>
                      <Tooltip 
                        formatter={(value: any) => [value.toLocaleString(), 'Jobs']}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="grid grid-cols-2 gap-2 mt-4">
                    {pieData.map((entry, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <div 
                          className="w-3 h-3 rounded-full" 
                          style={{ backgroundColor: entry.fill }}
                        />
                        <span className="text-sm text-gray-600">{entry.name}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Hot Skills Section */}
          {hotSkills.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-green-600" />
                  🔥 Hottest Growing Skills
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
                  {hotSkills.map((skill, index) => (
                    <Card key={index} className="relative overflow-hidden bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
                      <CardContent className="p-4">
                        <div className="text-center">
                          <h4 className="font-bold text-lg text-gray-900 mb-2">{skill.skill_name}</h4>
                          <div className="mb-2">
                            <span className="text-2xl font-bold text-green-600">
                              +{skill.growth_rate?.toFixed(1)}%
                            </span>
                          </div>
                          <div className="text-sm text-gray-600 mb-1">
                            {(skill.job_count || 0).toLocaleString()} jobs
                          </div>
                          {skill.avg_salary && skill.avg_salary > 0 && (
                            <div className="text-sm font-medium text-green-700">
                              £{skill.avg_salary.toLocaleString()}
                            </div>
                          )}
                        </div>
                        <div className="absolute top-2 right-2">
                          <Rocket className="h-4 w-4 text-green-500" />
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </>
      )}

      {/* Recent Jobs Section */}
      {recentJobs.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Briefcase className="h-5 w-5 text-blue-600" />
              Recent Job Postings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {recentJobs.slice(0, 10).map((job, index) => (
                <div key={index} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900">{job.title}</h4>
                      <p className="text-sm text-gray-600">{job.company}</p>
                      <p className="text-sm text-gray-500">{job.location}</p>
                    </div>
                    <div className="text-right">
                      {job.salary_min && job.salary_max && (
                        <p className="font-medium text-green-600">
                          £{job.salary_min.toLocaleString()} - £{job.salary_max.toLocaleString()}
                        </p>
                      )}
                      <p className="text-xs text-gray-400">
                        {job.posted_date ? new Date(job.posted_date).toLocaleDateString() : 'Recently posted'}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default JobMarketAnalytics;
