
-- Create table to store curriculum analytics insights
CREATE TABLE public.curriculum_insights (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  phone_number TEXT NOT NULL,
  insights JSONB NOT NULL,
  learning_recommendations JSONB NOT NULL,
  comparison_analysis JSONB NOT NULL,
  confidence_score INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add RLS policies
ALTER TABLE public.curriculum_insights ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own insights" 
  ON public.curriculum_insights 
  FOR SELECT 
  USING (phone_number = (SELECT phone_number FROM public.user_profiles WHERE id = auth.uid() OR phone_number IN (SELECT phone_number FROM public.user_profiles)));

CREATE POLICY "System can insert insights" 
  ON public.curriculum_insights 
  FOR INSERT 
  WITH CHECK (true);

CREATE POLICY "System can update insights" 
  ON public.curriculum_insights 
  FOR UPDATE 
  USING (true);

-- Create trigger for updated_at
CREATE TRIGGER curriculum_insights_updated_at
    BEFORE UPDATE ON public.curriculum_insights
    FOR EACH ROW EXECUTE FUNCTION handle_updated_at();
