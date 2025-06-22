
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Sparkles, Globe, Zap } from "lucide-react";
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

    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || 
                        (window.navigator as any).standalone === true ||
                        document.referrer.includes('android-app://');
                        
    console.log('Is standalone:', isStandalone);
    
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    if (isMobile && !isStandalone) {
      setShowPWAPrompt(true);
    }

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
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-pink-50 p-6">
      <div className="max-w-md mx-auto">
        <div className="space-y-8 py-8">
          <div className="text-center space-y-8">
            <div className="relative">
              <DuckMascot className="mx-auto animate-bounce" />
              <div className="absolute -top-2 -right-2 w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center animate-pulse">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
            </div>
            
            <div className="space-y-6">
              <div className="space-y-4">
                <h1 className="text-4xl sm:text-5xl font-bold text-slate-800 leading-tight">
                  Namaste! 🙏
                </h1>
                <div className="bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent">
                  <p className="text-xl sm:text-2xl font-bold leading-relaxed">
                    Your AI Hindi Teacher
                  </p>
                  <p className="text-lg sm:text-xl font-semibold">
                    (who happens to be a goose)
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 my-8">
                <div className="text-center p-4 bg-white/60 backdrop-blur-sm rounded-2xl border border-orange-100">
                  <Globe className="w-8 h-8 mx-auto mb-2 text-orange-500" />
                  <p className="text-sm font-semibold text-slate-700">Conversational</p>
                </div>
                <div className="text-center p-4 bg-white/60 backdrop-blur-sm rounded-2xl border border-pink-100">
                  <Zap className="w-8 h-8 mx-auto mb-2 text-pink-500" />
                  <p className="text-sm font-semibold text-slate-700">Interactive</p>
                </div>
                <div className="text-center p-4 bg-white/60 backdrop-blur-sm rounded-2xl border border-purple-100">
                  <Sparkles className="w-8 h-8 mx-auto mb-2 text-purple-500" />
                  <p className="text-sm font-semibold text-slate-700">Personalized</p>
                </div>
              </div>

              <p className="text-lg text-slate-600 font-medium">
                Ready to start your Hindi journey?
              </p>
            </div>

            <div className="space-y-4">
              {showPWAPrompt && (
                <Button 
                  onClick={handleAddToHomeScreen}
                  variant="outline"
                  className="w-full border-2 border-orange-300 text-orange-600 hover:bg-orange-50 font-bold py-6 px-8 rounded-3xl text-lg transition-all duration-500 hover:scale-[1.02] hover:shadow-xl bg-white/80 backdrop-blur-sm"
                >
                  <Plus className="w-6 h-6 mr-3" />
                  Add to Home Screen
                </Button>
              )}

              <Button 
                onClick={onComplete}
                className="w-full bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white font-bold py-6 px-8 rounded-3xl text-xl transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl transform shadow-xl"
              >
                <Sparkles className="w-6 h-6 mr-3" />
                Start Learning
              </Button>
            </div>

            <div className="flex items-center justify-center space-x-2 text-sm text-slate-500 font-medium bg-white/50 backdrop-blur-sm rounded-full px-4 py-2 border border-slate-200">
              <span className="text-2xl">🇮🇳</span>
              <span>Focused on Hindi conversation practice</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomeScreen;
