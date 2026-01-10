import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, ArrowRight, FileText, Bell } from "lucide-react";

const PaymentSuccess = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const paymentType = searchParams.get("type") || "payment";

  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth");
    }
  }, [user, loading, navigate]);

  if (loading || !user) {
    return null;
  }

  const isSubscription = paymentType === "subscription";

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-6 pt-32 pb-16">
        <div className="max-w-2xl mx-auto text-center">
          {/* Success Icon */}
          <div className="mb-8">
            <div className="w-20 h-20 mx-auto bg-primary/20 rounded-full flex items-center justify-center mb-6">
              <CheckCircle className="w-10 h-10 text-primary" />
            </div>
            <h1 className="font-display text-3xl md:text-4xl font-bold mb-4">
              Payment Successful!
            </h1>
            <p className="text-muted-foreground text-lg">
              {isSubscription 
                ? "Welcome to your new subscription! You now have access to all plan features."
                : "Your FOIA request payment has been processed successfully."}
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
                      You'll receive a confirmation email with your receipt and details.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                    <span className="text-primary font-bold">2</span>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">
                      {isSubscription ? "Start Submitting Requests" : "Request Processing"}
                    </h3>
                    <p className="text-muted-foreground text-sm">
                      {isSubscription 
                        ? "You can now submit FOIA requests included in your plan."
                        : "Our team will file your FOIA request with the appropriate agency."}
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
              Submit a Request
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
