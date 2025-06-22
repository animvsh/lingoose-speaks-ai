
-- Fix the handle_new_user function by removing reference to non-existent session_context table
CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = ''
AS $function$
BEGIN
  INSERT INTO public.user_profiles (id, full_name, phone_number)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'New User'),
    COALESCE(NEW.phone, NEW.raw_user_meta_data->>'phone_number', '+1234567890')
  );
  
  RETURN NEW;
END;
$function$;

-- Add missing foreign key constraints for data integrity
ALTER TABLE public.activities 
ADD CONSTRAINT activities_skill_id_fkey 
FOREIGN KEY (skill_id) REFERENCES public.skills(id) ON DELETE CASCADE;

ALTER TABLE public.conversations 
ADD CONSTRAINT conversations_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES public.user_profiles(id) ON DELETE CASCADE,
ADD CONSTRAINT conversations_outline_id_fkey 
FOREIGN KEY (outline_id) REFERENCES public.learning_outlines(id) ON DELETE CASCADE,
ADD CONSTRAINT conversations_unit_id_fkey 
FOREIGN KEY (unit_id) REFERENCES public.learning_units(id) ON DELETE CASCADE,
ADD CONSTRAINT conversations_skill_id_fkey 
FOREIGN KEY (skill_id) REFERENCES public.skills(id) ON DELETE CASCADE;

ALTER TABLE public.learning_units 
ADD CONSTRAINT learning_units_outline_id_fkey 
FOREIGN KEY (outline_id) REFERENCES public.learning_outlines(id) ON DELETE CASCADE;

ALTER TABLE public.skills 
ADD CONSTRAINT skills_unit_id_fkey 
FOREIGN KEY (unit_id) REFERENCES public.learning_units(id) ON DELETE CASCADE;

ALTER TABLE public.mini_skills 
ADD CONSTRAINT mini_skills_skill_id_fkey 
FOREIGN KEY (skill_id) REFERENCES public.skills(id) ON DELETE CASCADE;

ALTER TABLE public.user_mini_skill_scores 
ADD CONSTRAINT user_mini_skill_scores_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES public.user_profiles(id) ON DELETE CASCADE,
ADD CONSTRAINT user_mini_skill_scores_mini_skill_id_fkey 
FOREIGN KEY (mini_skill_id) REFERENCES public.mini_skills(id) ON DELETE CASCADE;

ALTER TABLE public.user_activity_ratings 
ADD CONSTRAINT user_activity_ratings_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES public.user_profiles(id) ON DELETE CASCADE,
ADD CONSTRAINT user_activity_ratings_activity_id_fkey 
FOREIGN KEY (activity_id) REFERENCES public.activities(id) ON DELETE CASCADE,
ADD CONSTRAINT user_activity_ratings_skill_id_fkey 
FOREIGN KEY (skill_id) REFERENCES public.skills(id) ON DELETE CASCADE;

ALTER TABLE public.user_outline_progress 
ADD CONSTRAINT user_outline_progress_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES public.user_profiles(id) ON DELETE CASCADE,
ADD CONSTRAINT user_outline_progress_outline_id_fkey 
FOREIGN KEY (outline_id) REFERENCES public.learning_outlines(id) ON DELETE CASCADE,
ADD CONSTRAINT user_outline_progress_current_unit_id_fkey 
FOREIGN KEY (current_unit_id) REFERENCES public.learning_units(id) ON DELETE SET NULL,
ADD CONSTRAINT user_outline_progress_current_skill_id_fkey 
FOREIGN KEY (current_skill_id) REFERENCES public.skills(id) ON DELETE SET NULL;

ALTER TABLE public.subscriptions 
ADD CONSTRAINT subscriptions_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES public.user_profiles(id) ON DELETE CASCADE;

-- Fix the create_user function to use proper parameters and remove hardcoded values
CREATE OR REPLACE FUNCTION public.create_user(p_phone_number text, p_language text)
 RETURNS void
 LANGUAGE plpgsql
 SET search_path = ''
AS $function$
BEGIN
  INSERT INTO public.user_profiles (id, full_name, phone_number, language)
  VALUES (gen_random_uuid(), 'New User', p_phone_number, p_language);
END;
$function$;

-- Add indexes for better performance on frequently queried columns
CREATE INDEX IF NOT EXISTS idx_activities_skill_id ON public.activities(skill_id);
CREATE INDEX IF NOT EXISTS idx_conversations_user_id ON public.conversations(user_id);
CREATE INDEX IF NOT EXISTS idx_conversations_created_at ON public.conversations(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_user_mini_skill_scores_user_id ON public.user_mini_skill_scores(user_id);
CREATE INDEX IF NOT EXISTS idx_user_activity_ratings_user_id ON public.user_activity_ratings(user_id);
CREATE INDEX IF NOT EXISTS idx_user_profiles_phone_number ON public.user_profiles(phone_number);
