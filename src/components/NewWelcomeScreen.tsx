import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sparkles, Heart, Star, Zap, ArrowRight } from "lucide-react";
import BolMascot from "./BolMascot";
import ModernPhoneAuth from "./ModernPhoneAuth";
import ModernOnboarding from "./ModernOnboarding";

interface NewWelcomeScreenProps {
  onComplete: () => void;
}

const NewWelcomeScreen = ({ onComplete }: NewWelcomeScreenProps) => {
  const [currentStep, setCurrentStep] = useState<'welcome' | 'auth' | 'onboarding'>('welcome');
  const [authenticatedPhone, setAuthenticatedPhone] = useState<string>("");

  const handleGetStarted = () => {
    setCurrentStep('auth');
  };

  const handleAuthSuccess = (phoneNumber: string) => {
    setAuthenticatedPhone(phoneNumber);
    setCurrentStep('onboarding');
  };

  const handleOnboardingComplete = () => {
    onComplete();
  };

  if (currentStep === 'auth') {
    return <ModernPhoneAuth onAuthSuccess={handleAuthSuccess} />;
  }

  if (currentStep === 'onboarding') {
    return (
      <ModernOnboarding 
        phoneNumber={authenticatedPhone} 
        onComplete={handleOnboardingComplete} 
      />
    );
  }

  return (
    <div className="min-h-screen hindi-bg flex items-center justify-center p-6 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-primary/10 rounded-full animate-gentle-float"></div>
      <div className="absolute top-40 right-16 w-12 h-12 bg-accent/20 rounded-full animate-gentle-float" style={{ animationDelay: '1s' }}></div>
      <div className="absolute bottom-32 left-20 w-16 h-16 bg-secondary/15 rounded-full animate-gentle-float" style={{ animationDelay: '0.5s' }}></div>
      
      <div className="w-full max-w-md relative z-10">
        <div className="text-center space-y-8">
          {/* Main mascot and decorative elements */}
          <div className="relative mb-8">
            <div className="absolute -top-6 -left-12 w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center shadow-lg animate-gentle-float">
              <Sparkles className="w-8 h-8 text-primary" />
            </div>
            <div className="absolute -top-4 -right-10 w-12 h-12 bg-accent/30 rounded-full flex items-center justify-center shadow-lg animate-gentle-float" style={{ animationDelay: '1.5s' }}>
              <Heart className="w-6 h-6 text-primary" />
            </div>
            
            <BolMascot className="w-32 h-32 mx-auto animate-gentle-float" />
            
            <div className="absolute -bottom-4 -right-12 w-12 h-12 bg-secondary/25 rounded-full flex items-center justify-center shadow-lg animate-gentle-float" style={{ animationDelay: '0.8s' }}>
              <Star className="w-6 h-6 text-primary" />
            </div>
          </div>

          {/* Welcome message */}
          <div className="space-y-6">
            <div className="relative">
              <h1 className="text-5xl font-black text-primary mb-4 uppercase tracking-wide transform -rotate-1 drop-shadow-lg">
                NAMASTE! 🙏
              </h1>
            </div>
            
            <div className="warm-card p-6 border-2 border-handdrawn shadow-xl relative">
              <h2 className="text-2xl font-black text-foreground mb-3 uppercase tracking-wide">
                Your AI Hindi Teacher
              </h2>
              <p className="text-muted-foreground font-bold text-lg">
                Meet Bol, your super smart sheep friend! 🐏
              </p>
            </div>

            {/* Tagline */}
            <div className="warm-card p-5 border border-handdrawn shadow-lg">
              <p className="text-primary font-black text-xl italic">
                "Let's break the language barrier together!"
              </p>
            </div>
          </div>

          {/* Call to action */}
          <div className="space-y-4">
            <Button
              onClick={handleGetStarted}
              className="w-full warm-button text-white font-black py-8 text-xl shadow-xl relative overflow-hidden uppercase tracking-wide group"
            >
              <div className="relative z-10 flex items-center justify-center transition-transform group-hover:scale-105">
                <Zap className="w-8 h-8 mr-3 animate-pulse" />
                START MY JOURNEY
                <ArrowRight className="w-8 h-8 ml-3" />
              </div>
            </Button>

            <div className="text-center">
              <p className="text-xs text-muted-foreground">
                ✨ Free trial • No credit card needed • Start learning today!
              </p>
            </div>
          </div>

          {/* Fun footer */}
          <div className="warm-card p-4 border border-handdrawn shadow-md">
            <div className="flex items-center justify-center gap-3">
              
              <span className="text-foreground font-bold text-sm">
                Ready to become fluent in Hindi? 🚀
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewWelcomeScreen;