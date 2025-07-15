
-- Create table to store detailed skill analysis from VAPI calls
CREATE TABLE public.vapi_skill_analysis (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  vapi_call_analysis_id UUID NOT NULL REFERENCES public.vapi_call_analysis(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  skill_name TEXT NOT NULL,
  before_score INTEGER NOT NULL DEFAULT 0,
  after_score INTEGER NOT NULL DEFAULT 0,
  improvement INTEGER NOT NULL DEFAULT 0,
  analysis_details JSONB,
  confidence_score DECIMAL(3,2) DEFAULT 0.85,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add RLS policies
ALTER TABLE public.vapi_skill_analysis ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own skill analysis" 
  ON public.vapi_skill_analysis 
  FOR SELECT 
  USING (user_id = auth.uid());

CREATE POLICY "System can insert skill analysis" 
  ON public.vapi_skill_analysis 
  FOR INSERT 
  WITH CHECK (true);

CREATE POLICY "System can update skill analysis" 
  ON public.vapi_skill_analysis 
  FOR UPDATE 
  USING (true);

-- Create trigger for updated_at
CREATE TRIGGER vapi_skill_analysis_updated_at
    BEFORE UPDATE ON public.vapi_skill_analysis
    FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

-- Create indexes for better performance
CREATE INDEX idx_vapi_skill_analysis_user_id ON public.vapi_skill_analysis(user_id);
CREATE INDEX idx_vapi_skill_analysis_call_id ON public.vapi_skill_analysis(vapi_call_analysis_id);
