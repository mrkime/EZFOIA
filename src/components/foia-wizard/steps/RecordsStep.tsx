import { motion } from "framer-motion";
import { FileText, Lightbulb } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { WizardState } from "../types";

interface RecordsStepProps {
  data: WizardState;
  onUpdate: (updates: Partial<WizardState>) => void;
  onNext: () => void;
  onBack: () => void;
}

const EXAMPLES = [
  "All emails between the mayor's office and city contractors from 2023",
  "Body camera footage from the arrest on Main Street on January 15, 2024",
  "Budget documents for the public school construction project",
  "Communications about the proposed zoning changes in District 5",
  "Contracts with third-party vendors for IT services",
];

export const RecordsStep = ({ data, onUpdate, onNext, onBack }: RecordsStepProps) => {
  const isValid = data.recordsDescription.trim().length >= 10;
  const charCount = data.recordsDescription.length;

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
          <FileText className="w-7 h-7 text-primary" />
        </div>
        <h2 className="font-display text-2xl md:text-3xl font-bold mb-2">
          What records are you trying to obtain?
        </h2>
        <p className="text-muted-foreground">
          Just describe it in your own words — no legal language needed.
        </p>
      </div>

      {/* Description Input */}
      <div className="space-y-2">
        <Label htmlFor="recordsDescription">Description</Label>
        <Textarea
          id="recordsDescription"
          placeholder="Describe the documents, emails, reports, or other records you're looking for..."
          value={data.recordsDescription}
          onChange={(e) => onUpdate({ recordsDescription: e.target.value })}
          className="min-h-[150px] text-base resize-none"
          autoFocus
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>{charCount < 10 ? `At least ${10 - charCount} more characters needed` : "✓ Good description"}</span>
          <span>{charCount} / 2000</span>
        </div>
      </div>

      {/* Examples Section */}
      <div className="bg-muted/30 rounded-xl p-4 border border-border">
        <div className="flex items-center gap-2 mb-3">
          <Lightbulb className="w-4 h-4 text-amber-400" />
          <span className="text-sm font-medium">Example requests</span>
        </div>
        <ul className="space-y-2">
          {EXAMPLES.map((example, index) => (
            <li key={index} className="text-sm text-muted-foreground">
              <button
                type="button"
                className="text-left hover:text-foreground transition-colors"
                onClick={() => onUpdate({ recordsDescription: example })}
              >
                "{example}"
              </button>
            </li>
          ))}
        </ul>
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
