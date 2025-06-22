
-- Add the last_conversation_summary field to user_profiles table
ALTER TABLE public.user_profiles 
ADD COLUMN IF NOT EXISTS last_conversation_summary TEXT;

-- Create a function to update the conversation summary
CREATE OR REPLACE FUNCTION public.update_conversation_summary(
  p_user_id UUID,
  p_summary TEXT
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  UPDATE public.user_profiles
  SET 
    last_conversation_summary = p_summary,
    updated_at = now()
  WHERE id = p_user_id;
END;
$$;

-- Grant execute permission on the function
GRANT EXECUTE ON FUNCTION public.update_conversation_summary(UUID, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION public.update_conversation_summary(UUID, TEXT) TO anon;
