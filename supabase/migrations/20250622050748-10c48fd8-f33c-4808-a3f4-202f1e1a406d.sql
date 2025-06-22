
-- Create enum for node status
CREATE TYPE public.node_status AS ENUM ('locked', 'available', 'in_progress', 'completed', 'mastered');

-- Create enum for node difficulty
CREATE TYPE public.node_difficulty AS ENUM ('beginner', 'intermediate', 'advanced');

-- Create enum for node type
CREATE TYPE public.node_type AS ENUM ('core_grammar', 'survival_language', 'social_conversation', 'formal_business', 'fun_personality');

-- Create courses table
CREATE TABLE public.courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  language TEXT NOT NULL DEFAULT 'French',
  total_nodes INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create course nodes table (skills/concepts)
CREATE TABLE public.course_nodes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  node_type node_type NOT NULL,
  difficulty node_difficulty DEFAULT 'beginner',
  position_x FLOAT NOT NULL DEFAULT 0,
  position_y FLOAT NOT NULL DEFAULT 0,
  prerequisites TEXT[] DEFAULT '{}', -- Array of prerequisite node IDs
  estimated_duration INTEGER DEFAULT 30, -- in minutes
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create user course progress table
CREATE TABLE public.user_course_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  overall_progress FLOAT DEFAULT 0.0, -- 0.0 to 100.0
  completed_nodes INTEGER DEFAULT 0,
  started_at TIMESTAMPTZ DEFAULT now(),
  last_activity TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, course_id)
);

-- Create user node progress table
CREATE TABLE public.user_node_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  node_id UUID NOT NULL REFERENCES public.course_nodes(id) ON DELETE CASCADE,
  status node_status DEFAULT 'locked',
  fluency_percentage FLOAT DEFAULT 0.0, -- 0.0 to 100.0
  practice_sessions INTEGER DEFAULT 0,
  last_practiced TIMESTAMPTZ,
  mastered_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, node_id)
);

-- Create daily recommendations table
CREATE TABLE public.daily_recommendations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  node_id UUID NOT NULL REFERENCES public.course_nodes(id) ON DELETE CASCADE,
  recommended_date DATE NOT NULL DEFAULT CURRENT_DATE,
  completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, recommended_date)
);

-- Enable Row Level Security
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.course_nodes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_course_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_node_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_recommendations ENABLE ROW LEVEL SECURITY;

-- RLS Policies for courses (public read)
CREATE POLICY "Anyone can view courses" ON public.courses
  FOR SELECT USING (true);

-- RLS Policies for course_nodes (public read)
CREATE POLICY "Anyone can view course nodes" ON public.course_nodes
  FOR SELECT USING (true);

-- RLS Policies for user_course_progress
CREATE POLICY "Users can view own course progress" ON public.user_course_progress
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own course progress" ON public.user_course_progress
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own course progress" ON public.user_course_progress
  FOR UPDATE USING (auth.uid() = user_id);

-- RLS Policies for user_node_progress
CREATE POLICY "Users can view own node progress" ON public.user_node_progress
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own node progress" ON public.user_node_progress
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own node progress" ON public.user_node_progress
  FOR UPDATE USING (auth.uid() = user_id);

-- RLS Policies for daily_recommendations
CREATE POLICY "Users can view own recommendations" ON public.daily_recommendations
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own recommendations" ON public.daily_recommendations
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own recommendations" ON public.daily_recommendations
  FOR UPDATE USING (auth.uid() = user_id);

-- Create triggers for updated_at timestamps
CREATE TRIGGER set_updated_at_courses
  BEFORE UPDATE ON public.courses
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at_course_nodes
  BEFORE UPDATE ON public.course_nodes
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at_user_node_progress
  BEFORE UPDATE ON public.user_node_progress
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Insert sample French course data
INSERT INTO public.courses (name, description, language, total_nodes) VALUES 
('French Fluency Journey', 'Complete French language learning path from beginner to advanced', 'French', 35);

-- Insert sample course nodes with positioning for visual tree layout
INSERT INTO public.course_nodes (course_id, name, description, node_type, difficulty, position_x, position_y, prerequisites) VALUES
-- Get the course ID first, then insert nodes
((SELECT id FROM public.courses WHERE name = 'French Fluency Journey'), 'Start Here', 'Basic French introduction', 'core_grammar', 'beginner', 0, 0, '{}'),
((SELECT id FROM public.courses WHERE name = 'French Fluency Journey'), 'Basic Greetings', 'Hello, goodbye, please, thank you', 'survival_language', 'beginner', -200, 100, '{}'),
((SELECT id FROM public.courses WHERE name = 'French Fluency Journey'), 'Numbers & Time', 'Counting and telling time', 'survival_language', 'beginner', -200, 200, '{}'),
((SELECT id FROM public.courses WHERE name = 'French Fluency Journey'), 'Ordering Food', 'Restaurant vocabulary and phrases', 'survival_language', 'beginner', -200, 300, '{}'),
((SELECT id FROM public.courses WHERE name = 'French Fluency Journey'), 'Making Friends', 'Casual conversation starters', 'social_conversation', 'beginner', 200, 100, '{}'),
((SELECT id FROM public.courses WHERE name = 'French Fluency Journey'), 'Family & Relationships', 'Talking about personal life', 'social_conversation', 'intermediate', 200, 200, '{}'),
((SELECT id FROM public.courses WHERE name = 'French Fluency Journey'), 'Business Meetings', 'Professional communication', 'formal_business', 'advanced', 0, -200, '{}'),
((SELECT id FROM public.courses WHERE name = 'French Fluency Journey'), 'French Slang', 'Informal expressions and humor', 'fun_personality', 'intermediate', 0, 400, '{}');

-- Create indexes for better performance
CREATE INDEX idx_course_nodes_course_id ON public.course_nodes(course_id);
CREATE INDEX idx_user_course_progress_user_id ON public.user_course_progress(user_id);
CREATE INDEX idx_user_node_progress_user_id ON public.user_node_progress(user_id);
CREATE INDEX idx_user_node_progress_node_id ON public.user_node_progress(node_id);
CREATE INDEX idx_daily_recommendations_user_date ON public.daily_recommendations(user_id, recommended_date);
