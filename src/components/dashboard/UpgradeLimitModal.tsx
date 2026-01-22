import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Crown, Check, ArrowRight, ArrowLeft, X } from "lucide-react";
import { STRIPE_PRICES } from "@/lib/stripe-config";
import { toast } from "sonner";
import { EmbeddedCheckoutForm } from "@/components/EmbeddedCheckout";

interface UpgradeLimitModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const UpgradeLimitModal = ({ open, onOpenChange }: UpgradeLimitModalProps) => {
  const [showCheckout, setShowCheckout] = useState(false);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);

  const handleUpgrade = () => {
    setCheckoutError(null);
    setShowCheckout(true);
  };

  const handleCheckoutComplete = () => {
    toast.success("Payment Successful!", {
      description: "You now have unlimited FOIA requests.",
    });
    onOpenChange(false);
    window.location.href = "/dashboard?payment=success";
  };

  const handleCheckoutError = (error: string) => {
    setCheckoutError(error);
    toast.error("Checkout Error", {
      description: error,
    });
  };

  const handleBackFromCheckout = () => {
    setShowCheckout(false);
    setCheckoutError(null);
  };

  const handleOpenChange = (newOpen: boolean) => {
    onOpenChange(newOpen);
    if (!newOpen) {
      // Reset state when closing
      setTimeout(() => {
        setShowCheckout(false);
        setCheckoutError(null);
      }, 300);
    }
  };

  // If checkout is active, show embedded checkout
  if (showCheckout) {
    return (
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto bg-card border-border">
          {/* Header with back button */}
          <div className="flex items-center gap-4 mb-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleBackFromCheckout}
              className="gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>
          </div>

          {/* Selected plan summary */}
          <div className="bg-muted/30 rounded-lg p-4 border border-border mb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Crown className="w-5 h-5 text-amber-400" />
                <div>
                  <h3 className="font-semibold">Enterprise Plan</h3>
                  <p className="text-sm text-muted-foreground">Unlimited FOIA requests</p>
                </div>
              </div>
              <div className="text-right">
                <span className="font-display text-xl font-bold">$500</span>
                <span className="text-muted-foreground text-sm ml-1">/mo</span>
              </div>
            </div>
          </div>

          {/* Embedded Checkout */}
          <div className="rounded-xl overflow-hidden border border-border bg-background">
            <EmbeddedCheckoutForm
              priceId={STRIPE_PRICES.enterprise.monthly.priceId}
              mode={STRIPE_PRICES.enterprise.mode}
              onComplete={handleCheckoutComplete}
              onError={handleCheckoutError}
            />
          </div>

          {checkoutError && (
            <p className="text-sm text-destructive text-center mt-2">{checkoutError}</p>
          )}
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
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
            className="w-full"
          >
            Upgrade to Unlimited
            <ArrowRight className="w-5 h-5 ml-2" />
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
