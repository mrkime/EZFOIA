import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Check, ArrowRight, Loader2, Crown } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { STRIPE_PRICES, PlanKey } from "@/lib/stripe-config";
import { toast } from "sonner";

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
  const [loadingPlan, setLoadingPlan] = useState<PlanKey | null>(null);

  const handleCheckout = async (planKey: PlanKey) => {
    setLoadingPlan(planKey);
    try {
      const priceConfig = STRIPE_PRICES[planKey];
      const { data, error } = await supabase.functions.invoke("create-checkout", {
        body: {
          priceId: priceConfig.priceId,
          mode: priceConfig.mode,
        },
      });

      if (error) throw error;
      if (data?.url) {
        window.open(data.url, "_blank");
        onOpenChange(false);
      }
    } catch (error) {
      console.error("Checkout error:", error);
      toast.error("Failed to start checkout. Please try again.");
    } finally {
      setLoadingPlan(null);
    }
  };

  const isPlanCurrent = (planKey: PlanKey) => {
    if (!currentPlanId) return false;
    return STRIPE_PRICES[planKey].productId === currentPlanId;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
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
                className={`relative rounded-xl p-5 border transition-all ${
                  plan.featured
                    ? "border-primary bg-primary/5"
                    : "border-border bg-muted/20"
                } ${isCurrent ? "opacity-60" : ""}`}
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
                      onClick={() => handleCheckout(plan.planKey)}
                      disabled={loadingPlan !== null || isCurrent}
                    >
                      {loadingPlan === plan.planKey ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : isCurrent ? (
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
