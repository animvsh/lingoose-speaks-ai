
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import DuckMascot from "./DuckMascot";

interface WelcomeScreenProps {
  onComplete: () => void;
}

const WelcomeScreen = ({ onComplete }: WelcomeScreenProps) => {
  const [showPWAPrompt, setShowPWAPrompt] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowPWAPrompt(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Check if already installed
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || 
                        (window.navigator as any).standalone === true;
    
    if (!isStandalone) {
      setShowPWAPrompt(true);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleAddToHomeScreen = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      console.log(`User response to the install prompt: ${outcome}`);
      setDeferredPrompt(null);
      setShowPWAPrompt(false);
    } else {
      // Show manual instructions for iOS/other browsers
      alert('To add this app to your home screen:\n\n• Tap the Share button\n• Select "Add to Home Screen"');
    }
  };

  return (
    <div className="bg-white p-6 rounded-3xl shadow-lg w-full max-h-screen">
      <div className="h-full overflow-y-auto space-y-6">
        <div className="text-center space-y-6">
          <DuckMascot className="mx-auto" />
          
          <div className="space-y-4">
            <h1 className="text-4xl font-bold text-slate-800">
              namaste!
            </h1>
            <p className="text-xl text-slate-600 leading-relaxed">
              i'm your hindi teacher<br />
              (who happens to be a goose)
            </p>
            <p className="text-lg text-slate-500">
              ready to talk?
            </p>
          </div>

          {showPWAPrompt && (
            <Button 
              onClick={handleAddToHomeScreen}
              variant="outline"
              className="w-full border-2 border-orange-200 text-orange-600 hover:bg-orange-50 font-semibold py-4 px-6 rounded-2xl text-lg transition-all duration-200"
            >
              <Plus className="w-5 h-5 mr-2" />
              Add to Home Screen
            </Button>
          )}

          <Button 
            onClick={onComplete}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-6 px-8 rounded-2xl text-xl transition-all duration-200 hover:scale-105"
          >
            start learning
          </Button>

          <div className="text-sm text-slate-400">
            🇮🇳 focused on hindi conversation practice
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomeScreen;
