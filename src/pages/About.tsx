import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Shield, Target, Heart, Award, Users, Globe } from "lucide-react";

const values = [
  {
    icon: Shield,
    title: "Transparency",
    description: "We believe in open government and the public's right to know. Every citizen deserves access to public records.",
  },
  {
    icon: Target,
    title: "Efficiency",
    description: "Time is valuable. We've streamlined the FOIA process so you can focus on what matters—the information.",
  },
  {
    icon: Heart,
    title: "Accessibility",
    description: "Public records should be accessible to everyone, not just legal professionals or journalists.",
  },
];

const stats = [
  { value: "10,000+", label: "Requests Filed" },
  { value: "500+", label: "Agencies Covered" },
  { value: "98%", label: "Success Rate" },
  { value: "48hrs", label: "Avg. Filing Time" },
];

const team = [
  {
    name: "Sarah Chen",
    role: "Founder & CEO",
    bio: "Former investigative journalist with 15 years of FOIA experience.",
  },
  {
    name: "Marcus Williams",
    role: "Head of Legal",
    bio: "Ex-DOJ attorney specializing in government transparency law.",
  },
  {
    name: "Dr. Emily Rodriguez",
    role: "Chief Technology Officer",
    bio: "AI researcher focused on document analysis and natural language processing.",
  },
];

const About = () => {
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
            <span className="text-primary font-semibold text-sm uppercase tracking-wider">About Us</span>
            <h1 className="font-display text-4xl md:text-6xl font-bold mt-4 mb-6">
              Democratizing Access to{' '}
              <span className="text-gradient">Public Records</span>
            </h1>
            <p className="text-muted-foreground text-lg md:text-xl">
              EZFOIA was founded on a simple belief: everyone deserves easy access to government information. 
              We're on a mission to make the Freedom of Information process accessible, affordable, and efficient.
            </p>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-24">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <span className="text-primary font-semibold text-sm uppercase tracking-wider">Our Story</span>
              <h2 className="font-display text-3xl md:text-4xl font-bold mt-4 mb-6">
                Born from Frustration, Built with Purpose
              </h2>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  In 2022, our founder Sarah Chen spent months trying to obtain documents for an investigation. 
                  The process was maddening—confusing forms, unresponsive agencies, and endless waiting.
                </p>
                <p>
                  She realized that if a seasoned journalist struggled this much, how could ordinary citizens 
                  ever navigate the system? That frustration became the spark for EZFOIA.
                </p>
                <p>
                  Today, we've helped thousands of people access the information they need—from journalists 
                  investigating local government to citizens researching their own records.
                </p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-6">
              {stats.map((stat) => (
                <div 
                  key={stat.label}
                  className="bg-card-gradient rounded-2xl p-8 border border-border text-center"
                >
                  <p className="font-display text-4xl font-bold text-primary mb-2">{stat.value}</p>
                  <p className="text-muted-foreground">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-24 bg-card">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <span className="text-primary font-semibold text-sm uppercase tracking-wider">Our Values</span>
            <h2 className="font-display text-3xl md:text-4xl font-bold mt-4 mb-6">
              What Drives Us Every Day
            </h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {values.map((value) => (
              <div 
                key={value.title}
                className="bg-background rounded-2xl p-8 border border-border text-center"
              >
                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6">
                  <value.icon className="w-8 h-8 text-primary" />
                </div>
                <h3 className="font-display text-xl font-semibold mb-3">{value.title}</h3>
                <p className="text-muted-foreground">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-24">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <span className="text-primary font-semibold text-sm uppercase tracking-wider">Our Team</span>
            <h2 className="font-display text-3xl md:text-4xl font-bold mt-4 mb-6">
              Meet the People Behind EZFOIA
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              We're a team of journalists, lawyers, and technologists united by a passion for government transparency.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {team.map((member) => (
              <div 
                key={member.name}
                className="bg-card-gradient rounded-2xl p-8 border border-border text-center"
              >
                <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-6">
                  <Users className="w-10 h-10 text-primary" />
                </div>
                <h3 className="font-display text-xl font-semibold mb-1">{member.name}</h3>
                <p className="text-primary text-sm mb-4">{member.role}</p>
                <p className="text-muted-foreground text-sm">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-card">
        <div className="container mx-auto px-6 text-center">
          <div className="max-w-2xl mx-auto">
            <Globe className="w-16 h-16 text-primary mx-auto mb-6" />
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-6">
              Join Our Mission
            </h2>
            <p className="text-muted-foreground text-lg mb-8">
              Whether you're a journalist, researcher, or curious citizen—we're here to help you 
              access the information you need.
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default About;