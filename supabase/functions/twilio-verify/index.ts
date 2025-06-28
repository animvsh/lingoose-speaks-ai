
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { action, phoneNumber, code } = await req.json()
    
    console.log('Twilio Verify request:', { action, phoneNumber: phoneNumber?.slice(-4) })

    // Get Twilio credentials from Supabase secrets
    const accountSid = Deno.env.get('TWILIO_ACCOUNT_SID')
    const authToken = Deno.env.get('TWILIO_AUTH_TOKEN')
    const verifySid = Deno.env.get('TWILIO_VERIFY_SERVICE_SID')

    if (!accountSid || !authToken || !verifySid) {
      console.error('Missing Twilio credentials')
      return new Response(
        JSON.stringify({ error: 'Twilio credentials not configured', success: false }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      )
    }

    // Validate phone number format
    if (!phoneNumber || !phoneNumber.startsWith('+')) {
      return new Response(
        JSON.stringify({ error: 'Phone number must include country code (e.g., +1234567890)', success: false }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      )
    }

    const baseUrl = `https://verify.twilio.com/v2/Services/${verifySid}`
    const authString = btoa(`${accountSid}:${authToken}`)

    if (action === 'send') {
      // Send OTP
      const response = await fetch(`${baseUrl}/Verifications`, {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${authString}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          To: phoneNumber,
          Channel: 'sms'
        })
      })

      if (!response.ok) {
        const errorData = await response.text()
        console.error('Twilio Verify send error:', errorData)
        return new Response(
          JSON.stringify({ error: 'Failed to send verification code', success: false }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
        )
      }

      const result = await response.json()
      console.log('OTP sent successfully:', result.status)

      return new Response(
        JSON.stringify({ success: true, status: result.status }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )

    } else if (action === 'verify') {
      // Verify OTP
      if (!code) {
        return new Response(
          JSON.stringify({ error: 'Verification code is required', success: false }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
        )
      }

      const response = await fetch(`${baseUrl}/VerificationCheck`, {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${authString}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          To: phoneNumber,
          Code: code
        })
      })

      if (!response.ok) {
        const errorData = await response.text()
        console.error('Twilio Verify check error:', errorData)
        return new Response(
          JSON.stringify({ error: 'Failed to verify code', success: false }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
        )
      }

      const result = await response.json()
      console.log('OTP verification result:', result.status)

      if (result.status === 'approved') {
        return new Response(
          JSON.stringify({ success: true, verified: true }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      } else {
        return new Response(
          JSON.stringify({ success: false, verified: false, error: 'Invalid verification code' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
        )
      }
    } else {
      return new Response(
        JSON.stringify({ error: 'Invalid action. Use "send" or "verify"', success: false }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      )
    }

  } catch (error) {
    console.error('Twilio Verify error:', error)
    return new Response(
      JSON.stringify({ error: error.message || 'Internal server error', success: false }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})
