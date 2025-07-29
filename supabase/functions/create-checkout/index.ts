import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const supabaseClient = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
    { auth: { persistSession: false } }
  );

  try {
    const authHeader = req.headers.get("Authorization")!;
    const token = authHeader.replace("Bearer ", "");
    const { data } = await supabaseClient.auth.getUser(token);
    const user = data.user;
    if (!user?.id) throw new Error("User not authenticated");
    console.log('User authenticated:', { userId: user.id, phone: user.phone });

    // Get user profile to find phone number
    console.log('Looking up user profile for user:', user.id);
    const { data: profile, error: profileError } = await supabaseClient
      .from('user_profiles')
      .select('phone_number, full_name')
      .eq('auth_user_id', user.id)
      .single();

    console.log('Profile lookup result:', { profile, profileError });
    
    if (profileError) {
      console.error('Profile error:', profileError);
      throw new Error(`Profile lookup failed: ${profileError.message}`);
    }
    
    if (!profile?.phone_number) {
      console.error('No phone number in profile:', profile);
      throw new Error("User profile found but no phone number");
    }

    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", { 
      apiVersion: "2023-10-16" 
    });
    
    // Search for existing customer by phone number in metadata
    const customers = await stripe.customers.list({ 
      limit: 100 
    });
    
    let customerId;
    const existingCustomer = customers.data.find(customer => 
      customer.metadata?.phone_number === profile.phone_number ||
      customer.metadata?.user_id === user.id
    );
    
    if (existingCustomer) {
      customerId = existingCustomer.id;
    } else {
      // Create new customer with phone number as metadata
      const customer = await stripe.customers.create({
        name: profile.full_name,
        metadata: {
          phone_number: profile.phone_number,
          user_id: user.id
        }
      });
      customerId = customer.id;
    }

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: { 
              name: "Pro Subscription - Weekly",
              description: "Unlimited practice calls and premium features"
            },
            unit_amount: 400, // $4.00 in cents
            recurring: { interval: "week" },
          },
          quantity: 1,
        },
      ],
      mode: "subscription",
      ui_mode: "embedded",
      redirect_on_completion: "never",
      return_url: `${req.headers.get("origin")}/`,
    });

    return new Response(JSON.stringify({ 
      clientSecret: session.client_secret,
      publishableKey: Deno.env.get("STRIPE_PUBLISHABLE_KEY")
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error('Error in create-checkout:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});