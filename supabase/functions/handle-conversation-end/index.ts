
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
    const { 
      userId, 
      conversationId, 
      summary 
    } = await req.json()
    
    if (!userId || !conversationId || !summary) {
      return new Response(
        JSON.stringify({ error: 'User ID, conversation ID, and summary are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseKey)

    console.log(`Processing conversation end for user ${userId}, conversation ${conversationId}`);

    // Update the conversation summary in user profile using the database function
    const { error: updateError } = await supabase.rpc('update_conversation_summary', {
      p_user_id: userId,
      p_summary: summary
    });

    if (updateError) {
      console.error('Error updating conversation summary:', updateError);
      throw new Error('Failed to update conversation summary');
    }

    console.log(`Successfully updated conversation summary for user ${userId}`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Conversation summary updated successfully' 
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Error handling conversation end:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error', details: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
