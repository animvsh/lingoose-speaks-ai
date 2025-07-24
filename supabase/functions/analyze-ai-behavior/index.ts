import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { callAnalysisId, transcript, userId, phoneNumber } = await req.json();

    console.log('Analyzing AI behavior for call:', callAnalysisId);

    if (!transcript || !callAnalysisId) {
      throw new Error('Missing required data: transcript and callAnalysisId');
    }

    // Parse transcript to separate AI and user messages
    const { aiMessages, userMessages } = parseTranscript(transcript);
    
    if (aiMessages.length === 0) {
      console.log('No AI messages found in transcript');
      return new Response(JSON.stringify({ error: 'No AI messages found' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Calculate all AI behavior metrics
    const metrics = await calculateAIBehaviorMetrics(aiMessages, userMessages, transcript);
    
    // Generate improvement suggestions using OpenAI
    const improvements = await generateAIInsights(metrics, aiMessages, userMessages, transcript);

    // Store metrics in database
    const { data: metricsData, error: metricsError } = await supabaseClient
      .from('ai_behavior_metrics')
      .insert({
        user_id: userId,
        vapi_call_analysis_id: callAnalysisId,
        phone_number: phoneNumber,
        instruction_adherence: metrics.instructionAdherence,
        target_vocab_prompt_rate: metrics.targetVocabPromptRate,
        question_density: metrics.questionDensity,
        continuity_score: metrics.continuityscore,
        followup_quality: metrics.followupQuality,
        repetition_avoidance: metrics.repetitionAvoidance,
        tone_consistency: metrics.toneConsistency,
        recovery_score: metrics.recoveryScore,
        callback_usage: metrics.callbackUsage,
        user_fluency_delta: metrics.userFluencyDelta,
        analysis_details: metrics.details,
        improvement_suggestions: improvements
      })
      .select()
      .single();

    if (metricsError) {
      console.error('Error storing metrics:', metricsError);
      throw metricsError;
    }

    // Update or create system prompt evolution
    await updateSystemPrompt(supabaseClient, userId, phoneNumber, metrics, improvements);

    console.log('AI behavior analysis completed successfully');

    return new Response(JSON.stringify({
      success: true,
      metrics: metricsData,
      improvements
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in analyze-ai-behavior function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

function parseTranscript(transcript: string) {
  const lines = transcript.split('\n').filter(line => line.trim());
  const aiMessages: string[] = [];
  const userMessages: string[] = [];

  for (const line of lines) {
    const cleaned = line.trim();
    if (cleaned.toLowerCase().includes('assistant:') || cleaned.toLowerCase().includes('ai:') || cleaned.toLowerCase().includes('bot:')) {
      const message = cleaned.replace(/^(assistant:|ai:|bot:)/i, '').trim();
      if (message) aiMessages.push(message);
    } else if (cleaned.toLowerCase().includes('user:') || cleaned.toLowerCase().includes('human:')) {
      const message = cleaned.replace(/^(user:|human:)/i, '').trim();
      if (message) userMessages.push(message);
    } else if (cleaned && !cleaned.includes(':')) {
      // Fallback: if no clear speaker indication, assume alternating pattern
      if (aiMessages.length === userMessages.length) {
        aiMessages.push(cleaned);
      } else {
        userMessages.push(cleaned);
      }
    }
  }

  return { aiMessages, userMessages };
}

async function calculateAIBehaviorMetrics(aiMessages: string[], userMessages: string[], fullTranscript: string) {
  const totalAITurns = aiMessages.length;
  
  // 1. Instruction Adherence Score - evaluate common instruction adherence
  const instructionAdherence = calculateInstructionAdherence(aiMessages, fullTranscript);

  // 2. Target Vocabulary Prompt Rate - check for domain-specific vocabulary
  const targetVocab = ['ticket', 'delay', 'luggage', 'flight', 'booking', 'reservation', 'passenger', 'departure', 'arrival', 'gate'];
  const vocabMatches = targetVocab.filter(word => 
    aiMessages.some(msg => msg.toLowerCase().includes(word.toLowerCase()))
  );
  const targetVocabPromptRate = vocabMatches.length / targetVocab.length;

  // 3. Question Density - enhanced to detect Hindi questions too
  const questionTurns = aiMessages.filter(msg => 
    msg.includes('?') || 
    /\b(kya|kab|kaise|kaun|kyun|kahan|kitna)\b/i.test(msg)
  ).length;
  const questionDensity = questionTurns / totalAITurns;

  // 4. Continuity Score - improved word overlap calculation
  const continuityscore = calculateContinuityScore(aiMessages);

  // 5. Follow-up Quality Score - context-aware follow-ups
  const followupQuality = calculateFollowupQuality(aiMessages, userMessages);

  // 6. Repetition Avoidance Score - n-gram based analysis
  const repetitionAvoidance = calculateRepetitionAvoidance(aiMessages);

  // 7. Tone Consistency Score - basic tone analysis
  const toneConsistency = calculateToneConsistency(aiMessages);

  // 8. Callback Usage - references to earlier conversation
  const callbackUsage = calculateCallbackUsage(aiMessages, userMessages);

  // 9. Recovery Score - handling weak user responses
  const recoveryScore = calculateRecoveryScore(aiMessages, userMessages);

  // 10. User Fluency Delta - improvement measurement
  const userFluencyDelta = calculateUserFluencyDelta(userMessages);

  return {
    instructionAdherence,
    targetVocabPromptRate,
    questionDensity,
    continuityscore,
    followupQuality,
    repetitionAvoidance,
    toneConsistency,
    recoveryScore,
    callbackUsage,
    userFluencyDelta,
    details: {
      totalAITurns,
      questionTurns,
      vocabMatches,
      userMessageCount: userMessages.length,
      targetVocab,
      enhancedAnalysis: true
    }
  };
}

function calculateInstructionAdherence(aiMessages: string[], fullTranscript: string): number {
  // Define common instruction categories to check
  const instructions = [
    { name: 'friendly_tone', check: (msg: string) => /\b(thank you|thanks|please|sorry|welcome)\b/i.test(msg) },
    { name: 'questions_asked', check: (msg: string) => msg.includes('?') || /\b(kya|kab|kaise)\b/i.test(msg) },
    { name: 'topic_maintained', check: (msg: string, idx: number) => idx === 0 || msg.length > 10 },
    { name: 'no_repetition', check: (msg: string, idx: number, msgs: string[]) => 
      idx === 0 || !msgs.slice(0, idx).some(prev => prev.toLowerCase() === msg.toLowerCase()) }
  ];
  
  let totalScore = 0;
  let totalChecks = 0;
  
  aiMessages.forEach((msg, idx) => {
    instructions.forEach(instruction => {
      if (instruction.check(msg, idx, aiMessages)) {
        totalScore++;
      }
      totalChecks++;
    });
  });
  
  return totalChecks > 0 ? totalScore / totalChecks : 0.85;
}

function calculateContinuityScore(aiMessages: string[]): number {
  if (aiMessages.length < 2) return 1.0;
  
  // Enhanced word overlap with semantic keywords
  let totalSimilarity = 0;
  const contentWords = (text: string) => 
    text.toLowerCase().split(/\s+/).filter(word => 
      word.length > 3 && !['this', 'that', 'with', 'have', 'been', 'will'].includes(word)
    );
  
  for (let i = 0; i < aiMessages.length - 1; i++) {
    const words1 = new Set(contentWords(aiMessages[i]));
    const words2 = new Set(contentWords(aiMessages[i + 1]));
    
    if (words1.size === 0 || words2.size === 0) continue;
    
    const intersection = new Set([...words1].filter(x => words2.has(x)));
    const union = new Set([...words1, ...words2]);
    totalSimilarity += intersection.size / union.size;
  }
  
  return Math.min(1.0, totalSimilarity / (aiMessages.length - 1));
}

function calculateFollowupQuality(aiMessages: string[], userMessages: string[]): number {
  let qualityScore = 0;
  let pairs = 0;

  for (let i = 0; i < Math.min(aiMessages.length, userMessages.length); i++) {
    if (userMessages[i] && aiMessages[i]) {
      // Check if AI response contains words from user message
      const userWords = new Set(userMessages[i].toLowerCase().split(/\s+/));
      const aiWords = aiMessages[i].toLowerCase().split(/\s+/);
      const hasContext = aiWords.some(word => userWords.has(word));
      
      if (hasContext) qualityScore++;
      pairs++;
    }
  }

  return pairs > 0 ? qualityScore / pairs : 0;
}

function calculateRepetitionAvoidance(aiMessages: string[]): number {
  if (aiMessages.length === 0) return 1.0;
  
  // Create 5-grams from all AI messages
  const allText = aiMessages.join(' ').toLowerCase();
  const words = allText.split(/\s+/);
  
  if (words.length < 5) return 1.0;
  
  const ngrams = [];
  for (let i = 0; i <= words.length - 5; i++) {
    ngrams.push(words.slice(i, i + 5).join(' '));
  }
  
  const uniqueNgrams = new Set(ngrams);
  const repetitionRate = (ngrams.length - uniqueNgrams.size) / ngrams.length;
  
  return Math.max(0, 1 - repetitionRate);
}

function calculateToneConsistency(aiMessages: string[]): number {
  if (aiMessages.length === 0) return 1.0;
  
  // Simple tone indicators
  const casualIndicators = ['hi', 'hey', 'sure', 'cool', 'awesome', 'great', 'nice'];
  const formalIndicators = ['please', 'kindly', 'certainly', 'however', 'furthermore'];
  
  let casualCount = 0;
  let formalCount = 0;
  
  aiMessages.forEach(msg => {
    const lowerMsg = msg.toLowerCase();
    if (casualIndicators.some(word => lowerMsg.includes(word))) casualCount++;
    if (formalIndicators.some(word => lowerMsg.includes(word))) formalCount++;
  });
  
  if (casualCount === 0 && formalCount === 0) return 0.90; // Default neutral
  
  const total = casualCount + formalCount;
  const dominantTone = Math.max(casualCount, formalCount);
  
  return dominantTone / total;
}

function calculateCallbackUsage(aiMessages: string[], userMessages: string[]): number {
  let callbacks = 0;
  
  // Look for references to earlier user inputs
  const earlierUserWords = new Set();
  
  for (let i = 0; i < userMessages.length; i++) {
    userMessages[i].toLowerCase().split(/\s+/).forEach(word => earlierUserWords.add(word));
    
    if (i < aiMessages.length) {
      const aiMessage = aiMessages[i].toLowerCase();
      // Check if AI references words from earlier user messages
      if (aiMessage.includes('you said') || aiMessage.includes('you mentioned') || 
          [...earlierUserWords].some(word => word.length > 3 && aiMessage.includes(word))) {
        callbacks++;
      }
    }
  }
  
  return callbacks;
}

function calculateRecoveryScore(aiMessages: string[], userMessages: string[]): number {
  let recoveries = 0;
  let opportunities = 0;

  for (let i = 0; i < userMessages.length; i++) {
    const userMsg = userMessages[i].toLowerCase();
    // Detect weak/short responses
    if (userMsg.length < 10 || ['yes', 'no', 'ok', 'haan', 'nahi'].includes(userMsg.trim())) {
      opportunities++;
      
      // Check if next AI message is engaging
      if (i < aiMessages.length && aiMessages[i].includes('?')) {
        recoveries++;
      }
    }
  }

  return opportunities > 0 ? recoveries / opportunities : 1.0;
}

function calculateUserFluencyDelta(userMessages: string[]): number {
  if (userMessages.length === 0) return 0;
  
  const firstHalf = userMessages.slice(0, Math.floor(userMessages.length / 2));
  const secondHalf = userMessages.slice(Math.floor(userMessages.length / 2));
  
  if (firstHalf.length === 0 || secondHalf.length === 0) return 0;
  
  // Calculate metrics for both halves
  const getMetrics = (messages: string[]) => {
    const totalWords = messages.join(' ').split(/\s+/).length;
    const uniqueWords = new Set(messages.join(' ').toLowerCase().split(/\s+/)).size;
    const avgLength = totalWords / messages.length;
    return { totalWords, uniqueWords, avgLength };
  };
  
  const firstMetrics = getMetrics(firstHalf);
  const secondMetrics = getMetrics(secondHalf);
  
  // Calculate improvement indicators
  const uniqueWordImprovement = (secondMetrics.uniqueWords - firstMetrics.uniqueWords) / Math.max(firstMetrics.uniqueWords, 1);
  const lengthImprovement = (secondMetrics.avgLength - firstMetrics.avgLength) / Math.max(firstMetrics.avgLength, 1);
  
  // Return delta as improvement score (-1 to 1)
  return Math.max(-1, Math.min(1, (uniqueWordImprovement + lengthImprovement) / 2));
}

async function generateAIInsights(metrics: any, aiMessages: string[], userMessages: string[], transcript: string): Promise<string[]> {
  const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
  
  if (!openAIApiKey) {
    console.log('OpenAI API key not found, using fallback insights');
    return generateFallbackSuggestions(metrics);
  }

  try {
    const prompt = `You are an expert AI conversation coach analyzing a language learning session. Based on the following metrics and conversation transcript, provide 3-5 specific, actionable insights for improving the AI's teaching effectiveness in the next call.

CONVERSATION METRICS:
- Instruction Adherence: ${(metrics.instructionAdherence * 100).toFixed(1)}%
- Question Density: ${(metrics.questionDensity * 100).toFixed(1)}%
- Continuity Score: ${(metrics.continuityscore * 100).toFixed(1)}%
- Follow-up Quality: ${(metrics.followupQuality * 100).toFixed(1)}%
- Repetition Avoidance: ${(metrics.repetitionAvoidance * 100).toFixed(1)}%
- Recovery Score: ${(metrics.recoveryScore * 100).toFixed(1)}%
- User Fluency Delta: ${(metrics.userFluencyDelta * 100).toFixed(1)}%

CONVERSATION SAMPLE:
${transcript.slice(0, 2000)}...

Provide insights that are:
1. Specific and actionable
2. Based on actual conversation patterns you observe
3. Focused on improving language learning outcomes
4. Practical for implementation in the next call

Format as a simple array of strings, each being one actionable insight. Return only the JSON array, no other text.`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: 'You are an expert AI conversation coach. Return only valid JSON arrays of insights.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
        max_tokens: 800
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    const insights = data.choices[0].message.content;
    
    try {
      const parsedInsights = JSON.parse(insights);
      if (Array.isArray(parsedInsights)) {
        return parsedInsights.slice(0, 5); // Limit to 5 insights
      }
    } catch (parseError) {
      console.error('Failed to parse OpenAI insights, using fallback');
    }
    
    return generateFallbackSuggestions(metrics);
    
  } catch (error) {
    console.error('Error generating AI insights:', error);
    return generateFallbackSuggestions(metrics);
  }
}

function generateFallbackSuggestions(metrics: any): string[] {
  const suggestions: string[] = [];

  if (metrics.questionDensity < 0.4) {
    suggestions.push("Ask more questions to engage the user - aim for 1 question every 2-3 turns");
  }

  if (metrics.targetVocabPromptRate < 0.7) {
    suggestions.push("Include more target vocabulary words in your responses");
  }

  if (metrics.continuityscore < 0.8) {
    suggestions.push("Maintain better topic continuity between your responses");
  }

  if (metrics.followupQuality < 0.7) {
    suggestions.push("Ask more context-aware follow-up questions based on user responses");
  }

  if (metrics.repetitionAvoidance < 0.8) {
    suggestions.push("Vary your sentence structure and avoid repeating phrases");
  }

  if (metrics.recoveryScore < 0.8) {
    suggestions.push("Improve recovery when users give short or unclear responses");
  }

  if (metrics.callbackUsage < 1) {
    suggestions.push("Reference earlier parts of the conversation to show continuity");
  }

  if (suggestions.length === 0) {
    suggestions.push("Continue maintaining your current high performance across all metrics");
  }

  return suggestions;
}

async function updateSystemPrompt(supabaseClient: any, userId: string, phoneNumber: string, metrics: any, improvements: string[]) {
  if (improvements.length === 0) return;

  // Get current prompt if exists
  const { data: currentPrompt } = await supabaseClient
    .from('system_prompt_evolution')
    .select('*')
    .eq('phone_number', phoneNumber)
    .eq('is_active', true)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  const basePrompt = currentPrompt?.current_prompt || `You are a helpful AI language learning assistant. Your goal is to help users practice conversational skills in a natural, engaging way.

Core Instructions:
- Be friendly and encouraging
- Ask engaging questions to keep the conversation flowing
- Use appropriate vocabulary for the user's level
- Provide gentle corrections when needed
- Maintain conversation continuity`;

  // Generate improved prompt based on metrics
  let improvedPrompt = basePrompt;
  
  if (metrics.questionDensity < 0.4) {
    improvedPrompt += "\n\nIMPORTANT: Ask at least one question every 2-3 turns to maintain engagement.";
  }

  if (metrics.continuityscore < 0.8) {
    improvedPrompt += "\n\nIMPORTANT: Build upon your previous messages and maintain topic continuity unless the user explicitly changes the subject.";
  }

  if (metrics.repetitionAvoidance < 0.8) {
    improvedPrompt += "\n\nIMPORTANT: Vary your sentence structure and avoid repeating phrases or expressions.";
  }

  if (improvements.length > 0) {
    improvedPrompt += "\n\nSpecific improvements needed:\n" + improvements.map(imp => `- ${imp}`).join('\n');
  }

  // Store new prompt
  await supabaseClient
    .from('system_prompt_evolution')
    .insert({
      user_id: userId,
      phone_number: phoneNumber,
      current_prompt: improvedPrompt,
      previous_prompt: currentPrompt?.current_prompt || null,
      trigger_metrics: metrics,
      improvement_rationale: improvements.join('; ')
    });

  // Deactivate old prompt
  if (currentPrompt) {
    await supabaseClient
      .from('system_prompt_evolution')
      .update({ is_active: false })
      .eq('id', currentPrompt.id);
  }
}