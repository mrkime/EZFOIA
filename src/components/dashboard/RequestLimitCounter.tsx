import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Crown, Zap, AlertTriangle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { matchesPlan } from "@/lib/stripe-config";
import { logger } from "@/lib/logger";
import { TEST_SUBSCRIPTION_KEY } from "@/components/admin/AdminSettings";
import UpgradeLimitModal from "./UpgradeLimitModal";

interface SubscriptionData {
  subscribed: boolean;
  product_id: string | null;
  subscription_end: string | null;
}

const getRequestLimit = (productId: string | null): number => {
  if (!productId) return 0;
  if (matchesPlan(productId, "single")) return 1;
  if (matchesPlan(productId, "professional")) return 5;
  if (matchesPlan(productId, "enterprise")) return -1; // unlimited
  return 0;
};

const getPlanName = (productId: string | null): string => {
  if (!productId) return "Free";
  if (matchesPlan(productId, "single")) return "Single Request";
  if (matchesPlan(productId, "professional")) return "Professional";
  if (matchesPlan(productId, "enterprise")) return "Enterprise";
  return "Active Plan";
};

interface RequestLimitCounterProps {
  requestCount: number;
  loading: boolean;
}

const RequestLimitCounter = ({ requestCount, loading }: RequestLimitCounterProps) => {
  const [subscription, setSubscription] = useState<SubscriptionData | null>(null);
  const [subLoading, setSubLoading] = useState(true);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [hasShownModal, setHasShownModal] = useState(false);

  useEffect(() => {
    checkSubscription();
  }, []);

  const checkSubscription = async () => {
    try {
      // Check for admin test subscription first
      const testSubscription = localStorage.getItem(TEST_SUBSCRIPTION_KEY);
      if (testSubscription) {
        try {
          const parsed = JSON.parse(testSubscription);
          if (parsed.product_id) {
            setSubscription({ subscribed: true, product_id: parsed.product_id, subscription_end: null });
            setSubLoading(false);
            return;
          }
        } catch {
          localStorage.removeItem(TEST_SUBSCRIPTION_KEY);
        }
      }

      const { data, error } = await supabase.functions.invoke("check-subscription");
      if (error) throw error;
      setSubscription(data);
    } catch (error) {
      logger.error("Error checking subscription:", error);
      setSubscription({ subscribed: false, product_id: null, subscription_end: null });
    } finally {
      setSubLoading(false);
    }
  };

  const limit = getRequestLimit(subscription?.product_id ?? null);
  const planName = getPlanName(subscription?.product_id ?? null);
  const isUnlimited = limit === -1;
  const remaining = isUnlimited ? -1 : Math.max(0, limit - requestCount);
  const isAtLimit = !isUnlimited && remaining === 0;
  const progressPercent = isUnlimited ? 0 : limit > 0 ? Math.min(100, (requestCount / limit) * 100) : 0;

  // Show upgrade modal when user hits limit (only once per session)
  useEffect(() => {
    if (isAtLimit && !hasShownModal && subscription?.subscribed && !isUnlimited) {
      setShowUpgradeModal(true);
      setHasShownModal(true);
    }
  }, [isAtLimit, hasShownModal, subscription?.subscribed, isUnlimited]);

  if (subLoading || loading) {
    return (
      <Card className="bg-card-gradient border-border">
        <CardContent className="py-4">
          <Skeleton className="h-16 w-full" />
        </CardContent>
      </Card>
    );
  }

  if (!subscription?.subscribed) {
    return null;
  }

  return (
    <>
      <Card className={`border-border transition-all ${isAtLimit ? "bg-destructive/10 border-destructive/50" : "bg-card-gradient"}`}>
        <CardContent className="py-4">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${isAtLimit ? "bg-destructive/20" : "bg-primary/20"}`}>
                {isUnlimited ? (
                  <Crown className="w-5 h-5 text-amber-400" />
                ) : isAtLimit ? (
                  <AlertTriangle className="w-5 h-5 text-destructive" />
                ) : (
                  <Zap className="w-5 h-5 text-primary" />
                )}
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{planName} Plan</p>
                <p className="font-display font-bold text-lg">
                  {isUnlimited ? (
                    "Unlimited Requests"
                  ) : isAtLimit ? (
                    <span className="text-destructive">Request Limit Reached</span>
                  ) : (
                    <span>
                      {remaining} request{remaining !== 1 ? "s" : ""} remaining
                    </span>
                  )}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 flex-1 min-w-[200px] max-w-[300px]">
              {!isUnlimited && (
                <div className="flex-1">
                  <div className="flex justify-between text-xs text-muted-foreground mb-1">
                    <span>{requestCount} used</span>
                    <span>{limit} total</span>
                  </div>
                  <Progress 
                    value={progressPercent} 
                    className={`h-2 ${isAtLimit ? "[&>div]:bg-destructive" : ""}`}
                  />
                </div>
              )}

              {isAtLimit && (
                <Button
                  variant="hero"
                  size="sm"
                  onClick={() => setShowUpgradeModal(true)}
                  className="shrink-0"
                >
                  <Crown className="w-4 h-4 mr-1" />
                  Upgrade
                </Button>
              )}
            </div>
          </div>

          {isAtLimit && subscription.subscription_end && (
            <p className="text-xs text-muted-foreground mt-3">
              Your requests will reset on{" "}
              <span className="font-medium text-foreground">
                {new Date(subscription.subscription_end).toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>
            </p>
          )}
        </CardContent>
      </Card>

      <UpgradeLimitModal 
        open={showUpgradeModal} 
        onOpenChange={setShowUpgradeModal} 
      />
    </>
  );
};

export default RequestLimitCounter;
