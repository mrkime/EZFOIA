import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { CreditCard, Crown, FileText, Clock, CheckCircle, Loader2, ExternalLink, RefreshCw } from "lucide-react";
import { STRIPE_PRICES, matchesPlan } from "@/lib/stripe-config";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { format } from "date-fns";
import { useState, useEffect } from "react";
import { logger } from "@/lib/logger";

interface FoiaRequest {
  id: string;
  status: string;
}

interface SubscriptionData {
  subscribed: boolean;
  product_id: string | null;
  price_id: string | null;
  subscription_end: string | null;
}

interface DashboardSummaryProps {
  requests: FoiaRequest[];
  loading: boolean;
}

const getPlanDetails = (productId: string | null) => {
  if (!productId) return { name: "Free", color: "bg-muted text-muted-foreground", requestLimit: 0 };
  
  if (matchesPlan(productId, "single")) {
    return { name: "Single Request", color: "bg-primary/20 text-primary", requestLimit: 1 };
  }
  if (matchesPlan(productId, "professional")) {
    return { name: "Professional", color: "bg-primary/20 text-primary", requestLimit: 5 };
  }
  if (matchesPlan(productId, "enterprise")) {
    return { name: "Enterprise", color: "bg-amber-500/20 text-amber-400", requestLimit: -1 }; // unlimited
  }
  return { name: "Active Plan", color: "bg-primary/20 text-primary", requestLimit: 1 };
};

const DashboardSummary = ({ requests, loading }: DashboardSummaryProps) => {
  const [subscription, setSubscription] = useState<SubscriptionData | null>(null);
  const [subLoading, setSubLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const checkSubscription = async (showRefreshToast = false) => {
    if (showRefreshToast) setRefreshing(true);
    try {
      const { data, error } = await supabase.functions.invoke("check-subscription");
      if (error) throw error;
      setSubscription(data);
      if (showRefreshToast) toast.success("Subscription status updated");
    } catch (error) {
      logger.error("Error checking subscription:", error);
      setSubscription({ subscribed: false, product_id: null, price_id: null, subscription_end: null });
    } finally {
      setSubLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    checkSubscription();
    const interval = setInterval(() => checkSubscription(), 60000);
    return () => clearInterval(interval);
  }, []);

  const planDetails = getPlanDetails(subscription?.product_id ?? null);
  const isSubscribed = subscription?.subscribed;
  
  const pendingCount = requests.filter(r => r.status === "pending").length;
  const inProgressCount = requests.filter(r => ["in_progress", "processing"].includes(r.status)).length;
  const completedCount = requests.filter(r => r.status === "completed").length;

  const requestsUsed = requests.length;
  const requestLimit = planDetails.requestLimit;
  const requestsRemaining = requestLimit === -1 ? "Unlimited" : Math.max(0, requestLimit - requestsUsed);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
      {/* Subscription Card */}
      <Card className="bg-card-gradient border-border sm:col-span-2 lg:col-span-1">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <CreditCard className="w-4 h-4" />
              Current Plan
            </CardTitle>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              onClick={() => checkSubscription(true)}
              disabled={refreshing}
            >
              <RefreshCw className={`w-3 h-3 ${refreshing ? "animate-spin" : ""}`} />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {subLoading ? (
            <>
              <Skeleton className="h-7 w-28 mb-2" />
              <Skeleton className="h-4 w-36" />
            </>
          ) : (
            <>
              <div className="flex items-center gap-2 mb-1">
                {isSubscribed && <Crown className="w-4 h-4 text-amber-400" />}
                <span className="text-xl font-bold font-display">{planDetails.name}</span>
              </div>
              {isSubscribed && subscription?.subscription_end && (
                <p className="text-xs text-muted-foreground">
                  Renews {format(new Date(subscription.subscription_end), "MMM d, yyyy")}
                </p>
              )}
              {!isSubscribed && (
                <p className="text-xs text-muted-foreground">No active subscription</p>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* Total Requests */}
      <Card className="bg-card-gradient border-border">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
            <FileText className="w-4 h-4" />
            Total Requests
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <Skeleton className="h-9 w-16" />
          ) : (
            <>
              <p className="text-3xl font-bold font-display">{requests.length}</p>
              {isSubscribed && (
                <p className="text-xs text-muted-foreground">
                  {typeof requestsRemaining === "string" ? requestsRemaining : `${requestsRemaining} remaining`}
                </p>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* Pending */}
      <Card className="bg-card-gradient border-border">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
            <Clock className="w-4 h-4 text-yellow-400" />
            Pending
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <Skeleton className="h-9 w-12" />
          ) : (
            <p className="text-3xl font-bold font-display text-yellow-400">{pendingCount}</p>
          )}
        </CardContent>
      </Card>

      {/* In Progress */}
      <Card className="bg-card-gradient border-border">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
            <Loader2 className="w-4 h-4 text-blue-400" />
            In Progress
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <Skeleton className="h-9 w-12" />
          ) : (
            <p className="text-3xl font-bold font-display text-blue-400">{inProgressCount}</p>
          )}
        </CardContent>
      </Card>

      {/* Completed */}
      <Card className="bg-card-gradient border-border">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-primary" />
            Completed
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <Skeleton className="h-9 w-12" />
          ) : (
            <p className="text-3xl font-bold font-display text-primary">{completedCount}</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardSummary;
