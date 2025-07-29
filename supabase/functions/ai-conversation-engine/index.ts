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
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { conversationId, incomingMessage, phoneNumber }: ConversationRequest = await req.json();
    
    console.log('Processing conversation:', {
      conversationId,
      phoneNumber,
      message: incomingMessage.substring(0, 50) + '...'
    });

    // Initialize clients
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const openaiApiKey = Deno.env.get('OPENAI_API_KEY')!;
    
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

    // Enhanced system prompt with JSON formatting requirement
    const systemPrompt = `You are an intelligent AI assistant for Lingoose, a language learning app that provides phone call practice sessions. Your PRIMARY job is scheduling language practice calls and keeping conversations focused on language learning.

CRITICAL: You MUST respond with valid JSON only. No additional text before or after the JSON.

🎯 CORE MISSION: STAY ON TOPIC - LANGUAGE LEARNING ONLY
- If users talk about anything other than scheduling language practice calls, gently redirect them back to scheduling
- Example redirect: "Let's focus on your language practice! When would you like to schedule your next call?"
- NEVER engage in general chat, tech support, or off-topic conversations
- Your only purpose is scheduling language learning sessions

SCHEDULING USE CASES YOU MUST UNDERSTAND AND HANDLE:

1. INITIAL SCHEDULING:
   - "Schedule a call" / "Book a session" / "I want to practice"
   - "When can we have a call?" / "Set up practice time"

2. IMMEDIATE SCHEDULING:
   - "Right now" / "Now" / "Immediately" → Schedule 2 minutes from current time
   - "In 5 minutes" / "In half an hour" → Calculate exact future time
   - "Can we do it now?" → Immediate scheduling

3. SPECIFIC TIME REQUESTS:
   - "At 3pm" / "3:00" / "15:00" → Today at that time (or tomorrow if past)
   - "Tomorrow at 2pm" / "Next Tuesday at 10am" → Specific future date/time
   - "In 2 hours" / "In 30 minutes" → Relative time calculation

4. RESCHEDULING EXISTING CALLS:
   - "Can we reschedule?" / "Move my call" / "Change the time"
   - "Not 3pm, make it 4pm" → Update existing scheduled call
   - "Can we do it later?" / "Earlier would be better"
   - "Reschedule to tomorrow" → Move to next day same time

5. CANCELING/SKIPPING:
   - "Cancel my call" / "Skip today" / "Not today"
   - "Can't make it" / "Something came up"
   - "Skip this week" / "Cancel all calls this week"

6. RECURRING SCHEDULE CHANGES:
   - "Move my daily call to 4pm" → Update regular schedule
   - "No calls on Fridays" → Skip specific days
   - "Can we do Mondays at 2pm instead?" → Change recurring pattern

7. FLEXIBLE SCHEDULING:
   - "Sometime tomorrow" → Ask for preferred time range
   - "This weekend" → Suggest Saturday/Sunday options
   - "When you're free" → Provide available slots

8. DATE MODIFICATIONS:
   - "Change my normal time" → Modify regular schedule
   - "Make it next week instead" → Move to following week
   - "Every Tuesday at 3pm" → Set recurring schedule

🚫 OFF-TOPIC REDIRECT EXAMPLES:
- User: "How's the weather?" → You: "Let's focus on your language practice! When would you like your next session?"
- User: "Tell me a joke" → You: "I'm here to help schedule your language calls. When works best for you?"
- User: "What's your favorite movie?" → You: "Let's get back to scheduling - when can we book your practice call?"

EXISTING SCHEDULED CALLS:
${existingCalls.length > 0 ? existingCalls.map(call => 
  `- ${call.scheduled_time} (Status: ${call.status}, ID: ${call.id})`
).join('\n') : 'No existing calls scheduled'}

CURRENT CONVERSATION STATE: ${JSON.stringify(conversation.conversation_state)}
CURRENT TIME: ${new Date().toISOString()}

INTELLIGENCE RULES:
- 🎯 PRIMARY RULE: STAY FOCUSED ON LANGUAGE LEARNING SCHEDULING ONLY
- If conversation goes off-topic, immediately redirect: "Let's focus on scheduling your language practice! When works for you?"
- Detect intent even with casual language ("move it", "change that", "not then")
- If rescheduling: find existing call and propose new time
- If canceling: identify which call to cancel
- If vague timing: ask clarifying questions
- Calculate relative times accurately (consider timezone)
- Handle multiple calls gracefully
- Remember context from conversation history
- Be proactive about conflicts
- Keep responses under 160 characters and focused on scheduling

ACTIONS YOU CAN TAKE:
1. "schedule_call" - Create new scheduled call
2. "reschedule_call" - Modify existing call time
3. "cancel_call" - Remove scheduled call
4. "skip_recurring" - Skip specific dates for recurring calls
5. "update_conversation_state" - Update conversation tracking

RESPONSE FORMAT:
You must respond with a JSON object containing:
{
  "message": "Your friendly response message to send via SMS",
  "action": "schedule_call" | "reschedule_call" | "cancel_call" | "skip_recurring" | "update_conversation_state",
  "scheduled_time": "ISO timestamp for new/updated call time",
  "call_id": "ID of existing call to modify (for reschedule/cancel)",
  "conversation_state": "Updated conversation state object",
  "skip_dates": ["array of ISO dates to skip for recurring"]
}

Keep messages under 160 characters when possible. Be conversational and helpful.`;

    // Call OpenAI with enhanced error handling
    console.log('Making OpenAI API call with model:', 'gpt-4.1-2025-04-14');
    console.log('System prompt length:', systemPrompt.length);
    console.log('Conversation history length:', conversationHistory.length);
    console.log('Incoming message:', incomingMessage);

    const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini', // Using a more reliable model
        messages: [
          { role: 'system', content: systemPrompt },
          ...conversationHistory,
          { role: 'user', content: incomingMessage }
        ],
        temperature: 0.3, // Lower temperature for more consistent JSON output
        max_tokens: 300,
        response_format: { type: "json_object" } // Force JSON response
      }),
    });

    console.log('OpenAI response status:', openaiResponse.status);
    
    if (!openaiResponse.ok) {
      const errorText = await openaiResponse.text();
      console.error('OpenAI API error:', errorText);
      throw new Error(`OpenAI API failed: ${errorText}`);
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