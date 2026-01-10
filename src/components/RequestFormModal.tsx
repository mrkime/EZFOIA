import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { STRIPE_PRICES, PlanKey } from "@/lib/stripe-config";
import { Loader2, CheckCircle, ArrowRight, LogIn, Crown, Check } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const PENDING_REQUEST_KEY = "pending_foia_request";

const requestSchema = z.object({
  agencyName: z
    .string()
    .trim()
    .min(2, { message: "Agency name must be at least 2 characters" })
    .max(200, { message: "Agency name must be less than 200 characters" }),
  agencyType: z.string().min(1, { message: "Please select an agency type" }),
  recordType: z.string().min(1, { message: "Please select a record type" }),
  recordDescription: z
    .string()
    .trim()
    .min(20, { message: "Please provide at least 20 characters describing what you're looking for" })
    .max(2000, { message: "Description must be less than 2000 characters" }),
});

type RequestFormData = z.infer<typeof requestSchema>;

const agencyTypes = [
  { value: "federal", label: "Federal Agency" },
  { value: "state", label: "State Agency" },
  { value: "local", label: "Local/Municipal" },
  { value: "law-enforcement", label: "Law Enforcement" },
  { value: "education", label: "Educational Institution" },
  { value: "other", label: "Other" },
];

const recordTypes = [
  { value: "emails", label: "Emails & Correspondence" },
  { value: "contracts", label: "Contracts & Agreements" },
  { value: "meeting-minutes", label: "Meeting Minutes" },
  { value: "financial", label: "Financial Records" },
  { value: "personnel", label: "Personnel Records" },
  { value: "policies", label: "Policies & Procedures" },
  { value: "incident-reports", label: "Incident Reports" },
  { value: "other", label: "Other Documents" },
];

const recordTypeLabels: Record<string, string> = {
  emails: "Emails & Correspondence",
  contracts: "Contracts & Agreements",
  "meeting-minutes": "Meeting Minutes",
  financial: "Financial Records",
  personnel: "Personnel Records",
  policies: "Policies & Procedures",
  "incident-reports": "Incident Reports",
  other: "Other Documents",
};

interface SubscriptionData {
  subscribed: boolean;
  product_id: string | null;
}

const getRequestLimit = (productId: string | null): number => {
  if (!productId) return 0;
  if (productId === STRIPE_PRICES.single.productId) return 1;
  if (productId === STRIPE_PRICES.professional.productId) return 5;
  if (productId === STRIPE_PRICES.enterprise.productId) return -1; // unlimited
  return 0;
};

interface Plan {
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  planKey: PlanKey;
  featured?: boolean;
}

const plans: Plan[] = [
  {
    name: "Single Request",
    price: "$75",
    period: "one-time",
    description: "Perfect for one-time FOIA requests",
    features: ["One FOIA request filed", "Real-time SMS tracking", "AI document search"],
    planKey: "single",
  },
  {
    name: "Professional",
    price: "$200",
    period: "per month",
    description: "For regular research and investigations",
    features: ["5 FOIA requests per month", "Priority processing", "AI document search & analysis"],
    planKey: "professional",
    featured: true,
  },
  {
    name: "Enterprise",
    price: "$500",
    period: "per month",
    description: "For newsrooms and heavy users",
    features: ["Unlimited FOIA requests", "Dedicated account manager", "API access"],
    planKey: "enterprise",
  },
];

type ModalStep = "form" | "plan-selection" | "success";

interface RequestFormModalProps {
  children: React.ReactNode;
}

