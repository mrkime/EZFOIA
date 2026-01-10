import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { Resend } from "https://esm.sh/resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
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
  console.log(`[NOTIFY-STATUS-CHANGE] ${step}${detailsStr}`);
};

const getStatusLabel = (status: string): string => {
  switch (status.toLowerCase()) {
    case "pending":
      return "Pending Review";
    case "in_progress":
    case "processing":
      return "In Progress";
    case "completed":
      return "Completed";
    case "rejected":
    case "denied":
      return "Denied";
    default:
      return status;
  }
};

const getStatusColor = (status: string): string => {
  switch (status.toLowerCase()) {
    case "pending":
      return "#eab308";
    case "in_progress":
    case "processing":
      return "#3b82f6";
    case "completed":
      return "#14b8a6";
    case "rejected":
    case "denied":
      return "#ef4444";
    default:
      return "#64748b";
  }
};

const sendMessageBirdSMS = async (to: string, message: string): Promise<boolean> => {
  const apiKey = Deno.env.get("MESSAGEBIRD_API_KEY");
  
  if (!apiKey) {
    logStep("MessageBird not configured, skipping SMS");
    return false;
  }
  
  // Format phone number - ensure it has country code (digits only)
  const formattedTo = to.startsWith('+') 
    ? to.replace(/\D/g, '') 
    : `1${to.replace(/\D/g, '')}`;
  
  try {
    const response = await fetch("https://rest.messagebird.com/messages", {
      method: "POST",
      headers: {
        "Authorization": `AccessKey ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        originator: "EZFOIA",
        recipients: [formattedTo],
        body: message,
      }),
    });
    
    if (!response.ok) {
      const errorData = await response.text();
      logStep("MessageBird SMS failed", { status: response.status, error: errorData });
      return false;
    }
    
    const data = await response.json();
    logStep("MessageBird SMS sent successfully", { id: data.id });
    return true;
  } catch (error) {
    logStep("MessageBird SMS error", { error: error instanceof Error ? error.message : String(error) });
    return false;
  }
};

const handler = async (req: Request): Promise<Response> => {
  logStep("Function invoked");

  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  // Rate limiting by IP
  const clientIP = req.headers.get("x-forwarded-for") || req.headers.get("cf-connecting-ip") || "unknown";
  const rateLimitResult = checkRateLimit(`notify-status:${clientIP}`);
  
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

  try {
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    const { requestId, newStatus, oldStatus } = await req.json();

    if (!requestId || !newStatus) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    logStep("Processing status change", { requestId, oldStatus, newStatus });

    // Get the request details
    const { data: request, error: requestError } = await supabaseAdmin
      .from("foia_requests")
      .select("*")
      .eq("id", requestId)
      .single();

    if (requestError || !request) {
      logStep("Request not found", { error: requestError, requestId });
      return new Response(
        JSON.stringify({ error: "Request not found" }),
        { status: 404, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Get profile separately (no foreign key relationship)
    const { data: profile } = await supabaseAdmin
      .from("profiles")
      .select("full_name, phone, sms_notifications")
      .eq("user_id", request.user_id)
      .single();

    // Get user email from auth
    const { data: userData, error: userError } = await supabaseAdmin.auth.admin.getUserById(
      request.user_id
    );

    if (userError || !userData.user) {
      logStep("User not found", { error: userError });
      return new Response(
        JSON.stringify({ error: "User not found" }),
        { status: 404, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    const userEmail = userData.user.email;
    if (!userEmail) {
      logStep("User email not found");
      return new Response(
        JSON.stringify({ error: "User email not found" }),
        { status: 404, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    const userName = profile?.full_name || userData.user.user_metadata?.full_name || "there";
    const statusLabel = getStatusLabel(newStatus);
    const statusColor = getStatusColor(newStatus);

    logStep("Sending notifications", { email: userEmail, hasPhone: !!profile?.phone });

    // Send SMS notification if user has phone and SMS enabled
    let smsSent = false;
    if (profile?.phone && profile?.sms_notifications) {
      const smsMessage = `EZFOIA: Your FOIA request for ${request.agency_name} is now "${statusLabel}". ${
        newStatus.toLowerCase() === "completed" 
          ? "Your documents are ready for download!" 
          : "Log in to view details."
      }`;
      smsSent = await sendMessageBirdSMS(profile.phone, smsMessage);
    }

    // Send notification email
    const emailResponse = await resend.emails.send({
      from: "EZFOIA <onboarding@resend.dev>",
      to: [userEmail],
      subject: `Your FOIA Request Status: ${statusLabel} - EZFOIA`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #14b8a6 0%, #0d9488 100%); padding: 30px; border-radius: 12px 12px 0 0; text-align: center; }
            .header h1 { color: white; margin: 0; font-size: 24px; }
            .content { background: #f8fafc; padding: 30px; border: 1px solid #e2e8f0; }
            .status-badge { display: inline-block; background: ${statusColor}; color: white; padding: 8px 16px; border-radius: 20px; font-weight: 600; font-size: 14px; }
            .request-details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border: 1px solid #e2e8f0; }
            .detail-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #f1f5f9; }
            .detail-label { color: #64748b; font-size: 14px; }
            .detail-value { font-weight: 600; color: #0f172a; }
            .footer { background: #0f172a; color: #94a3b8; padding: 20px; border-radius: 0 0 12px 12px; text-align: center; font-size: 12px; }
            .cta-button { display: inline-block; background: #14b8a6; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600; margin-top: 20px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>📄 EZFOIA</h1>
            </div>
            <div class="content">
              <h2 style="margin-top: 0;">Hello ${userName}!</h2>
              <p>Your FOIA request status has been updated.</p>
              
              <div style="text-align: center; margin: 25px 0;">
                <span class="status-badge">${statusLabel}</span>
              </div>
              
              <div class="request-details">
                <h3 style="margin-top: 0; color: #0f172a;">Request Details</h3>
                <div class="detail-row">
                  <span class="detail-label">Agency</span>
                  <span class="detail-value">${request.agency_name}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Record Type</span>
                  <span class="detail-value">${request.record_type}</span>
                </div>
                <div class="detail-row" style="border-bottom: none;">
                  <span class="detail-label">Tracking ID</span>
                  <span class="detail-value">${requestId.slice(0, 8).toUpperCase()}</span>
                </div>
              </div>
              
              ${newStatus.toLowerCase() === "completed" ? `
                <div style="background: #dcfce7; border: 1px solid #86efac; border-radius: 8px; padding: 15px; margin: 20px 0;">
                  <p style="margin: 0; color: #166534;"><strong>🎉 Great news!</strong> Your requested documents are now available for download in your dashboard.</p>
                </div>
              ` : ""}
              
              ${newStatus.toLowerCase() === "rejected" || newStatus.toLowerCase() === "denied" ? `
                <div style="background: #fef2f2; border: 1px solid #fecaca; border-radius: 8px; padding: 15px; margin: 20px 0;">
                  <p style="margin: 0; color: #991b1b;"><strong>We're sorry.</strong> The agency has denied this request. Please contact our support team for assistance with next steps.</p>
                </div>
              ` : ""}
              
              <div style="text-align: center;">
                <a href="${Deno.env.get("SITE_URL") || "https://ezfoia.com"}/dashboard/request/${requestId}" class="cta-button">View Request Details</a>
              </div>
            </div>
            <div class="footer">
              <p>© 2025 EZFOIA. A ClearSightAI Company.</p>
              <p>Questions? Reply to this email or visit our help center.</p>
            </div>
          </div>
        </body>
        </html>
      `,
    });

    logStep("Notifications sent", { emailResponse, smsSent });

    return new Response(JSON.stringify({ success: true, emailResponse, smsSent }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR", { message: errorMessage });
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
};

serve(handler);
