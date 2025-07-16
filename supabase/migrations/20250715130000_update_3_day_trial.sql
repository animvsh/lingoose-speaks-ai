-- Update the check_available_minutes function to implement 3-day free trial
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
  days_since_trial_start INTEGER;
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
  
  -- Get current week usage (this will be used as "days used" for free trial)
  current_usage := get_current_week_usage(p_phone_number);
  
  -- Check trial expiry (3 days from trial start)
  IF user_sub.subscription_status = 'free_trial' THEN
    days_since_trial_start := EXTRACT(DAY FROM (now() - user_sub.trial_start_date));
    trial_expired := days_since_trial_start >= 3;
    
    -- For free trial, treat usage as "days used" (1 call = 1 day)
    current_usage := LEAST(current_usage, 3); -- Cap at 3 days
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
      has_minutes := NOT trial_expired AND current_usage < 3;
      needs_upgrade := trial_expired OR current_usage >= 3;
      subscription_status := 'free_trial';
    WHEN 'pro' THEN
      has_minutes := TRUE; -- Pro users have unlimited access
      needs_upgrade := FALSE;
      subscription_status := 'pro';
    ELSE
      has_minutes := FALSE;
      needs_upgrade := TRUE;
      subscription_status := 'expired';
  END CASE;
  
  minutes_used := current_usage;
  minutes_remaining := GREATEST(0, 3 - current_usage);
  
  RETURN NEXT;
END;
$$; 