import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { FoiaWizardModal } from "./foia-wizard";

const AnimatedGrid = () => {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Subtle background tint for light mode contrast */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary/[0.03] via-transparent to-primary/[0.02] dark:from-transparent dark:to-transparent" />
      
      {/* Base grid pattern - stronger in light mode */}
      <div 
        className="absolute inset-0 opacity-20 dark:opacity-[0.15]"
        style={{
          backgroundImage: `
            linear-gradient(to right, hsl(var(--primary) / 0.5) 1px, transparent 1px),
            linear-gradient(to bottom, hsl(var(--primary) / 0.5) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
        }}
      />
      
      {/* Animated glow lines - horizontal - stronger for light mode */}
      {[...Array(3)].map((_, i) => (
        <motion.div
          key={`h-${i}`}
          className="absolute h-[2px] dark:h-[1px] left-0 right-0"
          style={{ 
            top: `${25 + i * 25}%`,
            background: 'linear-gradient(90deg, transparent, hsl(var(--primary) / 0.8), transparent)',
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
      
      {/* Animated glow lines - vertical - stronger for light mode */}
      {[...Array(2)].map((_, i) => (
        <motion.div
          key={`v-${i}`}
          className="absolute w-[2px] dark:w-[1px] top-0 bottom-0"
          style={{ 
            left: `${35 + i * 30}%`,
            background: 'linear-gradient(180deg, transparent, hsl(var(--primary) / 0.7), transparent)',
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
      
      {/* Grid intersection glows - stronger in light mode */}
      {[...Array(4)].map((_, i) => (
        <motion.div
          key={`glow-${i}`}
          className="absolute w-32 h-32 rounded-full"
          style={{
            left: `${20 + (i % 2) * 50}%`,
            top: `${25 + Math.floor(i / 2) * 40}%`,
            background: 'radial-gradient(circle, hsl(var(--primary) / 0.25) 0%, transparent 70%)',
          }}
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.4, 0.7, 0.4],
          }}
          transition={{
            duration: 4 + i,
            repeat: Infinity,
            delay: i * 0.8,
            ease: 'easeInOut',
          }}
        />
      ))}
      
      {/* Corner accent gradients - enhanced for light mode */}
      <div className="absolute top-0 left-0 w-1/2 h-1/2 bg-gradient-to-br from-primary/10 dark:from-primary/5 to-transparent" />
      <div className="absolute bottom-0 right-0 w-1/2 h-1/2 bg-gradient-to-tl from-primary/10 dark:from-primary/5 to-transparent" />
    </div>
  );
};

const CTA = () => {
  return (
    <section className="py-24 bg-section-alt dark:bg-card relative overflow-hidden">
      {/* Section divider */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
      
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/10 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="glass rounded-3xl p-12 md:p-16 text-center max-w-4xl mx-auto relative overflow-hidden">
          {/* Animated Grid Background inside the bubble */}
          <AnimatedGrid />
          <h2 className="font-display text-3xl md:text-5xl font-bold mb-6 relative z-10">
            Ready to Unlock{' '}
            <span className="text-gradient">Public Records?</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto mb-10 relative z-10">
            Join thousands of journalists, researchers, and citizens who use EZFOIA 
            to access the information they deserve. Start your first request today.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 relative z-10">
            <FoiaWizardModal>
              <motion.div
                className="relative group cursor-pointer"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {/* Water ripple rings */}
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    className="absolute -inset-1 rounded-xl border border-primary/40"
                    initial={{ scale: 1, opacity: 0.6 }}
                    animate={{
                      scale: [1, 1.06, 1.12],
                      opacity: [0.5, 0.25, 0],
                    }}
                    transition={{
                      duration: 2.5,
                      repeat: Infinity,
                      delay: i * 0.8,
                      ease: [0.25, 0.1, 0.25, 1],
                    }}
                  />
                ))}
                {/* Subtle inner glow */}
                <motion.div
                  className="absolute -inset-[1px] rounded-xl bg-primary/20"
                  animate={{
                    opacity: [0.3, 0.5, 0.3],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                />
                <Button variant="hero" size="xl" className="relative">
                  <span>Start Your First Request</span>
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
            </FoiaWizardModal>
            <Link to="/contact">
              <Button variant="heroOutline" size="xl">
                Talk to Our Team
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTA;
