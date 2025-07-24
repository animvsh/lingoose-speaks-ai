
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

    const { conversationId, callData, transcript, userProfile } = await req.json();

    console.log('Starting conversation analysis for:', conversationId);

    // Store the VAPI call analysis
    const { data: vapiCallAnalysis, error: vapiError } = await supabase
      .from('vapi_call_analysis')
      .insert({
        user_id: userProfile.id,
        conversation_id: conversationId,
        call_data: callData,
        call_duration: callData.endedAt ? 
          Math.round((new Date(callData.endedAt).getTime() - new Date(callData.startedAt).getTime()) / 1000) 
          : null,
        call_started_at: callData.startedAt,
        call_ended_at: callData.endedAt,
        vapi_call_id: callData.id,
        phone_number: userProfile.phone_number,
        transcript: transcript,
        call_status: callData.status
      })
      .select()
      .single();

    if (vapiError) {
      console.error('Error storing VAPI call analysis:', vapiError);
      throw vapiError;
    }

    // Call the core metrics analysis function
    const { error: coreMetricsError } = await supabase.functions.invoke('analyze-core-metrics', {
      body: {
        vapi_call_analysis_id: vapiCallAnalysis.id,
        phone_number: userProfile.phone_number,
        transcript: transcript,
        call_duration: vapiCallAnalysis.call_duration,
        user_id: userProfile.id
      }
    });

    if (coreMetricsError) {
      console.error('Error analyzing core metrics:', coreMetricsError);
    }

    // Update user conversation summary
    if (transcript) {
      const summary = transcript.length > 200 ? transcript.substring(0, 200) + '...' : transcript;
      
      const { error: updateError } = await supabase.rpc('update_last_convo', {
        p_phone_number: userProfile.phone_number,
        p_summary: summary
      });

      if (updateError) {
        console.error('Error updating conversation summary:', updateError);
      }
    }

    return new Response(JSON.stringify({ 
      success: true, 
      analysis_id: vapiCallAnalysis.id 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in analyze-conversation:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
