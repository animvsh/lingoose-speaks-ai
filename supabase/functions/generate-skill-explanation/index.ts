
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { skillId, skillName } = await req.json();
    
    if (!skillId || !skillName) {
      throw new Error('Missing skillId or skillName');
    }

    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openAIApiKey) {
      throw new Error('OpenAI API key not found');
    }

    // Create Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    console.log(`Generating explanation for skill: ${skillName}`);

    // Generate explanation using OpenAI
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: `You are an expert language learning instructor. Generate a comprehensive explanation for a language learning skill. 
            
            Respond with a JSON object containing:
            - explanation: A clear, detailed explanation of what the skill is (2-3 sentences)
            - use_cases: An array of 3-4 practical situations where this skill is used
            - examples: An array of 2-3 concrete examples with scenarios
            - difficulty_tips: A helpful tip for mastering this skill (1-2 sentences)
            
            Make it educational, practical, and encouraging for language learners.`
          },
          {
            role: 'user',
            content: `Generate a detailed explanation for the language learning skill: "${skillName}"`
          }
        ],
        temperature: 0.7,
        max_tokens: 1000,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.statusText}`);
    }

    const data = await response.json();
    const generatedContent = data.choices[0].message.content;
    
    console.log('Generated content:', generatedContent);

    // Parse the JSON response from GPT
    let parsedContent;
    try {
      parsedContent = JSON.parse(generatedContent);
    } catch (parseError) {
      console.error('Failed to parse GPT response as JSON:', parseError);
      throw new Error('Invalid response format from AI');
    }

    // Store the explanation in the database
    const { data: insertedExplanation, error: insertError } = await supabase
      .from('skill_explanations')
      .insert({
        skill_id: skillId,
        explanation: parsedContent.explanation,
        use_cases: parsedContent.use_cases,
        examples: parsedContent.examples,
        difficulty_tips: parsedContent.difficulty_tips,
      })
      .select()
      .single();

    if (insertError) {
      console.error('Database insert error:', insertError);
      throw insertError;
    }

    console.log('Successfully created skill explanation:', insertedExplanation.id);

    return new Response(
      JSON.stringify({ 
        success: true, 
        explanation: insertedExplanation 
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('Error in generate-skill-explanation function:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        success: false 
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
