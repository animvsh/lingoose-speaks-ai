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
    console.log('Missed call handler cron job triggered at:', new Date().toISOString());

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    
    const { createClient } = await import('https://esm.sh/@supabase/supabase-js@2');
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const now = new Date();
    const lookbackTime = new Date(now.getTime() - 30 * 60 * 1000); // Look back 30 minutes

    console.log('Checking for missed calls since:', lookbackTime.toISOString());

    // Find VAPI calls that ended without completion (missed calls, no answers, etc.)
    const { data: missedCalls, error: fetchError } = await supabase
      .from('vapi_call_analysis')
      .select('*')
      .in('call_status', ['no_answer', 'busy', 'failed', 'voicemail'])
      .gte('call_started_at', lookbackTime.toISOString())
      .is('follow_up_sent', null); // Only process calls without follow-up

    if (fetchError) {
      console.error('Error fetching missed calls:', fetchError);
      throw fetchError;
    }

    console.log(`Found ${missedCalls?.length || 0} missed calls to follow up on`);

    let followUpsSent = 0;
    let failedFollowUps = 0;

    if (missedCalls && missedCalls.length > 0) {
      for (const call of missedCalls) {
        try {
          console.log(`Processing missed call for ${call.phone_number}, status: ${call.call_status}`);

          // Create or get existing SMS conversation
          const { data: existingConversation } = await supabase
            .from('sms_conversations')
            .select('*')
            .eq('phone_number', call.phone_number)
            .order('created_at', { ascending: false })
            .limit(1)
            .single();

          let conversationId = existingConversation?.id;

          if (!conversationId) {
            // Create new conversation
            const { data: newConversation, error: convError } = await supabase
              .from('sms_conversations')
              .insert({
                user_id: call.user_id,
                phone_number: call.phone_number,
                conversation_state: { stage: 'missed_call_followup' },
                last_message_at: new Date().toISOString()
              })
              .select()
              .single();

            if (convError) {
              console.error('Error creating conversation:', convError);
              failedFollowUps++;
              continue;
            }
            conversationId = newConversation.id;
          }

          // Determine follow-up message based on call status
          let followUpMessage = '';
          switch (call.call_status) {
            case 'no_answer':
              followUpMessage = 'Hi! I tried calling for your language practice session but couldn\'t reach you. When would be a good time to reschedule? Just reply with a time that works! 📞';
              break;
            case 'busy':
              followUpMessage = 'Hi! Your line was busy when I called for practice. When would be a better time to call you for your language session? 📱';
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

          // Send follow-up SMS
          const smsResponse = await supabase.functions.invoke('send-sms', {
            body: {
              phoneNumber: call.phone_number,
              message: followUpMessage,
              messageType: 'follow_up'
            }
          });

          if (smsResponse.error) {
            console.error('Error sending follow-up SMS:', smsResponse.error);
            failedFollowUps++;
            continue;
          }

          // Store the outbound message
          await supabase
            .from('sms_messages')
            .insert({
              conversation_id: conversationId,
              phone_number: call.phone_number,
              message_text: followUpMessage,
              direction: 'outbound'
            });

          // Mark call as having follow-up sent
          await supabase
            .from('vapi_call_analysis')
            .update({ 
              follow_up_sent: true,
              follow_up_sent_at: new Date().toISOString()
            })
            .eq('id', call.id);

          console.log(`Follow-up sent successfully to ${call.phone_number}`);
          followUpsSent++;

        } catch (followUpError) {
          console.error(`Error processing follow-up for call ${call.id}:`, followUpError);
          failedFollowUps++;
        }
      }
    }

    // Clean up old processed follow-ups (older than 7 days)
    const cleanupTime = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const { error: cleanupError } = await supabase
      .from('vapi_call_analysis')
      .update({ follow_up_sent: null, follow_up_sent_at: null })
      .eq('follow_up_sent', true)
      .lt('call_started_at', cleanupTime.toISOString());

    if (cleanupError) {
      console.error('Error during follow-up cleanup:', cleanupError);
    } else {
      console.log('Cleanup completed for old follow-ups');
    }

    return new Response(JSON.stringify({
      success: true,
      message: 'Missed call handler cron job completed',
      follow_ups_sent: followUpsSent,
      failed_follow_ups: failedFollowUps,
      timestamp: new Date().toISOString()
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Missed call handler cron job error:', error);
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