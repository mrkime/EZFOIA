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
    <div className="w-full">
      {/* Progress bar container */}
      <div className="relative h-2 bg-muted/50 rounded-full overflow-hidden mb-3">
        {/* Animated progress fill */}
        <motion.div
          className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-primary to-primary/90"
          initial={{ width: 0, opacity: 0 }}
          animate={{ width: `${progressPercent}%`, opacity: 1 }}
          transition={{ 
            duration: 0.6, 
            ease: [0.34, 1.56, 0.64, 1], // Bouncy ease
            opacity: { duration: 0.2 }
          }}
        />
        
        {/* Glowing tip that follows the progress */}
        <motion.div
          className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-primary shadow-lg shadow-primary/50"
          initial={{ left: 0, scale: 0 }}
          animate={{ 
            left: `calc(${progressPercent}% - 6px)`,
            scale: [1, 1.3, 1]
          }}
          transition={{ 
            left: { duration: 0.6, ease: [0.34, 1.56, 0.64, 1] },
            scale: { duration: 0.4, delay: 0.3 }
          }}
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
                  className="absolute w-8 h-8 rounded-full border-2 border-primary"
                  initial={{ scale: 1, opacity: 0.8 }}
                  animate={{ scale: 1.6, opacity: 0 }}
                  transition={{ 
                    duration: 0.6,
                    ease: "easeOut"
                  }}
                />
              )}
              
              <motion.div
                className={`
                  relative w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold
                  ${isCompleted || isPast
                    ? "bg-primary text-primary-foreground shadow-md shadow-primary/25"
                    : isCurrent
                    ? "bg-primary/20 text-primary border-2 border-primary"
                    : "bg-muted/80 text-muted-foreground border border-border"
                  }
                `}
                initial={false}
                animate={{ 
                  scale: isCurrent ? [1, 1.2, 1.1] : isPast ? [1.2, 1] : 1,
                  rotate: isCurrent ? [0, -5, 5, 0] : 0
                }}
                transition={{ 
                  duration: 0.5,
                  ease: "easeOut"
                }}
              >
                {isCompleted || isPast ? (
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ 
                      type: "spring",
                      stiffness: 500,
                      damping: 15,
                      delay: 0.1
                    }}
                  >
                    <Check className="w-4 h-4" strokeWidth={3} />
                  </motion.div>
                ) : isCurrent ? (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
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
                animate={{ 
                  y: isCurrent ? [5, 0] : 0,
                  opacity: isCurrent ? [0.5, 1] : 1
                }}
                transition={{ duration: 0.3 }}
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
