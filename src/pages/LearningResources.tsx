import React, { useEffect, useState, useMemo } from 'react';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ExternalLink, Bookmark, BookOpen, Video, Award, Search, Filter, Check, FilterX, DollarSign } from 'lucide-react';
import { useAIInsights } from '@/hooks/useAIInsights';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/components/ui/use-toast';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface Resource {
  title: string;
  description: string;
  url: string;
  type: 'course' | 'article' | 'video' | 'documentation';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  tags: string[];
  estimatedTime?: string;
  provider?: string;
  rating?: number;
  affiliateUrl?: string;
  commissionRate?: string;
}

const LearningResources = () => {
  const { getUserProfile } = useAIInsights();
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const [savedResources, setSavedResources] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDifficulties, setSelectedDifficulties] = useState<string[]>([]);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [affiliateStats, setAffiliateStats] = useState({
    clicks: 0,
    earnings: 0,
    pendingCommissions: 0
  });
  
  useEffect(() => {
    fetchResources();
  }, []);

  const fetchResources = async () => {
    setLoading(true);
    try {
      const profile = await getUserProfile();
      setUserProfile(profile);
      
      const skills = profile?.skills || ['coding', 'web development'];
      const generatedResources = generateResourcesBySkills(skills);
      
      setResources(generatedResources);
      
      toast({
        title: "Resources loaded",
        description: `Found ${generatedResources.length} learning resources based on your profile.`,
      });
    } catch (error) {
      console.error('Error fetching resources:', error);
      toast({
        title: "Error loading resources",
        description: "Please try refreshing the page.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const generateResourcesBySkills = (skills: string[]): Resource[] => {
    const resourcesBySkill: {[key: string]: Resource[]} = {
      'coding': [
        {
          title: 'Complete Python Bootcamp',
          description: 'Learn Python like a professional! Start from basics and go to advanced topics like machine learning.',
          url: 'https://www.udemy.com/course/complete-python-bootcamp/',
          type: 'course',
          difficulty: 'beginner',
          tags: ['coding', 'python', 'programming'],
          estimatedTime: '40 hours',
          provider: 'Udemy',
          rating: 4.8,
          affiliateUrl: 'https://www.udemy.com/course/complete-python-bootcamp/?referralCode=YOUR_CODE',
          commissionRate: '30%'
        },
        {
          title: 'JavaScript: Understanding the Weird Parts',
          description: "Deep dive into JavaScript to understand concepts like closures, prototypes, and 'this'.",
          url: 'https://www.udemy.com/course/understand-javascript/',
          type: 'course',
          difficulty: 'intermediate',
          tags: ['coding', 'javascript', 'web development'],
          estimatedTime: '20 hours',
          provider: 'Udemy',
          rating: 4.9,
          affiliateUrl: 'https://www.udemy.com/course/understand-javascript/?referralCode=YOUR_CODE',
          commissionRate: '25%'
        },
        {
          title: 'Advanced Algorithms and Data Structures',
          description: 'Master complex algorithms for technical interviews and real-world engineering challenges.',
          url: 'https://www.coursera.org/specializations/algorithms',
          type: 'course',
          difficulty: 'advanced',
          tags: ['coding', 'algorithms', 'data structures'],
          estimatedTime: '50 hours',
          provider: 'Coursera',
          rating: 4.7
        },
        {
          title: 'Clean Code: Writing Code for Humans',
          description: 'Learn how to write clean, maintainable code that others (including future you) will understand.',
          url: 'https://www.pluralsight.com/courses/writing-clean-code-humans',
          type: 'course',
          difficulty: 'intermediate',
          tags: ['coding', 'best practices', 'programming'],
          estimatedTime: '3 hours',
          provider: 'Pluralsight',
          rating: 4.6
        }
      ],
      'web development': [
        {
          title: 'Modern React with Redux',
          description: 'Master React v18 and Redux with React Router, Webpack, and more!',
          url: 'https://www.udemy.com/course/react-redux/',
          type: 'course',
          difficulty: 'intermediate',
          tags: ['react', 'javascript', 'redux', 'frontend'],
          estimatedTime: '48 hours',
          provider: 'Udemy',
          rating: 4.7,
          affiliateUrl: 'https://www.udemy.com/course/react-redux/?referralCode=YOUR_CODE',
          commissionRate: '30%'
        },
        {
          title: 'Full Stack Development with MERN',
          description: 'Learn to build a full-stack web application using MongoDB, Express, React, and Node.js.',
          url: 'https://www.coursera.org/learn/mern-stack-development',
          type: 'course',
          difficulty: 'intermediate',
          tags: ['mern', 'javascript', 'mongodb', 'fullstack'],
          estimatedTime: '32 hours',
          provider: 'Coursera', 
          rating: 4.5
        },
        {
          title: 'CSS Grid Layout Mastery',
          description: 'Complete guide to CSS Grid layouts with practical examples and projects.',
          url: 'https://css-tricks.com/snippets/css/complete-guide-grid/',
          type: 'article',
          difficulty: 'intermediate',
          tags: ['css', 'frontend', 'web design'],
          provider: 'CSS-Tricks'
        },
        {
          title: 'TypeScript Deep Dive',
          description: 'Everything you need to know about TypeScript, from basic to advanced concepts.',
          url: 'https://basarat.gitbook.io/typescript/',
          type: 'documentation',
          difficulty: 'intermediate',
          tags: ['typescript', 'javascript', 'frontend', 'backend'],
          provider: 'GitBook'
        }
      ],
      'data science': [
        {
          title: 'Machine Learning A-Z',
          description: 'Learn to create Machine Learning Algorithms using Python and R.',
          url: 'https://www.udemy.com/course/machinelearning/',
          type: 'course',
          difficulty: 'intermediate',
          tags: ['data science', 'machine learning', 'AI', 'python'],
          estimatedTime: '44 hours',
          provider: 'Udemy',
          rating: 4.5
        },
        {
          title: 'Data Science Specialization',
          description: 'Build a data science skill set including data manipulation, visualization, and machine learning.',
          url: 'https://www.coursera.org/specializations/jhu-data-science',
          type: 'course',
          difficulty: 'intermediate',
          tags: ['data science', 'statistics', 'R', 'machine learning'],
          estimatedTime: '80 hours',
          provider: 'Coursera - Johns Hopkins University',
          rating: 4.6
        }
      ],
      'cloud computing': [
        {
          title: 'AWS Certified Cloud Practitioner',
          description: 'Master AWS fundamentals and prepare for the AWS Certified Cloud Practitioner exam.',
          url: 'https://aws.amazon.com/training/learn-about/cloud-practitioner/',
          type: 'course',
          difficulty: 'beginner',
          tags: ['aws', 'cloud', 'certification'],
          estimatedTime: '20 hours',
          provider: 'AWS',
          rating: 4.8
        },
        {
          title: 'Azure Fundamentals',
          description: 'Learn Azure cloud concepts, core services, security, and compliance.',
          url: 'https://docs.microsoft.com/en-us/learn/paths/azure-fundamentals/',
          type: 'documentation',
          difficulty: 'beginner',
          tags: ['azure', 'cloud', 'microsoft'],
          estimatedTime: '10 hours',
          provider: 'Microsoft',
          rating: 4.7
        }
      ],
      'cybersecurity': [
        {
          title: 'Ethical Hacking Course',
          description: 'Learn practical skills in penetration testing and ethical hacking.',
          url: 'https://www.cybrary.it/course/ethical-hacking/',
          type: 'course',
          difficulty: 'intermediate',
          tags: ['cybersecurity', 'hacking', 'security'],
          estimatedTime: '15 hours',
          provider: 'Cybrary',
          rating: 4.5
        },
        {
          title: 'NIST Cybersecurity Framework',
          description: 'In-depth guide to understanding and implementing the NIST Cybersecurity Framework.',
          url: 'https://www.nist.gov/cyberframework',
          type: 'documentation',
          difficulty: 'intermediate',
          tags: ['cybersecurity', 'framework', 'compliance'],
          provider: 'NIST'
        }
      ]
    };

    const trendingResources: Resource[] = [
      {
        title: 'Introduction to AI Engineering with Microsoft Copilot',
        description: 'Learn how to leverage AI assistants to enhance your development workflow and productivity.',
        url: 'https://learn.microsoft.com/en-us/training/modules/introduction-to-ai-engineering/',
        type: 'course',
        difficulty: 'beginner',
        tags: ['ai', 'productivity', 'microsoft'],
        estimatedTime: '4 hours',
        provider: 'Microsoft Learn',
        rating: 4.9,
        affiliateUrl: 'https://learn.microsoft.com/en-us/training/modules/introduction-to-ai-engineering/?ref=YOUR_CODE',
        commissionRate: '20%'
      },
      {
        title: 'Blockchain Fundamentals',
        description: 'Learn the core concepts behind blockchain technology and cryptocurrencies.',
        url: 'https://www.edx.org/learn/blockchain/university-of-california-berkeley-blockchain-fundamentals',
        type: 'course',
        difficulty: 'beginner',
        tags: ['blockchain', 'cryptocurrency', 'web3'],
        estimatedTime: '12 hours',
        provider: 'edX - UC Berkeley',
        rating: 4.6
      }
    ];

    let allResources: Resource[] = [...trendingResources];
    skills.forEach(skill => {
      const skillLower = skill.toLowerCase();
      
      let matchedResources: Resource[] = [];
      for (const [key, value] of Object.entries(resourcesBySkill)) {
        if (key.includes(skillLower) || skillLower.includes(key)) {
          matchedResources = [...matchedResources, ...value];
        }
      }
      
      if (matchedResources.length === 0) {
        matchedResources = resourcesBySkill['web development'];
      }
      
      allResources = [...allResources, ...matchedResources];
    });
    
    const uniqueResources = allResources.filter((resource, index, self) =>
      index === self.findIndex((r) => r.title === resource.title)
    );
    
    return uniqueResources;
  };

  const toggleSaveResource = (title: string) => {
    setSavedResources(prev => {
      if (prev.includes(title)) {
        toast({
          title: "Resource removed",
          description: "Resource removed from your saved list",
        });
        return prev.filter(r => r !== title);
      } else {
        toast({
          title: "Resource saved",
          description: "Resource added to your saved list",
        });
        return [...prev, title];
      }
    });
  };

  const toggleDifficulty = (difficulty: string) => {
    setSelectedDifficulties(prev => {
      if (prev.includes(difficulty)) {
        return prev.filter(d => d !== difficulty);
      } else {
        return [...prev, difficulty];
      }
    });
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedDifficulties([]);
    setActiveTab('all');
  };

  const trackResourceClick = (resource: Resource) => {
    setAffiliateStats(prev => ({
      ...prev,
      clicks: prev.clicks + 1,
      pendingCommissions: prev.pendingCommissions + 
        (resource.commissionRate ? 
          parseFloat(resource.commissionRate) * 0.5 : 0)
    }));
    
    toast({
      title: "Affiliate link clicked",
      description: `Tracking referral for ${resource.title}`,
    });
    
    window.open(resource.affiliateUrl || resource.url, '_blank');
  };

  const filteredResources = useMemo(() => {
    return resources.filter(resource => {
      const matchesSearchTerm = searchTerm === '' || 
        resource.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
        resource.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        resource.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesType = activeTab === 'all' || resource.type === activeTab;
      
      const matchesDifficulty = selectedDifficulties.length === 0 || 
        selectedDifficulties.includes(resource.difficulty);
      
      return matchesSearchTerm && matchesType && matchesDifficulty;
    });
  }, [resources, searchTerm, activeTab, selectedDifficulties]);

  const renderResourceIcon = (type: string) => {
    switch (type) {
      case 'course':
        return <BookOpen className="h-4 w-4" />;
      case 'video':
        return <Video className="h-4 w-4" />;
      case 'article':
        return <Award className="h-4 w-4" />;
      default:
        return <ExternalLink className="h-4 w-4" />;
    }
  };

  const allTags = useMemo(() => {
    const tags = new Set<string>();
    resources.forEach(resource => {
      resource.tags.forEach(tag => tags.add(tag));
    });
    return Array.from(tags);
  }, [resources]);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
          <div>
            <h1 className="text-3xl font-bold">Learning Resources</h1>
            <p className="text-muted-foreground mt-2">
              Discover personalized learning materials based on your skills and career goals
            </p>
          </div>
          
          <div className="bg-muted p-4 rounded-lg flex flex-col">
            <h3 className="font-medium mb-1 flex items-center gap-2">
              <DollarSign className="h-4 w-4" /> Affiliate Dashboard
            </h3>
            <div className="grid grid-cols-3 gap-2 text-sm">
              <div>
                <div className="text-muted-foreground">Clicks</div>
                <div className="font-medium">{affiliateStats.clicks}</div>
              </div>
              <div>
                <div className="text-muted-foreground">Pending</div>
                <div className="font-medium">${affiliateStats.pendingCommissions.toFixed(2)}</div>
              </div>
              <div>
                <div className="text-muted-foreground">Earned</div>
                <div className="font-medium">${affiliateStats.earnings.toFixed(2)}</div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search resources by title, description or tag..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 w-full"
            />
          </div>
          
          <div className="flex gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="flex gap-2">
                  <Filter className="h-4 w-4" />
                  <span>Difficulty</span>
                  {selectedDifficulties.length > 0 && (
                    <Badge variant="secondary" className="ml-1">{selectedDifficulties.length}</Badge>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuCheckboxItem
                  checked={selectedDifficulties.includes('beginner')}
                  onCheckedChange={() => toggleDifficulty('beginner')}
                >
                  Beginner
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={selectedDifficulties.includes('intermediate')}
                  onCheckedChange={() => toggleDifficulty('intermediate')}
                >
                  Intermediate
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={selectedDifficulties.includes('advanced')}
                  onCheckedChange={() => toggleDifficulty('advanced')}
                >
                  Advanced
                </DropdownMenuCheckboxItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
            {(searchTerm || selectedDifficulties.length > 0 || activeTab !== 'all') && (
              <Button variant="ghost" onClick={clearFilters} className="flex gap-2">
                <FilterX className="h-4 w-4" />
                Clear
              </Button>
            )}
            
            <Button variant="default" onClick={fetchResources} disabled={loading}>
              Refresh
            </Button>
          </div>
        </div>

        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="course">Courses</TabsTrigger>
            <TabsTrigger value="article">Articles</TabsTrigger>
            <TabsTrigger value="video">Videos</TabsTrigger>
            <TabsTrigger value="documentation">Docs</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="mt-0">
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <Card key={i} className="overflow-hidden">
                    <CardHeader className="pb-2">
                      <Skeleton className="h-6 w-3/4 mb-2" />
                      <Skeleton className="h-4 w-1/2" />
                    </CardHeader>
                    <CardContent className="pb-4">
                      <Skeleton className="h-16 w-full mb-4" />
                      <div className="flex gap-2 mb-4">
                        <Skeleton className="h-6 w-16 rounded-full" />
                        <Skeleton className="h-6 w-16 rounded-full" />
                      </div>
                      <div className="flex justify-between">
                        <Skeleton className="h-9 w-24" />
                        <Skeleton className="h-9 w-9 rounded-full" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : filteredResources.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredResources.map((resource, index) => (
                  <Card key={index} className="overflow-hidden h-full flex flex-col">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg line-clamp-2">{resource.title}</CardTitle>
                      <CardDescription className="flex items-center gap-1">
                        {renderResourceIcon(resource.type)}
                        <span className="capitalize">{resource.type}</span>
                        <span className="mx-1">•</span>
                        <span className="capitalize">{resource.difficulty}</span>
                        {resource.provider && (
                          <>
                            <span className="mx-1">•</span>
                            <span>{resource.provider}</span>
                          </>
                        )}
                        {resource.commissionRate && (
                          <Badge variant="outline" className="ml-2 text-xs bg-green-50 text-green-700 border-green-200">
                            <DollarSign className="h-3 w-3 mr-1" /> {resource.commissionRate}
                          </Badge>
                        )}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pb-2 flex-grow">
                      <p className="text-sm text-muted-foreground mb-4">
                        {resource.description}
                      </p>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {resource.tags.map((tag, i) => (
                          <Badge key={i} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                    <CardFooter className="pt-2">
                      <div className="flex items-center justify-between w-full">
                        <div className="flex items-center gap-2">
                          {resource.rating && (
                            <Badge variant="secondary" className="gap-1">
                              <Check className="h-3 w-3" /> {resource.rating.toFixed(1)}
                            </Badge>
                          )}
                          {resource.estimatedTime && (
                            <span className="text-xs text-muted-foreground">
                              {resource.estimatedTime}
                            </span>
                          )}
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => toggleSaveResource(resource.title)}
                                >
                                  <Bookmark
                                    className={`h-4 w-4 ${
                                      savedResources.includes(resource.title)
                                        ? 'fill-current'
                                        : ''
                                    }`}
                                  />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                {savedResources.includes(resource.title) 
                                  ? 'Remove from saved' 
                                  : 'Save resource'}
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                          
                          <Button
                            variant="default"
                            size="sm"
                            className="gap-2"
                            onClick={() => trackResourceClick(resource)}
                          >
                            <ExternalLink className="h-4 w-4" />
                            {resource.commissionRate ? 'Open (Earn Commission)' : 'Open Resource'}
                          </Button>
                        </div>
                      </div>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 border rounded-lg">
                <div className="mx-auto w-16 h-16 flex items-center justify-center rounded-full bg-muted mb-4">
                  <Search className="h-6 w-6 text-muted-foreground" />
                </div>
                <h3 className="font-semibold text-xl mb-2">No resources found</h3>
                <p className="text-muted-foreground mb-6">
                  No matching resources found for your current filters.
                </p>
                <Button variant="outline" onClick={clearFilters}>
                  Clear all filters
                </Button>
              </div>
            )}
          </TabsContent>
        </Tabs>
        
        {filteredResources.length > 0 && (
          <div className="mt-4 p-4 bg-muted rounded-lg">
            <h3 className="font-medium mb-2">Popular tags</h3>
            <div className="flex flex-wrap gap-2">
              {allTags.slice(0, 10).map((tag, i) => (
                <Badge 
                  key={i} 
                  variant={searchTerm === tag ? "default" : "secondary"}
                  className="cursor-pointer"
                  onClick={() => setSearchTerm(tag)}
                >
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default LearningResources;
