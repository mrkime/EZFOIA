import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Crown, Check, Loader2, ArrowRight, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { STRIPE_PRICES } from "@/lib/stripe-config";
import { toast } from "sonner";
import { logger } from "@/lib/logger";

interface UpgradeLimitModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const UpgradeLimitModal = ({ open, onOpenChange }: UpgradeLimitModalProps) => {
  const [loading, setLoading] = useState(false);

  const handleUpgrade = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("create-checkout", {
        body: {
          priceId: STRIPE_PRICES.enterprise.monthly.priceId,
          mode: STRIPE_PRICES.enterprise.mode,
        },
      });

      if (error) throw error;
      if (data?.url) {
        window.open(data.url, "_blank");
        onOpenChange(false);
      }
    } catch (error) {
      logger.error("Upgrade checkout error:", error);
      toast.error("Failed to start checkout. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[450px] bg-card border-border">
        <DialogHeader>
          <div className="flex items-center justify-center mb-4">
            <div className="w-16 h-16 rounded-full bg-amber-500/20 flex items-center justify-center">
              <Crown className="w-8 h-8 text-amber-400" />
            </div>
          </div>
          <DialogTitle className="font-display text-2xl text-center">
            You've Hit Your Limit!
          </DialogTitle>
          <DialogDescription className="text-center">
            Upgrade to Enterprise for unlimited FOIA requests and never worry about limits again.
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4 p-4 rounded-xl bg-primary/5 border border-primary/20">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Crown className="w-5 h-5 text-amber-400" />
              <span className="font-display font-semibold">Enterprise Plan</span>
            </div>
            <div className="text-right">
              <span className="font-display text-xl font-bold">$500</span>
              <span className="text-muted-foreground text-sm">/mo</span>
            </div>
          </div>
          
          <ul className="space-y-2">
            {[
              "Unlimited FOIA requests",
              "Dedicated account manager",
              "Priority processing",
              "API access",
              "Advanced analytics",
            ].map((feature) => (
              <li key={feature} className="flex items-center gap-2 text-sm text-muted-foreground">
                <Check className="w-4 h-4 text-primary shrink-0" />
                {feature}
              </li>
            ))}
          </ul>
        </div>

        <div className="flex flex-col gap-3 mt-4">
          <Button
            variant="hero"
            size="lg"
            onClick={handleUpgrade}
            disabled={loading}
            className="w-full"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                Upgrade to Unlimited
                <ArrowRight className="w-5 h-5 ml-2" />
              </>
            )}
          </Button>
          
          <Button
            variant="ghost"
            onClick={() => onOpenChange(false)}
            className="w-full"
          >
            <X className="w-4 h-4 mr-2" />
            Maybe Later
          </Button>
        </div>

        <p className="text-xs text-center text-muted-foreground mt-2">
          Your requests will reset on your next billing date.
        </p>
      </DialogContent>
    </Dialog>
  );
};

export default UpgradeLimitModal;
