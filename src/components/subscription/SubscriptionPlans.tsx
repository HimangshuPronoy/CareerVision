import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { stripePromise } from '@/lib/stripe';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

interface PlanFeature {
  text: string;
  included: boolean;
}

interface Plan {
  name: string;
  price: string;
  description: string;
  features: PlanFeature[];
  priceId: string;
  interval: 'month' | 'year';
}

const plans: Plan[] = [
  {
    name: 'Monthly Pro',
    price: '$14.99',
    description: 'Professional features billed monthly',
    priceId: 'price_1RJumRJjRarA6eH84kygqd80',
    interval: 'month',
    features: [
      { text: 'Advanced Career Path Analysis', included: true },
      { text: 'Unlimited Skill Assessments', included: true },
      { text: 'Advanced Resume Builder', included: true },
      { text: 'Priority Email Support', included: true },
      { text: 'Advanced AI Insights', included: true },
      { text: 'Priority Support', included: true },
    ],
  },
  {
    name: 'Yearly Pro',
    price: '$129.99',
    description: 'Save 28% with annual billing',
    priceId: 'price_1RJumvJjRarA6eH8KTvJCoGL',
    interval: 'year',
    features: [
      { text: 'All Monthly Pro Features', included: true },
      { text: 'Priority Support', included: true },
      { text: 'Early Access to New Features', included: true },
      { text: 'Custom Career Roadmap', included: true },
      { text: 'Dedicated Account Manager', included: true },
      { text: '28% Discount', included: true },
    ],
  },
];

export const SubscriptionPlans = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = React.useState<string | null>(null);

  const handleSubscribe = async (priceId: string) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to subscribe to a plan.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsLoading(priceId);
      
      // Create a Stripe Checkout Session on your Supabase Edge Function
      const { data, error } = await supabase.functions.invoke('create-checkout-session', {
        body: { 
          priceId, 
          userId: user.id,
          successUrl: `${window.location.origin}/subscription/success`,
          cancelUrl: `${window.location.origin}/subscription/cancel`
        }
      });

      if (error) throw error;

      // Redirect to Stripe Checkout
      const stripe = await stripePromise;
      if (!stripe) throw new Error('Stripe failed to load');

      const { error: stripeError } = await stripe.redirectToCheckout({
        sessionId: data.sessionId,
      });

      if (stripeError) throw stripeError;
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Subscription Error",
        description: error.message || "Failed to start subscription process. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(null);
    }
  };

  return (
    <div className="py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Choose Your Plan
          </h2>
          <p className="mt-4 text-lg text-gray-500">
            Select the plan that best fits your career goals
          </p>
        </div>

        <div className="mt-12 grid gap-8 lg:grid-cols-2 lg:gap-12">
          {plans.map((plan) => (
            <Card key={plan.name} className="flex flex-col">
              <CardHeader>
                <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
                <CardDescription>{plan.description}</CardDescription>
                <div className="mt-4">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  <span className="text-gray-500">/{plan.interval}</span>
                </div>
              </CardHeader>
              <CardContent className="flex-grow">
                <ul className="space-y-3">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-center">
                      <Check
                        className={`h-5 w-5 mr-2 ${
                          feature.included ? 'text-green-500' : 'text-gray-300'
                        }`}
                      />
                      <span
                        className={feature.included ? 'text-gray-700' : 'text-gray-400'}
                      >
                        {feature.text}
                      </span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button
                  className="w-full"
                  onClick={() => handleSubscribe(plan.priceId)}
                  disabled={isLoading === plan.priceId}
                >
                  {isLoading === plan.priceId ? (
                    "Processing..."
                  ) : (
                    `Subscribe to ${plan.name}`                  )}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};
