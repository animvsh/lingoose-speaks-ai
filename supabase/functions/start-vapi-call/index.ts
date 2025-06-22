
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { phoneNumber, userId } = await req.json()
    
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

    // Create the call with Vapi.ai using your specific assistant ID
    const vapiResponse = await fetch('https://api.vapi.ai/call', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${vapiApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        phoneNumber: phoneNumber,
        assistantId: "2a2bb730-69ea-4cf2-99df-9b8c3408bfea"
      }),
    })

    const vapiData = await vapiResponse.json()

    if (!vapiResponse.ok) {
      console.error('Vapi API error:', vapiData)
      return new Response(
        JSON.stringify({ error: 'Failed to start call with Vapi', details: vapiData }),
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
        phone_number: phoneNumber,
        status: 'initiated',
        scenario: 'Hindi Learning Session',
        learning_focus: ['Conversation Practice', 'Pronunciation', 'Vocabulary']
      })

    if (logError) {
      console.error('Error logging call:', logError)
    }

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
