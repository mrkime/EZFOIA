import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Pricing from "@/components/Pricing";
import PageHeader from "@/components/PageHeader";
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

const PricingPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <PageHeader
        badge="Pricing"
        badgeIcon={Sparkles}
        title="Choose Your Plan"
        description="Flexible pricing options designed for journalists, researchers, and transparency advocates of all sizes."
      />

      {/* Main Pricing Section */}
      <Pricing showHeader={false} className="pt-12" />

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
                  <th className="text-center py-4 px-4 font-display font-semibold">Single</th>
                  <th className="text-center py-4 px-4 font-display font-semibold text-primary">Professional</th>
                  <th className="text-center py-4 px-4 font-display font-semibold">Enterprise</th>
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
