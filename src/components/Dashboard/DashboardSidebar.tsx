import { Home, User, MessageCircle, BarChart3, Settings, HelpCircle, TrendingUp, MapPin, Briefcase, Search, Target, CheckSquare, BookOpen } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
} from "@/components/ui/sidebar";

interface DashboardSidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const DashboardSidebar = ({ activeTab, setActiveTab }: DashboardSidebarProps) => {
  const menuItems = [
    { 
      title: "Dashboard", 
      icon: Home, 
      id: "overview",
      color: "text-blue-600"
    },
    { 
      title: "Tasks", 
      icon: CheckSquare, 
      id: "task-tracker",
      color: "text-green-600"
    },
    { 
      title: "Skill Analysis", 
      icon: TrendingUp, 
      id: "skill-analysis",
      color: "text-purple-600"
    },
    { 
      title: "Job Scraper", 
      icon: Search, 
      id: "job-scraper",
      color: "text-orange-600"
    },
    { 
      title: "Job Market", 
      icon: BarChart3, 
      id: "analytics",
      color: "text-red-600"
    },
    { 
      title: "Career Mentor", 
      icon: MessageCircle, 
      id: "ai-chat",
      color: "text-indigo-600"
    },
    { 
      title: "Resume Builder", 
      icon: User, 
      id: "profile",
      color: "text-teal-600"
    },
    { 
      title: "Career Path", 
      icon: MapPin, 
      id: "career-path",
      color: "text-pink-600"
    },
    { 
      title: "Learning Path", 
      icon: BookOpen, 
      id: "learning-path",
      color: "text-amber-600"
    },
  ];

  const bottomItems = [
    { 
      title: "Settings", 
      icon: Settings, 
      id: "settings",
      color: "text-gray-600"
    },
  ];

  return (
    <Sidebar className="w-64 bg-white border-r border-gray-200">
      <SidebarHeader className="p-4 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <Target className="h-5 w-5 text-white" />
          </div>
          <span className="text-lg font-semibold text-gray-900">CareerVision</span>
        </div>
      </SidebarHeader>

      <SidebarContent className="flex-1 py-4">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1 px-2">
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full px-3 py-2 rounded-lg transition-colors ${
                      activeTab === item.id 
                        ? "bg-blue-600 text-white" 
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    <item.icon className={`h-5 w-5 ${
                      activeTab === item.id ? "text-white" : item.color
                    }`} />
                    <span className="ml-3 font-medium">{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4 border-t border-gray-200">
        <SidebarMenu>
          {bottomItems.map((item) => (
            <SidebarMenuItem key={item.id}>
              <SidebarMenuButton
                onClick={() => setActiveTab(item.id)}
                className={`w-full px-3 py-2 rounded-lg transition-colors ${
                  activeTab === item.id 
                    ? "bg-gray-100 text-gray-900" 
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                <item.icon className="h-5 w-5" />
                <span className="ml-3 font-medium">{item.title}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
};

export default DashboardSidebar;
