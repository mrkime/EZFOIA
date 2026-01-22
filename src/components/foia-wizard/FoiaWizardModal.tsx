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
import { useNavigate } from "react-router-dom";
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
  PlanSelectionStep,
  SuccessStep,
} from "./steps";
import { Button } from "@/components/ui/button";
import { LogIn, ArrowRight, Clock } from "lucide-react";

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
  const [requestCount, setRequestCount] = useState(0);

  const { toast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();

  // Check subscription when modal opens
  useEffect(() => {
    if (user && open) {
      checkSubscription();
    }
  }, [user, open]);

  const checkSubscription = async () => {
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
              .eq("user_id", user!.id);
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
        .eq("user_id", user!.id);
      setRequestCount(count || 0);
    } catch (error) {
      logger.error("Error checking subscription:", error);
      setSubscription({ subscribed: false, product_id: null });
    }
  };

  const canSubmitRequest = (): boolean => {
    if (!subscription?.subscribed) return false;
    const limit = getRequestLimit(subscription.product_id);
    if (limit === -1) return true;
    return requestCount < limit;
  };

  const updateWizardData = useCallback((updates: Partial<WizardState>) => {
    setWizardData(prev => ({ ...prev, ...updates }));
  }, []);

  const goToStep = (nextStep: WizardStep) => {
    // Track completed steps
    if (!completedSteps.includes(step) && step !== "generating" && step !== "preview") {
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

  const handleSubmit = async () => {
    if (!user) {
      toast({
        title: "Please sign in",
        description: "You need to be signed in to submit a FOIA request.",
        variant: "destructive",
      });
      setOpen(false);
      navigate("/auth");
      return;
    }

    // Check if user can submit
    if (!canSubmitRequest()) {
      // Store the data for after payment
      const requestData = {
        agencyName: wizardData.agencyName,
        agencyType: wizardData.jurisdictionType,
        recordType: "other", // We'll map this differently for the wizard
        recordDescription: generatedRequest?.letter || wizardData.recordsDescription,
      };
      localStorage.setItem(PENDING_REQUEST_KEY, JSON.stringify(requestData));
      setStep("plan-selection");
      return;
    }

    // Submit directly
    setIsSubmitting(true);
    try {
      const { data: requestData, error: insertError } = await supabase
        .from("foia_requests")
        .insert({
          user_id: user.id,
          agency_name: wizardData.agencyName,
          agency_type: wizardData.jurisdictionType,
          record_type: "other",
          record_description: generatedRequest?.letter || wizardData.recordsDescription,
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
      toast({
        title: "Request Submitted!",
        description: "Check your email for confirmation details.",
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
        }, 300);
      }
    }
  };

  const handleLetterChange = (letter: string) => {
    if (generatedRequest) {
      setGeneratedRequest({ ...generatedRequest, letter });
    }
  };

  // If not logged in, show sign-in prompt
  if (!user && open) {
    return (
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogTrigger asChild>{children}</DialogTrigger>
        <DialogContent className="sm:max-w-[500px] bg-card border-border">
          <div className="py-8 text-center">
            <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-6">
              <LogIn className="w-8 h-8 text-primary" />
            </div>
            <h3 className="font-display text-2xl font-bold mb-2">Start Your FOIA Request</h3>
            <p className="text-muted-foreground mb-2">
              Create an account or sign in to begin.
            </p>
            <p className="text-sm text-muted-foreground mb-6 flex items-center justify-center gap-2">
              <Clock className="w-4 h-4" />
              Takes ~3 minutes. No legal knowledge required.
            </p>
            <div className="flex flex-col gap-3">
              <Button
                variant="hero"
                size="lg"
                onClick={() => {
                  setOpen(false);
                  navigate("/auth");
                }}
              >
                Sign In / Sign Up
                <ArrowRight className="w-5 h-5" />
              </Button>
              <Button variant="ghost" onClick={() => setOpen(false)}>
                Maybe Later
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[650px] max-h-[90vh] overflow-y-auto bg-card border-border p-6 md:p-8">
        {/* Progress Bar (not shown for special steps) */}
        <WizardProgress currentStep={step} completedSteps={completedSteps} />

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
              onLetterChange={handleLetterChange}
              onSubmit={handleSubmit}
              onBack={() => goToStep("context")}
              isSubmitting={isSubmitting}
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
      </DialogContent>
    </Dialog>
  );
};
