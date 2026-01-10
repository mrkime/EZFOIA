import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

function logStep(message: string, data?: unknown) {
  console.info(`[TWILIO-MESSAGE-STATUS] ${message}${data ? ` - ${JSON.stringify(data)}` : ""}`);
}

function maskPhone(value: string | null | undefined) {
  if (!value) return value;
  const digits = value.replace(/\D/g, "");
  if (digits.length < 4) return "***";
  return `***${digits.slice(-4)}`;
}

serve(async (req: Request) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const accountSid = Deno.env.get("TWILIO_ACCOUNT_SID");
    const authToken = Deno.env.get("TWILIO_AUTH_TOKEN");
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY");
    const supabaseServiceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!accountSid || !authToken) {
      logStep("Missing Twilio secrets");
      return new Response(JSON.stringify({ error: "Twilio is not configured" }), {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    if (!supabaseUrl || !supabaseAnonKey || !supabaseServiceRoleKey) {
      logStep("Missing backend secrets");
      return new Response(JSON.stringify({ error: "Backend is not configured" }), {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Missing Authorization header" }), {
        status: 401,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    // Identify caller
    const supabaseUserClient = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } },
    });

    const { data: userData, error: userError } = await supabaseUserClient.auth.getUser();
    if (userError || !userData?.user) {
      logStep("Auth failed", { userError });
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    // Restrict to admins
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey);
    const { data: isAdmin, error: roleError } = await supabaseAdmin.rpc("has_role", {
      _user_id: userData.user.id,
      _role: "admin",
    });

    if (roleError) {
      logStep("Role check failed", { roleError });
      return new Response(JSON.stringify({ error: "Role check failed" }), {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    if (!isAdmin) {
      return new Response(JSON.stringify({ error: "Forbidden" }), {
        status: 403,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    const { messageSid } = (await req.json().catch(() => ({}))) as { messageSid?: string };

    if (!messageSid || typeof messageSid !== "string") {
      return new Response(JSON.stringify({ error: "messageSid is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    logStep("Fetching Twilio message", { messageSid });

    const url = `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages/${messageSid}.json`;
    const basicAuth = btoa(`${accountSid}:${authToken}`);

    const twilioRes = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Basic ${basicAuth}`,
      },
    });

    const twilioBodyText = await twilioRes.text();

    if (!twilioRes.ok) {
      logStep("Twilio fetch failed", { status: twilioRes.status, body: twilioBodyText });
      return new Response(
        JSON.stringify({ error: "Twilio request failed", status: twilioRes.status, body: twilioBodyText }),
        { status: 502, headers: { "Content-Type": "application/json", ...corsHeaders } },
      );
    }

    const twilioMsg = JSON.parse(twilioBodyText) as Record<string, unknown>;

    // Return a trimmed response to avoid leaking unnecessary data
    const response = {
      sid: twilioMsg.sid,
      status: twilioMsg.status,
      error_code: twilioMsg.error_code,
      error_message: twilioMsg.error_message,
      to: maskPhone(twilioMsg.to as string | undefined),
      from: maskPhone(twilioMsg.from as string | undefined),
      date_created: twilioMsg.date_created,
      date_updated: twilioMsg.date_updated,
    };

    logStep("Twilio message fetched", response);

    return new Response(JSON.stringify(response), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: unknown) {
    logStep("Unhandled error", { error: String(error) });
    return new Response(JSON.stringify({ error: "Internal error" }), {
      status: 500,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  }
});
