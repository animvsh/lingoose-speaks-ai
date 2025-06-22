
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Phone, MessageSquare } from "lucide-react";
import DuckMascot from "@/components/DuckMascot";
import { usePhoneAuth } from "@/hooks/usePhoneAuth";

const Auth = () => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState<"phone" | "otp">("phone");
  const { toast } = useToast();
  const { sendOTP, verifyOTP, isLoading } = usePhoneAuth();

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic phone number validation
    if (!phoneNumber.trim()) {
      toast({
        title: "Phone number required",
        description: "Please enter your phone number.",
        variant: "destructive",
      });
      return;
    }

    // Bypass auth for specific test phone number
    if (phoneNumber === "6505188736") {
      toast({
        title: "Test Mode Activated!",
        description: "Using test phone number - proceeding without SMS.",
      });
      
      // Store test OTP for verification
      const testOtpData = {
        otp: "123456",
        phoneNumber,
        expiresAt: Date.now() + (10 * 60 * 1000)
      };
      localStorage.setItem('phone_auth_otp', JSON.stringify(testOtpData));
      
      setStep("otp");
      toast({
        title: "Test OTP: 123456",
        description: "Use this code to complete test authentication.",
      });
      return;
    }

    const result = await sendOTP(phoneNumber);
    
    if (result.success) {
      setStep("otp");
      toast({
        title: "Verification code sent!",
        description: "Check your phone for the 6-digit code.",
      });
    } else {
      toast({
        title: "Failed to send code",
        description: result.error || "Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (otp.length !== 6) {
      toast({
        title: "Invalid code",
        description: "Please enter the complete 6-digit code.",
        variant: "destructive",
      });
      return;
    }

    const result = await verifyOTP(phoneNumber, otp);
    
    if (result.success) {
      toast({
        title: "Welcome to Lingoose!",
        description: "Phone verification successful. Redirecting...",
      });
      
      // Small delay to show the success message
      setTimeout(() => {
        window.location.href = '/';
      }, 1000);
    } else {
      toast({
        title: "Verification failed",
        description: result.error || "Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-yellow-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <DuckMascot className="mx-auto mb-4 hover:scale-110 transition-transform duration-300" />
          <h1 className="text-4xl font-black text-orange-600 mb-2 uppercase tracking-wider transform -rotate-1">
            Lingoose
          </h1>
          <p className="text-slate-700 font-bold">Your AI Hindi Learning Companion</p>
        </div>

        <Card className="border-4 border-slate-400 rounded-2xl bg-white shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-black text-slate-800 uppercase tracking-wide flex items-center justify-center gap-2">
              {step === "phone" ? <Phone className="w-6 h-6" /> : <MessageSquare className="w-6 h-6" />}
              {step === "phone" ? "Sign In" : "Enter Code"}
            </CardTitle>
            <CardDescription className="text-slate-600 font-bold">
              {step === "phone" 
                ? "Enter your phone number to get started" 
                : `Enter the 6-digit code sent to ${phoneNumber}`
              }
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            {step === "phone" ? (
              <form onSubmit={handleSendOTP} className="space-y-4">
                <div className="relative">
                  <Phone className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
                  <Input
                    type="tel"
                    placeholder="Enter your phone number (e.g., +1234567890)"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="pl-10 border-2 border-slate-300 rounded-xl font-bold"
                    required
                  />
                </div>
                {phoneNumber === "6505188736" && (
                  <div className="text-center p-2 bg-green-100 rounded-lg border border-green-300">
                    <p className="text-green-700 text-sm font-bold">🧪 Test Mode: This number will bypass SMS and use OTP: 123456</p>
                  </div>
                )}
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-orange-400 hover:bg-orange-500 border-4 border-orange-600 text-white font-black py-3 px-6 rounded-xl text-lg transition-all duration-200 hover:scale-105 transform hover:-rotate-1"
                >
                  {isLoading ? "Sending..." : phoneNumber === "6505188736" ? "Sign In (Test Mode)" : "Send Verification Code"}
                </Button>
              </form>
            ) : (
              <form onSubmit={handleVerifyOTP} className="space-y-6">
                <div className="flex justify-center">
                  <InputOTP
                    maxLength={6}
                    value={otp}
                    onChange={(value) => setOtp(value)}
                  >
                    <InputOTPGroup>
                      <InputOTPSlot index={0} className="border-2 border-slate-300 rounded-lg w-12 h-12 text-xl font-bold" />
                      <InputOTPSlot index={1} className="border-2 border-slate-300 rounded-lg w-12 h-12 text-xl font-bold" />
                      <InputOTPSlot index={2} className="border-2 border-slate-300 rounded-lg w-12 h-12 text-xl font-bold" />
                      <InputOTPSlot index={3} className="border-2 border-slate-300 rounded-lg w-12 h-12 text-xl font-bold" />
                      <InputOTPSlot index={4} className="border-2 border-slate-300 rounded-lg w-12 h-12 text-xl font-bold" />
                      <InputOTPSlot index={5} className="border-2 border-slate-300 rounded-lg w-12 h-12 text-xl font-bold" />
                    </InputOTPGroup>
                  </InputOTP>
                </div>
                
                <div className="space-y-3">
                  <Button
                    type="submit"
                    disabled={isLoading || otp.length !== 6}
                    className="w-full bg-green-400 hover:bg-green-500 border-4 border-green-600 text-white font-black py-3 px-6 rounded-xl text-lg transition-all duration-200 hover:scale-105 transform hover:rotate-1"
                  >
                    {isLoading ? "Verifying..." : "Sign In"}
                  </Button>
                  
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setStep("phone")}
                    className="w-full border-2 border-slate-300 rounded-xl font-bold"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Phone Entry
                  </Button>
                </div>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Auth;
