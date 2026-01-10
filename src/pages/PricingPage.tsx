import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Pricing from "@/components/Pricing";
import PageHeader from "@/components/PageHeader";
import { Badge } from "@/components/ui/badge";
import { BillingPeriod } from "@/lib/stripe-config";
import { cn } from "@/lib/utils";
import { 
  Shield, 
  Clock, 
  CreditCard, 
  FileCheck, 
  HelpCircle,
  CheckCircle,
  Sparkles
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const guarantees = [
  {
    icon: Shield,
    title: "Money-Back Guarantee",
    description: "If we can't file your request, you get a full refund. No questions asked.",
  },
  {
    icon: Clock,
    title: "Fast Processing",
    description: "We file most requests within 48 hours of submission.",
  },
  {
    icon: CreditCard,
    title: "No Hidden Fees",
    description: "Agency filing fees are the only additional cost, billed at cost.",
  },
  {
    icon: FileCheck,
    title: "Professional Quality",
    description: "Every request is reviewed by our FOIA specialists for maximum success.",
  },
];

const faqs = [
  {
    question: "What are filing fees?",
    answer: "Filing fees are charges by government agencies for processing FOIA requests. These vary by agency and request complexity. We pass these fees directly to you at cost with no markup.",
  },
  {
    question: "Can I cancel my subscription anytime?",
    answer: "Yes! You can cancel your subscription at any time. Your access continues until the end of your current billing period.",
  },
  {
    question: "What's included in the Professional plan?",
    answer: "The Professional plan includes 5 FOIA requests per month, priority processing, real-time SMS tracking, AI-powered document search and analysis, and priority email support.",
  },
  {
    question: "Do unused requests roll over?",
    answer: "Currently, unused requests do not roll over to the next month. We recommend the Enterprise plan if you have variable monthly needs.",
  },
  {
    question: "What payment methods do you accept?",
    answer: "We accept all major credit cards (Visa, Mastercard, American Express, Discover) through our secure payment processor, Stripe.",
  },
  {
    question: "Is there a free trial?",
    answer: "We don't offer a free trial, but our Single Request option lets you try our service with no commitment. If you're satisfied, you can upgrade to a subscription.",
  },
];

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
};

