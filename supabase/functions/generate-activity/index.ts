
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const activityTypes = [
  "Restaurant ordering conversation",
  "Job interview practice",
  "Doctor appointment discussion",
  "Shopping and bargaining",
  "Travel and directions",
  "Phone call with customer service",
  "Meeting new neighbors",
  "Bank transaction conversation",
  "School enrollment discussion",
  "Emergency situation reporting"
];

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    
    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error('Supabase configuration not found');
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    const { currentActivity, userId, activityId } = await req.json();

    const prompt = `Generate a new conversational practice activity for Hindi language learners. 
    
Current activity: "${currentActivity || 'Hotel check-in conversation'}"
    
Please generate a DIFFERENT type of activity from this list: ${activityTypes.join(', ')}
    
Make sure it's different from the current activity. Create a detailed conversation scenario prompt that an AI assistant can use to conduct the practice session. Respond with a JSON object containing:
    {
      "name": "Activity name (e.g., 'Restaurant ordering conversation')",
      "description": "Brief description with emoji (e.g., 'Practice ordering food and drinks 🍽️')",
      "duration": "Estimated duration in minutes (10-20)",
      "prompt": "Detailed conversation scenario prompt for the AI assistant to use during the practice session. This should include the setting, the user's role, objectives, and specific conversation goals.",
      "skills": [
        {"name": "Skill name", "rating": 45},
        {"name": "Another skill", "rating": 67}
      ]
    }
    
    Choose 3-4 relevant skills that would be practiced in this activity. For each skill, provide a rating between 30-90 that represents the current proficiency level out of 100.

    The prompt should be detailed enough for an AI to roleplay the scenario effectively.`;

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
            content: 'You are a Hindi language learning expert. Generate practical conversation activities for learners. Always respond with valid JSON only. For skills, use ratings from 30-90 instead of difficulty levels. Include detailed conversation prompts for AI roleplay.' 
          },
          { role: 'user', content: prompt }
        ],
        temperature: 0.8,
        max_tokens: 800
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenAI API error:', errorText);
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    const generatedContent = data.choices[0].message.content;
    
    console.log('Generated content:', generatedContent);
    
    // Parse the JSON response
    let activityData;
    try {
      // Clean up the response to handle markdown code blocks
      const cleanedContent = generatedContent.replace(/```json\n?|\n?```/g, '').trim();
      activityData = JSON.parse(cleanedContent);
    } catch (parseError) {
      console.error('Failed to parse OpenAI response:', generatedContent);
      throw new Error('Invalid response format from OpenAI');
    }

    // If we have a specific activity to update, update it in the database
    if (activityId && userId) {
      console.log('Updating activity in database:', activityId);
      
      // Update the activity in the database
      const { error: updateError } = await supabase
        .from('activities')
        .update({
          name: activityData.name,
          description: activityData.description,
          prompt: activityData.prompt,
          estimated_duration_minutes: parseInt(activityData.duration),
          updated_at: new Date().toISOString()
        })
        .eq('id', activityId);

      if (updateError) {
        console.error('Error updating activity:', updateError);
        throw new Error('Failed to update activity in database');
      }

      console.log('Activity updated successfully');

      // Return the updated activity data
      return new Response(JSON.stringify({
        ...activityData,
        id: activityId,
        updated: true
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Return the generated activity data
    return new Response(JSON.stringify(activityData), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in generate-activity function:', error);
    return new Response(JSON.stringify({ 
      error: error.message || 'Failed to generate activity'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
