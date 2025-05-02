import { supabase } from '@/integrations/supabase/client';

// Types for Stripe API responses
export interface StripePrice {
  id: string;
  product_id: string;
  active: boolean;
  currency: string;
  unit_amount: number;
  interval: string;
  name: string;
  description?: string;
  features?: string[];
}

export interface StripeSubscription {
  id: string;
  status: string;
  current_period_end: number;
  cancel_at_period_end: boolean;
  price_id: string;
}

// Fetch available pricing plans from Supabase
export const fetchPricingPlans = async (): Promise<StripePrice[]> => {
  const { data, error } = await supabase
    .from('stripe_prices')
    .select('*')
    .eq('active', true)
    .order('unit_amount', { ascending: true });

  if (error) {
    throw new Error('Failed to fetch pricing plans');
  }

  return data || [];
};

// Create a checkout session
export const createCheckoutSession = async (priceId: string, userId: string): Promise<string> => {
  const { data, error } = await supabase.functions.invoke('create-checkout-session', {
    body: { priceId, userId }
  });

  if (error) {
    throw new Error(error.message);
  }

  return data.sessionId;
};

// Get current user's subscription
export const getUserSubscription = async (userId: string): Promise<StripeSubscription | null> => {
  try {
    const { data, error } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();

    if (error) throw error;
    
    return data;
  } catch (error) {
    console.error('Error fetching user subscription:', error);
    return null;
  }
};

// Create a portal session for managing subscription
export const createPortalSession = async (userId: string): Promise<string> => {
  try {
    const { data, error } = await supabase.functions.invoke('create-portal-session', {
      body: { 
        userId,
        returnUrl: `${window.location.origin}/settings`
      }
    });

    if (error) throw error;
    
    return data.url;
  } catch (error) {
    console.error('Error creating portal session:', error);
    throw error;
  }
}; 