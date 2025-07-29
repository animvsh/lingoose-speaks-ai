import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface SMSWebhookBody {
  From: string;
  Body: string;
  MessageSid: string;
  AccountSid: string;
  NumSegments: string;
  FromCity?: string;
  FromState?: string;
  FromCountry?: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('SMS webhook received');
    
    // Parse the incoming webhook from Twilio
    const formData = await req.formData();
    const webhookData: SMSWebhookBody = {
      From: formData.get('From') as string,
      Body: formData.get('Body') as string,
      MessageSid: formData.get('MessageSid') as string,
      AccountSid: formData.get('AccountSid') as string,
      NumSegments: formData.get('NumSegments') as string,
      FromCity: formData.get('FromCity') as string || undefined,
      FromState: formData.get('FromState') as string || undefined,
      FromCountry: formData.get('FromCountry') as string || undefined,
    };

    console.log('Incoming SMS:', {
      from: webhookData.From,
      body: webhookData.Body?.substring(0, 50) + '...',
      sid: webhookData.MessageSid
    });

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    
    const { createClient } = await import('https://esm.sh/@supabase/supabase-js@2');
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get or create conversation
    let { data: conversation, error: convError } = await supabase
      .from('sms_conversations')
      .select('*')
      .eq('phone_number', webhookData.From)
      .single();

    if (convError && convError.code === 'PGRST116') {
      // Create new conversation
      const { data: newConv, error: createError } = await supabase
        .from('sms_conversations')
        .insert({
          phone_number: webhookData.From,
          conversation_state: { stage: 'initial' },
        })
        .select()
        .single();

      if (createError) {
        console.error('Error creating conversation:', createError);
        throw createError;
      }
      conversation = newConv;
    } else if (convError) {
      console.error('Error fetching conversation:', convError);
      throw convError;
    }

    // Store the incoming message
    const { error: msgError } = await supabase
      .from('sms_messages')
      .insert({
        conversation_id: conversation!.id,
        phone_number: webhookData.From,
        message_text: webhookData.Body,
        direction: 'inbound',
        message_sid: webhookData.MessageSid,
      });

    if (msgError) {
      console.error('Error storing message:', msgError);
      throw msgError;
    }

    // Process the message with AI
    const response = await fetch(`${supabaseUrl}/functions/v1/ai-conversation-engine`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${supabaseServiceKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        conversationId: conversation!.id,
        incomingMessage: webhookData.Body,
        phoneNumber: webhookData.From,
      }),
    });

    if (!response.ok) {
      console.error('AI conversation engine failed:', await response.text());
      throw new Error('AI processing failed');
    }

    const aiResult = await response.json();
    console.log('AI response:', aiResult);

    // Return TwiML response (empty for now, AI will send response via separate SMS)
    const twimlResponse = `<?xml version="1.0" encoding="UTF-8"?>
<Response></Response>`;

    return new Response(twimlResponse, {
      headers: {
        ...corsHeaders,
        'Content-Type': 'text/xml',
      },
    });

  } catch (error) {
    console.error('SMS webhook error:', error);
    
    // Return empty TwiML to prevent retries
    const twimlResponse = `<?xml version="1.0" encoding="UTF-8"?>
<Response></Response>`;

    return new Response(twimlResponse, {
      headers: {
        ...corsHeaders,
        'Content-Type': 'text/xml',
      },
    });
  }
});