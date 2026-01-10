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
import { Loader2, CheckCircle, ArrowRight } from "lucide-react";

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
  fullName: z
    .string()
    .trim()
    .min(2, { message: "Name must be at least 2 characters" })
    .max(100, { message: "Name must be less than 100 characters" }),
  email: z
    .string()
    .trim()
    .email({ message: "Please enter a valid email address" })
    .max(255, { message: "Email must be less than 255 characters" }),
  phone: z
    .string()
    .trim()
    .min(10, { message: "Please enter a valid phone number" })
    .max(20, { message: "Phone number must be less than 20 characters" })
    .regex(/^[+]?[\d\s\-()]+$/, { message: "Please enter a valid phone number" }),
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

interface RequestFormModalProps {
  children: React.ReactNode;
}

const RequestFormModal = ({ children }: RequestFormModalProps) => {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { toast } = useToast();

  const form = useForm<RequestFormData>({
    resolver: zodResolver(requestSchema),
    defaultValues: {
      agencyName: "",
      agencyType: "",
      recordType: "",
      recordDescription: "",
      fullName: "",
      email: "",
      phone: "",
    },
  });

  const onSubmit = async (data: RequestFormData) => {
    setIsSubmitting(true);
    
    // Simulate API call - replace with actual backend integration
    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    // Log sanitized confirmation (no sensitive data)
    console.log("Request submitted successfully");
    
    setIsSubmitting(false);
    setIsSuccess(true);
    
    toast({
      title: "Request Submitted!",
      description: "We'll start processing your FOIA request right away.",
    });

    // Reset after showing success
    setTimeout(() => {
      setOpen(false);
      setIsSuccess(false);
      form.reset();
    }, 2000);
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
              We'll send you a confirmation email with tracking details shortly.
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

                {/* Contact Information */}
                <div className="space-y-4">
                  <h4 className="font-display font-semibold text-sm text-primary uppercase tracking-wider">
                    Your Contact Information
                  </h4>

                  <FormField
                    control={form.control}
                    name="fullName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="John Doe"
                            className="bg-background border-border"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email Address</FormLabel>
                          <FormControl>
                            <Input
                              type="email"
                              placeholder="john@example.com"
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
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone Number</FormLabel>
                          <FormControl>
                            <Input
                              type="tel"
                              placeholder="(555) 123-4567"
                              className="bg-background border-border"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
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
