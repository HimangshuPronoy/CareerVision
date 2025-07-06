
import { Card, CardContent } from "@/components/ui/card";
import { Brain, TrendingUp, Target, BookOpen } from "lucide-react";

const features = [
  {
    icon: Brain,
    title: "AI-Powered Analysis",
    description: "Advanced machine learning algorithms analyze your profile and market data to provide personalized career recommendations."
  },
  {
    icon: TrendingUp,
    title: "Market Intelligence",
    description: "Real-time job market analysis with predictive insights on industry trends, salary projections, and skill demand."
  },
  {
    icon: Target,
    title: "Career Path Simulator",
    description: "Explore different career trajectories with 'what-if' scenarios and success probability predictions."
  },
  {
    icon: BookOpen,
    title: "Skill Gap Analysis",
    description: "Identify missing skills for your target roles and get personalized learning paths with course recommendations."
  }
];

const Features = () => {
  return (
    <section id="features" className="py-24 bg-gradient-to-b from-white to-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-slate-800 mb-6">
            Intelligent Career Tools
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
            Harness the power of AI to make informed career decisions with comprehensive market insights and personalized recommendations.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <Card 
              key={feature.title} 
              className="border-0 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-4 bg-white/80 backdrop-blur-sm rounded-3xl group"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-4">
                  {feature.title}
                </h3>
                <p className="text-slate-600 leading-relaxed">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
