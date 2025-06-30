
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Sparkles, Heart, Star, Zap } from "lucide-react";
import DuckMascot from "./DuckMascot";
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
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 flex items-center justify-center p-6">
      <div className={`w-full max-w-md transition-all duration-1000 ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
        <div className="text-center space-y-8">
          {/* Animated Duck with decorative elements */}
          <div className="relative">
            <div className="absolute -top-4 -left-8 w-12 h-12 bg-orange-400 rounded-full flex items-center justify-center animate-bounce" style={{ animationDelay: '0.5s' }}>
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div className="absolute -top-2 -right-6 w-10 h-10 bg-pink-400 rounded-full flex items-center justify-center animate-pulse">
              <Heart className="w-5 h-5 text-white" />
            </div>
            <DuckMascot className="w-32 h-32 mx-auto animate-bounce" />
            <div className="absolute -bottom-4 -right-8 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center animate-spin">
              <Star className="w-4 h-4 text-orange-800" />
            </div>
          </div>

          {/* Main Welcome Message */}
          <div className="space-y-6">
            <div className="relative">
              <h1 className="text-5xl font-black text-orange-600 mb-4 uppercase tracking-wide transform -rotate-1">
                NAMASTE! 🙏
              </h1>
              <div className="absolute -top-2 -right-4 w-6 h-6 bg-orange-400 rounded-full animate-ping"></div>
            </div>
            
            <div className="bg-gradient-to-r from-blue-400 to-purple-500 rounded-3xl p-6 border-4 border-blue-600 shadow-2xl relative overflow-hidden">
              <div className="absolute inset-0 bg-white bg-opacity-10 animate-pulse"></div>
              <div className="relative z-10">
                <h2 className="text-2xl font-black text-white mb-3 uppercase tracking-wide">
                  YOUR AI HINDI TEACHER
                </h2>
                <p className="text-blue-100 font-bold text-lg">
                  Who happens to be a super smart goose! 🦆
                </p>
              </div>
            </div>

            {/* Fun tagline */}
            <div className="bg-white rounded-2xl p-4 border-4 border-orange-200 shadow-lg">
              <p className="text-orange-700 font-black text-xl italic">
                "Let's quack the code of Hindi together!"
              </p>
            </div>
          </div>

          {/* Enhanced CTA Button */}
          <Button
            onClick={handleStartJourney}
            className="w-full bg-gradient-to-r from-orange-500 via-pink-500 to-purple-500 hover:from-orange-600 hover:via-pink-600 hover:to-purple-600 text-white font-black py-6 text-2xl rounded-3xl border-4 border-orange-600 shadow-2xl transform hover:scale-105 transition-all duration-300 relative overflow-hidden uppercase tracking-wide"
          >
            <div className="absolute inset-0 bg-white bg-opacity-20 animate-pulse"></div>
            <div className="relative z-10 flex items-center justify-center">
              <Zap className="w-8 h-8 mr-3 animate-bounce" />
              START MY JOURNEY!
              <Sparkles className="w-8 h-8 ml-3 animate-spin" />
            </div>
          </Button>

          {/* Fun footer message */}
          <div className="text-center p-4 bg-gradient-to-r from-yellow-100 to-orange-100 rounded-2xl border-3 border-yellow-200 shadow-lg">
            <DuckMascot size="sm" className="w-6 h-6 inline-block mr-2" />
            <span className="text-orange-700 font-bold">Ready to become fluent in Hindi? Let's go! 🚀</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomeScreen;
