import { motion } from "framer-motion";
import { Check, Sparkles } from "lucide-react";
import { WIZARD_STEPS, WizardStep } from "./types";

interface WizardProgressProps {
  currentStep: WizardStep;
  completedSteps: WizardStep[];
}

export const WizardProgress = ({ currentStep, completedSteps }: WizardProgressProps) => {
  const currentIndex = WIZARD_STEPS.findIndex(s => s.id === currentStep);
  
  // Don't show progress for special steps
  if (["generating", "preview", "auth", "plan-selection", "success"].includes(currentStep)) {
    return null;
  }

  const progressPercent = ((currentIndex + 1) / WIZARD_STEPS.length) * 100;

  return (
    <div className="w-full mb-8">
      {/* Progress bar container */}
      <div className="relative h-2 bg-muted/50 rounded-full overflow-hidden mb-4 backdrop-blur-sm">
        {/* Animated gradient background */}
        <motion.div
          className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-primary via-primary/80 to-primary"
          initial={{ width: 0 }}
          animate={{ width: `${progressPercent}%` }}
          transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
        >
          {/* Shimmer overlay */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
            animate={{ x: ["-100%", "200%"] }}
            transition={{ 
              duration: 1.5, 
              repeat: Infinity, 
              repeatDelay: 1,
              ease: "easeInOut"
            }}
          />
        </motion.div>
        
        {/* Glowing edge effect */}
        <motion.div
          className="absolute top-0 bottom-0 w-4 bg-gradient-to-r from-primary/50 to-primary blur-sm"
          initial={{ left: "-1rem" }}
          animate={{ left: `calc(${progressPercent}% - 1rem)` }}
          transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
        />
      </div>

      {/* Step indicators */}
      <div className="flex justify-between">
        {WIZARD_STEPS.map((step, index) => {
          const isCompleted = completedSteps.includes(step.id);
          const isCurrent = step.id === currentStep;
          const isPast = index < currentIndex;

          return (
            <div key={step.id} className="flex flex-col items-center relative">
              {/* Pulse ring for current step */}
              {isCurrent && (
                <motion.div
                  className="absolute inset-0 w-8 h-8 rounded-full bg-primary/20"
                  animate={{ 
                    scale: [1, 1.5, 1],
                    opacity: [0.5, 0, 0.5]
                  }}
                  transition={{ 
                    duration: 2, 
                    repeat: Infinity,
                    ease: "easeOut"
                  }}
                />
              )}
              
              <motion.div
                className={`
                  relative w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold
                  transition-all duration-300 shadow-sm
                  ${isCompleted || isPast
                    ? "bg-gradient-to-br from-primary to-primary/80 text-primary-foreground shadow-primary/25 shadow-md"
                    : isCurrent
                    ? "bg-gradient-to-br from-primary/30 to-primary/10 text-primary border-2 border-primary shadow-primary/20 shadow-lg"
                    : "bg-muted/80 text-muted-foreground border border-border"
                  }
                `}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ 
                  scale: isCurrent ? 1.15 : 1,
                  opacity: 1
                }}
                transition={{ 
                  duration: 0.3,
                  type: "spring",
                  stiffness: 300,
                  damping: 20
                }}
                whileHover={{ scale: 1.1 }}
              >
                {isCompleted || isPast ? (
                  <motion.div
                    initial={{ scale: 0, rotate: -45 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ 
                      type: "spring",
                      stiffness: 400,
                      damping: 15
                    }}
                  >
                    <Check className="w-4 h-4" />
                  </motion.div>
                ) : isCurrent ? (
                  <motion.div
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ 
                      duration: 2, 
                      repeat: Infinity,
                      repeatDelay: 3
                    }}
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                  </motion.div>
                ) : (
                  <span className="opacity-70">{index + 1}</span>
                )}
              </motion.div>
              
              <motion.span 
                className={`
                  mt-2 text-xs hidden sm:block font-medium
                  ${isCurrent 
                    ? "text-primary" 
                    : isCompleted || isPast 
                      ? "text-foreground/80" 
                      : "text-muted-foreground"
                  }
                `}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                {step.label}
              </motion.span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
