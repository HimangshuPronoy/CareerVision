
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Star, Plus, Trash2, TrendingUp, DollarSign, Briefcase, Target, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface UserSkill {
  id: string;
  skill_name: string;
  proficiency_level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  years_experience: number;
}

interface SkillAnalytics {
  skill_name: string;
  avg_salary: number;
  job_count: number;
  growth_rate: number;
}

const EnhancedSkillAnalysis = () => {
  const [skills, setSkills] = useState<UserSkill[]>([]);
  const [analytics, setAnalytics] = useState<SkillAnalytics[]>([]);
  const [newSkill, setNewSkill] = useState('');
  const [newProficiency, setNewProficiency] = useState<'beginner' | 'intermediate' | 'advanced' | 'expert'>('intermediate');
  const [newExperience, setNewExperience] = useState(1);
  const [loading, setLoading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadUserSkills();
  }, []);

  const loadUserSkills = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data } = await (supabase as any)
          .from('user_skills')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });
        
        setSkills(data || []);
      }
    } catch (error) {
      console.error('Error loading skills:', error);
    }
  };

  const addSkill = async () => {
    if (!newSkill.trim()) return;
    
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { error } = await (supabase as any)
          .from('user_skills')
          .insert([{
            user_id: user.id,
            skill_name: newSkill.trim(),
            proficiency_level: newProficiency,
            years_experience: newExperience
          }]);

        if (error) throw error;

        setNewSkill('');
        setNewProficiency('intermediate');
        setNewExperience(1);
        loadUserSkills();
        
        toast({
          title: "Skill Added",
          description: `Added ${newSkill} to your skill set!`,
        });
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message.includes('duplicate') 
          ? "You already have this skill in your profile" 
          : "Failed to add skill",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const removeSkill = async (skillId: string) => {
    try {
      const { error } = await (supabase as any)
        .from('user_skills')
        .delete()
        .eq('id', skillId);

      if (error) throw error;

      loadUserSkills();
      toast({
        title: "Skill Removed",
        description: "Skill has been removed from your profile",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to remove skill",
        variant: "destructive",
      });
    }
  };

  const analyzeSkills = async () => {
    setAnalyzing(true);
    try {
      const analyticsPromises = skills.map(skill => 
        supabase.functions.invoke('job-market-analytics', {
          body: { skill_name: skill.skill_name }
        })
      );

      const results = await Promise.all(analyticsPromises);
      const analyticsData = results
        .filter(result => result.data?.success)
        .map(result => result.data.analytics);

      setAnalytics(analyticsData);
      
      toast({
        title: "Analysis Complete",
        description: `Analyzed ${analyticsData.length} skills`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to analyze skills",
        variant: "destructive",
      });
    } finally {
      setAnalyzing(false);
    }
  };

  const getProficiencyColor = (level: string) => {
    switch (level) {
      case 'beginner': return 'bg-red-500';
      case 'intermediate': return 'bg-yellow-500';
      case 'advanced': return 'bg-blue-500';
      case 'expert': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getProficiencyValue = (level: string) => {
    switch (level) {
      case 'beginner': return 25;
      case 'intermediate': return 50;
      case 'advanced': return 75;
      case 'expert': return 100;
      default: return 0;
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Skill Analysis</h1>
          <p className="text-gray-600">Manage your skills and get market insights</p>
        </div>
        <Button 
          onClick={analyzeSkills} 
          disabled={analyzing || skills.length === 0}
          className="bg-purple-600 hover:bg-purple-700"
        >
          {analyzing ? (
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
          ) : (
            <TrendingUp className="h-4 w-4 mr-2" />
          )}
          Analyze Skills
        </Button>
      </div>

      {/* Add New Skill */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5 text-green-600" />
            Add New Skill
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Input
              placeholder="Skill name (e.g., React, Python)"
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
            />
            <Select value={newProficiency} onValueChange={(value: any) => setNewProficiency(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="beginner">Beginner</SelectItem>
                <SelectItem value="intermediate">Intermediate</SelectItem>
                <SelectItem value="advanced">Advanced</SelectItem>
                <SelectItem value="expert">Expert</SelectItem>
              </SelectContent>
            </Select>
            <Input
              type="number"
              placeholder="Years"
              min="0"
              max="20"
              value={newExperience}
              onChange={(e) => setNewExperience(parseInt(e.target.value) || 0)}
            />
            <Button onClick={addSkill} disabled={loading}>
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Plus className="h-4 w-4" />
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Skills List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="h-5 w-5 text-blue-600" />
              Your Skills ({skills.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {skills.map((skill) => (
                <div key={skill.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-medium">{skill.skill_name}</span>
                      <Badge variant="secondary" className="text-xs">
                        {skill.years_experience} {skill.years_experience === 1 ? 'year' : 'years'}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <Progress 
                        value={getProficiencyValue(skill.proficiency_level)} 
                        className="flex-1 h-2"
                      />
                      <span className="text-sm text-gray-600 capitalize">
                        {skill.proficiency_level}
                      </span>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeSkill(skill.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              
              {skills.length === 0 && (
                <div className="text-center py-8">
                  <Star className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No skills added yet</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Analytics */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-purple-600" />
              Market Analytics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analytics.map((analytic, index) => (
                <div key={index} className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-3">{analytic.skill_name}</h4>
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <DollarSign className="h-4 w-4 text-green-600 mx-auto mb-1" />
                      <p className="text-sm text-gray-600">Avg Salary</p>
                      <p className="font-medium">£{analytic.avg_salary.toLocaleString()}</p>
                    </div>
                    <div>
                      <Briefcase className="h-4 w-4 text-blue-600 mx-auto mb-1" />
                      <p className="text-sm text-gray-600">Jobs</p>
                      <p className="font-medium">{analytic.job_count.toLocaleString()}</p>
                    </div>
                    <div>
                      <Target className="h-4 w-4 text-purple-600 mx-auto mb-1" />
                      <p className="text-sm text-gray-600">Growth</p>
                      <p className={`font-medium ${analytic.growth_rate >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {analytic.growth_rate.toFixed(1)}%
                      </p>
                    </div>
                  </div>
                </div>
              ))}
              
              {analytics.length === 0 && (
                <div className="text-center py-8">
                  <TrendingUp className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">Click "Analyze Skills" to see market data</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EnhancedSkillAnalysis;
