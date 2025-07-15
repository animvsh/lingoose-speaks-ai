
-- Update the handle_new_user function to better handle phone-only auth
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO public.user_profiles (id, full_name, phone_number)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'New User'),
    COALESCE(NEW.phone, NEW.raw_user_meta_data->>'phone_number', '+1234567890')
  );
  
  -- Initialize session context
  INSERT INTO public.session_context (user_id, context)
  VALUES (NEW.id, '');
  
  RETURN NEW;
END;
$$;
