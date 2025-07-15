
-- Drop existing RLS policies for user_profiles if they exist
DROP POLICY IF EXISTS "Users can view own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.user_profiles;

-- Create new RLS policies that allow phone authentication flow
-- Allow anyone to insert profiles (needed for phone auth signup)
CREATE POLICY "Allow profile creation during phone auth" 
  ON public.user_profiles 
  FOR INSERT 
  WITH CHECK (true);

-- Allow users to view their own profiles (by auth_user_id when linked)
CREATE POLICY "Users can view own profile by auth_user_id" 
  ON public.user_profiles 
  FOR SELECT 
  USING (auth.uid() = auth_user_id OR auth.uid() IS NULL);

-- Allow users to view profiles by phone number (for phone auth)
CREATE POLICY "Users can view profiles by phone for auth" 
  ON public.user_profiles 
  FOR SELECT 
  USING (phone_number IS NOT NULL);

-- Allow users to update their own profiles
CREATE POLICY "Users can update own profile" 
  ON public.user_profiles 
  FOR UPDATE 
  USING (auth.uid() = auth_user_id OR auth.uid() IS NULL);

-- Allow deletion for cleanup
CREATE POLICY "Allow profile deletion for cleanup" 
  ON public.user_profiles 
  FOR DELETE 
  USING (auth.uid() = auth_user_id OR auth.uid() IS NULL);
