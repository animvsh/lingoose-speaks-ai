
import { useEffect, useState } from "react";
import DuckMascot from "./DuckMascot";

interface SplashScreenProps {
  onComplete: () => void;
}

const SplashScreen = ({ onComplete }: SplashScreenProps) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onComplete, 300); // Wait for fade out animation
    }, 2000); // Show splash for 2 seconds

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div
      className={`fixed inset-0 bg-yellow-100 flex flex-col items-center justify-center z-[10000] transition-all duration-300 ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
    >
      <div className="text-center">
        <DuckMascot size="lg" className="mb-8 animate-bounce" />
        <h1 className="text-4xl font-black text-orange-600 uppercase tracking-wider mb-4">
          Lingoose
        </h1>
        <p className="text-lg text-slate-700 font-bold">
          AI Language Learning
        </p>
        <div className="mt-8">
          <div className="w-12 h-12 border-4 border-orange-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
        </div>
      </div>
    </div>
  );
};

export default SplashScreen;
