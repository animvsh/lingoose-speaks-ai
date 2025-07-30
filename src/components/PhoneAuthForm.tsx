import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { useToast } from "@/hooks/use-toast";
import { usePhoneAuth } from "@/hooks/usePhoneAuth";
import { ArrowLeft, Phone } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import ExistingAccountModal from "./ExistingAccountModal";

interface PhoneAuthFormProps {
  onBack: () => void;
  prefilledPhone?: string;
}

const PhoneAuthForm = ({ onBack, prefilledPhone = "" }: PhoneAuthFormProps) => {
  const [phoneNumber, setPhoneNumber] = useState(prefilledPhone);
  const [otpCode, setOtpCode] = useState("");
  const [step, setStep] = useState<"phone" | "otp">("phone");
  const [showExistingAccountModal, setShowExistingAccountModal] = useState(false);
  const [existingAccountData, setExistingAccountData] = useState<any>(null);
  const [isSignInMode, setIsSignInMode] = useState(!!prefilledPhone);
  
  const { sendOTP, verifyOTP, isLoading, formatPhoneNumber } = usePhoneAuth();
  const { refreshUser } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const otpInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (prefilledPhone) {
      setIsSignInMode(true);
      console.log('PhoneAuthForm: Pre-filled phone number:', prefilledPhone, '- Sign-in mode enabled');
    }
  }, [prefilledPhone]);

  const handlePhoneSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const formattedPhone = formatPhoneNumber(phoneNumber);
    console.log('Starting phone number check for:', formattedPhone);
    
    let existingProfile = null;
    
    // Check if phone number already exists
    try {
      const { supabase } = await import('@/integrations/supabase/client');
      
      console.log('Formatted phone number:', formattedPhone);
      
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('phone_number', formattedPhone)
        .maybeSingle();

      existingProfile = data;
      console.log('Database check result:', { existingProfile, error });

      if (existingProfile && !isSignInMode) {
        // Show existing account modal for sign-up attempts
        setExistingAccountData(existingProfile);
        setShowExistingAccountModal(true);
        return;
      }

      if (!existingProfile && isSignInMode) {
        toast({
          title: "Account not found",
          description: "No account found with this phone number. Please sign up first.",
          variant: "destructive",
        });
        return;
      }
    } catch (error) {
      console.error('Error checking existing phone:', error);
    }

    const result = await sendOTP(formattedPhone);
    if (result.success) {
      setStep("otp");
      setPhoneNumber(formattedPhone);
      toast({
        title: "Code sent!",
        description: "Please check your phone for the verification code.",
      });
      
      // Focus OTP input after a short delay
      setTimeout(() => {
        otpInputRef.current?.focus();
      }, 100);
    } else {
      toast({
        title: "Failed to send code",
        description: result.error || "Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (otpCode.length !== 6) {
      toast({
        title: "Invalid code",
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

      if (result.accountDetected && result.profile) {
        // Existing user - log them in directly
        console.log('🔑 Auto-login for existing user in sign-in mode');
        
        // Store the complete profile and authentication state
        localStorage.setItem('current_user_profile', JSON.stringify(result.profile));
        localStorage.setItem('phone_authenticated', 'true');
        localStorage.setItem('phone_number', result.profile.phone_number);
        
        // CRITICAL: Do NOT set needs_onboarding for existing users
        localStorage.removeItem('needs_onboarding');
        
        // Refresh the auth context to pick up the logged-in user
        refreshUser();
        
        toast({
          title: "🎉 Welcome back!",
          description: "You've been signed in successfully.",
        });
        
        console.log('🔄 Navigating to home page');
        navigate('/app');
        return;
      } else if (result.isNewUser) {
        // New user - they need onboarding
        toast({
          title: "🎉 Phone verified!",
          description: "Let's set up your profile.",
        });
        
        // Set the needs onboarding flag for new users only
        localStorage.setItem('needs_onboarding', 'true');
        navigate('/app');
        return;
      }
    } else {
      toast({
        title: "Verification failed",
        description: result.error || "Please try again with the correct code.",
        variant: "destructive",
      });
    }
  };

  const handleExistingAccountLogin = () => {
    setShowExistingAccountModal(false);
    setIsSignInMode(true);
    
    // Redirect to auth page with phone pre-filled for sign-in
    const formattedPhone = formatPhoneNumber(phoneNumber);
    navigate(`/auth?phone=${encodeURIComponent(formattedPhone)}`);
  };

  const handleCreateNewAccount = async () => {
    setShowExistingAccountModal(false);
    
    // Continue with the OTP flow for a new account
    const formattedPhone = formatPhoneNumber(phoneNumber);
    const result = await sendOTP(formattedPhone);
    
    if (result.success) {
      setStep("otp");
      setPhoneNumber(formattedPhone);
      toast({
        title: "Code sent!",
        description: "Please check your phone for the verification code.",
      });
      
      setTimeout(() => {
        otpInputRef.current?.focus();
      }, 100);
    } else {
      toast({
        title: "Failed to send code",
        description: result.error || "Please try again.",
        variant: "destructive",
      });
    }
  };

  if (step === "phone") {
    return (
      <>
        <Card className="w-full">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-primary">
              {isSignInMode ? "Sign In" : "Sign Up"}
            </CardTitle>
            <CardDescription>
              {isSignInMode 
                ? "Enter your phone number to sign in to your account" 
                : "Enter your phone number to get started"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handlePhoneSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+1234567890"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="pl-10"
                    required
                    disabled={isLoading}
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  Include your country code (e.g., +1 for US)
                </p>
              </div>
              
              <Button
                type="submit"
                className="w-full"
                disabled={isLoading || !phoneNumber.trim()}
              >
                {isLoading ? "Sending..." : `Send Verification Code`}
              </Button>
              
              <div className="text-center">
                <p className="text-sm text-muted-foreground">
                  {isSignInMode ? "Don't have an account? " : "Already have an account? "}
                  <button
                    type="button"
                    onClick={() => setIsSignInMode(!isSignInMode)}
                    className="text-primary hover:underline font-medium"
                  >
                    {isSignInMode ? "Sign up" : "Sign in"}
                  </button>
                </p>
              </div>
            </form>
          </CardContent>
        </Card>

        <ExistingAccountModal
          isOpen={showExistingAccountModal}
          onClose={() => setShowExistingAccountModal(false)}
          onLogin={handleExistingAccountLogin}
          onCreateNew={handleCreateNewAccount}
          phoneNumber={phoneNumber}
          userName={existingAccountData?.full_name}
        />
      </>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold text-primary">Verify Your Phone</CardTitle>
        <CardDescription>
          We sent a 6-digit code to {phoneNumber}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleOtpSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="otp">Verification Code</Label>
            <InputOTP
              value={otpCode}
              onChange={setOtpCode}
              maxLength={6}
              className="w-full"
            >
              <InputOTPGroup className="flex justify-center w-full">
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
            className="w-full"
            disabled={isLoading || otpCode.length !== 6}
          >
            {isLoading ? "Verifying..." : "Verify Code"}
          </Button>
          
          <div className="flex items-center justify-between text-sm">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setStep("phone")}
              className="p-0 h-auto font-normal text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
              Change phone number
            </Button>
            
            <Button
              type="button"
              variant="ghost"
              onClick={() => handlePhoneSubmit(new Event('submit') as any)}
              disabled={isLoading}
              className="p-0 h-auto font-normal text-primary hover:text-primary/80"
            >
              Resend code
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default PhoneAuthForm;
