
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { ArrowRight, BarChart2, LineChart, TrendingUp } from 'lucide-react';

const Hero = () => {
  return (
    <div className="relative overflow-hidden">
      {/* Background gradient and shapes */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-muted/50 z-0"></div>
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] rounded-full bg-careervision-500/10 blur-3xl"></div>
        <div className="absolute top-[20%] -right-[10%] w-[40%] h-[40%] rounded-full bg-insight-500/10 blur-3xl"></div>
        <div className="absolute -bottom-[10%] left-[30%] w-[40%] h-[40%] rounded-full bg-careervision-500/10 blur-3xl"></div>
      </div>

      <div className="container px-4 md:px-6 mx-auto relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-8 py-16 md:py-24">
          <div className="flex-1 space-y-6 text-center lg:text-left">
            <div className="space-y-2 animate-fade-in">
              <h1 className="text-4xl md:text-6xl font-bold tracking-tighter">
                <span className="gradient-text">Visualize</span> Your Career Path
              </h1>
              <p className="text-xl md:text-2xl text-muted-foreground">
                Data-driven insights to navigate your career journey with confidence.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start animate-slide-up">
              <Link to="/signup">
                <Button size="lg" className="rounded-full shadow-md bg-gradient-to-r from-careervision-500 to-insight-500 hover:from-careervision-600 hover:to-insight-600 transition-all duration-300 hover:shadow-xl">
                  Get Started <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link to="/features">
                <Button size="lg" variant="outline" className="rounded-full shadow-md hover:shadow-lg transition-all duration-300">
                  Learn More
                </Button>
              </Link>
            </div>

            <div className="pt-6 flex items-center justify-center lg:justify-start space-x-8 text-sm animate-fade-in">
              <div className="flex items-center space-x-2">
                <TrendingUp className="h-5 w-5 text-careervision-500" />
                <span>Market Analysis</span>
              </div>
              <div className="flex items-center space-x-2">
                <BarChart2 className="h-5 w-5 text-insight-500" />
                <span>Skill Insights</span>
              </div>
              <div className="flex items-center space-x-2">
                <LineChart className="h-5 w-5 text-careervision-500" />
                <span>Career Tracking</span>
              </div>
            </div>
          </div>

          <div className="flex-1 w-full max-w-[600px]">
            <div className="relative p-1 glass-card rounded-3xl shadow-2xl overflow-hidden animate-fade-in">
              <AspectRatio ratio={16 / 12} className="bg-muted rounded-2xl overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-full h-full p-4 rounded-2xl bg-gradient-to-tr from-careervision-500/5 via-transparent to-insight-500/5">
                    <div className="w-full h-full rounded-xl bg-white/70 dark:bg-gray-800/70 shadow-lg backdrop-blur-sm p-4 flex flex-col">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex space-x-2">
                          <div className="w-3 h-3 rounded-full bg-red-500"></div>
                          <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                          <div className="w-3 h-3 rounded-full bg-green-500"></div>
                        </div>
                        <div className="text-xs text-gray-500">Career Dashboard</div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div className="col-span-1 h-24 bg-careervision-100 dark:bg-gray-700 rounded-lg shadow-sm flex items-center justify-center p-4">
                          <div className="w-full h-full flex flex-col items-center justify-center">
                            <TrendingUp className="h-8 w-8 text-careervision-500 mb-2" />
                            <div className="text-sm font-medium">Trend Analysis</div>
                          </div>
                        </div>
                        <div className="col-span-1 h-24 bg-insight-100 dark:bg-gray-700 rounded-lg shadow-sm flex items-center justify-center p-4">
                          <div className="w-full h-full flex flex-col items-center justify-center">
                            <BarChart2 className="h-8 w-8 text-insight-500 mb-2" />
                            <div className="text-sm font-medium">Skills Match</div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex-1 bg-gray-100 dark:bg-gray-700 rounded-lg shadow-sm p-3">
                        <div className="w-full h-4 bg-gray-200 dark:bg-gray-600 rounded-full mb-3"></div>
                        <div className="w-3/4 h-4 bg-gray-200 dark:bg-gray-600 rounded-full mb-3"></div>
                        <div className="w-5/6 h-4 bg-gray-200 dark:bg-gray-600 rounded-full mb-3"></div>
                        <div className="w-2/3 h-4 bg-gray-200 dark:bg-gray-600 rounded-full"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </AspectRatio>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
