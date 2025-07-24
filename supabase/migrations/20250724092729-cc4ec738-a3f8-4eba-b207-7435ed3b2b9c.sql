-- Create table for AI behavior metrics
CREATE TABLE public.ai_behavior_metrics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  vapi_call_analysis_id UUID NOT NULL,
  phone_number TEXT NOT NULL,
  call_date DATE NOT NULL DEFAULT CURRENT_DATE,
  
  -- Core metrics (0.0 to 1.0 scale)
  instruction_adherence NUMERIC DEFAULT 0,
  target_vocab_prompt_rate NUMERIC DEFAULT 0,
  question_density NUMERIC DEFAULT 0,
  continuity_score NUMERIC DEFAULT 0,
  followup_quality NUMERIC DEFAULT 0,
  repetition_avoidance NUMERIC DEFAULT 0,
  tone_consistency NUMERIC DEFAULT 0,
  recovery_score NUMERIC DEFAULT 0,
  
  -- Special metrics
  callback_usage INTEGER DEFAULT 0,
  user_fluency_delta NUMERIC DEFAULT 0,
  
  -- Detailed analysis
  analysis_details JSONB DEFAULT '{}',
  improvement_suggestions TEXT[],
  
  -- Meta
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.ai_behavior_metrics ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "System can insert AI metrics" 
ON public.ai_behavior_metrics 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "System can update AI metrics" 
ON public.ai_behavior_metrics 
FOR UPDATE 
USING (true);

CREATE POLICY "Users can view their own AI metrics" 
ON public.ai_behavior_metrics 
FOR SELECT 
USING ((user_id = auth.uid()) OR (phone_number IN (
  SELECT user_profiles.phone_number
  FROM user_profiles
  WHERE user_profiles.id = auth.uid()
)));

-- Create table for system prompt evolution
CREATE TABLE public.system_prompt_evolution (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  phone_number TEXT NOT NULL,
  
  -- Prompt data
  current_prompt TEXT NOT NULL,
  previous_prompt TEXT,
  
  -- Metrics that triggered this change
  trigger_metrics JSONB NOT NULL DEFAULT '{}',
  improvement_rationale TEXT,
  
  -- Status
  is_active BOOLEAN DEFAULT true,
  effectiveness_score NUMERIC DEFAULT 0,
  
  -- Meta
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.system_prompt_evolution ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "System can manage prompts" 
ON public.system_prompt_evolution 
FOR ALL 
USING (true);

CREATE POLICY "Users can view their own prompt evolution" 
ON public.system_prompt_evolution 
FOR SELECT 
USING ((user_id = auth.uid()) OR (phone_number IN (
  SELECT user_profiles.phone_number
  FROM user_profiles
  WHERE user_profiles.id = auth.uid()
)));

-- Add trigger for updated_at
CREATE TRIGGER update_ai_behavior_metrics_updated_at
BEFORE UPDATE ON public.ai_behavior_metrics
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER update_system_prompt_evolution_updated_at
BEFORE UPDATE ON public.system_prompt_evolution
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();