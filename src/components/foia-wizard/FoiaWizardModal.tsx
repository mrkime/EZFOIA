import { useState, useEffect, useCallback } from "react";
import { AnimatePresence } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { logger } from "@/lib/logger";
import { matchesPlan } from "@/lib/stripe-config";
import { TEST_SUBSCRIPTION_KEY } from "@/components/admin/AdminSettings";
import { PENDING_REQUEST_KEY } from "@/components/RequestFormModal";

import { WizardProgress } from "./WizardProgress";
import {
  WizardState,
  WizardStep,
  GeneratedRequest,
  initialWizardState,
} from "./types";
import {
  AgencyStep,
  RecordsStep,
  TimeframeStep,
  IdentifiersStep,
  FormatStep,
  ContextStep,
  GeneratingStep,
  PreviewStep,
  AuthStep,
  PlanSelectionStep,
  SuccessStep,
} from "./steps";

interface FoiaWizardModalProps {
  children: React.ReactNode;
}

interface SubscriptionData {
  subscribed: boolean;
  product_id: string | null;
}

const getRequestLimit = (productId: string | null): number => {
  if (!productId) return 0;
  if (matchesPlan(productId, "single")) return 1;
  if (matchesPlan(productId, "professional")) return 5;
  if (matchesPlan(productId, "enterprise")) return -1;
  return 0;
};

