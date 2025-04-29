import { supabase } from '@/lib/supabaseClient';
import Stripe from 'stripe';

const stripe = new Stripe(import.meta.env.VITE_STRIPE_SECRET_KEY, {
  apiVersion: '2025-03-31.basil',
});

export async function createCheckoutSession(priceId: string) {
  try {
    // Get the current user's session
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError || !session) {
      throw new Error('Not authenticated');
    }

    // Create Stripe checkout session
    const checkoutSession = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${window.location.origin}/dashboard?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${window.location.origin}/pricing`,
      customer_email: session.user.email,
      metadata: {
        userId: session.user.id,
      },
    });

    return { sessionId: checkoutSession.id };
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}

export async function getSubscriptionStatus() {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) throw new Error('No active session');

    const { data, error } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', session.user.id)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error:', error);
    return null;
  }
}

export async function cancelSubscription() {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) throw new Error('No active session');

    const { error } = await supabase.functions.invoke('cancel-subscription', {
      body: { userId: session.user.id }
    });

    if (error) throw error;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}

export async function handleWebhook(event: Stripe.Event) {
  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        const userId = session.metadata?.userId;

        if (userId) {
          // Update user's subscription status in Supabase
          await supabase
            .from('users')
            .update({
              subscription_status: 'active',
              subscription_id: session.subscription,
              subscription_price_id: session.line_items?.data[0]?.price?.id,
            })
            .eq('id', userId);
        }
        break;
      }
      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        const userId = subscription.metadata?.userId;

        if (userId) {
          // Update user's subscription status in Supabase
          await supabase
            .from('users')
            .update({
              subscription_status: 'inactive',
              subscription_id: null,
              subscription_price_id: null,
            })
            .eq('id', userId);
        }
        break;
      }
    }
  } catch (error) {
    console.error('Error handling webhook:', error);
    throw error;
  }
} 