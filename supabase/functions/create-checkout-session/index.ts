import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';
import Stripe from 'https://esm.sh/stripe@12.0.0?target=deno';

const supabaseClient = createClient(
  Deno.env.get('SUPABASE_URL') || '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || ''
);

serve(async (req) => {
  try {
    // Get Stripe secret key from database
    const { data: stripeConfig, error: configError } = await supabaseClient
      .from('stripe_config')
      .select('key_value')
      .eq('key_name', 'stripe_secret_key')
      .single();

    if (configError) throw configError;

    const stripe = new Stripe(stripeConfig.key_value, {
      apiVersion: '2025-03-31.basil',
      httpClient: Stripe.createFetchHttpClient(),
    });

    const { priceId, userId } = await req.json();

    // Get user's email from Supabase
    const { data: userData, error: userError } = await supabaseClient
      .from('users')
      .select('email')
      .eq('id', userId)
      .single();

    if (userError) throw userError;

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${req.headers.get('origin')}/dashboard?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.get('origin')}/pricing`,
      customer_email: userData.email,
      metadata: {
        userId,
      },
      billing_address_collection: 'required',
      allow_promotion_codes: true,
      subscription_data: {
        trial_period_days: 7, // Optional: Add a 7-day trial
      },
    });

    return new Response(
      JSON.stringify({ sessionId: session.id }),
      { headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }
}); 