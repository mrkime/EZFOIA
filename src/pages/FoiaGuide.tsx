import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageHeader from "@/components/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, FileText, Clock, CheckCircle, AlertCircle, HelpCircle, Scale, Building2 } from "lucide-react";
import { Link } from "react-router-dom";

const FoiaGuide = () => {
  const steps = [
    {
      number: "01",
      title: "Identify the Agency",
      description: "Determine which federal, state, or local agency holds the records you're seeking. Each agency has its own FOIA office.",
    },
    {
      number: "02",
      title: "Describe What You Want",
      description: "Be as specific as possible about the records you're requesting. Include dates, names, and any identifying information.",
    },
    {
      number: "03",
      title: "Submit Your Request",
      description: "Send your request to the appropriate FOIA office. You can use EZFOIA to handle this automatically.",
    },
    {
      number: "04",
      title: "Wait for Response",
      description: "Agencies have 20 business days to respond, though complex requests may take longer. We'll track this for you.",
    },
  ];

  const exemptions = [
    { title: "National Security", description: "Classified information and national defense materials" },
    { title: "Internal Rules", description: "Agency internal personnel rules and practices" },
    { title: "Statutory Exemptions", description: "Information exempted by other federal statutes" },
    { title: "Trade Secrets", description: "Confidential business information" },
    { title: "Inter/Intra Agency Memos", description: "Deliberative process privilege materials" },
    { title: "Personal Privacy", description: "Information that would invade personal privacy" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <PageHeader
        badge="Complete Guide"
        badgeIcon={BookOpen}
        title="Understanding"
        titleHighlight="FOIA Requests"
        description="The Freedom of Information Act gives you the right to access records from any federal agency. Learn how to exercise this right effectively."
      />

      {/* What is FOIA */}
      <section className="py-16 px-6 bg-muted/30">
        <div className="container mx-auto max-w-4xl">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="font-display text-3xl font-bold mb-6">What is FOIA?</h2>
              <p className="text-muted-foreground mb-4">
                The Freedom of Information Act (FOIA) was enacted in 1966 and gives any person the right 
                to request access to federal agency records. It's based on the presumption that government 
                should be transparent and accountable to the public.
              </p>
              <p className="text-muted-foreground mb-6">
                While FOIA applies to federal agencies, most states have similar laws (often called 
                "sunshine laws" or "open records laws") that apply to state and local governments.
              </p>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 text-primary">
                  <Scale className="w-5 h-5" />
                  <span className="font-medium">Federal Law</span>
                </div>
                <div className="flex items-center gap-2 text-primary">
                  <Building2 className="w-5 h-5" />
                  <span className="font-medium">All Agencies</span>
                </div>
              </div>
            </div>
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-primary" />
                  Key Facts
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                  <span>Anyone can file a request — U.S. citizens and non-citizens alike</span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                  <span>No reason required — you don't need to explain why you want the records</span>
                </div>
                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-yellow-500 mt-0.5" />
                  <span>20 business day response time (with possible extensions)</span>
                </div>
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-orange-500 mt-0.5" />
                  <span>Nine exemptions may limit what's disclosed</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How to File */}
      <section className="py-16 px-6">
        <div className="container mx-auto max-w-4xl">
          <h2 className="font-display text-3xl font-bold text-center mb-12">How to File a FOIA Request</h2>
          <div className="space-y-8">
            {steps.map((step, index) => (
              <div key={index} className="flex gap-6 items-start">
                <div className="w-16 h-16 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                  <span className="font-display text-xl font-bold text-primary">{step.number}</span>
                </div>
                <div>
                  <h3 className="font-display text-xl font-semibold mb-2">{step.title}</h3>
                  <p className="text-muted-foreground">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Exemptions */}
      <section className="py-16 px-6 bg-muted/30">
        <div className="container mx-auto max-w-4xl">
          <h2 className="font-display text-3xl font-bold text-center mb-4">Common Exemptions</h2>
          <p className="text-muted-foreground text-center mb-12 max-w-2xl mx-auto">
            Not all government records are available. FOIA includes nine exemptions that allow agencies to withhold certain information.
          </p>
          <div className="grid md:grid-cols-2 gap-4">
            {exemptions.map((exemption, index) => (
              <Card key={index} className="bg-card border-border">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <HelpCircle className="w-5 h-5 text-muted-foreground mt-0.5" />
                    <div>
                      <h4 className="font-semibold mb-1">{exemption.title}</h4>
                      <p className="text-sm text-muted-foreground">{exemption.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-6">
        <div className="container mx-auto max-w-2xl text-center">
          <h2 className="font-display text-3xl font-bold mb-4">Ready to Make Your First Request?</h2>
          <p className="text-muted-foreground mb-8">
            EZFOIA handles all the complexity for you. Just tell us what you're looking for.
          </p>
          <Link to="/">
            <Button variant="hero" size="lg">Get Started Free</Button>
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default FoiaGuide;
