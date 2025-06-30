
-- Add name and proficiency_level columns to user_profiles table
ALTER TABLE public.user_profiles 
ADD COLUMN IF NOT EXISTS proficiency_level INTEGER DEFAULT 1 CHECK (proficiency_level >= 1 AND proficiency_level <= 5);

-- Update the full_name column to allow it to be updated (remove any constraints if needed)
-- The full_name column already exists, so we just need to make sure it can be updated
