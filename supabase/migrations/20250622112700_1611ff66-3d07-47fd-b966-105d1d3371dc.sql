
-- Add missing column to user_profiles table for conversation summary
ALTER TABLE public.user_profiles 
ADD COLUMN last_conversation_summary TEXT;
