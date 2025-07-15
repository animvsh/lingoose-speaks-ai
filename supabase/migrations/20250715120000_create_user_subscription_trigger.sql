-- Create trigger function to auto-create user_subscriptions on new user_profiles
CREATE OR REPLACE FUNCTION create_user_subscription_on_profile()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_subscriptions (user_id, phone_number, subscription_status, trial_start_date)
  VALUES (NEW.id, NEW.phone_number, 'free_trial', now())
  ON CONFLICT (phone_number) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_create_user_subscription ON public.user_profiles;

CREATE TRIGGER trg_create_user_subscription
AFTER INSERT ON public.user_profiles
FOR EACH ROW
EXECUTE FUNCTION create_user_subscription_on_profile(); 