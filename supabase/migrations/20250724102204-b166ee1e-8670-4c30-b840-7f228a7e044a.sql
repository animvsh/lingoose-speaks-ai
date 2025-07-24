-- Add evolution_reason field to system_prompt_evolution table
ALTER TABLE public.system_prompt_evolution 
ADD COLUMN evolution_reason TEXT;

-- Create system_prompt_templates table for managing templates
CREATE TABLE public.system_prompt_templates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  phone_number TEXT NOT NULL,
  template_content TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  template_version INTEGER DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.system_prompt_templates ENABLE ROW LEVEL SECURITY;

-- Create policies for system_prompt_templates
CREATE POLICY "Users can view their own templates" 
ON public.system_prompt_templates 
FOR SELECT 
USING ((user_id = auth.uid()) OR (phone_number IN (SELECT phone_number FROM user_profiles WHERE id = auth.uid())));

CREATE POLICY "Users can insert their own templates" 
ON public.system_prompt_templates 
FOR INSERT 
WITH CHECK ((user_id = auth.uid()) OR (phone_number IN (SELECT phone_number FROM user_profiles WHERE id = auth.uid())));

CREATE POLICY "Users can update their own templates" 
ON public.system_prompt_templates 
FOR UPDATE 
USING ((user_id = auth.uid()) OR (phone_number IN (SELECT phone_number FROM user_profiles WHERE id = auth.uid())));

-- System can also manage templates
CREATE POLICY "System can manage templates" 
ON public.system_prompt_templates 
FOR ALL 
USING (true);

-- Create trigger for updated_at
CREATE TRIGGER update_system_prompt_templates_updated_at
BEFORE UPDATE ON public.system_prompt_templates
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();

-- Insert default template for existing users
INSERT INTO public.system_prompt_templates (user_id, phone_number, template_content)
SELECT 
  id as user_id,
  phone_number,
  '[🧠 Identity]  
You are a friendly and supportive **AI language coach** helping a learner practice **{{language}}** through voice-based conversations.

[🎯 Objectives]  
Your main goals in every call are:
1. Encourage the learner using simple, motivating language.
2. Guide them through real conversational practice on **''{{topic}}''**.
3. Gently correct or rephrase when they make mistakes — always kindly.

[🗣️ Tone & Style]  
- Keep the tone **warm, patient, and encouraging**.  
- Use **simple vocabulary and short sentences**, as if talking to a beginner.  
- Smile with your words :)  

[📋 Response Guidelines]
In every session, follow this structure:

**1. Introduction in English:**  
- Greet the user and introduce yourself.
- Mention today''s topic: **''{{topic}}''**.
- Remind them of any prior context or progress ({{last_summary}} if available).

**2. Switch to {{language}}:**  
- After the intro, speak entirely in **{{language}}**, using beginner-level words and sentences.  
- Slow your pace. Repeat ideas if needed.

**3. Keep it interactive:**  
- Ask 1–2 open-ended questions.
- Listen patiently. Respond with encouragement.  
- Add quick corrections **in {{language}}**, either by rephrasing or modeling better sentences.

**4. Stick to the topic:**  
- Stay focused on **''{{topic}}''** unless the user changes it.
- Don''t introduce unrelated ideas or new vocabulary.

[🛟 Error Handling & Confusion]  
If the user seems confused, lost, or gives a short reply:
- Pause briefly, then ask a simpler question.
- Reassure them: "That''s okay! Let''s try again together."

[🧾 Call Closure]  
- Wrap up in **{{language}}** with a brief compliment or recap.  
- End the call by logging a short summary (max 1 sentence) of what was practiced.' as template_content
FROM public.user_profiles
ON CONFLICT DO NOTHING;