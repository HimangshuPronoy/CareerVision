import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';
import Stripe from 'https://esm.sh/stripe@12.0.0?target=deno';

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
  apiVersion: '2025-03-31.basil',
  httpClient: Stripe.createFetchHttpClient(),
});

const supabaseClient = createClient(
  Deno.env.get('SUPABASE_URL') || '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || ''
);

serve(async (req) => {
  try {
    const signature = req.headers.get('stripe-signature');
    if (!signature) throw new Error('No signature found');

    const body = await req.text();
    const event = stripe.webhooks.constructEvent(
      body,
      signature,
      Deno.env.get('STRIPE_WEBHOOK_SECRET') || ''
    );

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        const userId = session.metadata?.userId;

        if (userId) {
          await supabaseClient
            .from('subscriptions')
            .upsert({
              user_id: userId,
              stripe_customer_id: session.customer,
              stripe_subscription_id: session.subscription,
              stripe_price_id: session.line_items?.data[0]?.price?.id,
              status: 'active',
            });
        }
        break;
      }
      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        const userId = subscription.metadata?.userId;

        if (userId) {
          await supabaseClient
            .from('subscriptions')
            .update({
              status: 'inactive',
              stripe_subscription_id: null,
              stripe_price_id: null,
            })
            .eq('user_id', userId);
        }
        break;
      }
    }

    return new Response(
      JSON.stringify({ received: true }),
      { headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }
}); 