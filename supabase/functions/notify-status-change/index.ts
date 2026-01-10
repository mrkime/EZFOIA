import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { Resend } from "https://esm.sh/resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
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

const handler = async (req: Request): Promise<Response> => {
  console.log("notify-status-change function invoked");

  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
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

    // Get the request details
    const { data: request, error: requestError } = await supabaseAdmin
      .from("foia_requests")
      .select("*, profiles:user_id(full_name)")
      .eq("id", requestId)
      .single();

    if (requestError || !request) {
      console.error("Request not found:", requestError);
      return new Response(
        JSON.stringify({ error: "Request not found" }),
        { status: 404, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Get user email from auth
    const { data: userData, error: userError } = await supabaseAdmin.auth.admin.getUserById(
      request.user_id
    );

    if (userError || !userData.user) {
      console.error("User not found:", userError);
      return new Response(
        JSON.stringify({ error: "User not found" }),
        { status: 404, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    const userEmail = userData.user.email;
    if (!userEmail) {
      console.error("User email not found");
      return new Response(
        JSON.stringify({ error: "User email not found" }),
        { status: 404, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    const userName = request.profiles?.full_name || userData.user.user_metadata?.full_name || "there";
    const statusLabel = getStatusLabel(newStatus);
    const statusColor = getStatusColor(newStatus);

    console.log(`Sending status update email to ${userEmail} for request ${requestId}`);

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

    console.log("Email sent successfully:", emailResponse);

    return new Response(JSON.stringify({ success: true, emailResponse }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: any) {
    console.error("Error in notify-status-change function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
};

serve(handler);
