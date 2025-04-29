
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

interface TrendingJobsChartProps {
  data: {
    name: string;
    growthRate: number;
    averageSalary: number;
  }[];
}

const TrendingJobsChart = ({ data }: TrendingJobsChartProps) => {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Trending Job Roles</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis yAxisId="left" orientation="left" stroke="#0088cc" />
              <YAxis yAxisId="right" orientation="right" stroke="#00cc9f" />
              <Tooltip />
              <Legend />
              <Bar yAxisId="left" dataKey="growthRate" name="Growth Rate (%)" fill="#0088cc" />
              <Bar yAxisId="right" dataKey="averageSalary" name="Avg. Salary ($K)" fill="#00cc9f" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default TrendingJobsChart;
