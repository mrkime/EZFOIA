import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { Resend } from "https://esm.sh/resend@2.0.0";
import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

// Rate limiting configuration
const RATE_LIMIT_WINDOW_MS = 60000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 10;
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
  console.log(`[SEND-CONFIRMATION] ${step}${detailsStr}`);
};

// Input validation schema
const emailRequestSchema = z.object({
  to: z.string().email("Invalid email format").max(255, "Email too long"),
  name: z.string().trim().min(1, "Name is required").max(200, "Name too long"),
  agencyName: z.string().trim().min(1, "Agency name is required").max(200, "Agency name too long"),
  recordType: z.string().trim().min(1, "Record type is required").max(100, "Record type too long"),
  requestId: z.string().uuid("Invalid request ID format"),
});

const handler = async (req: Request): Promise<Response> => {
  logStep("Function invoked");

  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  // Rate limiting by IP
  const clientIP = req.headers.get("x-forwarded-for") || req.headers.get("cf-connecting-ip") || "unknown";
  const rateLimitResult = checkRateLimit(`confirmation:${clientIP}`);
  
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
    // 1. Check for authentication
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      logStep("No authorization header");
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        {
          status: 401,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    // 2. Create authenticated Supabase client
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      { global: { headers: { Authorization: authHeader } } }
    );

    // 3. Verify the user is authenticated using getClaims for better reliability
    const token = authHeader.replace("Bearer ", "");
    const { data: claimsData, error: claimsError } = await supabaseClient.auth.getClaims(token);
    
    if (claimsError || !claimsData?.claims) {
      logStep("User authentication failed", { error: claimsError });
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        {
          status: 401,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    const userId = claimsData.claims.sub as string;
    const userEmail = claimsData.claims.email as string;
    logStep("User authenticated", { userId, email: userEmail });

    // 4. Parse and validate input
    const rawBody = await req.json();
    const validationResult = emailRequestSchema.safeParse(rawBody);
    
    if (!validationResult.success) {
      logStep("Validation failed", { errors: validationResult.error.errors });
      return new Response(
        JSON.stringify({ 
          error: "Invalid input", 
          details: validationResult.error.errors.map(e => e.message) 
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    const { to, name, agencyName, recordType, requestId } = validationResult.data;

    // 5. Verify the request belongs to the authenticated user
    const { data: request, error: requestError } = await supabaseClient
      .from("foia_requests")
      .select("id, user_id")
      .eq("id", requestId)
      .single();

    if (requestError || !request) {
      logStep("Request not found", { requestId });
      return new Response(
        JSON.stringify({ error: "Request not found" }),
        {
          status: 404,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    if (request.user_id !== userId) {
      logStep("User does not own request", { userId, requestUserId: request.user_id });
      return new Response(
        JSON.stringify({ error: "Forbidden" }),
        {
          status: 403,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    logStep("Sending confirmation email", { to, requestId });

    // 6. Send the email
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

    logStep("Email sent successfully");

    return new Response(JSON.stringify(emailResponse), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR", { message: errorMessage });
    return new Response(
      JSON.stringify({ error: errorMessage }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
