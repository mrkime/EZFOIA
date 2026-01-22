import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: Record<string, unknown>) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[ANALYZE-DOC] ${step}${detailsStr}`);
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep("Function started");
    
    const authHeader = req.headers.get("authorization");
    if (!authHeader) {
      throw new Error("No authorization header");
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Verify user from JWT
    const token = authHeader.replace("Bearer ", "");
    const { data: { user }, error: userError } = await supabase.auth.getUser(token);
    
    if (userError || !user) {
      throw new Error("Invalid user token");
    }

    const { documentId, action, query } = await req.json();
    logStep("Request received", { documentId, action, userId: user.id });

    // Fetch document metadata
    const { data: doc, error: docError } = await supabase
      .from("foia_documents")
      .select("*, foia_requests!inner(user_id)")
      .eq("id", documentId)
      .single();

    if (docError || !doc) {
      throw new Error("Document not found");
    }

    // Verify ownership
    if (doc.foia_requests.user_id !== user.id) {
      throw new Error("Access denied");
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    // Download document content
    const { data: fileData, error: downloadError } = await supabase.storage
      .from("foia-documents")
      .download(doc.file_path);

    if (downloadError) {
      throw new Error(`Failed to download document: ${downloadError.message}`);
    }

    // Extract text based on mime type
    let extractedText = "";
    const mimeType = doc.mime_type || "application/octet-stream";
    
    if (mimeType.includes("text") || mimeType.includes("json")) {
      extractedText = await fileData.text();
    } else if (mimeType.includes("pdf")) {
      // For PDFs, we'll send a message to AI asking it to describe based on the filename and context
      // In production, you'd use a PDF parsing library
      extractedText = `[PDF Document: ${doc.file_name}]`;
    } else {
      extractedText = `[Binary Document: ${doc.file_name}, Type: ${mimeType}]`;
    }

    logStep("Text extracted", { length: extractedText.length, mimeType });

    if (action === "summarize") {
      // Check if we already have a summary
      if (doc.ai_summary && doc.ai_summary_generated_at) {
        return new Response(
          JSON.stringify({ summary: doc.ai_summary, cached: true }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-3-flash-preview",
          messages: [
            {
              role: "system",
              content: `You are a document analyst specializing in FOIA (Freedom of Information Act) documents. 
              Analyze the provided document and create a concise summary that highlights:
              1. Main subject/topic of the document
              2. Key findings or information revealed
              3. Any notable dates, names, or organizations mentioned
              4. Document type (memo, report, correspondence, etc.)
              Keep the summary under 200 words and make it accessible to general readers.`
            },
            {
              role: "user",
              content: `Please summarize this FOIA document:\n\nFilename: ${doc.file_name}\nType: ${mimeType}\n\nContent:\n${extractedText.substring(0, 10000)}`
            }
          ],
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        logStep("AI error", { status: response.status, error: errorText });
        throw new Error("Failed to generate summary");
      }

      const aiData = await response.json();
      const summary = aiData.choices?.[0]?.message?.content || "Unable to generate summary";

      // Store the summary
      await supabase
        .from("foia_documents")
        .update({
          ai_summary: summary,
          ai_summary_generated_at: new Date().toISOString(),
          extracted_text: extractedText.substring(0, 50000),
        })
        .eq("id", documentId);

      logStep("Summary generated and stored");

      return new Response(
        JSON.stringify({ summary, cached: false }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );

    } else if (action === "search") {
      if (!query) {
        throw new Error("Search query required");
      }

      const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-3-flash-preview",
          messages: [
            {
              role: "system",
              content: `You are a document search assistant. The user will ask questions about a FOIA document. 
              Answer their question based on the document content provided. 
              Be specific and cite relevant parts of the document when possible.
              If the information isn't in the document, say so clearly.`
            },
            {
              role: "user",
              content: `Document: ${doc.file_name}\nType: ${mimeType}\n\nContent:\n${extractedText.substring(0, 10000)}\n\n---\n\nUser question: ${query}`
            }
          ],
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to search document");
      }

      const aiData = await response.json();
      const answer = aiData.choices?.[0]?.message?.content || "Unable to find relevant information";

      return new Response(
        JSON.stringify({ answer }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    throw new Error("Invalid action");

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    logStep("Error", { message: errorMessage });
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
