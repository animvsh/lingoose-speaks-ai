
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
    const { conversationId, userId, phoneNumber } = await req.json()
    
    if (!conversationId || !userId || !phoneNumber) {
      return new Response(
        JSON.stringify({ error: 'Conversation ID, user ID, and phone number are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const openaiApiKey = Deno.env.get('OPENAI_API_KEY')
    
    if (!openaiApiKey) {
      return new Response(
        JSON.stringify({ error: 'OpenAI API key not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseKey)

    console.log(`Starting analysis for conversation ${conversationId}`);

    // Fetch conversation data
    const { data: conversation, error: conversationError } = await supabase
      .from('conversations')
      .select('*')
      .eq('id', conversationId)
      .single()

    if (conversationError || !conversation) {
      console.error('Error fetching conversation:', conversationError)
      throw new Error('Conversation not found')
    }

    // Extract transcript from conversation data
    const conversationData = conversation.conversation_data as any
    const transcript = conversationData?.transcript || 'No transcript available'

    console.log('Analyzing conversation with transcript length:', transcript.length);

    // Analyze the conversation using OpenAI
    const analysisResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: `You are an expert language learning coach. Analyze this Hindi conversation and provide:
            1. A comprehensive analysis of the learner's performance
            2. Specific areas for improvement
            3. Personalized recommendations for future practice
            4. A brief summary of the conversation topic and key points discussed
            
            Format your response as JSON with these fields:
            {
              "performance_analysis": "detailed analysis",
              "areas_for_improvement": ["area1", "area2", "area3"],
              "recommendations": ["rec1", "rec2", "rec3"],
              "conversation_summary": "brief summary of what was discussed",
              "confidence_score": 85
            }`
          },
          {
            role: 'user',
            content: `Please analyze this Hindi conversation transcript: ${transcript}`
          }
        ],
        temperature: 0.7,
        max_tokens: 1000
      }),
    })

    if (!analysisResponse.ok) {
      const error = await analysisResponse.text()
      console.error('OpenAI API error:', error)
      throw new Error('Failed to analyze conversation with OpenAI')
    }

    const analysisData = await analysisResponse.json()
    const analysisResult = JSON.parse(analysisData.choices[0].message.content)

    console.log('Analysis completed:', analysisResult);

    // Store curriculum insights
    const { error: insightsError } = await supabase
      .from('curriculum_insights')
      .insert({
        user_id: userId,
        phone_number: phoneNumber,
        insights: {
          performance_analysis: analysisResult.performance_analysis,
          areas_for_improvement: analysisResult.areas_for_improvement,
          transcript: transcript
        },
        learning_recommendations: {
          recommendations: analysisResult.recommendations,
          focus_areas: analysisResult.areas_for_improvement
        },
        comparison_analysis: {
          conversation_id: conversationId,
          analysis_date: new Date().toISOString()
        },
        confidence_score: analysisResult.confidence_score || 75
      })

    if (insightsError) {
      console.error('Error storing insights:', insightsError)
      throw new Error('Failed to store curriculum insights')
    }

    // Update conversation summary in user profile
    if (analysisResult.conversation_summary) {
      const { error: summaryError } = await supabase.rpc('update_conversation_summary', {
        p_user_id: userId,
        p_summary: analysisResult.conversation_summary
      });

      if (summaryError) {
        console.error('Error updating conversation summary:', summaryError);
        // Don't throw error here as the main analysis was successful
      } else {
        console.log('Conversation summary updated successfully');
      }
    }

    console.log(`Analysis completed successfully for conversation ${conversationId}`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        analysis: analysisResult,
        message: 'Conversation analyzed and insights stored successfully' 
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Error analyzing conversation:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error', details: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
