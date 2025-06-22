
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

// Function to remove +1 prefix from phone number for customer.number field
function removeCountryCode(phoneNumber: string): string {
  // Remove +1 prefix if present
  if (phoneNumber.startsWith('+1')) {
    return phoneNumber.substring(2);
  }
  // Remove just + prefix if present and starts with 1
  if (phoneNumber.startsWith('+') && phoneNumber.substring(1).startsWith('1')) {
    return phoneNumber.substring(2);
  }
  return phoneNumber;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { phoneNumber, userId, topic = "Hindi conversation practice" } = await req.json()
    
    if (!phoneNumber || !userId) {
      return new Response(
        JSON.stringify({ error: 'Phone number and user ID are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const vapiApiKey = Deno.env.get('VAPI_API_KEY')
    
    if (!vapiApiKey) {
      return new Response(
        JSON.stringify({ error: 'VAPI API key not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Format phone number to E.164 format for internal use
    const formattedPhoneNumber = formatPhoneNumber(phoneNumber);
    // Remove +1 prefix for customer.number field
    const customerPhoneNumber = removeCountryCode(formattedPhoneNumber);
    
    console.log(`Original phone number: ${phoneNumber}`);
    console.log(`Formatted phone number: ${formattedPhoneNumber}`);
    console.log(`Customer phone number (without +1): ${customerPhoneNumber}`);
    console.log(`Topic: ${topic}`);

    // Create the call with Vapi.ai using workflow structure
    const vapiResponse = await fetch('https://api.vapi.ai/call', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${vapiApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        workflowId: "ed07a022-213b-4715-92ff-1ce874b24aa6",
        workflowOverrides: {
          variableValues: {
            topic: topic,
            language: "hindi",
            phone_number: formattedPhoneNumber
          }
        },
        phoneNumberId: "84d220a6-8dd1-4808-b31e-a6364ce98885",
        customer: {
          number: customerPhoneNumber
        }
      }),
    })

    const vapiData = await vapiResponse.json()

    if (!vapiResponse.ok) {
      console.error('Vapi API error:', vapiData)
      
      // Handle specific error cases
      let errorMessage = 'Failed to start call with Vapi';
      if (vapiData.message?.includes('Daily Outbound Call Limit')) {
        errorMessage = 'Daily call limit reached. Please try again tomorrow or contact support.';
      } else if (vapiData.message?.includes('Invalid phone number')) {
        errorMessage = 'Invalid phone number format. Please check and try again.';
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

    // Log the call in the database
    const { error: logError } = await supabase
      .from('call_logs')
      .insert({
        user_id: userId,
        call_id: vapiData.id,
        phone_number: formattedPhoneNumber,
        status: 'initiated',
        scenario: topic,
        learning_focus: ['Conversation Practice', 'Pronunciation', 'Vocabulary']
      })

    if (logError) {
      console.error('Error logging call:', logError)
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
