-- Create stripe_config table
CREATE TABLE IF NOT EXISTS public.stripe_config (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    key_name TEXT NOT NULL UNIQUE,
    key_value TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Insert Stripe keys (values will be set via environment variables)
INSERT INTO public.stripe_config (key_name, key_value)
VALUES 
    ('stripe_secret_key', current_setting('app.settings.stripe_secret_key')),
    ('stripe_publishable_key', current_setting('app.settings.stripe_publishable_key'))
ON CONFLICT (key_name) DO UPDATE
SET key_value = EXCLUDED.key_value;

-- Create RLS policies
ALTER TABLE public.stripe_config ENABLE ROW LEVEL SECURITY;

-- Only allow service role to access this table
CREATE POLICY "Service role only"
    ON public.stripe_config
    FOR ALL
    USING (auth.role() = 'service_role'); 