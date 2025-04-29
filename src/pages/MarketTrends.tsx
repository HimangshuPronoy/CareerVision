
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import DashboardLayout from '@/components/layouts/DashboardLayout';

const MarketTrends = () => {
  // Mock data
  const jobGrowthData = [
    { name: 'Data Science', growth: 35 },
    { name: 'Cloud Engineering', growth: 33 },
    { name: 'AI/ML Engineering', growth: 30 },
    { name: 'DevOps', growth: 28 },
    { name: 'Cybersecurity', growth: 25 },
    { name: 'Product Management', growth: 22 },
    { name: 'UX/UI Design', growth: 20 },
    { name: 'Full Stack Development', growth: 18 },
  ];

  const skillDemandData = [
    { name: 'JavaScript', demand: 90 },
    { name: 'Python', demand: 85 },
    { name: 'AWS', demand: 80 },
    { name: 'React', demand: 75 },
    { name: 'Docker', demand: 70 },
    { name: 'SQL', demand: 65 },
    { name: 'TypeScript', demand: 60 },
    { name: 'Kubernetes', demand: 55 },
  ];

  const industryGrowthData = [
    { name: '2020', 'Tech': 12, 'Healthcare': 8, 'Finance': 5, 'Education': 3 },
    { name: '2021', 'Tech': 15, 'Healthcare': 10, 'Finance': 7, 'Education': 4 },
    { name: '2022', 'Tech': 18, 'Healthcare': 13, 'Finance': 9, 'Education': 6 },
    { name: '2023', 'Tech': 22, 'Healthcare': 16, 'Finance': 11, 'Education': 8 },
    { name: '2024', 'Tech': 25, 'Healthcare': 20, 'Finance': 14, 'Education': 10 },
    { name: '2025 (Projected)', 'Tech': 30, 'Healthcare': 24, 'Finance': 17, 'Education': 12 },
  ];

  const salaryData = [
    { name: 'Data Scientist', salary: 120000 },
    { name: 'Software Engineer', salary: 110000 },
    { name: 'DevOps Engineer', salary: 115000 },
    { name: 'Product Manager', salary: 125000 },
    { name: 'UX Designer', salary: 100000 },
    { name: 'Full Stack Developer', salary: 105000 },
    { name: 'AI Engineer', salary: 130000 },
    { name: 'Cloud Architect', salary: 140000 },
  ];

  const remoteWorkData = [
    { name: 'Remote', value: 35 },
    { name: 'Hybrid', value: 45 },
    { name: 'In-office', value: 20 },
  ];

  const COLORS = ['#0088cc', '#00cc9f', '#6366f1', '#ec4899'];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Market Trends</h1>
          <p className="text-muted-foreground">
            Analyze current and projected job market trends to make informed career decisions.
          </p>
        </div>

        <div className="flex justify-between items-center">
          <div className="flex space-x-4">
            <Select defaultValue="global">
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Region" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="global">Global</SelectItem>
                <SelectItem value="north-america">North America</SelectItem>
                <SelectItem value="europe">Europe</SelectItem>
                <SelectItem value="asia-pacific">Asia Pacific</SelectItem>
              </SelectContent>
            </Select>

            <Select defaultValue="all">
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Industry" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Industries</SelectItem>
                <SelectItem value="tech">Technology</SelectItem>
                <SelectItem value="healthcare">Healthcare</SelectItem>
                <SelectItem value="finance">Finance</SelectItem>
                <SelectItem value="education">Education</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Tabs defaultValue="job-growth" className="space-y-4">
          <TabsList className="grid grid-cols-2 md:grid-cols-4 w-full">
            <TabsTrigger value="job-growth">Job Growth</TabsTrigger>
            <TabsTrigger value="skill-demand">Skill Demand</TabsTrigger>
            <TabsTrigger value="industry-growth">Industry Growth</TabsTrigger>
            <TabsTrigger value="compensation">Compensation</TabsTrigger>
          </TabsList>

          <TabsContent value="job-growth" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Fastest Growing Job Roles</CardTitle>
                <CardDescription>
                  Projected annual growth rate (%) for top job roles over the next 5 years.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={jobGrowthData}
                      layout="vertical"
                      margin={{ top: 20, right: 30, left: 60, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" domain={[0, 40]} />
                      <YAxis dataKey="name" type="category" />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="growth" name="Annual Growth (%)" fill="#0088cc" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="skill-demand" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Most In-Demand Skills</CardTitle>
                <CardDescription>
                  Demand score (0-100) for top technical skills based on job listings and employer surveys.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={skillDemandData}
                      layout="vertical"
                      margin={{ top: 20, right: 30, left: 60, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" domain={[0, 100]} />
                      <YAxis dataKey="name" type="category" />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="demand" name="Demand Score" fill="#00cc9f" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="industry-growth" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Industry Growth Trends</CardTitle>
                <CardDescription>
                  Annual growth rate (%) by industry over time, with projections for 2025.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={industryGrowthData}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="Tech" stroke="#0088cc" activeDot={{ r: 8 }} />
                      <Line type="monotone" dataKey="Healthcare" stroke="#00cc9f" />
                      <Line type="monotone" dataKey="Finance" stroke="#6366f1" />
                      <Line type="monotone" dataKey="Education" stroke="#ec4899" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="compensation" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Average Salary by Role</CardTitle>
                  <CardDescription>
                    Average annual salary (USD) for top job roles in the technology sector.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[400px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={salaryData}
                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
                        <YAxis domain={[0, 150000]} tickFormatter={(value) => `$${value / 1000}k`} />
                        <Tooltip formatter={(value) => [`$${value.toLocaleString()}`, 'Salary']} />
                        <Legend />
                        <Bar dataKey="salary" name="Average Salary" fill="#6366f1" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Work Model Distribution</CardTitle>
                  <CardDescription>
                    Distribution of remote, hybrid, and in-office job opportunities (%).
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex items-center justify-center">
                  <div className="h-[400px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={remoteWorkData}
                          cx="50%"
                          cy="50%"
                          labelLine={true}
                          outerRadius={120}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        >
                          {remoteWorkData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => [`${value}%`, 'Percentage']} />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default MarketTrends;
