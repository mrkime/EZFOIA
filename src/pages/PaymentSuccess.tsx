import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, ArrowRight, FileText, Bell, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { PENDING_REQUEST_KEY } from "@/components/RequestFormModal";
import { toast } from "sonner";

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

const PaymentSuccess = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const paymentType = searchParams.get("type") || "payment";
  const [submittingRequest, setSubmittingRequest] = useState(false);
  const [requestSubmitted, setRequestSubmitted] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth");
    }
  }, [user, loading, navigate]);

  // Auto-submit pending request after payment
  useEffect(() => {
    const submitPendingRequest = async () => {
      if (!user || submittingRequest || requestSubmitted) return;

      const pendingData = localStorage.getItem(PENDING_REQUEST_KEY);
      if (!pendingData) return;

      setSubmittingRequest(true);

      try {
        const data = JSON.parse(pendingData);
        
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

        console.log("Pending FOIA request created:", requestData.id);

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

        // Clear pending request
        localStorage.removeItem(PENDING_REQUEST_KEY);
        setRequestSubmitted(true);
        
        toast.success("Your FOIA request has been submitted!");
      } catch (error: any) {
        console.error("Error submitting pending request:", error);
        toast.error("Failed to submit your request. Please try from the dashboard.");
      } finally {
        setSubmittingRequest(false);
      }
    };

    if (user && !loading) {
      submitPendingRequest();
    }
  }, [user, loading, submittingRequest, requestSubmitted]);

  if (loading || !user) {
    return null;
  }

  const isSubscription = paymentType === "subscription";
  const hasPendingRequest = !!localStorage.getItem(PENDING_REQUEST_KEY);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-6 pt-32 pb-16">
        <div className="max-w-2xl mx-auto text-center">
          {/* Success Icon */}
          <div className="mb-8">
            <div className="w-20 h-20 mx-auto bg-primary/20 rounded-full flex items-center justify-center mb-6">
              {submittingRequest ? (
                <Loader2 className="w-10 h-10 text-primary animate-spin" />
              ) : (
                <CheckCircle className="w-10 h-10 text-primary" />
              )}
            </div>
            <h1 className="font-display text-3xl md:text-4xl font-bold mb-4">
              {submittingRequest ? "Submitting Your Request..." : "Payment Successful!"}
            </h1>
            <p className="text-muted-foreground text-lg">
              {submittingRequest 
                ? "We're processing your FOIA request now."
                : requestSubmitted
                  ? "Your FOIA request has been submitted and is being processed."
                  : isSubscription 
                    ? "Welcome to your new subscription! You now have access to all plan features."
                    : "Your payment has been processed successfully."}
            </p>
          </div>

          {/* Next Steps Card */}
          <Card className="bg-card-gradient border-border mb-8">
            <CardContent className="p-8">
              <h2 className="font-display text-xl font-semibold mb-6">
                What happens next?
              </h2>
              
              <div className="space-y-6 text-left">
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                    <span className="text-primary font-bold">1</span>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Confirmation Email</h3>
                    <p className="text-muted-foreground text-sm">
                      You'll receive a confirmation email with your receipt and request details.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                    <span className="text-primary font-bold">2</span>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Request Processing</h3>
                    <p className="text-muted-foreground text-sm">
                      Our team will file your FOIA request with the appropriate agency.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                    <span className="text-primary font-bold">3</span>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Real-Time Updates</h3>
                    <p className="text-muted-foreground text-sm">
                      Track your request status via SMS and in your dashboard.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Button 
              variant="hero" 
              size="lg" 
              className="w-full"
              onClick={() => navigate("/dashboard")}
            >
              <FileText className="w-4 h-4 mr-2" />
              Go to Dashboard
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
            
            <Button 
              variant="heroOutline" 
              size="lg" 
              className="w-full"
              onClick={() => navigate("/")}
            >
              <Bell className="w-4 h-4 mr-2" />
              Submit Another Request
            </Button>
          </div>

          {/* Support Note */}
          <p className="text-muted-foreground text-sm mt-8">
            Questions? Contact us at{" "}
            <a 
              href="mailto:support@foiafast.com" 
              className="text-primary hover:underline"
            >
              support@foiafast.com
            </a>
          </p>
        </div>
      </main>
    </div>
  );
};

export default PaymentSuccess;
