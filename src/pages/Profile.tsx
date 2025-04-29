
import React from 'react';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ProfileForm from '@/components/profile/ProfileForm';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Bell, Mail, Shield } from 'lucide-react';

const Profile = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Profile Settings</h1>
          <p className="text-muted-foreground">
            Manage your profile information and preferences.
          </p>
        </div>
        
        <Tabs defaultValue="profile" className="space-y-4">
          <TabsList>
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="privacy">Privacy</TabsTrigger>
          </TabsList>
          
          <TabsContent value="profile" className="space-y-4">
            <ProfileForm />
          </TabsContent>
          
          <TabsContent value="notifications" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
                <CardDescription>
                  Choose what updates you want to receive and how.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between space-x-2">
                  <div className="flex items-center space-x-4">
                    <Bell className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Job Recommendations</p>
                      <p className="text-sm text-muted-foreground">
                        Get notified about new job opportunities matching your profile.
                      </p>
                    </div>
                  </div>
                  <Switch id="job-notifications" defaultChecked />
                </div>
                
                <div className="flex items-center justify-between space-x-2">
                  <div className="flex items-center space-x-4">
                    <Bell className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Skill Development</p>
                      <p className="text-sm text-muted-foreground">
                        Receive updates on new skills in demand for your career path.
                      </p>
                    </div>
                  </div>
                  <Switch id="skill-notifications" defaultChecked />
                </div>
                
                <div className="flex items-center justify-between space-x-2">
                  <div className="flex items-center space-x-4">
                    <Mail className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Email Digest</p>
                      <p className="text-sm text-muted-foreground">
                        Weekly summary of career insights and recommendations.
                      </p>
                    </div>
                  </div>
                  <Switch id="email-digest" defaultChecked />
                </div>
                
                <div className="flex items-center justify-between space-x-2">
                  <div className="flex items-center space-x-4">
                    <Mail className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Marketing Communications</p>
                      <p className="text-sm text-muted-foreground">
                        Receive updates about new features and special offers.
                      </p>
                    </div>
                  </div>
                  <Switch id="marketing-communications" />
                </div>
                
                <Button className="w-full md:w-auto">Save Preferences</Button>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="privacy" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Privacy Settings</CardTitle>
                <CardDescription>
                  Control your data and privacy preferences.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between space-x-2">
                  <div className="flex items-center space-x-4">
                    <Shield className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Profile Visibility</p>
                      <p className="text-sm text-muted-foreground">
                        Make your profile visible to potential employers.
                      </p>
                    </div>
                  </div>
                  <Switch id="profile-visibility" defaultChecked />
                </div>
                
                <div className="flex items-center justify-between space-x-2">
                  <div className="flex items-center space-x-4">
                    <Shield className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Data Analytics</p>
                      <p className="text-sm text-muted-foreground">
                        Allow us to analyze your profile data for better recommendations.
                      </p>
                    </div>
                  </div>
                  <Switch id="data-analytics" defaultChecked />
                </div>
                
                <div className="flex items-center justify-between space-x-2">
                  <div className="flex items-center space-x-4">
                    <Shield className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Third-Party Sharing</p>
                      <p className="text-sm text-muted-foreground">
                        Share your anonymized data with our analytics partners.
                      </p>
                    </div>
                  </div>
                  <Switch id="third-party-sharing" />
                </div>
                
                <div className="space-y-2">
                  <Button className="w-full md:w-auto">Save Privacy Settings</Button>
                  <Button variant="outline" className="w-full md:w-auto mt-2">
                    Download My Data
                  </Button>
                  <Button variant="destructive" className="w-full md:w-auto mt-2">
                    Delete Account
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default Profile;
