import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { 
  Smartphone, 
  Brain, 
  ShieldCheck, 
  Zap, 
  Users, 
  FileStack,
  Search,
  Bell,
  Lock,
  Clock,
  FileText,
  CheckCircle,
  ArrowRight
} from "lucide-react";

const mainFeatures = [
  {
    icon: Smartphone,
    title: "Real-Time SMS Updates",
    description: "Stay informed every step of the way with instant text notifications. Know exactly when your request is received, being processed, or completed—no more guessing or constant email checking.",
    benefits: ["Instant status notifications", "Delivery confirmations", "Agency response alerts", "Document ready notifications"],
  },
  {
    icon: Brain,
    title: "AI-Powered Document Analysis",
    description: "Our advanced AI doesn't just deliver documents—it makes them useful. Automatically scan, index, and search through hundreds of pages in seconds to find exactly what you need.",
    benefits: ["Full-text search", "Key phrase extraction", "Document summarization", "Cross-reference detection"],
  },
  {
    icon: ShieldCheck,
    title: "100% Compliance Guaranteed",
    description: "Every request is reviewed by our system to ensure it meets all federal and state FOIA requirements. We format requests perfectly for each agency's specific guidelines.",
    benefits: ["Agency-specific formatting", "Legal requirement checks", "Proper fee waivers", "Appeal assistance"],
  },
];

const additionalFeatures = [
  {
    icon: Zap,
    title: "Lightning Fast Filing",
    description: "Submit requests in minutes, not hours. Our streamlined process removes the complexity.",
  },
  {
    icon: Users,
    title: "Expert Support",
    description: "Our team of FOIA specialists is here to help you navigate any complexities.",
  },
  {
    icon: FileStack,
    title: "Organized Archive",
    description: "All your requests and documents in one place, searchable and accessible forever.",
  },
  {
    icon: Search,
    title: "Smart Search",
    description: "Find any document or request instantly with our powerful search capabilities.",
  },
  {
    icon: Bell,
    title: "Custom Alerts",
    description: "Set up personalized notifications for specific agencies or document types.",
  },
  {
    icon: Lock,
    title: "Secure Storage",
    description: "Bank-level encryption keeps your documents and personal information safe.",
  },
  {
    icon: Clock,
    title: "Deadline Tracking",
    description: "Never miss an agency response deadline with automatic tracking and reminders.",
  },
  {
    icon: FileText,
    title: "Template Library",
    description: "Access proven request templates for common document types across agencies.",
  },
  {
    icon: CheckCircle,
    title: "Quality Assurance",
    description: "Every request is reviewed for completeness before submission.",
  },
];

const FeaturesPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-32 pb-20 bg-hero-gradient relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 -left-32 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse-slow" />
          <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse-slow" />
        </div>
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <span className="text-primary font-semibold text-sm uppercase tracking-wider">Features</span>
            <h1 className="font-display text-4xl md:text-6xl font-bold mt-4 mb-6">
              Powerful Tools for{' '}
              <span className="text-gradient">Public Records</span>
            </h1>
            <p className="text-muted-foreground text-lg md:text-xl mb-8">
              Everything you need to request, track, and analyze government documents—all in one platform 
              built for the modern era.
            </p>
            <Link to="/#pricing">
              <Button variant="hero" size="lg" className="gap-2">
                View Plans & Pricing
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Main Features - Detailed */}
      <section className="py-24">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <span className="text-primary font-semibold text-sm uppercase tracking-wider">Core Capabilities</span>
            <h2 className="font-display text-3xl md:text-4xl font-bold mt-4 mb-6">
              What Sets Us Apart
            </h2>
          </div>
          
          <div className="space-y-24">
            {mainFeatures.map((feature, index) => (
              <div 
                key={feature.title}
                className={`grid lg:grid-cols-2 gap-12 items-center ${
                  index % 2 === 1 ? 'lg:flex-row-reverse' : ''
                }`}
              >
                <div className={index % 2 === 1 ? 'lg:order-2' : ''}>
                  <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-6">
                    <feature.icon className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="font-display text-2xl md:text-3xl font-bold mb-4">{feature.title}</h3>
                  <p className="text-muted-foreground text-lg mb-6">{feature.description}</p>
                  
                  <ul className="grid sm:grid-cols-2 gap-3">
                    {feature.benefits.map((benefit) => (
                      <li key={benefit} className="flex items-center gap-2">
                        <CheckCircle className="w-5 h-5 text-primary flex-shrink-0" />
                        <span className="text-foreground">{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className={`${index % 2 === 1 ? 'lg:order-1' : ''}`}>
                  <div className="bg-card-gradient rounded-2xl p-8 border border-border aspect-square flex items-center justify-center relative overflow-hidden">
                    <div className="absolute inset-0 bg-primary/5" />
                    <feature.icon className="w-32 h-32 text-primary/30" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Additional Features Grid */}
      <section className="py-24 bg-card">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <span className="text-primary font-semibold text-sm uppercase tracking-wider">More Features</span>
            <h2 className="font-display text-3xl md:text-4xl font-bold mt-4 mb-6">
              Everything Else You Need
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Built from the ground up to make Freedom of Information requests accessible to everyone.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {additionalFeatures.map((feature) => (
              <div
                key={feature.title}
                className="group bg-background rounded-2xl p-8 border border-border hover:border-primary/50 transition-all duration-300 hover:-translate-y-1 shadow-card"
              >
                <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
                  <feature.icon className="w-7 h-7 text-primary" />
                </div>
                <h3 className="font-display text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24">
        <div className="container mx-auto px-6">
          <div className="bg-card-gradient rounded-3xl p-12 md:p-16 border border-border text-center relative overflow-hidden">
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
            </div>
            
            <div className="relative z-10 max-w-2xl mx-auto">
              <h2 className="font-display text-3xl md:text-4xl font-bold mb-6">
                Ready to Get Started?
              </h2>
              <p className="text-muted-foreground text-lg mb-8">
                Join thousands of journalists, researchers, and citizens who trust EZFOIA for their 
                public records requests.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/#pricing">
                  <Button variant="hero" size="lg" className="gap-2 w-full sm:w-auto">
                    View Plans & Get Started
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
                <Link to="/contact">
                  <Button variant="outline" size="lg" className="w-full sm:w-auto">
                    Contact Sales
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default FeaturesPage;