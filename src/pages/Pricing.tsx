import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import MainLayout from '@/components/layouts/MainLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, CheckCircle, X } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { fetchPricingPlans, createCheckoutSession, StripePrice } from '@/integrations/stripe/api';
import { getStripe } from '@/integrations/stripe/client';
import { Badge } from '@/components/ui/badge';

const Pricing = () => {
  const [plans, setPlans] = useState<StripePrice[]>([]);
  const [loading, setLoading] = useState(true);
  const [checkoutLoading, setCheckoutLoading] = useState<string | null>(null);
  const { user } = useAuth();
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const checkoutStatus = searchParams.get('checkout');

  useEffect(() => {
    const loadPlans = async () => {
      try {
        const pricingPlans = await fetchPricingPlans();
        setPlans(pricingPlans);
      } catch (error) {
        console.error('Failed to load pricing plans:', error);
        toast({
          title: 'Error',
          description: 'Failed to load pricing plans. Please try again later.',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    loadPlans();

    // Show toast based on checkout status
    if (checkoutStatus === 'cancelled') {
      toast({
        title: 'Checkout Cancelled',
        description: 'Your checkout process was cancelled. No charges were made.',
      });
    }
  }, [toast, checkoutStatus]);

  const handleSubscribe = async (priceId: string) => {
    if (!user) {
      toast({
        title: 'Authentication Required',
        description: 'Please log in to subscribe to a plan.',
        variant: 'destructive',
      });
      return;
    }

    try {
      setCheckoutLoading(priceId);
      const sessionId = await createCheckoutSession(priceId, user.id);
      const stripe = await getStripe();
      
      if (stripe) {
        await stripe.redirectToCheckout({ sessionId });
      }
    } catch (error: any) {
      console.error('Error starting checkout:', error);
      toast({
        title: 'Checkout Error',
        description: error.message || 'Something went wrong. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setCheckoutLoading(null);
    }
  };

  const PlanFeature = ({ included, text }: { included: boolean; text: string }) => (
    <div className="flex items-center gap-2">
      {included ? (
        <CheckCircle className="h-5 w-5 text-green-500" />
      ) : (
        <X className="h-5 w-5 text-red-500" />
      )}
      <span className={included ? 'text-foreground' : 'text-muted-foreground'}>{text}</span>
    </div>
  );

  return (
    <MainLayout>
      <div className="container px-4 py-12 md:py-24 max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Choose Your Plan</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Select the perfect plan for your career journey. Upgrade anytime as your needs grow.
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-2">Loading pricing plans...</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Free Plan */}
            <Card className="flex flex-col h-full border-2 border-muted hover:border-primary/50 transition-colors">
              <CardHeader>
                <CardTitle className="flex flex-col gap-2">
                  Free
                  <Badge variant="outline" className="self-start">
                    Limited Access
                  </Badge>
                </CardTitle>
                <CardDescription>Get started with basic features</CardDescription>
                <div className="mt-4">
                  <span className="text-4xl font-bold">$0</span>
                  <span className="text-muted-foreground">/forever</span>
                </div>
              </CardHeader>
              <CardContent className="flex-grow">
                <div className="space-y-4">
                  <PlanFeature included={true} text="Basic career insights" />
                  <PlanFeature included={true} text="Limited dashboard access" />
                  <PlanFeature included={true} text="Resume builder (basic)" />
                  <PlanFeature included={false} text="Advanced skill analysis" />
                  <PlanFeature included={false} text="Market trend reports" />
                  <PlanFeature included={false} text="Personalized career paths" />
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full" disabled={true}>
                  Current Plan
                </Button>
              </CardFooter>
            </Card>

            {/* Subscription Plans */}
            {plans.map((plan) => (
              <Card 
                key={plan.id} 
                className={`flex flex-col h-full ${
                  plan.interval === 'year'
                    ? 'border-2 border-primary shadow-lg relative' 
                    : 'border-2 border-muted hover:border-primary/50 transition-colors'
                }`}
              >
                {plan.interval === 'year' && (
                  <div className="absolute top-0 right-0 transform translate-x-2 -translate-y-2">
                    <Badge className="bg-primary text-primary-foreground">Popular</Badge>
                  </div>
                )}
                <CardHeader>
                  <CardTitle>{plan.name}</CardTitle>
                  <CardDescription>{plan.description}</CardDescription>
                  <div className="mt-4">
                    <span className="text-4xl font-bold">
                      ${(plan.unit_amount / 100).toFixed(2)}
                    </span>
                    <span className="text-muted-foreground">
                      /{plan.interval}
                    </span>
                  </div>
                </CardHeader>
                <CardContent className="flex-grow">
                  <div className="space-y-4">
                    {plan.features?.map((feature, index) => (
                      <PlanFeature key={index} included={true} text={feature} />
                    ))}
                  </div>
                </CardContent>
                <CardFooter>
                  <Button 
                    className="w-full" 
                    onClick={() => handleSubscribe(plan.id)}
                    disabled={checkoutLoading === plan.id}
                  >
                    {checkoutLoading === plan.id ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      'Subscribe'
                    )}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
        
        <div className="mt-16 text-center max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold mb-4">Money-Back Guarantee</h2>
          <p className="text-muted-foreground">
            All paid plans come with a 14-day money-back guarantee. If you're not satisfied, 
            we'll refund your payment. No questions asked.
          </p>
        </div>
      </div>
    </MainLayout>
  );
};

export default Pricing; 