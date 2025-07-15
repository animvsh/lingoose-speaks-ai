-- Update subscriptions table to work better with Stripe
ALTER TABLE public.subscriptions 
ADD COLUMN IF NOT EXISTS stripe_customer_id TEXT,
ADD COLUMN IF NOT EXISTS stripe_subscription_id TEXT,
ADD COLUMN IF NOT EXISTS subscription_status TEXT DEFAULT 'inactive',
ADD COLUMN IF NOT EXISTS subscription_tier TEXT DEFAULT 'free_trial',
ADD COLUMN IF NOT EXISTS subscription_end TIMESTAMPTZ;

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_subscriptions_stripe_customer ON public.subscriptions(stripe_customer_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_status ON public.subscriptions(user_id, subscription_status);