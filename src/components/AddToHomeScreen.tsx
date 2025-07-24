import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { X, Plus, Share, Download, Smartphone } from "lucide-react";
import BolMascot from "./BolMascot";

interface AddToHomeScreenProps {
  onDismiss: () => void;
}

const AddToHomeScreen = ({ onDismiss }: AddToHomeScreenProps) => {
  const [isIOS, setIsIOS] = useState(false);
  const [isAndroid, setIsAndroid] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [canInstall, setCanInstall] = useState(false);

  useEffect(() => {
    const userAgent = navigator.userAgent;
    setIsIOS(/iPad|iPhone|iPod/.test(userAgent));
    setIsAndroid(/Android/.test(userAgent));

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setCanInstall(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt && canInstall) {
      try {
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        console.log(`User response to install prompt: ${outcome}`);
        
        if (outcome === 'accepted') {
          localStorage.setItem('pwaInstalled', 'true');
          onDismiss();
        }
        
        setDeferredPrompt(null);
        setCanInstall(false);
      } catch (error) {
        console.error('Error showing install prompt:', error);
      }
    } else {
      // Can't install programmatically, show instructions
      console.log('Cannot install programmatically, showing instructions');
    }
  };

  const getInstructions = () => {
    if (isIOS) {
      return (
        <div className="space-y-4">
          <p className="text-sm text-slate-600 font-medium">
            To add Lingoose to your home screen:
          </p>
          <div className="space-y-3">
            <div className="flex items-center space-x-3 text-sm text-slate-700 bg-blue-50 p-3 rounded-xl border border-blue-100">
              <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-white text-xs font-bold">1</span>
              </div>
              <div className="flex items-center space-x-2">
                <Share className="w-4 h-4 text-blue-600" />
                <span className="font-medium">Tap the Share button</span>
              </div>
            </div>
            <div className="flex items-center space-x-3 text-sm text-slate-700 bg-green-50 p-3 rounded-xl border border-green-100">
              <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-white text-xs font-bold">2</span>
              </div>
              <div className="flex items-center space-x-2">
                <Plus className="w-4 h-4 text-green-600" />
                <span className="font-medium">Select "Add to Home Screen"</span>
              </div>
            </div>
          </div>
        </div>
      );
    } else if (isAndroid) {
      return (
        <div className="space-y-4">
          <p className="text-sm text-slate-600 font-medium">
            To add Lingoose to your home screen:
          </p>
          <div className="space-y-3">
            <div className="flex items-center space-x-3 text-sm text-slate-700 bg-purple-50 p-3 rounded-xl border border-purple-100">
              <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-white text-xs font-bold">1</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-lg">⋮</span>
                <span className="font-medium">Tap the menu (three dots)</span>
              </div>
            </div>
            <div className="flex items-center space-x-3 text-sm text-slate-700 bg-orange-50 p-3 rounded-xl border border-orange-100">
              <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-white text-xs font-bold">2</span>
              </div>
              <div className="flex items-center space-x-2">
                <Download className="w-4 h-4 text-orange-600" />
                <span className="font-medium">Select "Add to Home screen"</span>
              </div>
            </div>
          </div>
        </div>
      );
    }
    
    return (
      <div className="text-center space-y-4">
        <Smartphone className="w-12 h-12 mx-auto text-slate-400" />
        <p className="text-sm text-slate-600 font-medium">
          Use your browser's menu to add this app to your home screen for quick access!
        </p>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-end z-50 p-4">
      <Card className="w-full bg-white p-6 rounded-t-3xl shadow-2xl animate-in slide-in-from-bottom duration-300">
        <div className="flex justify-between items-start mb-6">
          <div className="flex items-center space-x-3">
            <BolMascot size="sm" className="w-8 h-8" />
            <h3 className="text-xl font-bold text-slate-800">
              Add to Home Screen
            </h3>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onDismiss}
            className="w-8 h-8 p-0 rounded-full hover:bg-gray-100"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
        
        <div className="mb-6">
          <div className="bg-gradient-to-r from-orange-100 to-pink-100 rounded-2xl p-4 mb-4 border-2 border-orange-200">
            <p className="text-orange-800 font-semibold text-center">
              🐏 Get instant access to your Hindi learning journey!
            </p>
          </div>
          {getInstructions()}
        </div>
        
        <div className="space-y-3">
          {canInstall && deferredPrompt && (
            <Button
              onClick={handleInstallClick}
              className="w-full bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white font-bold py-4 rounded-2xl text-lg transition-all duration-300 shadow-lg"
            >
              <Plus className="w-5 h-5 mr-2" />
              Install App Now
            </Button>
          )}
          
          <div className="flex space-x-3">
            <Button
              onClick={onDismiss}
              className="flex-1 bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 rounded-xl transition-all duration-200"
            >
              Got it!
            </Button>
            <Button
              variant="outline"
              onClick={onDismiss}
              className="px-6 py-3 rounded-xl border-2 hover:bg-gray-50 transition-all duration-200"
            >
              Later
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default AddToHomeScreen;
