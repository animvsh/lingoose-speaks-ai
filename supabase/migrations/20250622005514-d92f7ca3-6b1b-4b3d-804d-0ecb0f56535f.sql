
-- Create enum types
CREATE TYPE public.proficiency_level AS ENUM ('beginner', 'intermediate', 'advanced');
CREATE TYPE public.persona_type AS ENUM ('goose_strict', 'goose_flirty', 'goose_chaotic', 'goose_supportive');
CREATE TYPE public.call_status AS ENUM ('completed', 'failed', 'missed', 'in_progress');
CREATE TYPE public.message_role AS ENUM ('user', 'assistant', 'system');
CREATE TYPE public.agent_action AS ENUM ('created', 'called', 'updated');

-- Create user_profiles table
CREATE TABLE public.user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  phone_number TEXT UNIQUE NOT NULL,
  voice_preferences JSONB DEFAULT '{}',
  language_goal TEXT DEFAULT 'Learn conversational skills',
  proficiency_level proficiency_level DEFAULT 'beginner',
  persona persona_type DEFAULT 'goose_chaotic',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create call_logs table
CREATE TABLE public.call_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  call_sid TEXT UNIQUE,
  phone_number TEXT NOT NULL,
  status call_status DEFAULT 'in_progress',
  duration INTEGER DEFAULT 0,
  recording_url TEXT,
  transcript TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create conversations table
CREATE TABLE public.conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  call_log_id UUID REFERENCES public.call_logs(id) ON DELETE CASCADE,
  role message_role NOT NULL,
  message TEXT NOT NULL,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create session_context table
CREATE TABLE public.session_context (
  user_id UUID PRIMARY KEY REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  context TEXT DEFAULT '',
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create agent_audit_logs table
CREATE TABLE public.agent_audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  agent_id TEXT,
  action agent_action NOT NULL,
  details JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.call_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.session_context ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agent_audit_logs ENABLE ROW LEVEL SECURITY;

-- RLS Policies for user_profiles
CREATE POLICY "Users can view own profile" ON public.user_profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.user_profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON public.user_profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- RLS Policies for call_logs
CREATE POLICY "Users can view own call logs" ON public.call_logs
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own call logs" ON public.call_logs
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own call logs" ON public.call_logs
  FOR UPDATE USING (auth.uid() = user_id);

-- RLS Policies for conversations
CREATE POLICY "Users can view own conversations" ON public.conversations
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own conversations" ON public.conversations
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own conversations" ON public.conversations
  FOR UPDATE USING (auth.uid() = user_id);

-- RLS Policies for session_context
CREATE POLICY "Users can view own session context" ON public.session_context
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own session context" ON public.session_context
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own session context" ON public.session_context
  FOR UPDATE USING (auth.uid() = user_id);

-- RLS Policies for agent_audit_logs
CREATE POLICY "Users can view own audit logs" ON public.agent_audit_logs
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own audit logs" ON public.agent_audit_logs
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create trigger function for updating updated_at timestamps
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at columns
CREATE TRIGGER set_updated_at_user_profiles
  BEFORE UPDATE ON public.user_profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at_conversations
  BEFORE UPDATE ON public.conversations
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at_session_context
  BEFORE UPDATE ON public.session_context
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Create function to handle new user profile creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_profiles (id, full_name, phone_number)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'New User'),
    COALESCE(NEW.raw_user_meta_data->>'phone_number', '+1234567890')
  );
  
  -- Initialize session context
  INSERT INTO public.session_context (user_id, context)
  VALUES (NEW.id, '');
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create indexes for better performance
CREATE INDEX idx_call_logs_user_id ON public.call_logs(user_id);
CREATE INDEX idx_call_logs_created_at ON public.call_logs(created_at DESC);
CREATE INDEX idx_conversations_user_id ON public.conversations(user_id);
CREATE INDEX idx_conversations_call_log_id ON public.conversations(call_log_id);
CREATE INDEX idx_conversations_created_at ON public.conversations(created_at DESC);
CREATE INDEX idx_agent_audit_logs_user_id ON public.agent_audit_logs(user_id);
