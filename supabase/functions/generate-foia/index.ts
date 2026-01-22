import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: Record<string, unknown>) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[GENERATE-FOIA] ${step}${detailsStr}`);
};

interface WizardData {
  agencyName: string;
  agencyCity?: string;
  agencyState?: string;
  jurisdictionType: string;
  recordsDescription: string;
  dateType: string;
  exactDate?: string;
  dateRangeStart?: string;
  dateRangeEnd?: string;
  relatedNames?: string;
  caseNumber?: string;
  relatedAddress?: string;
  formatPreference: string;
  additionalContext?: string;
}

const SYSTEM_PROMPT = `You are an expert FOIA (Freedom of Information Act) request drafter. Your task is to generate a professional, legally-compliant FOIA request letter based on the information provided.

Guidelines:
1. Use formal, professional language
2. Include all required legal elements for a valid FOIA request
3. Reference applicable statutes (5 U.S.C. § 552 for federal, or state-specific laws)
4. Be specific but not overly narrow to avoid missing relevant records
5. Include a fee waiver request when appropriate (for journalists, researchers, or public interest)
6. Request expedited processing if the context suggests urgency
7. Specify the preferred format for receiving records
8. Include contact information placeholders for the requester
9. Set reasonable response expectations based on the agency type

Output format: Return a JSON object with the following structure:
{
  "letter": "The complete FOIA request letter as a string",
  "estimatedResponseTime": "Estimated response timeframe (e.g., '20-30 business days')",
  "tips": ["Array of 2-4 helpful tips for this specific request"]
}`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep("Function started");
    
    const wizardData: WizardData = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    // Build the prompt from wizard data
    const userPrompt = buildUserPrompt(wizardData);
    logStep("Built user prompt", { length: userPrompt.length });

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: userPrompt },
        ],
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        logStep("AI gateway rate limit");
        return new Response(
          JSON.stringify({ error: "Service is busy. Please try again in a moment." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        logStep("AI gateway quota exceeded");
        return new Response(
          JSON.stringify({ error: "Service temporarily unavailable. Please try again later." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const errorText = await response.text();
      logStep("AI gateway error", { status: response.status, error: errorText });
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const aiResponse = await response.json();
    const content = aiResponse.choices?.[0]?.message?.content;
    
    if (!content) {
      throw new Error("No content in AI response");
    }

    logStep("Received AI response", { length: content.length });

    // Parse the JSON response from the AI
    let parsedResponse;
    try {
      // Extract JSON from the response (handle markdown code blocks)
      const jsonMatch = content.match(/```json\s*([\s\S]*?)\s*```/) || 
                        content.match(/```\s*([\s\S]*?)\s*```/) ||
                        [null, content];
      const jsonStr = jsonMatch[1] || content;
      parsedResponse = JSON.parse(jsonStr.trim());
    } catch (parseError) {
      logStep("Failed to parse AI response as JSON, using fallback");
      // Fallback: use the content as the letter directly
      parsedResponse = {
        letter: content,
        estimatedResponseTime: wizardData.jurisdictionType === "federal" ? "20-30 business days" : "10-20 business days",
        tips: [
          "Keep a copy of this request for your records",
          "You can appeal if your request is denied",
          "Fees may apply for extensive searches or large document volumes"
        ]
      };
    }

    logStep("Successfully generated FOIA request");

    return new Response(
      JSON.stringify(parsedResponse),
      { 
        status: 200, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR", { message: errorMessage });
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

function buildUserPrompt(data: WizardData): string {
  const parts: string[] = [];
  
  parts.push(`Generate a FOIA request letter for the following:`);
  parts.push(``);
  parts.push(`AGENCY INFORMATION:`);
  parts.push(`- Agency Name: ${data.agencyName}`);
  parts.push(`- Jurisdiction: ${data.jurisdictionType}`);
  if (data.agencyState) parts.push(`- State: ${data.agencyState}`);
  if (data.agencyCity) parts.push(`- City/County: ${data.agencyCity}`);
  parts.push(``);
  
  parts.push(`RECORDS REQUESTED:`);
  parts.push(data.recordsDescription);
  parts.push(``);
  
  parts.push(`TIMEFRAME:`);
  if (data.dateType === "exact" && data.exactDate) {
    parts.push(`- Specific date: ${data.exactDate}`);
  } else if (data.dateType === "range" && (data.dateRangeStart || data.dateRangeEnd)) {
    parts.push(`- Date range: ${data.dateRangeStart || "earliest"} to ${data.dateRangeEnd || "present"}`);
  } else {
    parts.push(`- No specific timeframe provided (request all available records)`);
  }
  parts.push(``);
  
  if (data.relatedNames || data.caseNumber || data.relatedAddress) {
    parts.push(`RELATED IDENTIFIERS:`);
    if (data.relatedNames) parts.push(`- Names/Organizations: ${data.relatedNames}`);
    if (data.caseNumber) parts.push(`- Case/Reference Number: ${data.caseNumber}`);
    if (data.relatedAddress) parts.push(`- Related Address: ${data.relatedAddress}`);
    parts.push(``);
  }
  
  parts.push(`FORMAT PREFERENCE:`);
  const formatMap: Record<string, string> = {
    digital: "Electronic/digital format (PDF, email)",
    physical: "Physical printed copies",
    easiest: "Whatever format is most convenient for the agency"
  };
  parts.push(`- ${formatMap[data.formatPreference] || data.formatPreference}`);
  parts.push(``);
  
  if (data.additionalContext) {
    parts.push(`ADDITIONAL CONTEXT:`);
    parts.push(data.additionalContext);
    parts.push(``);
  }
  
  parts.push(`Please generate a complete, professional FOIA request letter that includes:`);
  parts.push(`1. Proper legal citations for the ${data.jurisdictionType} jurisdiction`);
  parts.push(`2. Clear description of requested records`);
  parts.push(`3. Format preference`);
  parts.push(`4. Fee waiver request if appropriate`);
  parts.push(`5. Contact information placeholders [YOUR NAME], [YOUR ADDRESS], [YOUR EMAIL], [YOUR PHONE]`);
  parts.push(`6. Professional closing`);
  
  return parts.join("\n");
}
