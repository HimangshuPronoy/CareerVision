
import React from 'react';
import { 
  BarChart, 
  BriefcaseBusiness, 
  GraduationCap, 
  LineChart, 
  Target, 
  TrendingUp,
  Sparkles,
  Compass,
  CheckCircle
} from 'lucide-react';

const Features = () => {
  const features = [
    {
      icon: <TrendingUp className="h-10 w-10 p-2 bg-careervision-100 text-careervision-500 rounded-2xl" />,
      title: "Market Trend Analysis",
      description: "Real-time insights into job market trends, demand forecasts, and industry growth rates."
    },
    {
      icon: <CheckCircle className="h-10 w-10 p-2 bg-insight-100 text-insight-500 rounded-2xl" />,
      title: "Skill Gap Assessment",
      description: "Identify gaps between your current skills and market demands to strategically upskill."
    },
    {
      icon: <Compass className="h-10 w-10 p-2 bg-careervision-100 text-careervision-500 rounded-2xl" />,
      title: "Career Path Mapping",
      description: "Visualize potential career trajectories based on your experience and market opportunities."
    },
    {
      icon: <BriefcaseBusiness className="h-10 w-10 p-2 bg-insight-100 text-insight-500 rounded-2xl" />,
      title: "Industry Insights",
      description: "Deep dives into industry-specific trends, emerging roles, and projected growth."
    },
    {
      icon: <GraduationCap className="h-10 w-10 p-2 bg-careervision-100 text-careervision-500 rounded-2xl" />,
      title: "Learning Resources",
      description: "Curated recommendations for courses, certifications, and resources to build in-demand skills."
    },
    {
      icon: <Sparkles className="h-10 w-10 p-2 bg-insight-100 text-insight-500 rounded-2xl" />,
      title: "AI-Powered Recommendations",
      description: "Personalized suggestions for career moves and skill development based on your profile."
    }
  ];

  return (
    <div className="py-24 bg-gradient-to-b from-background to-muted/30">
      <div className="container px-4 md:px-6 mx-auto">
        <div className="flex flex-col items-center justify-center text-center mb-16 space-y-4">
          <div className="inline-block rounded-full bg-muted px-3 py-1 text-sm font-medium">
            Features
          </div>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tighter">
            Data-Driven <span className="gradient-text">Career Intelligence</span>
          </h2>
          <p className="max-w-[700px] text-lg text-muted-foreground">
            Leverage the power of data analytics and machine learning to make informed career decisions.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="relative group rounded-3xl p-6 bg-white dark:bg-gray-900 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-800 hover:border-careervision-200 dark:hover:border-gray-700 h-full"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-careervision-500/5 to-insight-500/5 opacity-0 group-hover:opacity-100 rounded-3xl transition-opacity duration-300"></div>
              <div className="relative z-10">
                <div className="mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Features;
