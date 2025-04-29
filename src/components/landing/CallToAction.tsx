
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, Sparkles } from 'lucide-react';

const CallToAction = () => {
  return (
    <div className="py-24 bg-gradient-to-r from-careervision-500/10 via-transparent to-insight-500/10 dark:from-careervision-900/20 dark:via-transparent dark:to-insight-900/20">
      <div className="container px-4 md:px-6 mx-auto relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-24 -right-24 w-72 h-72 bg-insight-500/10 dark:bg-insight-500/5 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-careervision-500/10 dark:bg-careervision-500/5 rounded-full blur-3xl"></div>
        </div>
        
        <div className="relative z-10 rounded-3xl p-1 bg-gradient-to-r from-careervision-500/20 via-white/5 to-insight-500/20 dark:from-careervision-500/10 dark:via-white/5 dark:to-insight-500/10">
          <div className="bg-white dark:bg-gray-900 rounded-[22px] py-16 px-6 md:px-12 flex flex-col items-center justify-center text-center">
            <div className="inline-flex items-center gap-2 rounded-full bg-muted/80 px-4 py-1.5 text-sm font-medium mb-6">
              <Sparkles className="h-4 w-4 text-careervision-500" />
              <span>Get started in minutes</span>
            </div>
            
            <h2 className="text-3xl md:text-5xl font-bold tracking-tighter mb-6 max-w-3xl">
              Unlock the future of your career with <span className="gradient-text">data-driven insights</span>
            </h2>
            
            <p className="text-xl text-muted-foreground max-w-2xl mb-10">
              Join thousands of professionals who are using CareerVision to navigate their career paths with confidence and clarity.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/signup">
                <Button size="lg" className="rounded-full py-6 px-8 shadow-lg bg-gradient-to-r from-careervision-500 to-insight-500 hover:from-careervision-600 hover:to-insight-600 transition-all duration-300 hover:shadow-xl">
                  Start Your Free Trial <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/features">
                <Button size="lg" variant="outline" className="rounded-full py-6 px-8 shadow-md hover:shadow-lg transition-all duration-300">
                  See All Features
                </Button>
              </Link>
            </div>
            
            <p className="mt-6 text-sm text-muted-foreground">
              No credit card required. 14-day free trial.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CallToAction;
