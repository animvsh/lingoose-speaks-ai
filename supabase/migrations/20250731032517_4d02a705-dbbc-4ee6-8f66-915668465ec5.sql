-- Add new columns to user_profiles for enhanced onboarding
ALTER TABLE public.user_profiles 
ADD COLUMN IF NOT EXISTS age INTEGER,
ADD COLUMN IF NOT EXISTS location TEXT,
ADD COLUMN IF NOT EXISTS mother_tongue TEXT,
ADD COLUMN IF NOT EXISTS account_type TEXT DEFAULT 'self' CHECK (account_type IN ('self', 'child', 'other')),
ADD COLUMN IF NOT EXISTS account_holder_name TEXT;