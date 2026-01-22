import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, ArrowRight, ArrowLeft, Sparkles, Zap, Building2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { STRIPE_PRICES, PlanKey, BillingPeriod } from "@/lib/stripe-config";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { EmbeddedCheckoutForm } from "@/components/EmbeddedCheckout";

interface Plan {
  name: string;
  monthlyPrice: number;
  annualPrice: number;
  period: string;
  annualPeriod: string;
  description: string;
  features: string[];
  cta: string;
  featured: boolean;
  planKey: PlanKey;
  icon: React.ElementType;
  gradient: string;
}

const plans: Plan[] = [
  {
    name: "Single Request",
    monthlyPrice: 75,
    annualPrice: 75,
    period: "per request",
    annualPeriod: "per request",
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
    icon: Zap,
    gradient: "from-blue-500/20 to-cyan-500/20",
  },
  {
    name: "Professional",
    monthlyPrice: 200,
    annualPrice: 1920, // $160/mo billed annually ($200 * 12 * 0.8 = $1920)
    period: "per month",
    annualPeriod: "per year",
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
    icon: Sparkles,
    gradient: "from-primary/20 to-emerald-500/20",
  },
  {
    name: "Enterprise",
    monthlyPrice: 500,
    annualPrice: 4800, // $400/mo billed annually ($500 * 12 * 0.8 = $4800)
    period: "per month",
    annualPeriod: "per year",
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
    icon: Building2,
    gradient: "from-amber-500/20 to-orange-500/20",
  },
];

interface PricingProps {
  showHeader?: boolean;
  className?: string;
  initialBillingPeriod?: BillingPeriod;
}

