import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: Record<string, unknown>) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : "";
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

const SYSTEM_PROMPT = `You are an expert FOIA (Freedom of Information Act) request specialist. Your task is to generate a clear, professional records request message for electronic form submission.

CRITICAL RULES - FOLLOW THESE EXACTLY:
1. ONLY use information explicitly provided by the user - NEVER invent, assume, or hallucinate ANY details
2. DO NOT include any placeholders like [YOUR NAME], [YOUR ADDRESS], [DATE], [AGENCY NAME], etc.
3. DO NOT format as a letter - no salutations ("Dear...", "To Whom..."), no signatures, no closings
4. DO NOT make up names, dates, case numbers, addresses, or any specifics not provided
5. Write in first person as a direct request suitable for pasting into an online form
6. Be specific about what records are being requested based on the user's description
7. Include timeframe information ONLY if the user provided it
8. Include identifiers (names, case numbers, addresses) ONLY if the user provided them
9. Use the EXACT agency name provided - never say "the agency" or "your agency", use the actual name

EXAMPLE OUTPUT FORMAT (adapt based on user input, replace AGENCY_NAME with actual agency):
---
I am requesting access to records maintained by the [AGENCY NAME] pursuant to the Freedom of Information Act, concerning case number [CASE NUMBER (only if provided)], limited to [OR UNLIMITED TO (only if needed)] records directly related to [CONTEXT (only if needed)].
Specifically, I am requesting copies of records related to the following:

Subject or Reference: [SUBJECT / DESCRIPTION]
Case, File, or Reference Number (if applicable): [CASE / FILE NUMBER]
Relevant Date(s) or Date Range (if known): [DATE OR DATE RANGE]

This request includes (“any responsive records in the possession, custody, or control of the [AGENCY NAME], including but not limited to documents, reports, correspondence, emails, electronic records, databases, photographs, audio recordings, video recordings, or other digital media.” default response)
[CONTEXT (for the context read the users input and structure the response accordingly. Dont just copy what they said, read and think about it and structure it with the proper FOIA language. User reponse)].
This request is intended to be reasonably limited in scope and is not a request for all records held by the agency, only those records reasonably related to the [(subject described by the user above)].

I request that the records be provided in electronic format if available. If records can only be provided in physical form, please advise and provide a written fee estimate prior to processing.
Please do not incur costs exceeding $100 without my approval. If any portion of the requested records is exempt from disclosure, please provide all reasonably segregable, non-exempt portions of the records and cite the specific legal basis for any redactions or withholdings.

If additional clarification is required to process this request, please contact me prior to closing or denying the request.
---

Generate a request following this format, customized to the specific records the user described. Output ONLY the request message text, no JSON, no markdown formatting.`;

function buildUserPrompt(data: WizardData): string {
  const parts: string[] = [];

  parts.push(`Generate a FOIA request message based on the following user input:`);
  parts.push(``);
  parts.push(`AGENCY NAME: ${data.agencyName}`);
  parts.push(`RECORDS REQUESTED: ${data.recordsDescription}`);
  parts.push(
    `FORMAT PREFERENCE: ${data.formatPreference === "digital" ? "electronic format" : data.formatPreference === "physical" ? "physical copies" : "whatever format is most convenient"}`,
  );

  if (data.dateType === "exact" && data.exactDate) {
    parts.push(`TIMEFRAME: Specific date - ${data.exactDate}`);
  } else if (data.dateType === "range" && (data.dateRangeStart || data.dateRangeEnd)) {
    parts.push(`TIMEFRAME: ${data.dateRangeStart || "earliest available"} to ${data.dateRangeEnd || "present"}`);
  }

  if (data.relatedNames) {
    parts.push(`RELATED NAMES/ORGANIZATIONS: ${data.relatedNames}`);
  }
  if (data.caseNumber) {
    parts.push(`CASE/REFERENCE NUMBER: ${data.caseNumber}`);
  }
  if (data.relatedAddress) {
    parts.push(`RELATED ADDRESS: ${data.relatedAddress}`);
  }
  if (data.additionalContext) {
    parts.push(`ADDITIONAL CONTEXT: ${data.additionalContext}`);
  }

  parts.push(``);
  parts.push(`Remember: Output ONLY the request message. No placeholders, no letter formatting, no made-up details.`);

  return parts.join("\n");
}

function getEstimatedResponseTime(jurisdictionType: string): string {
  switch (jurisdictionType) {
    case "federal":
      return "20-30 business days";
    case "state":
      return "10-15 business days";
    case "local":
      return "7-14 business days";
    default:
      return "10-20 business days";
  }
}

function getTips(data: WizardData): string[] {
  const tips: string[] = [
    "Keep a copy of this request for your records",
    "You have the right to appeal if your request is denied or partially fulfilled",
  ];

  if (data.jurisdictionType === "federal") {
    tips.push("Federal agencies must respond within 20 working days under FOIA");
  } else {
    tips.push("Response times vary by state - check your state's open records law for specifics");
  }

  return tips;
}

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

    logStep("Received wizard data", {
      agency: wizardData.agencyName,
      jurisdiction: wizardData.jurisdictionType,
      records: wizardData.recordsDescription?.substring(0, 50),
    });

    const userPrompt = buildUserPrompt(wizardData);
    logStep("Built prompt", { length: userPrompt.length });

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
        temperature: 0.3, // Lower temperature for more consistent, factual output
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        logStep("Rate limited");
        return new Response(JSON.stringify({ error: "Service is busy. Please try again in a moment." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        logStep("Quota exceeded");
        return new Response(JSON.stringify({ error: "Service temporarily unavailable. Please try again later." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const errorText = await response.text();
      logStep("AI error", { status: response.status, error: errorText });
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const aiResponse = await response.json();
    const message = aiResponse.choices?.[0]?.message?.content?.trim();

    if (!message) {
      throw new Error("No content in AI response");
    }

    logStep("Generated message", { length: message.length });

    const result = {
      message,
      estimatedResponseTime: getEstimatedResponseTime(wizardData.jurisdictionType),
      tips: getTips(wizardData),
    };

    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR", { message: errorMessage });
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
