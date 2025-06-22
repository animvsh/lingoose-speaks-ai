
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
    const webhookData = await req.json()
    console.log('Received VAPI webhook:', JSON.stringify(webhookData, null, 2))

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseKey)

    // Process different webhook events
    if (webhookData.message?.type === 'end-of-call-report') {
      const callData = webhookData.message

      console.log('Processing end-of-call report for call:', callData.call?.id)

      // Extract relevant data
      const vapiCallId = callData.call?.id
      const phoneNumber = callData.call?.customer?.number
      const transcript = callData.transcript || callData.call?.transcript
      const duration = callData.call?.duration
      const status = callData.call?.status
      const startedAt = callData.call?.startedAt
      const endedAt = callData.call?.endedAt

      if (!vapiCallId || !phoneNumber) {
        console.error('Missing required call data:', { vapiCallId, phoneNumber })
        return new Response('Missing required call data', { status: 400 })
      }

      // Find the user based on phone number
      const { data: userProfile, error: userError } = await supabase
        .from('user_profiles')
        .select('id')
        .eq('phone_number', phoneNumber)
        .single()

      if (userError || !userProfile) {
        console.error('User not found for phone number:', phoneNumber, userError)
        return new Response('User not found', { status: 404 })
      }

      // Find the conversation based on call ID from the conversations table
      const { data: conversation, error: conversationError } = await supabase
        .from('conversations')
        .select('id')
        .contains('conversation_data', { call_id: vapiCallId })
        .single()

      // Perform basic sentiment analysis on the transcript
      let sentimentAnalysis = null
      if (transcript) {
        // Simple sentiment analysis - in production, you'd use a more sophisticated service
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

      // Extract performance metrics
      const performanceMetrics = {
        call_duration_seconds: duration,
        transcript_length: transcript ? transcript.length : 0,
        call_quality: callData.call?.quality || 'unknown',
        response_time: callData.call?.responseTime || null
      }

      // Extract insights from the call data
      const extractedInsights = {
        topics_discussed: [], // You could implement topic extraction here
        action_items: [], // Extract action items from transcript
        user_satisfaction: sentiment === 'positive' ? 'high' : sentiment === 'negative' ? 'low' : 'medium',
        call_summary: transcript ? transcript.substring(0, 500) + '...' : null
      }

      // Store the analysis in the database
      const { error: insertError } = await supabase
        .from('vapi_call_analysis')
        .insert({
          vapi_call_id: vapiCallId,
          user_id: userProfile.id,
          phone_number: phoneNumber,
          conversation_id: conversation?.id || null,
          call_data: callData,
          transcript: transcript,
          sentiment_analysis: sentimentAnalysis,
          performance_metrics: performanceMetrics,
          extracted_insights: extractedInsights,
          call_duration: duration,
          call_status: status,
          call_started_at: startedAt ? new Date(startedAt).toISOString() : null,
          call_ended_at: endedAt ? new Date(endedAt).toISOString() : null
        })

      if (insertError) {
        console.error('Error inserting call analysis:', insertError)
        return new Response('Failed to store call analysis', { status: 500 })
      }

      console.log('Successfully processed and stored call analysis for:', vapiCallId)
    }

    return new Response(
      JSON.stringify({ success: true, message: 'Webhook processed successfully' }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Error processing VAPI webhook:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error', details: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
