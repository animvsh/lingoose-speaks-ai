import { useEffect, useRef, useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import { useAIBehaviorAnalysis } from '@/hooks/useAIBehaviorMetrics';

interface CallCompletionConditions {
  exerciseCompleted: boolean;
  activityDetailsTimeSpent: number; // in seconds
}

export const useCallCompletionTracker = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { analyzeAIBehavior } = useAIBehaviorAnalysis();
  
  const [conditions, setConditions] = useState<CallCompletionConditions>({
    exerciseCompleted: false,
    activityDetailsTimeSpent: 0
  });
  
  const activityDetailsStartTime = useRef<number | null>(null);
  const lastProcessedCallId = useRef<string | null>(null);

  // Track latest call analysis
  const { data: latestCall } = useQuery({
    queryKey: ['latest-call-analysis', user?.id],
    queryFn: async () => {
      if (!user) return null;

      const { data, error } = await supabase
        .from('vapi_call_analysis')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) throw error;
      return data;
    },
    enabled: !!user,
    refetchInterval: 2000, // Check every 2 seconds for new calls
  });

  // Process call completion when conditions are met
  useEffect(() => {
    if (latestCall && 
        latestCall.vapi_call_id !== lastProcessedCallId.current &&
        (conditions.exerciseCompleted || conditions.activityDetailsTimeSpent >= 10)) {
      
      console.log('Call completion detected:', {
        callId: latestCall.vapi_call_id,
        exerciseCompleted: conditions.exerciseCompleted,
        activityDetailsTime: conditions.activityDetailsTimeSpent,
        hasTranscript: !!latestCall.transcript
      });

      // Process the transcript for speaker identification
      processCallTranscript(latestCall);
      lastProcessedCallId.current = latestCall.vapi_call_id;
      
      // Reset conditions
      setConditions({
        exerciseCompleted: false,
        activityDetailsTimeSpent: 0
      });
    }
  }, [latestCall, conditions]);

  const processCallTranscript = async (callData: any) => {
    if (!callData.transcript) {
      console.log('No transcript available for call:', callData.vapi_call_id);
      return;
    }

    try {
      // Process transcript for speaker identification
      const processedTranscript = parseTranscriptWithSpeakers(callData.transcript);
      
      // Update the call analysis with processed transcript in extracted_insights
      const updatedInsights = {
        ...callData.extracted_insights,
        processed_transcript: processedTranscript,
        transcript_processed_at: new Date().toISOString()
      };
      
      const { error } = await supabase
        .from('vapi_call_analysis')
        .update({
          extracted_insights: updatedInsights
        })
        .eq('id', callData.id);

      if (error) {
        console.error('Error updating processed transcript:', error);
        return;
      }

      // Show notification about transcript availability
      toast({
        title: "Call Transcript Ready! 📄",
        description: "Your conversation transcript with speaker identification is now available in Activity Details.",
      });

      // Invalidate queries to refresh data
      queryClient.invalidateQueries({ queryKey: ['activity-details'] });
      queryClient.invalidateQueries({ queryKey: ['call-analysis'] });

      // Trigger AI behavior analysis
      if (callData.transcript) {
        console.log('Triggering AI behavior analysis for call:', callData.id);
        analyzeAIBehavior({
          callAnalysisId: callData.id,
          transcript: callData.transcript
        });
      }

    } catch (error) {
      console.error('Error processing transcript:', error);
    }
  };

  const parseTranscriptWithSpeakers = (transcript: string) => {
    // This function attempts to identify speakers in the transcript
    // VAPI transcripts may come in different formats, so we need to handle various cases
    
    if (!transcript) return null;

    // Try to identify if transcript already has speaker labels
    const hasExistingSpeakers = transcript.includes('User:') || 
                               transcript.includes('Assistant:') || 
                               transcript.includes('Speaker 1:') ||
                               transcript.includes('Speaker 2:');

    if (hasExistingSpeakers) {
      // Transcript already has speaker identification
      return {
        formatted_transcript: transcript,
        speaker_turns: extractSpeakerTurns(transcript),
        processing_method: 'existing_labels'
      };
    }

    // Attempt to identify speakers using heuristics
    const sentences = transcript.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const processedSentences = [];
    let currentSpeaker = 'User'; // Start with user
    
    for (let i = 0; i < sentences.length; i++) {
      const sentence = sentences[i].trim();
      if (!sentence) continue;

      // Simple heuristics to identify speaker changes
      // This is basic and could be improved with more sophisticated NLP
      const isQuestion = sentence.includes('?');
      const hasGreeting = /\b(hello|hi|hey|good morning|good afternoon)\b/i.test(sentence);
      const hasAssistantLanguage = /\b(I can help|let me|I'll|I am|I will)\b/i.test(sentence);
      
      // Determine speaker based on patterns
      if (hasAssistantLanguage || (i > 0 && isQuestion && currentSpeaker === 'User')) {
        currentSpeaker = 'Assistant';
      } else if (hasGreeting && i === 0) {
        currentSpeaker = 'User';
      }
      
      processedSentences.push({
        speaker: currentSpeaker,
        text: sentence,
        timestamp: i
      });

      // Alternate speakers for conversation flow (simple approach)
      if (i > 0 && Math.random() > 0.7) {
        currentSpeaker = currentSpeaker === 'User' ? 'Assistant' : 'User';
      }
    }

    // Format the transcript with speaker labels
    const formattedTranscript = processedSentences
      .map(turn => `${turn.speaker}: ${turn.text}`)
      .join('\n\n');

    return {
      formatted_transcript: formattedTranscript,
      speaker_turns: processedSentences,
      processing_method: 'heuristic_analysis'
    };
  };

  const extractSpeakerTurns = (transcript: string) => {
    const lines = transcript.split('\n').filter(line => line.trim());
    const turns = [];
    
    for (const line of lines) {
      const speakerMatch = line.match(/^(User|Assistant|Speaker \d+):\s*(.+)$/);
      if (speakerMatch) {
        turns.push({
          speaker: speakerMatch[1],
          text: speakerMatch[2],
          timestamp: turns.length
        });
      }
    }
    
    return turns;
  };

  // Methods to update tracking conditions
  const markExerciseCompleted = () => {
    console.log('Exercise marked as completed');
    setConditions(prev => ({ ...prev, exerciseCompleted: true }));
  };

  const startActivityDetailsTracking = () => {
    console.log('Started tracking activity details time');
    activityDetailsStartTime.current = Date.now();
  };

  const stopActivityDetailsTracking = () => {
    if (activityDetailsStartTime.current) {
      const timeSpent = (Date.now() - activityDetailsStartTime.current) / 1000;
      console.log('Activity details time spent:', timeSpent, 'seconds');
      setConditions(prev => ({ 
        ...prev, 
        activityDetailsTimeSpent: timeSpent 
      }));
      activityDetailsStartTime.current = null;
    }
  };

  return {
    latestCall,
    conditions,
    markExerciseCompleted,
    startActivityDetailsTracking,
    stopActivityDetailsTracking,
    hasProcessedTranscript: latestCall?.extracted_insights && 
                        (latestCall.extracted_insights as any)?.processed_transcript != null
  };
};