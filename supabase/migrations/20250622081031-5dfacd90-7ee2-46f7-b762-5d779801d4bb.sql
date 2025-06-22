
-- Add language column to user_profiles table
ALTER TABLE public.user_profiles 
ADD COLUMN language TEXT DEFAULT 'hindi';

-- Remove language column from learning_outlines table
ALTER TABLE public.learning_outlines 
DROP COLUMN language;

-- Add a comment to document the new column
COMMENT ON COLUMN public.user_profiles.language IS 'User preferred language for learning (e.g., hindi, english, spanish)';
