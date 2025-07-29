
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { Phone, Shield, ArrowLeft } from "lucide-react";
import { usePhoneAuth } from "@/hooks/usePhoneAuth";
import { useToast } from "@/hooks/use-toast";
import { useSwipeNavigation } from "@/hooks/useSwipeNavigation";
import { useEngagementTracking } from "@/hooks/useEngagementTracking";
import ExistingAccountModal from "./ExistingAccountModal";

interface PhoneAuthFormProps {
  onBack: () => void;
  prefilledPhone?: string;
}

const PhoneAuthForm = ({ onBack, prefilledPhone }: PhoneAuthFormProps) => {
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [phoneNumber, setPhoneNumber] = useState(prefilledPhone || "");
  const [otpCode, setOtpCode] = useState("");
  const [showExistingAccountModal, setShowExistingAccountModal] = useState(false);
  const [existingProfile, setExistingProfile] = useState<any>(null);
  const [isSignInMode, setIsSignInMode] = useState(false);
  const { sendOTP, verifyOTP, isLoading } = usePhoneAuth();
  const { toast } = useToast();
  const { trackSwipe } = useEngagementTracking();
  const containerRef = useRef<HTMLDivElement>(null);

  const handleSwipe = (direction: 'left' | 'right') => {
    trackSwipe(direction, `auth-${step}`);
    
    if (step === 'otp' && direction === 'right') {
      // Swipe right on OTP screen goes back to phone entry
      handleBackToPhone();
    }
  };

  // Setup swipe navigation
  useSwipeNavigation(containerRef, handleSwipe);

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
      if (result.accountDetected && result.profile && !isSignInMode) {
        // Show modal for existing account (only in signup flow)
        setExistingProfile(result.profile);
        setShowExistingAccountModal(true);
      } else if (result.accountDetected && result.profile && isSignInMode) {
        // Auto-login for sign-in mode
        localStorage.setItem('current_user_profile', JSON.stringify(result.profile));
        localStorage.setItem('phone_authenticated', 'true');
        localStorage.setItem('phone_number', phoneNumber);
        
        toast({
          title: "🎉 Welcome back!",
          description: "You've been signed in successfully.",
          className: "border-2 border-green-400 bg-green-50 text-green-800",
        });
        
        // Smooth state update without any page reload
        // The Landing page will detect the authenticated user and show the app
      } else if (result.isNewUser) {
        toast({
          title: "🎉 Welcome to Bol!",
          description: "Let's set up your profile!",
          className: "border-2 border-green-400 bg-green-50 text-green-800",
        });
        // No redirect needed - the Landing page will detect new user state and show onboarding
      } else {
        toast({
          title: "🎉 Welcome Back!",
          description: "Successfully signed in!",
          className: "border-2 border-green-400 bg-green-50 text-green-800",
        });
        // No redirect needed - smooth state transition
      }
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

  const handleLoginFromModal = async () => {
    setShowExistingAccountModal(false);
    setIsSignInMode(true);
    
    // Auto-login the existing user
    if (existingProfile) {
      localStorage.setItem('current_user_profile', JSON.stringify(existingProfile));
      localStorage.setItem('phone_authenticated', 'true');
      localStorage.setItem('phone_number', phoneNumber);
      
      toast({
        title: "🎉 Welcome back!",
        description: "You've been signed in successfully.",
        className: "border-2 border-green-400 bg-green-50 text-green-800",
      });
      
      // No reload needed - Landing page will detect the authenticated state automatically
    }
  };

  const handleCreateNewFromModal = () => {
    setShowExistingAccountModal(false);
    
    toast({
      title: "⚠️ Account Creation",
      description: "Creating a new account with this number will override the existing one. Please contact support if this is not intended.",
      variant: "destructive",
    });
    
    // Force new account creation by clearing existing profile detection
    // The system will proceed with onboarding flow
    localStorage.setItem('force_new_account', 'true');
  };

  if (step === 'otp') {
    return (
      <div ref={containerRef}>
        <Card className="w-full border-4 border-slate-400 rounded-2xl bg-white shadow-lg">
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
            <p className="text-xs text-slate-500 mt-2">
              💡 Swipe right to go back to phone entry
            </p>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleVerifyOTP} className="space-y-6">
              <div className="flex justify-center">
                <InputOTP 
                  value={otpCode} 
                  onChange={setOtpCode} 
                  maxLength={6}
                  containerClassName="gap-2 justify-center"
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
      </div>
    );
  }

  return (
    <div ref={containerRef}>
      <Card className="w-full border-4 border-slate-400 rounded-2xl bg-white shadow-lg">
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
            <div className="relative w-full">
              <Phone className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
              <Input
                type="tel"
                placeholder="Enter your phone number (e.g., 1234567890)"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="w-full pl-10 border-2 border-slate-300 rounded-xl font-bold"
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
      
      <ExistingAccountModal
        isOpen={showExistingAccountModal}
        onClose={() => setShowExistingAccountModal(false)}
        onLogin={handleLoginFromModal}
        onCreateNew={handleCreateNewFromModal}
        phoneNumber={phoneNumber}
        userName={existingProfile?.full_name}
      />
    </div>
  );
};

export default PhoneAuthForm;
