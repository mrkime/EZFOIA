import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { STRIPE_PRICES } from "@/lib/stripe-config";
import { toast } from "sonner";
import { format } from "date-fns";
import {
  User,
  CreditCard,
  Crown,
  ExternalLink,
  Loader2,
  Save,
  Receipt,
  ArrowUpRight,
} from "lucide-react";

interface SubscriptionData {
  subscribed: boolean;
  product_id: string | null;
  price_id: string | null;
  subscription_end: string | null;
}

interface ProfileData {
  full_name: string | null;
  phone: string | null;
}

const getPlanDetails = (productId: string | null) => {
  if (!productId) return { name: "Free", price: "$0", color: "bg-muted text-muted-foreground" };
  
  if (productId === STRIPE_PRICES.single.productId) {
    return { name: "Single Request", price: "$75", color: "bg-primary/20 text-primary" };
  }
  if (productId === STRIPE_PRICES.professional.productId) {
    return { name: "Professional", price: "$200/mo", color: "bg-primary/20 text-primary" };
  }
  if (productId === STRIPE_PRICES.enterprise.productId) {
    return { name: "Enterprise", price: "$500/mo", color: "bg-amber-500/20 text-amber-400" };
  }
  return { name: "Active Plan", price: "", color: "bg-primary/20 text-primary" };
};

const AccountSettings = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<ProfileData>({ full_name: null, phone: null });
  const [subscription, setSubscription] = useState<SubscriptionData | null>(null);
  const [profileLoading, setProfileLoading] = useState(true);
  const [subLoading, setSubLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [portalLoading, setPortalLoading] = useState(false);

  // Form state
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");

  useEffect(() => {
    if (user) {
      fetchProfile();
      checkSubscription();
    }
  }, [user]);

  const fetchProfile = async () => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("full_name, phone")
        .eq("user_id", user!.id)
        .maybeSingle();

      if (error) throw error;
      if (data) {
        setProfile(data);
        setFullName(data.full_name || "");
        setPhone(data.phone || "");
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
    } finally {
      setProfileLoading(false);
    }
  };

  const checkSubscription = async () => {
    try {
      const { data, error } = await supabase.functions.invoke("check-subscription");
      if (error) throw error;
      setSubscription(data);
    } catch (error) {
      console.error("Error checking subscription:", error);
      setSubscription({ subscribed: false, product_id: null, price_id: null, subscription_end: null });
    } finally {
      setSubLoading(false);
    }
  };

  const handleSaveProfile = async () => {
    setSaving(true);
    try {
      const { error } = await supabase
        .from("profiles")
        .update({ full_name: fullName, phone })
        .eq("user_id", user!.id);

      if (error) throw error;
      toast.success("Profile updated successfully");
      setProfile({ full_name: fullName, phone });
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

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

  const planDetails = getPlanDetails(subscription?.product_id ?? null);
  const isSubscribed = subscription?.subscribed;

  return (
    <div className="space-y-6">
      {/* Profile Information */}
      <Card className="bg-card-gradient border-border">
        <CardHeader>
          <CardTitle className="font-display flex items-center gap-2">
            <User className="w-5 h-5" />
            Profile Information
          </CardTitle>
          <CardDescription>
            Update your personal information and contact details.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {profileLoading ? (
            <div className="space-y-4">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          ) : (
            <>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={user?.email || ""}
                    disabled
                    className="bg-muted/50"
                  />
                  <p className="text-xs text-muted-foreground">
                    Email cannot be changed
                  </p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input
                    id="fullName"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Enter your full name"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="(555) 123-4567"
                />
              </div>
              <Button
                onClick={handleSaveProfile}
                disabled={saving}
                className="gap-2"
              >
                {saving ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                Save Changes
              </Button>
            </>
          )}
        </CardContent>
      </Card>

      {/* Subscription & Billing */}
      <Card className="bg-card-gradient border-border">
        <CardHeader>
          <CardTitle className="font-display flex items-center gap-2">
            <CreditCard className="w-5 h-5" />
            Subscription & Billing
          </CardTitle>
          <CardDescription>
            Manage your subscription plan, payment methods, and view billing history.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {subLoading ? (
            <div className="space-y-4">
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-10 w-48" />
            </div>
          ) : (
            <>
              {/* Current Plan */}
              <div className="bg-muted/30 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {isSubscribed && <Crown className="w-6 h-6 text-amber-400" />}
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-lg">{planDetails.name}</span>
                        <Badge className={planDetails.color}>Current</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{planDetails.price}</p>
                    </div>
                  </div>
                  {isSubscribed && subscription?.subscription_end && (
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">Next billing date</p>
                      <p className="font-medium">
                        {format(new Date(subscription.subscription_end), "MMMM d, yyyy")}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <Separator />

              {/* Billing Actions */}
              <div className="grid gap-3 sm:grid-cols-2">
                {isSubscribed ? (
                  <>
                    <Button
                      variant="outline"
                      className="gap-2"
                      onClick={handleManageSubscription}
                      disabled={portalLoading}
                    >
                      {portalLoading ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <>
                          <CreditCard className="w-4 h-4" />
                          Update Payment Method
                          <ExternalLink className="w-3 h-3" />
                        </>
                      )}
                    </Button>
                    <Button
                      variant="outline"
                      className="gap-2"
                      onClick={handleManageSubscription}
                      disabled={portalLoading}
                    >
                      {portalLoading ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <>
                          <ArrowUpRight className="w-4 h-4" />
                          Change Plan
                          <ExternalLink className="w-3 h-3" />
                        </>
                      )}
                    </Button>
                    <Button
                      variant="outline"
                      className="gap-2"
                      onClick={handleManageSubscription}
                      disabled={portalLoading}
                    >
                      {portalLoading ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <>
                          <Receipt className="w-4 h-4" />
                          View Billing History
                          <ExternalLink className="w-3 h-3" />
                        </>
                      )}
                    </Button>
                    <Button
                      variant="destructive"
                      className="gap-2"
                      onClick={handleManageSubscription}
                      disabled={portalLoading}
                    >
                      {portalLoading ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        "Cancel Subscription"
                      )}
                    </Button>
                  </>
                ) : (
                  <Button
                    variant="hero"
                    className="gap-2 sm:col-span-2"
                    onClick={() => window.location.href = "/#pricing"}
                  >
                    <Crown className="w-4 h-4" />
                    Upgrade Your Plan
                  </Button>
                )}
              </div>

              <p className="text-xs text-muted-foreground">
                All billing management is handled securely through our payment provider. 
                You'll be redirected to manage your subscription, payment methods, and invoices.
              </p>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AccountSettings;
