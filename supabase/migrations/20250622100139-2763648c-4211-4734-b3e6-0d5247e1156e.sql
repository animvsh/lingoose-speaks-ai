
-- Remove the foreign key constraint from user_profiles to allow profiles without auth users
ALTER TABLE public.user_profiles DROP CONSTRAINT IF EXISTS user_profiles_id_fkey;

-- Make the id column use gen_random_uuid() as default instead of referencing auth.users
ALTER TABLE public.user_profiles ALTER COLUMN id SET DEFAULT gen_random_uuid();

-- Add a new column to optionally link to auth users later
ALTER TABLE public.user_profiles ADD COLUMN IF NOT EXISTS auth_user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL;

-- Update the create_user_with_phone function to work properly
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
  
  -- Insert into user_profiles table (without auth_user_id for now)
  INSERT INTO public.user_profiles (id, full_name, phone_number, language)
  VALUES (new_user_id, 'New User', p_phone_number, p_language);
  
  -- Return the new user ID
  RETURN new_user_id;
END;
$function$;

-- Add an index for performance on the new auth_user_id column
CREATE INDEX IF NOT EXISTS idx_user_profiles_auth_user_id ON public.user_profiles(auth_user_id);
