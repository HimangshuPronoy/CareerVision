
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { MapPin, Target, Clock, Star, BookOpen, Loader2, Zap } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface CareerStep {
  phase: string;
  duration: string;
  description: string;
  skills: string[];
  milestones: string[];
  resources: string[];
}

interface CareerPathData {
  title: string;
  description: string;
  timeline: string;
  steps: CareerStep[];
  final_outcome: string;
}

const CareerPath = () => {
  const [targetCareer, setTargetCareer] = useState('');
  const [loading, setLoading] = useState(false);
  const [careerPath, setCareerPath] = useState<CareerPathData | null>(null);

  const generateCareerPath = async () => {
    if (!targetCareer.trim()) {
      toast.error('Please enter your target career');
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
          context = `Current role: ${profile.current_role || 'Not specified'}, Experience: ${profile.experience_years || 0} years, Skills: ${profile.skills?.join(', ') || 'None listed'}`;
        }
      }

      const { data, error } = await supabase.functions.invoke('openrouter-ai', {
        body: { 
          prompt: `Generate a comprehensive career path to become a ${targetCareer}. Include specific steps, skills to develop, milestones, and resources.`,
          type: 'career_path',
          context
        }
      });

      if (error) throw error;

      setCareerPath(data.response);
      toast.success('Career path generated successfully!');
    } catch (error) {
      console.error('Error generating career path:', error);
      toast.error('Failed to generate career path. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-2">
          <MapPin className="h-8 w-8 text-blue-600" />
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            AI Career Path Generator
          </h1>
        </div>
        <p className="text-slate-600 max-w-2xl mx-auto">
          Tell us your dream career and our AI will create a personalized roadmap to get you there
        </p>
      </div>

      {/* Input Section */}
      <Card className="glass-effect border-0 shadow-lg max-w-2xl mx-auto">
        <CardContent className="p-6">
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-slate-700 mb-2 block">
                What career do you want to pursue?
              </label>
              <Input
                value={targetCareer}
                onChange={(e) => setTargetCareer(e.target.value)}
                placeholder="e.g., Software Engineer, Product Manager, Data Scientist..."
                className="text-lg"
                onKeyPress={(e) => e.key === 'Enter' && generateCareerPath()}
              />
            </div>
            <Button
              onClick={generateCareerPath}
              disabled={loading || !targetCareer.trim()}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 rounded-xl"
            >
              {loading ? (
                <>
                  <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                  Generating Your Path...
                </>
              ) : (
                <>
                  <Zap className="h-5 w-5 mr-2" />
                  Generate AI Career Path
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Career Path Results */}
      {careerPath && (
        <div className="space-y-6">
          {/* Overview */}
          <Card className="glass-effect border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-6 w-6 text-green-600" />
                {careerPath.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-slate-800 mb-2">Description</h3>
                  <p className="text-slate-600">{careerPath.description}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-slate-800 mb-2">Timeline</h3>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-blue-600" />
                    <span className="text-slate-600">{careerPath.timeline}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Career Steps */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-slate-800">Your Career Journey</h2>
            {careerPath.steps.map((step, index) => (
              <Card key={index} className="glass-effect border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 text-white flex items-center justify-center font-bold">
                      {index + 1}
                    </div>
                    {step.phase}
                    <Badge variant="secondary" className="ml-auto">
                      {step.duration}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <p className="text-slate-600">{step.description}</p>
                    
                    <div className="grid md:grid-cols-3 gap-4">
                      <div>
                        <h4 className="font-semibold text-slate-800 mb-2 flex items-center gap-1">
                          <Star className="h-4 w-4 text-yellow-500" />
                          Skills to Develop
                        </h4>
                        <div className="flex flex-wrap gap-1">
                          {step.skills.map((skill, i) => (
                            <Badge key={i} variant="outline" className="text-xs">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold text-slate-800 mb-2 flex items-center gap-1">
                          <Target className="h-4 w-4 text-green-500" />
                          Key Milestones
                        </h4>
                        <ul className="text-sm text-slate-600 space-y-1">
                          {step.milestones.map((milestone, i) => (
                            <li key={i} className="flex items-start gap-1">
                              <span className="text-green-500 mt-1">•</span>
                              {milestone}
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold text-slate-800 mb-2 flex items-center gap-1">
                          <BookOpen className="h-4 w-4 text-blue-500" />
                          Resources
                        </h4>
                        <ul className="text-sm text-slate-600 space-y-1">
                          {step.resources.map((resource, i) => (
                            <li key={i} className="flex items-start gap-1">
                              <span className="text-blue-500 mt-1">•</span>
                              {resource}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Final Outcome */}
          <Card className="glass-effect border-0 shadow-lg bg-gradient-to-r from-green-50 to-blue-50">
            <CardContent className="p-6">
              <div className="text-center">
                <h3 className="text-xl font-bold text-slate-800 mb-2">🎯 Your Final Destination</h3>
                <p className="text-slate-600 text-lg">{careerPath.final_outcome}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default CareerPath;
