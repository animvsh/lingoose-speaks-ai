
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
    const { callId, userId } = await req.json()
    
    if (!callId || !userId) {
      return new Response(
        JSON.stringify({ error: 'Call ID and User ID are required' }),
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

    console.log(`Fetching call data for call ID: ${callId}`)

    // Fetch call data from VAPI API
    const vapiResponse = await fetch(`https://api.vapi.ai/call/${callId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${vapiApiKey}`,
        'Content-Type': 'application/json',
      }
    })

    if (!vapiResponse.ok) {
      const errorData = await vapiResponse.json()
      console.error('VAPI API error:', errorData)
      return new Response(
        JSON.stringify({ error: 'Failed to fetch call data from VAPI', details: errorData }),
        { status: vapiResponse.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const callData = await vapiResponse.json()
    console.log('Fetched call data:', JSON.stringify(callData, null, 2))

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseKey)

    // Get user profile to get phone number
    const { data: userProfile, error: userError } = await supabase
      .from('user_profiles')
      .select('phone_number')
      .eq('id', userId)
      .single()

    if (userError || !userProfile) {
      console.error('User not found:', userError)
      return new Response(
        JSON.stringify({ error: 'User not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Process the call data similar to webhook processing
    const transcript = callData.transcript
    const phoneNumber = userProfile.phone_number
    const duration = callData.duration
    const status = callData.status
    const startedAt = callData.startedAt
    const endedAt = callData.endedAt

    // Perform sentiment analysis
    let sentimentAnalysis = null
    if (transcript) {
      const positiveWords = ['good', 'great', 'excellent', 'happy', 'pleased', 'satisfied', 'wonderful', 'amazing']
      const negativeWords = ['bad', 'terrible', 'awful', 'disappointed', 'frustrated', 'angry', 'horrible', 'worst']
      
      const words = transcript.toLowerCase().split(/\s+/)
      const positiveCount = words.filter(word => positiveWords.includes(word)).length
      const negativeCount = words.filter(word => negativeWords.includes(word)).length
      
      let sentiment = 'neutral'
      if (positiveCount > negativeCount) sentiment = 'positive'
      else if (negativeCount > positiveCount) sentiment = 'negative'
      
      sentimentAnalysis = {
        overall_sentiment: sentiment,
        positive_score: positiveCount,
        negative_score: negativeCount,
        confidence: Math.abs(positiveCount - negativeCount) / Math.max(1, positiveCount + negativeCount)
      }
    }

    // Check if analysis already exists
    const { data: existingAnalysis } = await supabase
      .from('vapi_call_analysis')
      .select('id')
      .eq('vapi_call_id', callId)
      .single()

    if (existingAnalysis) {
      return new Response(
        JSON.stringify({ message: 'Call analysis already exists', id: existingAnalysis.id }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Store the analysis
    const { data: insertedData, error: insertError } = await supabase
      .from('vapi_call_analysis')
      .insert({
        vapi_call_id: callId,
        user_id: userId,
        phone_number: phoneNumber,
        call_data: callData,
        transcript: transcript,
        sentiment_analysis: sentimentAnalysis,
        performance_metrics: {
          call_duration_seconds: duration,
          transcript_length: transcript ? transcript.length : 0,
          call_quality: callData.quality || 'unknown'
        },
        extracted_insights: {
          user_satisfaction: sentimentAnalysis?.overall_sentiment === 'positive' ? 'high' : 
                            sentimentAnalysis?.overall_sentiment === 'negative' ? 'low' : 'medium',
          call_summary: transcript ? transcript.substring(0, 500) + '...' : null
        },
        call_duration: duration,
        call_status: status,
        call_started_at: startedAt ? new Date(startedAt).toISOString() : null,
        call_ended_at: endedAt ? new Date(endedAt).toISOString() : null
      })
      .select()
      .single()

    if (insertError) {
      console.error('Error inserting call analysis:', insertError)
      return new Response(
        JSON.stringify({ error: 'Failed to store call analysis', details: insertError }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    console.log('Successfully stored call analysis:', insertedData.id)

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Call data fetched and analyzed successfully',
        analysisId: insertedData.id
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Error fetching VAPI call data:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error', details: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
