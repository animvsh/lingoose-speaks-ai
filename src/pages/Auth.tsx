
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
    <div className="min-h-screen bg-yellow-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <BolMascot className="mx-auto mb-4 hover:scale-110 transition-transform duration-300" />
          <h1 className="text-4xl font-black text-orange-600 mb-2 uppercase tracking-wider transform -rotate-1">
            BOL
          </h1>
          <p className="text-slate-700 font-bold">Your AI Hindi Learning Companion</p>
        </div>
        
        <PhoneAuthForm onBack={() => {}} />
      </div>
    </div>
  );
};

export default Auth;
