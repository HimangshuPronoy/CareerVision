
import React, { useEffect, useState } from 'react';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';

const profileSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  title: z.string().min(2, {
    message: "Job title must be at least 2 characters.",
  }),
  industry: z.string({
    required_error: "Please select an industry.",
  }),
  experience: z.string({
    required_error: "Please select your years of experience.",
  }),
  skills: z.string().min(2, {
    message: "Please enter at least one skill.",
  }),
  bio: z.string().max(500, {
    message: "Bio must not be longer than 500 characters.",
  }).optional(),
  careerGoals: z.string().min(10, {
    message: "Please describe your career goals in at least 10 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

const ProfileForm = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: "",
      title: "",
      industry: "",
      experience: "",
      skills: "",
      bio: "",
      careerGoals: "",
      email: "",
    },
  });

  // Fetch user profile data
  useEffect(() => {
    const fetchUserData = async () => {
      if (!user) return;
      
      setIsFetching(true);
      try {
        // Get user profile data
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
          
        if (profileError) throw profileError;
        
        // Get user settings data
        const { data: settingsData, error: settingsError } = await supabase
          .from('user_settings')
          .select('*')
          .eq('id', user.id)
          .single();
          
        if (settingsError) throw settingsError;
        
        // Prepare form data
        form.reset({
          name: profileData.full_name || "",
          email: user.email || "",
          title: settingsData.job_title || "",
          industry: settingsData.industry || "",
          experience: String(settingsData.experience) || "0-2",
          skills: Array.isArray(settingsData.skills) ? settingsData.skills.join(', ') : "",
          bio: "", // Placeholder, not stored yet
          careerGoals: Array.isArray(settingsData.interests) ? settingsData.interests.join(', ') : "",
        });
      } catch (error) {
        console.error("Error fetching user data:", error);
        toast({
          title: "Error",
          description: "Failed to load profile data. Please try again later.",
          variant: "destructive",
        });
      } finally {
        setIsFetching(false);
      }
    };
    
    fetchUserData();
  }, [user]);

  async function onSubmit(data: ProfileFormValues) {
    if (!user) return;
    
    setIsLoading(true);
    try {
      // Convert years of experience string to number
      let experienceValue = 0;
      if (data.experience === "0-2") experienceValue = 1;
      else if (data.experience === "3-5") experienceValue = 4;
      else if (data.experience === "6-10") experienceValue = 8;
      else if (data.experience === "10+") experienceValue = 12;
      
      // Parse skills and career goals/interests
      const skills = data.skills.split(',').map(skill => skill.trim());
      const interests = data.careerGoals.split(',').map(interest => interest.trim());
      
      // Update profile
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          full_name: data.name,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);
        
      if (profileError) throw profileError;
      
      // Update settings
      const { error: settingsError } = await supabase
        .from('user_settings')
        .update({
          job_title: data.title,
          industry: data.industry,
          experience: experienceValue,
          skills: skills,
          interests: interests,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);
        
      if (settingsError) throw settingsError;
      
      toast({
        title: "Profile updated",
        description: "Your profile information has been updated successfully.",
      });
    } catch (error: any) {
      console.error("Error updating profile:", error);
      toast({
        title: "Error",
        description: "Failed to update profile. " + (error.message || "Please try again."),
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  if (isFetching) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Your Profile</CardTitle>
          <CardDescription>Loading your profile information...</CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-careervision-500" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Profile</CardTitle>
        <CardDescription>
          Update your profile information to get more accurate career recommendations.
        </CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input placeholder="John Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="john.doe@example.com" {...field} readOnly />
                    </FormControl>
                    <FormDescription>Your email cannot be changed.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Current Job Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Software Developer" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="industry"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Industry</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select an industry" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="technology">Technology</SelectItem>
                        <SelectItem value="healthcare">Healthcare</SelectItem>
                        <SelectItem value="finance">Finance</SelectItem>
                        <SelectItem value="education">Education</SelectItem>
                        <SelectItem value="marketing">Marketing</SelectItem>
                        <SelectItem value="manufacturing">Manufacturing</SelectItem>
                        <SelectItem value="retail">Retail</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="experience"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Years of Experience</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select years of experience" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="0-2">0-2 years</SelectItem>
                      <SelectItem value="3-5">3-5 years</SelectItem>
                      <SelectItem value="6-10">6-10 years</SelectItem>
                      <SelectItem value="10+">10+ years</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="skills"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Skills</FormLabel>
                  <FormControl>
                    <Input placeholder="JavaScript, React, Node.js" {...field} />
                  </FormControl>
                  <FormDescription>
                    Enter your skills, separated by commas.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="bio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bio</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Tell us about yourself and your professional background"
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Your bio helps us understand your background. Max 500 characters.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="careerGoals"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Career Interests</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Web Development, Machine Learning, DevOps"
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Enter your career interests, separated by commas.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter>
            <Button 
              type="submit" 
              className="w-full md:w-auto"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
};

export default ProfileForm;
