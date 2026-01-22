import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Check, ArrowRight, ArrowLeft, Crown } from "lucide-react";
import { STRIPE_PRICES, PlanKey, matchesPlan } from "@/lib/stripe-config";
import { toast } from "sonner";
import { EmbeddedCheckoutForm } from "@/components/EmbeddedCheckout";

interface Plan {
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  planKey: PlanKey;
  featured?: boolean;
}

const plans: Plan[] = [
  {
    name: "Single Request",
    price: "$75",
    period: "per request",
    description: "Perfect for one-time FOIA requests",
    features: [
      "One FOIA request filed",
      "Real-time SMS tracking",
      "AI document search",
    ],
    planKey: "single",
  },
  {
    name: "Professional",
    price: "$200",
    period: "per month",
    description: "For regular research and investigations",
    features: [
      "5 FOIA requests per month",
      "Priority processing",
      "AI document search & analysis",
    ],
    planKey: "professional",
    featured: true,
  },
  {
    name: "Enterprise",
    price: "$500",
    period: "per month",
    description: "For newsrooms and heavy users",
    features: [
      "Unlimited FOIA requests",
      "Dedicated account manager",
      "API access",
    ],
    planKey: "enterprise",
  },
];

interface UpgradePlanModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentPlanId?: string | null;
}

const UpgradePlanModal = ({ open, onOpenChange, currentPlanId }: UpgradePlanModalProps) => {
  const [selectedPlan, setSelectedPlan] = useState<PlanKey | null>(null);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);

  const handleSelectPlan = (planKey: PlanKey) => {
    setCheckoutError(null);
    setSelectedPlan(planKey);
  };

  const handleCheckoutComplete = () => {
    toast.success("Payment Successful!", {
      description: "Your plan has been upgraded.",
    });
    onOpenChange(false);
    window.location.href = "/dashboard?payment=success";
  };

  const handleCheckoutError = (error: string) => {
    setCheckoutError(error);
    toast.error("Checkout Error", {
      description: error,
    });
  };

  const handleBackFromCheckout = () => {
    setSelectedPlan(null);
    setCheckoutError(null);
  };

  const handleOpenChange = (newOpen: boolean) => {
    onOpenChange(newOpen);
    if (!newOpen) {
      // Reset state when closing
      setTimeout(() => {
        setSelectedPlan(null);
        setCheckoutError(null);
      }, 300);
    }
  };

  const isPlanCurrent = (planKey: PlanKey) => {
    if (!currentPlanId) return false;
    return matchesPlan(currentPlanId, planKey);
  };

  // If a plan is selected, show embedded checkout
  if (selectedPlan) {
    const priceConfig = STRIPE_PRICES[selectedPlan];
    const plan = plans.find(p => p.planKey === selectedPlan);

    return (
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto bg-card border-border">
          {/* Header with back button */}
          <div className="flex items-center gap-4 mb-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleBackFromCheckout}
              className="gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to plans
            </Button>
          </div>

          {/* Selected plan summary */}
          <div className="bg-muted/30 rounded-lg p-4 border border-border mb-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold">{plan?.name}</h3>
                <p className="text-sm text-muted-foreground">{plan?.description}</p>
              </div>
              <div className="text-right">
                <span className="font-display text-xl font-bold">{plan?.price}</span>
                <span className="text-muted-foreground text-sm ml-1">{plan?.period}</span>
              </div>
            </div>
          </div>

          {/* Embedded Checkout */}
          <div className="rounded-xl overflow-hidden border border-border bg-background">
            <EmbeddedCheckoutForm
              priceId={priceConfig.monthly.priceId}
              mode={priceConfig.mode}
              onComplete={handleCheckoutComplete}
              onError={handleCheckoutError}
            />
          </div>

          {checkoutError && (
            <p className="text-sm text-destructive text-center mt-2">{checkoutError}</p>
          )}
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[700px] bg-card border-border">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl flex items-center gap-2">
            <Crown className="w-6 h-6 text-amber-400" />
            Upgrade Your Plan
          </DialogTitle>
          <DialogDescription>
            Choose a plan that fits your needs. All plans include real-time tracking and document delivery.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 mt-4">
          {plans.map((plan) => {
            const isCurrent = isPlanCurrent(plan.planKey);
            return (
              <div
                key={plan.planKey}
                className={`relative rounded-xl p-5 border transition-all cursor-pointer hover:border-primary/50 ${
                  plan.featured
                    ? "border-primary bg-primary/5"
                    : "border-border bg-muted/20"
                } ${isCurrent ? "opacity-60 cursor-not-allowed" : ""}`}
                onClick={() => !isCurrent && handleSelectPlan(plan.planKey)}
              >
                {plan.featured && (
                  <span className="absolute -top-2 right-4 bg-cta-gradient text-primary-foreground text-xs font-semibold px-2 py-0.5 rounded-full">
                    Popular
                  </span>
                )}
                
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-display font-semibold text-lg">{plan.name}</h3>
                      {isCurrent && (
                        <span className="text-xs bg-muted px-2 py-0.5 rounded">Current</span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">{plan.description}</p>
                    <ul className="flex flex-wrap gap-x-4 gap-y-1">
                      {plan.features.map((feature) => (
                        <li key={feature} className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Check className="w-3 h-3 text-primary" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="text-right flex-shrink-0">
                    <div className="mb-2">
                      <span className="font-display text-2xl font-bold">{plan.price}</span>
                      <span className="text-muted-foreground text-sm ml-1">{plan.period}</span>
                    </div>
                    <Button
                      variant={plan.featured ? "hero" : "outline"}
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (!isCurrent) handleSelectPlan(plan.planKey);
                      }}
                      disabled={isCurrent}
                    >
                      {isCurrent ? (
                        "Current Plan"
                      ) : (
                        <>
                          Select
                          <ArrowRight className="w-3 h-3 ml-1" />
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UpgradePlanModal;
