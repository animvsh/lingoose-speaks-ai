
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
  const [isInstallable, setIsInstallable] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      console.log('PWA install prompt available');
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);
      setShowPWAPrompt(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Check if already installed
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || 
                        (window.navigator as any).standalone === true ||
                        document.referrer.includes('android-app://');
                        
    console.log('Is standalone:', isStandalone);
    
    // Show prompt for mobile devices that aren't installed
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    if (isMobile && !isStandalone) {
      setShowPWAPrompt(true);
    }

    // Check if service worker is supported and register it
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch(console.error);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleAddToHomeScreen = async () => {
    console.log('Add to home screen clicked');
    
    if (deferredPrompt && isInstallable) {
      console.log('Using deferred prompt');
      try {
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        console.log(`User response to install prompt: ${outcome}`);
        
        if (outcome === 'accepted') {
          setShowPWAPrompt(false);
        }
        
        setDeferredPrompt(null);
        setIsInstallable(false);
      } catch (error) {
        console.error('Error showing install prompt:', error);
      }
    } else {
      // Fallback for browsers that don't support beforeinstallprompt
      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
      const isAndroid = /Android/.test(navigator.userAgent);
      
      let instructions = '';
      if (isIOS) {
        instructions = 'To add this app to your home screen:\n\n1. Tap the Share button (⎋)\n2. Select "Add to Home Screen"\n3. Tap "Add"';
      } else if (isAndroid) {
        instructions = 'To add this app to your home screen:\n\n1. Tap the menu (⋮)\n2. Select "Add to Home screen" or "Install app"\n3. Tap "Add" or "Install"';
      } else {
        instructions = 'To add this app:\n\n1. Open your browser menu\n2. Look for "Add to Home Screen" or "Install"\n3. Follow the prompts';
      }
      
      alert(instructions);
    }
  };

  return (
    <div className="min-h-screen bg-white p-4 sm:p-6">
      <div className="max-w-md mx-auto">
        <div className="space-y-6 py-4">
          <div className="text-center space-y-6">
            <DuckMascot className="mx-auto" />
            
            <div className="space-y-4">
              <h1 className="text-3xl sm:text-4xl font-bold text-slate-800 leading-tight">
                namaste!
              </h1>
              <p className="text-lg sm:text-xl text-slate-600 leading-relaxed">
                i'm your hindi teacher<br />
                (who happens to be a goose)
              </p>
              <p className="text-base sm:text-lg text-slate-500">
                ready to talk?
              </p>
            </div>

            {showPWAPrompt && (
              <Button 
                onClick={handleAddToHomeScreen}
                variant="outline"
                className="w-full border-2 border-orange-200 text-orange-600 hover:bg-orange-50 font-semibold py-4 px-6 rounded-2xl text-lg transition-all duration-300 hover:scale-[1.02] hover:shadow-lg"
              >
                <Plus className="w-5 h-5 mr-2" />
                Add to Home Screen
              </Button>
            )}

            <Button 
              onClick={onComplete}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-6 px-8 rounded-2xl text-xl transition-all duration-300 hover:scale-[1.02] hover:shadow-lg transform"
            >
              start learning
            </Button>

            <div className="text-sm text-slate-400 mt-4">
              🇮🇳 focused on hindi conversation practice
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomeScreen;
