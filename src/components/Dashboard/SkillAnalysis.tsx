
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { TrendingUp, Target, DollarSign, Clock, Star, Loader2, Zap } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Career {
  title: string;
  match_percentage: number;
  description: string;
  required_skills: string[];
  missing_skills: string[];
  salary_range: string;
  growth_potential: string;
}

interface SkillGap {
  skill: string;
  importance: string;
  learning_time: string;
  resources: string[];
}

interface SkillAnalysisData {
  analysis: string;
  top_careers: Career[];
  skill_gaps: SkillGap[];
  recommendations: string[];
}

const SkillAnalysis = () => {
  const [skills, setSkills] = useState('');
  const [loading, setLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<SkillAnalysisData | null>(null);

  const analyzeSkills = async () => {
    if (!skills.trim()) {
      toast.error('Please enter your skills');
      return;
    }

    setLoading(true);
    try {
      // Get user's career profile for context
      const { data: { user } } = await supabase.auth.getUser();
      let context = '';
      
      if (user) {
        const { data: profile } = await (supabase as any)
          .from('career_profiles')
          .select('*')
          .eq('user_id', user.id)
          .single();
        
        if (profile) {
          context = `Current role: ${profile.current_role || 'Not specified'}, Target role: ${profile.target_role || 'Not specified'}, Experience: ${profile.experience_years || 0} years`;
        }
      }

      const { data, error } = await supabase.functions.invoke('openrouter-ai', {
        body: { 
          prompt: `Analyze these skills and suggest the best career matches: ${skills}. Provide match percentages, salary ranges, skill gaps, and actionable recommendations.`,
          type: 'skill_analysis',
          context
        }
      });

      if (error) throw error;

      setAnalysisResult(data.response);
      toast.success('Skill analysis completed!');
    } catch (error) {
      console.error('Error analyzing skills:', error);
      toast.error('Failed to analyze skills. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getMatchColor = (percentage: number) => {
    if (percentage >= 80) return 'text-green-600';
    if (percentage >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getImportanceColor = (importance: string) => {
    switch (importance.toLowerCase()) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-2">
          <TrendingUp className="h-8 w-8 text-emerald-600" />
          <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
            AI Skill Analysis
          </h1>
        </div>
        <p className="text-slate-600 max-w-2xl mx-auto">
          Discover your ideal career matches and identify skill gaps with our advanced AI analysis
        </p>
      </div>

      {/* Input Section */}
      <Card className="glass-effect border-0 shadow-lg max-w-2xl mx-auto">
        <CardContent className="p-6">
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-slate-700 mb-2 block">
                Enter your skills (separated by commas)
              </label>
              <Input
                value={skills}
                onChange={(e) => setSkills(e.target.value)}
                placeholder="e.g., JavaScript, React, Python, Project Management, Communication..."
                className="text-lg"
                onKeyPress={(e) => e.key === 'Enter' && analyzeSkills()}
              />
            </div>
            <Button
              onClick={analyzeSkills}
              disabled={loading || !skills.trim()}
              className="w-full bg-gradient-to-r from-emerald-600 to-blue-600 hover:from-emerald-700 hover:to-blue-700 text-white font-semibold py-3 rounded-xl"
            >
              {loading ? (
                <>
                  <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                  Analyzing Your Skills...
                </>
              ) : (
                <>
                  <Zap className="h-5 w-5 mr-2" />
                  Analyze Skills with AI
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Analysis Results */}
      {analysisResult && (
        <div className="space-y-6">
          {/* Analysis Summary */}
          <Card className="glass-effect border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="h-6 w-6 text-emerald-600" />
                Analysis Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-600 leading-relaxed">{analysisResult.analysis}</p>
            </CardContent>
          </Card>

          {/* Top Career Matches */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-slate-800">Top Career Matches</h2>
            {analysisResult.top_careers.map((career, index) => (
              <Card key={index} className="glass-effect border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-r from-emerald-500 to-blue-500 text-white flex items-center justify-center font-bold">
                        {index + 1}
                      </div>
                      {career.title}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-2xl font-bold ${getMatchColor(career.match_percentage)}`}>
                        {career.match_percentage}%
                      </span>
                      <Badge variant="secondary">Match</Badge>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <Progress value={career.match_percentage} className="h-2" />
                    
                    <p className="text-slate-600">{career.description}</p>
                    
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                      <div>
                        <h4 className="font-semibold text-slate-800 mb-2 flex items-center gap-1">
                          <Star className="h-4 w-4 text-green-500" />
                          Required Skills
                        </h4>
                        <div className="flex flex-wrap gap-1">
                          {career.required_skills.map((skill, i) => (
                            <Badge key={i} variant="outline" className="text-xs bg-green-50 text-green-700">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold text-slate-800 mb-2 flex items-center gap-1">
                          <Target className="h-4 w-4 text-red-500" />
                          Missing Skills
                        </h4>
                        <div className="flex flex-wrap gap-1">
                          {career.missing_skills.map((skill, i) => (
                            <Badge key={i} variant="outline" className="text-xs bg-red-50 text-red-700">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold text-slate-800 mb-2 flex items-center gap-1">
                          <DollarSign className="h-4 w-4 text-blue-500" />
                          Salary Range
                        </h4>
                        <p className="text-sm font-medium text-blue-600">{career.salary_range}</p>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold text-slate-800 mb-2 flex items-center gap-1">
                          <TrendingUp className="h-4 w-4 text-purple-500" />
                          Growth Potential
                        </h4>
                        <Badge className={`${
                          career.growth_potential.toLowerCase() === 'high' ? 'bg-green-100 text-green-800' :
                          career.growth_potential.toLowerCase() === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {career.growth_potential}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Skill Gaps */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-slate-800">Skill Development Plan</h2>
            <Card className="glass-effect border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="grid gap-4">
                  {analysisResult.skill_gaps.map((gap, index) => (
                    <div key={index} className="border rounded-lg p-4 bg-white/50">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold text-slate-800">{gap.skill}</h3>
                        <div className="flex items-center gap-2">
                          <Badge className={getImportanceColor(gap.importance)}>
                            {gap.importance} Priority
                          </Badge>
                          <div className="flex items-center gap-1 text-sm text-slate-600">
                            <Clock className="h-4 w-4" />
                            {gap.learning_time}
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-medium text-slate-700 mb-1">Recommended Resources:</h4>
                        <ul className="text-sm text-slate-600 space-y-1">
                          {gap.resources.map((resource, i) => (
                            <li key={i} className="flex items-start gap-1">
                              <span className="text-blue-500 mt-1">•</span>
                              {resource}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recommendations */}
          <Card className="glass-effect border-0 shadow-lg bg-gradient-to-r from-emerald-50 to-blue-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-6 w-6 text-emerald-600" />
                AI Recommendations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3">
                {analysisResult.recommendations.map((recommendation, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <span className="text-emerald-600 mt-1">💡</span>
                    <span className="text-slate-700">{recommendation}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default SkillAnalysis;
