import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TrendingUp, ArrowRight, X } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface CareerPathCardProps {
  title: string;
  description: string;
  matchPercentage: number;
  skillsNeeded: string[];
}

const CareerPathCard = ({ title, description, matchPercentage, skillsNeeded }: CareerPathCardProps) => {
  const [isOpen, setIsOpen] = useState(false);

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
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="w-full" size="sm">
                View Career Path
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>{title}</DialogTitle>
                <DialogDescription>
                  Career Path Details
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Description</h4>
                  <p className="text-sm text-muted-foreground">{description}</p>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">Match Score</h4>
                  <div className="flex items-center">
                    <div className="bg-careervision-50 dark:bg-careervision-900 text-careervision-600 dark:text-careervision-300 text-sm font-medium py-1 px-2 rounded-full flex items-center">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      {matchPercentage}% Match
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Required Skills</h4>
                  <div className="flex flex-wrap gap-2">
                    {skillsNeeded.map((skill, index) => (
                      <div key={index} className="bg-muted text-sm px-3 py-1 rounded-full">
                        {skill}
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Next Steps</h4>
                  <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                    <li>Review and acquire the required skills</li>
                    <li>Check job market demand for this role</li>
                    <li>Update your profile with relevant experience</li>
                    <li>Explore learning resources for missing skills</li>
                  </ul>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardContent>
    </Card>
  );
};

export default CareerPathCard;
