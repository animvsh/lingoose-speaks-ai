
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Function to format phone number to E.164 format
function formatPhoneNumber(phoneNumber: string): string {
  // Remove all non-digit characters
  const cleaned = phoneNumber.replace(/\D/g, '');
  
  // If it doesn't start with country code, assume US (+1)
  if (cleaned.length === 10) {
    return `+1${cleaned}`;
  } else if (cleaned.length === 11 && cleaned.startsWith('1')) {
    return `+${cleaned}`;
  } else if (!phoneNumber.startsWith('+')) {
    return `+${cleaned}`;
  }
  
  return phoneNumber;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { 
      phoneNumber, 
      userId, 
      topic = "Hindi conversation practice",
      lastConversationSummary = null 
    } = await req.json()
    
    if (!phoneNumber || !userId) {
      return new Response(
        JSON.stringify({ error: 'Phone number and user ID are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const vapiApiKey = Deno.env.get('VAPI_API_KEY')
    
    if (!vapiApiKey) {
      console.error('VAPI_API_KEY environment variable not found')
      return new Response(
        JSON.stringify({ error: 'VAPI API key not configured. Please add your VAPI API key to the environment variables.' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Validate API key format - VAPI keys should not contain spaces or "Vapi API" prefix
    const cleanApiKey = vapiApiKey.trim();
    if (cleanApiKey.includes(' ') || cleanApiKey.toLowerCase().includes('vapi api')) {
      console.error('Invalid VAPI API key format detected');
      return new Response(
        JSON.stringify({ 
          error: 'Invalid VAPI API key format. Please ensure you\'ve copied the correct API key from your VAPI dashboard.',
          details: 'The API key should not contain spaces or descriptive text. It should be a clean token string.',
          help: 'Go to https://dashboard.vapi.ai/account and copy the raw API key value without any prefixes.'
        }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Log the API key info for debugging (without exposing the actual key)
    console.log(`VAPI API key length: ${cleanApiKey.length} characters`);
    console.log(`VAPI API key first 8 chars: ${cleanApiKey.substring(0, 8)}...`);

    // Format phone number to E.164 format
    const formattedPhoneNumber = formatPhoneNumber(phoneNumber);
    
    console.log(`Original phone number: ${phoneNumber}`);
    console.log(`Formatted phone number (E.164): ${formattedPhoneNumber}`);
    console.log(`Topic: ${topic}`);
    console.log(`Last conversation summary: ${lastConversationSummary}`);

    // Prepare variable values for the assistant
    const variableValues: any = {
      topic: topic,
      language: "hindi"
    };

    // Include conversation summary if available
    if (lastConversationSummary) {
      variableValues.previousConversationSummary = lastConversationSummary;
    }

    const requestBody = {
      assistantId: "d3c48fab-0d85-4e6e-9f22-076b9e3c537c",
      assistantOverrides: {
        variableValues: variableValues
      },
      phoneNumberId: "84d220a6-8dd1-4808-b31e-a6364ce98885",
      customer: {
        number: formattedPhoneNumber
      }
    };

    console.log('VAPI request body:', JSON.stringify(requestBody, null, 2));

    // Use the conversationalist agent approach with assistantId
    const vapiResponse = await fetch('https://api.vapi.ai/call', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${cleanApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    })

    console.log(`VAPI response status: ${vapiResponse.status}`);
    console.log(`VAPI response headers:`, Object.fromEntries(vapiResponse.headers.entries()));

    // Get the response text first
    const responseText = await vapiResponse.text();
    console.log(`VAPI response text: ${responseText}`);

    let vapiData;
    try {
      // Try to parse as JSON
      vapiData = JSON.parse(responseText);
    } catch (parseError) {
      console.error('Failed to parse VAPI response as JSON:', parseError);
      console.error('Response text was:', responseText);
      
      // Handle specific VAPI API authentication errors
      if (responseText.includes('failed to extract key') || responseText.includes('authentication')) {
        return new Response(
          JSON.stringify({ 
            error: 'VAPI API authentication failed. The API key appears to be invalid or incorrectly formatted.',
            details: { responseText, status: vapiResponse.status },
            help: 'Please verify your VAPI API key at https://dashboard.vapi.ai/account. Make sure to copy only the key value without any prefixes or spaces.'
          }),
          { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }
      
      // Handle non-JSON responses
      let errorMessage = 'Failed to start call with Vapi';
      if (responseText.includes('Daily Outbound Call Limit')) {
        errorMessage = 'Daily call limit reached. Please try again tomorrow or contact support.';
      } else if (responseText.includes('Invalid phone number')) {
        errorMessage = 'Invalid phone number format. Please check and try again.';
      } else if (responseText.includes('Trial accounts may only make calls to verified numbers')) {
        errorMessage = 'Your phone number needs to be verified. Trial accounts can only call verified numbers. Please contact support to verify your number.';
      } else if (responseText) {
        errorMessage = responseText;
      }
      
      return new Response(
        JSON.stringify({ error: errorMessage, details: { responseText, status: vapiResponse.status } }),
        { status: vapiResponse.status || 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    if (!vapiResponse.ok) {
      console.error('Vapi API error:', vapiData)
      
      // Handle specific error cases
      let errorMessage = 'Failed to start call with Vapi';
      if (vapiData.message?.includes('Daily Outbound Call Limit')) {
        errorMessage = 'Daily call limit reached. Please try again tomorrow or contact support.';
      } else if (vapiData.message?.includes('Invalid phone number')) {
        errorMessage = 'Invalid phone number format. Please check and try again.';
      } else if (vapiData.message?.includes('Trial accounts may only make calls to verified numbers')) {
        errorMessage = 'Your phone number needs to be verified. Trial accounts can only call verified numbers. Please contact support to verify your number.';
      } else if (vapiData.message) {
        errorMessage = vapiData.message;
      }
      
      return new Response(
        JSON.stringify({ error: errorMessage, details: vapiData }),
        { status: vapiResponse.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseKey)

    // Get the first available learning outline to use as outline_id
    const { data: outline, error: outlineError } = await supabase
      .from('learning_outlines')
      .select('id')
      .limit(1)
      .single();

    let outlineId = null;
    if (outline && !outlineError) {
      outlineId = outline.id;
    }

    // Log the call in the conversations table with proper outline_id
    const { error: logError } = await supabase
      .from('conversations')
      .insert({
        user_id: userId,
        outline_id: outlineId,
        conversation_data: {
          call_id: vapiData.id,
          phone_number: formattedPhoneNumber,
          status: 'initiated',
          scenario: topic,
          last_conversation_summary: lastConversationSummary,
          vapi_response: vapiData
        }
      })

    if (logError) {
      console.error('Error logging call:', logError)
    } else {
      console.log('Call logged successfully in conversations table')
    }

    console.log(`Call initiated successfully with ID: ${vapiData.id}`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        callId: vapiData.id, 
        message: 'Call initiated successfully' 
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Error starting Vapi call:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error', details: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
