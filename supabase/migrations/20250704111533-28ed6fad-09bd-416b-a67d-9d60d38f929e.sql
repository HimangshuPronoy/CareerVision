
-- Create table for storing user skills individually
CREATE TABLE public.user_skills (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  skill_name TEXT NOT NULL,
  proficiency_level TEXT DEFAULT 'intermediate' CHECK (proficiency_level IN ('beginner', 'intermediate', 'advanced', 'expert')),
  years_experience INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, skill_name)
);

-- Create table for storing scraped jobs
CREATE TABLE public.jobs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  company TEXT NOT NULL,
  location TEXT,
  salary_min INTEGER,
  salary_max INTEGER,
  description TEXT,
  requirements TEXT[],
  posted_date TIMESTAMP WITH TIME ZONE,
  source TEXT DEFAULT 'adzuna',
  job_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create table for job market analytics
CREATE TABLE public.job_market_analytics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  skill_name TEXT NOT NULL,
  avg_salary INTEGER,
  job_count INTEGER,
  growth_rate DECIMAL,
  region TEXT,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(skill_name, region)
);

-- Add RLS policies for user_skills
ALTER TABLE public.user_skills ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own skills" 
  ON public.user_skills 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own skills" 
  ON public.user_skills 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own skills" 
  ON public.user_skills 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own skills" 
  ON public.user_skills 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Add RLS policies for jobs (public read access)
ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view jobs" 
  ON public.jobs 
  FOR SELECT 
  USING (true);

-- Add RLS policies for job_market_analytics (public read access)
ALTER TABLE public.job_market_analytics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view job market analytics" 
  ON public.job_market_analytics 
  FOR SELECT 
  USING (true);
