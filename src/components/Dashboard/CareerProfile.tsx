
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { User, Briefcase, Target, Star, Plus, X, Save, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const CareerProfile = () => {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [newSkill, setNewSkill] = useState('');
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    current_role: '',
    target_role: '',
    experience_years: 0,
    skills: [] as string[],
    resume_url: '',
    linkedin_url: '',
    career_goals: ''
  });

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: careerProfile } = await (supabase as any)
          .from('career_profiles')
          .select('*')
          .eq('user_id', user.id)
          .single();
        
        if (careerProfile) {
          setProfile(careerProfile);
          setFormData({
            current_role: careerProfile.current_role || '',
            target_role: careerProfile.target_role || '',
            experience_years: careerProfile.experience_years || 0,
            skills: careerProfile.skills || [],
            resume_url: careerProfile.resume_url || '',
            linkedin_url: careerProfile.linkedin_url || '',
            career_goals: careerProfile.career_goals || ''
          });
        }
      }
    } catch (error) {
      console.error('Error loading profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const dataToSave = {
          ...formData,
          user_id: user.id,
          updated_at: new Date().toISOString()
        };

        if (profile) {
          await (supabase as any)
            .from('career_profiles')
            .update(dataToSave)
            .eq('id', profile.id);
        } else {
          await (supabase as any)
            .from('career_profiles')
            .insert([dataToSave]);
        }

        toast({
          title: "Profile Updated",
          description: "Your career profile has been saved successfully.",
        });
        
        loadProfile();
      }
    } catch (error) {
      console.error('Error saving profile:', error);
      toast({
        title: "Error",
        description: "Failed to save your profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const addSkill = () => {
    if (newSkill.trim() && !formData.skills.includes(newSkill.trim())) {
      setFormData(prev => ({
        ...prev,
        skills: [...prev.skills, newSkill.trim()]
      }));
      setNewSkill('');
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill !== skillToRemove)
    }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Loading your profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Career Profile</h1>
          <p className="text-gray-600">Build your professional profile to get personalized recommendations</p>
        </div>
        <Button 
          onClick={handleSave} 
          disabled={saving}
          className="bg-blue-600 hover:bg-blue-700"
        >
          {saving ? (
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
          ) : (
            <Save className="h-4 w-4 mr-2" />
          )}
          Save Profile
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5 text-blue-600" />
              Basic Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="current_role">Current Role</Label>
              <Input
                id="current_role"
                value={formData.current_role}
                onChange={(e) => setFormData(prev => ({...prev, current_role: e.target.value}))}
                placeholder="e.g., Software Developer"
              />
            </div>
            <div>
              <Label htmlFor="target_role">Target Role</Label>
              <Input
                id="target_role"
                value={formData.target_role}
                onChange={(e) => setFormData(prev => ({...prev, target_role: e.target.value}))}
                placeholder="e.g., Senior Software Engineer"
              />
            </div>
            <div>
              <Label htmlFor="experience_years">Years of Experience</Label>
              <Input
                id="experience_years"
                type="number"
                value={formData.experience_years}
                onChange={(e) => setFormData(prev => ({...prev, experience_years: parseInt(e.target.value) || 0}))}
                placeholder="0"
              />
            </div>
          </CardContent>
        </Card>

        {/* Professional Links */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Briefcase className="h-5 w-5 text-green-600" />
              Professional Links
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="resume_url">Resume URL</Label>
              <Input
                id="resume_url"
                value={formData.resume_url}
                onChange={(e) => setFormData(prev => ({...prev, resume_url: e.target.value}))}
                placeholder="https://your-resume-link.com"
              />
            </div>
            <div>
              <Label htmlFor="linkedin_url">LinkedIn Profile</Label>
              <Input
                id="linkedin_url"
                value={formData.linkedin_url}
                onChange={(e) => setFormData(prev => ({...prev, linkedin_url: e.target.value}))}
                placeholder="https://linkedin.com/in/your-profile"
              />
            </div>
          </CardContent>
        </Card>

        {/* Skills */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="h-5 w-5 text-purple-600" />
              Skills
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex gap-2">
                <Input
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  placeholder="Add a skill..."
                  onKeyPress={(e) => e.key === 'Enter' && addSkill()}
                />
                <Button onClick={addSkill} size="sm">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.skills.map((skill, index) => (
                  <Badge key={index} variant="secondary" className="flex items-center gap-1">
                    {skill}
                    <button
                      onClick={() => removeSkill(skill)}
                      className="ml-1 text-gray-500 hover:text-red-600"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Career Goals */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-orange-600" />
              Career Goals
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              value={formData.career_goals}
              onChange={(e) => setFormData(prev => ({...prev, career_goals: e.target.value}))}
              placeholder="Describe your short-term and long-term career goals..."
              rows={6}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CareerProfile;
