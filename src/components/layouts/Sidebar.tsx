import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { LayoutDashboard, BarChart2, TrendingUp, User, Settings, FileText, Award, CreditCard } from 'lucide-react';

const navItems = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Market Trends', href: '/trends', icon: BarChart2 },
  { name: 'Skills Analysis', href: '/skills', icon: Award },
  { name: 'Career Paths', href: '/career-paths', icon: TrendingUp },
  { name: 'Resume Builder', href: '/resume', icon: FileText },
  { name: 'Pricing', href: '/pricing', icon: CreditCard },
  { name: 'Profile', href: '/profile', icon: User },
  { name: 'Settings', href: '/settings', icon: Settings },
];

const Sidebar = () => {
  const location = useLocation();

  return (
    <div className="hidden md:flex md:flex-shrink-0">
      <div className="flex flex-col w-64">
        <div className="flex flex-col flex-grow bg-sidebar text-sidebar-foreground border-r border-sidebar-border pt-5 pb-4 overflow-y-auto">
          <div className="flex items-center flex-shrink-0 px-4">
            <Link to="/dashboard" className="flex items-center">
              <span className="text-xl font-bold text-white">CareerVision</span>
            </Link>
          </div>
          <div className="mt-8 flex-grow flex flex-col">
            <nav className="flex-1 px-2 space-y-1">
              {navItems.map((item) => {
                const isActive = location.pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={cn(
                      "group flex items-center px-2 py-2 text-sm font-medium rounded-md",
                      isActive
                        ? "bg-sidebar-accent text-sidebar-accent-foreground"
                        : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                    )}
                  >
                    <item.icon className={cn(
                      "mr-3 flex-shrink-0 h-5 w-5",
                      isActive
                        ? "text-sidebar-primary"
                        : "text-sidebar-foreground group-hover:text-sidebar-primary"
                    )} />
                    {item.name}
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
