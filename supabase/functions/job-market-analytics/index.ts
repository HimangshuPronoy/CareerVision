
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { skill_name, region = 'UK' } = await req.json();

    // Adzuna API configuration
    const appId = Deno.env.get('ADZUNA_APP_ID');
    const appKey = Deno.env.get('ADZUNA_APP_KEY');
    
    if (!appId || !appKey) {
      throw new Error('Adzuna API credentials not configured');
    }

    // Get salary data from Adzuna
    const salaryUrl = `https://api.adzuna.com/v1/api/jobs/gb/salary?app_id=${appId}&app_key=${appKey}&what=${encodeURIComponent(skill_name)}&results_per_page=100`;
    
    const salaryResponse = await fetch(salaryUrl);
    const salaryData = await salaryResponse.json();

    // Get job count
    const jobCountUrl = `https://api.adzuna.com/v1/api/jobs/gb/search/1?app_id=${appId}&app_key=${appKey}&what=${encodeURIComponent(skill_name)}&results_per_page=1`;
    
    const jobCountResponse = await fetch(jobCountUrl);
    const jobCountData = await jobCountResponse.json();

    const analytics = {
      skill_name,
      avg_salary: Math.round(salaryData.mean || 0),
      job_count: jobCountData.count || 0,
      growth_rate: Math.random() * 20 - 10, // Mock growth rate for demo
      region,
      updated_at: new Date().toISOString()
    };

    // Upsert analytics data
    const { error } = await supabase
      .from('job_market_analytics')
      .upsert([analytics], { 
        onConflict: 'skill_name,region' 
      });

    if (error) {
      throw error;
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        analytics 
      }),
      { 
        headers: { 
          'Content-Type': 'application/json',
          ...corsHeaders 
        } 
      }
    );

  } catch (error) {
    console.error('Error in job-market-analytics:', error);
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
