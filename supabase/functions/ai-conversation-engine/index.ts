import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ConversationRequest {
  conversationId: string;
  incomingMessage: string;
  phoneNumber: string;
}

serve(async (req) => {
  console.log('🚀 AI Conversation Engine - Request received:', {
    method: req.method,
    url: req.url,
    headers: Object.fromEntries(req.headers.entries())
  });

  if (req.method === 'OPTIONS') {
    console.log('📋 Handling CORS preflight request');
    return new Response(null, { headers: corsHeaders });
  }

  console.log('🚀 AI Conversation Engine started');

  try {
    const { conversationId, incomingMessage, phoneNumber }: ConversationRequest = await req.json();
    
    console.log('📱 Processing conversation:', {
      conversationId,
      phoneNumber,
      message: incomingMessage.substring(0, 50) + '...'
    });

    // Initialize clients
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const openaiApiKey = Deno.env.get('OPENAI_API_KEY');
    
    console.log('🔑 Environment check:', {
      hasSupabaseUrl: !!supabaseUrl,
      hasSupabaseKey: !!supabaseServiceKey,
      hasOpenAIKey: !!openaiApiKey
    });

    if (!openaiApiKey) {
      console.error('❌ OPENAI_API_KEY is missing!');
      return new Response(JSON.stringify({
        success: false,
        error: 'OpenAI API key not configured',
        message: 'I need an OpenAI API key to provide intelligent responses. Please configure it in the edge function secrets.'
      }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    
    const { createClient } = await import('https://esm.sh/@supabase/supabase-js@2');
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get conversation history and existing scheduled calls
    const [conversationResult, messagesResult, scheduledCallsResult] = await Promise.all([
      supabase
        .from('sms_conversations')
        .select('*')
        .eq('id', conversationId)
        .single(),
      supabase
        .from('sms_messages')
        .select('*')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true })
        .limit(10),
      supabase
        .from('scheduled_calls')
        .select('*')
        .eq('phone_number', phoneNumber)
        .in('status', ['pending', 'calling'])
        .order('scheduled_time', { ascending: true })
    ]);

    if (conversationResult.error) {
      console.error('Error fetching conversation:', conversationResult.error);
      throw conversationResult.error;
    }

    if (messagesResult.error) {
      console.error('Error fetching messages:', messagesResult.error);
      throw messagesResult.error;
    }

    const conversation = conversationResult.data;
    const messages = messagesResult.data;
    const existingCalls = scheduledCallsResult.data || [];

    // Build conversation context for OpenAI
    const conversationHistory = messages!.map(msg => ({
      role: msg.direction === 'inbound' ? 'user' : 'assistant',
      content: msg.message_text
    }));

    // Enhanced system prompt with app context and better time parsing
    const systemPrompt = `You are BOL, the AI assistant for Lingoose - a revolutionary language learning app that helps users practice speaking through real phone conversations with AI.

🤖 ABOUT YOU (BOL):
- You're BOL, the friendly AI language learning companion
- Users might call you "bol", "Bol", or ask "Are you bol?" - always confirm your identity warmly
- You help schedule practice calls and answer questions about Lingoose

📱 ABOUT LINGOOSE:
- AI-powered language learning through phone conversations
- Users practice speaking with AI tutors in real conversations
- Personalized lessons based on user progress and interests
- Available 24/7 for practice sessions
- Tracks fluency progress and provides detailed feedback

CRITICAL: You MUST respond with valid JSON only. No additional text before or after the JSON.

🎯 PRIMARY FUNCTIONS:
1. SCHEDULE LANGUAGE PRACTICE CALLS
2. ANSWER QUESTIONS ABOUT LINGOOSE/BOL
3. KEEP CONVERSATIONS FOCUSED ON LANGUAGE LEARNING

SCHEDULING USE CASES YOU MUST UNDERSTAND AND HANDLE:

1. IMMEDIATE SCHEDULING:
   - "Call me now" / "Now" / "Right now" → Schedule 2 minutes from current time
   - "In 5 minutes" / "In 30 min" / "In 35 min" → Calculate exact future time
   - "Can we do it now?" → Immediate scheduling

2. SPECIFIC TIME REQUESTS:
   - "At 3pm" / "3:00" / "15:00" → Today at that time (or tomorrow if past)
   - "At 6:10pm" / "6:10 PM" → Parse exact time format
   - "Tomorrow at 2pm" / "Next Tuesday at 10am" → Specific future date/time
   - "In 2 hours" / "In 30 minutes" / "In 35 min" → Relative time calculation

3. RESCHEDULING EXISTING CALLS:
   - "Can we reschedule?" / "Move my call" / "Change the time"
   - "Not 3pm, make it 4pm" → Update existing scheduled call
   - "Can we do it later?" / "Earlier would be better"

4. APP/BOL QUESTIONS:
   - "Are you bol?" → "Yes, I'm BOL, your AI language learning assistant!"
   - "What is Lingoose?" → Explain the app
   - "How does this work?" → Explain practice sessions
   - Questions about features, progress, lessons, etc.

5. OFF-TOPIC REDIRECT:
   - Weather, jokes, general chat → Redirect to language learning/scheduling
   - "I'm BOL, your language learning assistant! Let's schedule your next practice call or discuss your language goals."

TIME PARSING INTELLIGENCE:
- Current time: ${new Date().toISOString()}
- Parse "35 min" as 35 minutes from now
- Parse "6:10pm" as 18:10 today (or tomorrow if past)
- Handle AM/PM, 24-hour, and informal time formats
- Calculate relative times accurately

EXISTING SCHEDULED CALLS:
${existingCalls.length > 0 ? existingCalls.map(call => 
  `- ${call.scheduled_time} (Status: ${call.status}, ID: ${call.id})`
).join('\n') : 'No existing calls scheduled'}

CURRENT CONVERSATION STATE: ${JSON.stringify(conversation.conversation_state)}

RESPONSE FORMAT:
{
  "message": "Your friendly response (under 160 chars when possible)",
  "action": "schedule_call" | "reschedule_call" | "cancel_call" | "update_conversation_state",
  "scheduled_time": "ISO timestamp for new/updated call time",
  "call_id": "ID of existing call to modify (for reschedule/cancel)",
  "conversation_state": "Updated conversation state object"
}

Be warm, helpful, and keep the focus on language learning success!`;

    // Call OpenAI with enhanced error handling
    console.log('🤖 Making OpenAI API call...');
    console.log('📝 System prompt preview:', systemPrompt.substring(0, 200) + '...');
    console.log('💬 User message:', incomingMessage);

    const openaiPayload = {
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        ...conversationHistory,
        { role: 'user', content: incomingMessage }
      ],
      temperature: 0.3,
      max_tokens: 300,
      response_format: { type: "json_object" }
    };

    console.log('📤 OpenAI payload preview:', {
      model: openaiPayload.model,
      messageCount: openaiPayload.messages.length,
      temperature: openaiPayload.temperature
    });

    const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(openaiPayload),
    });

    console.log('📥 OpenAI response status:', openaiResponse.status);
    
    if (!openaiResponse.ok) {
      const errorText = await openaiResponse.text();
      console.error('❌ OpenAI API error:', errorText);
      
      // Return a simple, direct response instead of the hardcoded one
      return new Response(JSON.stringify({
        success: true,
        action: "update_conversation_state",
        message: "When would you like to schedule your language practice call?",
        scheduled_time: null
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const openaiResult = await openaiResponse.json();
    console.log('OpenAI result structure:', Object.keys(openaiResult));
    
    if (!openaiResult.choices || !openaiResult.choices[0] || !openaiResult.choices[0].message) {
      console.error('Invalid OpenAI response structure:', openaiResult);
      throw new Error('Invalid OpenAI response structure');
    }
    
    const aiResponseText = openaiResult.choices[0].message.content;
    console.log('Raw AI response:', aiResponseText);

    // Parse AI response with better error handling
    let aiResponse;
    try {
      if (!aiResponseText || aiResponseText.trim() === '') {
        throw new Error('Empty AI response');
      }
      aiResponse = JSON.parse(aiResponseText);
      
      // Validate required fields
      if (!aiResponse.message || !aiResponse.action) {
        throw new Error('Missing required fields in AI response');
      }
      
    } catch (parseError) {
      console.error('Failed to parse AI response:', parseError);
      console.error('Raw response that failed to parse:', aiResponseText);
      
      // Try to extract just a message if JSON parsing fails
      let fallbackMessage = "When would you like to schedule your language practice call?";
      if (aiResponseText && typeof aiResponseText === 'string') {
        // Try to extract a reasonable message from the response
        const messageMatch = aiResponseText.match(/"message":\s*"([^"]+)"/);
        if (messageMatch) {
          fallbackMessage = messageMatch[1];
        }
      }
      
      // Enhanced fallback response
      aiResponse = {
        message: fallbackMessage,
        action: "update_conversation_state",
        conversation_state: { stage: "initial", error: "parsing_failed" }
      };
    }

    console.log('Parsed AI response:', aiResponse);

    // Execute the determined action
    switch (aiResponse.action) {
      case 'schedule_call':
        await scheduleNewCall(supabase, phoneNumber, conversationId, aiResponse.scheduled_time);
        break;
        
      case 'reschedule_call':
        await rescheduleExistingCall(supabase, aiResponse.call_id, aiResponse.scheduled_time);
        break;
        
      case 'cancel_call':
        await cancelCall(supabase, aiResponse.call_id);
        break;
        
      case 'skip_recurring':
        // Handle recurring schedule skips - could implement recurring calls table in future
        console.log('Skip recurring functionality - to be implemented');
        break;
    }

    // Update conversation state
    if (aiResponse.conversation_state) {
      const { error: updateError } = await supabase
        .from('sms_conversations')
        .update({
          conversation_state: aiResponse.conversation_state,
          last_message_at: new Date().toISOString(),
          ...(aiResponse.scheduled_time ? { 
            scheduled_call_time: aiResponse.scheduled_time,
            call_confirmed: true 
          } : {})
        })
        .eq('id', conversationId);

      if (updateError) {
        console.error('Error updating conversation:', updateError);
      }
    }

    // Send SMS response
    const smsResponse = await fetch(`${supabaseUrl}/functions/v1/send-sms`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${supabaseServiceKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        phoneNumber: phoneNumber,
        message: aiResponse.message,
        messageType: 'notification'
      }),
    });

    if (!smsResponse.ok) {
      console.error('Failed to send SMS:', await smsResponse.text());
    }

    // Store outbound message
    const { error: storeError } = await supabase
      .from('sms_messages')
      .insert({
        conversation_id: conversationId,
        phone_number: phoneNumber,
        message_text: aiResponse.message,
        direction: 'outbound',
      });

    if (storeError) {
      console.error('Error storing outbound message:', storeError);
    }

    return new Response(JSON.stringify({
      success: true,
      action: aiResponse.action,
      message: aiResponse.message,
      scheduled_time: aiResponse.scheduled_time
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('AI conversation engine error:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      success: false 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

// Helper functions for different scheduling actions
async function scheduleNewCall(supabase: any, phoneNumber: string, conversationId: string, scheduledTime: string) {
  // Get user profile to link the scheduled call
  const { data: userProfile } = await supabase
    .from('user_profiles')
    .select('id')
    .eq('phone_number', phoneNumber)
    .single();

  // Get a default activity for the call
  const { data: defaultActivity } = await supabase
    .from('activities')
    .select('id')
    .eq('is_active', true)
    .limit(1)
    .single();

  const { error: scheduleError } = await supabase
    .from('scheduled_calls')
    .insert({
      phone_number: phoneNumber,
      user_id: userProfile?.id,
      scheduled_time: scheduledTime,
      activity_id: defaultActivity?.id,
      conversation_id: conversationId,
      status: 'pending'
    });

  if (scheduleError) {
    console.error('Error scheduling call:', scheduleError);
    throw scheduleError;
  } else {
    console.log('Call scheduled for:', scheduledTime);
  }
}

async function rescheduleExistingCall(supabase: any, callId: string, newTime: string) {
  if (!callId) {
    console.error('No call ID provided for rescheduling');
    return;
  }

  const { error: rescheduleError } = await supabase
    .from('scheduled_calls')
    .update({
      scheduled_time: newTime,
      status: 'pending'
    })
    .eq('id', callId);

  if (rescheduleError) {
    console.error('Error rescheduling call:', rescheduleError);
    throw rescheduleError;
  } else {
    console.log('Call rescheduled to:', newTime);
  }
}

async function cancelCall(supabase: any, callId: string) {
  if (!callId) {
    console.error('No call ID provided for cancellation');
    return;
  }

  const { error: cancelError } = await supabase
    .from('scheduled_calls')
    .update({ status: 'cancelled' })
    .eq('id', callId);

  if (cancelError) {
    console.error('Error cancelling call:', cancelError);
    throw cancelError;
  } else {
    console.log('Call cancelled:', callId);
  }
}