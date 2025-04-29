import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabaseClient';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

export default function SubscriptionCheck({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasSubscription, setHasSubscription] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    checkSubscription();
  }, []);

  const checkSubscription = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate('/login');
        return;
      }

      const { data: subscription, error } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', session.user.id)
        .eq('status', 'active')
        .single();

      if (error) {
        console.error('Error checking subscription:', error);
      }

      setHasSubscription(!!subscription);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!hasSubscription) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="w-[400px]">
          <CardHeader>
            <CardTitle>Subscription Required</CardTitle>
            <CardDescription>
              You need an active subscription to access this feature.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Subscribe to our Basic plan to get access to all features.
            </p>
          </CardContent>
          <CardFooter>
            <Button 
              className="w-full"
              onClick={() => navigate('/pricing')}
            >
              View Plans
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return <>{children}</>;
} 