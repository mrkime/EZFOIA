import { motion } from "framer-motion";
import { Sparkles, FileCheck, Scale, Search, Wand2 } from "lucide-react";

const LOADING_STEPS = [
  { icon: Search, text: "Analyzing your request..." },
  { icon: Scale, text: "Applying legal requirements..." },
  { icon: FileCheck, text: "Optimizing for approval..." },
  { icon: Wand2, text: "Drafting your letter..." },
];

export const GeneratingStep = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="py-12 text-center"
    >
      {/* Animated Icon */}
      <div className="relative w-24 h-24 mx-auto mb-8">
        <motion.div
          className="absolute inset-0 rounded-full bg-primary/20"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.5, 0.2, 0.5],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute inset-2 rounded-full bg-primary/30"
          animate={{
            scale: [1, 1.15, 1],
            opacity: [0.6, 0.3, 0.6],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.2,
          }}
        />
        <div className="absolute inset-4 rounded-full bg-primary/10 flex items-center justify-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          >
            <Sparkles className="w-10 h-10 text-primary" />
          </motion.div>
        </div>
      </div>

      {/* Title */}
      <h2 className="font-display text-2xl md:text-3xl font-bold mb-4">
        Drafting Your FOIA Request
      </h2>
      <p className="text-muted-foreground mb-8">
        Creating a legally optimized request tailored to your agency...
      </p>

      {/* Loading Steps */}
      <div className="space-y-3 max-w-sm mx-auto">
        {LOADING_STEPS.map((step, index) => (
          <motion.div
            key={step.text}
            className="flex items-center gap-3 px-4 py-2 rounded-lg bg-muted/30"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 1.5 }}
          >
            <motion.div
              animate={{ 
                scale: [1, 1.2, 1],
                opacity: [0.5, 1, 0.5] 
              }}
              transition={{ 
                duration: 1.5, 
                repeat: Infinity,
                delay: index * 1.5 
              }}
            >
              <step.icon className="w-5 h-5 text-primary" />
            </motion.div>
            <span className="text-sm">{step.text}</span>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};
