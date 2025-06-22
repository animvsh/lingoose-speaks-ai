
-- Drop all custom tables except user_profiles (which stores email, password, phone number)
DROP TABLE IF EXISTS public.subscriptions CASCADE;
DROP TABLE IF EXISTS public.daily_recommendations CASCADE;
DROP TABLE IF EXISTS public.user_node_progress CASCADE;
DROP TABLE IF EXISTS public.user_course_progress CASCADE;
DROP TABLE IF EXISTS public.course_nodes CASCADE;
DROP TABLE IF EXISTS public.courses CASCADE;
DROP TABLE IF EXISTS public.agent_audit_logs CASCADE;
DROP TABLE IF EXISTS public.conversations CASCADE;
DROP TABLE IF EXISTS public.call_logs CASCADE;
DROP TABLE IF EXISTS public.session_context CASCADE;

-- Drop custom enum types
DROP TYPE IF EXISTS public.node_status CASCADE;
DROP TYPE IF EXISTS public.node_difficulty CASCADE;
DROP TYPE IF EXISTS public.node_type CASCADE;
DROP TYPE IF EXISTS public.call_status CASCADE;
DROP TYPE IF EXISTS public.message_role CASCADE;
DROP TYPE IF EXISTS public.agent_action CASCADE;
DROP TYPE IF EXISTS public.persona_type CASCADE;
DROP TYPE IF EXISTS public.proficiency_level CASCADE;

-- Keep only the user_profiles table with basic authentication info
-- Remove unnecessary columns from user_profiles, keeping only essential auth data
ALTER TABLE public.user_profiles 
DROP COLUMN IF EXISTS voice_preferences,
DROP COLUMN IF EXISTS language_goal,
DROP COLUMN IF EXISTS proficiency_level,
DROP COLUMN IF EXISTS persona;

-- Ensure user_profiles has the essential columns for auth
-- (id, full_name, phone_number, created_at, updated_at should already exist)