const Pricing = ({ showHeader = true, className, initialBillingPeriod = "monthly" }: PricingProps) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [billingPeriod, setBillingPeriod] = useState<BillingPeriod>(initialBillingPeriod);
  const [selectedPlan, setSelectedPlan] = useState<{ planKey: PlanKey; priceId: string; mode: "payment" | "subscription" } | null>(null);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);

  const handleCheckout = (planKey: PlanKey) => {
    if (!user) {
      toast.info("Please sign in to continue with your purchase");
      navigate("/auth");
      return;
    }

    const priceConfig = STRIPE_PRICES[planKey];
    const periodConfig = priceConfig[billingPeriod];
    
    setCheckoutError(null);
    setSelectedPlan({
      planKey,
      priceId: periodConfig.priceId,
      mode: priceConfig.mode,
    });
  };

  const handleCheckoutComplete = () => {
    toast.success("Payment Successful!", {
      description: "Your subscription is now active.",
    });
    setSelectedPlan(null);
    window.location.href = "/dashboard?payment=success";
  };

  const handleCheckoutError = (error: string) => {
    setCheckoutError(error);
    toast.error("Checkout Error", {
      description: error,
    });
  };

  const handleCloseCheckout = () => {
    setSelectedPlan(null);
    setCheckoutError(null);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const getMonthlyEquivalent = (annualPrice: number) => {
    return Math.round(annualPrice / 12);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut" as const,
      },
    },
  };

  const selectedPlanData = selectedPlan ? plans.find(p => p.planKey === selectedPlan.planKey) : null;

  return (
    <>
      {/* Embedded Checkout Modal */}
      <Dialog open={!!selectedPlan} onOpenChange={(open) => !open && handleCloseCheckout()}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto bg-card border-border">
          {/* Header with back button */}
          <div className="flex items-center gap-4 mb-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCloseCheckout}
              className="gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to plans
            </Button>
          </div>

          {/* Selected plan summary */}
          {selectedPlanData && (
            <div className="bg-muted/30 rounded-lg p-4 border border-border mb-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold">{selectedPlanData.name}</h3>
                  <p className="text-sm text-muted-foreground">{selectedPlanData.description}</p>
                </div>
                <div className="text-right">
                  <span className="font-display text-xl font-bold">
                    {formatPrice(billingPeriod === "annual" ? selectedPlanData.annualPrice : selectedPlanData.monthlyPrice)}
                  </span>
                  <span className="text-muted-foreground text-sm ml-1">
                    {billingPeriod === "annual" ? selectedPlanData.annualPeriod : selectedPlanData.period}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Embedded Checkout */}
          {selectedPlan && (
            <div className="rounded-xl overflow-hidden border border-border bg-background">
              <EmbeddedCheckoutForm
                priceId={selectedPlan.priceId}
                mode={selectedPlan.mode}
                onComplete={handleCheckoutComplete}
                onError={handleCheckoutError}
              />
            </div>
          )}

          {checkoutError && (
            <p className="text-sm text-destructive text-center mt-2">{checkoutError}</p>
          )}
        </DialogContent>
      </Dialog>

      <section id="pricing" className={cn("py-24 bg-background relative overflow-hidden", className)}>
        {/* Background Elements */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        </div>

        <div className="container mx-auto px-6 relative">
          {showHeader && (
            <motion.div 
              className="text-center mb-16"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <span className="inline-flex items-center gap-2 text-primary font-semibold text-sm uppercase tracking-wider mb-4">
                <Sparkles className="w-4 h-4" />
                Pricing
              </span>
              <h2 className="font-display text-3xl md:text-5xl font-bold mt-4 mb-6">
                Transparent Pricing for{' '}
                <span className="text-gradient">Transparency</span>
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
                Simple, straightforward pricing. Any filing fees charged by agencies are billed directly to you at cost.
              </p>

              {/* Billing Toggle */}
              <div className="flex items-center justify-center">
                <div className="relative bg-muted/50 rounded-full p-1 flex items-center">
                  {/* Sticker Badge */}
                  <Badge 
                    className="absolute -top-3 -right-3 bg-emerald-500 text-white text-[10px] px-2 py-0.5 shadow-lg rotate-12 z-20 border-0"
                  >
                    Save 20%
                  </Badge>
                  
                  <button
                    onClick={() => setBillingPeriod("monthly")}
                    className={cn(
                      "relative z-10 px-5 py-2 rounded-full text-sm font-medium transition-all",
                      billingPeriod === "monthly" 
                        ? "bg-primary text-primary-foreground" 
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    Monthly
                  </button>
                  <button
                    onClick={() => setBillingPeriod("annual")}
                    className={cn(
                      "relative z-10 px-5 py-2 rounded-full text-sm font-medium transition-all",
                      billingPeriod === "annual" 
                        ? "bg-primary text-primary-foreground" 
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    Annual
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 max-w-6xl mx-auto"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {plans.map((plan, index) => {
              const IconComponent = plan.icon;
              const isAnnual = billingPeriod === "annual";
              const displayPrice = isAnnual ? plan.annualPrice : plan.monthlyPrice;
              const displayPeriod = isAnnual ? plan.annualPeriod : plan.period;
              const monthlyEquivalent = isAnnual && plan.planKey !== "single" ? getMonthlyEquivalent(plan.annualPrice) : null;
              const yearlySavings = plan.planKey !== "single" ? (plan.monthlyPrice * 12) - plan.annualPrice : 0;
              
              return (
                <motion.div
                  key={plan.name}
                  variants={cardVariants}
                  whileHover={{ y: -8, transition: { duration: 0.3 } }}
                  className={cn(
                    "relative rounded-2xl p-8 transition-all duration-300 group",
                    plan.featured
                      ? "bg-card border-2 border-primary shadow-glow"
                      : "bg-card/50 border border-border hover:border-primary/50"
                  )}
                >
                  {/* Gradient Overlay */}
                  <div className={cn(
                    "absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br -z-10",
                    plan.gradient
                  )} />

                  {plan.featured && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                      <motion.span 
                        className="bg-cta-gradient text-primary-foreground text-sm font-semibold px-4 py-1.5 rounded-full inline-flex items-center gap-1.5 shadow-lg"
                        initial={{ scale: 0.9 }}
                        animate={{ scale: [0.9, 1.05, 1] }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                        Most Popular
                      </motion.span>
                    </div>
                  )}

                  {/* Icon */}
                  <div className={cn(
                    "w-12 h-12 rounded-xl flex items-center justify-center mb-6 transition-transform group-hover:scale-110",
                    plan.featured ? "bg-primary/20" : "bg-muted"
                  )}>
                    <IconComponent className={cn(
                      "w-6 h-6",
                      plan.featured ? "text-primary" : "text-muted-foreground"
                    )} />
                  </div>

                  <div className="mb-6">
                    <h3 className="font-display text-xl font-semibold mb-2">{plan.name}</h3>
                    <p className="text-muted-foreground text-sm">{plan.description}</p>
                  </div>

                  <div className="mb-8 min-h-[80px]">
                    <div className="flex items-baseline gap-1">
                      <AnimatePresence mode="wait">
                        <motion.span 
                          key={`${plan.planKey}-${billingPeriod}`}
                          className="font-display text-4xl font-bold"
                          initial={{ opacity: 0, y: -20, scale: 0.9 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 20, scale: 0.9 }}
                          transition={{ 
                            type: "spring", 
                            stiffness: 300, 
                            damping: 25,
                            duration: 0.3 
                          }}
                        >
                          {formatPrice(displayPrice)}
                        </motion.span>
                      </AnimatePresence>
                      <AnimatePresence mode="wait">
                        <motion.span 
                          key={`period-${plan.planKey}-${billingPeriod}`}
                          className="text-muted-foreground"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          /{displayPeriod.replace("per ", "")}
                        </motion.span>
                      </AnimatePresence>
                    </div>
                    <AnimatePresence mode="wait">
                      {isAnnual && plan.planKey !== "single" && monthlyEquivalent && (
                        <motion.div 
                          className="mt-2 space-y-1"
                          initial={{ opacity: 0, height: 0, y: -10 }}
                          animate={{ opacity: 1, height: "auto", y: 0 }}
                          exit={{ opacity: 0, height: 0, y: -10 }}
                          transition={{ type: "spring", stiffness: 300, damping: 25 }}
                        >
                          <p className="text-sm text-muted-foreground">
                            {formatPrice(monthlyEquivalent)}/month billed annually
                          </p>
                          <motion.p 
                            className="text-sm text-emerald-500 font-medium"
                            initial={{ scale: 0.8 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", stiffness: 400, damping: 15, delay: 0.1 }}
                          >
                            Save {formatPrice(yearlySavings)}/year
                          </motion.p>
                        </motion.div>
                      )}
                      {!isAnnual && plan.planKey !== "single" && (
                        <motion.p 
                          className="text-sm text-muted-foreground mt-1"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                        >
                          billed monthly
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </div>

                  <ul className="space-y-4 mb-8">
                    {plan.features.map((feature, featureIndex) => (
                      <motion.li 
                        key={feature} 
                        className="flex items-start gap-3"
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.1 + featureIndex * 0.05 }}
                      >
                        <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center shrink-0 mt-0.5">
                          <Check className="w-3 h-3 text-primary" />
                        </div>
                        <span className="text-muted-foreground text-sm">{feature}</span>
                      </motion.li>
                    ))}
                  </ul>

                  <Button
                    variant={plan.featured ? "hero" : "heroOutline"}
                    size="lg"
                    className="w-full group/btn"
                    onClick={() => handleCheckout(plan.planKey)}
                  >
                    {plan.cta}
                    <ArrowRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
                  </Button>
                </motion.div>
              );
            })}
          </motion.div>

          {/* Footer Note */}
          <motion.div 
            className="text-center mt-12"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
          >
            <p className="text-muted-foreground text-sm">
              Need a custom plan?{" "}
              <Link to="/contact" className="text-primary hover:underline">
                Contact us
              </Link>{" "}
              for enterprise solutions.
            </p>
          </motion.div>
        </div>
      </section>
    </>
  );
};

export default Pricing;
