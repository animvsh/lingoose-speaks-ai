
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { Phone, ArrowLeft, Shield } from "lucide-react";
import { usePhoneAuth } from "@/hooks/usePhoneAuth";
import { useToast } from "@/hooks/use-toast";

const PhoneAuthForm = ({ onBack }: { onBack: () => void }) => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState<"phone" | "otp">("phone");
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
      setStep("otp");
      toast({
        title: "📱 Code Sent!",
        description: "Please check your phone for the verification code.",
        className: "border-2 border-green-400 bg-green-50 text-green-800",
      });
    } else {
      toast({
        title: "❌ Failed to Send Code",
        description: result.error || "Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (otp.length !== 6) {
      toast({
        title: "❌ Invalid Code",
        description: "Please enter the complete 6-digit code.",
        variant: "destructive",
      });
      return;
    }

    const result = await verifyOTP(phoneNumber, otp);
    if (result.success) {
      toast({
        title: "🎉 Welcome!",
        description: "Successfully signed in with phone number!",
        className: "border-2 border-green-400 bg-green-50 text-green-800",
      });
      // Redirect after successful auth
      setTimeout(() => {
        window.location.href = '/';
      }, 1500);
    } else {
      toast({
        title: "❌ Verification Failed",
        description: result.error || "Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="border-4 border-slate-400 rounded-2xl bg-white shadow-lg">
      <CardHeader className="text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={onBack}
            className="absolute left-4 top-4"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <Shield className="w-6 h-6 text-slate-600" />
        </div>
        <CardTitle className="text-2xl font-black text-slate-800 uppercase tracking-wide">
          {step === "phone" ? "Phone Sign In" : "Verify Code"}
        </CardTitle>
        <CardDescription className="text-slate-600 font-bold">
          {step === "phone" 
            ? "Enter your phone number to receive a verification code" 
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
        ) : (
          <form onSubmit={handleVerifyOTP} className="space-y-6">
            <div className="flex justify-center">
              <InputOTP
                maxLength={6}
                value={otp}
                onChange={(value) => setOtp(value)}
              >
                <InputOTPGroup>
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                  <InputOTPSlot index={2} />
                  <InputOTPSlot index={3} />
                  <InputOTPSlot index={4} />
                  <InputOTPSlot index={5} />
                </InputOTPGroup>
              </InputOTP>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-orange-400 hover:bg-orange-500 border-4 border-orange-600 text-white font-black py-3 px-6 rounded-xl text-lg transition-all duration-200 hover:scale-105 transform hover:-rotate-1"
            >
              {isLoading ? "Verifying..." : "Verify Code"}
            </Button>

            <div className="text-center">
              <Button
                type="button"
                variant="link"
                onClick={() => setStep("phone")}
                className="text-slate-600 hover:text-slate-800 font-bold"
              >
                Back to phone number
              </Button>
            </div>
          </form>
        )}
      </CardContent>
    </Card>
  );
};

export default PhoneAuthForm;
