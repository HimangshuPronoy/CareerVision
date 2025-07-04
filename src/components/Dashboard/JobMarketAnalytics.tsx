
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, DollarSign, Briefcase, Zap, Target, Award, Rocket } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, RadialBarChart, RadialBar } from 'recharts';
import { supabase } from "@/integrations/supabase/client";

interface MarketData {
  skill_name: string;
  avg_salary: number;
  job_count: number;
  growth_rate: number;
}

const COLORS = ['#8b5cf6', '#06b6d4', '#10b981', '#f59e0b', '#ef4444', '#ec4899'];

const JobMarketAnalytics = () => {
  const [marketData, setMarketData] = useState<MarketData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMetric, setSelectedMetric] = useState<'salary' | 'jobs' | 'growth'>('salary');

  useEffect(() => {
    loadMarketData();
  }, []);

  const loadMarketData = async () => {
    try {
      const { data } = await (supabase as any)
        .from('job_market_analytics')
        .select('*')
        .order('avg_salary', { ascending: false })
        .limit(10);
      
      setMarketData(data || []);
    } catch (error) {
      console.error('Error loading market data:', error);
    } finally {
      setLoading(false);
    }
  };

  const topSkillsBySalary = marketData.slice(0, 6);
  const growthData = marketData.filter(item => item.growth_rate > 0).slice(0, 5);
  
  const totalJobs = marketData.reduce((sum, item) => sum + item.job_count, 0);
  const avgSalary = marketData.reduce((sum, item) => sum + item.avg_salary, 0) / marketData.length;

  const pieData = topSkillsBySalary.map((item, index) => ({
    name: item.skill_name,
    value: item.job_count,
    fill: COLORS[index % COLORS.length]
  }));

  const salaryData = topSkillsBySalary.map(item => ({
    skill: item.skill_name.length > 10 ? item.skill_name.substring(0, 10) + '...' : item.skill_name,
    salary: item.avg_salary,
    jobs: item.job_count
  }));

  const radialData = topSkillsBySalary.map((item, index) => ({
    name: item.skill_name,
    value: (item.avg_salary / 150000) * 100, // Normalize to 100
    fill: COLORS[index % COLORS.length]
  }));

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
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
              <span className="text-sm">+12% this month</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-500 to-blue-700 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm">Avg Salary</p>
                <p className="text-3xl font-bold">£{Math.round(avgSalary).toLocaleString()}</p>
              </div>
              <DollarSign className="h-12 w-12 text-blue-200" />
            </div>
            <div className="mt-4 flex items-center">
              <TrendingUp className="h-4 w-4 mr-1" />
              <span className="text-sm">+8% this year</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-500 to-green-700 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm">Hot Skills</p>
                <p className="text-3xl font-bold">{growthData.length}</p>
              </div>
              <Zap className="h-12 w-12 text-green-200" />
            </div>
            <div className="mt-4 flex items-center">
              <Target className="h-4 w-4 mr-1" />
              <span className="text-sm">High growth</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-500 to-orange-700 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100 text-sm">Market Score</p>
                <p className="text-3xl font-bold">92</p>
              </div>
              <Award className="h-12 w-12 text-orange-200" />
            </div>
            <div className="mt-4 flex items-center">
              <Rocket className="h-4 w-4 mr-1" />
              <span className="text-sm">Excellent</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Salary Bar Chart */}
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
                  fill="url(#salaryGradient)"
                  radius={[4, 4, 0, 0]}
                />
                <defs>
                  <linearGradient id="salaryGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#8b5cf6" />
                    <stop offset="100%" stopColor="#a855f7" />
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Job Distribution Pie Chart */}
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
      </div>

      {/* Radial Chart - TikTok Eye-Candy */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-purple-600" />
            Skill Power Rankings
            <Badge className="ml-2 bg-gradient-to-r from-purple-500 to-pink-500">
              🔥 TikTok Ready
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <RadialBarChart
              cx="50%"
              cy="50%"
              innerRadius="20%"
              outerRadius="80%"
              data={radialData}
              startAngle={90}
              endAngle={-270}
            >
              <RadialBar
                label={{ position: 'insideStart', fill: '#fff', fontSize: 14 }}
                background
                dataKey="value"
              />
              <Tooltip 
                formatter={(value: any) => [`${value.toFixed(1)}%`, 'Market Score']}
              />
            </RadialBarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Growth Leaders */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-green-600" />
            🚀 Fastest Growing Skills
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {growthData.map((skill, index) => (
              <Card key={index} className="relative overflow-hidden bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
                <CardContent className="p-4">
                  <div className="text-center">
                    <h4 className="font-bold text-lg text-gray-900">{skill.skill_name}</h4>
                    <div className="mt-2">
                      <span className="text-2xl font-bold text-green-600">
                        +{skill.growth_rate.toFixed(1)}%
                      </span>
                    </div>
                    <div className="mt-2 text-sm text-gray-600">
                      {skill.job_count.toLocaleString()} jobs
                    </div>
                    <div className="mt-1 text-sm font-medium text-green-700">
                      £{skill.avg_salary.toLocaleString()}
                    </div>
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
    </div>
  );
};

export default JobMarketAnalytics;
