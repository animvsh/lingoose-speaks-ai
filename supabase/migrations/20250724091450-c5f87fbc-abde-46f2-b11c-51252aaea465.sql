-- Fix security issues: Enable RLS on tables that need it and fix function search paths

-- Enable RLS on tables that were missing it
ALTER TABLE public.call_transcripts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pronunciation_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.security_audit_logs ENABLE ROW LEVEL SECURITY;

-- Create policies for call_transcripts
CREATE POLICY "System can insert call transcripts" 
ON public.call_transcripts 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "System can select call transcripts" 
ON public.call_transcripts 
FOR SELECT 
USING (true);

-- Create policies for pronunciation_results
CREATE POLICY "System can insert pronunciation results" 
ON public.pronunciation_results 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Users can view their own pronunciation results" 
ON public.pronunciation_results 
FOR SELECT 
USING (user_id = auth.uid());

-- Create policies for security_audit_logs
CREATE POLICY "System can insert security audit logs" 
ON public.security_audit_logs 
FOR INSERT 
WITH CHECK (true);

-- Fix function search paths by adding SET search_path = ''
CREATE OR REPLACE FUNCTION public.calculate_composite_score(
  p_wpm NUMERIC,
  p_unique_words INTEGER,
  p_target_vocab_percent NUMERIC,
  p_filler_rate NUMERIC,
  p_pause_rate NUMERIC,
  p_turn_count INTEGER,
  p_clarity_percent NUMERIC,
  p_response_delay NUMERIC,
  p_self_correction_rate NUMERIC,
  p_progress_delta NUMERIC
) RETURNS NUMERIC 
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  weighted_score NUMERIC := 0;
BEGIN
  -- Normalize and weight each metric (0-100 scale)
  weighted_score := weighted_score + LEAST(100, GREATEST(0, (p_wpm / 150.0) * 100)) * 0.15;
  weighted_score := weighted_score + LEAST(100, GREATEST(0, (p_unique_words / 100.0) * 100)) * 0.10;
  weighted_score := weighted_score + LEAST(100, GREATEST(0, p_target_vocab_percent)) * 0.10;
  weighted_score := weighted_score + LEAST(100, GREATEST(0, 100 - (p_filler_rate * 10))) * 0.10;
  weighted_score := weighted_score + LEAST(100, GREATEST(0, 100 - (p_pause_rate * 10))) * 0.10;
  weighted_score := weighted_score + LEAST(100, GREATEST(0, (p_turn_count / 15.0) * 100)) * 0.10;
  weighted_score := weighted_score + LEAST(100, GREATEST(0, p_clarity_percent)) * 0.10;
  weighted_score := weighted_score + LEAST(100, GREATEST(0, 100 - (p_response_delay * 20))) * 0.10;
  weighted_score := weighted_score + LEAST(100, GREATEST(0, 100 - (p_self_correction_rate * 2))) * 0.10;
  weighted_score := weighted_score + LEAST(100, GREATEST(0, 50 + p_progress_delta)) * 0.05;
  
  RETURN ROUND(weighted_score, 2);
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION public.check_level_advancement(p_user_id UUID, p_phone_number TEXT)
RETURNS TABLE(eligible BOOLEAN, current_level TEXT, sessions_qualified INTEGER, reason TEXT) 
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  user_level TEXT;
  recent_sessions INTEGER;
  qualified_sessions INTEGER;
  advancement_threshold INTEGER := 2;
BEGIN
  -- Get current level
  SELECT ul.current_level INTO user_level
  FROM public.user_level_progression ul
  WHERE ul.user_id = p_user_id OR ul.phone_number = p_phone_number
  ORDER BY ul.created_at DESC
  LIMIT 1;
  
  IF user_level IS NULL THEN
    user_level := 'foundations';
  END IF;
  
  -- Count recent sessions meeting criteria based on level
  IF user_level = 'foundations' THEN
    SELECT COUNT(*) INTO qualified_sessions
    FROM public.core_language_metrics clm
    WHERE (clm.user_id = p_user_id OR clm.phone_number = p_phone_number)
      AND clm.call_date >= CURRENT_DATE - INTERVAL '3 days'
      AND clm.words_per_minute >= 90
      AND clm.target_vocabulary_usage_percent >= 70
      AND clm.unique_vocabulary_count >= 40
      AND clm.turn_count >= 8;
      
  ELSIF user_level = 'conversational' THEN
    SELECT COUNT(*) INTO qualified_sessions
    FROM public.core_language_metrics clm
    WHERE (clm.user_id = p_user_id OR clm.phone_number = p_phone_number)
      AND clm.call_date >= CURRENT_DATE - INTERVAL '3 days'
      AND clm.words_per_minute >= 110
      AND clm.filler_words_per_minute < 4
      AND clm.speech_clarity_percent >= 90
      AND clm.pauses_per_minute < 5;
      
  ELSIF user_level = 'fluent' THEN
    SELECT COUNT(*) INTO qualified_sessions
    FROM public.core_language_metrics clm
    WHERE (clm.user_id = p_user_id OR clm.phone_number = p_phone_number)
      AND clm.call_date >= CURRENT_DATE - INTERVAL '3 days'
      AND clm.words_per_minute >= 130
      AND clm.turn_count >= 12
      AND clm.target_vocabulary_usage_percent >= 85
      AND clm.average_response_delay_seconds < 1.5
      AND clm.speech_clarity_percent >= 95;
  END IF;
  
  -- Get total recent sessions
  SELECT COUNT(*) INTO recent_sessions
  FROM public.core_language_metrics clm
  WHERE (clm.user_id = p_user_id OR clm.phone_number = p_phone_number)
    AND clm.call_date >= CURRENT_DATE - INTERVAL '3 days';
  
  RETURN QUERY SELECT 
    (qualified_sessions >= advancement_threshold AND recent_sessions >= 2)::BOOLEAN,
    user_level,
    qualified_sessions,
    CASE 
      WHEN qualified_sessions >= advancement_threshold AND recent_sessions >= 2 THEN 'Ready for advancement'
      WHEN recent_sessions < 2 THEN 'Need more recent sessions'
      ELSE 'Need ' || (advancement_threshold - qualified_sessions)::TEXT || ' more qualifying sessions'
    END;
END;
$$ LANGUAGE plpgsql;