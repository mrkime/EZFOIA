import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { WIZARD_STEPS, WizardStep } from "./types";

interface WizardProgressProps {
  currentStep: WizardStep;
  completedSteps: WizardStep[];
}

export const WizardProgress = ({ currentStep, completedSteps }: WizardProgressProps) => {
  const currentIndex = WIZARD_STEPS.findIndex(s => s.id === currentStep);
  
  // Don't show progress for special steps
  if (["generating", "preview", "plan-selection", "success"].includes(currentStep)) {
    return null;
  }

  return (
    <div className="w-full mb-8">
      {/* Progress bar */}
      <div className="relative h-1 bg-muted rounded-full overflow-hidden mb-4">
        <motion.div
          className="absolute inset-y-0 left-0 bg-primary rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${((currentIndex + 1) / WIZARD_STEPS.length) * 100}%` }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        />
      </div>

      {/* Step indicators */}
      <div className="flex justify-between">
        {WIZARD_STEPS.map((step, index) => {
          const isCompleted = completedSteps.includes(step.id);
          const isCurrent = step.id === currentStep;
          const isPast = index < currentIndex;

          return (
            <div key={step.id} className="flex flex-col items-center">
              <motion.div
                className={`
                  w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold
                  transition-colors duration-200
                  ${isCompleted || isPast
                    ? "bg-primary text-primary-foreground"
                    : isCurrent
                    ? "bg-primary/20 text-primary border-2 border-primary"
                    : "bg-muted text-muted-foreground"
                  }
                `}
                initial={{ scale: 0.8 }}
                animate={{ scale: isCurrent ? 1.1 : 1 }}
                transition={{ duration: 0.2 }}
              >
                {isCompleted || isPast ? (
                  <Check className="w-4 h-4" />
                ) : (
                  index + 1
                )}
              </motion.div>
              <span 
                className={`
                  mt-1 text-xs hidden sm:block
                  ${isCurrent ? "text-primary font-medium" : "text-muted-foreground"}
                `}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
