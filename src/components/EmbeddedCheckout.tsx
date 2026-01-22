import { useCallback, useState, useEffect } from "react";
import { loadStripe, Stripe } from "@stripe/stripe-js";
import {
  EmbeddedCheckoutProvider,
  EmbeddedCheckout,
} from "@stripe/react-stripe-js";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";
import { logger } from "@/lib/logger";

interface EmbeddedCheckoutFormProps {
  priceId: string;
  mode: "payment" | "subscription";
  onComplete?: () => void;
  onError?: (error: string) => void;
}

export const EmbeddedCheckoutForm = ({
  priceId,
  mode,
  onComplete,
  onError,
}: EmbeddedCheckoutFormProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [stripePromise, setStripePromise] = useState<Promise<Stripe | null> | null>(null);
  const [stripeError, setStripeError] = useState<string | null>(null);

  // Fetch Stripe publishable key from edge function
  useEffect(() => {
    const initStripe = async () => {
      try {
        const { data, error } = await supabase.functions.invoke("get-stripe-config");
        
        if (error) {
          throw new Error(error.message);
        }
        
        if (!data?.publishableKey) {
          throw new Error("No Stripe publishable key configured");
        }
        
        setStripePromise(loadStripe(data.publishableKey));
      } catch (err) {
        const message = err instanceof Error ? err.message : "Failed to initialize Stripe";
        logger.error("Stripe initialization error:", err);
        setStripeError(message);
        onError?.(message);
      }
    };
    
    initStripe();
  }, [onError]);

  const fetchClientSecret = useCallback(async () => {
    try {
      const { data, error } = await supabase.functions.invoke("create-embedded-checkout", {
        body: { priceId, mode },
      });

      if (error) throw error;
      if (!data?.clientSecret) throw new Error("No client secret returned");

      setIsLoading(false);
      return data.clientSecret;
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to initialize checkout";
      logger.error("Embedded checkout error:", error);
      onError?.(message);
      throw error;
    }
  }, [priceId, mode, onError]);

  const options = {
    fetchClientSecret,
    onComplete: () => {
      logger.log("Checkout completed");
      onComplete?.();
    },
  };

  if (stripeError) {
    return (
      <div className="w-full min-h-[400px] flex items-center justify-center">
        <div className="text-center text-destructive">
          <p className="font-medium">Failed to load payment form</p>
          <p className="text-sm text-muted-foreground mt-1">{stripeError}</p>
        </div>
      </div>
    );
  }

  if (!stripePromise) {
    return (
      <div className="w-full min-h-[400px] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Initializing payment...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-[400px] relative">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/80 z-10">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">Loading secure checkout...</p>
          </div>
        </div>
      )}
      <EmbeddedCheckoutProvider stripe={stripePromise} options={options}>
        <EmbeddedCheckout className="w-full" />
      </EmbeddedCheckoutProvider>
    </div>
  );
};
