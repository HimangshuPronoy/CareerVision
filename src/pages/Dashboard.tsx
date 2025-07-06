
import { useState, useEffect } from 'react';
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Bell, LogOut } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import DashboardSidebar from "@/components/Dashboard/DashboardSidebar";
import Overview from "@/components/Dashboard/Overview";
import CareerProfile from "@/components/Dashboard/CareerProfile";
import AICareerChat from "@/components/Dashboard/AICareerChat";
import CareerPath from "@/components/Dashboard/CareerPath";
import LearningPath from "@/components/Dashboard/LearningPath";
import SkillAnalysis from "@/components/Dashboard/SkillAnalysis";
import TaskTracker from "@/components/Dashboard/TaskTracker";
import Settings from "@/components/Dashboard/Settings";
import AuthGuard from "@/components/auth/AuthGuard";
import JobScraper from "@/components/Dashboard/JobScraper";
import EnhancedSkillAnalysis from "@/components/Dashboard/EnhancedSkillAnalysis";
import JobMarketAnalytics from "@/components/Dashboard/JobMarketAnalytics";
import SubscriptionGate from "@/components/subscription/SubscriptionGate";
import SubscriptionStatus from "@/components/subscription/SubscriptionStatus";
import { useSubscription } from "@/contexts/SubscriptionContext";
import { toast } from "sonner";

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [userName, setUserName] = useState('User');
  const { refreshSubscription } = useSubscription();

  useEffect(() => {
    loadUserName();
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === 'SIGNED_OUT') {
          window.location.href = '/auth';
        } else if (event === 'SIGNED_IN' && session) {
          setTimeout(() => {
            loadUserName();
            refreshSubscription();
          }, 100);
        }
      }
    );

    // Check for checkout success/cancel
    const urlParams = new URLSearchParams(window.location.search);
    const checkout = urlParams.get('checkout');
    if (checkout === 'success') {
      toast.success('Payment successful! Your subscription is now active.');
      refreshSubscription();
      // Clean up URL
      window.history.replaceState({}, document.title, '/dashboard');
    } else if (checkout === 'cancel') {
      toast.error('Payment cancelled. You can try again anytime.');
      // Clean up URL
      window.history.replaceState({}, document.title, '/dashboard');
    }

    return () => subscription.unsubscribe();
  }, [refreshSubscription]);

  const loadUserName = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await (supabase as any)
          .from('profiles')
          .select('first_name, last_name')
          .eq('id', user.id)
          .single();
        
        if (profile) {
          const name = [profile.first_name, profile.last_name].filter(Boolean).join(' ');
          setUserName(name || user.email?.split('@')[0] || 'User');
        } else {
          setUserName(user.email?.split('@')[0] || 'User');
        }
      }
    } catch (error) {
      console.error('Error loading user name:', error);
      setUserName('User');
    }
  };

  const handleSignOut = async () => {
    try {
      localStorage.clear();
      sessionStorage.clear();
      await supabase.auth.signOut({ scope: 'global' });
      window.location.href = '/auth';
    } catch (error) {
      console.error('Error signing out:', error);
      window.location.href = '/auth';
    }
  };

  const getTabTitle = () => {
    switch (activeTab) {
      case 'overview': return 'Dashboard';
      case 'profile': return 'Resume Builder';
      case 'ai-chat': return 'Career Mentor';
      case 'career-path': return 'Career Path';
      case 'learning-path': return 'Learning Path';
      case 'skill-analysis': return 'Skill Analysis';
      case 'task-tracker': return 'Tasks';
      case 'job-scraper': return 'Job Scraper';
      case 'analytics': return 'Job Market Analytics';
      case 'settings': return 'Settings';
      default: return 'Dashboard';
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-6">

            <Overview userName={userName} setActiveTab={setActiveTab} />
          </div>
        );
      case 'profile':
        return <CareerProfile />;
      case 'ai-chat':
        return <AICareerChat />;
      case 'career-path':
        return <CareerPath />;
      case 'learning-path':
        return <LearningPath />;
      case 'skill-analysis':
        return <EnhancedSkillAnalysis />;
      case 'task-tracker':
        return <TaskTracker />;
      case 'job-scraper':
        return <JobScraper />;
      case 'analytics':
        return <JobMarketAnalytics />;
      case 'settings':
        return <Settings />;
      default:
        return <Overview userName={userName} setActiveTab={setActiveTab} />;
    }
  };

  return (
    <AuthGuard>
      <SubscriptionGate>
        <SidebarProvider>
          <div className="min-h-screen flex w-full bg-gray-50">
            <DashboardSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
            
            <div className="flex-1 flex flex-col">
              <header className="h-16 bg-white border-b border-gray-200 flex items-center px-6 sticky top-0 z-40">
                <div className="flex items-center gap-4">
                  <SidebarTrigger className="lg:hidden" />
                  <h1 className="text-xl font-semibold text-gray-900">
                    {getTabTitle()}
                  </h1>
                </div>
                
                <div className="flex-1" />
                
                <div className="flex items-center gap-4">
                  <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-900">
                    <Bell className="h-5 w-5" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={handleSignOut}
                    className="text-gray-600 hover:text-gray-900"
                  >
                    <LogOut className="h-5 w-5" />
                  </Button>
                </div>
              </header>

              <main className="flex-1 overflow-auto">
                {renderContent()}
              </main>
            </div>
          </div>
        </SidebarProvider>
      </SubscriptionGate>
    </AuthGuard>
  );
};

export default Dashboard;
