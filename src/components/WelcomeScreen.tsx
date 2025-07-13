
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Sparkles, Heart, Star, Zap } from "lucide-react";
import BolMascot from "./BolMascot";
import SimpleOnboardingFlow from "./SimpleOnboardingFlow";

interface WelcomeScreenProps {
  onComplete: () => void;
}

const WelcomeScreen = ({ onComplete }: WelcomeScreenProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [phoneNumber] = useState(() => localStorage.getItem('phone_number') || '');

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleStartJourney = () => {
    setShowOnboarding(true);
  };

  if (showOnboarding) {
    return <SimpleOnboardingFlow onComplete={onComplete} phoneNumber={phoneNumber} />;
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6 relative">
      <div className={`w-full max-w-md transition-all duration-1000 ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
        <div className="text-center space-y-8">
          {/* Animated Mascot with decorative elements */}
          <div className="relative">
            <div className="absolute -top-6 -left-10 w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center soft-shadow">
              <Sparkles className="w-8 h-8 text-primary" />
            </div>
            <div className="absolute -top-4 -right-8 w-12 h-12 bg-secondary rounded-full flex items-center justify-center soft-shadow">
              <Heart className="w-6 h-6 text-primary" />
            </div>
            <div className="relative">
              <BolMascot className="w-40 h-40 mx-auto animate-gentle-float" />
              <div className="absolute -bottom-6 -right-10 w-12 h-12 bg-accent rounded-full flex items-center justify-center soft-shadow">
                <Star className="w-6 h-6 text-primary" />
              </div>
            </div>
          </div>

          {/* Main Welcome Message */}
          <div className="space-y-6">
            <div className="relative">
              <h1 className="text-6xl font-black text-primary mb-4 uppercase tracking-wide transform -rotate-2 soft-shadow">
                NAMASTE! 🙏
              </h1>
            </div>
            
            <div className="warm-card p-8 soft-shadow relative overflow-hidden">
              <div className="relative z-10">
                <h2 className="text-3xl font-black text-foreground mb-4 uppercase tracking-wide">
                  YOUR AI HINDI TEACHER
                </h2>
                <p className="text-muted-foreground font-semibold text-xl">
                  Who happens to be a super smart sheep! 🐏
                </p>
              </div>
            </div>

            {/* Fun tagline */}
            <div className="warm-card p-6 soft-shadow">
              <p className="text-primary font-black text-2xl italic">
                "Let's break the language barrier together!"
              </p>
            </div>
          </div>

          {/* Enhanced CTA Button */}
          <div>
            <Button
              onClick={handleStartJourney}
              className="w-full warm-button text-white font-black py-8 text-2xl soft-shadow relative overflow-hidden uppercase tracking-wide"
            >
              <div className="relative z-10 flex items-center justify-center">
                <Zap className="w-10 h-10 mr-4" />
                START MY JOURNEY!
                <Sparkles className="w-10 h-10 ml-4" />
              </div>
            </Button>
          </div>

          {/* Fun footer message */}
          <div className="text-center warm-card p-6 soft-shadow">
            <div className="flex items-center justify-center">
              <BolMascot size="sm" className="w-8 h-8 mr-3" />
              <span className="text-foreground font-black text-lg">Ready to become fluent in Hindi? Let's go! 🚀</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomeScreen;
