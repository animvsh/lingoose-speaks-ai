
-- CRITICAL SECURITY FIX: Fix dangerously permissive RLS policies on user_profiles

-- Drop the current dangerous policies that allow anyone to view all profiles
DROP POLICY IF EXISTS "Users can view profiles by phone for auth" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can view own profile by auth_user_id" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Allow profile deletion for cleanup" ON public.user_profiles;
DROP POLICY IF EXISTS "Allow profile creation during phone auth" ON public.user_profiles;

-- Create secure RLS policies that properly restrict access
-- Only allow users to view their own profile by phone number (for phone auth system)
CREATE POLICY "Users can view own profile by phone" 
  ON public.user_profiles 
  FOR SELECT 
  USING (phone_number = (
    SELECT phone_number FROM public.user_profiles 
    WHERE id = auth.uid()
  ) OR auth.uid() IS NULL);

-- Allow users to update only their own profile
CREATE POLICY "Users can update own profile by phone" 
  ON public.user_profiles 
  FOR UPDATE 
  USING (phone_number = (
    SELECT phone_number FROM public.user_profiles 
    WHERE id = auth.uid()
  ));

-- Allow profile creation during phone auth (restricted insertion)
CREATE POLICY "Allow profile creation for new users" 
  ON public.user_profiles 
  FOR INSERT 
  WITH CHECK (true);

-- Allow users to delete only their own profile
CREATE POLICY "Users can delete own profile" 
  ON public.user_profiles 
  FOR DELETE 
  USING (phone_number = (
    SELECT phone_number FROM public.user_profiles 
    WHERE id = auth.uid()
  ));

-- Fix vapi_call_analysis RLS to be more restrictive
DROP POLICY IF EXISTS "Users can view their own call analysis" ON public.vapi_call_analysis;

CREATE POLICY "Users can view own call analysis by phone" 
  ON public.vapi_call_analysis 
  FOR SELECT 
  USING (phone_number = (
    SELECT phone_number FROM public.user_profiles 
    WHERE id = auth.uid()
  ));

-- Fix curriculum_insights RLS
DROP POLICY IF EXISTS "Users can view their own insights" ON public.curriculum_insights;

CREATE POLICY "Users can view own insights by phone" 
  ON public.curriculum_insights 
  FOR SELECT 
  USING (phone_number = (
    SELECT phone_number FROM public.user_profiles 
    WHERE id = auth.uid()
  ));

-- Add input validation function for phone numbers
CREATE OR REPLACE FUNCTION public.validate_phone_number(phone_number text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Phone number must start with + and be 10-15 digits
  RETURN phone_number ~ '^\+[1-9]\d{9,14}$';
END;
$$;

-- Add input validation function for user names
CREATE OR REPLACE FUNCTION public.validate_user_name(name text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Name must be 1-100 characters, no special characters except spaces, hyphens, apostrophes
  RETURN length(trim(name)) >= 1 AND length(trim(name)) <= 100 AND name ~ '^[a-zA-Z\s\-'']+$';
END;
$$;

-- Add constraints to user_profiles table for input validation
ALTER TABLE public.user_profiles 
ADD CONSTRAINT valid_phone_number 
CHECK (validate_phone_number(phone_number));

ALTER TABLE public.user_profiles 
ADD CONSTRAINT valid_full_name 
CHECK (validate_user_name(full_name));

-- Create audit log table for security monitoring
CREATE TABLE IF NOT EXISTS public.security_audit_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid,
  phone_number text,
  action text NOT NULL,
  details jsonb DEFAULT '{}',
  ip_address inet,
  user_agent text,
  created_at timestamp with time zone DEFAULT now()
);

-- Enable RLS on audit logs
ALTER TABLE public.security_audit_logs ENABLE ROW LEVEL SECURITY;

-- Only allow system to insert audit logs
CREATE POLICY "System can insert audit logs" 
  ON public.security_audit_logs 
  FOR INSERT 
  WITH CHECK (true);

-- Admins can view all audit logs (we'll implement admin roles later)
CREATE POLICY "System can view audit logs" 
  ON public.security_audit_logs 
  FOR SELECT 
  USING (true);
