import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Rate limiting configuration
const RATE_LIMIT_WINDOW_MS = 60000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 30;
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

const checkRateLimit = (identifier: string): { allowed: boolean; retryAfter?: number } => {
  const now = Date.now();
  const record = rateLimitMap.get(identifier);
  
  if (!record || now > record.resetTime) {
    rateLimitMap.set(identifier, { count: 1, resetTime: now + RATE_LIMIT_WINDOW_MS });
    return { allowed: true };
  }
  
  if (record.count >= MAX_REQUESTS_PER_WINDOW) {
    return { allowed: false, retryAfter: Math.ceil((record.resetTime - now) / 1000) };
  }
  
  record.count++;
  return { allowed: true };
};

const logStep = (step: string, details?: Record<string, unknown>) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[CHECK-SUBSCRIPTION] ${step}${detailsStr}`);
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  // Rate limiting by IP
  const clientIP = req.headers.get("x-forwarded-for") || req.headers.get("cf-connecting-ip") || "unknown";
  const rateLimitResult = checkRateLimit(`subscription:${clientIP}`);
  
  if (!rateLimitResult.allowed) {
    logStep("Rate limit exceeded", { clientIP });
    return new Response(
      JSON.stringify({ error: "Rate limit exceeded. Please try again later." }),
      { 
        status: 429, 
        headers: { 
          ...corsHeaders, 
          "Content-Type": "application/json",
          "Retry-After": String(rateLimitResult.retryAfter)
        } 
      }
    );
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
  const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY") ?? "";

  try {
    logStep("Function started");

    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) throw new Error("STRIPE_SECRET_KEY is not set");

    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      throw new Error("No authorization header provided");
    }

    // Create client with the user's auth header
    const supabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } },
      auth: { persistSession: false }
    });

    const token = authHeader.replace("Bearer ", "");
    const { data: claimsData, error: claimsError } = await supabaseClient.auth.getClaims(token);
    if (claimsError || !claimsData?.claims) {
      throw new Error("Authentication error: Invalid token");
    }
    
    const userId = claimsData.claims.sub;
    const email = claimsData.claims.email as string;
    if (!email) throw new Error("User email not available");
    logStep("User authenticated", { userId, email });

    const stripe = new Stripe(stripeKey, { apiVersion: "2025-08-27.basil" });
    const customers = await stripe.customers.list({ email: email, limit: 1 });

    if (customers.data.length === 0) {
      logStep("No customer found");
      return new Response(JSON.stringify({ subscribed: false }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    const customerId = customers.data[0].id;
    logStep("Found Stripe customer", { customerId });

    // Check for active subscriptions
    const subscriptions = await stripe.subscriptions.list({
      customer: customerId,
      status: "active",
      limit: 1,
    });

    const hasActiveSub = subscriptions.data.length > 0;
    let productId: string | null = null;
    let subscriptionEnd: string | null = null;
    let priceId: string | null = null;
    let paymentType: "subscription" | "one_time" | null = null;

    if (hasActiveSub) {
      const subscription = subscriptions.data[0];
      // Safely handle current_period_end
      try {
        if (subscription.current_period_end && typeof subscription.current_period_end === 'number') {
          subscriptionEnd = new Date(subscription.current_period_end * 1000).toISOString();
        }
      } catch (dateError) {
        logStep("Error parsing subscription end date", { error: String(dateError) });
      }
      productId = subscription.items.data[0]?.price?.product as string || null;
      priceId = subscription.items.data[0]?.price?.id || null;
      paymentType = "subscription";
      logStep("Active subscription found", { subscriptionId: subscription.id, productId, priceId, subscriptionEnd });
    } else {
      // Check for completed one-time payments
      logStep("Checking for one-time payments");
      const sessions = await stripe.checkout.sessions.list({
        customer: customerId,
        status: "complete",
        limit: 10,
      });
      
      const paidSession = sessions.data.find((s: Stripe.Checkout.Session) => s.payment_status === "paid" && s.mode === "payment");
      if (paidSession) {
        paymentType = "one_time";
        // Get the price/product from the session line items
        if (paidSession.line_items?.data?.[0]) {
          priceId = paidSession.line_items.data[0].price?.id || null;
          productId = paidSession.line_items.data[0].price?.product as string || null;
        }
        logStep("One-time payment found", { sessionId: paidSession.id, productId, priceId });
      } else {
        logStep("No active subscription or one-time payment found");
      }
    }

    return new Response(JSON.stringify({
      subscribed: hasActiveSub || paymentType === "one_time",
      product_id: productId,
      price_id: priceId,
      subscription_end: subscriptionEnd,
      payment_type: paymentType
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR", { message: errorMessage });
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
