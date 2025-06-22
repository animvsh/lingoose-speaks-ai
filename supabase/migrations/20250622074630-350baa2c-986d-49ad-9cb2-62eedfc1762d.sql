
-- Create learning_outlines table to define different learning paths
CREATE TABLE public.learning_outlines (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  language TEXT NOT NULL,
  difficulty_level TEXT CHECK (difficulty_level IN ('beginner', 'intermediate', 'advanced')) DEFAULT 'beginner',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create learning_units table for major sections within an outline
CREATE TABLE public.learning_units (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  outline_id UUID NOT NULL REFERENCES public.learning_outlines(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  unit_order INTEGER NOT NULL,
  unlock_threshold INTEGER DEFAULT 80, -- Percentage needed to unlock this unit
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(outline_id, unit_order)
);

-- Create skills table for major skills within units
CREATE TABLE public.skills (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  unit_id UUID NOT NULL REFERENCES public.learning_units(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  skill_order INTEGER NOT NULL,
  unlock_threshold INTEGER DEFAULT 70, -- Percentage needed to unlock this skill
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(unit_id, skill_order)
);

-- Create mini_skills table for granular components within skills
CREATE TABLE public.mini_skills (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  skill_id UUID NOT NULL REFERENCES public.skills(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  mini_skill_order INTEGER NOT NULL,
  max_score INTEGER DEFAULT 100,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(skill_id, mini_skill_order)
);

-- Create user_mini_skill_scores table to track individual mini-skill performance
CREATE TABLE public.user_mini_skill_scores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  mini_skill_id UUID NOT NULL REFERENCES public.mini_skills(id) ON DELETE CASCADE,
  score INTEGER NOT NULL DEFAULT 0,
  attempts INTEGER DEFAULT 1,
  last_practiced TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id, mini_skill_id)
);

-- Create conversations table to log practice sessions
CREATE TABLE public.conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  outline_id UUID NOT NULL REFERENCES public.learning_outlines(id) ON DELETE CASCADE,
  unit_id UUID REFERENCES public.learning_units(id) ON DELETE SET NULL,
  skill_id UUID REFERENCES public.skills(id) ON DELETE SET NULL,
  conversation_data JSONB, -- Store conversation details, feedback, etc.
  duration_seconds INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create user_outline_progress table to track overall progress
CREATE TABLE public.user_outline_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  outline_id UUID NOT NULL REFERENCES public.learning_outlines(id) ON DELETE CASCADE,
  current_unit_id UUID REFERENCES public.learning_units(id) ON DELETE SET NULL,
  current_skill_id UUID REFERENCES public.skills(id) ON DELETE SET NULL,
  overall_progress_percentage INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id, outline_id)
);

-- Enable Row Level Security on all tables
ALTER TABLE public.learning_outlines ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.learning_units ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mini_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_mini_skill_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_outline_progress ENABLE ROW LEVEL SECURITY;

-- RLS Policies for learning_outlines (public read access)
CREATE POLICY "Anyone can view learning outlines" ON public.learning_outlines
  FOR SELECT USING (true);

-- RLS Policies for learning_units (public read access)
CREATE POLICY "Anyone can view learning units" ON public.learning_units
  FOR SELECT USING (true);

-- RLS Policies for skills (public read access)
CREATE POLICY "Anyone can view skills" ON public.skills
  FOR SELECT USING (true);

-- RLS Policies for mini_skills (public read access)
CREATE POLICY "Anyone can view mini skills" ON public.mini_skills
  FOR SELECT USING (true);

-- RLS Policies for user_mini_skill_scores (user-specific)
CREATE POLICY "Users can view their own mini skill scores" ON public.user_mini_skill_scores
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own mini skill scores" ON public.user_mini_skill_scores
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own mini skill scores" ON public.user_mini_skill_scores
  FOR UPDATE USING (auth.uid() = user_id);

-- RLS Policies for conversations (user-specific)
CREATE POLICY "Users can view their own conversations" ON public.conversations
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own conversations" ON public.conversations
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- RLS Policies for user_outline_progress (user-specific)
CREATE POLICY "Users can view their own outline progress" ON public.user_outline_progress
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own outline progress" ON public.user_outline_progress
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own outline progress" ON public.user_outline_progress
  FOR UPDATE USING (auth.uid() = user_id);

