
import { Button } from "@/components/ui/button";
import { ArrowDown, Play } from "lucide-react";
import { Link } from "react-router-dom";
import DashboardPreview from "./DashboardPreview";

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-slate-50 to-white">
      {/* Floating elements */}
      <div className="absolute top-20 left-10 w-32 h-32 bg-slate-200/30 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-20 right-10 w-40 h-40 bg-slate-300/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left side - Content */}
          <div className="text-left animate-fade-in">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-slate-800 mb-6 leading-tight">
              Your Career's
              <span className="block bg-gradient-to-r from-slate-700 to-slate-900 bg-clip-text text-transparent">
                AI-Powered Future
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-slate-600 mb-8 leading-relaxed max-w-2xl">
              Unlock personalized career insights, predict market trends, and navigate your professional journey with confidence using advanced AI analytics.
            </p>
            
            <div className="flex flex-col sm:flex-row items-start gap-4 mb-12">
              <Link to="/dashboard">
                <Button size="lg" className="bg-slate-800 hover:bg-slate-900 text-white px-8 py-4 text-lg rounded-2xl font-medium shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105">
                  Start Your Analysis
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="px-8 py-4 text-lg border-2 border-slate-300 hover:bg-slate-50 rounded-2xl font-medium transition-all duration-200 hover:scale-105">
                <Play className="w-5 h-5 mr-2" />
                Watch Demo
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-slate-800 mb-2">10M+</div>
                <div className="text-slate-600 text-sm">Data Points</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-slate-800 mb-2">94%</div>
                <div className="text-slate-600 text-sm">Accuracy</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-slate-800 mb-2">50K+</div>
                <div className="text-slate-600 text-sm">Users Guided</div>
              </div>
            </div>
          </div>

          {/* Right side - Dashboard Preview */}
          <div className="lg:block animate-fade-in delay-200">
            <DashboardPreview />
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <ArrowDown className="w-6 h-6 text-slate-400" />
      </div>
    </section>
  );
};

export default Hero;
