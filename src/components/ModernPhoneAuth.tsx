import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { Phone, Shield, ArrowLeft, Sparkles, Loader2 } from "lucide-react";
import { usePhoneAuth } from "@/hooks/usePhoneAuth";
import { useToast } from "@/hooks/use-toast";
import BolMascot from "./BolMascot";
import LoadingOverlay from "./LoadingOverlay";

interface ModernPhoneAuthProps {
  onAuthSuccess: (phoneNumber: string) => void;
}

const ModernPhoneAuth = ({ onAuthSuccess }: ModernPhoneAuthProps) => {
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { sendOTP, verifyOTP } = usePhoneAuth();
  const { toast } = useToast();

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!phoneNumber.trim()) {
      toast({
        title: "Enter your phone number",
        description: "We need your phone number to send you a verification code.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    const result = await sendOTP(phoneNumber);
    setIsLoading(false);

    if (result.success) {
      toast({
        title: "Code sent! 📱",
        description: "Check your phone for the verification code.",
        className: "border-2 border-primary/20 bg-primary/5",
      });
      setStep('otp');
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
    
    if (otpCode.length !== 6) {
      toast({
        title: "Enter complete code",
        description: "Please enter the full 6-digit verification code.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    const result = await verifyOTP(phoneNumber, otpCode);
    setIsLoading(false);

    if (result.success) {
      toast({
        title: "Phone verified! ✅",
        description: "Welcome to Bol!",
        className: "border-2 border-primary/20 bg-primary/5",
      });
      onAuthSuccess(phoneNumber);
    } else {
      toast({
        title: "Invalid code",
        description: "Please check your code and try again.",
        variant: "destructive",
      });
    }
  };

  if (step === 'otp') {
    return (
      <div className="min-h-screen hindi-bg flex items-center justify-center p-6">
        <div className="w-full max-w-md space-y-6">
          {/* Header */}
          <div className="text-center space-y-4">
            <BolMascot className="w-20 h-20 mx-auto animate-gentle-float" />
            <div>
              <h1 className="text-3xl font-black text-primary mb-2">Enter Your Code</h1>
              <p className="text-muted-foreground">
                We sent a code to <span className="font-bold text-foreground">{phoneNumber}</span>
              </p>
            </div>
          </div>

          {/* OTP Form */}
          <Card className="warm-card border-2 border-handdrawn shadow-lg">
            <CardContent className="p-6">
              <form onSubmit={handleVerifyOTP} className="space-y-6">
                <div className="flex justify-center">
                  <InputOTP 
                    value={otpCode} 
                    onChange={setOtpCode} 
                    maxLength={6}
                    containerClassName="gap-2"
                  >
                    <InputOTPGroup>
                      {[...Array(6)].map((_, i) => (
                        <InputOTPSlot 
                          key={i}
                          index={i} 
                          className="w-12 h-12 text-lg font-bold border-2 border-handdrawn rounded-xl bg-background"
                        />
                      ))}
                    </InputOTPGroup>
                  </InputOTP>
                </div>

                <Button
                  type="submit"
                  disabled={isLoading || otpCode.length !== 6}
                  className="w-full warm-button py-6 text-lg font-black"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Verifying...
                    </>
                  ) : (
                    <>
                      <Shield className="w-5 h-5 mr-2" />
                      Verify Code
                    </>
                  )}
                </Button>

                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => {
                    setStep('phone');
                    setOtpCode("");
                  }}
                  className="w-full text-muted-foreground hover:text-foreground"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Change phone number
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen hindi-bg flex items-center justify-center p-6">
      <div className="w-full max-w-md space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <BolMascot className="w-24 h-24 mx-auto animate-gentle-float" />
          <div>
            <h1 className="text-4xl font-black text-primary mb-2">Welcome to Bol!</h1>
            <p className="text-lg text-muted-foreground">
              Your AI Hindi teacher awaits
            </p>
          </div>
        </div>

        {/* Phone Form */}
        <Card className="warm-card border-2 border-handdrawn shadow-lg">
          <CardHeader className="text-center pb-3">
            <CardTitle className="flex items-center justify-center gap-2 text-xl">
              <Phone className="w-5 h-5" />
              Sign in with phone
            </CardTitle>
            <CardDescription>
              We'll send you a verification code
            </CardDescription>
          </CardHeader>
          
          <CardContent className="pt-0">
            <form onSubmit={handleSendOTP} className="space-y-4">
              <div className="relative">
                <Phone className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                <Input
                  type="tel"
                  placeholder="Phone number (e.g., 1234567890)"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="pl-10 py-6 text-lg font-semibold border-2 border-handdrawn rounded-xl"
                  required
                />
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full warm-button py-6 text-lg font-black"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5 mr-2" />
                    Continue
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Fun footer */}
        <div className="text-center warm-card p-4 border border-handdrawn rounded-xl">
          <p className="text-sm text-muted-foreground">
            🔒 Your number is safe with us • No spam, just learning!
          </p>
        </div>
      </div>
    </div>
  );
};

export default ModernPhoneAuth;