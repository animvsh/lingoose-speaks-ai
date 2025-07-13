
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
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 flex items-center justify-center p-6 overflow-hidden relative">
      {/* Floating decorative elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-8 h-8 bg-orange-300 rounded-full animate-bounce" style={{ animationDelay: '0s', animationDuration: '3s' }}></div>
        <div className="absolute top-40 right-20 w-6 h-6 bg-yellow-400 rounded-full animate-bounce" style={{ animationDelay: '1s', animationDuration: '4s' }}></div>
        <div className="absolute bottom-40 left-20 w-10 h-10 bg-amber-300 rounded-full animate-bounce" style={{ animationDelay: '2s', animationDuration: '5s' }}></div>
        <div className="absolute bottom-20 right-10 w-7 h-7 bg-orange-400 rounded-full animate-bounce" style={{ animationDelay: '0.5s', animationDuration: '3.5s' }}></div>
        <div className="absolute top-60 left-1/4 w-5 h-5 bg-pink-400 rounded-full animate-bounce" style={{ animationDelay: '1.5s', animationDuration: '4.5s' }}></div>
        <div className="absolute bottom-60 right-1/4 w-9 h-9 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '2.5s', animationDuration: '6s' }}></div>
      </div>

      <div className={`w-full max-w-md transition-all duration-1000 relative z-10 ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
        <div className="text-center space-y-8">
          {/* Animated Mascot with decorative elements */}
          <div className="relative animate-bounce-in">
            <div className="absolute -top-6 -left-10 w-16 h-16 bg-gradient-to-br from-orange-400 to-pink-500 rounded-full flex items-center justify-center animate-bounce cartoon-shadow" style={{ animationDelay: '0.5s' }}>
              <Sparkles className="w-8 h-8 text-white animate-spin" />
            </div>
            <div className="absolute -top-4 -right-8 w-12 h-12 bg-gradient-to-br from-pink-400 to-purple-500 rounded-full flex items-center justify-center animate-pulse cartoon-shadow">
              <Heart className="w-6 h-6 text-white animate-bounce" />
            </div>
            <div className="relative">
              <BolMascot className="w-40 h-40 mx-auto animate-float hover:animate-wiggle" />
              <div className="absolute -bottom-6 -right-10 w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center animate-spin cartoon-shadow" style={{ animationDuration: '4s' }}>
                <Star className="w-6 h-6 text-orange-800" />
              </div>
            </div>
          </div>

          {/* Main Welcome Message */}
          <div className="space-y-6">
            <div className="relative animate-bounce-in" style={{ animationDelay: '0.3s' }}>
              <h1 className="text-6xl font-black text-orange-600 mb-4 uppercase tracking-wide transform -rotate-2 animate-wiggle cartoon-shadow">
                NAMASTE! 🙏
              </h1>
              <div className="absolute -top-4 -right-6 w-8 h-8 bg-orange-400 rounded-full animate-ping"></div>
              <div className="absolute -bottom-2 -left-4 w-6 h-6 bg-yellow-400 rounded-full animate-bounce"></div>
            </div>
            
            <div className="bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 rounded-3xl p-8 border-4 border-blue-600 shadow-2xl relative overflow-hidden animate-bounce-in cartoon-shadow hover:cartoon-shadow-hover transform hover:scale-105 hover:rotate-1 transition-all duration-300" style={{ animationDelay: '0.5s' }}>
              <div className="absolute inset-0 bg-white bg-opacity-10 animate-pulse"></div>
              <div className="absolute top-2 right-2 w-4 h-4 bg-white rounded-full animate-bounce opacity-50"></div>
              <div className="absolute bottom-2 left-2 w-3 h-3 bg-white rounded-full animate-bounce opacity-30" style={{ animationDelay: '0.5s' }}></div>
              <div className="relative z-10">
                <h2 className="text-3xl font-black text-white mb-4 uppercase tracking-wide animate-pulse">
                  YOUR AI HINDI TEACHER
                </h2>
                <p className="text-blue-100 font-bold text-xl animate-bounce">
                  Who happens to be a super smart sheep! 🐏
                </p>
              </div>
            </div>

            {/* Fun tagline */}
            <div className="bg-white rounded-2xl p-6 border-4 border-orange-200 shadow-lg animate-bounce-in cartoon-shadow hover:cartoon-shadow-hover transform hover:scale-105 hover:rotate-1 transition-all duration-300" style={{ animationDelay: '0.7s' }}>
              <p className="text-orange-700 font-black text-2xl italic animate-wiggle">
                "Let's break the language barrier together!"
              </p>
            </div>
          </div>

          {/* Enhanced CTA Button */}
          <div className="animate-bounce-in" style={{ animationDelay: '0.9s' }}>
            <Button
              onClick={handleStartJourney}
              className="w-full bg-gradient-to-r from-orange-500 via-pink-500 to-purple-500 hover:from-orange-600 hover:via-pink-600 hover:to-purple-600 text-white font-black py-8 text-2xl rounded-3xl border-4 border-orange-600 shadow-2xl transform hover:scale-110 hover:rotate-3 transition-all duration-300 relative overflow-hidden uppercase tracking-wide cartoon-shadow hover:cartoon-shadow-hover"
            >
              <div className="absolute inset-0 bg-white bg-opacity-20 animate-pulse"></div>
              <div className="absolute top-1 left-1 w-3 h-3 bg-white rounded-full animate-bounce opacity-60"></div>
              <div className="absolute bottom-1 right-1 w-2 h-2 bg-white rounded-full animate-bounce opacity-40" style={{ animationDelay: '0.5s' }}></div>
              <div className="relative z-10 flex items-center justify-center">
                <Zap className="w-10 h-10 mr-4 animate-bounce" />
                START MY JOURNEY!
                <Sparkles className="w-10 h-10 ml-4 animate-spin" />
              </div>
            </Button>
          </div>

          {/* Fun footer message */}
          <div className="text-center p-6 bg-gradient-to-r from-yellow-100 to-orange-100 rounded-2xl border-4 border-yellow-200 shadow-lg animate-bounce-in cartoon-shadow hover:cartoon-shadow-hover transform hover:scale-105 transition-all duration-300" style={{ animationDelay: '1.1s' }}>
            <div className="flex items-center justify-center">
              <BolMascot size="sm" className="w-8 h-8 mr-3 animate-spin-slow" />
              <span className="text-orange-700 font-black text-lg animate-pulse">Ready to become fluent in Hindi? Let's go! 🚀</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomeScreen;
