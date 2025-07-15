
-- Fix function_search_path_mutable issues by setting search_path to empty string for security
-- This prevents potential SQL injection attacks through search_path manipulation

-- 1. Fix handle_updated_at function
CREATE OR REPLACE FUNCTION public.handle_updated_at()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = ''
AS $function$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$function$;

-- 2. Fix handle_new_user function
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
  
  -- Initialize session context
  INSERT INTO public.session_context (user_id, context)
  VALUES (NEW.id, '');
  
  RETURN NEW;
END;
$function$;

-- 3. Fix calculate_skill_progress function
CREATE OR REPLACE FUNCTION public.calculate_skill_progress(p_user_id uuid, p_skill_id uuid)
 RETURNS integer
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = ''
AS $function$
DECLARE
  avg_score INTEGER;
BEGIN
  SELECT COALESCE(AVG(score), 0)::INTEGER
  INTO avg_score
  FROM public.user_mini_skill_scores umss
  JOIN public.mini_skills ms ON umss.mini_skill_id = ms.id
  WHERE umss.user_id = p_user_id AND ms.skill_id = p_skill_id;
  
  RETURN avg_score;
END;
$function$;

-- 4. Fix calculate_unit_progress function
CREATE OR REPLACE FUNCTION public.calculate_unit_progress(p_user_id uuid, p_unit_id uuid)
 RETURNS integer
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = ''
AS $function$
DECLARE
  avg_progress INTEGER;
BEGIN
  SELECT COALESCE(AVG(public.calculate_skill_progress(p_user_id, s.id)), 0)::INTEGER
  INTO avg_progress
  FROM public.skills s
  WHERE s.unit_id = p_unit_id;
  
  RETURN avg_progress;
END;
$function$;

-- 5. Fix is_unit_unlocked function
CREATE OR REPLACE FUNCTION public.is_unit_unlocked(p_user_id uuid, p_unit_id uuid)
 RETURNS boolean
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = ''
AS $function$
DECLARE
  prev_unit_id UUID;
  prev_unit_progress INTEGER;
  unlock_threshold INTEGER;
BEGIN
  -- Get the previous unit in order
  SELECT lu.id, lu.unlock_threshold
  INTO prev_unit_id, unlock_threshold
  FROM public.learning_units lu
  JOIN public.learning_units current_unit ON current_unit.outline_id = lu.outline_id
  WHERE current_unit.id = p_unit_id 
    AND lu.unit_order = (current_unit.unit_order - 1);
  
  -- If no previous unit, this unit is unlocked (first unit)
  IF prev_unit_id IS NULL THEN
    RETURN TRUE;
  END IF;
  
  -- Calculate previous unit progress
  SELECT public.calculate_unit_progress(p_user_id, prev_unit_id)
  INTO prev_unit_progress;
  
  -- Check if threshold is met
  RETURN prev_unit_progress >= unlock_threshold;
END;
$function$;

-- 6. Fix is_skill_unlocked function
CREATE OR REPLACE FUNCTION public.is_skill_unlocked(p_user_id uuid, p_skill_id uuid)
 RETURNS boolean
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = ''
AS $function$
DECLARE
  prev_skill_id UUID;
  prev_skill_progress INTEGER;
  unlock_threshold INTEGER;
  unit_id UUID;
BEGIN
  -- Get the unit and previous skill
  SELECT s.unit_id INTO unit_id FROM public.skills s WHERE s.id = p_skill_id;
  
  -- Check if the unit is unlocked first
  IF NOT public.is_unit_unlocked(p_user_id, unit_id) THEN
    RETURN FALSE;
  END IF;
  
  -- Get the previous skill in order within the same unit
  SELECT s.id, s.unlock_threshold
  INTO prev_skill_id, unlock_threshold
  FROM public.skills s
  JOIN public.skills current_skill ON current_skill.unit_id = s.unit_id
  WHERE current_skill.id = p_skill_id 
    AND s.skill_order = (current_skill.skill_order - 1);
  
  -- If no previous skill, this skill is unlocked (first skill in unit)
  IF prev_skill_id IS NULL THEN
    RETURN TRUE;
  END IF;
  
  -- Calculate previous skill progress
  SELECT public.calculate_skill_progress(p_user_id, prev_skill_id)
  INTO prev_skill_progress;
  
  -- Check if threshold is met
  RETURN prev_skill_progress >= unlock_threshold;
END;
$function$;

-- 7. Fix setLanguage function
CREATE OR REPLACE FUNCTION public."setLanguage"(p_language text, p_phone_number text)
 RETURNS void
 LANGUAGE plpgsql
 SET search_path = ''
AS $function$
BEGIN
  UPDATE public.user_profiles
  SET language = p_language
  WHERE phone_number = p_phone_number;
END;
$function$;

-- 8. Fix create_user function
CREATE OR REPLACE FUNCTION public.create_user(p_phone_number text, p_language text)
 RETURNS void
 LANGUAGE plpgsql
 SET search_path = ''
AS $function$
BEGIN
  INSERT INTO public.user_profiles (full_name, email, phone_number, language)
  VALUES ('blank_name', 'blank@gmail.com', p_phone_number, p_language);
END;
$function$;
