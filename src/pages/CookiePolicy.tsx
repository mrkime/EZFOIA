import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageHeader from "@/components/PageHeader";
import { Cookie } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const CookiePolicy = () => {
  const cookieTypes = [
    {
      type: "Essential Cookies",
      description: "Required for the website to function properly. These cannot be disabled.",
      examples: ["Session management", "Authentication", "Security tokens"],
    },
    {
      type: "Functional Cookies",
      description: "Enable personalized features and remember your preferences.",
      examples: ["Language preferences", "Theme settings", "Form data"],
    },
    {
      type: "Analytics Cookies",
      description: "Help us understand how visitors interact with our website.",
      examples: ["Page views", "Traffic sources", "User behavior patterns"],
    },
    {
      type: "Marketing Cookies",
      description: "Used to deliver relevant advertisements and track campaign performance.",
      examples: ["Ad targeting", "Conversion tracking", "Retargeting"],
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <PageHeader
        badge="Legal"
        badgeIcon={Cookie}
        title="Cookie"
        titleHighlight="Policy"
      />

      <section className="pb-16 px-6">
        <div className="container mx-auto max-w-3xl">
          <p className="text-muted-foreground mb-12">Last updated: January 10, 2026</p>

          <div className="prose prose-invert max-w-none space-y-8">
            <section>
              <h2 className="font-display text-2xl font-bold mb-4">What Are Cookies?</h2>
              <p className="text-muted-foreground leading-relaxed">
                Cookies are small text files that are stored on your device when you visit a website. They are 
                widely used to make websites work more efficiently and provide information to website owners. 
                Cookies help us improve your experience on EZFOIA by remembering your preferences and understanding 
                how you use our service.
              </p>
            </section>

            <section>
              <h2 className="font-display text-2xl font-bold mb-4">Types of Cookies We Use</h2>
              <div className="space-y-4">
                {cookieTypes.map((cookie, index) => (
                  <Card key={index} className="bg-card border-border">
                    <CardHeader>
                      <CardTitle className="text-lg">{cookie.type}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground mb-3">{cookie.description}</p>
                      <p className="text-sm text-muted-foreground">
                        <strong>Examples:</strong> {cookie.examples.join(", ")}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>

            <section>
              <h2 className="font-display text-2xl font-bold mb-4">Third-Party Cookies</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                In addition to our own cookies, we may also use cookies from trusted third-party services:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2">
                <li><strong>Google Analytics:</strong> To analyze website traffic and usage patterns</li>
                <li><strong>Stripe:</strong> To process secure payments</li>
                <li><strong>Intercom:</strong> To provide customer support chat functionality</li>
              </ul>
            </section>

            <section>
              <h2 className="font-display text-2xl font-bold mb-4">Managing Cookies</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                You can control and manage cookies in several ways:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2">
                <li><strong>Browser Settings:</strong> Most browsers allow you to refuse or accept cookies, 
                  delete existing cookies, and set preferences for certain websites.</li>
                <li><strong>Cookie Consent Tool:</strong> When you first visit our site, you can choose which 
                  types of cookies to accept through our consent banner.</li>
                <li><strong>Third-Party Opt-Out:</strong> Many advertising networks offer opt-out mechanisms 
                  through industry programs like the Digital Advertising Alliance.</li>
              </ul>
              <p className="text-muted-foreground leading-relaxed mt-4">
                Please note that disabling certain cookies may affect the functionality of our website and 
                your user experience.
              </p>
            </section>

            <section>
              <h2 className="font-display text-2xl font-bold mb-4">Cookie Retention</h2>
              <p className="text-muted-foreground leading-relaxed">
                Session cookies are temporary and are deleted when you close your browser. Persistent cookies 
                remain on your device for a set period or until you delete them. Most of our analytics and 
                preference cookies expire after 12 months.
              </p>
            </section>

            <section>
              <h2 className="font-display text-2xl font-bold mb-4">Updates to This Policy</h2>
              <p className="text-muted-foreground leading-relaxed">
                We may update this Cookie Policy from time to time to reflect changes in technology, legislation, 
                or our data practices. We encourage you to periodically review this page for the latest information 
                on our cookie practices.
              </p>
            </section>

            <section>
              <h2 className="font-display text-2xl font-bold mb-4">Contact Us</h2>
              <p className="text-muted-foreground leading-relaxed">
                If you have any questions about our use of cookies, please contact us at:
              </p>
              <p className="text-muted-foreground mt-4">
                <strong>Email:</strong> privacy@ezfoia.com<br />
                <strong>Address:</strong> 1234 Innovation Drive, Suite 500, Washington, DC 20001
              </p>
            </section>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default CookiePolicy;
