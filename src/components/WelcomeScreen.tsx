
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
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 flex items-center justify-center p-6 relative">
      <div className={`w-full max-w-md transition-all duration-1000 ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
        <div className="text-center space-y-8">
          {/* Animated Mascot with decorative elements */}
          <div className="relative">
            <div className="absolute -top-6 -left-10 w-16 h-16 bg-gradient-to-br from-orange-400 to-pink-500 rounded-full flex items-center justify-center shadow-lg">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <div className="absolute -top-4 -right-8 w-12 h-12 bg-gradient-to-br from-pink-400 to-purple-500 rounded-full flex items-center justify-center shadow-lg">
              <Heart className="w-6 h-6 text-white" />
            </div>
            <div className="relative">
              <BolMascot className="w-40 h-40 mx-auto" />
              <div className="absolute -bottom-6 -right-10 w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg">
                <Star className="w-6 h-6 text-orange-800" />
              </div>
            </div>
          </div>

          {/* Main Welcome Message */}
          <div className="space-y-6">
            <div className="relative">
              <h1 className="text-6xl font-black text-orange-600 mb-4 uppercase tracking-wide transform -rotate-2 shadow-lg">
                NAMASTE! 🙏
              </h1>
            </div>
            
            <div className="bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 rounded-3xl p-8 border-4 border-blue-600 shadow-xl relative overflow-hidden">
              <div className="relative z-10">
                <h2 className="text-3xl font-black text-white mb-4 uppercase tracking-wide">
                  YOUR AI HINDI TEACHER
                </h2>
                <p className="text-blue-100 font-bold text-xl">
                  Who happens to be a super smart sheep! 🐏
                </p>
              </div>
            </div>

            {/* Fun tagline */}
            <div className="bg-white rounded-2xl p-6 border-4 border-orange-200 shadow-lg">
              <p className="text-orange-700 font-black text-2xl italic">
                "Let's break the language barrier together!"
              </p>
            </div>
          </div>

          {/* Enhanced CTA Button */}
          <div>
            <Button
              onClick={handleStartJourney}
              className="w-full bg-gradient-to-r from-orange-500 via-pink-500 to-purple-500 hover:from-orange-600 hover:via-pink-600 hover:to-purple-600 text-white font-black py-8 text-2xl rounded-3xl border-4 border-orange-600 shadow-xl hover:shadow-2xl transition-all duration-200 hover:scale-105 relative overflow-hidden uppercase tracking-wide"
            >
              <div className="relative z-10 flex items-center justify-center">
                <Zap className="w-10 h-10 mr-4" />
                START MY JOURNEY!
                <Sparkles className="w-10 h-10 ml-4" />
              </div>
            </Button>
          </div>

          {/* Fun footer message */}
          <div className="text-center p-6 bg-gradient-to-r from-yellow-100 to-orange-100 rounded-2xl border-4 border-yellow-200 shadow-lg">
            <div className="flex items-center justify-center">
              <BolMascot size="sm" className="w-8 h-8 mr-3" />
              <span className="text-orange-700 font-black text-lg">Ready to become fluent in Hindi? Let's go! 🚀</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomeScreen;
