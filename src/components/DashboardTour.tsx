import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { X, ArrowRight, ArrowLeft, Sparkles, FileText, Settings, CreditCard, LayoutDashboard } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";

interface TourStep {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  target?: string;
}

const tourSteps: TourStep[] = [
  {
    id: "welcome",
    title: "Welcome to Your Dashboard! 🎉",
    description: "Let me give you a quick tour of everything you can do here. This will only take a minute!",
    icon: <LayoutDashboard className="h-6 w-6" />,
  },
  {
    id: "summary",
    title: "Your Request Summary",
    description: "At the top, you'll see your subscription status and a quick overview of all your FOIA requests - pending, in progress, and completed.",
    icon: <CreditCard className="h-6 w-6" />,
    target: "summary",
  },
  {
    id: "requests",
    title: "My Requests Tab",
    description: "This is where you'll find all your FOIA requests. You can search, filter by status, and click any request to see its full details and timeline.",
    icon: <FileText className="h-6 w-6" />,
    target: "requests",
  },
  {
    id: "settings",
    title: "Account Settings",
    description: "Manage your profile, notification preferences, and billing here. You can also upgrade your plan or access the Stripe customer portal.",
    icon: <Settings className="h-6 w-6" />,
    target: "settings",
  },
  {
    id: "complete",
    title: "You're All Set! 🚀",
    description: "That's everything! You're ready to start making FOIA requests. If you ever need help, just click the AI assistant button in the bottom right.",
    icon: <Sparkles className="h-6 w-6" />,
  },
];

interface DashboardTourProps {
  onComplete: () => void;
  onSkip: () => void;
}

const DashboardTour = ({ onComplete, onSkip }: DashboardTourProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  const triggerConfetti = useCallback(() => {
    const duration = 3000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 9999 };

    const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

    const interval = setInterval(() => {
      const timeLeft = animationEnd - Date.now();
      if (timeLeft <= 0) {
        clearInterval(interval);
        return;
      }

      const particleCount = 50 * (timeLeft / duration);

      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
        colors: ['#3b82f6', '#8b5cf6', '#06b6d4', '#10b981', '#f59e0b'],
      });
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
        colors: ['#3b82f6', '#8b5cf6', '#06b6d4', '#10b981', '#f59e0b'],
      });
    }, 250);
  }, []);

  const handleNext = () => {
    if (currentStep < tourSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      triggerConfetti();
      setTimeout(() => {
        setIsVisible(false);
        onComplete();
      }, 500);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSkip = () => {
    setIsVisible(false);
    onSkip();
  };

  const progress = ((currentStep + 1) / tourSteps.length) * 100;
  const step = tourSteps[currentStep];
  const isLastStep = currentStep === tourSteps.length - 1;
  const isFirstStep = currentStep === 0;

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100]"
            onClick={handleSkip}
          />

          {/* Tour Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[101] w-full max-w-md px-4"
          >
            <Card className="p-6 shadow-2xl border-2 border-primary/20 bg-background">
              {/* Skip button */}
              <Button
                variant="ghost"
                size="icon"
                onClick={handleSkip}
                className="absolute top-3 right-3 h-8 w-8 text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </Button>

              {/* Progress */}
              <div className="mb-6">
                <div className="flex justify-between text-xs text-muted-foreground mb-2">
                  <span>Step {currentStep + 1} of {tourSteps.length}</span>
                  <span>{Math.round(progress)}%</span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>

              {/* Icon */}
              <motion.div
                key={step.id}
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center mx-auto mb-4 text-primary-foreground"
              >
                {step.icon}
              </motion.div>

              {/* Content */}
              <motion.div
                key={`content-${step.id}`}
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.15 }}
                className="text-center mb-6"
              >
                <h3 className="text-xl font-bold mb-2">{step.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {step.description}
                </p>
              </motion.div>

              {/* Navigation */}
              <div className="flex gap-3">
                {!isFirstStep && (
                  <Button
                    variant="outline"
                    onClick={handlePrevious}
                    className="flex-1"
                  >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back
                  </Button>
                )}
                <Button
                  onClick={handleNext}
                  className={`flex-1 ${isFirstStep ? 'w-full' : ''}`}
                >
                  {isLastStep ? (
                    <>
                      <Sparkles className="h-4 w-4 mr-2" />
                      Finish Tour
                    </>
                  ) : (
                    <>
                      Next
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </>
                  )}
                </Button>
              </div>

              {/* Skip hint */}
              <p className="text-center text-xs text-muted-foreground mt-4">
                Press Escape or click outside to skip
              </p>
            </Card>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default DashboardTour;
