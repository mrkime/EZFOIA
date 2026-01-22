import { motion } from "framer-motion";
import { MessageSquare, Sparkles } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { WizardState } from "../types";

interface ContextStepProps {
  data: WizardState;
  onUpdate: (updates: Partial<WizardState>) => void;
  onGenerate: () => void;
  onBack: () => void;
}

export const ContextStep = ({ data, onUpdate, onGenerate, onBack }: ContextStepProps) => {
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
          <MessageSquare className="w-7 h-7 text-primary" />
        </div>
        <h2 className="font-display text-2xl md:text-3xl font-bold mb-2">
          Anything else that might help?
        </h2>
        <p className="text-muted-foreground">
          Optional — add any context that could help locate your records.
        </p>
      </div>

      {/* Context Input */}
      <div className="space-y-2">
        <Label htmlFor="additionalContext">Additional Context</Label>
        <Textarea
          id="additionalContext"
          placeholder="Any additional details, background information, or specific requirements..."
          value={data.additionalContext}
          onChange={(e) => onUpdate({ additionalContext: e.target.value })}
          className="min-h-[120px] text-base resize-none"
        />
        <p className="text-xs text-muted-foreground">
          Examples: "I'm a journalist researching...", "I need these for a legal matter...", "Looking for records about an event that happened..."
        </p>
      </div>

      {/* Summary Preview */}
      <div className="bg-muted/30 rounded-xl p-4 border border-border">
        <h4 className="font-medium text-sm mb-2 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-primary" />
          What happens next
        </h4>
        <p className="text-sm text-muted-foreground">
          Our AI will draft a complete, legally-optimized FOIA request letter based on your answers. 
          You'll be able to review and edit it before submission.
        </p>
      </div>

      {/* Navigation */}
      <div className="flex gap-3 pt-4">
        <Button variant="outline" size="lg" className="flex-1 h-14" onClick={onBack}>
          Back
        </Button>
        <Button
          variant="hero"
          size="lg"
          className="flex-[2] h-14 text-lg gap-2"
          onClick={onGenerate}
        >
          <Sparkles className="w-5 h-5" />
          Generate My Request
        </Button>
      </div>
    </motion.div>
  );
};
