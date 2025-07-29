
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Phone, ArrowLeft } from "lucide-react";
import { useSwipeNavigation } from "@/hooks/useSwipeNavigation";
import { useEngagementTracking } from "@/hooks/useEngagementTracking";
import BolMascot from "@/components/BolMascot";
import PhoneAuthForm from "@/components/PhoneAuthForm";
import AppBar from "@/components/AppBar";

const Auth = () => {
  const [authMethod, setAuthMethod] = useState<"phone">("phone");
  const [prefilledPhone, setPrefilledPhone] = useState<string>("");
  const { toast } = useToast();
  const { trackSwipe } = useEngagementTracking();
  const containerRef = useRef<HTMLDivElement>(null);

  const handleSwipe = (direction: 'left' | 'right') => {
    trackSwipe(direction, 'auth');
    
    // Optional: Add some visual feedback for swipes on auth screen
    toast({
      title: "👋 Swipe detected!",
      description: `You swiped ${direction}. Try navigating once you're logged in!`,
      duration: 2000,
    });
  };

  // Setup swipe navigation
  useSwipeNavigation(containerRef, handleSwipe);

  // Read phone number from URL parameters if provided
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const phoneParam = urlParams.get('phone');
    if (phoneParam) {
      setPrefilledPhone(decodeURIComponent(phoneParam));
    }
  }, []);

  return (
    <div ref={containerRef} className="min-h-screen w-full bg-background">
      <AppBar title="Sign In" showBackButton={false} />
      <div className="flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <BolMascot className="mx-auto mb-4 hover:scale-110 transition-transform duration-300 animate-gentle-float" />
            <h1 className="text-4xl font-black text-primary mb-2 uppercase tracking-wider transform -rotate-1">
              BOL
            </h1>
            <p className="text-muted-foreground font-semibold">Your AI Hindi Learning Companion</p>
          </div>
          
          <div className="warm-card p-6 soft-shadow w-full">
            <PhoneAuthForm onBack={() => {}} prefilledPhone={prefilledPhone} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
