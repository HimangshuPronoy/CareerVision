import { loadStripe } from '@stripe/stripe-js';
import { supabase } from '@/integrations/supabase/client';

// Make sure to call `loadStripe` outside of a component's render to avoid
// recreating the `Stripe` object on every render.
export const stripePromise = loadStripe('pk_live_51RIzYUJjRarA6eH81NR6FNjH0BCkFBoM13yCsXlKrfb1J32ZPpSYJmKt8XV8P1brI51ismmIPZ1Ggr4zeku0f8Vz00ziC9Fplm'); 