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

    // Get conversation history
    const { data: conversation, error: convError } = await supabase
      .from('sms_conversations')
      .select('*')
      .eq('id', conversationId)
      .single();

    if (convError) {
      console.error('Error fetching conversation:', convError);
      throw convError;
    }

    // Get recent message history
    const { data: messages, error: msgError } = await supabase
      .from('sms_messages')
      .select('*')
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: true })
      .limit(10);

    if (msgError) {
      console.error('Error fetching messages:', msgError);
      throw msgError;
    }

    // Build conversation context for OpenAI
    const conversationHistory = messages!.map(msg => ({
      role: msg.direction === 'inbound' ? 'user' : 'assistant',
      content: msg.message_text
    }));

    const systemPrompt = `You are a helpful AI assistant for Lingoose, a language learning app that provides phone call practice sessions. Your job is to schedule phone calls with users for their language learning practice.

CONTEXT:
- The user missed a call or we need to schedule a call with them
- You need to find out when they're available for a language learning phone call
- Once you know their preferred time, schedule the call and confirm it

CONVERSATION STAGES:
1. INITIAL: Ask when they'd like to schedule their practice call
2. CLARIFYING: If they give vague times, ask for specifics  
3. CONFIRMING: Once you have a specific time, confirm it
4. SCHEDULED: Call is scheduled and confirmed

CURRENT CONVERSATION STATE: ${JSON.stringify(conversation.conversation_state)}

INSTRUCTIONS:
- Be friendly and conversational
- If they say they're free "now" or "right now", schedule for 2 minutes from now
- If they give relative times like "in 30 minutes" or "in an hour", calculate the exact time
- If they give specific times like "3pm" or "tomorrow at 2", use those
- Always confirm the scheduled time clearly
- Keep messages concise (under 160 characters when possible)
- Don't use emojis unless the user uses them first

RESPONSE FORMAT:
You must respond with a JSON object containing:
{
  "message": "Your response message to send via SMS",
  "action": "none" | "schedule_call" | "update_conversation_state",
  "scheduled_time": "ISO timestamp if scheduling a call",
  "conversation_state": "Updated conversation state object"
}`;

    // Call OpenAI
    const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4.1-2025-04-14',
        messages: [
          { role: 'system', content: systemPrompt },
          ...conversationHistory,
          { role: 'user', content: incomingMessage }
        ],
        temperature: 0.7,
        max_tokens: 500,
      }),
    });

    if (!openaiResponse.ok) {
      console.error('OpenAI API error:', await openaiResponse.text());
      throw new Error('OpenAI API failed');
    }

    const openaiResult = await openaiResponse.json();
    const aiResponseText = openaiResult.choices[0].message.content;
    
    console.log('Raw AI response:', aiResponseText);

    // Parse AI response
    let aiResponse;
    try {
      aiResponse = JSON.parse(aiResponseText);
    } catch (parseError) {
      console.error('Failed to parse AI response, using fallback:', parseError);
      // Fallback response
      aiResponse = {
        message: "I'd be happy to help schedule your language practice call. When would be a good time for you?",
        action: "update_conversation_state",
        conversation_state: { stage: "initial" }
      };
    }

    console.log('Parsed AI response:', aiResponse);

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

    // Schedule call if requested
    if (aiResponse.action === 'schedule_call' && aiResponse.scheduled_time) {
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
          scheduled_time: aiResponse.scheduled_time,
          activity_id: defaultActivity?.id,
          conversation_id: conversationId,
          status: 'pending'
        });

      if (scheduleError) {
        console.error('Error scheduling call:', scheduleError);
      } else {
        console.log('Call scheduled for:', aiResponse.scheduled_time);
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