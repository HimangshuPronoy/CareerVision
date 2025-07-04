
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { GraduationCap, BookOpen, Clock, Award, Code, Loader2, Zap } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface LearningModule {
  name: string;
  duration: string;
  description: string;
  topics: string[];
  resources: string[];
  projects: string[];
  certification: string;
}

interface LearningPathData {
  title: string;
  description: string;
  difficulty: string;
  duration: string;
  modules: LearningModule[];
  career_outcomes: string[];
}

const LearningPath = () => {
  const [skillOrField, setSkillOrField] = useState('');
  const [loading, setLoading] = useState(false);
  const [learningPath, setLearningPath] = useState<LearningPathData | null>(null);

  const generateLearningPath = async () => {
    if (!skillOrField.trim()) {
      toast.error('Please enter a skill or field to learn');
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
          context = `Current role: ${profile.current_role || 'Not specified'}, Experience: ${profile.experience_years || 0} years, Current skills: ${profile.skills?.join(', ') || 'None listed'}, Target role: ${profile.target_role || 'Not specified'}`;
        }
      }

      const { data, error } = await supabase.functions.invoke('openrouter-ai', {
        body: { 
          prompt: `Create a comprehensive learning path for ${skillOrField}. Include modules, courses, certifications, projects, and career outcomes. Make it practical and actionable.`,
          type: 'learning_path',
          context
        }
      });

      if (error) throw error;

      setLearningPath(data.response);
      toast.success('Learning path generated successfully!');
    } catch (error) {
      console.error('Error generating learning path:', error);
      toast.error('Failed to generate learning path. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-2">
          <GraduationCap className="h-8 w-8 text-purple-600" />
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            AI Learning Path Generator
          </h1>
        </div>
        <p className="text-slate-600 max-w-2xl mx-auto">
          Get a personalized learning roadmap with courses, projects, and certifications tailored to your goals
        </p>
      </div>

      {/* Input Section */}
      <Card className="glass-effect border-0 shadow-lg max-w-2xl mx-auto">
        <CardContent className="p-6">
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-slate-700 mb-2 block">
                What skill or field do you want to master?
              </label>
              <Input
                value={skillOrField}
                onChange={(e) => setSkillOrField(e.target.value)}
                placeholder="e.g., Python Programming, Digital Marketing, UI/UX Design..."
                className="text-lg"
                onKeyPress={(e) => e.key === 'Enter' && generateLearningPath()}
              />
            </div>
            <Button
              onClick={generateLearningPath}
              disabled={loading || !skillOrField.trim()}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-3 rounded-xl"
            >
              {loading ? (
                <>
                  <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                  Creating Your Learning Path...
                </>
              ) : (
                <>
                  <Zap className="h-5 w-5 mr-2" />
                  Generate AI Learning Path
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Learning Path Results */}
      {learningPath && (
        <div className="space-y-6">
          {/* Overview */}
          <Card className="glass-effect border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-6 w-6 text-purple-600" />
                {learningPath.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <h3 className="font-semibold text-slate-800 mb-2">Description</h3>
                  <p className="text-slate-600">{learningPath.description}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-slate-800 mb-2">Duration</h3>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-blue-600" />
                    <span className="text-slate-600">{learningPath.duration}</span>
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-slate-800 mb-2">Difficulty</h3>
                  <Badge className={getDifficultyColor(learningPath.difficulty)}>
                    {learningPath.difficulty}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Learning Modules */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-slate-800">Learning Modules</h2>
            {learningPath.modules.map((module, index) => (
              <Card key={index} className="glass-effect border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white flex items-center justify-center font-bold">
                      {index + 1}
                    </div>
                    {module.name}
                    <Badge variant="secondary" className="ml-auto">
                      {module.duration}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <p className="text-slate-600">{module.description}</p>
                    
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                      <div>
                        <h4 className="font-semibold text-slate-800 mb-2 flex items-center gap-1">
                          <BookOpen className="h-4 w-4 text-blue-500" />
                          Topics
                        </h4>
                        <div className="flex flex-wrap gap-1">
                          {module.topics.map((topic, i) => (
                            <Badge key={i} variant="outline" className="text-xs">
                              {topic}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold text-slate-800 mb-2 flex items-center gap-1">
                          <GraduationCap className="h-4 w-4 text-green-500" />
                          Resources
                        </h4>
                        <ul className="text-sm text-slate-600 space-y-1">
                          {module.resources.map((resource, i) => (
                            <li key={i} className="flex items-start gap-1">
                              <span className="text-green-500 mt-1">•</span>
                              {resource}
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold text-slate-800 mb-2 flex items-center gap-1">
                          <Code className="h-4 w-4 text-orange-500" />
                          Projects
                        </h4>
                        <ul className="text-sm text-slate-600 space-y-1">
                          {module.projects.map((project, i) => (
                            <li key={i} className="flex items-start gap-1">
                              <span className="text-orange-500 mt-1">•</span>
                              {project}
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold text-slate-800 mb-2 flex items-center gap-1">
                          <Award className="h-4 w-4 text-purple-500" />
                          Certification
                        </h4>
                        <p className="text-sm text-slate-600">{module.certification}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Career Outcomes */}
          <Card className="glass-effect border-0 shadow-lg bg-gradient-to-r from-purple-50 to-pink-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-6 w-6 text-purple-600" />
                Career Outcomes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                {learningPath.career_outcomes.map((outcome, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <span className="text-purple-600 mt-1">🎯</span>
                    <span className="text-slate-700">{outcome}</span>
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

export default LearningPath;
