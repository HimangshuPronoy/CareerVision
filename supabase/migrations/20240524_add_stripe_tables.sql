-- Create stripe_prices table
CREATE TABLE IF NOT EXISTS "public"."stripe_prices" (
  "id" text PRIMARY KEY,
  "product_id" text NOT NULL,
  "active" boolean NOT NULL DEFAULT true,
  "currency" text NOT NULL,
  "unit_amount" integer NOT NULL,
  "interval" text NOT NULL,
  "name" text NOT NULL,
  "description" text,
  "features" text[] DEFAULT '{}'::text[],
  "created_at" timestamp with time zone DEFAULT now() NOT NULL
);

-- Create subscriptions table
CREATE TABLE IF NOT EXISTS "public"."subscriptions" (
  "id" text PRIMARY KEY,
  "user_id" uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  "status" text NOT NULL,
  "price_id" text NOT NULL REFERENCES stripe_prices(id),
  "customer_id" text NOT NULL,
  "current_period_end" bigint NOT NULL,
  "cancel_at_period_end" boolean NOT NULL DEFAULT false,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL,
  "updated_at" timestamp with time zone DEFAULT now() NOT NULL
);

-- Create index for faster subscription lookups by user
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON "public"."subscriptions" (user_id);

-- RLS policies for stripe_prices table
ALTER TABLE "public"."stripe_prices" ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read active pricing (public data)
CREATE POLICY "Allow anyone to read active pricing" 
  ON "public"."stripe_prices" 
  FOR SELECT 
  USING (active = true);

-- RLS policies for subscriptions table
ALTER TABLE "public"."subscriptions" ENABLE ROW LEVEL SECURITY;

-- Allow users to read only their own subscriptions
CREATE POLICY "Users can read their own subscriptions" 
  ON "public"."subscriptions"
  FOR SELECT 
  USING (auth.uid() = user_id);

-- Insert sample pricing data
INSERT INTO "public"."stripe_prices" (
  "id", 
  "product_id", 
  "active",
  "currency", 
  "unit_amount", 
  "interval", 
  "name", 
  "description",
  "features"
) VALUES
(
  'price_1RJumRJjRarA6eH84kygqd80',
  'prod_PZQylVHv6NuYA8',
  true,
  'usd',
  1499,
  'month',
  'Monthly Plan',
  'Full access to CareerVision with monthly billing',
  ARRAY['Full dashboard access', 'Resume builder', 'Job matching', 'Market trend reports', 'Advanced skill analysis', 'Personalized career paths', 'Priority support', 'AI-powered insights']
),
(
  'price_1RJumvJjRarA6eH8KTvJCoGL',
  'prod_PZQylVHv6NuYA8',
  true,
  'usd',
  12999,
  'year',
  'Yearly Plan',
  'Full access to CareerVision with yearly billing (save 28%)',
  ARRAY['Everything in Monthly Plan', 'Save 28% compared to monthly billing', 'Annual career planning session']
)
ON CONFLICT (id) DO NOTHING; 