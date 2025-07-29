-- Update proficiency_level constraint to allow only 1-3
ALTER TABLE public.user_profiles 
DROP CONSTRAINT IF EXISTS user_profiles_proficiency_level_check;

ALTER TABLE public.user_profiles 
ADD CONSTRAINT user_profiles_proficiency_level_check 
CHECK (proficiency_level >= 1 AND proficiency_level <= 3);

-- Update existing users with level 4-5 to level 3 (Advanced)
UPDATE public.user_profiles 
SET proficiency_level = 3 
WHERE proficiency_level > 3; 