import { loadStripe } from '@stripe/stripe-js';

// Read Stripe publishable key from environment or Supabase
const STRIPE_PUBLISHABLE_KEY = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || "pk_test_YOUR_FALLBACK_KEY"; // Replace with actual key if needed

// Create a singleton to avoid multiple Stripe instances
let stripePromise: ReturnType<typeof loadStripe> | null = null;

export const getStripe = () => {
  const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);
  return stripePromise;
}; 