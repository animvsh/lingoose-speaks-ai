import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_ANON_KEY') ?? ''
);

interface PromptConstructionRequest {
  phoneNumber: string;
  language?: string;
  topic?: string;
  lastSummary?: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { phoneNumber, language = 'Hindi', topic = 'Daily Conversation', lastSummary = '' }: PromptConstructionRequest = await req.json();

    console.log(`Constructing system prompt for ${phoneNumber}`);

    // Get user's system prompt template
    const { data: template, error: templateError } = await supabase
      .from('system_prompt_templates')
      .select('*')
      .eq('phone_number', phoneNumber)
      .eq('is_active', true)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (templateError) {
      console.error('Error fetching template:', templateError);
      throw new Error(`Failed to fetch template: ${templateError.message}`);
    }

    // Get current evolved prompt if available
    const { data: evolvedPrompt, error: evolvedError } = await supabase
      .from('system_prompt_evolution')
      .select('*')
      .eq('phone_number', phoneNumber)
      .eq('is_active', true)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (evolvedError && evolvedError.code !== 'PGRST116') {
      console.error('Error fetching evolved prompt:', evolvedError);
    }

    // Use evolved prompt if available, otherwise use template
    let basePrompt = template?.template_content || getDefaultTemplate();
    
    if (evolvedPrompt?.current_prompt) {
      console.log('Using evolved prompt from AI analysis');
      basePrompt = evolvedPrompt.current_prompt;
    } else {
      console.log('Using base template');
    }

    // Replace placeholders in the prompt
    const constructedPrompt = basePrompt
      .replace(/\{\{language\}\}/g, language)
      .replace(/\{\{topic\}\}/g, topic)
      .replace(/\{\{last_summary\}\}/g, lastSummary || 'This is your first conversation with this learner.');

    // Create first message (headerz placeholder)
    const firstMessage = `Hello! I'm your AI language coach. Today we'll practice ${language} conversation focusing on "${topic}". ${lastSummary ? `Last time we talked about: ${lastSummary}` : 'Let\'s get started!'} Ready to begin?`;

    console.log('System prompt constructed successfully');

    return new Response(JSON.stringify({
      systemPrompt: constructedPrompt, // This is {{prompz}}
      firstMessage: firstMessage,      // This is {{headerz}}
      metadata: {
        templateUsed: template?.id || 'default',
        evolvedPromptUsed: evolvedPrompt?.id || null,
        language,
        topic,
        hasLastSummary: !!lastSummary
      }
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in construct-system-prompt function:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      systemPrompt: getDefaultTemplate(),
      firstMessage: 'Hello! I\'m your AI language coach. Let\'s start practicing!'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

function getDefaultTemplate(): string {
  return `[🧠 Identity]  
You are a friendly and supportive **AI language coach** helping a learner practice **{{language}}** through voice-based conversations.

[🎯 Objectives]  
Your main goals in every call are:
1. Encourage the learner using simple, motivating language.
2. Guide them through real conversational practice on **'{{topic}}'**.
3. Gently correct or rephrase when they make mistakes — always kindly.

[🗣️ Tone & Style]  
- Keep the tone **warm, patient, and encouraging**.  
- Use **simple vocabulary and short sentences**, as if talking to a beginner.  
- Smile with your words :)  

[📋 Response Guidelines]
In every session, follow this structure:

**1. Introduction in English:**  
- Greet the user and introduce yourself.
- Mention today's topic: **'{{topic}}'**.
- Remind them of any prior context or progress ({{last_summary}} if available).

**2. Switch to {{language}}:**  
- After the intro, speak entirely in **{{language}}**, using beginner-level words and sentences.  
- Slow your pace. Repeat ideas if needed.

**3. Keep it interactive:**  
- Ask 1–2 open-ended questions.
- Listen patiently. Respond with encouragement.  
- Add quick corrections **in {{language}}**, either by rephrasing or modeling better sentences.

**4. Stick to the topic:**  
- Stay focused on **'{{topic}}'** unless the user changes it.
- Don't introduce unrelated ideas or new vocabulary.

[🛟 Error Handling & Confusion]  
If the user seems confused, lost, or gives a short reply:
- Pause briefly, then ask a simpler question.
- Reassure them: "That's okay! Let's try again together."

[🧾 Call Closure]  
- Wrap up in **{{language}}** with a brief compliment or recap.  
- End the call by logging a short summary (max 1 sentence) of what was practiced.`;
}