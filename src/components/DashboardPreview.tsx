
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Target, Users, Briefcase, ArrowUp } from "lucide-react";

const DashboardPreview = () => {
  return (
    <div className="relative max-w-2xl mx-auto">
      {/* Main preview card */}
      <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-slate-200/50 p-8 transform rotate-3 hover:rotate-0 transition-transform duration-500">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-2xl font-bold text-slate-800">Career Dashboard</h3>
            <p className="text-slate-600">AI-powered insights</p>
          </div>
          <div className="w-12 h-12 bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl flex items-center justify-center">
            <Target className="w-6 h-6 text-white" />
          </div>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-gradient-to-r from-emerald-50 to-emerald-100 rounded-2xl p-4 border border-emerald-200">
            <div className="flex items-center justify-between mb-2">
              <Briefcase className="w-5 h-5 text-emerald-600" />
              <div className="flex items-center text-emerald-600">
                <ArrowUp className="w-4 h-4" />
                <span className="text-sm font-medium">+12%</span>
              </div>
            </div>
            <div className="text-2xl font-bold text-slate-800">87%</div>
            <div className="text-sm text-slate-600">Career Readiness</div>
          </div>

          <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-2xl p-4 border border-blue-200">
            <div className="flex items-center justify-between mb-2">
              <TrendingUp className="w-5 h-5 text-blue-600" />
              <div className="flex items-center text-blue-600">
                <ArrowUp className="w-4 h-4" />
                <span className="text-sm font-medium">+8%</span>
              </div>
            </div>
            <div className="text-2xl font-bold text-slate-800">92%</div>
            <div className="text-sm text-slate-600">Market Fit</div>
          </div>
        </div>

        {/* Skills section */}
        <div className="space-y-4">
          <h4 className="font-semibold text-slate-800">Top Skills</h4>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-slate-700 font-medium">JavaScript</span>
              <Badge className="bg-slate-100 text-slate-700 rounded-full">85%</Badge>
            </div>
            <Progress value={85} className="h-2 bg-slate-100" />
            
            <div className="flex items-center justify-between">
              <span className="text-slate-700 font-medium">React</span>
              <Badge className="bg-slate-100 text-slate-700 rounded-full">78%</Badge>
            </div>
            <Progress value={78} className="h-2 bg-slate-100" />
          </div>
        </div>

        {/* AI recommendation */}
        <div className="mt-6 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl border border-purple-200">
          <div className="flex items-center space-x-2 mb-2">
            <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium text-slate-700">AI Recommendation</span>
          </div>
          <p className="text-sm text-slate-600">
            Focus on Data Analysis to boost your profile by 23%
          </p>
        </div>
      </div>

      {/* Floating cards */}
      <div className="absolute -top-4 -right-4 bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg border border-slate-200/50 p-4 transform -rotate-12 hover:rotate-0 transition-transform duration-300">
        <div className="flex items-center space-x-2">
          <Users className="w-5 h-5 text-slate-600" />
          <span className="text-sm font-medium text-slate-700">Network Score: 68%</span>
        </div>
      </div>

      <div className="absolute -bottom-4 -left-4 bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg border border-slate-200/50 p-4 transform rotate-12 hover:rotate-0 transition-transform duration-300">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
          <span className="text-sm font-medium text-slate-700">3 new opportunities</span>
        </div>
      </div>
    </div>
  );
};

export default DashboardPreview;
