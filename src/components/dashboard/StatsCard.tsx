
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatsCardProps {
  title: string;
  value: string | number;
  change?: number;
  icon: React.ReactNode;
  description?: string;
}

const StatsCard = ({ title, value, change, icon, description }: StatsCardProps) => {
  const isPositiveChange = change && change > 0;
  
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <h3 className="text-2xl font-bold mt-2">{value}</h3>
            
            {change !== undefined && (
              <div className="flex items-center mt-1">
                <span className={cn(
                  "text-xs font-medium",
                  isPositiveChange ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
                )}>
                  {isPositiveChange ? <ArrowUpRight className="inline h-3 w-3 mr-1" /> : <ArrowDownRight className="inline h-3 w-3 mr-1" />}
                  {Math.abs(change)}%
                </span>
                <span className="text-xs text-muted-foreground ml-1">from last month</span>
              </div>
            )}
            
            {description && (
              <p className="text-sm text-muted-foreground mt-2">{description}</p>
            )}
          </div>
          <div className="p-2 bg-muted rounded-lg">
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StatsCard;
