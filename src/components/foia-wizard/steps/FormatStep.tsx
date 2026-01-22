import { motion } from "framer-motion";
import { FileOutput, Monitor, Archive, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { WizardState } from "../types";

interface FormatStepProps {
  data: WizardState;
  onUpdate: (updates: Partial<WizardState>) => void;
  onNext: () => void;
  onBack: () => void;
}

const FORMAT_OPTIONS = [
  {
    value: "digital" as const,
    icon: Monitor,
    label: "Digital",
    description: "PDF, email, video files — fastest delivery",
  },
  {
    value: "physical" as const,
    icon: Archive,
    label: "Physical copies",
    description: "Printed documents mailed to you",
  },
  {
    value: "easiest" as const,
    icon: Zap,
    label: "Whatever is easiest",
    description: "Let the agency choose the format",
  },
];

export const FormatStep = ({ data, onUpdate, onNext, onBack }: FormatStepProps) => {
  const isValid = data.formatPreference !== "";

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      {/* Question Header */}
      <div className="text-center mb-8">
        <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
          <FileOutput className="w-7 h-7 text-primary" />
        </div>
        <h2 className="font-display text-2xl md:text-3xl font-bold mb-2">
          How would you like to receive the records?
        </h2>
        <p className="text-muted-foreground">
          Digital is usually faster and often has lower fees.
        </p>
      </div>

      {/* Format Options */}
      <div className="space-y-3">
        {FORMAT_OPTIONS.map((option) => (
          <button
            key={option.value}
            type="button"
            className={`w-full p-5 rounded-xl border text-left transition-all flex items-start gap-4 ${
              data.formatPreference === option.value
                ? "border-primary bg-primary/5 ring-2 ring-primary"
                : "border-border hover:border-primary/50"
            }`}
            onClick={() => onUpdate({ formatPreference: option.value })}
          >
            <div className={`p-2 rounded-lg ${
              data.formatPreference === option.value 
                ? "bg-primary text-primary-foreground" 
                : "bg-muted"
            }`}>
              <option.icon className="w-5 h-5" />
            </div>
            <div>
              <div className="font-medium text-lg">{option.label}</div>
              <p className="text-sm text-muted-foreground">{option.description}</p>
            </div>
          </button>
        ))}
      </div>

      {/* Navigation */}
      <div className="flex gap-3 pt-4">
        <Button variant="outline" size="lg" className="flex-1 h-14" onClick={onBack}>
          Back
        </Button>
        <Button
          variant="hero"
          size="lg"
          className="flex-[2] h-14 text-lg"
          disabled={!isValid}
          onClick={onNext}
        >
          Continue
        </Button>
      </div>
    </motion.div>
  );
};
