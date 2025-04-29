
import React from 'react';
import { ArrowRight, BarChart2, LineChart, Target, UserPlus, FileText } from 'lucide-react';

const HowItWorks = () => {
  const steps = [
    {
      number: "01",
      icon: <UserPlus className="h-10 w-10 text-careervision-500" />,
      title: "Create Your Profile",
      description: "Sign up and input your skills, experience, and career aspirations."
    },
    {
      number: "02",
      icon: <FileText className="h-10 w-10 text-insight-500" />,
      title: "Get Career Analysis",
      description: "Our AI analyzes your profile against current market trends and opportunities."
    },
    {
      number: "03",
      icon: <Target className="h-10 w-10 text-careervision-500" />,
      title: "Review Recommendations",
      description: "Explore personalized career paths, skills to develop, and growth opportunities."
    },
    {
      number: "04",
      icon: <LineChart className="h-10 w-10 text-insight-500" />,
      title: "Track Your Progress",
      description: "Monitor your career growth, skill development, and market position over time."
    }
  ];

  return (
    <div className="py-24 bg-muted/50 dark:bg-gray-900">
      <div className="container px-4 md:px-6 mx-auto">
        <div className="flex flex-col items-center justify-center text-center mb-16 space-y-4">
          <div className="inline-block rounded-full bg-muted px-3 py-1 text-sm font-medium">
            Process
          </div>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tighter">
            How <span className="gradient-text">CareerVision</span> Works
          </h2>
          <p className="max-w-[700px] text-lg text-muted-foreground">
            A simple four-step process to transform your career planning with data.
          </p>
        </div>

        <div className="relative">
          {/* Connection line for desktop */}
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-careervision-200 via-insight-200 to-careervision-200 dark:from-careervision-900 dark:via-insight-900 dark:to-careervision-900 transform -translate-y-1/2 z-0"></div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <div 
                key={index} 
                className="relative z-10 flex flex-col items-center text-center space-y-4"
              >
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-careervision-500/20 to-insight-500/20 rounded-full blur-xl transform scale-150 opacity-70"></div>
                  <div className="relative w-24 h-24 rounded-full bg-white dark:bg-gray-800 shadow-xl flex items-center justify-center">
                    {step.icon}
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-gradient-to-br from-careervision-500 to-insight-500 flex items-center justify-center text-white font-bold text-sm">
                    {step.number}
                  </div>
                </div>
                <h3 className="text-xl font-semibold">{step.title}</h3>
                <p className="text-muted-foreground">{step.description}</p>
                
                {index < steps.length - 1 && (
                  <div className="lg:hidden mt-4">
                    <ArrowRight className="h-6 w-6 mx-auto text-muted-foreground" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HowItWorks;
