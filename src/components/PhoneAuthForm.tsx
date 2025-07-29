
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { Phone, Shield, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
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
  // Auto-detect sign-in mode if phone is pre-filled (user was redirected)
  const [isSignInMode, setIsSignInMode] = useState(!!prefilledPhone);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [otpSentAt, setOtpSentAt] = useState<Date | null>(null);
  const { sendOTP, verifyOTP, isLoading } = usePhoneAuth();
  const { toast } = useToast();
  const { trackSwipe } = useEngagementTracking();
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);

  // Update phone number when prefilledPhone changes
  useEffect(() => {
    if (prefilledPhone) {
      setPhoneNumber(prefilledPhone);
      setIsSignInMode(true); // Auto-enable sign-in mode for pre-filled numbers
      console.log('PhoneAuthForm: Pre-filled phone number:', prefilledPhone, '- Sign-in mode enabled');
    }
  }, [prefilledPhone]);

  // Resend cooldown timer
  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

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
      setOtpSentAt(new Date());
      setResendCooldown(60); // 60-second cooldown
      toast({
        title: "📱 Code Sent!",
        description: "Check your phone for the verification code. It expires in 10 minutes.",
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

    console.log('Starting OTP verification for:', phoneNumber, 'with code:', otpCode);
    const result = await verifyOTP(phoneNumber, otpCode);
    console.log('OTP verification result:', result);
    
    if (result.success) {
      console.log('✅ Verification successful!', { 
        accountDetected: result.accountDetected, 
        isNewUser: result.isNewUser,
        profile: result.profile,
        isSignInMode,
        prefilledPhone,
        phoneNumber
      });
      
      if (result.accountDetected && result.profile && !isSignInMode) {
        // For existing users, auto-login instead of showing modal
        // This happens when user manually enters their phone (not pre-filled)
        console.log('🔑 Auto-login for existing user (manual entry)');
        localStorage.setItem('current_user_profile', JSON.stringify(result.profile));
        localStorage.setItem('phone_authenticated', 'true');
        localStorage.setItem('phone_number', result.profile.phone_number || phoneNumber);
        
        toast({
          title: "🎉 Welcome back!",
          description: "You've been signed in successfully.",
          className: "border-2 border-green-400 bg-green-50 text-green-800",
        });
        
        // Smooth navigation without page reload
        setTimeout(() => {
          console.log('🔄 Navigating to home page');
          navigate('/', { replace: true });
        }, 500);
        
      } else if (result.accountDetected && result.profile && isSignInMode) {
        // Auto-login for sign-in mode (pre-filled phone)
        console.log('🔑 Auto-login for existing user in sign-in mode');
        localStorage.setItem('current_user_profile', JSON.stringify(result.profile));
        localStorage.setItem('phone_authenticated', 'true');
        localStorage.setItem('phone_number', result.profile.phone_number || phoneNumber);
        
        toast({
          title: "🎉 Welcome back!",
          description: "You've been signed in successfully.",
          className: "border-2 border-green-400 bg-green-50 text-green-800",
        });
        
        // Smooth navigation without page reload
        setTimeout(() => {
          console.log('🔄 Navigating to home page');
          navigate('/', { replace: true });
        }, 500);
        
      } else if (result.isNewUser) {
        console.log('👋 New user detected, setting up onboarding');
        toast({
          title: "🎉 Welcome to Bol!",
          description: "Let's set up your profile!",
          className: "border-2 border-green-400 bg-green-50 text-green-800",
        });
        
        // Smooth navigation to trigger onboarding detection
        setTimeout(() => {
          console.log('🔄 Navigating to home for onboarding');
          navigate('/', { replace: true });
        }, 500);
        
      } else {
        console.log('🔑 Existing user login');
        toast({
          title: "🎉 Welcome Back!",
          description: "Successfully signed in!",
          className: "border-2 border-green-400 bg-green-50 text-green-800",
        });
        
        // Smooth navigation without page reload
        setTimeout(() => {
          console.log('🔄 Navigating to home page');
          navigate('/', { replace: true });
        }, 500);
      }
    } else {
      // Handle specific error types
      if (result.error?.includes('expired') || result.error?.includes('already used')) {
        toast({
          title: "⏰ Code Expired or Used",
          description: "This code has expired or was already used. Please get a new code.",
          variant: "destructive",
        });
        setOtpCode(""); // Clear the expired/used code
        // Auto-focus on resend button after showing error
        setTimeout(() => {
          const resendButton = document.querySelector('[data-resend-button]') as HTMLButtonElement;
          if (resendButton && !resendButton.disabled) {
            resendButton.focus();
          }
        }, 100);
      } else if (result.error?.includes('invalid')) {
        toast({
          title: "❌ Invalid Code",
          description: "Please check your code and try again.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "❌ Verification Failed",
          description: result.error || "Invalid verification code.",
          variant: "destructive",
        });
      }
    }
  };

  const handleBackToPhone = () => {
    setStep('phone');
    setOtpCode("");
    setResendCooldown(0);
    setOtpSentAt(null);
  };

  const handleResendOTP = async () => {
    if (resendCooldown > 0) return;
    
    const result = await sendOTP(phoneNumber);
    if (result.success) {
      setOtpSentAt(new Date());
      setResendCooldown(60); // Reset cooldown
      setOtpCode(""); // Clear current code
      toast({
        title: "📱 New Code Sent!",
        description: "A new verification code has been sent to your phone.",
        className: "border-2 border-green-400 bg-green-50 text-green-800",
      });
    } else {
      toast({
        title: "❌ Resend Failed",
        description: result.error || "Failed to resend verification code.",
        variant: "destructive",
      });
    }
  };

  const handleLoginFromModal = async () => {
    console.log('🔑 Handling login from modal for existing user');
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
      
      // Smooth navigation without page reload
      setTimeout(() => {
        console.log('🔄 Navigating to home after modal login');
        navigate('/', { replace: true });
      }, 500);
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
              {otpSentAt && (
                <div className="text-xs text-slate-500 mt-1">
                  Code expires in 10 minutes • Sent {new Date(otpSentAt).toLocaleTimeString()}
                </div>
              )}
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

              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleResendOTP}
                  disabled={resendCooldown > 0 || isLoading}
                  data-resend-button
                  className="flex-1 border-2 border-slate-300 text-slate-600 font-bold"
                >
                  {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : "Resend Code"}
                </Button>
                
                <Button
                  type="button"
                  variant="ghost"
                  onClick={handleBackToPhone}
                  className="flex-1 text-slate-600 font-bold"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>
              </div>
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
            {isSignInMode ? "Sign in to your existing account" : "We'll send you a verification code via SMS"}
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
              {isLoading ? "Sending Code..." : isSignInMode ? "Send Sign-in Code" : "Send Verification Code"}
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
