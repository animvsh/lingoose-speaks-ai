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
    console.log('Call scheduler running...');

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    
    const { createClient } = await import('https://esm.sh/@supabase/supabase-js@2');
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get scheduled calls that are due
    const now = new Date();
    const fiveMinutesFromNow = new Date(now.getTime() + 5 * 60 * 1000);

    const { data: pendingCalls, error: fetchError } = await supabase
      .from('scheduled_calls')
      .select('*')
      .eq('status', 'pending')
      .lte('scheduled_time', fiveMinutesFromNow.toISOString());

    if (fetchError) {
      console.error('Error fetching pending calls:', fetchError);
      throw fetchError;
    }

    console.log(`Found ${pendingCalls?.length || 0} pending calls`);

    for (const call of pendingCalls || []) {
      const scheduledTime = new Date(call.scheduled_time);
      
      // Check if it's time to make the call (within 1 minute of scheduled time)
      if (scheduledTime <= now) {
        console.log(`Initiating call for ${call.phone_number} at ${scheduledTime}`);

        try {
          // Update status to calling
          await supabase
            .from('scheduled_calls')
            .update({ 
              status: 'calling',
              call_attempts: call.call_attempts + 1 
            })
            .eq('id', call.id);

          // Get user profile for the call
          const { data: userProfile } = await supabase
            .from('user_profiles')
            .select('*')
            .eq('phone_number', call.phone_number)
            .single();

          // Get activity details
          const { data: activity } = await supabase
            .from('activities')
            .select('*')
            .eq('id', call.activity_id)
            .single();

          // Start the VAPI call
          const callResponse = await fetch(`${supabaseUrl}/functions/v1/start-vapi-call`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${supabaseServiceKey}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              phoneNumber: call.phone_number,
              userId: call.user_id,
              topic: activity?.description || 'Language practice session',
              lastConversationSummary: userProfile?.last_conversation_summary,
              maxDurationSeconds: 1500 // 25 minutes
            }),
          });

          if (callResponse.ok) {
            const callResult = await callResponse.json();
            console.log('Call initiated successfully:', callResult);

            // Update status to completed
            await supabase
              .from('scheduled_calls')
              .update({ status: 'completed' })
              .eq('id', call.id);

          } else {
            console.error('Failed to initiate call:', await callResponse.text());
            
            // Update status to failed
            await supabase
              .from('scheduled_calls')
              .update({ status: 'failed' })
              .eq('id', call.id);
          }

        } catch (callError) {
          console.error('Error processing scheduled call:', callError);
          
          // Update status to failed
          await supabase
            .from('scheduled_calls')
            .update({ status: 'failed' })
            .eq('id', call.id);
        }
      }
    }

    return new Response(JSON.stringify({
      success: true,
      processed: pendingCalls?.length || 0,
      message: 'Call scheduler completed'
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Call scheduler error:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      success: false 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});