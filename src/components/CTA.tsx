import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
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
      {[...Array(3)].map((_, i) => (
        <motion.div
          key={`h-${i}`}
          className="absolute h-[1px] left-0 right-0"
          style={{ 
            top: `${25 + i * 25}%`,
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
      {[...Array(2)].map((_, i) => (
        <motion.div
          key={`v-${i}`}
          className="absolute w-[1px] top-0 bottom-0"
          style={{ 
            left: `${35 + i * 30}%`,
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
      {[...Array(4)].map((_, i) => (
        <motion.div
          key={`glow-${i}`}
          className="absolute w-32 h-32 rounded-full"
          style={{
            left: `${20 + (i % 2) * 50}%`,
            top: `${25 + Math.floor(i / 2) * 40}%`,
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

const CTA = () => {
  return (
    <section className="py-24 bg-card relative overflow-hidden">
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
            </RequestFormModal>
            <Button variant="heroOutline" size="xl">
              Talk to Our Team
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTA;
