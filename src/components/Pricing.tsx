import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Check, ArrowRight, Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { STRIPE_PRICES, PlanKey } from "@/lib/stripe-config";
import { toast } from "sonner";

const plans: {
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  cta: string;
  featured: boolean;
  planKey: PlanKey;
}[] = [
  {
    name: "Single Request",
    price: "$75",
    period: "per request",
    description: "Perfect for one-time FOIA requests",
    features: [
      "One FOIA request filed",
      "Real-time SMS tracking",
      "AI document search",
      "Email support",
      "Filing fees billed separately",
    ],
    cta: "Submit Request",
    featured: false,
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
      "Real-time SMS tracking",
      "AI document search & analysis",
      "Priority email support",
      "Filing fees billed separately",
    ],
    cta: "Start Subscription",
    featured: true,
    planKey: "professional",
  },
  {
    name: "Enterprise",
    price: "$500",
    period: "per month",
    description: "For newsrooms and heavy users",
    features: [
      "Unlimited FOIA requests",
      "Dedicated account manager",
      "Priority processing",
      "Advanced AI analytics",
      "API access",
      "Phone support",
      "Filing fees billed separately",
    ],
    cta: "Start Subscription",
    featured: false,
    planKey: "enterprise",
  },
];

const Pricing = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loadingPlan, setLoadingPlan] = useState<PlanKey | null>(null);

  const handleCheckout = async (planKey: PlanKey) => {
    if (!user) {
      toast.info("Please sign in to continue with your purchase");
      navigate("/auth");
      return;
    }

    setLoadingPlan(planKey);
    try {
      const priceConfig = STRIPE_PRICES[planKey];
      const { data, error } = await supabase.functions.invoke("create-checkout", {
        body: { 
          priceId: priceConfig.priceId, 
          mode: priceConfig.mode 
        },
      });

      if (error) throw error;
      if (data?.url) {
        window.open(data.url, "_blank");
      }
    } catch (error) {
      console.error("Checkout error:", error);
      toast.error("Failed to start checkout. Please try again.");
    } finally {
      setLoadingPlan(null);
    }
  };

  return (
    <section id="pricing" className="py-24 bg-background">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <span className="text-primary font-semibold text-sm uppercase tracking-wider">Pricing</span>
          <h2 className="font-display text-3xl md:text-5xl font-bold mt-4 mb-6">
            Transparent Pricing for{' '}
            <span className="text-gradient">Transparency</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Simple, straightforward pricing. Any filing fees charged by agencies are billed directly to you at cost.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative rounded-2xl p-8 transition-all duration-300 hover:-translate-y-1 ${
                plan.featured
                  ? 'bg-card-gradient border-2 border-primary shadow-glow'
                  : 'glass'
              }`}
            >
              {plan.featured && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="bg-cta-gradient text-primary-foreground text-sm font-semibold px-4 py-1 rounded-full">
                    Most Popular
                  </span>
                </div>
              )}

              <div className="mb-6">
                <h3 className="font-display text-xl font-semibold mb-2">{plan.name}</h3>
                <p className="text-muted-foreground text-sm">{plan.description}</p>
              </div>

              <div className="mb-8">
                <span className="font-display text-4xl font-bold">{plan.price}</span>
                <span className="text-muted-foreground ml-2">{plan.period}</span>
              </div>

              <ul className="space-y-4 mb-8">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                    <span className="text-muted-foreground">{feature}</span>
                  </li>
                ))}
              </ul>

              <Button
                variant={plan.featured ? "hero" : "heroOutline"}
                size="lg"
                className="w-full"
                onClick={() => handleCheckout(plan.planKey)}
                disabled={loadingPlan !== null}
              >
                {loadingPlan === plan.planKey ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    {plan.cta}
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Pricing;
