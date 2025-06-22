
-- Create table to store VAPI call analysis data
CREATE TABLE public.vapi_call_analysis (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  vapi_call_id TEXT NOT NULL UNIQUE,
  user_id UUID NOT NULL,
  phone_number TEXT NOT NULL,
  conversation_id UUID REFERENCES public.conversations(id),
  call_data JSONB NOT NULL,
  transcript TEXT,
  sentiment_analysis JSONB,
  performance_metrics JSONB,
  extracted_insights JSONB,
  call_duration INTEGER,
  call_status TEXT,
  call_started_at TIMESTAMP WITH TIME ZONE,
  call_ended_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add RLS policies
ALTER TABLE public.vapi_call_analysis ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own call analysis" 
  ON public.vapi_call_analysis 
  FOR SELECT 
  USING (user_id = auth.uid() OR phone_number IN (SELECT phone_number FROM public.user_profiles WHERE id = auth.uid()));

CREATE POLICY "System can insert call analysis" 
  ON public.vapi_call_analysis 
  FOR INSERT 
  WITH CHECK (true);

CREATE POLICY "System can update call analysis" 
  ON public.vapi_call_analysis 
  FOR UPDATE 
  USING (true);

-- Create trigger for updated_at
CREATE TRIGGER vapi_call_analysis_updated_at
    BEFORE UPDATE ON public.vapi_call_analysis
    FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

-- Create index for better performance
CREATE INDEX idx_vapi_call_analysis_user_id ON public.vapi_call_analysis(user_id);
CREATE INDEX idx_vapi_call_analysis_vapi_call_id ON public.vapi_call_analysis(vapi_call_id);
CREATE INDEX idx_vapi_call_analysis_conversation_id ON public.vapi_call_analysis(conversation_id);
