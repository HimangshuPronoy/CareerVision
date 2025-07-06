
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search, MapPin, Building, Clock, DollarSign, ExternalLink, Loader2, TrendingUp, AlertCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  salary_min?: number;
  salary_max?: number;
  description: string;
  posted_date?: string;
  job_url?: string;
  requirements: string[];
}

const JobScraper = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [locationQuery, setLocationQuery] = useState('');
  const [totalJobs, setTotalJobs] = useState(0);
  const [hasSearched, setHasSearched] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadRecentJobs();
  }, []);

  const loadRecentJobs = async () => {
    try {
      const { data } = await (supabase as any)
        .from('jobs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(20);
      
      if (data && data.length > 0) {
        setJobs(data);
        setTotalJobs(data.length);
      }
    } catch (error) {
      console.error('Error loading jobs:', error);
    }
  };

  const scrapeJobs = async () => {
    if (!searchQuery.trim()) {
      toast({
        title: "Search Required",
        description: "Please enter a job title or keywords to search.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    setHasSearched(true);
    
    try {
      console.log('Starting job scrape with:', { 
        what: searchQuery, 
        where: locationQuery || 'london' 
      });

      const { data, error } = await supabase.functions.invoke('adzuna-job-scraper', {
        body: {
          what: searchQuery.trim(),
          where: locationQuery.trim() || 'london',
          results_per_page: 50
        }
      });

      console.log('Scrape response:', data);

      if (error) {
        console.error('Scrape error:', error);
        throw error;
      }

      if (data && data.success && data.jobs) {
        setJobs(data.jobs);
        setTotalJobs(data.total || data.jobs.length);
        toast({
          title: "Jobs Found Successfully",
          description: `Found ${data.jobs.length} jobs for "${searchQuery}"`,
        });
      } else {
        throw new Error(data?.error || 'No jobs found or invalid response');
      }
    } catch (error) {
      console.error('Error scraping jobs:', error);
      toast({
        title: "Search Failed",
        description: "Failed to search jobs. Please check your search terms and try again.",
        variant: "destructive",
      });
      setJobs([]);
      setTotalJobs(0);
    } finally {
      setLoading(false);
    }
  };

  const formatSalary = (min?: number, max?: number) => {
    if (!min && !max) return 'Salary not specified';
    if (min && max) return `£${min.toLocaleString()} - £${max.toLocaleString()}`;
    if (min) return `£${min.toLocaleString()}+`;
    return `Up to £${max?.toLocaleString()}`;
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Date not specified';
    try {
      return new Date(dateString).toLocaleDateString();
    } catch {
      return 'Date not specified';
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !loading) {
      scrapeJobs();
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Job Scraper</h1>
          <p className="text-gray-600">Search and discover jobs from Adzuna job board</p>
        </div>
        <div className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-green-600" />
          <span className="text-sm text-gray-600">
            {totalJobs > 0 ? `${totalJobs.toLocaleString()} jobs found` : 'Ready to search'}
          </span>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5 text-blue-600" />
            Job Search
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-4">
            <div className="flex-1">
              <Input
                placeholder="Job title or keywords (e.g., React Developer, Data Analyst)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={handleKeyPress}
              />
            </div>
            <div className="flex-1">
              <Input
                placeholder="Location (e.g., London, Manchester)"
                value={locationQuery}
                onChange={(e) => setLocationQuery(e.target.value)}
                onKeyPress={handleKeyPress}
              />
            </div>
            <Button 
              onClick={scrapeJobs} 
              disabled={loading || !searchQuery.trim()}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <Search className="h-4 w-4 mr-2" />
              )}
              Search Jobs
            </Button>
          </div>
          
          {!searchQuery.trim() && (
            <div className="flex items-center gap-2 text-amber-600 bg-amber-50 p-3 rounded-lg">
              <AlertCircle className="h-4 w-4" />
              <span className="text-sm">Enter job keywords to start searching</span>
            </div>
          )}
        </CardContent>
      </Card>

      {jobs.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {jobs.map((job) => (
            <Card key={job.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg text-gray-900 line-clamp-2">
                      {job.title}
                    </h3>
                    <div className="flex items-center gap-2 mt-1">
                      <Building className="h-4 w-4 text-gray-500" />
                      <span className="text-gray-600 font-medium">{job.company}</span>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2 mt-3">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <MapPin className="h-4 w-4" />
                    {job.location}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-green-600 font-medium">
                    <DollarSign className="h-4 w-4" />
                    {formatSalary(job.salary_min, job.salary_max)}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Clock className="h-4 w-4" />
                    {formatDate(job.posted_date)}
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="pt-0">
                <ScrollArea className="h-20 mb-4">
                  <p className="text-sm text-gray-700 leading-relaxed">
                    {job.description ? 
                      (job.description.length > 200 ? 
                        `${job.description.substring(0, 200)}...` : 
                        job.description
                      ) : 
                      'No description available'
                    }
                  </p>
                </ScrollArea>
                
                {job.requirements && job.requirements.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-4">
                    {job.requirements.slice(0, 3).map((req, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {req}
                      </Badge>
                    ))}
                    {job.requirements.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{job.requirements.length - 3} more
                      </Badge>
                    )}
                  </div>
                )}
                
                {job.job_url && (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full"
                    onClick={() => window.open(job.job_url, '_blank')}
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    View Job Details
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {hasSearched && jobs.length === 0 && !loading && (
        <div className="text-center py-12">
          <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No jobs found</h3>
          <p className="text-gray-600 mb-4">
            Try different keywords or location to find more opportunities
          </p>
          <Button onClick={() => {
            setSearchQuery('');
            setLocationQuery('');
            setHasSearched(false);
          }}>
            Clear Search
          </Button>
        </div>
      )}

      {!hasSearched && jobs.length === 0 && !loading && (
        <div className="text-center py-12">
          <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Ready to find your next opportunity?</h3>
          <p className="text-gray-600">Enter job keywords above to search thousands of jobs from Adzuna</p>
        </div>
      )}
    </div>
  );
};

export default JobScraper;
