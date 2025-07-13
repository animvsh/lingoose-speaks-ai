
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const PrivacyPolicy = () => {
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
            <h1 className="text-3xl font-black text-foreground mb-2">Privacy Policy</h1>
            <p className="text-muted-foreground font-semibold">Effective Date: July 13, 2025</p>
          </div>
        </div>

        <div className="prose prose-lg max-w-none">
          <p className="text-lg mb-6">
            Welcome to Bol ("we," "us," or "our"). Your privacy is important to us. This Privacy Policy explains how we collect, use, and protect your personal data when you access or use our website (https://bol.ad) and our services, including our daily 1-on-1 Hindi learning calls and text reminders.
          </p>

          <h2 className="text-2xl font-black text-foreground mb-4">📋 1. Information We Collect</h2>
          <p className="mb-4">We may collect the following categories of personal data:</p>
          <ul className="list-disc pl-6 mb-6">
            <li>Name</li>
            <li>Email address</li>
            <li>Phone number</li>
            <li>Billing and payment details</li>
            <li>IP address and device/browser info</li>
            <li>Interaction logs (e.g., call logs, SMS responses, app usage)</li>
          </ul>

          <h2 className="text-2xl font-black text-foreground mb-4">🔍 2. How We Collect Your Data</h2>
          <p className="mb-4">We collect your data when you:</p>
          <ul className="list-disc pl-6 mb-6">
            <li>Sign up through our website or app</li>
            <li>Enter your phone number or email</li>
            <li>Book a class or make a payment</li>
            <li>Interact with us via SMS, phone call, or email</li>
            <li>Participate in promotions, feedback, or support</li>
          </ul>

          <h2 className="text-2xl font-black text-foreground mb-4">🎯 3. How We Use Your Information</h2>
          <p className="mb-4">Your information is used to:</p>
          <ul className="list-disc pl-6 mb-6">
            <li>Schedule and deliver your daily Hindi speaking lessons</li>
            <li>Send SMS reminders, class updates, and follow-ups</li>
            <li>Communicate promotions or product updates</li>
            <li>Improve and personalize your experience</li>
            <li>Provide support and handle technical issues</li>
            <li>Comply with legal and regulatory obligations</li>
          </ul>

          <h2 className="text-2xl font-black text-foreground mb-4">📞 4. Consent to Calls and SMS</h2>
          <p className="mb-4">
            By submitting your phone number and checking the consent box on our forms, you explicitly agree to receive calls and text messages from Bol at the number you provide. These may be:
          </p>
          <ul className="list-disc pl-6 mb-4">
            <li>Daily Hindi lesson calls</li>
            <li>Reminders and confirmations</li>
            <li>Customer support follow-ups</li>
            <li>Limited-time offers and announcements</li>
          </ul>
          <div className="bg-muted p-4 rounded-lg mb-6">
            <p className="font-semibold mb-2">Consent Language (as shown on our forms):</p>
            <p className="italic">
              "By checking this box and submitting your information, you agree to receive daily calls and text messages from Bol at the number provided, including via automated systems. Consent is not required as a condition of purchase. Message & data rates may apply. You may opt out anytime by replying STOP or contacting us."
            </p>
          </div>

          <h2 className="text-2xl font-black text-foreground mb-4">🚫 5. How to Opt Out</h2>
          <p className="mb-4">You can withdraw your consent and stop communications at any time:</p>
          <ul className="list-disc pl-6 mb-6">
            <li>Reply "STOP" to any SMS</li>
            <li>Email: support@bol.ad</li>
            <li>Call: +1 (XXX) XXX-XXXX</li>
          </ul>
          <p className="mb-6">We will honor your request within 24 hours.</p>

          <h2 className="text-2xl font-black text-foreground mb-4">🔒 6. Data Security</h2>
          <p className="mb-6">
            We use industry-standard protections, including SSL encryption, firewalls, and secure third-party vendors, to protect your data from unauthorized access, misuse, or loss.
          </p>

          <h2 className="text-2xl font-black text-foreground mb-4">⏰ 7. Data Retention</h2>
          <p className="mb-6">
            We retain your data only as long as necessary to provide our services and fulfill our legal obligations. You may request data deletion at any time by contacting us.
          </p>

          <h2 className="text-2xl font-black text-foreground mb-4">🤝 8. Sharing of Information</h2>
          <p className="mb-4">We do not sell your personal information.</p>
          <p className="mb-6">
            We may share your data with trusted third-party providers (e.g., SMS gateways, payment processors) only for service delivery purposes and under strict data protection agreements.
          </p>

          <h2 className="text-2xl font-black text-foreground mb-4">👶 9. Children's Privacy</h2>
          <p className="mb-6">
            Bol is not directed to children under 13. We do not knowingly collect personal information from minors. If you believe we've unintentionally collected such data, please contact us for immediate deletion.
          </p>

          <h2 className="text-2xl font-black text-foreground mb-4">📝 10. Changes to This Policy</h2>
          <p className="mb-6">
            We may occasionally update this Privacy Policy. All changes will be reflected on this page with a new "Effective Date." Continued use of our services after changes constitutes acceptance.
          </p>

          <h2 className="text-2xl font-black text-foreground mb-4">📞 11. Contact Us</h2>
          <p className="mb-4">Have questions or concerns about your data?</p>
          <p className="mb-6">
            Email: support@bol.ad<br />
            Website: https://bol.ad
          </p>

          <h2 className="text-2xl font-black text-foreground mb-4">⚠️ Legal Disclaimer</h2>
          <p className="mb-8">
            This Privacy Policy is for informational purposes only and does not constitute legal advice. We recommend consulting a legal professional to ensure compliance with all applicable data protection laws, including the TCPA, CCPA, and GDPR (if applicable).
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
            <p className="mt-2">© 2025 Bol. All rights reserved.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
