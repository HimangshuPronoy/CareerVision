
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Star, Crown, Zap } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useSubscription } from "@/contexts/SubscriptionContext";

interface PricingPlan {
  name: string;
  priceUSD: string;
  priceEUR: string;
  priceIdUSD: string;
  priceIdEUR: string;
  features: string[];
  icon: React.ReactNode;
  popular?: boolean;
  isLifetime?: boolean;
}

const plans: PricingPlan[] = [
  {
    name: "Basic",
    priceUSD: "$14.99",
    priceEUR: "€13.20",
    priceIdUSD: "price_1RJumRJjRarA6eH84kygqd80",
    priceIdEUR: "price_1RffMeJjRarA6eH8L8ftDxsQ",
    features: [
      "Job Market Analytics",
      "Basic AI Career Mentor",
      "Resume Builder",
      "5 Job Applications/month"
    ],
    icon: <Zap className="h-6 w-6" />
  },
  {
    name: "Standard",
    priceUSD: "$17.99",
    priceEUR: "€16.20",
    priceIdUSD: "price_1RZqBRJjRarA6eH8MQhkccmL",
    priceIdEUR: "price_1RffM6JjRarA6eH8ndFtyolX",
    features: [
      "Everything in Basic",
      "Advanced Skill Analysis",
      "Unlimited Job Applications",
      "Career Path Planning",
      "Priority Support"
    ],
    icon: <Star className="h-6 w-6" />,
    popular: true
  },
  {
    name: "Lifetime",
    priceUSD: "$99.99",
    priceEUR: "€99.99",
    priceIdUSD: "price_1RZqDvJjRarA6eH8BJsvfBqf",
    priceIdEUR: "price_1RffMwJjRarA6eH8Zr05ETrw",
    features: [
      "Everything in Standard",
      "Lifetime Access",
      "No Monthly Fees",
      "Future Feature Updates",
      "Premium Support"
    ],
    icon: <Crown className="h-6 w-6" />,
    isLifetime: true
  }
];

const SubscriptionPlans = () => {
  const [loading, setLoading] = useState<string | null>(null);
  const [userRegion, setUserRegion] = useState<'USD' | 'EUR'>('USD');
  const { subscriptionData, refreshSubscription } = useSubscription();

  useEffect(() => {
    // Detect user location
    const detectRegion = async () => {
      try {
        const response = await fetch('https://ipapi.co/json/');
        const data = await response.json();
        const country = data.country_code;
        
        // USD regions: USA, Singapore, Canada, Australia
        const usdCountries = ['US', 'SG', 'CA', 'AU'];
        setUserRegion(usdCountries.includes(country) ? 'USD' : 'EUR');
      } catch (error) {
        console.error('Error detecting region:', error);
        setUserRegion('USD'); // Default to USD
      }
    };

    detectRegion();
  }, []);

  const handleSubscribe = async (plan: PricingPlan) => {
    setLoading(plan.name);
    try {
      const priceId = userRegion === 'USD' ? plan.priceIdUSD : plan.priceIdEUR;
      
      const { data, error } = await supabase.functions.invoke('create-checkout', {
        body: { priceId }
      });

      if (error) throw error;

      // Open Stripe checkout in a new tab
      window.open(data.url, '_blank');
      
      // Refresh subscription after a delay to check for updates
      setTimeout(() => {
        refreshSubscription();
      }, 3000);
      
    } catch (error) {
      console.error('Error creating checkout:', error);
      toast.error('Failed to create checkout session. Please try again.');
    } finally {
      setLoading(null);
    }
  };

  const isCurrentPlan = (planName: string) => {
    return subscriptionData.subscribed && subscriptionData.subscription_tier === planName;
  };

  return (
    <div className="py-12">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Choose Your Plan</h2>
        <p className="text-lg text-gray-600 mb-4">
          Unlock your career potential with our premium features
        </p>
        <div className="flex items-center justify-center gap-2">
          <span className="text-sm text-gray-500">Pricing in</span>
          <Badge variant="outline">
            {userRegion === 'USD' ? 'USD ($)' : 'EUR (€)'}
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {plans.map((plan) => (
          <Card 
            key={plan.name} 
            className={`relative ${plan.popular ? 'border-blue-500 border-2' : ''} ${
              isCurrentPlan(plan.name) ? 'bg-green-50 border-green-500 border-2' : ''
            }`}
          >
            {plan.popular && (
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-blue-500 text-white">Most Popular</Badge>
              </div>
            )}
            {isCurrentPlan(plan.name) && (
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-green-500 text-white">Current Plan</Badge>
              </div>
            )}
            
            <CardHeader className="text-center pb-4">
              <div className="flex items-center justify-center mb-4">
                {plan.icon}
              </div>
              <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
              <div className="text-4xl font-bold text-blue-600 mb-2">
                {userRegion === 'USD' ? plan.priceUSD : plan.priceEUR}
              </div>
              <p className="text-gray-600">
                {plan.isLifetime ? 'One-time payment' : 'per month'}
              </p>
            </CardHeader>
            
            <CardContent>
              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>
              
              <Button
                onClick={() => handleSubscribe(plan)}
                disabled={loading === plan.name || isCurrentPlan(plan.name)}
                className={`w-full ${plan.popular ? 'bg-blue-600 hover:bg-blue-700' : ''}`}
                size="lg"
              >
                {loading === plan.name ? 'Processing...' : 
                 isCurrentPlan(plan.name) ? 'Current Plan' : 
                 plan.isLifetime ? 'Get Lifetime Access' : 'Start Subscription'}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default SubscriptionPlans;
