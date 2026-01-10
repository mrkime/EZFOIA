import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageHeader from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Code, Zap, Shield, BookOpen, Terminal, Webhook } from "lucide-react";
import { Link } from "react-router-dom";

const ApiAccess = () => {
  const features = [
    {
      icon: Zap,
      title: "Fast & Reliable",
      description: "99.9% uptime with sub-100ms response times for all API calls.",
    },
    {
      icon: Shield,
      title: "Secure by Default",
      description: "OAuth 2.0 authentication with encrypted data transmission.",
    },
    {
      icon: Webhook,
      title: "Webhooks",
      description: "Real-time notifications for request status updates.",
    },
  ];

  const endpoints = [
    { method: "POST", path: "/api/v1/requests", description: "Create a new FOIA request" },
    { method: "GET", path: "/api/v1/requests/:id", description: "Get request details" },
    { method: "GET", path: "/api/v1/requests", description: "List all your requests" },
    { method: "GET", path: "/api/v1/documents/:id", description: "Download received documents" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <PageHeader
        badge="Developer API"
        badgeIcon={Code}
        title="Build with the"
        titleHighlight="EZFOIA API"
        description="Integrate FOIA request capabilities directly into your applications with our powerful REST API. Perfect for journalists, researchers, and legal teams."
      >
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button variant="hero" size="lg">
            <BookOpen className="w-5 h-5 mr-2" />
            View Documentation
          </Button>
          <Button variant="outline" size="lg">
            Get API Key
          </Button>
        </div>
      </PageHeader>

      {/* Features */}
      <section className="py-16 px-6 bg-muted/30">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="bg-card border-border">
                <CardHeader>
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <feature.icon className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle>{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">{feature.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Endpoints */}
      <section className="py-16 px-6">
        <div className="container mx-auto max-w-4xl">
          <h2 className="font-display text-3xl font-bold text-center mb-12">API Endpoints</h2>
          <div className="space-y-4">
            {endpoints.map((endpoint, index) => (
              <div key={index} className="flex items-center gap-4 p-4 rounded-lg bg-card border border-border">
                <span className={`px-3 py-1 rounded text-xs font-mono font-bold ${
                  endpoint.method === "POST" ? "bg-green-500/20 text-green-400" : "bg-blue-500/20 text-blue-400"
                }`}>
                  {endpoint.method}
                </span>
                <code className="font-mono text-sm text-foreground">{endpoint.path}</code>
                <span className="text-muted-foreground text-sm ml-auto hidden sm:block">{endpoint.description}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Code Example */}
      <section className="py-16 px-6 bg-muted/30">
        <div className="container mx-auto max-w-4xl">
          <h2 className="font-display text-3xl font-bold text-center mb-12">Quick Start</h2>
          <Card className="bg-card border-border overflow-hidden">
            <CardHeader className="bg-muted/50 border-b border-border">
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm font-mono text-muted-foreground">Create a FOIA Request</span>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <pre className="p-6 overflow-x-auto text-sm">
                <code className="text-foreground">{`curl -X POST https://api.ezfoia.com/v1/requests \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "agency": "Department of Justice",
    "description": "Records related to...",
    "record_type": "Emails"
  }'`}</code>
              </pre>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-6">
        <div className="container mx-auto max-w-2xl text-center">
          <h2 className="font-display text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-muted-foreground mb-8">
            Sign up for an API key and start building today. Free tier includes 100 requests per month.
          </p>
          <Link to="/auth">
            <Button variant="hero" size="lg">Create Free Account</Button>
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ApiAccess;
