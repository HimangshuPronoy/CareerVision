
import { useState, useEffect } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { 
  Brain, 
  Target, 
  TrendingUp, 
  Star, 
  Award, 
  CheckCircle, 
  AlertCircle, 
  Zap, 
  Sparkles,
  BarChart3,
  BookOpen,
  Users,
  Clock
} from 'lucide-react';
import SkillRadarChart from '@/components/SkillRadarChart';

interface SkillData {
  name: string;
  level: number;
  category: string;
}

interface JobRecommendation {
  title: string;
  match_percentage: number;
  required_skills: string[];
  missing_skills: string[];
  salary_range: string;
  description: string;
}

interface SkillGap {
  skill: string;
  importance: number;
  learning_resources: string[];
}

const SkillAnalysis = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [skills, setSkills] = useState<SkillData[]>([]);
  const [targetJob, setTargetJob] = useState('');
  const [newSkill, setNewSkill] = useState('');
  const [bulkSkills, setBulkSkills] = useState('');
  const [newLevel, setNewLevel] = useState(1);
  const [analysis, setAnalysis] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [savedAssessments, setSavedAssessments] = useState<any[]>([]);

  useEffect(() => {
    if (user) {
      fetchSavedAssessments();
    }
  }, [user]);

  const fetchSavedAssessments = async () => {
    try {
      const { data, error } = await supabase
        .from('skill_assessments')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false })
        .limit(5);

      if (error) throw error;
      setSavedAssessments(data || []);
    } catch (error) {
      console.error('Error fetching assessments:', error);
    }
  };

  const addSkill = () => {
    // support multiple comma separated
    const entries = bulkSkills ? bulkSkills.split(',').map(s=>s.trim()).filter(Boolean) : [newSkill.trim()].filter(Boolean);
    if (entries.length === 0) {
      toast({title:'Skill Required',description:'Please enter skill(s).',variant:'destructive'});
      return;
    }
    let added = false;
    const newList = [...skills];
    entries.forEach(entry=>{
      const exists = newList.some(s=>s.name.toLowerCase()===entry.toLowerCase());
      if(!exists){
        newList.push({name:entry, level:newLevel, category:categorizeSkill(entry)});
        added=true;
      }
    });
    if(!added){
      toast({title:'Skills already added',description:'All provided skills are already in list.',variant:'destructive'});
      return;
    }
    setSkills(newList);
    setNewSkill('');
    setBulkSkills('');
    setNewLevel(1);
  };


  const categorizeSkill = (skillName: string): string => {
    const technical = ['javascript', 'python', 'react', 'node', 'sql', 'aws', 'docker', 'kubernetes'];
    const soft = ['leadership', 'communication', 'teamwork', 'problem solving', 'creativity'];
    const design = ['figma', 'photoshop', 'ui/ux', 'design thinking', 'prototyping'];
    
    const skill = skillName.toLowerCase();
    if (technical.some(t => skill.includes(t))) return 'Technical';
    if (soft.some(s => skill.includes(s))) return 'Soft Skills';
    if (design.some(d => skill.includes(d))) return 'Design';
    return 'Other';
  };

  const removeSkill = (index: number) => {
    setSkills(skills.filter((_, i) => i !== index));
  };

  const analyzeSkills = async () => {
    if (skills.length === 0) {
      toast({
        title: 'No Skills Added',
        description: 'Please add at least one skill to analyze.',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    try {
      const skillsData = skills.reduce((acc, skill) => {
        acc[skill.name] = skill.level;
        return acc;
      }, {} as Record<string, number>);

      const { data, error } = await supabase.functions.invoke('ai-career-assistant', {
        body: {
          type: 'skill_analysis',
          data: { 
            skills: skillsData,
            targetJob: targetJob || 'Software Engineer'
          }
        }
      });

      if (error) throw error;

      setAnalysis(data);

      // Save assessment to database
      await supabase
        .from('skill_assessments')
        .insert({
          user_id: user?.id,
          skills: skillsData,
          target_job_title: targetJob || 'Software Engineer',
          assessment_results: data,
          recommended_jobs: data.jobRecommendations || [],
          skill_gaps: data.skillGaps || []
        });

      fetchSavedAssessments();
      
      toast({
        title: 'Analysis Complete!',
        description: 'Your skill analysis is ready.',
      });
    } catch (error) {
      console.error('Error analyzing skills:', error);
      toast({
        title: 'Analysis Failed',
        description: 'Please try again later.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const getSkillLevelColor = (level: number) => {
    if (level <= 2) return 'bg-red-500';
    if (level <= 4) return 'bg-yellow-500';
    if (level <= 7) return 'bg-blue-500';
    return 'bg-green-500';
  };

  const getSkillLevelText = (level: number) => {
    if (level <= 2) return 'Beginner';
    if (level <= 4) return 'Novice';
    if (level <= 7) return 'Intermediate';
    if (level <= 9) return 'Advanced';
    return 'Expert';
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Technical': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Soft Skills': return 'bg-green-100 text-green-800 border-green-200';
      case 'Design': return 'bg-purple-100 text-purple-800 border-purple-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <ProtectedRoute>
      <div className="flex min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
        
        <main className="flex-1 p-8">
          <div className="max-w-6xl mx-auto space-y-8">
            {/* Header */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 p-8 text-white">
              <div className="absolute inset-0 bg-black/10"></div>
              <div className="relative flex items-center justify-between">
                <div className="space-y-2">
                  <h1 className="text-4xl font-bold">Advanced Skill Analysis</h1>
                  <p className="text-indigo-100 text-lg">Analyze your skills and discover career opportunities</p>
                </div>
                <div className="flex items-center space-x-3">
                  <Badge variant="secondary" className="bg-white/20 text-white border-white/30 backdrop-blur-sm">
                    <Brain className="w-4 h-4 mr-1" />
                    AI Analysis
                  </Badge>
                  <Badge variant="secondary" className="bg-white/20 text-white border-white/30 backdrop-blur-sm">
                    <BarChart3 className="w-4 h-4 mr-1" />
                    Data Driven
                  </Badge>
                </div>
              </div>
            </div>

            {/* Skill Input Section */}
            <Card className="border-0 shadow-xl">
              <CardHeader className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-t-lg">
                <CardTitle className="flex items-center text-gray-900">
                  <Target className="w-6 h-6 mr-2 text-indigo-600" />
                  Add Your Skills
                </CardTitle>
                <p className="text-gray-600">Build your skill profile for comprehensive analysis</p>
              </CardHeader>
              <CardContent className="p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Target Job Title (Optional)</label>
                      <Input
                        placeholder="e.g., Senior Software Engineer, Product Manager"
                        value={targetJob}
                        onChange={(e) => setTargetJob(e.target.value)}
                        className="border-2 border-gray-200 focus:border-indigo-500 rounded-xl"
                      />
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="grid grid-cols-3 gap-4">
                      <div className="col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Skill Name</label>
                        <Input
                          type="text"
                          placeholder="Add skill(s) e.g. React, Node, AWS"
                          value={bulkSkills}
                          onChange={(e) => setBulkSkills(e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Level (1-10)</label>
                        <Input
                          type="number"
                          min="1"
                          max="10"
                          value={newLevel}
                          onChange={(e) => setNewLevel(parseInt(e.target.value) || 1)}
                          className="border-2 border-gray-200 focus:border-indigo-500 rounded-xl"
                        />
                      </div>
                    </div>
                    <Button
                      onClick={addSkill}
                      className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-xl"
                    >
                      <Sparkles className="w-4 h-4 mr-2" />
                      Add Skill
                    </Button>
                  </div>
                </div>

                {/* Current Skills */}
                {skills.length > 0 && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900">Your Skills ({skills.length})</h3>
                    <div className="grid gap-4">
                      {skills.map((skill, index) => (
                        <div key={index} className="p-4 bg-gradient-to-r from-white to-gray-50 rounded-2xl border-2 border-gray-200 hover:border-indigo-300 transition-all duration-300">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4 flex-1">
                              <div className="flex-1">
                                <div className="flex items-center space-x-3 mb-2">
                                  <h4 className="font-semibold text-gray-900">{skill.name}</h4>
                                  <Badge className={`${getCategoryColor(skill.category)} border rounded-xl`}>
                                    {skill.category}
                                  </Badge>
                                  <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-200">
                                    {getSkillLevelText(skill.level)}
                                  </Badge>
                                </div>
                                <div className="flex items-center space-x-3">
                                  <Progress value={skill.level * 10} className="flex-1 h-2" />
                                  <span className="text-sm font-medium text-gray-600">{skill.level}/10</span>
                                </div>
                              </div>
                            </div>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => removeSkill(index)}
                              className="text-red-600 border-red-200 hover:bg-red-50 rounded-xl ml-4"
                            >
                              Remove
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="mt-6 pt-6 border-t border-gray-200">
                  <Button
                    onClick={analyzeSkills}
                    disabled={loading || skills.length === 0}
                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-xl h-12 text-lg shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    {loading ? (
                      <>
                        <Zap className="w-5 h-5 mr-2 animate-spin" />
                        Analyzing Skills...
                      </>
                    ) : (
                      <>
                        <Brain className="w-5 h-5 mr-2" />
                        Analyze My Skills
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Analysis Results */}
            {/* Radar Chart */}
            {skills.length>=3 && (
              <Card className="border-0 shadow-xl">
                <CardHeader className="bg-gradient-to-r from-indigo-50 to-sky-50 rounded-t-lg">
                  <CardTitle className="flex items-center text-gray-900">
                    <BarChart3 className="w-6 h-6 mr-2 text-indigo-600" />
                    Skill Polygon
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-8">
                  <SkillRadarChart skills={skills} />
                </CardContent>
              </Card>
            )}

            {analysis && (
              <div className="space-y-8">
                {/* Overall Score */}
                {analysis.overallScore && (
                  <Card className="border-0 shadow-xl">
                    <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-t-lg">
                      <CardTitle className="flex items-center text-gray-900">
                        <Award className="w-6 h-6 mr-2 text-green-600" />
                        Overall Skill Assessment
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-8">
                      <div className="text-center mb-6">
                        <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-r from-green-500 to-emerald-600 text-white text-2xl font-bold mb-4">
                          {analysis.overallScore}%
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">Skill Readiness Score</h3>
                        <p className="text-gray-600">{analysis.summary}</p>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Job Recommendations */}
                {analysis.jobRecommendations && analysis.jobRecommendations.length > 0 && (
                  <Card className="border-0 shadow-xl">
                    <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-lg">
                      <CardTitle className="flex items-center text-gray-900">
                        <Target className="w-6 h-6 mr-2 text-blue-600" />
                        Job Recommendations
                      </CardTitle>
                      <p className="text-gray-600">Positions that match your skill profile</p>
                    </CardHeader>
                    <CardContent className="p-8">
                      <div className="grid gap-6">
                        {analysis.jobRecommendations.map((job: JobRecommendation, index: number) => (
                          <div key={index} className="p-6 bg-gradient-to-r from-white to-blue-50 rounded-2xl border-2 border-blue-200 hover:border-blue-400 hover:shadow-lg transition-all duration-300">
                            <div className="flex items-start justify-between mb-4">
                              <div className="flex-1">
                                <h3 className="text-xl font-semibold text-gray-900 mb-2">{job.title}</h3>
                                <p className="text-gray-600 mb-3">{job.description}</p>
                                <div className="flex items-center space-x-4 mb-4">
                                  <Badge className="bg-green-100 text-green-800 border-green-200">
                                    <CheckCircle className="w-3 h-3 mr-1" />
                                    {job.match_percentage}% Match
                                  </Badge>
                                  <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-200">
                                    {job.salary_range}
                                  </Badge>
                                </div>
                              </div>
                            </div>
                            
                            <div className="grid md:grid-cols-2 gap-4">
                              <div>
                                <h4 className="font-medium text-gray-900 mb-2 flex items-center">
                                  <CheckCircle className="w-4 h-4 mr-1 text-green-600" />
                                  Skills You Have
                                </h4>
                                <div className="flex flex-wrap gap-2">
                                  {job.required_skills.map((skill: string, skillIndex: number) => (
                                    <Badge key={skillIndex} variant="secondary" className="bg-green-100 text-green-800">
                                      {skill}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                              <div>
                                <h4 className="font-medium text-gray-900 mb-2 flex items-center">
                                  <AlertCircle className="w-4 h-4 mr-1 text-orange-600" />
                                  Skills to Develop
                                </h4>
                                <div className="flex flex-wrap gap-2">
                                  {job.missing_skills.map((skill: string, skillIndex: number) => (
                                    <Badge key={skillIndex} variant="outline" className="bg-orange-100 text-orange-800 border-orange-200">
                                      {skill}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Skill Gaps */}
                {analysis.skillGaps && analysis.skillGaps.length > 0 && (
                  <Card className="border-0 shadow-xl">
                    <CardHeader className="bg-gradient-to-r from-orange-50 to-red-50 rounded-t-lg">
                      <CardTitle className="flex items-center text-gray-900">
                        <TrendingUp className="w-6 h-6 mr-2 text-orange-600" />
                        Skill Gap Analysis
                      </CardTitle>
                      <p className="text-gray-600">Areas for improvement to reach your career goals</p>
                    </CardHeader>
                    <CardContent className="p-8">
                      <div className="space-y-6">
                        {analysis.skillGaps.map((gap: SkillGap, index: number) => (
                          <div key={index} className="p-6 bg-gradient-to-r from-white to-orange-50 rounded-2xl border-2 border-orange-200">
                            <div className="flex items-start justify-between mb-4">
                              <div className="flex-1">
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">{gap.skill}</h3>
                                <div className="flex items-center space-x-3 mb-3">
                                  <Badge className="bg-red-100 text-red-800 border-red-200">
                                    Priority: {gap.importance === 3 ? 'High' : gap.importance === 2 ? 'Medium' : 'Low'}
                                  </Badge>
                                  <div className="flex items-center">
                                    <Star className="w-4 h-4 text-yellow-500 mr-1" />
                                    <span className="text-sm text-gray-600">Importance: {gap.importance}/3</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                            
                            <div>
                              <h4 className="font-medium text-gray-900 mb-3 flex items-center">
                                <BookOpen className="w-4 h-4 mr-1 text-blue-600" />
                                Learning Resources
                              </h4>
                              <div className="grid gap-2">
                                {gap.learning_resources.map((resource: string, resourceIndex: number) => (
                                  <div key={resourceIndex} className="p-3 bg-blue-50 rounded-xl border border-blue-200">
                                    <span className="text-blue-800 font-medium">{resource}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Recommendations */}
                {analysis.recommendations && (
                  <Card className="border-0 shadow-xl">
                    <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-t-lg">
                      <CardTitle className="flex items-center text-gray-900">
                        <Sparkles className="w-6 h-6 mr-2 text-purple-600" />
                        Personalized Recommendations
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-8">
                      <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-2xl border-2 border-purple-200">
                        <p className="text-gray-800 leading-relaxed">{analysis.recommendations}</p>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}

            {/* Saved Assessments */}
            {savedAssessments.length > 0 && (
              <Card className="border-0 shadow-xl">
                <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-t-lg">
                  <CardTitle className="flex items-center text-gray-900">
                    <Clock className="w-6 h-6 mr-2 text-gray-600" />
                    Recent Assessments
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {savedAssessments.map((assessment) => (
                      <div key={assessment.id} className="group p-6 bg-gradient-to-r from-white to-gray-50 rounded-2xl border-2 border-gray-200 hover:border-purple-300 hover:shadow-lg transition-all duration-300">
                        <div className="flex items-start justify-between mb-3">
                          <h3 className="font-semibold text-gray-900 group-hover:text-purple-900 transition-colors">
                            {assessment.target_job_title || 'General Assessment'}
                          </h3>
                          <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">
                            Complete
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 mb-4">
                          {Object.keys(assessment.skills).length} skills analyzed • {new Date(assessment.created_at).toLocaleDateString()}
                        </p>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setAnalysis(assessment.assessment_results)}
                          className="text-purple-600 border-purple-200 hover:bg-purple-50 rounded-xl"
                        >
                          View Results
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
};

export default SkillAnalysis;
