import { useState } from "react";
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
import { Loader2, CheckCircle, ArrowRight, LogIn } from "lucide-react";
import { useNavigate } from "react-router-dom";

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

interface RequestFormModalProps {
  children: React.ReactNode;
}

const RequestFormModal = ({ children }: RequestFormModalProps) => {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
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

    setIsSubmitting(true);
    
    try {
      // Insert the request into the database
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

      if (insertError) {
        throw insertError;
      }

      console.log("FOIA request created:", requestData.id);

      // Send confirmation email
      const { error: emailError } = await supabase.functions.invoke("send-confirmation", {
        body: {
          to: user.email,
          name: user.user_metadata?.full_name || "Valued Customer",
          agencyName: data.agencyName,
          recordType: recordTypeLabels[data.recordType] || data.recordType,
          requestId: requestData.id,
        },
      });

      if (emailError) {
        console.error("Email error:", emailError);
        // Don't fail the whole request if email fails
      }

      setIsSubmitting(false);
      setIsSuccess(true);
      
      toast({
        title: "Request Submitted!",
        description: "Check your email for confirmation details.",
      });

      // Reset after showing success
      setTimeout(() => {
        setOpen(false);
        setIsSuccess(false);
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

  const handleOpenChange = (newOpen: boolean) => {
    if (!isSubmitting) {
      setOpen(newOpen);
      if (!newOpen) {
        setIsSuccess(false);
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

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto bg-card border-border">
        {isSuccess ? (
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

                {/* Pricing Note */}
                <div className="glass rounded-lg p-4 text-sm">
                  <p className="text-muted-foreground">
                    <span className="font-semibold text-foreground">$75 flat rate</span> per request. 
                    Any filing fees charged by the agency will be billed separately at cost.
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
                  ) : (
                    <>
                      Submit Request
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
