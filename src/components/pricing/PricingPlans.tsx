import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Check } from "lucide-react";
import { loadStripe } from "@stripe/stripe-js";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { createCheckoutSession } from "@/api/stripe";

const plans = {
  monthly: {
    name: "Basic",
    price: "$14.99",
    description: "Essential features for career development",
    features: [
      "Basic career insights",
      "Resume builder",
      "Basic skill assessment",
      "Email support",
    ],
    priceId: "price_1RJBXaR25DkkiOlwo74QKNQX",
  },
  yearly: {
    name: "Basic",
    price: "$129.99",
    description: "Essential features for career development",
    features: [
      "Basic career insights",
      "Resume builder",
      "Basic skill assessment",
      "Email support",
      "Save 28% with yearly billing",
    ],
    priceId: "price_1RJBY5R25DkkiOlwn32nz6jv",
  },
};

export default function PricingPlans() {
  const [isYearly, setIsYearly] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const currentPlan = isYearly ? plans.yearly : plans.monthly;

  const handleSubscribe = async () => {
    try {
      setIsLoading(true);
      const { sessionId } = await createCheckoutSession(currentPlan.priceId);
      
      const stripe = await loadStripe('pk_test_51RIzYgR25DkkiOlw1DZQ8NQfDPacGqRuGacK26P3vYGssVdweoRsRHKk2w0S7JEr6TsfYkGPjFXnOTjUJOb44gnP00ZQO7ZOnm');
      
      if (!stripe) {
        throw new Error('Stripe failed to initialize');
      }

      const { error } = await stripe.redirectToCheckout({ sessionId });
      if (error) {
        throw error;
      }
    } catch (error) {
      console.error("Error:", error);
      toast({
        title: "Error",
        description: "Failed to start checkout process. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold tracking-tight">Choose Your Plan</h2>
        <p className="text-muted-foreground mt-4">
          Select the perfect plan for your career development needs
        </p>
        
        <div className="flex items-center justify-center space-x-2 mt-6">
          <Label htmlFor="billing-toggle">Monthly</Label>
          <Switch
            id="billing-toggle"
            checked={isYearly}
            onCheckedChange={setIsYearly}
          />
          <Label htmlFor="billing-toggle">Yearly</Label>
          {isYearly && (
            <span className="text-sm text-green-500 ml-2">Save 28%</span>
          )}
        </div>
      </div>

      <div className="max-w-md mx-auto">
        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle>{currentPlan.name}</CardTitle>
            <CardDescription>{currentPlan.description}</CardDescription>
            <div className="mt-4">
              <span className="text-4xl font-bold">{currentPlan.price}</span>
              <span className="text-muted-foreground">
                /{isYearly ? 'year' : 'month'}
              </span>
            </div>
          </CardHeader>
          <CardContent className="flex-grow">
            <ul className="space-y-2">
              {currentPlan.features.map((feature) => (
                <li key={feature} className="flex items-center">
                  <Check className="h-4 w-4 text-green-500 mr-2" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </CardContent>
          <CardFooter>
            <Button
              className="w-full"
              onClick={handleSubscribe}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <span className="mr-2">Loading...</span>
                </>
              ) : (
                "Subscribe Now"
              )}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
} 