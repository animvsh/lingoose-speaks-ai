-- Create table for SMS conversations
CREATE TABLE public.sms_conversations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  phone_number TEXT NOT NULL,
  user_id UUID REFERENCES user_profiles(id),
  conversation_state JSONB DEFAULT '{}',
  last_message_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  scheduled_call_time TIMESTAMP WITH TIME ZONE,
  call_confirmed BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create table for SMS messages
CREATE TABLE public.sms_messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  conversation_id UUID REFERENCES sms_conversations(id) ON DELETE CASCADE,
  phone_number TEXT NOT NULL,
  message_text TEXT NOT NULL,
  direction TEXT NOT NULL CHECK (direction IN ('inbound', 'outbound')),
  message_sid TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create table for scheduled calls
CREATE TABLE public.scheduled_calls (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  phone_number TEXT NOT NULL,
  user_id UUID REFERENCES user_profiles(id),
  scheduled_time TIMESTAMP WITH TIME ZONE NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'calling', 'completed', 'failed', 'cancelled')),
  activity_id UUID REFERENCES activities(id),
  conversation_id UUID REFERENCES sms_conversations(id),
  call_attempts INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.sms_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sms_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scheduled_calls ENABLE ROW LEVEL SECURITY;

-- RLS Policies for sms_conversations
CREATE POLICY "Users can view their own SMS conversations" 
ON public.sms_conversations 
FOR SELECT 
USING (user_id = auth.uid() OR auth.uid() IS NULL);

CREATE POLICY "System can insert SMS conversations" 
ON public.sms_conversations 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "System can update SMS conversations" 
ON public.sms_conversations 
FOR UPDATE 
USING (true);

-- RLS Policies for sms_messages
CREATE POLICY "Users can view their SMS messages" 
ON public.sms_messages 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM sms_conversations 
    WHERE sms_conversations.id = sms_messages.conversation_id 
    AND (sms_conversations.user_id = auth.uid() OR auth.uid() IS NULL)
  )
);

CREATE POLICY "System can insert SMS messages" 
ON public.sms_messages 
FOR INSERT 
WITH CHECK (true);

-- RLS Policies for scheduled_calls
CREATE POLICY "Users can view their scheduled calls" 
ON public.scheduled_calls 
FOR SELECT 
USING (user_id = auth.uid() OR auth.uid() IS NULL);

CREATE POLICY "System can manage scheduled calls" 
ON public.scheduled_calls 
FOR ALL 
USING (true) 
WITH CHECK (true);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_sms_conversations_updated_at 
  BEFORE UPDATE ON sms_conversations 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_scheduled_calls_updated_at 
  BEFORE UPDATE ON scheduled_calls 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();