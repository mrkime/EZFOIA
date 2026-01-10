import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageHeader from "@/components/PageHeader";
import { Scale } from "lucide-react";

const Terms = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <PageHeader
        badge="Legal"
        badgeIcon={Scale}
        title="Terms of"
        titleHighlight="Service"
      />

      <section className="pb-16 px-6">
        <div className="container mx-auto max-w-3xl">
          <p className="text-muted-foreground mb-12">Last updated: January 10, 2026</p>

          <div className="prose prose-invert max-w-none space-y-8">
            <section>
              <h2 className="font-display text-2xl font-bold mb-4">1. Agreement to Terms</h2>
              <p className="text-muted-foreground leading-relaxed">
                By accessing or using EZFOIA's services, you agree to be bound by these Terms of Service and all 
                applicable laws and regulations. If you do not agree with any of these terms, you are prohibited 
                from using or accessing this service.
              </p>
            </section>

            <section>
              <h2 className="font-display text-2xl font-bold mb-4">2. Description of Service</h2>
              <p className="text-muted-foreground leading-relaxed">
                EZFOIA provides a platform that facilitates the submission and tracking of Freedom of Information 
                Act (FOIA) requests to government agencies. We act as an intermediary to simplify the process but 
                do not guarantee the outcome of any request or the timeframe in which responses will be received.
              </p>
            </section>

            <section>
              <h2 className="font-display text-2xl font-bold mb-4">3. User Accounts</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                To use our services, you must create an account. You are responsible for:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2">
                <li>Maintaining the confidentiality of your account credentials</li>
                <li>All activities that occur under your account</li>
                <li>Notifying us immediately of any unauthorized use</li>
                <li>Providing accurate and complete information</li>
              </ul>
            </section>

            <section>
              <h2 className="font-display text-2xl font-bold mb-4">4. Acceptable Use</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">You agree not to:</p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2">
                <li>Use the service for any unlawful purpose</li>
                <li>Submit false or misleading information in requests</li>
                <li>Attempt to circumvent security measures</li>
                <li>Interfere with the proper functioning of the service</li>
                <li>Use automated systems to access the service without permission</li>
                <li>Impersonate any person or entity</li>
              </ul>
            </section>

            <section>
              <h2 className="font-display text-2xl font-bold mb-4">5. Payment Terms</h2>
              <p className="text-muted-foreground leading-relaxed">
                Paid subscriptions are billed in advance on a monthly or annual basis. All fees are non-refundable 
                unless otherwise specified. We reserve the right to change our pricing with 30 days' notice. 
                Failure to pay may result in suspension or termination of your account.
              </p>
            </section>

            <section>
              <h2 className="font-display text-2xl font-bold mb-4">6. Intellectual Property</h2>
              <p className="text-muted-foreground leading-relaxed">
                The EZFOIA service, including its original content, features, and functionality, is owned by 
                ClearSightAI and is protected by international copyright, trademark, and other intellectual 
                property laws. You may not copy, modify, or distribute any part of our service without written permission.
              </p>
            </section>

            <section>
              <h2 className="font-display text-2xl font-bold mb-4">7. Limitation of Liability</h2>
              <p className="text-muted-foreground leading-relaxed">
                EZFOIA and its affiliates shall not be liable for any indirect, incidental, special, consequential, 
                or punitive damages resulting from your use of the service. Our total liability shall not exceed 
                the amount you paid us in the 12 months preceding the claim.
              </p>
            </section>

            <section>
              <h2 className="font-display text-2xl font-bold mb-4">8. Disclaimer of Warranties</h2>
              <p className="text-muted-foreground leading-relaxed">
                The service is provided "as is" and "as available" without warranties of any kind. We do not 
                guarantee that FOIA requests will be successful, that agencies will respond within any specific 
                timeframe, or that the service will be uninterrupted or error-free.
              </p>
            </section>

            <section>
              <h2 className="font-display text-2xl font-bold mb-4">9. Termination</h2>
              <p className="text-muted-foreground leading-relaxed">
                We may terminate or suspend your account at any time for violations of these Terms. Upon termination, 
                your right to use the service will immediately cease. Provisions that by their nature should survive 
                termination shall survive.
              </p>
            </section>

            <section>
              <h2 className="font-display text-2xl font-bold mb-4">10. Governing Law</h2>
              <p className="text-muted-foreground leading-relaxed">
                These Terms shall be governed by the laws of the District of Columbia, without regard to its 
                conflict of law provisions. Any disputes shall be resolved in the courts of Washington, D.C.
              </p>
            </section>

            <section>
              <h2 className="font-display text-2xl font-bold mb-4">11. Changes to Terms</h2>
              <p className="text-muted-foreground leading-relaxed">
                We reserve the right to modify these Terms at any time. We will notify users of material changes 
                via email or through the service. Continued use after changes constitutes acceptance of the new Terms.
              </p>
            </section>

            <section>
              <h2 className="font-display text-2xl font-bold mb-4">12. Contact Information</h2>
              <p className="text-muted-foreground leading-relaxed">
                For questions about these Terms, please contact us at:
              </p>
              <p className="text-muted-foreground mt-4">
                <strong>Email:</strong> legal@ezfoia.com<br />
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

export default Terms;
