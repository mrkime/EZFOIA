import { motion } from "framer-motion";
import { Users, FileDigit, MapPin } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { WizardState } from "../types";

interface IdentifiersStepProps {
  data: WizardState;
  onUpdate: (updates: Partial<WizardState>) => void;
  onNext: () => void;
  onBack: () => void;
}

export const IdentifiersStep = ({ data, onUpdate, onNext, onBack }: IdentifiersStepProps) => {
  // This step is optional, so always valid
  const hasAnyData = data.relatedNames || data.caseNumber || data.relatedAddress;

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
          <FileDigit className="w-7 h-7 text-primary" />
        </div>
        <h2 className="font-display text-2xl md:text-3xl font-bold mb-2">
          Is this related to a person, case, or address?
        </h2>
        <p className="text-muted-foreground">
          Optional — but helps narrow down the search.
        </p>
      </div>

      {/* Optional Fields */}
      <div className="space-y-5">
        {/* Related Names */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-muted-foreground" />
            <Label htmlFor="relatedNames">Person or Organization Name(s)</Label>
          </div>
          <Input
            id="relatedNames"
            placeholder="e.g., John Smith, ABC Corporation"
            value={data.relatedNames}
            onChange={(e) => onUpdate({ relatedNames: e.target.value })}
            className="h-12"
          />
        </div>

        {/* Case Number */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <FileDigit className="w-4 h-4 text-muted-foreground" />
            <Label htmlFor="caseNumber">Case or Reference Number</Label>
          </div>
          <Input
            id="caseNumber"
            placeholder="e.g., Case #2024-001234"
            value={data.caseNumber}
            onChange={(e) => onUpdate({ caseNumber: e.target.value })}
            className="h-12"
          />
        </div>

        {/* Related Address */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-muted-foreground" />
            <Label htmlFor="relatedAddress">Related Address or Location</Label>
          </div>
          <Input
            id="relatedAddress"
            placeholder="e.g., 123 Main Street, Austin, TX"
            value={data.relatedAddress}
            onChange={(e) => onUpdate({ relatedAddress: e.target.value })}
            className="h-12"
          />
        </div>
      </div>

      {/* Helper text */}
      <p className="text-sm text-muted-foreground text-center">
        {hasAnyData 
          ? "Great — this info will help narrow down your request."
          : "You can skip this if none of these apply."}
      </p>

      {/* Navigation */}
      <div className="flex gap-3 pt-4">
        <Button variant="outline" size="lg" className="flex-1 h-14" onClick={onBack}>
          Back
        </Button>
        <Button
          variant="hero"
          size="lg"
          className="flex-[2] h-14 text-lg"
          onClick={onNext}
        >
          {hasAnyData ? "Continue" : "Skip"}
        </Button>
      </div>
    </motion.div>
  );
};
