
import { useEffect, useState } from "react";
import DuckMascot from "./DuckMascot";

interface SplashScreenProps {
  onComplete: () => void;
}

const SplashScreen = ({ onComplete }: SplashScreenProps) => {
  const [isVisible, setIsVisible] = useState(true);
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    // Show content after a brief delay for smoother animation
    const contentTimer = setTimeout(() => {
      setShowContent(true);
    }, 200);

    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onComplete, 500); // Wait for fade out animation
    }, 2500); // Show splash for 2.5 seconds

    return () => {
      clearTimeout(timer);
      clearTimeout(contentTimer);
    };
  }, [onComplete]);

  return (
    <div
      className={`fixed inset-0 bg-gradient-to-br from-orange-400 via-yellow-300 to-amber-200 flex flex-col items-center justify-center z-[10000] transition-all duration-500 ${
        isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
      }`}
    >
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-orange-300 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-yellow-300 rounded-full opacity-20 animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-amber-300 rounded-full opacity-10 animate-bounce" style={{ animationDelay: '0.5s' }}></div>
        <div className="absolute bottom-1/3 right-1/3 w-24 h-24 bg-orange-200 rounded-full opacity-15 animate-bounce" style={{ animationDelay: '1.5s' }}></div>
      </div>

      <div className={`text-center relative z-10 transition-all duration-700 transform ${
        showContent ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
      }`}>
        {/* Main mascot with enhanced animation */}
        <div className="relative mb-8">
          <div className="absolute inset-0 bg-white rounded-full blur-2xl opacity-30 scale-110 animate-pulse"></div>
          <DuckMascot 
            size="lg" 
            className="relative z-10 w-24 h-24 mx-auto animate-bounce drop-shadow-2xl" 
          />
        </div>

        {/* App title with gradient text */}
        <div className="mb-6">
          <h1 className="text-6xl font-black bg-gradient-to-r from-orange-700 via-orange-600 to-yellow-600 bg-clip-text text-transparent uppercase tracking-wider mb-2 drop-shadow-lg">
            Lingoose
          </h1>
          <div className="w-24 h-1 bg-gradient-to-r from-orange-500 to-yellow-500 mx-auto rounded-full"></div>
        </div>

        {/* Subtitle with better typography */}
        <p className="text-xl text-orange-800 font-bold mb-8 drop-shadow-sm">
          AI Language Learning 🚀
        </p>

        {/* Enhanced loading animation */}
        <div className="flex flex-col items-center space-y-4">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-orange-200 rounded-full"></div>
            <div className="absolute inset-0 w-16 h-16 border-4 border-orange-600 border-t-transparent rounded-full animate-spin"></div>
            <div className="absolute inset-2 w-12 h-12 border-2 border-yellow-400 border-b-transparent rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
          </div>
          
          {/* Loading text with typing animation */}
          <div className="text-orange-700 font-semibold text-lg">
            <span className="inline-block animate-pulse">Getting ready</span>
            <span className="inline-block animate-bounce ml-1" style={{ animationDelay: '0.1s' }}>.</span>
            <span className="inline-block animate-bounce ml-0.5" style={{ animationDelay: '0.2s' }}>.</span>
            <span className="inline-block animate-bounce ml-0.5" style={{ animationDelay: '0.3s' }}>.</span>
          </div>
        </div>

        {/* Additional decorative elements */}
        <div className="absolute -top-8 -left-8 w-4 h-4 bg-yellow-400 rounded-full animate-ping opacity-50"></div>
        <div className="absolute -top-4 -right-12 w-3 h-3 bg-orange-500 rounded-full animate-ping opacity-40" style={{ animationDelay: '0.5s' }}></div>
        <div className="absolute -bottom-6 left-4 w-2 h-2 bg-amber-500 rounded-full animate-ping opacity-60" style={{ animationDelay: '1s' }}></div>
      </div>

      {/* Bottom wave decoration */}
      <div className="absolute bottom-0 left-0 right-0 h-32 overflow-hidden">
        <svg className="absolute bottom-0 w-full h-full" viewBox="0 0 1200 120" preserveAspectRatio="none">
          <path 
            d="M0,60 C120,90 240,30 360,60 C480,90 600,30 720,60 C840,90 960,30 1080,60 L1200,60 L1200,120 L0,120 Z" 
            fill="rgba(255,255,255,0.1)"
            className="animate-pulse"
          />
          <path 
            d="M0,80 C120,50 240,110 360,80 C480,50 600,110 720,80 C840,50 960,110 1080,80 L1200,80 L1200,120 L0,120 Z" 
            fill="rgba(255,255,255,0.05)"
            className="animate-pulse"
            style={{ animationDelay: '1s' }}
          />
        </svg>
      </div>
    </div>
  );
};

export default SplashScreen;
