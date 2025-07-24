-- Drop existing complex metrics tables and replace with focused core metrics
DROP TABLE IF EXISTS call_language_metrics CASCADE;
DROP TABLE IF EXISTS session_performance CASCADE;
DROP TABLE IF EXISTS vapi_skill_analysis CASCADE;

-- Create new core metrics table with only the 10 essential metrics
CREATE TABLE public.core_language_metrics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  vapi_call_analysis_id UUID NOT NULL,
  phone_number TEXT NOT NULL,
  call_date DATE NOT NULL DEFAULT CURRENT_DATE,
  
  -- Core Metric 1: Words Per Minute
  words_per_minute NUMERIC(6,2),
  total_words_spoken INTEGER,
  user_speaking_time_seconds NUMERIC(8,2),
  
  -- Core Metric 2: Filler Words per Minute
  filler_words_per_minute NUMERIC(6,2),
  filler_words_detected TEXT[],
  
  -- Core Metric 3: Pauses per Minute
  pauses_per_minute NUMERIC(6,2),
  long_pause_count INTEGER,
  
  -- Core Metric 4: Speech Clarity %
  speech_clarity_percent NUMERIC(5,2),
  words_correctly_transcribed INTEGER,
  
  -- Core Metric 5: Turn Count
  turn_count INTEGER,
  total_exchanges INTEGER,
  
  -- Core Metric 6: Unique Vocabulary Count
  unique_vocabulary_count INTEGER,
  words_used TEXT[],
  
  -- Core Metric 7: Target Vocabulary Usage %
  target_vocabulary_usage_percent NUMERIC(5,2),
  target_vocabulary TEXT[],
  matched_target_words TEXT[],
  
  -- Core Metric 8: Self-Correction Rate
  self_correction_rate NUMERIC(5,2),
  correction_count INTEGER,
  total_sentences INTEGER,
  
  -- Core Metric 9: Average Response Delay
  average_response_delay_seconds NUMERIC(6,2),
  response_delays NUMERIC[],
  
  -- Core Metric 10: Fluency Progress Delta
  fluency_progress_delta NUMERIC(6,2),
  composite_score NUMERIC(5,2),
  previous_session_scores JSONB DEFAULT '[]'::jsonb,
  
  -- Metadata
  analysis_confidence NUMERIC(3,2) DEFAULT 0.85,
  advancement_eligible BOOLEAN DEFAULT false,
  areas_for_improvement TEXT[],
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.core_language_metrics ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "System can insert core metrics" 
ON public.core_language_metrics 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "System can update core metrics" 
ON public.core_language_metrics 
FOR UPDATE 
USING (true);

CREATE POLICY "Users can view their own metrics" 
ON public.core_language_metrics 
FOR SELECT 
USING (user_id = auth.uid() OR phone_number IN (
  SELECT phone_number FROM user_profiles WHERE id = auth.uid()
));

