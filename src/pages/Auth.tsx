
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Phone, ArrowLeft } from "lucide-react";
import BolMascot from "@/components/BolMascot";
import PhoneAuthForm from "@/components/PhoneAuthForm";

const Auth = () => {
  const [authMethod, setAuthMethod] = useState<"phone">("phone");
  const { toast } = useToast();

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <BolMascot className="mx-auto mb-4 hover:scale-110 transition-transform duration-300 animate-gentle-float" />
          <h1 className="text-4xl font-black text-primary mb-2 uppercase tracking-wider transform -rotate-1">
            BOL
          </h1>
          <p className="text-muted-foreground font-semibold">Your AI Hindi Learning Companion</p>
        </div>
        
        <div className="warm-card p-6 soft-shadow">
          <PhoneAuthForm onBack={() => {}} />
        </div>
      </div>
    </div>
  );
};

export default Auth;
