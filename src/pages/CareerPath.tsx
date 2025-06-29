import { useState, useEffect } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { TrendingUp, MapPin, Target, Clock, Star, Zap, Sparkles, Award } from 'lucide-react';
import Timeline from '@/components/Timeline';
import BadgeWithConfetti from '@/components/BadgeWithConfetti';

const CareerPath = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [targetCareer, setTargetCareer] = useState('');
  const [careerPath, setCareerPath] = useState<{ title: string; summary: string; steps: Array<{ title: string; description: string; duration: string; skills_to_acquire: string[]; resources: string[] }>; potential_challenges: string[]; tailored_advice: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [savedPaths, setSavedPaths] = useState<any[]>([]);
  const [earnedBadges, setEarnedBadges] = useState<string[]>([]);

  const generateCareerPath = async () => {
    if (!targetCareer.trim()) {
      toast({
        title: 'Career Required',
        description: 'Please enter a target career or job title.',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    try {
      const geminiApiKey = import.meta.env.VITE_GEMINI_API_KEY || '';
      if (geminiApiKey) {
        // Use Gemini 2.0 Flash directly if API key is available
        const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=' + geminiApiKey, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: [{
              parts: [{
                text: `Create a detailed career transition plan from a starting point to ${targetCareer} for a user with no specified details. Format the response as a JSON object with fields: title, summary, steps (array of objects with title, description, duration, skills_to_acquire (array), resources (array)), potential_challenges (array), tailored_advice (string).`
              }]
            }]
          }),
        });

        const data = await response.json();
        if (data && data.candidates && data.candidates[0].content && data.candidates[0].content.parts) {
          const textResponse = data.candidates[0].content.parts[0].text;
          const cleanedResponse = textResponse
            .replace(/```json\s*/, '')
            .replace(/```\s*$/, '')
            .replace(/^[^{]*/, '')
            .replace(/[^}]*$/, '');
          const careerData = JSON.parse(cleanedResponse);
          setCareerPath(careerData);
          toast({
            title: 'Career Path Generated!',
            description: 'Your personalized career transition plan is ready.',
          });
        } else {
          throw new Error('Invalid response format from Gemini API');
        }
      } else {
        // Fallback to existing mock data if Gemini API key is not available
        console.warn("Gemini API key not found, falling back to mock data.");
        const mockPath = {
          title: 'Career Path to ' + targetCareer,
          summary: 'A personalized career roadmap to achieve your goals',
          steps: [
            {
              title: 'Build Foundation Skills',
              description: `Start with fundamental skills needed for ${targetCareer}`,
              duration: '3-6 months',
              skills_to_acquire: ['Problem Solving', 'Communication', 'Technical Basics'],
              resources: ['Online Courses', 'Books', 'Networking Events']
            },
            {
              title: 'Gain Practical Experience',
              description: 'Apply your skills through projects and internships',
              duration: '6-12 months',
              skills_to_acquire: ['Project Management', 'Industry Knowledge', 'Networking'],
              resources: ['Personal Projects', 'Internships', 'Volunteer Work']
            },
            {
              title: 'Advance Your Expertise',
              description: 'Develop specialized skills and leadership abilities',
              duration: '1-2 years',
              skills_to_acquire: ['Leadership', 'Strategic Thinking', 'Advanced Technical Skills'],
              resources: ['Mentorship', 'Conferences', 'Online Communities']
            }
          ],
          potential_challenges: ['Limited job opportunities', 'High competition', 'Continuous learning required'],
          tailored_advice: 'Focus on building a strong foundation in ' + targetCareer + ' and stay adaptable to industry changes.'
        };
        setCareerPath(mockPath);
        toast({
          title: 'Career Path Generated!',
          description: 'Your personalized career transition plan is ready.',
        });
      }
    } catch (error) {
      console.error('Error generating career path:', error);
      toast({
        title: 'Generation Failed',
        description: 'Please try again later.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleBadgeEarned = (badgeTitle) => {
    setEarnedBadges(prev => [...prev, badgeTitle]);
  };

  return (
    <ProtectedRoute>
      <div className="flex min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
        <main className="flex-1 p-8">
          <div className="max-w-6xl mx-auto space-y-8">
            {/* Header */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-600 p-8 text-white">
              <div className="absolute inset-0 bg-black/10"></div>
              <div className="relative flex items-center justify-between">
                <div className="space-y-2">
                  <h1 className="text-4xl font-bold">Career Path Generator</h1>
                  <p className="text-emerald-100 text-lg">Discover your personalized roadmap to career success</p>
                </div>
                <div className="flex items-center space-x-3">
                  <Badge variant="secondary" className="bg-white/20 text-white border-white/30 backdrop-blur-sm">
                    <MapPin className="w-4 h-4 mr-1" />
                    AI Roadmap
                  </Badge>
                  <Badge variant="secondary" className="bg-white/20 text-white border-white/30 backdrop-blur-sm">
                    <Target className="w-4 h-4 mr-1" />
                    Goal Oriented
                  </Badge>
                </div>
              </div>
            </div>

            {/* Input Section */}
            <Card className="border-0 shadow-xl">
              <CardHeader className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-t-lg">
                <CardTitle className="flex items-center text-gray-900">
                  <Target className="w-6 h-6 mr-2 text-emerald-600" />
                  Generate Your Career Path
                </CardTitle>
                <p className="text-gray-600">Enter your target career to get a personalized roadmap</p>
              </CardHeader>
              <CardContent className="p-8">
                <div className="flex space-x-4">
                  <Input
                    placeholder="e.g., Senior Software Engineer, Product Manager, Data Scientist"
                    value={targetCareer}
                    onChange={(e) => setTargetCareer(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && generateCareerPath()}
                    className="flex-1 border-2 border-gray-200 focus:border-emerald-500 rounded-xl h-12 text-lg"
                  />
                  <Button
                    onClick={generateCareerPath}
                    disabled={loading}
                    className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-xl px-8 h-12 shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    {loading ? (
                      <>
                        <Zap className="w-5 h-5 mr-2 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-5 h-5 mr-2" />
                        Generate Path
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Career Path Results */}
            {careerPath && (
              <Card className="border-0 shadow-xl">
                <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-lg">
                  <CardTitle className="flex items-center text-gray-900">
                    <TrendingUp className="w-6 h-6 mr-2 text-blue-600" />
                    Your Career Path: {targetCareer}
                  </CardTitle>
                  <p className="text-gray-600">AI-generated roadmap to achieve your career goals</p>
                </CardHeader>
                <CardContent className="p-8">
                  {/* Career Steps */}
                  {careerPath.steps && careerPath.steps.length > 0 && (
                    <div className="space-y-6 mb-8">
                      <h3 className="text-xl font-semibold text-gray-900 flex items-center">
                        <MapPin className="w-5 h-5 mr-2 text-emerald-600" />
                        Career Steps
                      </h3>
                      <div className="relative">
                        <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-emerald-500 to-teal-500"></div>
                        <div className="space-y-8">
                          {careerPath.steps.map((step: any, index: number) => (
                            <div key={index} className="relative flex items-start space-x-6">
                              <div className="relative z-10 w-12 h-12 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white font-bold shadow-lg">
                                {index + 1}
                              </div>
                              <div className="flex-1 bg-gradient-to-r from-white to-gray-50 p-6 rounded-2xl border-2 border-gray-200 hover:border-emerald-300 transition-all duration-300 shadow-md hover:shadow-lg">
                                <div className="flex items-center justify-between mb-3">
                                  <h4 className="text-lg font-semibold text-gray-900">{step.title}</h4>
                                  {step.duration && (
                                    <Badge variant="outline" className="bg-emerald-100 text-emerald-800 border-emerald-200">
                                      <Clock className="w-3 h-3 mr-1" />
                                      {step.duration}
                                    </Badge>
                                  )}
                                </div>
                                <p className="text-gray-700 mb-4">{step.description}</p>
                                {step.skills_to_acquire && (
                                  <div className="flex flex-wrap gap-2">
                                    {step.skills_to_acquire.map((skill: string, skillIndex: number) => (
                                      <Badge key={skillIndex} variant="secondary" className="bg-blue-100 text-blue-800">
                                        {skill}
                                      </Badge>
                                    ))}
                                  </div>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Key Skills */}
                  {careerPath.steps && careerPath.steps.length > 0 && (
                    <div className="mb-8">
                      <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                        <Star className="w-5 h-5 mr-2 text-yellow-600" />
                        Key Skills to Develop
                      </h3>
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                        {careerPath.steps.flatMap((step: any) => step.skills_to_acquire).map((skill: string, index: number) => (
                          <div key={index} className="p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl border-2 border-yellow-200 hover:border-yellow-400 transition-colors">
                            <p className="font-medium text-yellow-800">{skill}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Recommendations */}
                  {careerPath.tailored_advice && (
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                        <Award className="w-5 h-5 mr-2 text-purple-600" />
                        Recommendations
                      </h3>
                      <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-2xl border-2 border-purple-200">
                        <p className="text-gray-800 leading-relaxed">{careerPath.tailored_advice}</p>
                      </div>
                    </div>
                  )}

                  {/* Career Timeline */}
                  <Card className="mb-8 shadow-lg border-2 border-indigo-100 overflow-hidden">
                    <CardHeader className="bg-gradient-to-r from-indigo-50 to-blue-50 p-4">
                      <CardTitle className="text-xl text-center text-indigo-900">Career Transition Timeline</CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                      <Timeline steps={careerPath.steps} />
                    </CardContent>
                  </Card>

                  {/* Achievement Badges */}
                  <div className="mt-8">
                    <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                      <Award className="w-5 h-5 mr-2 text-yellow-600" />
                      Earn Achievement Badges
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {careerPath.steps && careerPath.steps.map((step, index) => (
                        <div key={index} className="flex justify-center">
                          <BadgeWithConfetti 
                            title={step.title} 
                            onEarned={handleBadgeEarned} 
                          />
                        </div>
                      ))}
                    </div>
                    {earnedBadges.length > 0 && (
                      <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200 text-center">
                        <p className="text-green-800 font-medium">You've earned {earnedBadges.length} badge(s)! Share your progress on social media!</p>
                        <div className="mt-2 flex justify-center flex-wrap gap-2">
                          {earnedBadges.map((badge, index) => (
                            <Badge key={index} className="bg-green-100 text-green-800">{badge}</Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
};

export default CareerPath;
