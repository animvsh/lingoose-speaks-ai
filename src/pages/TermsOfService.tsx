
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const TermsOfService = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8">
          <Button
            onClick={() => navigate(-1)}
            variant="ghost"
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          
          <div className="text-center mb-8">
            <img 
              src="/lovable-uploads/711f26ed-7bb6-4411-8c08-9a443f487dfa.png" 
              alt="Bol Logo" 
              className="h-16 w-auto object-contain mx-auto mb-4" 
            />
            <h1 className="text-3xl font-black text-foreground mb-2">Terms of Service</h1>
            <p className="text-muted-foreground font-semibold">Effective Date: July 13, 2025</p>
            <p className="text-muted-foreground font-semibold">Website: https://bol.ad</p>
          </div>
        </div>

        <div className="prose prose-lg max-w-none">
          <h2 className="text-2xl font-black text-foreground mb-4">1. Acceptance of Terms</h2>
          <p className="mb-6">
            By accessing or using Bol ("we," "us," or "our") via our website, app, or communication channels (including SMS and phone calls), you agree to be bound by these Terms of Service ("Terms"). If you do not agree to these Terms, do not use our services.
          </p>

          <h2 className="text-2xl font-black text-foreground mb-4">2. Description of Services</h2>
          <p className="mb-6">
            Bol offers daily 1-on-1 Hindi language learning via phone calls and SMS, as well as access to additional educational content and features. Services are delivered through our website, direct calls, and text messaging systems.
          </p>

          <h2 className="text-2xl font-black text-foreground mb-4">3. Eligibility</h2>
          <p className="mb-6">
            You must be at least 13 years old to use our services. By using Bol, you confirm that you meet this age requirement and are legally able to enter into this agreement.
          </p>

          <h2 className="text-2xl font-black text-foreground mb-4">4. Account Registration</h2>
          <p className="mb-6">
            To use our services, you may need to register and provide accurate, complete information including your phone number. You are responsible for maintaining the confidentiality of your account and for all activity under it.
          </p>

          <h2 className="text-2xl font-black text-foreground mb-4">5. User Conduct</h2>
          <p className="mb-4">You agree not to:</p>
          <ul className="list-disc pl-6 mb-6">
            <li>Use our service for any unlawful or unauthorized purpose</li>
            <li>Disrupt or interfere with our services or networks</li>
            <li>Resell, license, or exploit our content or service</li>
            <li>Harass instructors or other users</li>
            <li>Provide false or misleading information</li>
          </ul>

          <h2 className="text-2xl font-black text-foreground mb-4">6. Payment and Billing</h2>
          <p className="mb-4">
            Bol is a paid subscription service. By subscribing, you authorize us to charge your payment method on a recurring basis. All fees are listed in USD and are non-refundable, unless otherwise stated in writing.
          </p>
          <p className="mb-6">
            <strong>Cancel Anytime:</strong> You may cancel at any time through your account settings or by emailing support@bol.ad. Cancellation takes effect at the end of your billing cycle.
          </p>

          <h2 className="text-2xl font-black text-foreground mb-4">7. Consent to Communication</h2>
          <p className="mb-4">By providing your contact information, you consent to receive:</p>
          <ul className="list-disc pl-6 mb-6">
            <li>Scheduled learning sessions</li>
            <li>Service updates</li>
            <li>Support-related messages</li>
            <li>Limited promotional content</li>
          </ul>
          <p className="mb-6">
            Message and data rates may apply. You may opt out by replying "STOP" to any SMS or contacting support.
          </p>

          <h2 className="text-2xl font-black text-foreground mb-4">8. Intellectual Property</h2>
          <p className="mb-6">
            All content, trademarks, and service marks on Bol are the property of Bol or its licensors. You may not copy, reproduce, or distribute any part of our service without prior written consent.
          </p>

          <h2 className="text-2xl font-black text-foreground mb-4">9. Termination</h2>
          <p className="mb-6">
            We reserve the right to suspend or terminate your access to the service at any time, with or without notice, if you violate these Terms or misuse our platform.
          </p>

          <h2 className="text-2xl font-black text-foreground mb-4">10. Disclaimer of Warranties</h2>
          <p className="mb-6">
            Bol is provided "as is" and "as available." We do not guarantee uninterrupted or error-free service. We disclaim all warranties, including fitness for a particular purpose, non-infringement, and merchantability.
          </p>

          <h2 className="text-2xl font-black text-foreground mb-4">11. Limitation of Liability</h2>
          <p className="mb-6">
            To the maximum extent permitted by law, Bol is not liable for any indirect, incidental, special, or consequential damages arising out of your use of our services.
          </p>

          <h2 className="text-2xl font-black text-foreground mb-4">12. Changes to These Terms</h2>
          <p className="mb-6">
            We may update these Terms occasionally. The latest version will always be posted at https://bol.ad with an updated effective date. Continued use of the service after changes implies acceptance.
          </p>

          <h2 className="text-2xl font-black text-foreground mb-4">13. Governing Law</h2>
          <p className="mb-6">
            These Terms are governed by the laws of the State of California, without regard to conflict-of-law principles.
          </p>

          <h2 className="text-2xl font-black text-foreground mb-4">14. Contact Us</h2>
          <p className="mb-8">
            If you have questions about these Terms, please reach out:<br />
            Email: support@bol.ad<br />
            Website: https://bol.ad
          </p>
        </div>

        <div className="text-center mt-12 pt-8 border-t border-border">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <img 
              src="/lovable-uploads/711f26ed-7bb6-4411-8c08-9a443f487dfa.png" 
              alt="Bol Logo" 
              className="h-10 w-auto object-contain" 
            />
          </div>
          <div className="space-y-2 font-semibold text-muted-foreground">
            <p>Fluent kids. Happy grandparents.</p>
            <p>No drama.</p>
          </div>
          <div className="pt-4 text-sm font-medium text-muted-foreground">
            <p>📩 support@bol.ad</p>
            <p className="mt-2">
              <a href="/privacy-policy" className="hover:text-primary transition-colors">Privacy Policy</a> • <a href="/terms-of-service" className="hover:text-primary transition-colors">Terms of Service</a> • © 2025 Bol. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService;
