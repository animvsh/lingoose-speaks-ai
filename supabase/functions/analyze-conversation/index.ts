
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

    // Get conversation data
    const { data: conversation, error: convError } = await supabase
      .from('conversations')
      .select('*')
      .eq('id', conversationId)
      .single()

    if (convError || !conversation) {
      console.error('Error fetching conversation:', convError)
      return new Response(
        JSON.stringify({ error: 'Failed to fetch conversation data' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Extract conversation transcript and details
    const conversationData = conversation.conversation_data || {}
    const transcript = conversationData.transcript || 'No transcript available'
    const duration = conversation.duration_seconds || 0

    console.log('Analyzing conversation:', conversationId)
    console.log('Transcript length:', transcript.length)

    // Use OpenAI to analyze the conversation
    const analysisPrompt = `
    Analyze this Hindi language conversation practice session and provide detailed insights:

    Conversation Transcript: ${transcript}
    Duration: ${duration} seconds
    
    Please provide a comprehensive analysis in JSON format with the following structure:
    {
      "conversationSummary": "Brief summary of what was discussed",
      "skillsIdentified": ["skill1", "skill2", "skill3"],
      "strengthsObserved": ["strength1", "strength2"],
      "areasForImprovement": ["area1", "area2"],
      "vocabularyUsed": ["word1", "word2", "word3"],
      "grammarPoints": ["point1", "point2"],
      "fluencyScore": 0-100,
      "pronunciationScore": 0-100,
      "comprehensionScore": 0-100,
      "confidenceLevel": "low/medium/high",
      "nextSessionRecommendations": ["recommendation1", "recommendation2"],
      "specificLearningGoals": ["goal1", "goal2"],
      "culturalContextUsed": ["context1", "context2"]
    }
    
    Focus on practical learning insights that can help improve Hindi language skills.
    `

    const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
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
            content: 'You are an expert Hindi language teacher and conversation analyst. Provide detailed, actionable insights about language learning progress.'
          },
          {
            role: 'user',
            content: analysisPrompt
          }
        ],
        temperature: 0.7,
        max_tokens: 1500
      })
    })

    if (!openaiResponse.ok) {
      console.error('OpenAI API error:', await openaiResponse.text())
      return new Response(
        JSON.stringify({ error: 'Failed to analyze conversation with AI' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const aiAnalysis = await openaiResponse.json()
    const analysisText = aiAnalysis.choices[0]?.message?.content

    if (!analysisText) {
      return new Response(
        JSON.stringify({ error: 'No analysis received from AI' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    let insights
    try {
      insights = JSON.parse(analysisText)
    } catch {
      // If JSON parsing fails, create a structured response
      insights = {
        conversationSummary: analysisText.substring(0, 200) + '...',
        skillsIdentified: ['conversation', 'pronunciation'],
        strengthsObserved: ['active participation'],
        areasForImprovement: ['continued practice needed'],
        fluencyScore: 50,
        pronunciationScore: 50,
        comprehensionScore: 50,
        confidenceLevel: 'medium'
      }
    }

    // Generate learning recommendations based on analysis
    const learningRecommendations = {
      nextTopics: insights.nextSessionRecommendations || ['Basic greetings', 'Daily conversations'],
      focusAreas: insights.areasForImprovement || ['Pronunciation', 'Vocabulary'],
      difficultyAdjustment: insights.fluencyScore > 70 ? 'increase' : insights.fluencyScore < 40 ? 'decrease' : 'maintain',
      recommendedPracticeTime: duration < 300 ? 'extend sessions' : 'maintain current duration'
    }

    // Create comparison analysis
    const comparisonAnalysis = {
      sessionNumber: 1, // This could be calculated based on user's conversation history
      improvementAreas: insights.areasForImprovement || [],
      progressIndicators: {
        fluency: insights.fluencyScore || 50,
        pronunciation: insights.pronunciationScore || 50,
        comprehension: insights.comprehensionScore || 50
      }
    }

    // Calculate overall confidence score
    const confidenceScore = Math.round((
      (insights.fluencyScore || 50) + 
      (insights.pronunciationScore || 50) + 
      (insights.comprehensionScore || 50)
    ) / 3)

    // Store insights in database
    const { data: savedInsights, error: insertError } = await supabase
      .from('curriculum_insights')
      .insert({
        user_id: userId,
        phone_number: phoneNumber,
        insights: insights,
        learning_recommendations: learningRecommendations,
        comparison_analysis: comparisonAnalysis,
        confidence_score: confidenceScore
      })
      .select()
      .single()

    if (insertError) {
      console.error('Error saving insights:', insertError)
      return new Response(
        JSON.stringify({ error: 'Failed to save insights' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Update user profile with conversation summary
    const conversationSummary = insights.conversationSummary || 'Completed practice session'
    const { error: updateError } = await supabase
      .rpc('update_conversation_summary', {
        p_phone_number: phoneNumber,
        p_summary: conversationSummary
      })

    if (updateError) {
      console.error('Error updating conversation summary:', updateError)
    }

    console.log('Successfully analyzed conversation and saved insights')

    return new Response(
      JSON.stringify({ 
        success: true, 
        insights: savedInsights,
        message: 'Conversation analyzed successfully' 
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