const RequestFormModal = ({ children }: RequestFormModalProps) => {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<ModalStep>("form");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loadingPlan, setLoadingPlan] = useState<PlanKey | null>(null);
  const [subscription, setSubscription] = useState<SubscriptionData | null>(null);
  const [subLoading, setSubLoading] = useState(true);
  const [requestCount, setRequestCount] = useState(0);
  const { toast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();

  const form = useForm<RequestFormData>({
    resolver: zodResolver(requestSchema),
    defaultValues: {
      agencyName: "",
      agencyType: "",
      recordType: "",
      recordDescription: "",
    },
  });

  useEffect(() => {
    if (user && open) {
      checkSubscriptionAndUsage();
    }
  }, [user, open]);

  const checkSubscriptionAndUsage = async () => {
    setSubLoading(true);
    try {
      // Check subscription status
      const { data: subData, error: subError } = await supabase.functions.invoke("check-subscription");
      if (subError) throw subError;
      setSubscription(subData);

      // Get current request count
      const { count, error: countError } = await supabase
        .from("foia_requests")
        .select("*", { count: "exact", head: true })
        .eq("user_id", user!.id);

      if (countError) throw countError;
      setRequestCount(count || 0);
    } catch (error) {
      console.error("Error checking subscription:", error);
      setSubscription({ subscribed: false, product_id: null });
    } finally {
      setSubLoading(false);
    }
  };

  const canSubmitRequest = (): boolean => {
    if (!subscription?.subscribed) return false;
    const limit = getRequestLimit(subscription.product_id);
    if (limit === -1) return true; // unlimited
    return requestCount < limit;
  };

  const getRemainingRequests = (): string => {
    if (!subscription?.subscribed) return "0";
    const limit = getRequestLimit(subscription.product_id);
    if (limit === -1) return "Unlimited";
    return String(Math.max(0, limit - requestCount));
  };

  const submitRequest = async (data: RequestFormData) => {
    if (!user) return;
    
    setIsSubmitting(true);
    
    try {
      const { data: requestData, error: insertError } = await supabase
        .from("foia_requests")
        .insert({
          user_id: user.id,
          agency_name: data.agencyName,
          agency_type: data.agencyType,
          record_type: data.recordType,
          record_description: data.recordDescription,
        })
        .select()
        .single();

      if (insertError) throw insertError;

      console.log("FOIA request created:", requestData.id);

      // Send confirmation email
      await supabase.functions.invoke("send-confirmation", {
        body: {
          to: user.email,
          name: user.user_metadata?.full_name || "Valued Customer",
          agencyName: data.agencyName,
          recordType: recordTypeLabels[data.recordType] || data.recordType,
          requestId: requestData.id,
        },
      }).catch(console.error);

      setIsSubmitting(false);
      setStep("success");
      
      toast({
        title: "Request Submitted!",
        description: "Check your email for confirmation details.",
      });

      setTimeout(() => {
        setOpen(false);
        setStep("form");
        form.reset();
      }, 2500);
    } catch (error: any) {
      console.error("Error submitting request:", error);
      setIsSubmitting(false);
      toast({
        title: "Submission Failed",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
    }
  };

  const onSubmit = async (data: RequestFormData) => {
    if (!user) {
      toast({
        title: "Please sign in",
        description: "You need to be signed in to submit a FOIA request.",
        variant: "destructive",
      });
      setOpen(false);
      navigate("/auth");
      return;
    }

    // If user can submit (has valid subscription with capacity), submit directly
    if (canSubmitRequest()) {
      await submitRequest(data);
      return;
    }

    // Otherwise, show plan selection - store form data for after payment
    localStorage.setItem(PENDING_REQUEST_KEY, JSON.stringify(data));
    setStep("plan-selection");
  };

  const handleCheckout = async (planKey: PlanKey) => {
    setLoadingPlan(planKey);
    try {
      const priceConfig = STRIPE_PRICES[planKey];
      const { data, error } = await supabase.functions.invoke("create-checkout", {
        body: {
          priceId: priceConfig.priceId,
          mode: priceConfig.mode,
        },
      });

      if (error) throw error;
      if (data?.url) {
        window.open(data.url, "_blank");
        setOpen(false);
        setStep("form");
      }
    } catch (error) {
      console.error("Checkout error:", error);
      toast({
        title: "Checkout Failed",
        description: "Failed to start checkout. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoadingPlan(null);
    }
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!isSubmitting && !loadingPlan) {
      setOpen(newOpen);
      if (!newOpen) {
        setStep("form");
        form.reset();
      }
    }
  };

  // If not logged in, show a sign-in prompt
  if (!user && open) {
    return (
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogTrigger asChild>{children}</DialogTrigger>
        <DialogContent className="sm:max-w-[450px] bg-card border-border">
          <div className="py-8 text-center">
            <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-6">
              <LogIn className="w-8 h-8 text-primary" />
            </div>
            <h3 className="font-display text-2xl font-bold mb-2">Sign In Required</h3>
            <p className="text-muted-foreground mb-6">
              Please sign in or create an account to submit a FOIA request.
            </p>
            <div className="flex flex-col gap-3">
              <Button
                variant="hero"
                size="lg"
                onClick={() => {
                  setOpen(false);
                  navigate("/auth");
                }}
              >
                Sign In / Sign Up
                <ArrowRight className="w-5 h-5" />
              </Button>
              <Button variant="ghost" onClick={() => setOpen(false)}>
                Maybe Later
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  // Plan selection step
  if (step === "plan-selection") {
    return (
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogTrigger asChild>{children}</DialogTrigger>
        <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto bg-card border-border">
          <DialogHeader>
            <DialogTitle className="font-display text-2xl flex items-center gap-2">
              <Crown className="w-6 h-6 text-amber-400" />
              Choose Your Plan
            </DialogTitle>
            <DialogDescription>
              Select a plan to submit your request. Payment will complete your submission.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 mt-4">
            {plans.map((plan) => (
              <div
                key={plan.planKey}
                className={`relative rounded-xl p-5 border transition-all ${
                  plan.featured
                    ? "border-primary bg-primary/5"
                    : "border-border bg-muted/20"
                }`}
              >
                {plan.featured && (
                  <span className="absolute -top-2 right-4 bg-cta-gradient text-primary-foreground text-xs font-semibold px-2 py-0.5 rounded-full">
                    Popular
                  </span>
                )}
                
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="font-display font-semibold text-lg mb-1">{plan.name}</h3>
                    <p className="text-sm text-muted-foreground mb-3">{plan.description}</p>
                    <ul className="flex flex-wrap gap-x-4 gap-y-1">
                      {plan.features.map((feature) => (
                        <li key={feature} className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Check className="w-3 h-3 text-primary" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="text-right flex-shrink-0">
                    <div className="mb-2">
                      <span className="font-display text-2xl font-bold">{plan.price}</span>
                      <span className="text-muted-foreground text-sm ml-1">{plan.period}</span>
                    </div>
                    <Button
                      variant={plan.featured ? "hero" : "outline"}
                      size="sm"
                      onClick={() => handleCheckout(plan.planKey)}
                      disabled={loadingPlan !== null}
                    >
                      {loadingPlan === plan.planKey ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <>
                          Pay & Submit
                          <ArrowRight className="w-3 h-3 ml-1" />
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <Button variant="ghost" className="mt-2" onClick={() => setStep("form")}>
            ← Back to form
          </Button>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto bg-card border-border">
        {subLoading ? (
          <div className="py-12 flex items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : step === "success" ? (
          <div className="py-12 text-center">
            <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-8 h-8 text-primary" />
            </div>
            <h3 className="font-display text-2xl font-bold mb-2">Request Submitted!</h3>
            <p className="text-muted-foreground">
              We've sent a confirmation email with tracking details.
            </p>
          </div>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="font-display text-2xl">Start Your FOIA Request</DialogTitle>
              <DialogDescription className="text-muted-foreground">
                Fill out the form below and we'll handle the rest. You'll receive SMS updates as your request progresses.
              </DialogDescription>
            </DialogHeader>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 mt-4">
                {/* Agency Information */}
                <div className="space-y-4">
                  <h4 className="font-display font-semibold text-sm text-primary uppercase tracking-wider">
                    Agency Information
                  </h4>
                  
                  <FormField
                    control={form.control}
                    name="agencyName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Agency Name</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g., FBI, Department of Education, City of Austin"
                            className="bg-background border-border"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="agencyType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Agency Type</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="bg-background border-border">
                              <SelectValue placeholder="Select agency type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="bg-card border-border">
                            {agencyTypes.map((type) => (
                              <SelectItem key={type.value} value={type.value}>
                                {type.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Record Details */}
                <div className="space-y-4">
                  <h4 className="font-display font-semibold text-sm text-primary uppercase tracking-wider">
                    Record Details
                  </h4>

                  <FormField
                    control={form.control}
                    name="recordType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Type of Records</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="bg-background border-border">
                              <SelectValue placeholder="Select record type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="bg-card border-border">
                            {recordTypes.map((type) => (
                              <SelectItem key={type.value} value={type.value}>
                                {type.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="recordDescription"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Describe What You're Looking For</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Be as specific as possible. Include date ranges, names, topics, or any other details that will help us find the right records."
                            className="bg-background border-border min-h-[120px] resize-none"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Info */}
                <div className="glass rounded-lg p-4 text-sm">
                  <p className="text-muted-foreground">
                    {canSubmitRequest() ? (
                      <>
                        <span className="font-semibold text-foreground">Requests remaining: {getRemainingRequests()}</span>
                        {" "}• Any filing fees charged by the agency will be billed separately at cost.
                      </>
                    ) : (
                      <>You'll select a plan after filling out your request details.</>
                    )}
                  </p>
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  variant="hero"
                  size="lg"
                  className="w-full"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Processing...
                    </>
                  ) : canSubmitRequest() ? (
                    <>
                      Submit Request
                      <ArrowRight className="w-5 h-5" />
                    </>
                  ) : (
                    <>
                      Continue to Payment
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </Button>
              </form>
            </Form>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default RequestFormModal;
