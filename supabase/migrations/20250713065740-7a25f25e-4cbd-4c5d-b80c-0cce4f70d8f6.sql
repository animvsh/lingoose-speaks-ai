-- Create function to check available minutes for a user
CREATE OR REPLACE FUNCTION public.check_available_minutes(p_phone_number text)
RETURNS TABLE (
  has_minutes boolean,
  minutes_used numeric,
  minutes_remaining numeric,
  subscription_status text,
  needs_upgrade boolean
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  user_record record;
  total_minutes_used numeric := 0;
  weekly_limit numeric := 25; -- Default free trial limit
  subscription_record record;
BEGIN
  -- Get user profile
  SELECT * INTO user_record 
  FROM public.user_profiles 
  WHERE phone_number = p_phone_number;
  
  IF user_record IS NULL THEN
    -- Return default values for non-existent user
    RETURN QUERY SELECT 
      false::boolean,
      0::numeric,
      0::numeric,
      'not_found'::text,
      true::boolean;
    RETURN;
  END IF;
  
  -- Get subscription info if exists
  SELECT s.subscription INTO subscription_record
  FROM public.subscriptions s
  WHERE s.user_id = user_record.id
  ORDER BY s.created_at DESC
  LIMIT 1;
  
  -- Calculate minutes used this week from VAPI call analysis
  SELECT COALESCE(SUM(call_duration / 60.0), 0) INTO total_minutes_used
  FROM public.vapi_call_analysis
  WHERE phone_number = p_phone_number
    AND call_started_at >= date_trunc('week', now())
    AND call_status = 'ended';
  
  -- Determine subscription status and limits
  IF subscription_record IS NOT NULL THEN
    -- User has a subscription
    IF subscription_record.subscription->>'status' = 'active' THEN
      weekly_limit := COALESCE((subscription_record.subscription->>'weekly_minutes')::numeric, 300); -- Pro plan default
      RETURN QUERY SELECT
        (total_minutes_used < weekly_limit)::boolean,
        total_minutes_used,
        GREATEST(0, weekly_limit - total_minutes_used),
        'pro'::text,
        false::boolean;
    ELSE
      -- Subscription exists but not active
      RETURN QUERY SELECT
        false::boolean,
        total_minutes_used,
        0::numeric,
        'expired'::text,
        true::boolean;
    END IF;
  ELSE
    -- Free trial user
    RETURN QUERY SELECT
      (total_minutes_used < weekly_limit)::boolean,
      total_minutes_used,
      GREATEST(0, weekly_limit - total_minutes_used),
      'free_trial'::text,
      (total_minutes_used >= weekly_limit)::boolean;
  END IF;
END;
$$;