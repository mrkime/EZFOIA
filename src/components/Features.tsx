import { 
  Smartphone, 
  Brain, 
  ShieldCheck, 
  Zap, 
  Clock, 
  FileSearch,
  TrendingUp,
  CheckCircle2,
  ArrowRight
} from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Features = () => {
  return (
    <section id="features" className="py-24 bg-background relative overflow-hidden">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.span 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary font-medium text-sm mb-6"
          >
            <Zap className="w-4 h-4" />
            Why Choose EZFOIA
          </motion.span>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="font-display text-3xl md:text-5xl font-bold mb-6"
          >
            The Smartest Way to Get{' '}
            <span className="text-gradient">Government Records</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-muted-foreground text-lg max-w-2xl mx-auto"
          >
            Stop wrestling with bureaucracy. Our AI-powered platform handles the complexity so you get results.
          </motion.p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
          
          {/* Hero Feature - AI Document Analysis */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-2 group relative rounded-3xl bg-gradient-to-br from-primary/20 via-card to-card border border-primary/30 p-8 overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl translate-x-1/3 -translate-y-1/3" />
            <div className="relative z-10">
              <div className="flex items-start justify-between mb-6">
                <div className="w-16 h-16 rounded-2xl bg-primary/20 flex items-center justify-center">
                  <Brain className="w-8 h-8 text-primary" />
                </div>
                <span className="px-3 py-1 rounded-full bg-primary/20 text-primary text-xs font-semibold uppercase tracking-wider">
                  AI Powered
                </span>
              </div>
              <h3 className="font-display text-2xl md:text-3xl font-bold mb-4">
                Instant Document Intelligence
              </h3>
              <p className="text-muted-foreground text-lg mb-6 max-w-xl">
                Our AI doesn't just retrieve your documents—it reads, indexes, and summarizes them. Search through thousands of pages in seconds, find exactly what you need, and get AI-generated insights.
              </p>
              <div className="flex flex-wrap gap-3">
                <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-background/50 border border-border text-sm">
                  <FileSearch className="w-4 h-4 text-primary" />
                  Smart Search
                </div>
                <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-background/50 border border-border text-sm">
                  <CheckCircle2 className="w-4 h-4 text-primary" />
                  Auto-Summarize
                </div>
                <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-background/50 border border-border text-sm">
                  <TrendingUp className="w-4 h-4 text-primary" />
                  Key Insights
                </div>
              </div>
            </div>
          </motion.div>

          {/* Stats Card */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="group relative rounded-3xl bg-card border border-border p-8 flex flex-col justify-between"
          >
            <div>
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-6">
                <Clock className="w-7 h-7 text-primary" />
              </div>
              <h3 className="font-display text-xl font-bold mb-3">10x Faster</h3>
              <p className="text-muted-foreground">
                Average request submission time compared to doing it yourself
              </p>
            </div>
            <div className="mt-6 pt-6 border-t border-border">
              <div className="flex items-baseline gap-2">
                <span className="font-display text-4xl font-bold text-primary">3 min</span>
                <span className="text-muted-foreground text-sm">avg. submit time</span>
              </div>
            </div>
          </motion.div>

          {/* SMS Updates */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="group relative rounded-3xl bg-card border border-border p-8 hover:border-primary/50 transition-all duration-300"
          >
            <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
              <Smartphone className="w-7 h-7 text-primary" />
            </div>
            <h3 className="font-display text-xl font-bold mb-3">Real-Time SMS Alerts</h3>
            <p className="text-muted-foreground mb-4">
              Get instant text updates when your request status changes. No more checking your email obsessively.
            </p>
            <div className="relative mt-4 p-4 rounded-xl bg-background border border-border">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                  <span className="text-xs">📱</span>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">EZFOIA</p>
                  <p className="text-sm">Your FOIA request #1247 has been approved! Documents ready for download.</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Compliance */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="group relative rounded-3xl bg-card border border-border p-8 hover:border-primary/50 transition-all duration-300"
          >
            <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
              <ShieldCheck className="w-7 h-7 text-primary" />
            </div>
            <h3 className="font-display text-xl font-bold mb-3">100% Compliant</h3>
            <p className="text-muted-foreground mb-4">
              Every request is formatted perfectly for each agency. No rejections due to technicalities.
            </p>
            <ul className="space-y-2">
              {["Federal FOIA", "State Open Records", "Local Agencies"].map((item) => (
                <li key={item} className="flex items-center gap-2 text-sm text-muted-foreground">
                  <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Success Rate Banner */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
            className="lg:col-span-3 group relative rounded-3xl bg-gradient-to-r from-primary/10 via-card to-primary/10 border border-primary/20 p-8 overflow-hidden"
          >
            <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_0%,hsl(var(--primary)/0.05)_50%,transparent_100%)] animate-pulse-slow" />
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex flex-col md:flex-row items-center gap-8">
                <div className="text-center md:text-left">
                  <div className="font-display text-5xl md:text-6xl font-bold text-primary mb-1">98%</div>
                  <p className="text-muted-foreground">Success Rate</p>
                </div>
                <div className="hidden md:block w-px h-16 bg-border" />
                <div className="text-center md:text-left">
                  <div className="font-display text-5xl md:text-6xl font-bold text-primary mb-1">50K+</div>
                  <p className="text-muted-foreground">Requests Filed</p>
                </div>
                <div className="hidden md:block w-px h-16 bg-border" />
                <div className="text-center md:text-left">
                  <div className="font-display text-5xl md:text-6xl font-bold text-primary mb-1">24hr</div>
                  <p className="text-muted-foreground">Avg. Support Response</p>
                </div>
              </div>
              <Link to="/features">
                <Button variant="hero" className="gap-2 group/btn">
                  See All Features
                  <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default Features;
