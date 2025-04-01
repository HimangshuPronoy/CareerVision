
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend, Tooltip } from 'recharts';

interface SkillsRadarChartProps {
  data: {
    skill: string;
    userScore: number;
    marketDemand: number;
  }[];
}

const SkillsRadarChart = ({ data }: SkillsRadarChartProps) => {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Skills Analysis</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart outerRadius="80%" data={data}>
              <PolarGrid />
              <PolarAngleAxis dataKey="skill" />
              <PolarRadiusAxis angle={30} domain={[0, 100]} />
              <Radar
                name="Your Skills"
                dataKey="userScore"
                stroke="#0088cc"
                fill="#0088cc"
                fillOpacity={0.2}
              />
              <Radar
                name="Market Demand"
                dataKey="marketDemand"
                stroke="#00cc9f"
                fill="#00cc9f"
                fillOpacity={0.2}
              />
              <Tooltip />
              <Legend />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default SkillsRadarChart;
