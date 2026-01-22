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

// Generate a standardized FOIA request message
function generateFoiaMessage(data: WizardData): string {
  const formatText = data.formatPreference === "digital" 
    ? "in electronic format" 
    : data.formatPreference === "physical" 
      ? "as physical copies" 
      : "in the format most readily available";

  return `I am requesting access to records maintained by your agency concerning the subject described in this request.

Specifically, I am requesting copies of records that reasonably describe the materials identified during submission. This includes any responsive documents, electronic records, or digital media created or maintained by the agency in the course of its official business.

If the records are available electronically, I request that they be provided ${formatText}.

If any portion of the requested records is exempt from disclosure, please provide the non-exempt portions and indicate the basis for any redactions or withholdings.

If additional clarification is needed to process this request, please contact me before closing or denying the request.`;
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
    "You have the right to appeal if your request is denied or partially fulfilled"
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
    logStep("Received wizard data", { agency: wizardData.agencyName, jurisdiction: wizardData.jurisdictionType });

    // Generate the standardized message (no AI needed for the template)
    const message = generateFoiaMessage(wizardData);
    const estimatedResponseTime = getEstimatedResponseTime(wizardData.jurisdictionType);
    const tips = getTips(wizardData);

    logStep("Generated FOIA request message");

    const response = {
      message,
      estimatedResponseTime,
      tips
    };

    return new Response(
      JSON.stringify(response),
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
