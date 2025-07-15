
-- Add preferred_call_time column to user_profiles table
ALTER TABLE public.user_profiles 
ADD COLUMN preferred_call_time TIME DEFAULT '09:00:00';

-- Add a comment to document the column
COMMENT ON COLUMN public.user_profiles.preferred_call_time IS 'User preferred time for daily calls in HH:MM:SS format';