export const FoiaWizardModal = ({ children }: FoiaWizardModalProps) => {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<WizardStep>("agency");
  const [wizardData, setWizardData] = useState<WizardState>(initialWizardState);
  const [completedSteps, setCompletedSteps] = useState<WizardStep[]>([]);
  const [generatedRequest, setGeneratedRequest] = useState<GeneratedRequest | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [subscription, setSubscription] = useState<SubscriptionData | null>(null);
  const [requestCount, setRequestCount] = useState<number | null>(null);

  const { toast } = useToast();
  const { user } = useAuth();

  // Check subscription when user becomes available
  useEffect(() => {
    if (user && open) {
      checkSubscription();
    }
  }, [user, open]);

  const checkSubscription = async () => {
    if (!user) return;
    
    try {
      // Check for admin test subscription first
      const testSubscription = localStorage.getItem(TEST_SUBSCRIPTION_KEY);
      if (testSubscription) {
        try {
          const parsed = JSON.parse(testSubscription);
          if (parsed.product_id) {
            setSubscription({ subscribed: true, product_id: parsed.product_id });
            const { count } = await supabase
              .from("foia_requests")
              .select("*", { count: "exact", head: true })
              .eq("user_id", user.id);
            setRequestCount(count || 0);
            return;
          }
        } catch {
          localStorage.removeItem(TEST_SUBSCRIPTION_KEY);
        }
      }

      const { data: subData, error: subError } = await supabase.functions.invoke("check-subscription");
      if (subError) throw subError;
      setSubscription(subData);

      const { count } = await supabase
        .from("foia_requests")
        .select("*", { count: "exact", head: true })
        .eq("user_id", user.id);
      setRequestCount(count || 0);
    } catch (error) {
      logger.error("Error checking subscription:", error);
      setSubscription({ subscribed: false, product_id: null });
      setRequestCount(0);
    }
  };

  // Check if user can submit for free (first request) or has active subscription
  const canSubmitFree = (): boolean => {
    // First request is always free
    if (requestCount === 0) return true;
    
    // Has active subscription with remaining requests
    if (subscription?.subscribed) {
      const limit = getRequestLimit(subscription.product_id);
      if (limit === -1) return true; // Unlimited
      return requestCount !== null && requestCount < limit;
    }
    
    return false;
  };

  const updateWizardData = useCallback((updates: Partial<WizardState>) => {
    setWizardData(prev => ({ ...prev, ...updates }));
  }, []);

  const goToStep = (nextStep: WizardStep) => {
    // Track completed steps
    if (!completedSteps.includes(step) && step !== "generating" && step !== "preview" && step !== "auth") {
      setCompletedSteps(prev => [...prev, step]);
    }
    setStep(nextStep);
  };

  const handleGenerate = async () => {
    setStep("generating");

    try {
      const { data, error } = await supabase.functions.invoke("generate-foia", {
        body: wizardData,
      });

      if (error) throw error;

      setGeneratedRequest(data);
      
      // Add a slight delay for the animation effect
      setTimeout(() => {
        setStep("preview");
      }, 2000);
    } catch (error) {
      logger.error("Error generating FOIA request:", error);
      toast({
        title: "Generation Failed",
        description: "Failed to generate your request. Please try again.",
        variant: "destructive",
      });
      setStep("context"); // Go back to last step
    }
  };

  const handlePreviewSubmit = async () => {
    // If user is not authenticated, go to auth step
    if (!user) {
      setStep("auth");
      return;
    }

    // Check subscription status and submit accordingly
    await handleFinalSubmit();
  };

  const handleAuthSuccess = async () => {
    // User just authenticated, check their subscription/request count
    await checkSubscription();
    // Small delay to let state update
    setTimeout(() => {
      handleFinalSubmit();
    }, 500);
  };

  const handleFinalSubmit = async () => {
    if (!user) {
      toast({
        title: "Please sign in",
        description: "You need to be signed in to submit a FOIA request.",
        variant: "destructive",
      });
      setStep("auth");
      return;
    }

    // Re-check subscription before submitting
    await checkSubscription();

    // Check if user can submit (first request free or has subscription)
    if (!canSubmitFree()) {
      // Store the data for after payment
      const requestData = {
        agencyName: wizardData.agencyName,
        agencyType: wizardData.jurisdictionType,
        recordType: "other",
        recordDescription: generatedRequest?.message || wizardData.recordsDescription,
      };
      localStorage.setItem(PENDING_REQUEST_KEY, JSON.stringify(requestData));
      setStep("plan-selection");
      return;
    }

    // Submit directly (first request free or has subscription)
    setIsSubmitting(true);
    try {
      const { data: requestData, error: insertError } = await supabase
        .from("foia_requests")
        .insert({
          user_id: user.id,
          agency_name: wizardData.agencyName,
          agency_type: wizardData.jurisdictionType,
          record_type: "other",
          record_description: generatedRequest?.message || wizardData.recordsDescription,
        })
        .select()
        .single();

      if (insertError) throw insertError;

      // Send confirmation email
      await supabase.functions.invoke("send-confirmation", {
        body: {
          to: user.email,
          name: user.user_metadata?.full_name || "Valued Customer",
          agencyName: wizardData.agencyName,
          recordType: "FOIA Request",
          requestId: requestData.id,
        },
      }).catch((err) => logger.error("Email send error:", err));

      setStep("success");
      
      const isFirstRequest = requestCount === 0;
      toast({
        title: "Request Submitted!",
        description: isFirstRequest 
          ? "Your first free request has been submitted. Check your email for confirmation."
          : "Check your email for confirmation details.",
      });
    } catch (error) {
      logger.error("Error submitting request:", error);
      toast({
        title: "Submission Failed",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleMessageChange = (message: string) => {
    if (generatedRequest) {
      setGeneratedRequest({ ...generatedRequest, message });
    }
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!isSubmitting) {
      setOpen(newOpen);
      if (!newOpen) {
        // Reset wizard state when closing
        setTimeout(() => {
          setStep("agency");
          setWizardData(initialWizardState);
          setCompletedSteps([]);
          setGeneratedRequest(null);
          setRequestCount(null);
        }, 300);
      }
    }
  };

  // Check if we should show the progress bar
  const showProgress = !["generating", "preview", "auth", "plan-selection", "success"].includes(step);

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="w-screen h-screen max-w-none max-h-none m-0 p-0 rounded-none border-0 bg-background flex flex-col">
        {/* Main Content Area */}
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-2xl mx-auto px-6 py-12 md:py-16">
            {/* Step Content */}
            <AnimatePresence mode="wait">
              {step === "agency" && (
                <AgencyStep
                  key="agency"
                  data={wizardData}
                  onUpdate={updateWizardData}
                  onNext={() => goToStep("records")}
                />
              )}

              {step === "records" && (
                <RecordsStep
                  key="records"
                  data={wizardData}
                  onUpdate={updateWizardData}
                  onNext={() => goToStep("timeframe")}
                  onBack={() => goToStep("agency")}
                />
              )}

              {step === "timeframe" && (
                <TimeframeStep
                  key="timeframe"
                  data={wizardData}
                  onUpdate={updateWizardData}
                  onNext={() => goToStep("identifiers")}
                  onBack={() => goToStep("records")}
                />
              )}

              {step === "identifiers" && (
                <IdentifiersStep
                  key="identifiers"
                  data={wizardData}
                  onUpdate={updateWizardData}
                  onNext={() => goToStep("format")}
                  onBack={() => goToStep("timeframe")}
                />
              )}

              {step === "format" && (
                <FormatStep
                  key="format"
                  data={wizardData}
                  onUpdate={updateWizardData}
                  onNext={() => goToStep("context")}
                  onBack={() => goToStep("identifiers")}
                />
              )}

              {step === "context" && (
                <ContextStep
                  key="context"
                  data={wizardData}
                  onUpdate={updateWizardData}
                  onGenerate={handleGenerate}
                  onBack={() => goToStep("format")}
                />
              )}

              {step === "generating" && (
                <GeneratingStep key="generating" />
              )}

              {step === "preview" && generatedRequest && (
                <PreviewStep
                  key="preview"
                  generatedRequest={generatedRequest}
                  onMessageChange={handleMessageChange}
                  onSubmit={handlePreviewSubmit}
                  onBack={() => goToStep("context")}
                  isSubmitting={isSubmitting}
                  isFirstRequest={!user || requestCount === 0}
                />
              )}

              {step === "auth" && (
                <AuthStep
                  key="auth"
                  onSuccess={handleAuthSuccess}
                  onBack={() => goToStep("preview")}
                />
              )}

              {step === "plan-selection" && (
                <PlanSelectionStep
                  key="plan-selection"
                  onBack={() => goToStep("preview")}
                  onClose={() => setOpen(false)}
                />
              )}

              {step === "success" && (
                <SuccessStep
                  key="success"
                  onClose={() => handleOpenChange(false)}
                />
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Bottom Progress Bar */}
        {showProgress && (
          <div className="border-t border-border bg-card/80 backdrop-blur-sm px-6 py-4">
            <div className="max-w-2xl mx-auto">
              <WizardProgress currentStep={step} completedSteps={completedSteps} />
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
