
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Phone, Shield } from "lucide-react";
import { usePhoneAuth } from "@/hooks/usePhoneAuth";
import { useToast } from "@/hooks/use-toast";

const PhoneAuthForm = ({ onBack }: { onBack: () => void }) => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const { signInWithPhone, isLoading } = usePhoneAuth();
  const { toast } = useToast();

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!phoneNumber.trim()) {
      toast({
        title: "❌ Missing Information",
        description: "Please enter your phone number.",
        variant: "destructive",
      });
      return;
    }

    const result = await signInWithPhone(phoneNumber);
    if (result.success) {
      if (result.isNewUser) {
        toast({
          title: "🎉 Welcome to Lingoose!",
          description: "Let's get you started with a quick setup!",
          className: "border-2 border-green-400 bg-green-50 text-green-800",
        });
        // For new users, we'll let the main app handle the onboarding flow
        setTimeout(() => {
          window.location.href = '/';
        }, 1000);
      } else {
        toast({
          title: "🎉 Welcome Back!",
          description: "Successfully signed in!",
          className: "border-2 border-green-400 bg-green-50 text-green-800",
        });
        // For existing users, go straight to the main app
        setTimeout(() => {
          window.location.href = '/';
        }, 1000);
      }
    } else {
      toast({
        title: "❌ Sign In Failed",
        description: result.error || "Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="border-4 border-slate-400 rounded-2xl bg-white shadow-lg">
      <CardHeader className="text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Shield className="w-6 h-6 text-slate-600" />
        </div>
        <CardTitle className="text-2xl font-black text-slate-800 uppercase tracking-wide">
          Enter Phone Number
        </CardTitle>
        <CardDescription className="text-slate-600 font-bold">
          Enter your phone number to sign in instantly (no verification required)
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSignIn} className="space-y-4">
          <div className="relative">
            <Phone className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
            <Input
              type="tel"
              placeholder="Enter your phone number (+1234567890)"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="pl-10 border-2 border-slate-300 rounded-xl font-bold"
              required
            />
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full bg-orange-400 hover:bg-orange-500 border-4 border-orange-600 text-white font-black py-3 px-6 rounded-xl text-lg transition-all duration-200 hover:scale-105 transform hover:-rotate-1"
          >
            {isLoading ? "Signing In..." : "Sign In Instantly"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default PhoneAuthForm;
