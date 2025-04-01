
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Bell, Search, Menu, LogOut } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface TopBarProps {
  onSidebarToggle?: () => void;
}

const TopBar = ({ onSidebarToggle }: TopBarProps) => {
  const { toast } = useToast();
  const { user, signOut } = useAuth();

  const handleNotificationClick = () => {
    toast({
      title: "Notifications",
      description: "You have no new notifications at this time.",
    });
  };

  const handleSignOut = async () => {
    await signOut();
  };

  // Get first letter of user's name or email for avatar
  const getUserInitial = () => {
    if (!user) return '';
    
    const name = user.user_metadata?.full_name || user.email || '';
    return name.charAt(0).toUpperCase();
  };

  return (
    <header className="bg-white dark:bg-gray-900 shadow-sm">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <button
              type="button"
              className="px-4 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-careervision-500 md:hidden"
              onClick={onSidebarToggle}
            >
              <span className="sr-only">Open sidebar</span>
              <Menu className="h-6 w-6" />
            </button>
            <div className="flex-1 flex items-center justify-center px-2 lg:ml-6 lg:justify-end">
              <div className="max-w-lg w-full lg:max-w-xs">
                <label htmlFor="search" className="sr-only">Search</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400" />
                  </div>
                  <Input
                    id="search"
                    name="search"
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white dark:bg-gray-800 placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:border-careervision-500 focus:ring-1 focus:ring-careervision-500 sm:text-sm"
                    placeholder="Search for skills, jobs, industries..."
                    type="search"
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center">
            <Button
              variant="ghost"
              size="icon"
              className="ml-4 text-gray-400 hover:text-gray-500"
              onClick={handleNotificationClick}
            >
              <span className="sr-only">View notifications</span>
              <Bell className="h-6 w-6" />
            </Button>
            
            {user && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="ml-2 text-gray-400 hover:text-gray-500"
                      onClick={handleSignOut}
                    >
                      <span className="sr-only">Sign out</span>
                      <LogOut className="h-5 w-5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Sign out</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
            
            <div className="ml-4 flex items-center">
              <div className="h-8 w-8 rounded-full bg-careervision-500 flex items-center justify-center text-white">
                <span className="text-sm font-medium">{getUserInitial()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default TopBar;