const PricingPage = () => {
  const [billingPeriod, setBillingPeriod] = useState<BillingPeriod>("monthly");

  const prices = {
    single: { monthly: 75, annual: 75 },
    professional: { monthly: 200, annual: 1920 },
    enterprise: { monthly: 500, annual: 4800 },
  };

  const getDisplayPrice = (plan: keyof typeof prices) => {
    if (plan === "single") return "$75";
    const price = prices[plan][billingPeriod];
    if (billingPeriod === "annual") {
      return `${formatPrice(Math.round(price / 12))}/mo`;
    }
    return `${formatPrice(price)}/mo`;
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <PageHeader
        badge="Pricing"
        badgeIcon={Sparkles}
        title="Choose Your Plan"
        description="Flexible pricing options designed for journalists, researchers, and transparency advocates of all sizes."
      />

      {/* Billing Toggle */}
      <div className="container mx-auto px-6 pt-12">
        <motion.div 
          className="flex items-center justify-center gap-2"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="relative bg-muted/50 rounded-full p-1 flex items-center">
            <motion.div
              className="absolute inset-y-1 bg-primary rounded-full"
              initial={false}
              animate={{
                x: billingPeriod === "monthly" ? 0 : "100%",
                width: billingPeriod === "monthly" ? "calc(50% - 2px)" : "calc(50% + 2px)",
                left: billingPeriod === "monthly" ? 4 : 0,
              }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            />
            <button
              onClick={() => setBillingPeriod("monthly")}
              className={cn(
                "relative z-10 px-6 py-2 rounded-full text-sm font-medium transition-colors",
                billingPeriod === "monthly" 
                  ? "text-primary-foreground" 
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingPeriod("annual")}
              className={cn(
                "relative z-10 px-6 py-2 rounded-full text-sm font-medium transition-colors",
                billingPeriod === "annual" 
                  ? "text-primary-foreground" 
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              Annual
            </button>
          </div>
          <AnimatePresence mode="wait">
            {billingPeriod === "annual" && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8, x: -10 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.8, x: -10 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
              >
                <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/30">
                  Save 20%
                </Badge>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Main Pricing Section */}
      <Pricing showHeader={false} className="pt-8" initialBillingPeriod={billingPeriod} key={billingPeriod} />

      {/* Guarantees Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-6">
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="font-display text-2xl md:text-3xl font-bold mb-4">
              Our Guarantees
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              We're committed to making your FOIA experience seamless and successful.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {guarantees.map((guarantee, index) => (
              <motion.div
                key={guarantee.title}
                className="bg-card/50 border border-border rounded-xl p-6 text-center hover:border-primary/50 transition-colors"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <guarantee.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-display font-semibold mb-2">{guarantee.title}</h3>
                <p className="text-sm text-muted-foreground">{guarantee.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison Table */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="font-display text-2xl md:text-3xl font-bold mb-4">
              Compare Plans
            </h2>
            
            {/* Billing Toggle for Table */}
            <div className="flex items-center justify-center gap-2 mt-6">
              <span className={cn(
                "text-sm transition-colors",
                billingPeriod === "monthly" ? "text-foreground font-medium" : "text-muted-foreground"
              )}>
                Monthly
              </span>
              <button
                onClick={() => setBillingPeriod(billingPeriod === "monthly" ? "annual" : "monthly")}
                className="relative w-14 h-7 rounded-full bg-muted transition-colors hover:bg-muted/80"
              >
                <motion.div
                  className="absolute top-1 left-1 w-5 h-5 rounded-full bg-primary"
                  animate={{ x: billingPeriod === "annual" ? 26 : 0 }}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              </button>
              <span className={cn(
                "text-sm transition-colors",
                billingPeriod === "annual" ? "text-foreground font-medium" : "text-muted-foreground"
              )}>
                Annual
              </span>
              <AnimatePresence>
                {billingPeriod === "annual" && (
                  <motion.span
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    className="text-xs text-emerald-400 font-medium"
                  >
                    (Save 20%)
                  </motion.span>
                )}
              </AnimatePresence>
            </div>
          </motion.div>

          <motion.div 
            className="max-w-4xl mx-auto overflow-x-auto"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-4 px-4 font-display font-semibold">Feature</th>
                  <th className="text-center py-4 px-4 font-display font-semibold">
                    <div className="flex flex-col items-center gap-1">
                      <span>Single</span>
                      <AnimatePresence mode="wait">
                        <motion.span
                          key={`single-${billingPeriod}`}
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 10 }}
                          transition={{ duration: 0.2 }}
                          className="text-xs text-muted-foreground font-normal"
                        >
                          {getDisplayPrice("single")}
                        </motion.span>
                      </AnimatePresence>
                    </div>
                  </th>
                  <th className="text-center py-4 px-4 font-display font-semibold text-primary">
                    <div className="flex flex-col items-center gap-1">
                      <span className="flex items-center gap-1">
                        Professional
                        <Sparkles className="w-3 h-3" />
                      </span>
                      <AnimatePresence mode="wait">
                        <motion.span
                          key={`pro-${billingPeriod}`}
                          initial={{ opacity: 0, y: -10, scale: 0.9 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 10, scale: 0.9 }}
                          transition={{ type: "spring", stiffness: 300, damping: 25 }}
                          className="text-xs font-normal"
                        >
                          {getDisplayPrice("professional")}
                          {billingPeriod === "annual" && (
                            <span className="text-emerald-400 ml-1">(billed annually)</span>
                          )}
                        </motion.span>
                      </AnimatePresence>
                    </div>
                  </th>
                  <th className="text-center py-4 px-4 font-display font-semibold">
                    <div className="flex flex-col items-center gap-1">
                      <span>Enterprise</span>
                      <AnimatePresence mode="wait">
                        <motion.span
                          key={`ent-${billingPeriod}`}
                          initial={{ opacity: 0, y: -10, scale: 0.9 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 10, scale: 0.9 }}
                          transition={{ type: "spring", stiffness: 300, damping: 25 }}
                          className="text-xs text-muted-foreground font-normal"
                        >
                          {getDisplayPrice("enterprise")}
                          {billingPeriod === "annual" && (
                            <span className="text-emerald-400 ml-1">(billed annually)</span>
                          )}
                        </motion.span>
                      </AnimatePresence>
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody>
                {[
                  { feature: "FOIA Requests", single: "1", professional: "5/month", enterprise: "Unlimited" },
                  { feature: "SMS Tracking", single: true, professional: true, enterprise: true },
                  { feature: "AI Document Search", single: true, professional: true, enterprise: true },
                  { feature: "Priority Processing", single: false, professional: true, enterprise: true },
                  { feature: "AI Analysis", single: false, professional: true, enterprise: true },
                  { feature: "API Access", single: false, professional: false, enterprise: true },
                  { feature: "Dedicated Manager", single: false, professional: false, enterprise: true },
                  { feature: "Phone Support", single: false, professional: false, enterprise: true },
                ].map((row, index) => (
                  <motion.tr 
                    key={row.feature}
                    className="border-b border-border/50 hover:bg-muted/30 transition-colors"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <td className="py-4 px-4 text-sm">{row.feature}</td>
                    <td className="text-center py-4 px-4">
                      {typeof row.single === "boolean" ? (
                        row.single ? <CheckCircle className="w-5 h-5 text-primary mx-auto" /> : <span className="text-muted-foreground">—</span>
                      ) : (
                        <span className="text-sm">{row.single}</span>
                      )}
                    </td>
                    <td className="text-center py-4 px-4 bg-primary/5">
                      {typeof row.professional === "boolean" ? (
                        row.professional ? <CheckCircle className="w-5 h-5 text-primary mx-auto" /> : <span className="text-muted-foreground">—</span>
                      ) : (
                        <span className="text-sm font-medium text-primary">{row.professional}</span>
                      )}
                    </td>
                    <td className="text-center py-4 px-4">
                      {typeof row.enterprise === "boolean" ? (
                        row.enterprise ? <CheckCircle className="w-5 h-5 text-primary mx-auto" /> : <span className="text-muted-foreground">—</span>
                      ) : (
                        <span className="text-sm">{row.enterprise}</span>
                      )}
                    </td>
                  </motion.tr>
                ))}
                {/* Annual Savings Row */}
                <AnimatePresence>
                  {billingPeriod === "annual" && (
                    <motion.tr
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="border-b border-emerald-500/30 bg-emerald-500/5"
                    >
                      <td className="py-4 px-4 text-sm font-medium text-emerald-400">Annual Savings</td>
                      <td className="text-center py-4 px-4 text-sm text-muted-foreground">—</td>
                      <td className="text-center py-4 px-4 bg-emerald-500/10">
                        <motion.span 
                          className="text-sm font-bold text-emerald-400"
                          initial={{ scale: 0.8 }}
                          animate={{ scale: 1 }}
                          transition={{ type: "spring", stiffness: 400, damping: 15 }}
                        >
                          Save $480/year
                        </motion.span>
                      </td>
                      <td className="text-center py-4 px-4">
                        <motion.span 
                          className="text-sm font-bold text-emerald-400"
                          initial={{ scale: 0.8 }}
                          animate={{ scale: 1 }}
                          transition={{ type: "spring", stiffness: 400, damping: 15, delay: 0.05 }}
                        >
                          Save $1,200/year
                        </motion.span>
                      </td>
                    </motion.tr>
                  )}
                </AnimatePresence>
              </tbody>
            </table>
          </motion.div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-6">
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center gap-2 text-primary font-semibold text-sm uppercase tracking-wider mb-4">
              <HelpCircle className="w-4 h-4" />
              FAQ
            </div>
            <h2 className="font-display text-2xl md:text-3xl font-bold mb-4">
              Frequently Asked Questions
            </h2>
          </motion.div>

          <motion.div 
            className="max-w-3xl mx-auto"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <Accordion type="single" collapsible className="space-y-4">
              {faqs.map((faq, index) => (
                <AccordionItem 
                  key={index} 
                  value={`item-${index}`}
                  className="bg-card border border-border rounded-xl px-6 data-[state=open]:border-primary/50"
                >
                  <AccordionTrigger className="text-left font-display font-medium hover:no-underline py-4">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground pb-4">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default PricingPage;
