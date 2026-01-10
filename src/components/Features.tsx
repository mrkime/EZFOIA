import { 
  Smartphone, 
  Brain, 
  ShieldCheck, 
  Zap, 
  Users, 
  FileStack 
} from "lucide-react";

const features = [
  {
    icon: Smartphone,
    title: "SMS Status Updates",
    description: "Never wonder about your request status. Get instant notifications delivered right to your phone.",
  },
  {
    icon: Brain,
    title: "AI Document Analysis",
    description: "Our AI scans and indexes your documents so you can search through hundreds of pages in seconds.",
  },
  {
    icon: ShieldCheck,
    title: "Compliance Guaranteed",
    description: "We ensure every request meets all legal requirements and is properly formatted for each agency.",
  },
  {
    icon: Zap,
    title: "Lightning Fast",
    description: "Submit requests in minutes, not hours. Our streamlined process gets you results faster.",
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
];

const Features = () => {
  return (
    <section id="features" className="py-24 bg-card">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <span className="text-primary font-semibold text-sm uppercase tracking-wider">Features</span>
          <h2 className="font-display text-3xl md:text-5xl font-bold mt-4 mb-6">
            Everything You Need for{' '}
            <span className="text-gradient">Public Records</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Built from the ground up to make Freedom of Information requests accessible to everyone.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature) => (
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
  );
};

export default Features;
