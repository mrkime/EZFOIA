import { motion } from "framer-motion";
import { CheckCircle, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface SuccessStepProps {
  onClose: () => void;
}

export const SuccessStep = ({ onClose }: SuccessStepProps) => {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="py-8 text-center"
    >
      {/* Success Animation */}
      <div className="relative w-20 h-20 mx-auto mb-6">
        <motion.div
          className="absolute inset-0 rounded-full bg-primary/20"
          initial={{ scale: 0 }}
          animate={{ scale: [0, 1.2, 1] }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        />
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ duration: 0.4, delay: 0.2, ease: "easeOut" }}
        >
          <CheckCircle className="w-12 h-12 text-primary" />
        </motion.div>
      </div>

      <h2 className="font-display text-2xl md:text-3xl font-bold mb-2">
        Request Submitted!
      </h2>
      <p className="text-muted-foreground mb-6">
        We've sent a confirmation email with tracking details.
      </p>

      {/* Timeline Preview */}
      <div className="bg-muted/30 rounded-xl p-4 border border-border mb-6 text-left">
        <h4 className="font-medium text-sm mb-3">What happens next:</h4>
        <div className="space-y-3">
          {[
            { status: "complete", label: "Request submitted" },
            { status: "pending", label: "Agency acknowledges receipt" },
            { status: "pending", label: "Request processing" },
            { status: "pending", label: "Records delivered" },
          ].map((step, index) => (
            <div key={step.label} className="flex items-center gap-3">
              <div className={`w-3 h-3 rounded-full ${
                step.status === "complete" ? "bg-primary" : "bg-muted-foreground/30"
              }`} />
              <span className={`text-sm ${
                step.status === "complete" ? "text-foreground" : "text-muted-foreground"
              }`}>
                {step.label}
              </span>
              {index === 0 && (
                <span className="text-xs text-primary ml-auto">Just now</span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* AI Assistant Prompt */}
      <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 mb-6 flex items-start gap-3 text-left">
        <div className="p-2 rounded-lg bg-primary/10">
          <MessageCircle className="w-5 h-5 text-primary" />
        </div>
        <div>
          <p className="font-medium text-sm">AI Assistant</p>
          <p className="text-sm text-muted-foreground">
            I'll help you understand the response when it arrives.
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col gap-3">
        <Button
          variant="hero"
          size="lg"
          className="w-full h-14"
          onClick={() => {
            onClose();
            navigate("/dashboard");
          }}
        >
          Go to Dashboard
        </Button>
        <Button
          variant="ghost"
          onClick={onClose}
        >
          Submit Another Request
        </Button>
      </div>
    </motion.div>
  );
};
