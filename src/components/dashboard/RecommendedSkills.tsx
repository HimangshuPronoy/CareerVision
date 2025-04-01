
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Award, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

interface SkillItem {
  name: string;
  demandScore: number;
  growthRate: number;
  relevanceScore: number;
  resources: { title: string; url: string }[];
}

interface RecommendedSkillsProps {
  skills: SkillItem[];
}

const RecommendedSkills = ({ skills }: RecommendedSkillsProps) => {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Award className="mr-2 h-5 w-5 text-careervision-500" />
          Recommended Skills to Learn
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y divide-border">
          {skills.map((skill, index) => (
            <div key={index} className="p-4">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-medium">{skill.name}</h3>
                <span className="text-xs bg-insight-50 dark:bg-insight-900 text-insight-600 dark:text-insight-300 px-2 py-1 rounded-full">
                  +{skill.growthRate}% Growth
                </span>
              </div>
              <div className="space-y-2 mb-3">
                <div className="flex justify-between text-xs">
                  <span>Demand Score</span>
                  <span>{skill.demandScore}/100</span>
                </div>
                <Progress value={skill.demandScore} className="h-1" />
                <div className="flex justify-between text-xs">
                  <span>Relevance to Your Profile</span>
                  <span>{skill.relevanceScore}/100</span>
                </div>
                <Progress value={skill.relevanceScore} className="h-1" />
              </div>
              <div className="mt-3">
                <h4 className="text-xs font-medium mb-2">Learning Resources:</h4>
                <div className="space-y-2">
                  {skill.resources.map((resource, i) => (
                    <Button 
                      key={i} 
                      variant="outline" 
                      size="sm" 
                      className="w-full text-left justify-between"
                      onClick={() => window.open(resource.url, '_blank')}
                    >
                      <span className="truncate">{resource.title}</span>
                      <ExternalLink className="h-3 w-3 ml-2 flex-shrink-0" />
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default RecommendedSkills;
