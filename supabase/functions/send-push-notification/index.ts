import { createClient } from 'npm:@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { user_id, title, body, type } = await req.json()

    if (!user_id || !title || !body) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Get user's FCM token
    const { data: profile, error: profileError } = await supabase
      .from('user_profiles')
      .select('fcm_token')
      .eq('id', user_id)
      .single()

    if (profileError || !profile?.fcm_token) {
      return new Response(
        JSON.stringify({ error: 'No FCM token found for user' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // For this demo, we'll simulate sending a push notification
    // In production, you would integrate with FCM here:
    /*
    const fcmResponse = await fetch(`https://fcm.googleapis.com/v1/projects/${PROJECT_ID}/messages:send`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        message: {
          token: profile.fcm_token,
          notification: {
            title: title,
            body: body,
          },
          data: {
            type: type || 'general'
          }
        },
      }),
    })
    */

    // For now, we'll log the notification and store it in a notifications table
    console.log('Push notification request:', {
      user_id,
      title,
      body,
      type,
      fcm_token: profile.fcm_token.substring(0, 20) + '...'
    })

    // Store notification record (optional)
    const { error: insertError } = await supabase
      .from('notifications')
      .insert({
        user_id,
        title,
        body,
        type: type || 'general',
        sent_at: new Date().toISOString()
      })

    if (insertError) {
      console.error('Error storing notification:', insertError)
      // Don't fail the request if we can't store the notification
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Push notification sent successfully',
        demo_note: 'This is a demo implementation. In production, integrate with FCM.'
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    console.error('Error in send-push-notification function:', error)
    
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})