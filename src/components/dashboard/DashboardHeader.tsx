
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { User } from 'lucide-react';

interface DashboardHeaderProps {
  userName: string;
}

const DashboardHeader = ({ userName }: DashboardHeaderProps) => {
  return (
    <div className="mb-8">
      <Card className="bg-gradient-to-r from-careervision-500 to-insight-500 border-none text-white">
        <CardContent className="pt-6">
          <div className="flex items-center">
            <div className="mr-4 bg-white/20 rounded-full p-3">
              <User className="h-8 w-8" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Welcome back, {userName}</h1>
              <p className="text-careervision-100">
                Here's what's happening with your career journey today
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardHeader;