-- Create adaptive activities table for future activity generation
CREATE TABLE public.adaptive_activities (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  phone_number TEXT NOT NULL,
  scheduled_date DATE NOT NULL,
  activity_type TEXT NOT NULL,
  
  -- Activity details
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  target_metrics TEXT[] NOT NULL, -- Which of the 10 metrics this targets
  difficulty_level INTEGER NOT NULL DEFAULT 1, -- 1-10 scale
  estimated_duration_minutes INTEGER DEFAULT 10,
  
  -- Personalization based on performance
  focus_areas JSONB NOT NULL DEFAULT '[]'::jsonb,
  target_vocabulary TEXT[] DEFAULT '{}',
  conversation_prompts TEXT[] DEFAULT '{}',
  practice_scenarios JSONB DEFAULT '[]'::jsonb,
  
  -- Performance tracking
  weakness_areas TEXT[] DEFAULT '{}', -- Areas user is struggling with
  strength_areas TEXT[] DEFAULT '{}', -- Areas user excels at
  adaptation_reason TEXT, -- Why this activity was generated/modified
  
  -- Status
  is_completed BOOLEAN DEFAULT false,
  completed_at TIMESTAMP WITH TIME ZONE,
  performance_after JSONB,
  
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.adaptive_activities ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own activities" 
ON public.adaptive_activities 
FOR SELECT 
USING (user_id = auth.uid() OR phone_number IN (
  SELECT phone_number FROM user_profiles WHERE id = auth.uid()
));

CREATE POLICY "System can insert activities" 
ON public.adaptive_activities 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "System can update activities" 
ON public.adaptive_activities 
FOR UPDATE 
USING (true);

CREATE POLICY "Users can update their activity completion" 
ON public.adaptive_activities 
FOR UPDATE 
USING (user_id = auth.uid());

-- Create level progression tracking table
CREATE TABLE public.user_level_progression (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  phone_number TEXT NOT NULL,
  
  current_level TEXT NOT NULL DEFAULT 'foundations',
  level_start_date DATE NOT NULL DEFAULT CURRENT_DATE,
  
  -- Target thresholds for current level
  target_wpm NUMERIC(6,2),
  target_vocab_usage_percent NUMERIC(5,2),
  target_unique_words INTEGER,
  target_turn_count INTEGER,
  target_clarity_percent NUMERIC(5,2),
  target_filler_rate NUMERIC(5,2),
  target_pause_rate NUMERIC(5,2),
  target_response_delay NUMERIC(5,2),
  
  -- Progress tracking
  sessions_meeting_criteria INTEGER DEFAULT 0,
  total_sessions_in_level INTEGER DEFAULT 0,
  advancement_blocked_reason TEXT,
  
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.user_level_progression ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own progression" 
ON public.user_level_progression 
FOR SELECT 
USING (user_id = auth.uid() OR phone_number IN (
  SELECT phone_number FROM user_profiles WHERE id = auth.uid()
));

CREATE POLICY "System can manage progression" 
ON public.user_level_progression 
FOR ALL 
USING (true);

-- Create indexes for performance
CREATE INDEX idx_core_metrics_user_date ON public.core_language_metrics(user_id, call_date DESC);
CREATE INDEX idx_core_metrics_phone_date ON public.core_language_metrics(phone_number, call_date DESC);
CREATE INDEX idx_adaptive_activities_user_date ON public.adaptive_activities(user_id, scheduled_date);
CREATE INDEX idx_adaptive_activities_phone_date ON public.adaptive_activities(phone_number, scheduled_date);
CREATE INDEX idx_level_progression_user ON public.user_level_progression(user_id);

-- Create function to calculate composite fluency score
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
) RETURNS NUMERIC AS $$
DECLARE
  weighted_score NUMERIC := 0;
BEGIN
  -- Normalize and weight each metric (0-100 scale)
  weighted_score := weighted_score + LEAST(100, GREATEST(0, (p_wpm / 150.0) * 100)) * 0.15; -- WPM (15%)
  weighted_score := weighted_score + LEAST(100, GREATEST(0, (p_unique_words / 100.0) * 100)) * 0.10; -- Unique Words (10%)
  weighted_score := weighted_score + LEAST(100, GREATEST(0, p_target_vocab_percent)) * 0.10; -- Target Vocab % (10%)
  weighted_score := weighted_score + LEAST(100, GREATEST(0, 100 - (p_filler_rate * 10))) * 0.10; -- Filler Words (10% - inverted)
  weighted_score := weighted_score + LEAST(100, GREATEST(0, 100 - (p_pause_rate * 10))) * 0.10; -- Pauses (10% - inverted)
  weighted_score := weighted_score + LEAST(100, GREATEST(0, (p_turn_count / 15.0) * 100)) * 0.10; -- Turn Count (10%)
  weighted_score := weighted_score + LEAST(100, GREATEST(0, p_clarity_percent)) * 0.10; -- Clarity (10%)
  weighted_score := weighted_score + LEAST(100, GREATEST(0, 100 - (p_response_delay * 20))) * 0.10; -- Response Delay (10% - inverted)
  weighted_score := weighted_score + LEAST(100, GREATEST(0, 100 - (p_self_correction_rate * 2))) * 0.10; -- Self-Corrections (10% - inverted)
  weighted_score := weighted_score + LEAST(100, GREATEST(0, 50 + p_progress_delta)) * 0.05; -- Progress Delta (5%)
  
  RETURN ROUND(weighted_score, 2);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to check level advancement eligibility
CREATE OR REPLACE FUNCTION public.check_level_advancement(p_user_id UUID, p_phone_number TEXT)
RETURNS TABLE(eligible BOOLEAN, current_level TEXT, sessions_qualified INTEGER, reason TEXT) AS $$
DECLARE
  user_level TEXT;
  recent_sessions INTEGER;
  qualified_sessions INTEGER;
  advancement_threshold INTEGER := 2; -- Need 2 out of last 3 sessions to qualify
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
    -- Foundations → Conversational: WPM ≥ 90, Vocab Hit ≥ 70%, Unique Words ≥ 40, Turn Count ≥ 8
    SELECT COUNT(*) INTO qualified_sessions
    FROM public.core_language_metrics clm
    WHERE (clm.user_id = p_user_id OR clm.phone_number = p_phone_number)
      AND clm.call_date >= CURRENT_DATE - INTERVAL '3 days'
      AND clm.words_per_minute >= 90
      AND clm.target_vocabulary_usage_percent >= 70
      AND clm.unique_vocabulary_count >= 40
      AND clm.turn_count >= 8;
      
  ELSIF user_level = 'conversational' THEN
    -- Conversational → Fluent: WPM ≥ 110, Fillers < 4/min, Clarity ≥ 90%, Pauses < 5/min
    SELECT COUNT(*) INTO qualified_sessions
    FROM public.core_language_metrics clm
    WHERE (clm.user_id = p_user_id OR clm.phone_number = p_phone_number)
      AND clm.call_date >= CURRENT_DATE - INTERVAL '3 days'
      AND clm.words_per_minute >= 110
      AND clm.filler_words_per_minute < 4
      AND clm.speech_clarity_percent >= 90
      AND clm.pauses_per_minute < 5;
      
  ELSIF user_level = 'fluent' THEN
    -- Fluent → Native-like: WPM ≥ 130, Turn Count ≥ 12, Vocab Hit ≥ 85%, Response Delay < 1.5s, Clarity ≥ 95%
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
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create triggers for updated_at
CREATE TRIGGER update_core_metrics_updated_at
  BEFORE UPDATE ON public.core_language_metrics
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER update_adaptive_activities_updated_at
  BEFORE UPDATE ON public.adaptive_activities
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER update_level_progression_updated_at
  BEFORE UPDATE ON public.user_level_progression
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();