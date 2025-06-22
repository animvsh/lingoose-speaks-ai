
import { Button } from "@/components/ui/button";
import { HelpCircle, MessageCircle, Mail, Phone as PhoneIcon, FileText, ExternalLink, ChevronRight, Home, Phone, CheckCircle, Settings, ArrowLeft, Book, Video, Users, Headphones } from "lucide-react";
import { useState } from "react";
import AppBar from "./AppBar";

interface HelpSupportPageProps {
  onNavigate: (view: string) => void;
}

const HelpSupportPage = ({ onNavigate }: HelpSupportPageProps) => {
  const [showFAQ, setShowFAQ] = useState(false);

  const faqItems = [
    {
      question: "How do I improve my pronunciation?",
      answer: "Practice regularly with our AI conversations, focus on listening to native speakers, and don't be afraid to make mistakes! Our speech recognition will help you identify areas for improvement."
    },
    {
      question: "Can I change my learning pace?",
      answer: "Yes! You can adjust your daily goals and lesson frequency in the curriculum section. We recommend starting with 10-15 minutes daily and gradually increasing as you build the habit."
    },
    {
      question: "How does the fluency scoring work?",
      answer: "Our AI analyzes your speech patterns, vocabulary usage, grammar accuracy, and conversational flow to give you a comprehensive fluency score from 0-100%."
    },
    {
      question: "Is my data secure?",
      answer: "Absolutely! We use industry-standard encryption and never share your personal information with third parties. Your voice recordings are processed securely and can be deleted anytime."
    },
    {
      question: "How do notifications work?",
      answer: "You can enable push notifications to get reminded about lessons, achievements, and daily practice. All notifications can be customized or disabled in settings."
    }
  ];

  return (
    <div className="min-h-screen bg-amber-50 pb-24">
      <AppBar 
        title="HELP & SUPPORT" 
        onBack={() => onNavigate("settings")} 
        showBackButton={true} 
      />

      <div className="px-6 space-y-6">
        {/* FAQ Section */}
        <div className="bg-white rounded-3xl p-6 border-4 border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-gray-800 text-lg uppercase tracking-wide">
              Frequently Asked Questions
            </h3>
            <Button
              onClick={() => setShowFAQ(!showFAQ)}
              className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold py-2 px-4 rounded-xl"
            >
              {showFAQ ? "Hide FAQs" : "Show FAQs"}
            </Button>
          </div>
          
          {showFAQ && (
            <div className="space-y-3">
              {faqItems.map((item, index) => (
                <div key={index} className="bg-gray-50 rounded-xl p-4 border-2 border-gray-200">
                  <h4 className="font-bold text-gray-800 mb-2 text-sm">{item.question}</h4>
                  <p className="text-xs text-gray-600 leading-relaxed">{item.answer}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Contact Support Section */}
        <div className="bg-white rounded-3xl p-6 border-4 border-gray-200">
          <h3 className="font-bold text-gray-800 text-lg uppercase tracking-wide mb-4">
            Contact Support
          </h3>
          <iframe
            src="https://app.youform.com/forms/i8pgpq7n"
            width="100%"
            height="500"
            frameBorder="0"
            className="rounded-lg border-2 border-gray-300"
            title="Support Form"
          />
        </div>
      </div>
    </div>
  );
};

export default HelpSupportPage;
