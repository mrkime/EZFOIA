import { Button } from "@/components/ui/button";
import { ArrowRight, Shield, Clock, FileSearch } from "lucide-react";
import RequestFormModal from "./RequestFormModal";

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-hero-gradient pt-20">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 -left-32 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '2s' }} />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 glass rounded-full px-4 py-2 mb-8 animate-fade-in">
            <Shield className="w-4 h-4 text-primary" />
            <span className="text-sm text-muted-foreground">Powered by ClearSightAI</span>
          </div>

          {/* Headline */}
          <h1 className="font-display text-4xl md:text-6xl lg:text-7xl font-bold mb-6 animate-fade-in" style={{ animationDelay: '0.1s' }}>
            FOIA Requests Made{' '}
            <span className="text-gradient">Effortlessly Simple</span>
          </h1>

          {/* Subheadline */}
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 animate-fade-in" style={{ animationDelay: '0.2s' }}>
            Request public records as easily as buying something online. We handle the paperwork, 
            you track progress in real-time, and our AI helps you search through your documents.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16 animate-fade-in" style={{ animationDelay: '0.3s' }}>
            <RequestFormModal>
              <Button variant="hero" size="xl">
                Start Your Request
                <ArrowRight className="w-5 h-5" />
              </Button>
            </RequestFormModal>
            <Button variant="heroOutline" size="xl" onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })}>
              See How It Works
            </Button>
          </div>

          {/* Trust Indicators */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in" style={{ animationDelay: '0.4s' }}>
            <div className="glass rounded-xl p-6 hover:border-primary/30 transition-colors">
              <Clock className="w-8 h-8 text-primary mb-3 mx-auto" />
              <h3 className="font-display font-semibold mb-1">Real-Time Tracking</h3>
              <p className="text-sm text-muted-foreground">Get SMS updates on your request status</p>
            </div>
            <div className="glass rounded-xl p-6 hover:border-primary/30 transition-colors">
              <FileSearch className="w-8 h-8 text-primary mb-3 mx-auto" />
              <h3 className="font-display font-semibold mb-1">AI-Powered Search</h3>
              <p className="text-sm text-muted-foreground">Search through your documents instantly</p>
            </div>
            <div className="glass rounded-xl p-6 hover:border-primary/30 transition-colors">
              <Shield className="w-8 h-8 text-primary mb-3 mx-auto" />
              <h3 className="font-display font-semibold mb-1">Fully Managed</h3>
              <p className="text-sm text-muted-foreground">We handle all the complexity for you</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
