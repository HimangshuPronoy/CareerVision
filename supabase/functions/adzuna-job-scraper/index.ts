
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface JobSearchParams {
  what?: string;
  where?: string;
  results_per_page?: number;
  page?: number;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { what = 'developer', where = 'london', results_per_page = 20, page = 1 }: JobSearchParams = await req.json();

    // Adzuna API configuration
    const appId = Deno.env.get('ADZUNA_APP_ID');
    const appKey = Deno.env.get('ADZUNA_APP_KEY');
    
    if (!appId || !appKey) {
      throw new Error('Adzuna API credentials not configured');
    }

    const adzunaUrl = `https://api.adzuna.com/v1/api/jobs/gb/search/${page}?app_id=${appId}&app_key=${appKey}&what=${encodeURIComponent(what)}&where=${encodeURIComponent(where)}&results_per_page=${results_per_page}&sort_by=date`;

    console.log('Fetching from Adzuna:', adzunaUrl);

    const response = await fetch(adzunaUrl);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(`Adzuna API error: ${data.error || response.statusText}`);
    }

    // Process and store jobs
    const jobsToInsert = data.results.map((job: any) => ({
      title: job.title,
      company: job.company.display_name,
      location: job.location.display_name,
      salary_min: job.salary_min ? Math.round(job.salary_min) : null,
      salary_max: job.salary_max ? Math.round(job.salary_max) : null,
      description: job.description,
      requirements: job.category ? [job.category.label] : [],
      posted_date: job.created ? new Date(job.created).toISOString() : null,
      source: 'adzuna',
      job_url: job.redirect_url,
    }));

    // Insert jobs into database
    const { error } = await supabase
      .from('jobs')
      .upsert(jobsToInsert, { 
        onConflict: 'title,company,location',
        ignoreDuplicates: true 
      });

    if (error) {
      console.error('Database error:', error);
    }

    return new Response(
      JSON.stringify({
        success: true,
        jobs: jobsToInsert,
        total: data.count,
        page,
        results_per_page
      }),
      { 
        headers: { 
          'Content-Type': 'application/json',
          ...corsHeaders 
        } 
      }
    );

  } catch (error) {
    console.error('Error in adzuna-job-scraper:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        success: false 
      }),
      { 
        status: 500,
        headers: { 
          'Content-Type': 'application/json',
          ...corsHeaders 
        } 
      }
    );
  }
});
