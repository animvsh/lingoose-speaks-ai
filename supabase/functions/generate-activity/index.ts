
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

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
    
    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    const { currentActivity } = await req.json();

    const prompt = `Generate a new conversational practice activity for Hindi language learners. 
    
Current activity: "${currentActivity || 'Hotel check-in conversation'}"
    
Please generate a DIFFERENT type of activity from this list: ${activityTypes.join(', ')}
    
Make sure it's different from the current activity. Respond with a JSON object containing:
    {
      "name": "Activity name (e.g., 'Restaurant ordering conversation')",
      "description": "Brief description with emoji (e.g., 'Practice ordering food and drinks 🍽️')",
      "duration": "Estimated duration in minutes (10-20)",
      "skills": [
        {"name": "Skill name", "level": "Beginner/Intermediate/Advanced"},
        {"name": "Another skill", "level": "Beginner/Intermediate/Advanced"}
      ]
    }
    
    Choose 3-4 relevant skills that would be practiced in this activity.`;

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
            content: 'You are a Hindi language learning expert. Generate practical conversation activities for learners. Always respond with valid JSON only.' 
          },
          { role: 'user', content: prompt }
        ],
        temperature: 0.8,
        max_tokens: 500
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
      activityData = JSON.parse(generatedContent);
    } catch (parseError) {
      console.error('Failed to parse OpenAI response:', generatedContent);
      throw new Error('Invalid response format from OpenAI');
    }

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
