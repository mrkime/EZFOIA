import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageHeader from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Rocket, Target, Eye, User, ArrowRight, Info } from "lucide-react";
import { AboutSEO } from "@/components/SEO";

const values = [
  {
    icon: Target,
    title: "Clear Request Creation",
    description: "Straightforward forms that guide you through the FOIA process without legal jargon or confusion.",
  },
  {
    icon: Eye,
    title: "Centralized Tracking",
    description: "All your requests in one place with real-time status updates and timeline visibility.",
  },
  {
    icon: Rocket,
    title: "Transparency First",
    description: "Clear information about timelines, agencies, and what to expect at every step.",
  },
];

const About = () => {
  return (
    <div className="min-h-screen bg-background">
      <AboutSEO />
      <Navbar />
      <PageHeader
        badge="About Us"
        badgeIcon={Info}
        title="Democratizing Access to"
        titleHighlight="Public Records"
        description="EZFOIA was founded on a simple belief: everyone deserves easy access to government information. We're on a mission to make the Freedom of Information process accessible, affordable, and efficient."
      />

      {/* Our Story */}
      <section className="py-24">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto">
            <span className="text-primary font-semibold text-sm uppercase tracking-wider">Our Story</span>
            <h2 className="font-display text-3xl md:text-4xl font-bold mt-4 mb-6">
              Built to Make FOIA Simpler
            </h2>
            <div className="space-y-4 text-muted-foreground">
              <p>
                EZFOIA was founded in 2026 by Andrew Kime with one goal: to remove friction from the FOIA process.
              </p>
              <p>
                Rather than starting as a large institution or law firm tool, EZFOIA was designed from the ground up 
                as a modern, user-first platform — one that handles the complexity behind the scenes while keeping 
                the experience straightforward for the person filing the request.
              </p>
              <p className="font-medium text-foreground">
                The focus from day one has been practicality:
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-6 mt-10">
              {values.map((value) => (
                <div 
                  key={value.title}
                  className="bg-card-gradient rounded-2xl p-6 border border-border text-center"
                >
                  <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <value.icon className="w-7 h-7 text-primary" />
                  </div>
                  <h3 className="font-display text-lg font-semibold mb-2">{value.title}</h3>
                  <p className="text-muted-foreground text-sm">{value.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* What We're Building */}
      <section className="py-24 bg-card">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto text-center">
            <span className="text-primary font-semibold text-sm uppercase tracking-wider">What We're Building</span>
            <h2 className="font-display text-3xl md:text-4xl font-bold mt-4 mb-6">
              A Growing Platform
            </h2>
            <div className="space-y-4 text-muted-foreground text-lg">
              <p>
                EZFOIA is part of a broader effort to modernize how people interact with public information. 
                The platform is continuously improving, expanding agency coverage, and refining automation 
                to make requests faster and more reliable over time.
              </p>
              <p className="font-medium text-foreground">
                This isn't a finished system — it's a growing one.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-24">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <span className="text-primary font-semibold text-sm uppercase tracking-wider">Our Team</span>
              <h2 className="font-display text-3xl md:text-4xl font-bold mt-4 mb-6">
                Founder
              </h2>
            </div>
            
            <div className="bg-card-gradient rounded-2xl p-8 border border-border text-center max-w-md mx-auto">
              <div className="w-24 h-24 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-6">
                <User className="w-12 h-12 text-primary" />
              </div>
              <h3 className="font-display text-2xl font-semibold mb-1">Andrew Kime</h3>
              <p className="text-primary mb-6">Founder & Developer</p>
              <p className="text-muted-foreground">
                EZFOIA is currently built and operated by a single founder, with support from advisors, 
                early users, and contributors who help guide the platform's direction.
              </p>
            </div>
            
            <p className="text-center text-muted-foreground mt-8 max-w-lg mx-auto">
              As EZFOIA grows, the team will grow with it — but the mission remains the same: 
              make public records accessible without unnecessary barriers.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-card">
        <div className="container mx-auto px-6 text-center">
          <div className="max-w-2xl mx-auto">
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-6">
              Ready to Get Started?
            </h2>
            <p className="text-muted-foreground text-lg mb-8">
              Whether you're a journalist, researcher, or curious citizen — we're here to help you 
              access the information you need.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/auth">
                <Button variant="hero" size="lg" className="gap-2">
                  Start Your First Request
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <Link to="/foia-guide">
                <Button variant="outline" size="lg">
                  Learn About FOIA
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default About;
