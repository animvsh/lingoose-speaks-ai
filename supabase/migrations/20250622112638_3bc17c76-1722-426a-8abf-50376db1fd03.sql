
-- Create table to store detailed subskill explanations
CREATE TABLE public.skill_explanations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  skill_id UUID NOT NULL REFERENCES public.skills(id) ON DELETE CASCADE,
  explanation TEXT NOT NULL,
  use_cases JSONB NOT NULL,
  examples JSONB NOT NULL,
  difficulty_tips TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add RLS policies
ALTER TABLE public.skill_explanations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view skill explanations" 
  ON public.skill_explanations 
  FOR SELECT 
  USING (true);

CREATE POLICY "System can insert skill explanations" 
  ON public.skill_explanations 
  FOR INSERT 
  WITH CHECK (true);

CREATE POLICY "System can update skill explanations" 
  ON public.skill_explanations 
  FOR UPDATE 
  USING (true);

-- Create trigger for updated_at
CREATE TRIGGER skill_explanations_updated_at
    BEFORE UPDATE ON public.skill_explanations
    FOR EACH ROW EXECUTE FUNCTION handle_updated_at();
