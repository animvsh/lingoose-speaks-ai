
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
    const { phoneNumber, otp } = await req.json()
    
    console.log('SMS request received:', { phoneNumber: phoneNumber?.slice(-4), otp: otp ? '***' : 'missing' })

    // Get Twilio credentials from Supabase secrets
    const accountSid = Deno.env.get('TWILIO_ACCOUNT_SID')
    const authToken = Deno.env.get('TWILIO_AUTH_TOKEN')
    const fromNumber = Deno.env.get('TWILIO_PHONE_NUMBER')

    console.log('Twilio credentials check:', {
      accountSid: accountSid ? `${accountSid.slice(0, 6)}...` : 'missing',
      authToken: authToken ? 'present' : 'missing',
      fromNumber: fromNumber ? `${fromNumber.slice(0, 3)}...` : 'missing'
    })

    if (!accountSid || !authToken || !fromNumber) {
      console.error('Missing Twilio credentials')
      throw new Error('Twilio credentials not configured')
    }

    // Validate phone number format
    if (!phoneNumber || !phoneNumber.startsWith('+')) {
      console.error('Invalid phone number format:', phoneNumber)
      throw new Error('Phone number must include country code (e.g., +1234567890)')
    }

    // Create Twilio client
    const twilioUrl = `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`
    
    const body = new URLSearchParams({
      To: phoneNumber,
      From: fromNumber,
      Body: `Your Lingoose verification code is: ${otp}. This code will expire in 10 minutes. Don't share this code with anyone!`
    })

    console.log('Sending SMS via Twilio API...')

    const response = await fetch(twilioUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${btoa(`${accountSid}:${authToken}`)}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: body.toString(),
    })

    console.log('Twilio API response status:', response.status)

    if (!response.ok) {
      const errorData = await response.text()
      console.error('Twilio API error response:', errorData)
      
      // Parse Twilio error for more specific messaging
      try {
        const errorJson = JSON.parse(errorData)
        if (errorJson.code === 21211) {
          throw new Error('Invalid phone number. Please check the number and try again.')
        } else if (errorJson.code === 21614) {
          throw new Error('Phone number is not valid for SMS. Please try a different number.')
        } else {
          throw new Error(`SMS delivery failed: ${errorJson.message || 'Unknown error'}`)
        }
      } catch {
        throw new Error(`Failed to send SMS (${response.status}). Please try again.`)
      }
    }

    const result = await response.json()
    console.log('SMS sent successfully:', {
      sid: result.sid,
      status: result.status,
      to: result.to?.slice(-4)
    })

    return new Response(
      JSON.stringify({ 
        success: true, 
        messageSid: result.sid,
        status: result.status 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    )

  } catch (error) {
    console.error('SMS sending error:', error)
    return new Response(
      JSON.stringify({ 
        error: error.message || 'Failed to send SMS',
        success: false
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    )
  }
})
