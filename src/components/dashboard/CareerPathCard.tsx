
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TrendingUp, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface CareerPathCardProps {
  title: string;
  description: string;
  matchPercentage: number;
  skillsNeeded: string[];
}

const CareerPathCard = ({ title, description, matchPercentage, skillsNeeded }: CareerPathCardProps) => {
  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{title}</CardTitle>
          <div className="bg-careervision-50 dark:bg-careervision-900 text-careervision-600 dark:text-careervision-300 text-sm font-medium py-1 px-2 rounded-full flex items-center">
            <TrendingUp className="h-3 w-3 mr-1" />
            {matchPercentage}% Match
          </div>
        </div>
        <CardDescription className="line-clamp-2">{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <h4 className="text-sm font-medium mb-2">Top Skills Needed:</h4>
          <div className="flex flex-wrap gap-2">
            {skillsNeeded.map((skill, index) => (
              <div key={index} className="bg-muted text-xs px-2 py-1 rounded-full">
                {skill}
              </div>
            ))}
          </div>
        </div>
        <div className="mt-4">
          <Link to="/career-paths">
            <Button variant="outline" className="w-full" size="sm">
              View Career Path
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};

export default CareerPathCard;
