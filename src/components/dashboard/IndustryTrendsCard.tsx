
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

interface IndustryTrendsCardProps {
  data: {
    name: string;
    [key: string]: number | string;
  }[];
  industries: string[];
}

const IndustryTrendsCard = ({ data, industries }: IndustryTrendsCardProps) => {
  // Generate a color for each industry
  const colors = [
    "#0088cc", // careervision-500
    "#00cc9f", // insight-500
    "#6366f1", // indigo-500
    "#ec4899", // pink-500
    "#f97316", // orange-500
    "#84cc16", // lime-500
  ];

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Industry Growth Trends</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={data}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              {industries.map((industry, index) => (
                <Line
                  key={industry}
                  type="monotone"
                  dataKey={industry}
                  stroke={colors[index % colors.length]}
                  activeDot={{ r: 8 }}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default IndustryTrendsCard;
