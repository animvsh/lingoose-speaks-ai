
-- Create activities table to store prompts for each skill
CREATE TABLE public.activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  skill_id UUID NOT NULL REFERENCES public.skills(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  prompt TEXT NOT NULL, -- The actual prompt for the voice agent
  difficulty_level TEXT CHECK (difficulty_level IN ('easy', 'medium', 'hard')) DEFAULT 'medium',
  estimated_duration_minutes INTEGER DEFAULT 10,
  activity_order INTEGER NOT NULL DEFAULT 1,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(skill_id, activity_order)
);

-- Create user_activity_ratings table to track how well users performed in each activity
CREATE TABLE public.user_activity_ratings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  activity_id UUID NOT NULL REFERENCES public.activities(id) ON DELETE CASCADE,
  skill_id UUID NOT NULL REFERENCES public.skills(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5), -- 1-5 star rating
  feedback_notes TEXT, -- Optional notes about performance
  completed_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  duration_seconds INTEGER, -- How long the activity took
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id, activity_id) -- One rating per user per activity
);

-- Enable Row Level Security on both tables
ALTER TABLE public.activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_activity_ratings ENABLE ROW LEVEL SECURITY;

-- RLS Policies for activities (public read access since activities are shared content)
CREATE POLICY "Anyone can view activities" ON public.activities
  FOR SELECT USING (true);

-- RLS Policies for user_activity_ratings (user-specific)
CREATE POLICY "Users can view their own activity ratings" ON public.user_activity_ratings
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own activity ratings" ON public.user_activity_ratings
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own activity ratings" ON public.user_activity_ratings
  FOR UPDATE USING (auth.uid() = user_id);

-- Create updated_at triggers
CREATE TRIGGER set_updated_at_activities
  BEFORE UPDATE ON public.activities
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at_user_activity_ratings
  BEFORE UPDATE ON public.user_activity_ratings
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Insert sample activities for existing skills
-- First, let's get the first learning outline and its units
INSERT INTO public.activities (skill_id, name, description, prompt, difficulty_level, estimated_duration_minutes, activity_order)
SELECT 
  s.id as skill_id,
  activity_data.name,
  activity_data.description,
  activity_data.prompt,
  activity_data.difficulty_level,
  activity_data.estimated_duration_minutes,
  activity_data.activity_order
FROM public.skills s
JOIN public.learning_units lu ON s.unit_id = lu.id
JOIN public.learning_outlines lo ON lu.outline_id = lo.id
CROSS JOIN (
  VALUES 
    ('Greetings & Introductions', 'Meet a New Colleague', 'Practice introducing yourself in a professional setting', 'You are at a networking event and you meet someone new in your field. Start a conversation by introducing yourself, sharing what you do, and asking about their work. Be professional but friendly.', 'easy', 5, 1),
    ('Greetings & Introductions', 'First Day at Work', 'Practice formal introductions in a workplace environment', 'It''s your first day at a new job. You need to introduce yourself to your team members and manager. Practice making a good first impression while being professional and confident.', 'medium', 7, 2),
    ('Asking for Directions', 'Lost Tourist', 'Practice asking for directions as a tourist in a new city', 'You are a tourist visiting a new city and you''re lost. You need to ask locals for directions to popular landmarks like the museum, central park, or main shopping area. Be polite and make sure you understand the directions.', 'easy', 6, 1),
    ('Asking for Directions', 'Navigate Public Transport', 'Practice asking about public transportation options', 'You need to get across town using public transportation but you''re unfamiliar with the system. Ask for help about which bus or train to take, where to buy tickets, and how long the journey will take.', 'medium', 8, 2),
    ('Ordering Food', 'Restaurant Dinner', 'Practice ordering a meal at a restaurant', 'You are at a nice restaurant for dinner. Look at the menu, ask the waiter about recommendations, place your order including drinks and dessert, and handle any dietary restrictions or special requests.', 'easy', 10, 1),
    ('Ordering Food', 'Coffee Shop Order', 'Practice ordering at a busy coffee shop', 'You''re at a popular coffee shop during the morning rush. Order your coffee with specific customizations, maybe add a pastry, and handle payment. Practice being clear and efficient while being polite.', 'easy', 4, 2)
) AS activity_data(skill_name, name, description, prompt, difficulty_level, estimated_duration_minutes, activity_order)
WHERE s.name = activity_data.skill_name
LIMIT 10; -- Limit to prevent too many inserts if there are duplicate skill names
