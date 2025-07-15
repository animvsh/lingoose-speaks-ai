
-- Create a function to create a user with language and phone number
CREATE OR REPLACE FUNCTION public.create_user_with_phone(
  p_phone_number text, 
  p_language text DEFAULT 'hindi'
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $function$
DECLARE
  new_user_id uuid;
BEGIN
  -- Generate a new UUID for the user
  new_user_id := gen_random_uuid();
  
  -- Insert into user_profiles table
  INSERT INTO public.user_profiles (id, full_name, phone_number, language)
  VALUES (new_user_id, 'New User', p_phone_number, p_language);
  
  -- Return the new user ID
  RETURN new_user_id;
END;
$function$;
