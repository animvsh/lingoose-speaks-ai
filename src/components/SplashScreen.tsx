
import { useEffect, useState } from "react";
import BolMascot from "./BolMascot";

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
      className={`fixed inset-0 bg-amber-50 flex flex-col items-center justify-center z-[10000] transition-all duration-500 ${
        isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
      }`}
    >
      {/* Decorative elements matching app style */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-8 w-20 h-20 bg-orange-200 rounded-3xl opacity-30 rotate-12"></div>
        <div className="absolute top-32 right-12 w-16 h-16 bg-yellow-200 rounded-2xl opacity-40 -rotate-6"></div>
        <div className="absolute bottom-32 left-16 w-12 h-12 bg-amber-200 rounded-xl opacity-50 rotate-45"></div>
        <div className="absolute bottom-20 right-20 w-24 h-24 bg-orange-100 rounded-3xl opacity-20 -rotate-12"></div>
      </div>

      <div className={`text-center relative z-10 transition-all duration-700 transform ${
        showContent ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
      }`}>
        {/* Main logo with app-style background */}
        <div className="relative mb-8">
          <div className="w-32 h-32 bg-orange-200 rounded-3xl flex items-center justify-center mx-auto border-4 border-gray-200 shadow-lg">
            <BolMascot 
              size="lg" 
              className="w-20 h-20 animate-bounce" 
            />
          </div>
        </div>

        {/* App title matching the app's style */}
        <div className="mb-8">
          <h1 className="text-5xl font-black text-orange-600 uppercase tracking-wider mb-3 transform -rotate-1">
            BOL
          </h1>
          <div className="w-24 h-2 bg-orange-400 mx-auto rounded-full"></div>
        </div>

        {/* Subtitle */}
        <p className="text-xl text-orange-700 font-bold mb-8">
          AI Language Learning 🚀
        </p>

        {/* Loading section with app-style design */}
        <div className="bg-amber-100 rounded-3xl p-6 border-4 border-gray-200 mx-8">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="w-4 h-4 bg-orange-400 rounded-full animate-bounce"></div>
            <div className="w-4 h-4 bg-yellow-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-4 h-4 bg-amber-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          </div>
          
          <div className="text-orange-700 font-bold text-lg uppercase tracking-wide">
            Getting Ready...
          </div>
        </div>
      </div>
    </div>
  );
};

export default SplashScreen;
