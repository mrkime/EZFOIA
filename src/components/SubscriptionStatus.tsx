import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/integrations/supabase/client";
import { STRIPE_PRICES } from "@/lib/stripe-config";
import { CreditCard, Crown, Loader2, ExternalLink, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";

interface SubscriptionData {
  subscribed: boolean;
  product_id: string | null;
  price_id: string | null;
  subscription_end: string | null;
}

const getPlanDetails = (productId: string | null) => {
  if (!productId) return { name: "Free", color: "bg-muted text-muted-foreground" };
  
  if (productId === STRIPE_PRICES.professional.productId) {
    return { name: "Professional", color: "bg-primary/20 text-primary" };
  }
  if (productId === STRIPE_PRICES.enterprise.productId) {
    return { name: "Enterprise", color: "bg-amber-500/20 text-amber-400" };
  }
  return { name: "Active Plan", color: "bg-primary/20 text-primary" };
};

const SubscriptionStatus = () => {
  const [subscription, setSubscription] = useState<SubscriptionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [portalLoading, setPortalLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const checkSubscription = async (showRefreshToast = false) => {
    if (showRefreshToast) setRefreshing(true);
    try {
      const { data, error } = await supabase.functions.invoke("check-subscription");
      
      if (error) throw error;
      setSubscription(data);
      if (showRefreshToast) toast.success("Subscription status updated");
    } catch (error) {
      console.error("Error checking subscription:", error);
      setSubscription({ subscribed: false, product_id: null, price_id: null, subscription_end: null });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    checkSubscription();
    
    // Auto-refresh every 60 seconds
    const interval = setInterval(() => checkSubscription(), 60000);
    return () => clearInterval(interval);
  }, []);

  const handleManageSubscription = async () => {
    setPortalLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("customer-portal");
      
      if (error) throw error;
      if (data?.url) {
        window.open(data.url, "_blank");
      }
    } catch (error) {
      console.error("Portal error:", error);
      toast.error("Unable to open subscription management. Please try again.");
    } finally {
      setPortalLoading(false);
    }
  };

  if (loading) {
    return (
      <Card className="bg-card-gradient border-border">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
            <CreditCard className="w-4 h-4" />
            Subscription
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-8 w-32 mb-2" />
          <Skeleton className="h-4 w-48" />
        </CardContent>
      </Card>
    );
  }

  const planDetails = getPlanDetails(subscription?.product_id ?? null);
  const isSubscribed = subscription?.subscribed;

  return (
    <Card className="bg-card-gradient border-border">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
            <CreditCard className="w-4 h-4" />
            Subscription
          </CardTitle>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => checkSubscription(true)}
            disabled={refreshing}
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`} />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-2 mb-2">
          {isSubscribed && <Crown className="w-5 h-5 text-amber-400" />}
          <Badge className={planDetails.color}>
            {planDetails.name}
          </Badge>
        </div>
        
        {isSubscribed && subscription?.subscription_end && (
          <p className="text-sm text-muted-foreground mb-3">
            Renews {format(new Date(subscription.subscription_end), "MMMM d, yyyy")}
          </p>
        )}
        
        {!isSubscribed && (
          <p className="text-sm text-muted-foreground mb-3">
            Upgrade to unlock more requests and features
          </p>
        )}

        {isSubscribed ? (
          <Button
            variant="outline"
            size="sm"
            className="w-full"
            onClick={handleManageSubscription}
            disabled={portalLoading}
          >
            {portalLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                Manage Subscription
                <ExternalLink className="w-3 h-3 ml-2" />
              </>
            )}
          </Button>
        ) : (
          <Button
            variant="hero"
            size="sm"
            className="w-full"
            onClick={() => {
              const pricingSection = document.getElementById("pricing");
              if (pricingSection) {
                pricingSection.scrollIntoView({ behavior: "smooth" });
              } else {
                window.location.href = "/#pricing";
              }
            }}
          >
            View Plans
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default SubscriptionStatus;
