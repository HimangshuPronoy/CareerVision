
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

type RequestType = 'careerPath' | 'skillGap' | 'marketInsight' | 'specificCareer';

interface UserProfile {
  skills: string[];
  experience: number;
  jobTitle: string;
  industry: string;
  education: string;
  interests: string[];
  location: string;
  specificJobTitle?: string; // Optional field for specific job requests
  [key: string]: any;
}

export const useAIInsights = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const getInsights = async <T>(
    userProfile: UserProfile,
    requestType: RequestType
  ): Promise<T | null> => {
    setLoading(true);
    setError(null);

    try {
      if (!user) {
        throw new Error("You must be logged in to use this feature");
      }

      // Get saved insights first
      const { data: savedInsights } = await supabase
        .from('saved_insights')
        .select('content')
        .eq('user_id', user.id)
        .eq('insight_type', requestType)
        .order('created_at', { ascending: false })
        .limit(1);

      // If we have a recent insight, return it instead of calling the function
      if (savedInsights && savedInsights.length > 0 && !userProfile.specificJobTitle) {
        console.log(`Using saved ${requestType} insights`);
        return savedInsights[0].content as T;
      }

      // Otherwise, call the edge function
      const { data, error } = await supabase.functions.invoke('career-insights', {
        body: { userProfile, requestType }
      });

      if (error) {
        throw new Error(error.message);
      }

      console.log(`Received ${requestType} insights from function:`, data);

      // Save the insight to the database
      const { error: saveError } = await supabase
        .from('saved_insights')
        .insert({
          user_id: user.id,
          insight_type: requestType,
          content: data
        });

      if (saveError) {
        console.error("Failed to save insight:", saveError);
        // Continue anyway, this is not a critical error
      }

      return data as T;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to get AI insights';
      setError(errorMessage);
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Function to get user profile from database
  const getUserProfile = async (): Promise<UserProfile | null> => {
    if (!user) return null;
    
    try {
      const { data: settings, error } = await supabase
        .from('user_settings')
        .select('*')
        .eq('id', user.id)
        .single();
      
      if (error) {
        console.log("Error fetching user settings:", error.message);
        return null;
      }
      
      if (!settings) {
        console.log("No user settings found");
        return null;
      }

      console.log("Retrieved user settings:", settings);
      
      // Transform the database record into the UserProfile format
      // Ensure skills and interests are always string arrays
      const skills = Array.isArray(settings.skills) 
        ? settings.skills.map(skill => String(skill)) 
        : [];
      
      const interests = Array.isArray(settings.interests) 
        ? settings.interests.map(interest => String(interest)) 
        : [];
        
      return {
        skills,
        experience: settings.experience || 0,
        jobTitle: settings.job_title || '',
        industry: settings.industry || '',
        education: settings.education || '',
        interests,
        location: settings.location || '',
      };
    } catch (error) {
      console.error("Failed to get user profile:", error);
      return null;
    }
  };

  // Function to save user skills
  const saveUserSkills = async (skills: string[]): Promise<boolean> => {
    if (!user) return false;
    
    try {
      const { error } = await supabase
        .from('user_settings')
        .update({ skills })
        .eq('id', user.id);
      
      if (error) throw error;
      
      toast({
        title: 'Skills updated',
        description: 'Your skills have been saved successfully',
      });
      
      return true;
    } catch (error) {
      console.error("Failed to save skills:", error);
      toast({
        title: 'Error',
        description: 'Failed to save your skills',
        variant: 'destructive',
      });
      return false;
    }
  };

  return {
    getCareerPaths: async (userProfile: UserProfile) => 
      getInsights<{
        title: string; 
        matchPercentage: number; 
        skillsNeeded: string[]; 
        description: string;
      }[]>(userProfile, 'careerPath'),
    
    getSpecificCareerPath: async (userProfile: UserProfile, jobTitle: string) => {
      const profileWithJob = { ...userProfile, specificJobTitle: jobTitle };
      return getInsights<{
        title: string;
        matchPercentage: number;
        skillsNeeded: string[];
        description: string;
        requiredSkills: string[];
        timeToAchieve: string;
      }>(profileWithJob, 'specificCareer');
    },
    
    getSkillRecommendations: async (userProfile: UserProfile) => 
      getInsights<{
        name: string;
        demandScore: number;
        growthRate: number;
        relevanceScore: number;
        resources: { title: string; url: string }[];
      }[]>(userProfile, 'skillGap'),
    
    getMarketInsights: async (userProfile: UserProfile) => 
      getInsights<any>(userProfile, 'marketInsight'),
    
    getUserProfile,
    saveUserSkills,
    loading,
    error
  };
};
