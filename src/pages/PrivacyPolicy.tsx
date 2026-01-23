import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageHeader from "@/components/PageHeader";
import { Shield } from "lucide-react";
const PrivacyPolicy = () => {
  return <div className="min-h-screen bg-background">
      <Navbar />
      
      <PageHeader badge="Legal" badgeIcon={Shield} title="Privacy" titleHighlight="Policy" />

      <section className="pb-16 px-6">
        <div className="container mx-auto max-w-3xl">
          <p className="text-muted-foreground mb-12">Last updated: January 10, 2026</p>

          <div className="prose prose-invert max-w-none space-y-8">
            <section>
              <h2 className="font-display text-2xl font-bold mb-4">1. Introduction</h2>
              <p className="text-muted-foreground leading-relaxed">
                EZFOIA ("we," "our," or "us"), a subsidiary of ClearSightAI, is committed to protecting your privacy. 
                This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you 
                use our FOIA request service platform.
              </p>
            </section>

            <section>
              <h2 className="font-display text-2xl font-bold mb-4">2. Information We Collect</h2>
              <h3 className="font-semibold text-lg mb-2">Personal Information</h3>
              <p className="text-muted-foreground leading-relaxed mb-4">
                We collect information you provide directly to us, including:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 mb-4">
                <li>Name, email address, and phone number</li>
                <li>Billing information and payment details</li>
                <li>FOIA request content and related documents</li>
                <li>Communications with our support team</li>
              </ul>
              <h3 className="font-semibold text-lg mb-2">Automatically Collected Information</h3>
              <p className="text-muted-foreground leading-relaxed">
                When you use our service, we automatically collect certain information, including your IP address, 
                browser type, device information, and usage data through cookies and similar technologies.
              </p>
            </section>

            <section>
              <h2 className="font-display text-2xl font-bold mb-4">3. How We Use Your Information</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">We use the information we collect to:</p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2">
                <li>Process and submit your FOIA requests to appropriate agencies</li>
                <li>Provide, maintain, and improve our services</li>
                <li>Send you updates about your requests and our services</li>
                <li>Process payments and prevent fraud</li>
                <li>Respond to your comments and questions</li>
                <li>Comply with legal obligations</li>
              </ul>
            </section>

            <section>
              <h2 className="font-display text-2xl font-bold mb-4">4. Information Sharing</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                We may share your information in the following circumstances:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2">
                <li><strong>Government Agencies:</strong> To submit and process your FOIA requests</li>
                <li><strong>Service Providers:</strong> Third parties who perform services on our behalf</li>
                <li><strong>Legal Requirements:</strong> When required by law or to protect our rights</li>
                <li><strong>Business Transfers:</strong> In connection with a merger or acquisition</li>
              </ul>
            </section>

            <section>
              <h2 className="font-display text-2xl font-bold mb-4">5. Data Security</h2>
              <p className="text-muted-foreground leading-relaxed">
                We implement appropriate technical and organizational measures to protect your personal information 
                against unauthorized access, alteration, disclosure, or destruction. This includes encryption, 
                secure servers, and regular security assessments.
              </p>
            </section>

            <section>
              <h2 className="font-display text-2xl font-bold mb-4">6. Data Retention</h2>
              <p className="text-muted-foreground leading-relaxed">
                We retain your personal information for as long as necessary to fulfill the purposes for which it 
                was collected, including to satisfy legal, accounting, or reporting requirements. FOIA request 
                records are retained for 7 years after request completion.
              </p>
            </section>

            <section>
              <h2 className="font-display text-2xl font-bold mb-4">7. Your Rights</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Depending on your location, you may have certain rights regarding your personal information:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2">
                <li>Access and receive a copy of your data</li>
                <li>Correct inaccurate information</li>
                <li>Request deletion of your data</li>
                <li>Object to or restrict processing</li>
                <li>Data portability</li>
                <li>Withdraw consent at any time</li>
              </ul>
            </section>

            <section>
              <h2 className="font-display text-2xl font-bold mb-4">8. Contact Us</h2>
              <p className="text-muted-foreground leading-relaxed">
                If you have any questions about this Privacy Policy or our data practices, please contact us at:
              </p>
              <p className="text-muted-foreground mt-4">Email: privacy@ezfoia.com
Address: 503 S Saginaw St, Suite 1, Flint, MI 48507<strong>Email:</strong> privacy@ezfoia.com<br />
                <strong>Address:</strong> 1234 Innovation Drive, Suite 500, Washington, DC 20001
              </p>
            </section>
          </div>
        </div>
      </section>

      <Footer />
    </div>;
};
export default PrivacyPolicy;