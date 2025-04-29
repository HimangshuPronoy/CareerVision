import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Trash2, Download, Save, HelpCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import AIResumeSuggestions from './AIResumeSuggestions';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface Experience {
  id: string;
  company: string;
  position: string;
  startDate: string;
  endDate: string;
  description: string;
}

interface Education {
  id: string;
  institution: string;
  degree: string;
  field: string;
  startDate: string;
  endDate: string;
}

interface Skill {
  id: string;
  name: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
}

interface ResumeData {
  personalInfo: {
    name: string;
    email: string;
    phone: string;
    location: string;
    summary: string;
  };
  experiences: Experience[];
  education: Education[];
  skills: Skill[];
}

// Add type definitions for the resumes table
interface Resume {
  id: string;
  user_id: string;
  data: ResumeData;
  created_at: string;
  updated_at: string;
}

const ResumeBuilder = () => {
  const { user } = useAuth();
  const [resumeData, setResumeData] = useState<ResumeData>({
    personalInfo: {
      name: '',
      email: user?.email || '',
      phone: '',
      location: '',
      summary: '',
    },
    experiences: [],
    education: [],
    skills: [],
  });

  const [activeTab, setActiveTab] = useState('personal');

  const handlePersonalInfoChange = (field: keyof ResumeData['personalInfo'], value: string) => {
    setResumeData(prev => ({
      ...prev,
      personalInfo: {
        ...prev.personalInfo,
        [field]: value,
      },
    }));
  };

  const addExperience = () => {
    setResumeData(prev => ({
      ...prev,
      experiences: [
        ...prev.experiences,
        {
          id: Date.now().toString(),
          company: '',
          position: '',
          startDate: '',
          endDate: '',
          description: '',
        },
      ],
    }));
  };

  const updateExperience = (id: string, field: keyof Experience, value: string) => {
    setResumeData(prev => ({
      ...prev,
      experiences: prev.experiences.map(exp =>
        exp.id === id ? { ...exp, [field]: value } : exp
      ),
    }));
  };

  const removeExperience = (id: string) => {
    setResumeData(prev => ({
      ...prev,
      experiences: prev.experiences.filter(exp => exp.id !== id),
    }));
  };

  const addEducation = () => {
    setResumeData(prev => ({
      ...prev,
      education: [
        ...prev.education,
        {
          id: Date.now().toString(),
          institution: '',
          degree: '',
          field: '',
          startDate: '',
          endDate: '',
        },
      ],
    }));
  };

  const updateEducation = (id: string, field: keyof Education, value: string) => {
    setResumeData(prev => ({
      ...prev,
      education: prev.education.map(edu =>
        edu.id === id ? { ...edu, [field]: value } : edu
      ),
    }));
  };

  const removeEducation = (id: string) => {
    setResumeData(prev => ({
      ...prev,
      education: prev.education.filter(edu => edu.id !== id),
    }));
  };

  const addSkill = () => {
    setResumeData(prev => ({
      ...prev,
      skills: [
        ...prev.skills,
        {
          id: Date.now().toString(),
          name: '',
          level: 'Intermediate',
        },
      ],
    }));
  };

  const updateSkill = (id: string, field: keyof Skill, value: string) => {
    setResumeData(prev => ({
      ...prev,
      skills: prev.skills.map(skill =>
        skill.id === id ? { ...skill, [field]: value } : skill
      ),
    }));
  };

  const removeSkill = (id: string) => {
    setResumeData(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill.id !== id),
    }));
  };

  const saveResume = async () => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('resumes')
        .upsert({
          user_id: user.id,
          data: resumeData,
          updated_at: new Date().toISOString(),
        } as Partial<Resume>);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Your resume has been saved successfully.",
      });
    } catch (error) {
      console.error("Error saving resume:", error);
      toast({
        title: "Error",
        description: "Failed to save your resume. Please try again.",
        variant: "destructive",
      });
    }
  };

  const downloadResume = () => {
    // TODO: Implement resume download functionality
    // This would involve converting the resume data to a PDF
    console.log("Downloading resume...");
  };

  const handleApplySuggestion = (suggestion: string) => {
    // TODO: Implement logic to apply AI suggestions to the resume
    console.log('Applying suggestion:', suggestion);
    toast({
      title: "Suggestion Applied",
      description: "The AI suggestions have been applied to your resume.",
    });
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Resume Builder</CardTitle>
          <div className="flex gap-2">
            <Button variant="outline" onClick={saveResume}>
              <Save className="h-4 w-4 mr-2" />
              Save
            </Button>
            <Button onClick={downloadResume}>
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid grid-cols-4 w-full">
                <TabsTrigger value="personal">Personal Info</TabsTrigger>
                <TabsTrigger value="experience">Experience</TabsTrigger>
                <TabsTrigger value="education">Education</TabsTrigger>
                <TabsTrigger value="skills">Skills</TabsTrigger>
              </TabsList>

              <TabsContent value="personal" className="space-y-4">
                <div className="text-sm text-muted-foreground mb-4">
                  Fill in your personal information. Make sure to use a professional email address and include a compelling summary.
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      value={resumeData.personalInfo.name}
                      onChange={(e) => handlePersonalInfoChange('name', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={resumeData.personalInfo.email}
                      onChange={(e) => handlePersonalInfoChange('email', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      value={resumeData.personalInfo.phone}
                      onChange={(e) => handlePersonalInfoChange('phone', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      value={resumeData.personalInfo.location}
                      onChange={(e) => handlePersonalInfoChange('location', e.target.value)}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Label htmlFor="summary">Professional Summary</Label>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <HelpCircle className="h-4 w-4 text-muted-foreground" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Write a brief, compelling summary of your professional background and goals. Focus on your key strengths and achievements.</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <Textarea
                    id="summary"
                    value={resumeData.personalInfo.summary}
                    onChange={(e) => handlePersonalInfoChange('summary', e.target.value)}
                    rows={4}
                    placeholder="Experienced software developer with 5+ years in full-stack development..."
                  />
                </div>
              </TabsContent>

              <TabsContent value="experience" className="space-y-4">
                <div className="text-sm text-muted-foreground mb-4">
                  Add your work experience, starting with the most recent. Use action verbs and include measurable achievements.
                </div>
                <Button onClick={addExperience} className="w-full">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Experience
                </Button>
                {resumeData.experiences.map((exp) => (
                  <Card key={exp.id} className="p-4">
                    <div className="flex justify-end">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeExperience(exp.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Company</Label>
                        <Input
                          value={exp.company}
                          onChange={(e) => updateExperience(exp.id, 'company', e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Position</Label>
                        <Input
                          value={exp.position}
                          onChange={(e) => updateExperience(exp.id, 'position', e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Start Date</Label>
                        <Input
                          type="date"
                          value={exp.startDate}
                          onChange={(e) => updateExperience(exp.id, 'startDate', e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>End Date</Label>
                        <Input
                          type="date"
                          value={exp.endDate}
                          onChange={(e) => updateExperience(exp.id, 'endDate', e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="mt-4 space-y-2">
                      <div className="flex items-center gap-2">
                        <Label>Description</Label>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger>
                              <HelpCircle className="h-4 w-4 text-muted-foreground" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Use bullet points and action verbs. Include specific achievements and metrics where possible.</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                      <Textarea
                        value={exp.description}
                        onChange={(e) => updateExperience(exp.id, 'description', e.target.value)}
                        rows={3}
                        placeholder="• Led a team of 5 developers to deliver a new feature that increased user engagement by 25%
• Implemented automated testing that reduced bug reports by 40%"
                      />
                    </div>
                  </Card>
                ))}
              </TabsContent>

              <TabsContent value="education" className="space-y-4">
                <Button onClick={addEducation} className="w-full">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Education
                </Button>
                {resumeData.education.map((edu) => (
                  <Card key={edu.id} className="p-4">
                    <div className="flex justify-end">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeEducation(edu.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Institution</Label>
                        <Input
                          value={edu.institution}
                          onChange={(e) => updateEducation(edu.id, 'institution', e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Degree</Label>
                        <Input
                          value={edu.degree}
                          onChange={(e) => updateEducation(edu.id, 'degree', e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Field of Study</Label>
                        <Input
                          value={edu.field}
                          onChange={(e) => updateEducation(edu.id, 'field', e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Start Date</Label>
                        <Input
                          type="date"
                          value={edu.startDate}
                          onChange={(e) => updateEducation(edu.id, 'startDate', e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>End Date</Label>
                        <Input
                          type="date"
                          value={edu.endDate}
                          onChange={(e) => updateEducation(edu.id, 'endDate', e.target.value)}
                        />
                      </div>
                    </div>
                  </Card>
                ))}
              </TabsContent>

              <TabsContent value="skills" className="space-y-4">
                <Button onClick={addSkill} className="w-full">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Skill
                </Button>
                {resumeData.skills.map((skill) => (
                  <Card key={skill.id} className="p-4">
                    <div className="flex justify-end">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeSkill(skill.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Skill Name</Label>
                        <Input
                          value={skill.name}
                          onChange={(e) => updateSkill(skill.id, 'name', e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Level</Label>
                        <select
                          className="w-full rounded-md border border-input bg-background px-3 py-2"
                          value={skill.level}
                          onChange={(e) => updateSkill(skill.id, 'level', e.target.value as Skill['level'])}
                        >
                          <option value="Beginner">Beginner</option>
                          <option value="Intermediate">Intermediate</option>
                          <option value="Advanced">Advanced</option>
                          <option value="Expert">Expert</option>
                        </select>
                      </div>
                    </div>
                  </Card>
                ))}
              </TabsContent>
            </Tabs>
          </div>
          <div>
            <AIResumeSuggestions
              resumeData={resumeData}
              onApplySuggestion={handleApplySuggestion}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ResumeBuilder; 