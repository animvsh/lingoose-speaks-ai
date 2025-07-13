
-- Create subscription status enum
CREATE TYPE subscription_status AS ENUM ('free_trial', 'pro', 'expired');

-- Create user subscriptions table to track subscription status and timing
CREATE TABLE public.user_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  phone_number TEXT NOT NULL,
  subscription_status subscription_status NOT NULL DEFAULT 'free_trial',
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  trial_start_date TIMESTAMPTZ DEFAULT now(),
  pro_purchase_date TIMESTAMPTZ,
  weekly_reset_date TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(phone_number)
);

-- Create call usage tracking table
CREATE TABLE public.call_usage (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  phone_number TEXT NOT NULL,
  call_id TEXT NOT NULL,
  duration_seconds INTEGER NOT NULL DEFAULT 0,
  duration_minutes DECIMAL(10,2) GENERATED ALWAYS AS (duration_seconds / 60.0) STORED,
  call_date TIMESTAMPTZ DEFAULT now(),
  week_start_date DATE GENERATED ALWAYS AS (date_trunc('week', call_date)::date) STORED,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS on both tables
ALTER TABLE public.user_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.call_usage ENABLE ROW LEVEL SECURITY;

-- RLS policies for user_subscriptions
CREATE POLICY "Users can view their own subscription" ON public.user_subscriptions
  FOR SELECT USING (user_id = auth.uid() OR phone_number IN (
    SELECT phone_number FROM public.user_profiles WHERE id = auth.uid()
  ));

CREATE POLICY "System can manage subscriptions" ON public.user_subscriptions
  FOR ALL USING (true);

-- RLS policies for call_usage
CREATE POLICY "Users can view their own usage" ON public.call_usage
  FOR SELECT USING (user_id = auth.uid() OR phone_number IN (
    SELECT phone_number FROM public.user_profiles WHERE id = auth.uid()
  ));

CREATE POLICY "System can track usage" ON public.call_usage
  FOR ALL USING (true);

-- Function to get user's current week usage in minutes
CREATE OR REPLACE FUNCTION get_current_week_usage(p_phone_number TEXT)
RETURNS DECIMAL(10,2)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  total_minutes DECIMAL(10,2);
  week_start DATE;
BEGIN
  -- Get the start of current week (Monday)
  week_start := date_trunc('week', CURRENT_DATE)::date;
  
  SELECT COALESCE(SUM(duration_minutes), 0)
  INTO total_minutes
  FROM public.call_usage
  WHERE phone_number = p_phone_number
    AND week_start_date = week_start;
    
  RETURN total_minutes;
END;
$$;

-- Function to check if user has available minutes
CREATE OR REPLACE FUNCTION check_available_minutes(p_phone_number TEXT)
RETURNS TABLE(
  has_minutes BOOLEAN,
  minutes_used DECIMAL(10,2),
  minutes_remaining DECIMAL(10,2),
  subscription_status TEXT,
  needs_upgrade BOOLEAN
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  user_sub RECORD;
  current_usage DECIMAL(10,2);
  trial_expired BOOLEAN := FALSE;
  pro_week_expired BOOLEAN := FALSE;
BEGIN
  -- Get user subscription info
  SELECT * INTO user_sub
  FROM public.user_subscriptions
  WHERE phone_number = p_phone_number;
  
  -- If no subscription record, create free trial
  IF user_sub IS NULL THEN
    INSERT INTO public.user_subscriptions (user_id, phone_number, subscription_status, trial_start_date)
    SELECT id, p_phone_number, 'free_trial', now()
    FROM public.user_profiles
    WHERE phone_number = p_phone_number
    LIMIT 1;
    
    SELECT * INTO user_sub
    FROM public.user_subscriptions
    WHERE phone_number = p_phone_number;
  END IF;
  
  -- Get current week usage
  current_usage := get_current_week_usage(p_phone_number);
  
  -- Check trial expiry (3 days)
  IF user_sub.subscription_status = 'free_trial' THEN
    trial_expired := (now() - user_sub.trial_start_date) > interval '3 days';
  END IF;
  
  -- Check pro week expiry (7 days from purchase/last reset)
  IF user_sub.subscription_status = 'pro' AND user_sub.weekly_reset_date IS NOT NULL THEN
    pro_week_expired := (now() - user_sub.weekly_reset_date) > interval '7 days';
    
    -- Reset weekly usage if a new week has started
    IF pro_week_expired THEN
      UPDATE public.user_subscriptions
      SET weekly_reset_date = now()
      WHERE phone_number = p_phone_number;
      current_usage := 0; -- Reset usage for new week
    END IF;
  END IF;
  
  -- Determine availability
  CASE user_sub.subscription_status
    WHEN 'free_trial' THEN
      has_minutes := NOT trial_expired AND current_usage < 25;
      needs_upgrade := trial_expired OR current_usage >= 25;
      subscription_status := 'free_trial';
    WHEN 'pro' THEN
      has_minutes := current_usage < 25;
      needs_upgrade := FALSE;
      subscription_status := 'pro';
    ELSE
      has_minutes := FALSE;
      needs_upgrade := TRUE;
      subscription_status := 'expired';
  END CASE;
  
  minutes_used := current_usage;
  minutes_remaining := GREATEST(0, 25 - current_usage);
  
  RETURN NEXT;
END;
$$;

-- Function to log call usage
CREATE OR REPLACE FUNCTION log_call_usage(
  p_phone_number TEXT,
  p_call_id TEXT,
  p_duration_seconds INTEGER
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  user_record RECORD;
BEGIN
  -- Get user info
  SELECT id INTO user_record
  FROM public.user_profiles
  WHERE phone_number = p_phone_number;
  
  IF user_record.id IS NOT NULL THEN
    INSERT INTO public.call_usage (user_id, phone_number, call_id, duration_seconds)
    VALUES (user_record.id, p_phone_number, p_call_id, p_duration_seconds);
  END IF;
END;
$$;

-- Create indexes for better performance
CREATE INDEX idx_user_subscriptions_phone ON public.user_subscriptions(phone_number);
CREATE INDEX idx_call_usage_phone_week ON public.call_usage(phone_number, week_start_date);
CREATE INDEX idx_call_usage_call_id ON public.call_usage(call_id);