-- Create function to calculate skill progress based on mini-skill scores
CREATE OR REPLACE FUNCTION public.calculate_skill_progress(p_user_id UUID, p_skill_id UUID)
RETURNS INTEGER AS $$
DECLARE
  avg_score INTEGER;
BEGIN
  SELECT COALESCE(AVG(score), 0)::INTEGER
  INTO avg_score
  FROM public.user_mini_skill_scores umss
  JOIN public.mini_skills ms ON umss.mini_skill_id = ms.id
  WHERE umss.user_id = p_user_id AND ms.skill_id = p_skill_id;
  
  RETURN avg_score;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to calculate unit progress based on skill scores
CREATE OR REPLACE FUNCTION public.calculate_unit_progress(p_user_id UUID, p_unit_id UUID)
RETURNS INTEGER AS $$
DECLARE
  avg_progress INTEGER;
BEGIN
  SELECT COALESCE(AVG(public.calculate_skill_progress(p_user_id, s.id)), 0)::INTEGER
  INTO avg_progress
  FROM public.skills s
  WHERE s.unit_id = p_unit_id;
  
  RETURN avg_progress;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to check if a unit is unlocked for a user
CREATE OR REPLACE FUNCTION public.is_unit_unlocked(p_user_id UUID, p_unit_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
  prev_unit_id UUID;
  prev_unit_progress INTEGER;
  unlock_threshold INTEGER;
BEGIN
  -- Get the previous unit in order
  SELECT lu.id, lu.unlock_threshold
  INTO prev_unit_id, unlock_threshold
  FROM public.learning_units lu
  JOIN public.learning_units current_unit ON current_unit.outline_id = lu.outline_id
  WHERE current_unit.id = p_unit_id 
    AND lu.unit_order = (current_unit.unit_order - 1);
  
  -- If no previous unit, this unit is unlocked (first unit)
  IF prev_unit_id IS NULL THEN
    RETURN TRUE;
  END IF;
  
  -- Calculate previous unit progress
  SELECT public.calculate_unit_progress(p_user_id, prev_unit_id)
  INTO prev_unit_progress;
  
  -- Check if threshold is met
  RETURN prev_unit_progress >= unlock_threshold;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to check if a skill is unlocked for a user
CREATE OR REPLACE FUNCTION public.is_skill_unlocked(p_user_id UUID, p_skill_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
  prev_skill_id UUID;
  prev_skill_progress INTEGER;
  unlock_threshold INTEGER;
  unit_id UUID;
BEGIN
  -- Get the unit and previous skill
  SELECT s.unit_id INTO unit_id FROM public.skills s WHERE s.id = p_skill_id;
  
  -- Check if the unit is unlocked first
  IF NOT public.is_unit_unlocked(p_user_id, unit_id) THEN
    RETURN FALSE;
  END IF;
  
  -- Get the previous skill in order within the same unit
  SELECT s.id, s.unlock_threshold
  INTO prev_skill_id, unlock_threshold
  FROM public.skills s
  JOIN public.skills current_skill ON current_skill.unit_id = s.unit_id
  WHERE current_skill.id = p_skill_id 
    AND s.skill_order = (current_skill.skill_order - 1);
  
  -- If no previous skill, this skill is unlocked (first skill in unit)
  IF prev_skill_id IS NULL THEN
    RETURN TRUE;
  END IF;
  
  -- Calculate previous skill progress
  SELECT public.calculate_skill_progress(p_user_id, prev_skill_id)
  INTO prev_skill_progress;
  
  -- Check if threshold is met
  RETURN prev_skill_progress >= unlock_threshold;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger function to update timestamps
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at timestamps
CREATE TRIGGER set_updated_at_learning_outlines
  BEFORE UPDATE ON public.learning_outlines
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at_learning_units
  BEFORE UPDATE ON public.learning_units
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at_skills
  BEFORE UPDATE ON public.skills
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at_mini_skills
  BEFORE UPDATE ON public.mini_skills
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at_user_mini_skill_scores
  BEFORE UPDATE ON public.user_mini_skill_scores
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at_user_outline_progress
  BEFORE UPDATE ON public.user_outline_progress
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Insert sample learning outline and structure
INSERT INTO public.learning_outlines (name, description, language, difficulty_level) 
VALUES ('English Conversation Mastery', 'Comprehensive English conversation skills from basic to advanced', 'English', 'beginner');

-- Get the outline ID for sample data
WITH outline AS (
  SELECT id FROM public.learning_outlines WHERE name = 'English Conversation Mastery' LIMIT 1
),
-- Insert units
unit_inserts AS (
  INSERT INTO public.learning_units (outline_id, name, description, unit_order, unlock_threshold)
  SELECT 
    outline.id,
    unit_data.name,
    unit_data.description,
    unit_data.unit_order,
    unit_data.unlock_threshold
  FROM outline,
  (VALUES 
    ('Basic Conversations', 'Learn fundamental conversation skills', 1, 0),
    ('Travel & Transportation', 'Master travel-related conversations', 2, 75),
    ('Business English', 'Professional communication skills', 3, 80),
    ('Advanced Conversations', 'Complex discussions and debates', 4, 85)
  ) AS unit_data(name, description, unit_order, unlock_threshold)
  RETURNING id, name, unit_order
),
-- Insert skills for each unit
skill_inserts AS (
  INSERT INTO public.skills (unit_id, name, description, skill_order, unlock_threshold)
  SELECT 
    ui.id,
    skill_data.name,
    skill_data.description,
    skill_data.skill_order,
    skill_data.unlock_threshold
  FROM unit_inserts ui,
  (VALUES 
    ('Basic Conversations', 'Greetings & Introductions', 'Learn how to greet people and introduce yourself', 1, 0),
    ('Basic Conversations', 'Asking for Directions', 'Practice asking for and giving directions', 2, 70),
    ('Basic Conversations', 'Ordering Food', 'Learn restaurant and food ordering conversations', 3, 70),
    ('Basic Conversations', 'Small Talk', 'Master casual conversation skills', 4, 70),
    ('Travel & Transportation', 'Airport Conversations', 'Navigate airport interactions confidently', 1, 0),
    ('Travel & Transportation', 'Hotel Check-in', 'Handle hotel reservations and check-in', 2, 70),
    ('Travel & Transportation', 'Public Transportation', 'Use buses, trains, and subways effectively', 3, 70),
    ('Travel & Transportation', 'Taxi & Rideshare', 'Communicate with taxi and rideshare drivers', 4, 70),
    ('Business English', 'Meeting Etiquette', 'Professional meeting communication', 1, 0),
    ('Business English', 'Email Communication', 'Write and respond to business emails', 2, 75),
    ('Business English', 'Presentations', 'Deliver clear and effective presentations', 3, 75),
    ('Business English', 'Negotiations', 'Navigate business negotiations', 4, 75),
    ('Advanced Conversations', 'Debates & Discussions', 'Engage in complex arguments and debates', 1, 0),
    ('Advanced Conversations', 'Cultural Topics', 'Discuss cultural differences and similarities', 2, 80),
    ('Advanced Conversations', 'News & Current Events', 'Analyze and discuss current events', 3, 80),
    ('Advanced Conversations', 'Academic Discussions', 'Participate in scholarly conversations', 4, 80)
  ) AS skill_data(unit_name, name, description, skill_order, unlock_threshold)
  WHERE ui.name = skill_data.unit_name
  RETURNING id, name
)
-- Insert mini-skills for each skill
INSERT INTO public.mini_skills (skill_id, name, description, mini_skill_order, max_score)
SELECT 
  si.id,
  mini_skill_data.name,
  mini_skill_data.description,
  mini_skill_data.mini_skill_order,
  100 as max_score
FROM skill_inserts si,
(VALUES 
  ('Greetings & Introductions', 'Basic Greetings', 'Hello, Hi, Good morning/afternoon/evening', 1),
  ('Greetings & Introductions', 'Personal Information', 'Name, age, occupation, nationality', 2),
  ('Greetings & Introductions', 'Formal Introductions', 'Business and formal social introductions', 3),
  ('Asking for Directions', 'Location Vocabulary', 'Streets, buildings, landmarks', 1),
  ('Asking for Directions', 'Direction Phrases', 'Turn left/right, go straight, etc.', 2),
  ('Asking for Directions', 'Distance & Time', 'How far, how long, nearby', 3),
  ('Ordering Food', 'Menu Vocabulary', 'Food items, drinks, appetizers, mains', 1),
  ('Ordering Food', 'Polite Requests', 'Could I have, I would like, please/thank you', 2),
  ('Ordering Food', 'Dietary Restrictions', 'Allergies, vegetarian, preferences', 3)
) AS mini_skill_data(skill_name, name, description, mini_skill_order)
WHERE si.name = mini_skill_data.skill_name;
