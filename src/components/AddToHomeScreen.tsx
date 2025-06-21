
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { X, Plus, Share, Download } from "lucide-react";

interface AddToHomeScreenProps {
  onDismiss: () => void;
}

const AddToHomeScreen = ({ onDismiss }: AddToHomeScreenProps) => {
  const [isIOS, setIsIOS] = useState(false);
  const [isAndroid, setIsAndroid] = useState(false);

  useEffect(() => {
    const userAgent = navigator.userAgent;
    setIsIOS(/iPad|iPhone|iPod/.test(userAgent));
    setIsAndroid(/Android/.test(userAgent));
  }, []);

  const getInstructions = () => {
    if (isIOS) {
      return (
        <div className="space-y-3">
          <p className="text-sm text-slate-600">
            To add Lingoose to your home screen:
          </p>
          <div className="flex items-center space-x-2 text-sm text-slate-700">
            <Share className="w-4 h-4" />
            <span>1. Tap the Share button</span>
          </div>
          <div className="flex items-center space-x-2 text-sm text-slate-700">
            <Plus className="w-4 h-4" />
            <span>2. Select "Add to Home Screen"</span>
          </div>
        </div>
      );
    } else if (isAndroid) {
      return (
        <div className="space-y-3">
          <p className="text-sm text-slate-600">
            To add Lingoose to your home screen:
          </p>
          <div className="flex items-center space-x-2 text-sm text-slate-700">
            <span>⋮</span>
            <span>1. Tap the menu (three dots)</span>
          </div>
          <div className="flex items-center space-x-2 text-sm text-slate-700">
            <Download className="w-4 h-4" />
            <span>2. Select "Add to Home screen"</span>
          </div>
        </div>
      );
    }
    
    return (
      <p className="text-sm text-slate-600">
        Use your browser's menu to add this app to your home screen for quick access!
      </p>
    );
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-end z-50 p-4">
      <Card className="w-full bg-white p-6 rounded-t-3xl shadow-lg animate-in slide-in-from-bottom duration-300">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-lg font-bold text-slate-800">
            Add to Home Screen
          </h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={onDismiss}
            className="w-8 h-8 p-0 rounded-full"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
        
        {getInstructions()}
        
        <div className="flex space-x-3 mt-6">
          <Button
            onClick={onDismiss}
            className="flex-1 bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 rounded-xl"
          >
            Got it!
          </Button>
          <Button
            variant="outline"
            onClick={onDismiss}
            className="px-6 py-3 rounded-xl border-2"
          >
            Later
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default AddToHomeScreen;
