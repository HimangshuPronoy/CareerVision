
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Crown, RefreshCw, Settings } from "lucide-react";
import { useSubscription } from "@/contexts/SubscriptionContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const SubscriptionStatus = () => {
  const { subscriptionData, loading, refreshSubscription } = useSubscription();
  const [portalLoading, setPortalLoading] = React.useState(false);

  const handleManageSubscription = async () => {
    setPortalLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('customer-portal');
      if (error) throw error;
      window.open(data.url, '_blank');
    } catch (error) {
      console.error('Error opening customer portal:', error);
      toast.error('Failed to open subscription management. Please try again.');
    } finally {
      setPortalLoading(false);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <RefreshCw className="h-5 w-5 animate-spin mr-2" />
            <span>Loading subscription status...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!subscriptionData.subscribed) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Crown className="h-5 w-5" />
            Subscription Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Badge variant="outline" className="mb-4">No Active Subscription</Badge>
          <p className="text-gray-600 mb-4">
            Subscribe to unlock all premium features.
          </p>
          <Button onClick={refreshSubscription} variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh Status
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-green-50 border-green-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-green-800">
          <Crown className="h-5 w-5" />
          Subscription Status
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Badge className="bg-green-500 text-white">
              {subscriptionData.subscription_tier} Plan
            </Badge>
            <Badge variant="outline" className="text-green-700 border-green-300">
              Active
            </Badge>
          </div>
          
          {subscriptionData.subscription_end && (
            <p className="text-sm text-gray-600">
              {subscriptionData.subscription_tier === 'Lifetime' ? 
                'Lifetime access - no expiration' :
                `Renews on ${new Date(subscriptionData.subscription_end).toLocaleDateString()}`
              }
            </p>
          )}
          
          <div className="flex gap-2">
            <Button 
              onClick={handleManageSubscription} 
              disabled={portalLoading}
              variant="outline" 
              size="sm"
            >
              <Settings className="h-4 w-4 mr-2" />
              {portalLoading ? 'Loading...' : 'Manage Subscription'}
            </Button>
            <Button onClick={refreshSubscription} variant="outline" size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SubscriptionStatus;
