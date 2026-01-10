import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const CTA = () => {
  return (
    <section className="py-24 bg-card relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/10 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="glass rounded-3xl p-12 md:p-16 text-center max-w-4xl mx-auto">
          <h2 className="font-display text-3xl md:text-5xl font-bold mb-6">
            Ready to Unlock{' '}
            <span className="text-gradient">Public Records?</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto mb-10">
            Join thousands of journalists, researchers, and citizens who use EZFOIA 
            to access the information they deserve. Start your first request today.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button variant="hero" size="xl">
              Start Your First Request
              <ArrowRight className="w-5 h-5" />
            </Button>
            <Button variant="heroOutline" size="xl">
              Talk to Our Team
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTA;
