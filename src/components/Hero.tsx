import { Button } from "@/components/ui/button";
import { ArrowRight, Shield, Clock, FileSearch } from "lucide-react";
import { motion } from "framer-motion";
import RequestFormModal from "./RequestFormModal";

const AnimatedGrid = () => {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Base grid pattern */}
      <div 
        className="absolute inset-0 opacity-[0.15]"
        style={{
          backgroundImage: `
            linear-gradient(to right, hsl(var(--primary) / 0.3) 1px, transparent 1px),
            linear-gradient(to bottom, hsl(var(--primary) / 0.3) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
        }}
      />
      
      {/* Animated glow lines - horizontal */}
      {[...Array(4)].map((_, i) => (
        <motion.div
          key={`h-${i}`}
          className="absolute h-[1px] left-0 right-0"
          style={{ 
            top: `${20 + i * 20}%`,
            background: 'linear-gradient(90deg, transparent, hsl(var(--primary) / 0.6), transparent)',
          }}
          initial={{ x: '-100%', opacity: 0 }}
          animate={{ 
            x: ['100%', '-100%'],
            opacity: [0, 1, 1, 0],
          }}
          transition={{
            duration: 8 + i * 2,
            repeat: Infinity,
            delay: i * 2,
            ease: 'linear',
          }}
        />
      ))}
      
      {/* Animated glow lines - vertical */}
      {[...Array(3)].map((_, i) => (
        <motion.div
          key={`v-${i}`}
          className="absolute w-[1px] top-0 bottom-0"
          style={{ 
            left: `${25 + i * 25}%`,
            background: 'linear-gradient(180deg, transparent, hsl(var(--primary) / 0.5), transparent)',
          }}
          initial={{ y: '-100%', opacity: 0 }}
          animate={{ 
            y: ['100%', '-100%'],
            opacity: [0, 1, 1, 0],
          }}
          transition={{
            duration: 10 + i * 2,
            repeat: Infinity,
            delay: i * 3,
            ease: 'linear',
          }}
        />
      ))}
      
      {/* Grid intersection glows */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={`glow-${i}`}
          className="absolute w-32 h-32 rounded-full"
          style={{
            left: `${15 + (i % 3) * 30}%`,
            top: `${20 + Math.floor(i / 3) * 40}%`,
            background: 'radial-gradient(circle, hsl(var(--primary) / 0.15) 0%, transparent 70%)',
          }}
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 4 + i,
            repeat: Infinity,
            delay: i * 0.8,
            ease: 'easeInOut',
          }}
        />
      ))}
      
      {/* Corner accent gradients */}
      <div className="absolute top-0 left-0 w-1/2 h-1/2 bg-gradient-to-br from-primary/5 to-transparent" />
      <div className="absolute bottom-0 right-0 w-1/2 h-1/2 bg-gradient-to-tl from-primary/5 to-transparent" />
    </div>
  );
};

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-hero-gradient pt-20">
      {/* Animated Grid Background */}
      <AnimatedGrid />

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 glass rounded-full px-4 py-2 mb-8 animate-fade-in">
            <Shield className="w-4 h-4 text-primary" />
            <span className="text-sm text-muted-foreground">Powered by ClearSightAI</span>
          </div>

          {/* Headline */}
          <h1 className="font-display text-4xl md:text-6xl lg:text-7xl font-bold mb-6 animate-fade-in" style={{ animationDelay: '0.1s' }}>
            FOIA Requests Made{' '}
            <span className="text-gradient">Effortlessly Simple</span>
          </h1>

          {/* Subheadline */}
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 animate-fade-in" style={{ animationDelay: '0.2s' }}>
            Request public records as easily as buying something online. We handle the paperwork, 
            you track progress in real-time, and our AI helps you search through your documents.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16 animate-fade-in" style={{ animationDelay: '0.3s' }}>
            <RequestFormModal>
              <Button variant="hero" size="xl">
                Start Your Request
                <ArrowRight className="w-5 h-5" />
              </Button>
            </RequestFormModal>
            <Button variant="heroOutline" size="xl" onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })}>
              See How It Works
            </Button>
          </div>

          {/* Trust Indicators */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in" style={{ animationDelay: '0.4s' }}>
            <div className="glass rounded-xl p-6 hover:border-primary/30 transition-colors">
              <Clock className="w-8 h-8 text-primary mb-3 mx-auto" />
              <h3 className="font-display font-semibold mb-1">Real-Time Tracking</h3>
              <p className="text-sm text-muted-foreground">Get SMS updates on your request status</p>
            </div>
            <div className="glass rounded-xl p-6 hover:border-primary/30 transition-colors">
              <FileSearch className="w-8 h-8 text-primary mb-3 mx-auto" />
              <h3 className="font-display font-semibold mb-1">AI-Powered Search</h3>
              <p className="text-sm text-muted-foreground">Search through your documents instantly</p>
            </div>
            <div className="glass rounded-xl p-6 hover:border-primary/30 transition-colors">
              <Shield className="w-8 h-8 text-primary mb-3 mx-auto" />
              <h3 className="font-display font-semibold mb-1">Fully Managed</h3>
              <p className="text-sm text-muted-foreground">We handle all the complexity for you</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
