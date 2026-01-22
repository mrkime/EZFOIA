import { useState } from "react";
import { motion } from "framer-motion";
import { 
  FileCheck, 
  Edit3, 
  Shield, 
  Clock, 
  AlertTriangle,
  Check,
  ChevronDown,
  ChevronUp,
  Gift
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { GeneratedRequest } from "../types";

interface PreviewStepProps {
  generatedRequest: GeneratedRequest;
  onMessageChange: (message: string) => void;
  onSubmit: () => void;
  onBack: () => void;
  isSubmitting: boolean;
  isFirstRequest?: boolean;
}

export const PreviewStep = ({ 
  generatedRequest, 
  onMessageChange, 
  onSubmit, 
  onBack,
  isSubmitting,
  isFirstRequest = false
}: PreviewStepProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [showTips, setShowTips] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="text-center">
        <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
          <FileCheck className="w-7 h-7 text-primary" />
        </div>
        <h2 className="font-display text-2xl md:text-3xl font-bold mb-2">
          Your FOIA Request Is Ready
        </h2>
        <p className="text-muted-foreground">
          Review your request below. You can make edits if needed.
        </p>
      </div>

      {/* Trust Signals */}
      <div className="flex flex-wrap gap-2 justify-center">
        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm">
          <Shield className="w-3 h-3" />
          Optimized for approval
        </span>
        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm">
          <Check className="w-3 h-3" />
          Meets FOIA requirements
        </span>
        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-muted text-muted-foreground text-sm">
          <Clock className="w-3 h-3" />
          Est. response: {generatedRequest.estimatedResponseTime}
        </span>
      </div>

      {/* Request Letter */}
      <div className="relative">
        <div className="absolute top-3 right-3 z-10">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsEditing(!isEditing)}
            className="gap-1"
          >
            <Edit3 className="w-4 h-4" />
            {isEditing ? "Done" : "Edit"}
          </Button>
        </div>
        
        {isEditing ? (
          <Textarea
            value={generatedRequest.message}
            onChange={(e) => onMessageChange(e.target.value)}
            className="min-h-[300px] text-sm bg-card border-border p-4 pt-12"
          />
        ) : (
          <div className="bg-card border border-border rounded-xl p-6 pt-12 min-h-[300px]">
            <p className="whitespace-pre-wrap text-sm leading-relaxed">
              {generatedRequest.message}
            </p>
          </div>
        )}
      </div>

      {/* Tips Accordion */}
      {generatedRequest.tips.length > 0 && (
        <div className="border border-border rounded-xl overflow-hidden">
          <button
            type="button"
            className="w-full p-4 flex items-center justify-between bg-muted/30 hover:bg-muted/50 transition-colors"
            onClick={() => setShowTips(!showTips)}
          >
            <span className="flex items-center gap-2 font-medium">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              Important tips for your request
            </span>
            {showTips ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
          
          {showTips && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              className="p-4 space-y-2"
            >
              {generatedRequest.tips.map((tip, index) => (
                <p key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                  <span className="text-primary">•</span>
                  {tip}
                </p>
              ))}
            </motion.div>
          )}
        </div>
      )}

      {/* First Request Free Banner */}
      {isFirstRequest && (
        <div className="bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20 rounded-xl p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
            <Gift className="w-5 h-5 text-primary" />
          </div>
          <div>
            <p className="font-medium text-sm">Your first request is free!</p>
            <p className="text-xs text-muted-foreground">
              No credit card required. Agency fees over $50 billed at cost.
            </p>
          </div>
        </div>
      )}

      {/* What's Included */}
      <div className="bg-muted/30 rounded-xl p-4 border border-border">
        <h4 className="font-medium text-sm mb-3">What's included with your submission:</h4>
        <ul className="grid grid-cols-2 gap-2 text-sm text-muted-foreground">
          <li className="flex items-center gap-2">
            <Check className="w-4 h-4 text-primary" />
            Professional filing
          </li>
          <li className="flex items-center gap-2">
            <Check className="w-4 h-4 text-primary" />
            Real-time SMS tracking
          </li>
          <li className="flex items-center gap-2">
            <Check className="w-4 h-4 text-primary" />
            Agency follow-ups
          </li>
          <li className="flex items-center gap-2">
            <Check className="w-4 h-4 text-primary" />
            AI document analysis
          </li>
        </ul>
      </div>

      {/* Navigation */}
      <div className="flex gap-3 pt-4">
        <Button 
          variant="outline" 
          size="lg" 
          className="flex-1 h-14" 
          onClick={onBack}
          disabled={isSubmitting}
        >
          Edit Answers
        </Button>
        <Button
          variant="hero"
          size="lg"
          className="flex-[2] h-14 text-lg"
          onClick={onSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting 
            ? "Processing..." 
            : isFirstRequest 
              ? "Submit Free Request" 
              : "Submit & File Request"
          }
        </Button>
      </div>
    </motion.div>
  );
};
