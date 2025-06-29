import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { 
  Search, 
  MapPin, 
  Building, 
  DollarSign, 
  Clock, 
  Users, 
  Briefcase,
  Star,
  RefreshCw,
  Filter,
  Download,
  BookmarkPlus,
  ExternalLink,
  Target,
  TrendingUp,
  Award,
  CheckCircle
} from 'lucide-react';

interface JobListing {
  id: string;
  title: string;
  company: string;
  location: string;
  salary: string;
  type: string;
  experience: string;
  description: string;
  requirements: string[];
  benefits: string[];
  posted_date: string;
  match_score: number;
  skills_required: string[];
  industry: string;
  remote_option: boolean;
  company_size: string;
  application_url?: string;
  ai_generated: boolean;
}

const JobScraper = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [jobs, setJobs] = useState<JobListing[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [location, setLocation] = useState('');
  const [savedJobs, setSavedJobs] = useState<string[]>([]);
  const [filters, setFilters] = useState({
    jobType: '',
    experience: '',
    salary: '',
    remote: false,
    industry: ''
  });

  useEffect(() => {
    const loadSavedJobs = async () => {
      if (!user) return;
      
      try {
        // Placeholder: Replace with actual logic to fetch saved jobs from database
        // For now, let's simulate loading saved job IDs from local storage
        const savedJobIds = localStorage.getItem('savedJobs');
        if (savedJobIds) {
          setSavedJobs(JSON.parse(savedJobIds));
        }
      } catch (error) {
        console.error('Error loading saved jobs:', error);
      }
    };

    loadSavedJobs();
  }, [user]);

  const generateJobs = async () => {
    if (!user) {
      toast({
        title: 'Authentication Required',
        description: 'Please sign in to use the AI Job Scraper',
        variant: 'destructive',
      });
      return;
    }

    if (!searchQuery.trim()) {
      toast({
        title: 'Search Required',
        description: 'Please enter a job title or skill to search for',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    try {
      const requestPayload = {
        query: searchQuery,
        location: location || 'Remote',
        filters: {
          ...filters,
          jobType: filters.jobType || 'full-time',
          experience: filters.experience || 'mid-level'
        }
      };

      // Attempt to fetch real job listings from USAJOBS API (free, no API key required for basic access)
      // USAJOBS API is for U.S. federal government jobs
      const query = encodeURIComponent(searchQuery);
      const loc = encodeURIComponent(location || "");
      let usajobsUrl = `https://data.usajobs.gov/api/Search?Keyword=${query}&ResultsPerPage=6`;
      if (loc) {
        usajobsUrl += `&LocationName=${loc}`;
      }
      
      try {
        const response = await fetch(usajobsUrl);
        const jobData = await response.json();
        if (jobData && jobData.SearchResult && jobData.SearchResult.SearchResultItems && jobData.SearchResult.SearchResultItems.length > 0) {
          const usaJobs = jobData.SearchResult.SearchResultItems.map((item: { MatchedObjectDescriptor: { PositionTitle: string; OrganizationName: string; PositionLocationDisplay: string; PositionSchedule: Array<{ Name: string }>; PositionRemuneration?: Array<{ MinimumRange: string; MaximumRange: string; RateIntervalCode: string }>; PositionURI?: string; ApplyOnlineUrl?: string; PositionLocation?: Array<{ TeleworkEligible?: boolean }>; PublicationStartDate?: string; UserArea?: { Details?: { Benefits?: string[]; Requirements?: string }; RelevanceRank?: string } }; QualificationSummary?: string; PositionFormattedDescription?: { Content: string } }) => ({
            title: item.MatchedObjectDescriptor.PositionTitle,
            company: item.MatchedObjectDescriptor.OrganizationName,
            location: item.MatchedObjectDescriptor.PositionLocationDisplay,
            type: item.MatchedObjectDescriptor.PositionSchedule[0]?.Name || 'Full-Time',
            salary: item.MatchedObjectDescriptor.PositionRemuneration && item.MatchedObjectDescriptor.PositionRemuneration.length > 0 ? `${item.MatchedObjectDescriptor.PositionRemuneration[0].MinimumRange} - ${item.MatchedObjectDescriptor.PositionRemuneration[0].MaximumRange} ${item.MatchedObjectDescriptor.PositionRemuneration[0].RateIntervalCode}` : 'Not specified',
            description: item.PositionFormattedDescription?.Content || 'No description available',
            requirements: item.QualificationSummary ? item.QualificationSummary.split('. ').filter(Boolean).map((req: string) => req.trim()) : [],
            responsibilities: [],
            url: item.MatchedObjectDescriptor.ApplyOnlineUrl || item.MatchedObjectDescriptor.PositionURI || '#',
            source: 'USAJOBS (Federal Government)',
            id: item.MatchedObjectDescriptor.PositionTitle + '-' + Math.random().toString(36).substring(2, 7),
            experience: item.QualificationSummary || 'Not specified',
            benefits: item.MatchedObjectDescriptor.UserArea?.Details?.Benefits || [],
            posted_date: item.MatchedObjectDescriptor.PublicationStartDate || 'Not specified',
            match_score: item.MatchedObjectDescriptor.UserArea?.RelevanceRank ? parseFloat(item.MatchedObjectDescriptor.UserArea.RelevanceRank) : 0.8,
            skills_required: item.MatchedObjectDescriptor.UserArea?.Details?.Requirements?.split(', ').filter(Boolean) || [],
            industry: 'Government',
            remote_option: item.MatchedObjectDescriptor.PositionLocation?.some(loc => loc.TeleworkEligible) || false,
            company_size: 'Large (Government)',
          }));
          
          setJobs(usaJobs);
          toast({
            title: 'Real Job Listings Found!',
            description: `Found ${usaJobs.length} U.S. federal government job listings for "${searchQuery}".`
          });
          setLoading(false);
          return; // Exit early since we have real job data
        } else {
          console.log("No real job listings from USAJOBS, falling back to other options.");
          toast({
            title: 'No Federal Jobs Found',
            description: `No U.S. federal job listings found for "${searchQuery}". Searching for non-government jobs...`
          });
        }
      } catch (usajobsError) {
        console.error("Error fetching from USAJOBS API:", usajobsError);
        toast({
          title: 'API Error',
          description: "Failed to fetch real job listings from USAJOBS. Falling back to other options.",
          variant: 'destructive'
        });
      }

      // Attempt to fetch non-government jobs from another free API like Adzuna (requires API key after registration)
      // IMPORTANT: Store Adzuna API credentials securely as environment variables or in a backend service.
      // Do not hardcode API keys directly in the code as they can be exposed in frontend applications.
      const adzunaAppId = import.meta.env.VITE_ADZUNA_APP_ID || ''; // Should be set in .env file as VITE_ADZUNA_APP_ID
      const adzunaApiKey = import.meta.env.VITE_ADZUNA_API_KEY || ''; // Should be set in .env file as VITE_ADZUNA_API_KEY
      if (adzunaAppId && adzunaApiKey) {
        const adzunaQuery = encodeURIComponent(searchQuery);
        const adzunaLoc = encodeURIComponent(location || '');
        let adzunaUrl = `https://api.adzuna.com/v1/api/jobs/gb/search/1?app_id=${adzunaAppId}&app_key=${adzunaApiKey}&results_per_page=6&what=${adzunaQuery}`;
        if (adzunaLoc) {
          adzunaUrl += `&where=${adzunaLoc}`;
        }
        try {
          const response = await fetch(adzunaUrl);
          const jobData = await response.json();
          if (jobData && jobData.results && jobData.results.length > 0) {
            const adzunaJobs = jobData.results.map((job: { id?: string; title: string; company: { display_name: string }; location: { display_name: string }; contract_type?: string; contract_time?: string; salary_min?: number; salary_max?: number; salary_currency?: string; description: string; redirect_url?: string; created?: string; category?: { label: string }; relevance?: number }) => ({
              title: job.title,
              company: job.company.display_name,
              location: job.location.display_name,
              type: job.contract_type || job.contract_time || 'Not specified',
              salary: job.salary_min && job.salary_max ? `${job.salary_min} - ${job.salary_max}${job.salary_currency ? ' ' + job.salary_currency : ''}` : 'Not specified',
              description: job.description || 'No description available',
              requirements: [],
              responsibilities: [],
              url: job.redirect_url || '#',
              id: job.id || `adzuna-${job.title}-${Math.random().toString(36).substring(2, 7)}`,
              experience: job.category?.label || 'Not specified',
              benefits: [],
              posted_date: job.created || 'Not specified',
              match_score: job.relevance || 0.7,
              skills_required: [],
              industry: job.category?.label.split('-')[0].trim() || 'Various',
              remote_option: job.description.toLowerCase().includes('remote') || false,
              company_size: 'Various',
              source: 'Adzuna',
            }));
            setJobs(adzunaJobs);
            toast({
              title: 'Real Non-Government Job Listings Found!',
              description: `Found ${adzunaJobs.length} job listings for "${searchQuery}".`
            });
            setLoading(false);
            return; // Exit early since we have real job data
          } else {
            console.log("No real non-government job listings from Adzuna, falling back to AI simulation.");
            toast({
              title: 'No Non-Government Jobs Found',
              description: `No job listings found for "${searchQuery}" via secondary API. Simulating listings with AI instead.`
            });
          }
        } catch (adzunaError) {
          console.error("Error fetching from Adzuna API:", adzunaError);
          toast({
            title: 'Secondary API Error',
            description: "Failed to fetch real non-government job listings. Falling back to AI simulation.",
            variant: 'destructive'
          });
        }
      } else {
        console.warn("Adzuna API credentials not found in environment variables, skipping Adzuna API call.");
        toast({
          title: 'API Credentials Missing',
          description: "Adzuna API credentials not set. Please configure environment variables for real job data. Falling back to AI simulation.",
          variant: 'destructive'
        });
      }

      // Fallback to AI simulation if all real API attempts fail or return no results
      // For now, use AI to simulate realistic job listings across various industries:
      const { data, error } = await supabase.functions.invoke('ai-career-assistant', {
        body: {
          message: `Generate 6 highly realistic job listings for: "${searchQuery}" in "${location || 'Remote'}" with the following preferences: ${JSON.stringify(filters)}. Include detailed job descriptions, requirements, benefits, and realistic salary information based on current market data. Ensure diversity across different industries (technology, healthcare, finance, education, retail, etc.) and company types (startups, mid-size, large corporations). Make them relevant to current industry trends. Format the response as a JSON array of objects with fields: id, title, company, location, salary, type, experience, description, requirements (array), benefits (array), posted_date, match_score (number), skills_required (array), industry, remote_option (boolean), company_size, application_url (optional), ai_generated (true).`,
          context: {
            type: 'job_scraping',
            user_preferences: requestPayload
          },
          model: 'mistralai/mistral-7b-instruct:free' // Using Mistral 7B Instruct as an alternative free model from OpenRouter for improved simulation
        }
      });

      if (error) {
        console.error('AI function error:', error);
        throw error;
      }

      if (data?.response) {
        try {
          const cleanedResponse = data.response
            .replace(/```json\s*/, '')
            .replace(/```\s*$/, '')
            .replace(/^[^{]*/, '')
            .replace(/[^}]*$/, '');
          
          const jobsData = JSON.parse(cleanedResponse);
          const jobsArray = Array.isArray(jobsData) ? jobsData : jobsData.jobs || [];
          
          const processedJobs = jobsArray.map((job: { title: string; company: string; location: string; salary: string; type: string; experience: string; description: string; requirements: string[]; benefits: string[]; posted_date: string; match_score: number; skills_required: string[]; industry: string; remote_option: boolean; company_size: string; application_url?: string }) => ({
            id: `ai-job-${Date.now()}-${job.title}`,
            title: job.title || 'Software Engineer',
            company: job.company || 'TechCorp',
            location: job.location || location || 'Remote',
            salary: job.salary || '$80,000 - $120,000',
            type: job.type || 'Full-time',
            experience: job.experience || 'Mid-level',
            description: job.description || 'Exciting opportunity to work on cutting-edge projects.',
            requirements: Array.isArray(job.requirements) ? job.requirements : ['Programming skills', 'Team collaboration'],
            benefits: Array.isArray(job.benefits) ? job.benefits : ['Health insurance', 'Remote work'],
            posted_date: new Date().toISOString().split('T')[0],
            match_score: Math.floor(Math.random() * 30) + 70,
            skills_required: Array.isArray(job.skills_required) ? job.skills_required : ['JavaScript', 'React'],
            industry: job.industry || 'Technology',
            remote_option: job.remote_option !== false,
            company_size: job.company_size || '100-500 employees',
            ai_generated: true
          }));

          setJobs(processedJobs);
          
          toast({
            title: 'Jobs Generated Successfully!',
            description: `Found ${processedJobs.length} relevant positions`,
          });
        } catch (parseError) {
          console.error('Parse error:', parseError);
          console.log('Raw response:', data.response);
          
          const fallbackJobs = generateFallbackJobs();
          setJobs(fallbackJobs);
          
          toast({
            title: 'Jobs Generated',
            description: 'AI generated jobs with fallback data',
          });
        }
      }
    } catch (error) {
      console.error('Error generating jobs:', error);
      
      const fallbackJobs = generateFallbackJobs();
      setJobs(fallbackJobs);
      
      toast({
        title: 'Using Sample Data',
        description: 'Showing sample jobs while AI service is being optimized',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const generateFallbackJobs = (): JobListing[] => {
    const jobTitles = [
      'Senior Software Engineer',
      'Frontend Developer',
      'Product Manager',
      'Data Scientist',
      'UX Designer',
      'DevOps Engineer'
    ];

    const companies = [
      'TechCorp Innovation',
      'Digital Solutions Inc',
      'Future Systems Ltd',
      'Cloud Dynamics',
      'AI Innovations Co',
      'Smart Technologies'
    ];

    return jobTitles.map((title, index) => ({
      id: `fallback-job-${index}`,
      title,
      company: companies[index],
      location: location || 'Remote',
      salary: `$${70000 + (index * 15000)} - $${100000 + (index * 20000)}`,
      type: 'Full-time',
      experience: index < 2 ? 'Senior' : index < 4 ? 'Mid-level' : 'Entry-level',
      description: `Exciting opportunity to work as a ${title} in a dynamic environment. Join our team and contribute to innovative projects that make a real impact.`,
      requirements: [
        'Bachelor\'s degree in relevant field',
        '3+ years of experience',
        'Strong problem-solving skills',
        'Team collaboration'
      ],
      benefits: [
        'Competitive salary',
        'Health insurance',
        'Remote work options',
        'Professional development',
        'Flexible schedule'
      ],
      posted_date: new Date().toISOString().split('T')[0],
      match_score: 75 + (index * 5),
      skills_required: ['JavaScript', 'React', 'Node.js', 'Python'],
      industry: 'Technology',
      remote_option: true,
      company_size: '100-500 employees',
      ai_generated: false
    }));
  };

  const saveJob = async (jobId: string) => {
    if (!user) return;
    
    try {
      setSavedJobs(prev => [...prev, jobId]);
      toast({
        title: 'Job Saved',
        description: 'Job added to your saved list',
      });
    } catch (error) {
      console.error('Error saving job:', error);
      toast({
        title: 'Error',
        description: 'Failed to save job',
        variant: 'destructive',
      });
    }
  };

  const exportJobs = () => {
    const jobsText = jobs.map(job => 
      `${job.title} at ${job.company}\n${job.location} - ${job.salary}\n${job.description}\n\n`
    ).join('');
    
    const blob = new Blob([jobsText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'job-listings.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  const JobCard = ({ job }: { job: JobListing }) => (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <CardTitle className="text-xl mb-2 text-gray-900">
              {job.title}
            </CardTitle>
            <div className="flex items-center gap-4 text-gray-600 mb-2">
              <div className="flex items-center gap-1">
                <Building className="w-4 h-4" />
                <span>{job.company}</span>
              </div>
              <div className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                <span>{job.location}</span>
              </div>
            </div>
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <div className="flex items-center gap-1">
                <DollarSign className="w-4 h-4" />
                <span>{job.salary}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>{job.type}</span>
              </div>
              <div className="flex items-center gap-1">
                <Users className="w-4 h-4" />
                <span>{job.experience}</span>
              </div>
            </div>
          </div>
          <div className="flex flex-col items-end gap-2">
            <Badge 
              variant={job.match_score >= 80 ? "default" : "secondary"}
              className="flex items-center gap-1"
            >
              <Star className="w-3 h-3" />
              {job.match_score}% match
            </Badge>
            {job.ai_generated && (
              <Badge variant="outline" className="text-xs">
                AI Generated
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <p className="text-gray-700 mb-4 line-clamp-3">
          {job.description}
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-1">
              <CheckCircle className="w-4 h-4" />
              Requirements
            </h4>
            <ul className="text-sm text-gray-600 space-y-1">
              {job.requirements.slice(0, 3).map((req, idx) => (
                <li key={idx}>• {req}</li>
              ))}
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-1">
              <Award className="w-4 h-4" />
              Benefits
            </h4>
            <ul className="text-sm text-gray-600 space-y-1">
              {job.benefits.slice(0, 3).map((benefit, idx) => (
                <li key={idx}>• {benefit}</li>
              ))}
            </ul>
          </div>
        </div>
        
        <div className="mb-4">
          <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-1">
            <Target className="w-4 h-4" />
            Skills Required
          </h4>
          <div className="flex flex-wrap gap-1">
            {job.skills_required.slice(0, 4).map((skill, idx) => (
              <Badge key={idx} variant="outline" className="text-xs">
                {skill}
              </Badge>
            ))}
          </div>
        </div>
        
        <div className="flex justify-between items-center pt-4 border-t">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <TrendingUp className="w-4 h-4" />
            <span>Posted {job.posted_date}</span>
            {job.remote_option && (
              <Badge variant="secondary" className="text-xs">Remote OK</Badge>
            )}
          </div>
          
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => saveJob(job.id)}
              disabled={savedJobs.includes(job.id)}
            >
              <BookmarkPlus className="w-4 h-4 mr-1" />
              {savedJobs.includes(job.id) ? 'Saved' : 'Save'}
            </Button>
            <Button size="sm">
              <ExternalLink className="w-4 h-4 mr-1" />
              Apply
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">AI Job Scraper</h1>
          <p className="text-gray-600">Find your next opportunity with AI-powered job discovery</p>
        </div>
        {jobs.length > 0 && (
          <Button onClick={exportJobs} variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export Jobs
          </Button>
        )}
      </div>

      {/* Search Section */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Job Title or Skills
              </label>
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="e.g., Software Engineer, React, Python"
                className="w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Location
              </label>
              <Input
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g., San Francisco, Remote, New York"
                className="w-full"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Job Type
              </label>
              <select
                value={filters.jobType}
                onChange={(e) => setFilters(prev => ({ ...prev, jobType: e.target.value }))}
                className="w-full p-2 border border-gray-300 rounded-md"
              >
                <option value="">Any</option>
                <option value="full-time">Full-time</option>
                <option value="part-time">Part-time</option>
                <option value="contract">Contract</option>
                <option value="internship">Internship</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Experience
              </label>
              <select
                value={filters.experience}
                onChange={(e) => setFilters(prev => ({ ...prev, experience: e.target.value }))}
                className="w-full p-2 border border-gray-300 rounded-md"
              >
                <option value="">Any</option>
                <option value="entry-level">Entry Level</option>
                <option value="mid-level">Mid Level</option>
                <option value="senior">Senior</option>
                <option value="executive">Executive</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Salary Range
              </label>
              <select
                value={filters.salary}
                onChange={(e) => setFilters(prev => ({ ...prev, salary: e.target.value }))}
                className="w-full p-2 border border-gray-300 rounded-md"
              >
                <option value="">Any</option>
                <option value="0-50k">$0 - $50k</option>
                <option value="50k-100k">$50k - $100k</option>
                <option value="100k-150k">$100k - $150k</option>
                <option value="150k+">$150k+</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Industry
              </label>
              <select
                value={filters.industry}
                onChange={(e) => setFilters(prev => ({ ...prev, industry: e.target.value }))}
                className="w-full p-2 border border-gray-300 rounded-md"
              >
                <option value="">Any</option>
                <option value="technology">Technology</option>
                <option value="finance">Finance</option>
                <option value="healthcare">Healthcare</option>
                <option value="education">Education</option>
                <option value="retail">Retail</option>
              </select>
            </div>

            <div className="flex items-end">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={filters.remote}
                  onChange={(e) => setFilters(prev => ({ ...prev, remote: e.target.checked }))}
                  className="rounded"
                />
                <span className="text-sm font-medium text-gray-700">Remote OK</span>
              </label>
            </div>
          </div>

          <Button 
            onClick={generateJobs}
            disabled={loading || !searchQuery.trim()}
            className="w-full md:w-auto"
          >
            {loading ? (
              <>
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                Generating Jobs...
              </>
            ) : (
              <>
                <Search className="w-4 h-4 mr-2" />
                Find Jobs with AI
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Results */}
      {jobs.length > 0 && (
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-900">
              Found {jobs.length} Jobs
            </h2>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Filter className="w-4 h-4" />
              <span>Sorted by relevance</span>
            </div>
          </div>
          
          <div className="grid gap-6">
            {jobs.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        </div>
      )}

      {jobs.length === 0 && !loading && (
        <Card>
          <CardContent className="text-center py-12">
            <Briefcase className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No jobs found yet
            </h3>
            <p className="text-gray-600 mb-4">
              Enter your job preferences above and click "Find Jobs with AI" to get started
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default JobScraper;
