import { ClipboardList, Send, Bell, FileSearch } from "lucide-react";

const steps = [
  {
    icon: ClipboardList,
    step: "01",
    title: "Submit Your Info",
    description: "Tell us what records you need and from which agency. As simple as filling out an online form.",
  },
  {
    icon: Send,
    step: "02",
    title: "We File For You",
    description: "Our team handles all the paperwork, proper formatting, and submission to the right agencies.",
  },
  {
    icon: Bell,
    step: "03",
    title: "Track Progress",
    description: "Receive real-time SMS updates as your request moves through the process.",
  },
  {
    icon: FileSearch,
    step: "04",
    title: "Search & Analyze",
    description: "Once approved, our AI scans your documents so you can search and find exactly what you need.",
  },
];

const HowItWorks = () => {
  return (
    <section id="how-it-works" className="py-24 bg-background">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <span className="text-primary font-semibold text-sm uppercase tracking-wider">How It Works</span>
          <h2 className="font-display text-3xl md:text-5xl font-bold mt-4 mb-6">
            Four Simple Steps to{' '}
            <span className="text-gradient">Transparency</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            We've streamlined the entire FOIA process so you can focus on what matters—getting the information you need.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div
              key={step.step}
              className="relative group"
            >
              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-12 left-[60%] w-full h-[2px] bg-gradient-to-r from-primary/50 to-transparent" />
              )}
              
              <div className="glass rounded-2xl p-8 h-full hover:border-primary/50 transition-all duration-300 hover:-translate-y-1">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                    <step.icon className="w-7 h-7 text-primary" />
                  </div>
                  <span className="font-display text-4xl font-bold text-muted-foreground/30">{step.step}</span>
                </div>
                <h3 className="font-display text-xl font-semibold mb-3">{step.title}</h3>
                <p className="text-muted-foreground">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
