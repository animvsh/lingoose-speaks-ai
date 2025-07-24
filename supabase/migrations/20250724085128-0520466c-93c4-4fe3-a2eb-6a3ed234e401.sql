-- Create the fluency roadmap structure

-- Fluency levels table
CREATE TABLE public.fluency_levels (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  level_number INTEGER NOT NULL UNIQUE,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  goal_description TEXT NOT NULL,
  target_wpm_min INTEGER DEFAULT 80,
  target_wpm_max INTEGER DEFAULT 120,
  target_vocabulary_size INTEGER DEFAULT 100,
  color_code TEXT DEFAULT '#22c55e',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Skills within each level
CREATE TABLE public.level_skills (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  fluency_level_id UUID NOT NULL,
  skill_category TEXT NOT NULL, -- 'vocabulary', 'grammar', 'expression', 'cultural'
  skill_name TEXT NOT NULL,
  skill_description TEXT NOT NULL,
  target_vocabulary JSONB DEFAULT '[]'::jsonb, -- Array of words to learn
  example_phrases JSONB DEFAULT '[]'::jsonb, -- Example phrases
  skill_order INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Test prompts for each skill
CREATE TABLE public.skill_test_prompts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  level_skill_id UUID NOT NULL,
  prompt_text TEXT NOT NULL,
  prompt_type TEXT NOT NULL, -- 'introduction', 'conversation', 'scenario', 'storytelling'
  difficulty_modifier INTEGER DEFAULT 1, -- 1-5 scale
  expected_vocabulary JSONB DEFAULT '[]'::jsonb,
  success_criteria JSONB NOT NULL, -- Metrics thresholds for success
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- User progress through the roadmap
CREATE TABLE public.user_fluency_progress (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  current_level_id UUID NOT NULL,
  current_skill_id UUID,
  level_progress_percentage INTEGER DEFAULT 0,
  skills_mastered INTEGER DEFAULT 0,
  total_skills_in_level INTEGER DEFAULT 0,
  fluency_composite_score NUMERIC(5,2) DEFAULT 0.0,
  vocabulary_learned_count INTEGER DEFAULT 0,
  current_streak_days INTEGER DEFAULT 0,
  last_practice_date DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Skill mastery tracking
CREATE TABLE public.user_skill_mastery (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  level_skill_id UUID NOT NULL,
  mastery_level INTEGER DEFAULT 0, -- 0-100 percentage
  attempts_count INTEGER DEFAULT 0,
  best_score NUMERIC(5,2) DEFAULT 0.0,
  last_practiced TIMESTAMP WITH TIME ZONE,
  vocabulary_retention JSONB DEFAULT '{}'::jsonb, -- Track individual word retention
  common_errors JSONB DEFAULT '[]'::jsonb,
  mastered_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Session performance tracking (enhanced version)
CREATE TABLE public.session_performance (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  vapi_call_analysis_id UUID,
  fluency_level_id UUID NOT NULL,
  level_skill_id UUID,
  session_type TEXT NOT NULL, -- 'practice', 'test', 'review'
  
  -- User performance metrics
  wpm NUMERIC(5,2),
  speech_time_ratio NUMERIC(3,2),
  unique_vocabulary_count INTEGER,
  target_vocabulary_hit_rate NUMERIC(5,2),
  filler_words_per_minute NUMERIC(4,2),
  pauses_per_minute NUMERIC(4,2),
  turn_count INTEGER,
  avg_response_time_seconds NUMERIC(5,2),
  self_correction_rate NUMERIC(3,2),
  silence_percentage NUMERIC(5,2),
  clarity_percentage NUMERIC(5,2),
  
  -- AI performance metrics
  ai_question_appropriateness INTEGER, -- 1-5 scale
  ai_wait_time_appropriate BOOLEAN DEFAULT true,
  ai_used_target_vocabulary BOOLEAN DEFAULT false,
  ai_correction_gentleness INTEGER, -- 1-5 scale
  ai_speech_dominance_ratio NUMERIC(3,2),
  
  -- Session outcome
  skill_improvement_score NUMERIC(5,2),
  session_success BOOLEAN DEFAULT false,
  areas_for_improvement JSONB DEFAULT '[]'::jsonb,
  vocabulary_learned JSONB DEFAULT '[]'::jsonb,
  
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.fluency_levels ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.level_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skill_test_prompts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_fluency_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_skill_mastery ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.session_performance ENABLE ROW LEVEL SECURITY;

-- Create policies for fluency levels (public read)
CREATE POLICY "Anyone can view fluency levels" 
ON public.fluency_levels 
FOR SELECT 
USING (true);

-- Create policies for level skills (public read)
CREATE POLICY "Anyone can view level skills" 
ON public.level_skills 
FOR SELECT 
USING (true);

-- Create policies for skill test prompts (public read)
CREATE POLICY "Anyone can view skill test prompts" 
ON public.skill_test_prompts 
FOR SELECT 
USING (true);

-- Create policies for user fluency progress
CREATE POLICY "Users can view their own fluency progress" 
ON public.user_fluency_progress 
FOR SELECT 
USING (user_id = auth.uid());

CREATE POLICY "Users can insert their own fluency progress" 
ON public.user_fluency_progress 
FOR INSERT 
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own fluency progress" 
ON public.user_fluency_progress 
FOR UPDATE 
USING (user_id = auth.uid());

-- Create policies for user skill mastery
CREATE POLICY "Users can view their own skill mastery" 
ON public.user_skill_mastery 
FOR SELECT 
USING (user_id = auth.uid());

CREATE POLICY "Users can insert their own skill mastery" 
ON public.user_skill_mastery 
FOR INSERT 
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own skill mastery" 
ON public.user_skill_mastery 
FOR UPDATE 
USING (user_id = auth.uid());

-- Create policies for session performance
CREATE POLICY "Users can view their own session performance" 
ON public.session_performance 
FOR SELECT 
USING (user_id = auth.uid());

CREATE POLICY "System can insert session performance" 
ON public.session_performance 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "System can update session performance" 
ON public.session_performance 
FOR UPDATE 
USING (true);

-- Create indexes for performance
CREATE INDEX idx_level_skills_fluency_level ON public.level_skills(fluency_level_id);
CREATE INDEX idx_skill_test_prompts_level_skill ON public.skill_test_prompts(level_skill_id);
CREATE INDEX idx_user_fluency_progress_user_id ON public.user_fluency_progress(user_id);
CREATE INDEX idx_user_skill_mastery_user_id ON public.user_skill_mastery(user_id);
CREATE INDEX idx_user_skill_mastery_skill_id ON public.user_skill_mastery(level_skill_id);
CREATE INDEX idx_session_performance_user_id ON public.session_performance(user_id);
CREATE INDEX idx_session_performance_call_analysis ON public.session_performance(vapi_call_analysis_id);

-- Create triggers for updated_at timestamps
CREATE TRIGGER update_fluency_levels_updated_at
  BEFORE UPDATE ON public.fluency_levels
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER update_level_skills_updated_at
  BEFORE UPDATE ON public.level_skills
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER update_user_fluency_progress_updated_at
  BEFORE UPDATE ON public.user_fluency_progress
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER update_user_skill_mastery_updated_at
  BEFORE UPDATE ON public.user_skill_mastery
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();