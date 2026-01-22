import { motion, AnimatePresence } from "framer-motion";
import { Crown, Check, ArrowRight, Loader2, ArrowLeft, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { STRIPE_PRICES, PlanKey } from "@/lib/stripe-config";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
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
    period: "one-time",
    description: "Perfect for one-time FOIA requests",
    features: ["One FOIA request filed", "Real-time SMS tracking", "AI document search"],
    planKey: "single",
  },
  {
    name: "Professional",
    price: "$200",
    period: "per month",
    description: "For regular research and investigations",
    features: ["5 FOIA requests per month", "Priority processing", "AI document search & analysis"],
    planKey: "professional",
    featured: true,
  },
  {
    name: "Enterprise",
    price: "$500",
    period: "per month",
    description: "For newsrooms and heavy users",
    features: ["Unlimited FOIA requests", "Dedicated account manager", "API access"],
    planKey: "enterprise",
  },
];

interface PlanSelectionStepProps {
  onBack: () => void;
  onClose: () => void;
}

export const PlanSelectionStep = ({ onBack, onClose }: PlanSelectionStepProps) => {
  const [selectedPlan, setSelectedPlan] = useState<PlanKey | null>(null);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);
  const { toast } = useToast();

  const handleSelectPlan = (planKey: PlanKey) => {
    setCheckoutError(null);
    setSelectedPlan(planKey);
  };

  const handleCheckoutComplete = () => {
    toast({
      title: "Payment Successful!",
      description: "Your request is being submitted.",
    });
    // Redirect to dashboard after successful payment
    window.location.href = "/dashboard?payment=success";
  };

  const handleCheckoutError = (error: string) => {
    setCheckoutError(error);
    toast({
      title: "Checkout Error",
      description: error,
      variant: "destructive",
    });
  };

  const handleBackFromCheckout = () => {
    setSelectedPlan(null);
    setCheckoutError(null);
  };

  // If a plan is selected, show the embedded checkout
  if (selectedPlan) {
    const priceConfig = STRIPE_PRICES[selectedPlan];
    const plan = plans.find(p => p.planKey === selectedPlan);
    
    return (
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        className="space-y-4"
      >
        {/* Header with back button */}
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleBackFromCheckout}
            className="gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to plans
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-8 w-8"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Selected plan summary */}
        <div className="bg-muted/30 rounded-lg p-4 border border-border">
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
          <p className="text-sm text-destructive text-center">{checkoutError}</p>
        )}
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="text-center">
        <div className="w-14 h-14 rounded-2xl bg-amber-400/10 flex items-center justify-center mx-auto mb-4">
          <Crown className="w-7 h-7 text-amber-400" />
        </div>
        <h2 className="font-display text-2xl md:text-3xl font-bold mb-2">
          Choose Your Plan
        </h2>
        <p className="text-muted-foreground">
          Select a plan to submit your request. Payment completes your submission.
        </p>
      </div>

      {/* Plans */}
      <div className="space-y-4">
        {plans.map((plan) => (
          <div
            key={plan.planKey}
            className={`relative rounded-xl p-5 border transition-all cursor-pointer hover:border-primary/50 ${
              plan.featured
                ? "border-primary bg-primary/5"
                : "border-border bg-muted/20"
            }`}
            onClick={() => handleSelectPlan(plan.planKey)}
          >
            {plan.featured && (
              <span className="absolute -top-2 right-4 bg-cta-gradient text-primary-foreground text-xs font-semibold px-2 py-0.5 rounded-full">
                Popular
              </span>
            )}
            
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <h3 className="font-display font-semibold text-lg mb-1">{plan.name}</h3>
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
                    handleSelectPlan(plan.planKey);
                  }}
                >
                  Select
                  <ArrowRight className="w-3 h-3 ml-1" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Button variant="ghost" className="w-full" onClick={onBack}>
        ← Back to preview
      </Button>
    </motion.div>
  );
};
