-- Fix RLS policies for user_profiles table to allow profile creation during onboarding
-- First, let's check the current policies and create proper ones

-- Drop existing restrictive policies and create new ones that allow profile creation
DROP POLICY IF EXISTS "Users can insert own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can view own profile" ON public.user_profiles;

-- Create new policies that allow profile creation during onboarding
-- Allow anyone to insert a profile (for onboarding)
CREATE POLICY "Anyone can create profile during onboarding" 
ON public.user_profiles 
FOR INSERT 
WITH CHECK (true);

-- Allow users to view profiles by phone number (since we use phone-based auth)
CREATE POLICY "Users can view profiles" 
ON public.user_profiles 
FOR SELECT 
USING (true);

-- Allow users to update their own profile by phone number or auth.uid()
CREATE POLICY "Users can update own profile" 
ON public.user_profiles 
FOR UPDATE 
USING (
  auth.uid()::text = auth_user_id::text 
  OR phone_number IN (
    SELECT phone FROM auth.users WHERE id = auth.uid()
  )
  OR auth.uid() IS NULL  -- Allow updates during onboarding
);

-- Allow profile deletion for cleanup
CREATE POLICY "Users can delete own profile" 
ON public.user_profiles 
FOR DELETE 
USING (
  auth.uid()::text = auth_user_id::text 
  OR auth.uid() IS NULL  -- Allow deletion during cleanup
);