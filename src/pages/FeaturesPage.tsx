import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  Smartphone, 
  Brain, 
  ShieldCheck, 
  Zap, 
  Users, 
  FileStack,
  Search,
  Bell,
  Lock,
  Clock,
  FileText,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  FileSearch,
  TrendingUp,
  MessageSquare,
  BarChart3,
  Globe
} from "lucide-react";

const mainFeatures = [
  {
    icon: Brain,
    title: "AI-Powered Document Intelligence",
    description: "Our advanced AI doesn't just deliver documents—it makes them useful. Automatically scan, index, and search through hundreds of pages in seconds to find exactly what you need.",
    benefits: ["Full-text search across all documents", "AI-generated summaries", "Key phrase extraction", "Cross-reference detection"],
    gradient: "from-violet-500/20 via-primary/20 to-primary/10",
    tag: "Most Popular",
  },
  {
    icon: Smartphone,
    title: "Real-Time SMS & Push Notifications",
    description: "Stay informed every step of the way with instant notifications. Know exactly when your request is received, being processed, or completed—no more guessing.",
    benefits: ["Instant status updates", "Agency response alerts", "Document ready notifications", "Deadline reminders"],
    gradient: "from-primary/20 via-cyan-500/10 to-transparent",
    tag: "Stay Informed",
  },
  {
    icon: ShieldCheck,
    title: "100% Compliance Guaranteed",
    description: "Every request is reviewed by our system to ensure it meets all federal and state FOIA requirements. We format requests perfectly for each agency's specific guidelines.",
    benefits: ["Agency-specific formatting", "Legal requirement validation", "Automatic fee waiver requests", "Appeal assistance included"],
    gradient: "from-emerald-500/20 via-primary/10 to-transparent",
    tag: "Zero Rejections",
  },
];

const capabilities = [
  {
    icon: Zap,
    title: "3-Minute Filing",
    description: "Submit complete, compliant requests in under 3 minutes. Our smart forms do the heavy lifting.",
    stat: "10x",
    statLabel: "Faster",
  },
  {
    icon: FileSearch,
    title: "Smart Search",
    description: "Find any document instantly with natural language search across your entire archive.",
    stat: "1M+",
    statLabel: "Pages Indexed",
  },
  {
    icon: BarChart3,
    title: "Analytics Dashboard",
    description: "Track success rates, response times, and agency performance with detailed analytics.",
    stat: "98%",
    statLabel: "Success Rate",
  },
  {
    icon: Globe,
    title: "All Agencies",
    description: "Access federal, state, and local agencies across all 50 states from one platform.",
    stat: "5,000+",
    statLabel: "Agencies",
  },
];

const additionalFeatures = [
  {
    icon: Users,
    title: "Expert Support",
    description: "Our team of FOIA specialists helps you navigate complex requests and appeals.",
  },
  {
    icon: FileStack,
    title: "Organized Archive",
    description: "All your requests and documents in one place, searchable and accessible forever.",
  },
  {
    icon: Bell,
    title: "Custom Alerts",
    description: "Set up personalized notifications for specific agencies or document types.",
  },
  {
    icon: Lock,
    title: "Bank-Level Security",
    description: "256-bit encryption keeps your documents and personal information completely safe.",
  },
  {
    icon: Clock,
    title: "Deadline Tracking",
    description: "Never miss an agency response deadline with automatic tracking and reminders.",
  },
  {
    icon: FileText,
    title: "Template Library",
    description: "Access proven request templates for common document types across agencies.",
  },
  {
    icon: MessageSquare,
    title: "Agency Communication",
    description: "We handle all back-and-forth with agencies so you don't have to.",
  },
  {
    icon: TrendingUp,
    title: "Success Insights",
    description: "Learn which request strategies work best for each agency.",
  },
  {
    icon: Search,
    title: "Request Tracking",
    description: "Real-time visibility into exactly where your request stands in the process.",
  },
];

const FeaturesPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-32 pb-20 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-1/4 -left-32 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse-slow" />
          <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse-slow" />
        </div>
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary font-medium text-sm mb-6"
            >
              <Sparkles className="w-4 h-4" />
              Powerful Features
            </motion.div>
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="font-display text-4xl md:text-6xl font-bold mb-6"
            >
              Everything You Need for{' '}
              <span className="text-gradient">Public Records</span>
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-muted-foreground text-lg md:text-xl mb-8 max-w-2xl mx-auto"
            >
              AI-powered tools, real-time tracking, and guaranteed compliance—all in one platform built for the modern era of transparency.
            </motion.p>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Link to="/#pricing">
                <Button variant="hero" size="lg" className="gap-2 w-full sm:w-auto">
                  See Plans & Pricing
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <Link to="/foia-guide">
                <Button variant="outline" size="lg" className="w-full sm:w-auto">
                  Learn About FOIA
                </Button>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Banner */}
      <section className="py-12 relative overflow-hidden">
        <div className="container mx-auto px-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative rounded-2xl bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5 border border-primary/20 p-8 md:p-10"
          >
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,hsl(var(--primary)/0.1)_0%,transparent_70%)]" />
            <div className="relative z-10 grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
              {capabilities.map((cap, index) => (
                <motion.div 
                  key={cap.title}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="text-center group"
                >
                  <div className="flex items-baseline justify-center gap-1 mb-2">
                    <span className="font-display text-4xl md:text-5xl font-bold text-primary group-hover:scale-110 transition-transform">{cap.stat}</span>
                    <span className="text-muted-foreground text-sm font-medium">{cap.statLabel}</span>
                  </div>
                  <p className="text-foreground font-medium text-sm md:text-base">{cap.title}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Main Features - Bento Style */}
      <section className="py-24">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <motion.span 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary font-medium text-sm mb-6"
            >
              <Zap className="w-4 h-4" />
              Core Capabilities
            </motion.span>
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="font-display text-3xl md:text-5xl font-bold mb-6"
            >
              What Sets Us Apart
            </motion.h2>
          </div>
          
          <div className="space-y-8">
            {mainFeatures.map((feature, index) => (
              <motion.div 
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className={`group relative rounded-3xl bg-gradient-to-br ${feature.gradient} border border-primary/20 p-8 md:p-12 overflow-hidden`}
              >
                <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2" />
                
                <div className="relative z-10 grid lg:grid-cols-2 gap-8 items-center">
                  <div className={index % 2 === 1 ? "lg:order-2" : ""}>
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-16 h-16 rounded-2xl bg-primary/20 flex items-center justify-center">
                        <feature.icon className="w-8 h-8 text-primary" />
                      </div>
                      <span className="px-3 py-1 rounded-full bg-primary/20 text-primary text-xs font-semibold uppercase tracking-wider">
                        {feature.tag}
                      </span>
                    </div>
                    <h3 className="font-display text-2xl md:text-3xl font-bold mb-4">{feature.title}</h3>
                    <p className="text-muted-foreground text-lg mb-6">{feature.description}</p>
                    
                    <ul className="grid sm:grid-cols-2 gap-3">
                      {feature.benefits.map((benefit) => (
                        <li key={benefit} className="flex items-center gap-2">
                          <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0" />
                          <span className="text-foreground">{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className={index % 2 === 1 ? "lg:order-1" : ""}>
                    <div className="relative rounded-2xl bg-background/50 backdrop-blur border border-border p-6 md:p-8">
                      {/* Feature visualization */}
                      {index === 0 && (
                        <div className="space-y-4">
                          <div className="flex items-center gap-3 p-3 rounded-lg bg-card border border-border">
                            <FileSearch className="w-5 h-5 text-primary" />
                            <span className="text-sm">Search: "budget allocation 2024"</span>
                          </div>
                          <div className="space-y-2">
                            {["Document-A.pdf - Page 23: Found 3 matches", "Report-2024.pdf - Page 5: Found 8 matches", "Budget-Summary.pdf - Page 1: Found 12 matches"].map((result, i) => (
                              <div key={i} className="flex items-center gap-2 p-2 rounded bg-primary/5 text-sm">
                                <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0" />
                                {result}
                              </div>
                            ))}
                          </div>
                          <div className="p-3 rounded-lg bg-primary/10 border border-primary/20">
                            <p className="text-xs text-muted-foreground mb-1">AI Summary</p>
                            <p className="text-sm">Found 23 references to budget allocation across 3 documents. Key finding: 15% increase in Q3...</p>
                          </div>
                        </div>
                      )}
                      {index === 1 && (
                        <div className="space-y-3">
                          {[
                            { time: "Just now", msg: "📋 Request #1247 submitted successfully" },
                            { time: "2 hrs ago", msg: "✅ Request #1246 received by FBI" },
                            { time: "Yesterday", msg: "📄 Documents ready for #1245!" },
                          ].map((notif, i) => (
                            <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-card border border-border">
                              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                                <Bell className="w-4 h-4 text-primary" />
                              </div>
                              <div>
                                <p className="text-xs text-muted-foreground">{notif.time}</p>
                                <p className="text-sm">{notif.msg}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                      {index === 2 && (
                        <div className="space-y-4">
                          <div className="flex items-center justify-between p-3 rounded-lg bg-card border border-border">
                            <span className="text-sm font-medium">Compliance Check</span>
                            <span className="px-2 py-1 rounded bg-emerald-500/20 text-emerald-400 text-xs font-medium">PASSED</span>
                          </div>
                          <div className="space-y-2">
                            {["Agency format verified", "Fee waiver included", "Required fields complete", "Legal citations added"].map((check, i) => (
                              <div key={i} className="flex items-center gap-2 p-2 text-sm">
                                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                                {check}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Additional Features Grid */}
      <section className="py-24 bg-card/50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <motion.span 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-primary font-semibold text-sm uppercase tracking-wider"
            >
              And Much More
            </motion.span>
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="font-display text-3xl md:text-4xl font-bold mt-4 mb-6"
            >
              Built for Power Users
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-muted-foreground max-w-2xl mx-auto"
            >
              Every feature designed to make public records accessible, searchable, and actionable.
            </motion.p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {additionalFeatures.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className="group bg-background rounded-2xl p-6 border border-border hover:border-primary/50 transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 group-hover:scale-110 transition-all duration-300">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-display text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground text-sm">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24">
        <div className="container mx-auto px-6">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative rounded-3xl bg-gradient-to-br from-primary/20 via-card to-card border border-primary/30 p-12 md:p-16 text-center overflow-hidden"
          >
            <div className="absolute inset-0">
              <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
              <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
            </div>
            
            <div className="relative z-10 max-w-2xl mx-auto">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/20 border border-primary/30 text-primary font-medium text-sm mb-6">
                <Sparkles className="w-4 h-4" />
                Start Today
              </div>
              <h2 className="font-display text-3xl md:text-5xl font-bold mb-6">
                Ready to Unlock{' '}
                <span className="text-gradient">Transparency?</span>
              </h2>
              <p className="text-muted-foreground text-lg mb-8">
                Join thousands of journalists, researchers, and citizens who trust EZFOIA for their public records requests.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/#pricing">
                  <Button variant="hero" size="lg" className="gap-2 w-full sm:w-auto">
                    View Plans & Get Started
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
                <Link to="/contact">
                  <Button variant="outline" size="lg" className="w-full sm:w-auto">
                    Contact Sales
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default FeaturesPage;
