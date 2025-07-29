import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Call scheduler cron job triggered at:', new Date().toISOString());

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    
    const { createClient } = await import('https://esm.sh/@supabase/supabase-js@2');
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const now = new Date();
    const checkTime = new Date(now.getTime() + 2 * 60 * 1000); // Check for calls in next 2 minutes

    console.log('Checking for calls scheduled between:', now.toISOString(), 'and', checkTime.toISOString());

    // Find calls that are due to be initiated
    const { data: pendingCalls, error: fetchError } = await supabase
      .from('scheduled_calls')
      .select('*')
      .eq('status', 'pending')
      .gte('scheduled_time', now.toISOString())
      .lte('scheduled_time', checkTime.toISOString());

    if (fetchError) {
      console.error('Error fetching pending calls:', fetchError);
      throw fetchError;
    }

    console.log(`Found ${pendingCalls?.length || 0} calls to process`);

    let processedCalls = 0;
    let failedCalls = 0;

    if (pendingCalls && pendingCalls.length > 0) {
      for (const call of pendingCalls) {
        try {
          console.log(`Processing call ID: ${call.id} for ${call.phone_number} at ${call.scheduled_time}`);

          // Update status to 'calling' to prevent duplicate processing
          const { error: updateError } = await supabase
            .from('scheduled_calls')
            .update({ 
              status: 'calling',
              call_attempts: (call.call_attempts || 0) + 1,
              updated_at: new Date().toISOString()
            })
            .eq('id', call.id);

          if (updateError) {
            console.error('Error updating call status:', updateError);
            failedCalls++;
            continue;
          }

          // Get user profile and activity details
          const [userResult, activityResult] = await Promise.all([
            supabase
              .from('user_profiles')
              .select('*')
              .eq('phone_number', call.phone_number)
              .single(),
            call.activity_id ? supabase
              .from('activities')
              .select('*')
              .eq('id', call.activity_id)
              .single() : Promise.resolve({ data: null })
          ]);

          const userProfile = userResult.data;
          const activity = activityResult.data;

          if (!userProfile) {
            console.error(`No user profile found for phone: ${call.phone_number}`);
            await supabase
              .from('scheduled_calls')
              .update({ status: 'failed' })
              .eq('id', call.id);
            failedCalls++;
            continue;
          }

          // Initiate VAPI call
          const vapiResponse = await supabase.functions.invoke('start-vapi-call', {
            body: {
              phoneNumber: call.phone_number,
              userId: userProfile.id,
              language: userProfile.language || 'hindi',
              topic: activity?.name || 'General conversation practice',
              lastSummary: userProfile.last_conversation_summary
            }
          });

          if (vapiResponse.error) {
            console.error('Error initiating VAPI call:', vapiResponse.error);
            await supabase
              .from('scheduled_calls')
              .update({ status: 'failed' })
              .eq('id', call.id);
            failedCalls++;
          } else {
            console.log('VAPI call initiated successfully for:', call.phone_number);
            await supabase
              .from('scheduled_calls')
              .update({ status: 'completed' })
              .eq('id', call.id);
            processedCalls++;
          }

        } catch (callError) {
          console.error(`Error processing call ${call.id}:`, callError);
          await supabase
            .from('scheduled_calls')
            .update({ status: 'failed' })
            .eq('id', call.id);
          failedCalls++;
        }
      }
    }

    // Clean up old completed/failed calls (older than 24 hours)
    const cleanupTime = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const { error: cleanupError } = await supabase
      .from('scheduled_calls')
      .delete()
      .in('status', ['completed', 'failed', 'cancelled'])
      .lt('updated_at', cleanupTime.toISOString());

    if (cleanupError) {
      console.error('Error during cleanup:', cleanupError);
    } else {
      console.log('Cleanup completed for calls older than 24 hours');
    }

    // Also handle calls that have been stuck in 'calling' status for too long (>10 minutes)
    const stuckTime = new Date(now.getTime() - 10 * 60 * 1000);
    const { error: stuckError } = await supabase
      .from('scheduled_calls')
      .update({ status: 'failed' })
      .eq('status', 'calling')
      .lt('updated_at', stuckTime.toISOString());

    if (stuckError) {
      console.error('Error handling stuck calls:', stuckError);
    } else {
      console.log('Reset stuck calls to failed status');
    }

    return new Response(JSON.stringify({
      success: true,
      message: 'Call scheduler cron job completed',
      processed_calls: processedCalls,
      failed_calls: failedCalls,
      timestamp: new Date().toISOString()
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Call scheduler cron job error:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      success: false,
      timestamp: new Date().toISOString()
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});