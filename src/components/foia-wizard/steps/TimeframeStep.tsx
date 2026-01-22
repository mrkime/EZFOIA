import { motion } from "framer-motion";
import { Calendar, HelpCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { WizardState } from "../types";

interface TimeframeStepProps {
  data: WizardState;
  onUpdate: (updates: Partial<WizardState>) => void;
  onNext: () => void;
  onBack: () => void;
}

export const TimeframeStep = ({ data, onUpdate, onNext, onBack }: TimeframeStepProps) => {
  const isValid = data.dateType !== "";

  const handleDateTypeSelect = (type: "exact" | "range" | "not-sure") => {
    onUpdate({ 
      dateType: type,
      // Clear other date fields when switching types
      ...(type !== "exact" && { exactDate: "" }),
      ...(type !== "range" && { dateRangeStart: "", dateRangeEnd: "" }),
    });
  };

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
          <Calendar className="w-7 h-7 text-primary" />
        </div>
        <h2 className="font-display text-2xl md:text-3xl font-bold mb-2">
          Do you know when these records were created?
        </h2>
        <p className="text-muted-foreground">
          A timeframe helps narrow down the search.
        </p>
      </div>

      {/* Date Type Options */}
      <div className="space-y-3">
        {/* Exact Date */}
        <button
          type="button"
          className={`w-full p-4 rounded-xl border text-left transition-all ${
            data.dateType === "exact"
              ? "border-primary bg-primary/5 ring-2 ring-primary"
              : "border-border hover:border-primary/50"
          }`}
          onClick={() => handleDateTypeSelect("exact")}
        >
          <div className="font-medium mb-1">Specific date</div>
          <p className="text-sm text-muted-foreground">I know the exact date or approximate date</p>
        </button>

        {/* Date Range */}
        <button
          type="button"
          className={`w-full p-4 rounded-xl border text-left transition-all ${
            data.dateType === "range"
              ? "border-primary bg-primary/5 ring-2 ring-primary"
              : "border-border hover:border-primary/50"
          }`}
          onClick={() => handleDateTypeSelect("range")}
        >
          <div className="font-medium mb-1">Date range</div>
          <p className="text-sm text-muted-foreground">I know the general timeframe (e.g., 2023)</p>
        </button>

        {/* Not Sure */}
        <button
          type="button"
          className={`w-full p-4 rounded-xl border text-left transition-all ${
            data.dateType === "not-sure"
              ? "border-primary bg-primary/5 ring-2 ring-primary"
              : "border-border hover:border-primary/50"
          }`}
          onClick={() => handleDateTypeSelect("not-sure")}
        >
          <div className="flex items-center gap-2">
            <HelpCircle className="w-4 h-4" />
            <span className="font-medium">Not sure</span>
          </div>
          <p className="text-sm text-muted-foreground mt-1">That's okay — we'll request all available records</p>
        </button>
      </div>

      {/* Conditional Date Inputs */}
      {data.dateType === "exact" && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="space-y-2"
        >
          <Label>Date (or approximate)</Label>
          <Input
            type="date"
            value={data.exactDate}
            onChange={(e) => onUpdate({ exactDate: e.target.value })}
            className="h-12"
          />
        </motion.div>
      )}

      {data.dateType === "range" && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="space-y-4"
        >
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>From</Label>
              <Input
                type="date"
                value={data.dateRangeStart}
                onChange={(e) => onUpdate({ dateRangeStart: e.target.value })}
                className="h-12"
              />
            </div>
            <div className="space-y-2">
              <Label>To</Label>
              <Input
                type="date"
                value={data.dateRangeEnd}
                onChange={(e) => onUpdate({ dateRangeEnd: e.target.value })}
                className="h-12"
              />
            </div>
          </div>
        </motion.div>
      )}

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
