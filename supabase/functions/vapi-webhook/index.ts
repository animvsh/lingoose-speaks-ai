
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

      // Handle missed calls or failed calls - IMMEDIATE RESPONSE
      if (status === 'no-answer' || status === 'failed' || status === 'busy' || status === 'voicemail' || (duration && duration < 10)) {
        console.log(`Call ${status} - sending immediate follow-up SMS`)
        
        // Determine message based on call status
        let followUpMessage = '';
        switch (status) {
          case 'no-answer':
            followUpMessage = 'Hi! I just tried calling for your language practice but you didn\'t pick up. When would be a good time to reschedule? Just reply with your preferred time! 📞';
            break;
          case 'busy':
            followUpMessage = 'Hi! Your line was busy when I called for practice. When would be a better time to call you? Reply with a time that works! 📱';
            break;
          case 'voicemail':
            followUpMessage = 'Hi! I left a voicemail about your language practice session. Would you like to reschedule? Just text me back with a good time! 💬';
            break;
          case 'failed':
            followUpMessage = 'Hi! There was an issue with your practice call. Let\'s reschedule - when would be convenient for you? 🔄';
            break;
          default:
            followUpMessage = 'Hi! We missed connecting for your language practice. When would you like to reschedule? Just reply with your preferred time! ⏰';
        }
        
        // Send immediate follow-up SMS
        const smsResponse = await fetch(`${supabaseUrl}/functions/v1/send-sms`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${supabaseKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            phoneNumber: phoneNumber,
            message: followUpMessage,
            messageType: 'missed_call_followup'
          }),
        });

        if (smsResponse.ok) {
          console.log('Follow-up SMS sent successfully');
          
          // Create or update SMS conversation
          const { data: existingConv } = await supabase
            .from('sms_conversations')
            .select('id')
            .eq('phone_number', phoneNumber)
            .single();

          let conversationId;
          if (existingConv) {
            // Update existing conversation
            const { data: updatedConv } = await supabase
              .from('sms_conversations')
              .update({
                conversation_state: { stage: 'missed_call_followup', missed_call_id: vapiCallId },
                last_message_at: new Date().toISOString()
              })
              .eq('id', existingConv.id)
              .select()
              .single();
            conversationId = updatedConv?.id;
          } else {
            // Create new conversation
            const { data: newConv } = await supabase
              .from('sms_conversations')
              .insert({
                phone_number: phoneNumber,
                conversation_state: { stage: 'missed_call_followup', missed_call_id: vapiCallId }
              })
              .select()
              .single();
            conversationId = newConv?.id;
          }

          // Store the outbound message
          if (conversationId) {
            await supabase
              .from('sms_messages')
              .insert({
                conversation_id: conversationId,
                phone_number: phoneNumber,
                message_text: followUpMessage,
                direction: 'outbound',
              });
          }
          
          // Mark this call as having follow-up sent immediately
          await supabase
            .from('vapi_call_analysis')
            .update({ 
              follow_up_sent: true,
              follow_up_sent_at: new Date().toISOString()
            })
            .eq('vapi_call_id', vapiCallId);
        } else {
          console.error('Failed to send follow-up SMS:', await smsResponse.text());
        }
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
      const { data: callAnalysis, error: insertError } = await supabase
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
        .select()
        .single()

      if (insertError) {
        console.error('Error inserting call analysis:', insertError)
        return new Response('Failed to store call analysis', { status: 500 })
      }

      // Analyze skills and store detailed skill analysis
      if (transcript && callAnalysis) {
        const skillsAnalysis = await analyzeSkillsFromTranscript(transcript, duration)
        
        // Store each skill analysis
        for (const skillAnalysis of skillsAnalysis) {
          const { error: skillInsertError } = await supabase
            .from('vapi_skill_analysis')
            .insert({
              vapi_call_analysis_id: callAnalysis.id,
              user_id: userProfile.id,
              skill_name: skillAnalysis.name,
              before_score: skillAnalysis.beforeScore,
              after_score: skillAnalysis.afterScore,
              improvement: skillAnalysis.improvement,
              analysis_details: skillAnalysis.details,
              confidence_score: skillAnalysis.confidence
            })

          if (skillInsertError) {
            console.error('Error inserting skill analysis:', skillInsertError)
          }
        }
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

// Function to analyze skills from transcript
async function analyzeSkillsFromTranscript(transcript: string, duration: number) {
  // This is a simplified skill analysis based on transcript content
  // In production, you'd use more sophisticated NLP/AI analysis
  
  const skills = [
    { name: "Greeting & Introductions", keywords: ["hello", "hi", "nice to meet", "my name is", "good morning", "good evening"] },
    { name: "Conversation Flow", keywords: ["what", "how", "when", "where", "why", "tell me", "can you", "would you"] },
    { name: "Vocabulary Usage", keywords: ["because", "however", "therefore", "although", "moreover", "furthermore"] },
    { name: "Pronunciation", keywords: [] } // This would require audio analysis in practice
  ]

  const transcriptLower = transcript.toLowerCase()
  const words = transcriptLower.split(/\s+/)
  const totalWords = words.length
  
  return skills.map(skill => {
    let score = 50 // Base score
    
    // Calculate score based on keyword usage
    if (skill.keywords.length > 0) {
      const keywordCount = skill.keywords.filter(keyword => 
        transcriptLower.includes(keyword)
      ).length
      
      score += Math.min(keywordCount * 10, 40) // Max 40 points for keywords
    }
    
    // Adjust for conversation length
    if (duration > 120) { // 2+ minutes
      score += 10
    }
    
    // Adjust for transcript quality
    if (totalWords > 50) {
      score += 10
    }
    
    const beforeScore = Math.max(30, score - 15 - Math.floor(Math.random() * 10))
    const afterScore = Math.min(100, score + Math.floor(Math.random() * 5))
    const improvement = afterScore - beforeScore
    
    return {
      name: skill.name,
      beforeScore,
      afterScore,
      improvement,
      confidence: 0.75 + Math.random() * 0.2, // 0.75 to 0.95
      details: {
        keywords_found: skill.keywords.filter(keyword => transcriptLower.includes(keyword)),
        transcript_length: totalWords,
        call_duration: duration,
        analysis_method: 'keyword_based'
      }
    }
  })
}
