
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { Phone, Shield, ArrowLeft } from "lucide-react";
import { usePhoneAuth } from "@/hooks/usePhoneAuth";
import { useToast } from "@/hooks/use-toast";

const PhoneAuthForm = ({ onBack }: { onBack: () => void }) => {
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const { sendOTP, verifyOTP, isLoading } = usePhoneAuth();
  const { toast } = useToast();

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!phoneNumber.trim()) {
      toast({
        title: "❌ Missing Information",
        description: "Please enter your phone number.",
        variant: "destructive",
      });
      return;
    }

    const result = await sendOTP(phoneNumber);
    if (result.success) {
      toast({
        title: "📱 Code Sent!",
        description: "Check your phone for the verification code.",
        className: "border-2 border-green-400 bg-green-50 text-green-800",
      });
      setStep('otp');
    } else {
      toast({
        title: "❌ Send Failed",
        description: result.error || "Failed to send verification code.",
        variant: "destructive",
      });
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (otpCode.length !== 6) {
      toast({
        title: "❌ Invalid Code",
        description: "Please enter the complete 6-digit code.",
        variant: "destructive",
      });
      return;
    }

    const result = await verifyOTP(phoneNumber, otpCode);
    if (result.success) {
      if (result.isNewUser) {
        toast({
          title: "🎉 Welcome to Lingoose!",
          description: "Let's get you started with a quick setup!",
          className: "border-2 border-green-400 bg-green-50 text-green-800",
        });
      } else {
        toast({
          title: "🎉 Welcome Back!",
          description: "Successfully signed in!",
          className: "border-2 border-green-400 bg-green-50 text-green-800",
        });
      }
      
      // Redirect to main app
      setTimeout(() => {
        window.location.href = '/';
      }, 1000);
    } else {
      toast({
        title: "❌ Verification Failed",
        description: result.error || "Invalid verification code.",
        variant: "destructive",
      });
    }
  };

  const handleBackToPhone = () => {
    setStep('phone');
    setOtpCode("");
  };

  if (step === 'otp') {
    return (
      <Card className="border-4 border-slate-400 rounded-2xl bg-white shadow-lg">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Shield className="w-6 h-6 text-slate-600" />
          </div>
          <CardTitle className="text-2xl font-black text-slate-800 uppercase tracking-wide">
            Enter Verification Code
          </CardTitle>
          <CardDescription className="text-slate-600 font-bold">
            We sent a 6-digit code to {phoneNumber}
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleVerifyOTP} className="space-y-6">
            <div className="flex justify-center">
              <InputOTP 
                value={otpCode} 
                onChange={setOtpCode} 
                maxLength={6}
                containerClassName="gap-2"
              >
                <InputOTPGroup>
                  <InputOTPSlot index={0} className="w-12 h-12 text-lg font-bold border-2 border-slate-300 rounded-xl" />
                  <InputOTPSlot index={1} className="w-12 h-12 text-lg font-bold border-2 border-slate-300 rounded-xl" />
                  <InputOTPSlot index={2} className="w-12 h-12 text-lg font-bold border-2 border-slate-300 rounded-xl" />
                  <InputOTPSlot index={3} className="w-12 h-12 text-lg font-bold border-2 border-slate-300 rounded-xl" />
                  <InputOTPSlot index={4} className="w-12 h-12 text-lg font-bold border-2 border-slate-300 rounded-xl" />
                  <InputOTPSlot index={5} className="w-12 h-12 text-lg font-bold border-2 border-slate-300 rounded-xl" />
                </InputOTPGroup>
              </InputOTP>
            </div>

            <Button
              type="submit"
              disabled={isLoading || otpCode.length !== 6}
              className="w-full bg-orange-400 hover:bg-orange-500 border-4 border-orange-600 text-white font-black py-3 px-6 rounded-xl text-lg transition-all duration-200 hover:scale-105 transform hover:-rotate-1"
            >
              {isLoading ? "Verifying..." : "Verify Code"}
            </Button>

            <Button
              type="button"
              variant="ghost"
              onClick={handleBackToPhone}
              className="w-full text-slate-600 font-bold"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Phone Number
            </Button>
          </form>
        </CardContent>
      </Card>
    );
  }

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
          We'll send you a verification code via SMS
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSendOTP} className="space-y-4">
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
            {isLoading ? "Sending Code..." : "Send Verification Code"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default PhoneAuthForm;
