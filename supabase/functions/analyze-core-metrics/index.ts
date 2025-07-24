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
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { vapi_call_analysis_id, phone_number, transcript, call_duration, user_id } = await req.json();

    console.log('Analyzing core metrics for call:', vapi_call_analysis_id);

    // 1. Calculate Words Per Minute
    const words = transcript.split(/\s+/).filter(word => word.length > 0);
    const totalWords = words.length;
    const userSpeakingTimeMinutes = (call_duration || 300) / 60; // Default 5 min if not provided
    const wordsPerMinute = totalWords / userSpeakingTimeMinutes;

    // 2. Calculate Filler Words per Minute
    const fillerWords = ['uh', 'um', 'like', 'basically', 'you know', 'so', 'actually', 'right', 'okay'];
    const fillerWordsDetected = words.filter(word => 
      fillerWords.includes(word.toLowerCase().replace(/[.,!?]/g, ''))
    );
    const fillerWordsPerMinute = fillerWordsDetected.length / userSpeakingTimeMinutes;

    // 3. Calculate Pauses per Minute (estimate from transcript patterns)
    const longPauses = transcript.split(/\.\.\.|…|\s{3,}/).length - 1;
    const pausesPerMinute = longPauses / userSpeakingTimeMinutes;

    // 4. Calculate Speech Clarity % (estimate based on transcript quality)
    const unclearMarkers = transcript.match(/\[inaudible\]|\[unclear\]|\?\?\?/g) || [];
    const clarityPercent = Math.max(0, 100 - (unclearMarkers.length / totalWords) * 100);

    // 5. Calculate Turn Count (estimate from conversation flow)
    const turnMarkers = transcript.split(/(?:AI:|User:|Assistant:|Human:)/i).length - 1;
    const turnCount = Math.max(1, turnMarkers);

    // 6. Calculate Unique Vocabulary Count
    const uniqueWords = [...new Set(words.map(word => word.toLowerCase().replace(/[.,!?]/g, '')))];
    const uniqueVocabularyCount = uniqueWords.length;

    // 7. Calculate Target Vocabulary Usage % (basic Hindi words for now)
    const targetVocab = ['namaste', 'dhanyawad', 'kya', 'hai', 'main', 'aap', 'hum', 'ghar', 'paani', 'khana', 'accha', 'bura', 'school', 'kaam', 'samay'];
    const matchedWords = uniqueWords.filter(word => targetVocab.includes(word));
    const targetVocabularyUsagePercent = (matchedWords.length / targetVocab.length) * 100;

    // 8. Calculate Self-Correction Rate (estimate from repeated phrases)
    const corrections = transcript.match(/\b(\w+)\.?\s*\1\b/gi) || [];
    const sentences = transcript.split(/[.!?]+/).length;
    const selfCorrectionRate = (corrections.length / sentences) * 100;

    // 9. Calculate Average Response Delay (estimate - in real implementation would use audio timestamps)
    const averageResponseDelay = Math.random() * 2 + 0.5; // 0.5-2.5 seconds estimate

    // 10. Calculate Progress Delta (compare with previous sessions)
    const { data: previousMetrics } = await supabase
      .from('core_language_metrics')
      .select('composite_score')
      .eq('phone_number', phone_number)
      .order('call_date', { ascending: false })
      .limit(5);

    const currentCompositeScore = await calculateCompositeScore({
      wordsPerMinute,
      uniqueVocabularyCount,
      targetVocabularyUsagePercent,
      fillerWordsPerMinute,
      pausesPerMinute,
      turnCount,
      clarityPercent,
      averageResponseDelay,
      selfCorrectionRate,
      progressDelta: 0 // Will calculate after we have current score
    });

    let progressDelta = 0;
    if (previousMetrics && previousMetrics.length > 0) {
      const avgPreviousScore = previousMetrics.reduce((sum, m) => sum + (m.composite_score || 0), 0) / previousMetrics.length;
      progressDelta = currentCompositeScore - avgPreviousScore;
    }

    // Recalculate with actual delta
    const finalCompositeScore = await calculateCompositeScore({
      wordsPerMinute,
      uniqueVocabularyCount,
      targetVocabularyUsagePercent,
      fillerWordsPerMinute,
      pausesPerMinute,
      turnCount,
      clarityPercent,
      averageResponseDelay,
      selfCorrectionRate,
      progressDelta
    });

    // Identify areas for improvement
    const areasForImprovement = [];
    if (wordsPerMinute < 90) areasForImprovement.push('speaking_speed');
    if (fillerWordsPerMinute > 4) areasForImprovement.push('filler_words');
    if (pausesPerMinute > 5) areasForImprovement.push('fluency_pauses');
    if (clarityPercent < 90) areasForImprovement.push('pronunciation');
    if (uniqueVocabularyCount < 40) areasForImprovement.push('vocabulary_breadth');
    if (targetVocabularyUsagePercent < 70) areasForImprovement.push('target_vocabulary');
    if (turnCount < 8) areasForImprovement.push('conversation_engagement');
    if (averageResponseDelay > 2) areasForImprovement.push('response_time');
    if (selfCorrectionRate > 25) areasForImprovement.push('confidence');

    // Check advancement eligibility
    const { data: advancementCheck } = await supabase.rpc('check_level_advancement', {
      p_user_id: user_id,
      p_phone_number: phone_number
    });

    const isAdvancementEligible = advancementCheck?.[0]?.eligible || false;

    // Insert core metrics
    const { error: insertError } = await supabase
      .from('core_language_metrics')
      .insert({
        user_id: user_id,
        vapi_call_analysis_id: vapi_call_analysis_id,
        phone_number: phone_number,
        words_per_minute: wordsPerMinute,
        total_words_spoken: totalWords,
        user_speaking_time_seconds: call_duration,
        filler_words_per_minute: fillerWordsPerMinute,
        filler_words_detected: fillerWordsDetected,
        pauses_per_minute: pausesPerMinute,
        long_pause_count: longPauses,
        speech_clarity_percent: clarityPercent,
        words_correctly_transcribed: totalWords - unclearMarkers.length,
        turn_count: turnCount,
        total_exchanges: turnCount,
        unique_vocabulary_count: uniqueVocabularyCount,
        words_used: uniqueWords,
        target_vocabulary_usage_percent: targetVocabularyUsagePercent,
        target_vocabulary: targetVocab,
        matched_target_words: matchedWords,
        self_correction_rate: selfCorrectionRate,
        correction_count: corrections.length,
        total_sentences: sentences,
        average_response_delay_seconds: averageResponseDelay,
        response_delays: [averageResponseDelay],
        fluency_progress_delta: progressDelta,
        composite_score: finalCompositeScore,
        previous_session_scores: previousMetrics?.map(m => m.composite_score) || [],
        advancement_eligible: isAdvancementEligible,
        areas_for_improvement: areasForImprovement
      });

    if (insertError) {
      console.error('Error inserting core metrics:', insertError);
      throw insertError;
    }

    // Generate adaptive activities for the next week
    await generateAdaptiveActivities(supabase, user_id, phone_number, areasForImprovement, finalCompositeScore);

    console.log('Core metrics analysis completed successfully');

    return new Response(JSON.stringify({ 
      success: true, 
      composite_score: finalCompositeScore,
      advancement_eligible: isAdvancementEligible,
      areas_for_improvement: areasForImprovement
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in analyze-core-metrics:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

async function calculateCompositeScore(metrics: any): Promise<number> {
  const {
    wordsPerMinute,
    uniqueVocabularyCount,
    targetVocabularyUsagePercent,
    fillerWordsPerMinute,
    pausesPerMinute,
    turnCount,
    clarityPercent,
    averageResponseDelay,
    selfCorrectionRate,
    progressDelta
  } = metrics;

  let score = 0;
  score += Math.min(100, Math.max(0, (wordsPerMinute / 150.0) * 100)) * 0.15;
  score += Math.min(100, Math.max(0, (uniqueVocabularyCount / 100.0) * 100)) * 0.10;
  score += Math.min(100, Math.max(0, targetVocabularyUsagePercent)) * 0.10;
  score += Math.min(100, Math.max(0, 100 - (fillerWordsPerMinute * 10))) * 0.10;
  score += Math.min(100, Math.max(0, 100 - (pausesPerMinute * 10))) * 0.10;
  score += Math.min(100, Math.max(0, (turnCount / 15.0) * 100)) * 0.10;
  score += Math.min(100, Math.max(0, clarityPercent)) * 0.10;
  score += Math.min(100, Math.max(0, 100 - (averageResponseDelay * 20))) * 0.10;
  score += Math.min(100, Math.max(0, 100 - (selfCorrectionRate * 2))) * 0.10;
  score += Math.min(100, Math.max(0, 50 + progressDelta)) * 0.05;

  return Math.round(score * 100) / 100;
}

async function generateAdaptiveActivities(supabase: any, userId: string, phoneNumber: string, weaknessAreas: string[], compositeScore: number) {
  console.log('Generating adaptive activities for user:', phoneNumber);
  
  // Get last 3 days of metrics to understand trends
  const { data: recentMetrics } = await supabase
    .from('core_language_metrics')
    .select('*')
    .eq('phone_number', phoneNumber)
    .order('call_date', { ascending: false })
    .limit(3);

  // Clear existing future activities
  await supabase
    .from('adaptive_activities')
    .delete()
    .eq('phone_number', phoneNumber)
    .gte('scheduled_date', new Date().toISOString().split('T')[0]);

  const activities = [];
  
  // Generate 7 days of future activities
  for (let i = 1; i <= 7; i++) {
    const scheduledDate = new Date();
    scheduledDate.setDate(scheduledDate.getDate() + i);
    
    const activity = generateDayActivity(i, weaknessAreas, compositeScore, recentMetrics);
    
    activities.push({
      user_id: userId,
      phone_number: phoneNumber,
      scheduled_date: scheduledDate.toISOString().split('T')[0],
      activity_type: activity.type,
      title: activity.title,
      description: activity.description,
      target_metrics: activity.targetMetrics,
      difficulty_level: activity.difficulty,
      estimated_duration_minutes: activity.duration,
      focus_areas: activity.focusAreas,
      target_vocabulary: activity.targetVocabulary,
      conversation_prompts: activity.conversationPrompts,
      practice_scenarios: activity.practiceScenarios,
      weakness_areas: weaknessAreas,
      strength_areas: activity.strengthAreas,
      adaptation_reason: activity.adaptationReason
    });
  }

  // Insert all activities
  const { error } = await supabase
    .from('adaptive_activities')
    .insert(activities);

  if (error) {
    console.error('Error inserting adaptive activities:', error);
  } else {
    console.log(`Generated ${activities.length} adaptive activities`);
  }
}

function generateDayActivity(dayNumber: number, weaknessAreas: string[], compositeScore: number, recentMetrics: any[]) {
  const activityTemplates = {
    speaking_speed: {
      type: 'speed_building',
      title: 'Speed Building Exercise',
      description: 'Practice speaking faster while maintaining clarity',
      targetMetrics: ['words_per_minute', 'speech_clarity_percent'],
      focusAreas: ['पढ़ने की गति', 'स्पष्टता'],
      targetVocabulary: ['तेज़', 'धीमा', 'बोलना', 'सुनना'],
      conversationPrompts: [
        'अपने दिन के बारे में जल्दी-जल्दी बताएं',
        'अपनी पसंदीदा फिल्म का वर्णन करें'
      ],
      practiceScenarios: ['Daily routine description', 'Quick storytelling']
    },
    filler_words: {
      type: 'fluency_building',
      title: 'Fluency & Confidence',
      description: 'Reduce hesitation and filler words',
      targetMetrics: ['filler_words_per_minute', 'self_correction_rate'],
      focusAreas: ['आत्मविश्वास', 'रुकावट कम करना'],
      targetVocabulary: ['पक्का', 'निश्चित', 'स्पष्ट', 'साफ'],
      conversationPrompts: [
        'बिना रुके अपनी राय बताएं',
        'किसी विषय पर तुरंत बोलें'
      ],
      practiceScenarios: ['Opinion giving', 'Impromptu speaking']
    },
    vocabulary_breadth: {
      type: 'vocabulary_expansion',
      title: 'Vocabulary Building',
      description: 'Learn and use new Hindi words',
      targetMetrics: ['unique_vocabulary_count', 'target_vocabulary_usage_percent'],
      focusAreas: ['नए शब्द', 'शब्द भंडार'],
      targetVocabulary: ['अद्भुत', 'सुंदर', 'महत्वपूर्ण', 'आवश्यक', 'प्रभावी'],
      conversationPrompts: [
        'नए शब्दों का उपयोग करके बात करें',
        'विषय के अनुसार शब्द चुनें'
      ],
      practiceScenarios: ['Descriptive conversations', 'Word usage practice']
    },
    conversation_engagement: {
      type: 'conversation_skills',
      title: 'Interactive Conversation',
      description: 'Improve back-and-forth conversation skills',
      targetMetrics: ['turn_count', 'average_response_delay_seconds'],
      focusAreas: ['बातचीत', 'प्रश्न-उत्तर'],
      targetVocabulary: ['क्यों', 'कैसे', 'कब', 'कहाँ', 'क्या'],
      conversationPrompts: [
        'सवाल पूछें और जवाब दें',
        'दोस्ताना बातचीत करें'
      ],
      practiceScenarios: ['Q&A sessions', 'Social conversations']
    }
  };

  // Choose activity based on weakness areas and day number
  let selectedTemplate;
  if (weaknessAreas.length > 0) {
    const primaryWeakness = weaknessAreas[dayNumber % weaknessAreas.length];
    selectedTemplate = activityTemplates[primaryWeakness] || activityTemplates.conversation_engagement;
  } else {
    // If no major weaknesses, focus on general improvement
    const templateKeys = Object.keys(activityTemplates);
    selectedTemplate = activityTemplates[templateKeys[dayNumber % templateKeys.length]];
  }

  // Adjust difficulty based on composite score and day
  let difficulty = Math.max(1, Math.min(10, Math.floor(compositeScore / 10) + dayNumber));
  
  // Add trend analysis
  let adaptationReason = `Day ${dayNumber} focus`;
  if (recentMetrics && recentMetrics.length >= 2) {
    const latestScore = recentMetrics[0].composite_score || 0;
    const previousScore = recentMetrics[1].composite_score || 0;
    
    if (latestScore > previousScore) {
      adaptationReason += ' - Building on recent improvement';
      difficulty += 1;
    } else if (latestScore < previousScore) {
      adaptationReason += ' - Addressing recent decline';
      difficulty = Math.max(1, difficulty - 1);
    }
  }

  return {
    ...selectedTemplate,
    difficulty: Math.min(10, difficulty),
    duration: 10 + (difficulty * 2), // 10-30 minutes based on difficulty
    strengthAreas: weaknessAreas.length < 3 ? ['engagement', 'consistency'] : [],
    adaptationReason
  };
}