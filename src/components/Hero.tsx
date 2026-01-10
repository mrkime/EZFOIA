import { Button } from "@/components/ui/button";
import { ArrowRight, Shield, Clock, FileSearch } from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
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
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"]
  });

  // Parallax transforms - different speeds for depth effect
  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const contentY = useTransform(scrollYProgress, [0, 1], ["0%", "15%"]);
  const badgeY = useTransform(scrollYProgress, [0, 1], ["0%", "25%"]);
  const cardsY = useTransform(scrollYProgress, [0, 1], ["0%", "8%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  return (
    <section 
      ref={sectionRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-hero-gradient pt-20"
    >
      {/* Animated Grid Background with parallax */}
      <motion.div 
        className="absolute inset-0"
        style={{ y: backgroundY }}
      >
        <AnimatedGrid />
      </motion.div>

      <div className="container mx-auto px-6 relative z-10">
        <motion.div 
          className="max-w-4xl mx-auto text-center"
          style={{ opacity }}
        >
          {/* Badge */}
          <motion.div 
            className="inline-flex items-center gap-2 glass rounded-full px-4 py-2 mb-8 animate-fade-in"
            style={{ y: badgeY }}
          >
            <Shield className="w-4 h-4 text-primary" />
            <span className="text-sm text-muted-foreground">Powered by ClearSightAI</span>
          </motion.div>

          {/* Headline */}
          <motion.h1 
            className="font-display text-4xl md:text-6xl lg:text-7xl font-bold mb-6 animate-fade-in"
            style={{ y: contentY, animationDelay: '0.1s' }}
          >
            FOIA Requests Made{' '}
            <span className="text-gradient">Effortlessly Simple</span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p 
            className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 animate-fade-in"
            style={{ y: contentY, animationDelay: '0.2s' }}
          >
            Request public records as easily as buying something online. We handle the paperwork, 
            you track progress in real-time, and our AI helps you search through your documents.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div 
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16 animate-fade-in"
            style={{ y: contentY, animationDelay: '0.3s' }}
          >
            <RequestFormModal>
              <motion.div
                className="relative group cursor-pointer"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {/* Ripple border effect */}
                <motion.div
                  className="absolute -inset-[2px] rounded-xl bg-gradient-to-r from-primary via-primary/50 to-primary opacity-75"
                  animate={{
                    backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: 'linear',
                  }}
                  style={{ backgroundSize: '200% 200%' }}
                />
                {/* Outer ripple pulse */}
                <motion.div
                  className="absolute -inset-1 rounded-xl bg-primary/30 blur-sm"
                  animate={{
                    scale: [1, 1.05, 1],
                    opacity: [0.5, 0.8, 0.5],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                />
                <Button variant="hero" size="xl" className="relative">
                  <span>Start Your Request</span>
                  {/* Animated arrow */}
                  <motion.span
                    className="inline-flex"
                    animate={{
                      x: [0, 4, 0],
                    }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      ease: 'easeInOut',
                    }}
                  >
                    <ArrowRight className="w-5 h-5" />
                  </motion.span>
                </Button>
              </motion.div>
            </RequestFormModal>
            <Button variant="heroOutline" size="xl" onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })}>
              See How It Works
            </Button>
          </motion.div>

          {/* Trust Indicators */}
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in"
            style={{ y: cardsY, animationDelay: '0.4s' }}
          >
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
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
