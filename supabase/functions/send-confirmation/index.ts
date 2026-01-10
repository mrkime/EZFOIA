import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface EmailRequest {
  to: string;
  name: string;
  agencyName: string;
  recordType: string;
  requestId: string;
}

const handler = async (req: Request): Promise<Response> => {
  console.log("send-confirmation function invoked");

  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { to, name, agencyName, recordType, requestId }: EmailRequest = await req.json();
    
    console.log(`Sending confirmation email to ${to} for request ${requestId}`);

    const emailResponse = await resend.emails.send({
      from: "EZFOIA <onboarding@resend.dev>",
      to: [to],
      subject: "Your FOIA Request Has Been Submitted - EZFOIA",
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
            .request-details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border: 1px solid #e2e8f0; }
            .detail-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #f1f5f9; }
            .detail-label { color: #64748b; font-size: 14px; }
            .detail-value { font-weight: 600; color: #0f172a; }
            .tracking-id { background: #14b8a6; color: white; padding: 15px; border-radius: 8px; text-align: center; margin: 20px 0; }
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
              <h2 style="margin-top: 0;">Hello ${name}!</h2>
              <p>Great news! Your FOIA request has been successfully submitted. Our team will begin processing it right away.</p>
              
              <div class="tracking-id">
                <p style="margin: 0; font-size: 12px; opacity: 0.8;">TRACKING ID</p>
                <p style="margin: 5px 0 0 0; font-size: 18px; font-weight: bold;">${requestId.slice(0, 8).toUpperCase()}</p>
              </div>
              
              <div class="request-details">
                <h3 style="margin-top: 0; color: #0f172a;">Request Details</h3>
                <div class="detail-row">
                  <span class="detail-label">Agency</span>
                  <span class="detail-value">${agencyName}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Record Type</span>
                  <span class="detail-value">${recordType}</span>
                </div>
                <div class="detail-row" style="border-bottom: none;">
                  <span class="detail-label">Status</span>
                  <span class="detail-value" style="color: #14b8a6;">Pending</span>
                </div>
              </div>
              
              <h3>What happens next?</h3>
              <ol style="color: #475569;">
                <li>Our team reviews your request for completeness</li>
                <li>We file the official FOIA request with the agency</li>
                <li>You'll receive SMS updates as your request progresses</li>
                <li>Once approved, our AI will help you search through your documents</li>
              </ol>
              
              <p style="color: #64748b; font-size: 14px;">
                <strong>Cost:</strong> $75 flat rate per request. Any filing fees charged by the agency will be billed separately at cost.
              </p>
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

    return new Response(JSON.stringify(emailResponse), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: any) {
    console.error("Error in send-confirmation function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
