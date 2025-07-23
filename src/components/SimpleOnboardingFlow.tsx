import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { ChevronRight, ArrowLeft, Sparkles, Heart, Star } from "lucide-react";
import { Link } from "react-router-dom";
import BolMascot from "./BolMascot";
import AppBar from "./AppBar";
import { useCreateUserProfile } from "@/hooks/useCreateUserProfile";

interface SimpleOnboardingFlowProps {
  onComplete: () => void;
  phoneNumber: string;
}

const SimpleOnboardingFlow = ({ onComplete, phoneNumber }: SimpleOnboardingFlowProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [fullName, setFullName] = useState("");
  const [userPhoneNumber, setUserPhoneNumber] = useState(phoneNumber || "");
  const [hasConsented, setHasConsented] = useState(false);
  const [proficiencyLevel, setProficiencyLevel] = useState<number | null>(null);
  
  const createUserProfile = useCreateUserProfile();

  const proficiencyLevels = [
    { 
      level: 1, 
      title: "Complete Beginner", 
      desc: "I know no Hindi at all", 
      emoji: "🌱",
      color: "from-green-400 to-emerald-500"
    },
    { 
      level: 2, 
      title: "Basic", 
      desc: "I know a few words and phrases", 
      emoji: "🌿",
      color: "from-blue-400 to-cyan-500"
    },
    { 
      level: 3, 
      title: "Intermediate", 
      desc: "I can have simple conversations", 
      emoji: "🌳",
      color: "from-orange-400 to-yellow-500"
    },
    { 
      level: 4, 
      title: "Advanced", 
      desc: "I'm quite fluent but want to improve", 
      emoji: "🎯",
      color: "from-purple-400 to-pink-500"
    },
    { 
      level: 5, 
      title: "Expert", 
      desc: "I'm fluent and want to perfect my skills", 
      emoji: "⭐",
      color: "from-red-400 to-rose-500"
    }
  ];

  const handleNext = () => {
    if (currentStep === 0 && fullName.trim()) {
      setCurrentStep(1);
    } else if (currentStep === 1 && userPhoneNumber.trim()) {
      setCurrentStep(2);
    } else if (currentStep === 2 && hasConsented) {
      setCurrentStep(3);
    } else if (currentStep === 3 && proficiencyLevel) {
      // Ensure we have a valid phone number
      const validPhoneNumber = userPhoneNumber.trim() || `+1${Date.now()}`;
      
      console.log('Creating profile with:', {
        phone_number: validPhoneNumber,
        full_name: fullName.trim(),
        proficiency_level: proficiencyLevel,
        language: 'hindi'
      });

      // Create user profile
      createUserProfile.mutate({
        phone_number: validPhoneNumber,
        full_name: fullName.trim(),
        proficiency_level: proficiencyLevel,
        language: 'hindi'
      }, {
        onSuccess: () => {
          // Redirect to dashboard after successful profile creation
          setTimeout(() => {
            window.location.href = '/app';
          }, 1000);
          onComplete();
        }
      });
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleProficiencySelect = (level: number) => {
    setProficiencyLevel(level);
    setTimeout(() => {
      handleNext();
    }, 300);
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="w-full min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-pink-50">
            <AppBar title="Welcome" showBackButton={false} />
            <div className="w-full flex items-center justify-center">
              <div className="w-full max-w-md">
                <div className="text-center mb-8">
                  <div className="relative mb-6">
                    <BolMascot className="w-24 h-24 mx-auto animate-bounce" />
                    <div className="absolute -top-2 -right-4 w-8 h-8 bg-orange-400 rounded-full flex items-center justify-center animate-pulse">
                      <Heart className="w-4 h-4 text-white" />
                    </div>
                  </div>
                  <h1 className="text-4xl font-black text-orange-600 mb-3 tracking-wide uppercase transform -rotate-1">
                    What's Your Name? 👋
                  </h1>
                  <p className="text-slate-700 font-bold text-lg">Let's get to know you better!</p>
                </div>

              <div className="bg-white rounded-3xl p-8 border-4 border-orange-200 shadow-2xl w-full">
                <div className="space-y-6">
                  <div>
                    <Label htmlFor="fullName" className="text-lg font-bold text-slate-700 mb-3 block">
                      Your Full Name
                    </Label>
                    <Input
                      id="fullName"
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Enter your full name"
                      className="text-lg py-4 px-6 rounded-2xl border-3 border-orange-200 focus:border-orange-400 font-semibold w-full"
                    />
                  </div>
                  
                  <Button
                    onClick={handleNext}
                    disabled={!fullName.trim()}
                    className="w-full bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white font-black py-6 text-xl rounded-2xl border-3 border-orange-400 shadow-xl transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:scale-100"
                  >
                    <div className="flex items-center justify-center">
                      Continue
                      <ChevronRight className="w-6 h-6 ml-2" />
                    </div>
                  </Button>
                </div>
              </div>

                <div className="text-center mt-6 p-4 bg-white rounded-2xl border-3 border-orange-200 shadow-lg w-full">
                  <BolMascot size="sm" className="w-6 h-6 inline-block mr-2" />
                  <span className="text-orange-700 font-bold">Nice to meet you! 🌟</span>
                </div>
              </div>
            </div>
          </div>
        );

      case 1:
        return (
          <div className="w-full min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-indigo-50">
            <AppBar title="Phone Number 📱" onBack={handleBack} />
            <div className="px-6 pt-4">
              <div className="text-center mb-6">
                <p className="text-slate-700 font-bold text-base sm:text-lg">We'll use this to call you for lessons!</p>
              </div>
            </div>

            <div className="space-y-6 pb-8 px-6">
              <div className="bg-white rounded-3xl p-6 sm:p-8 border-4 border-blue-200 shadow-2xl w-full max-w-md mx-auto">
                <div className="text-center mb-6">
                  <BolMascot className="w-16 h-16 mx-auto mb-4" />
                  <h2 className="text-xl sm:text-2xl font-black text-blue-600 mb-2">Great, {fullName}! 🎉</h2>
                  <p className="text-slate-600 font-semibold text-sm sm:text-base">What's your phone number?</p>
                </div>

                <div className="space-y-6">
                  <div>
                    <Label htmlFor="phoneNumber" className="text-lg font-bold text-slate-700 mb-3 block">
                      Phone Number
                    </Label>
                    <Input
                      id="phoneNumber"
                      type="tel"
                      value={userPhoneNumber}
                      onChange={(e) => setUserPhoneNumber(e.target.value)}
                      placeholder="Enter your phone number (e.g., 1234567890)"
                      className="text-lg py-4 px-6 rounded-2xl border-3 border-blue-200 focus:border-blue-400 font-semibold w-full"
                    />
                  </div>

                  <Button
                    onClick={handleNext}
                    disabled={!userPhoneNumber.trim()}
                    className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-black py-6 text-lg sm:text-xl rounded-2xl border-3 border-blue-400 shadow-xl transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:scale-100"
                  >
                    <div className="flex items-center justify-center">
                      Continue
                      <ChevronRight className="w-6 h-6 ml-2" />
                    </div>
                  </Button>
                </div>
              </div>

              <div className="text-center p-4 bg-white rounded-2xl border-3 border-blue-200 shadow-lg w-full max-w-md mx-auto">
                <BolMascot size="sm" className="w-6 h-6 inline-block mr-2" />
                <span className="text-blue-700 font-bold text-sm sm:text-base">We'll call you for fun Hindi lessons! 📞</span>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="w-full min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-cyan-50">
            <AppBar title="Terms & Consent 📋" onBack={handleBack} />
            <div className="px-6 pt-4">
              <div className="text-center mb-6">
                <p className="text-slate-700 font-bold text-base sm:text-lg">Just a quick agreement!</p>
              </div>
            </div>

            <div className="space-y-6 pb-8 px-6">
              <div className="bg-white rounded-3xl p-6 sm:p-8 border-4 border-purple-200 shadow-2xl w-full max-w-md mx-auto">
                <div className="text-center mb-6">
                  <BolMascot className="w-16 h-16 mx-auto mb-4" />
                  <h2 className="text-xl sm:text-2xl font-black text-purple-600 mb-2">Almost there! 🎉</h2>
                  <p className="text-slate-600 font-semibold text-sm sm:text-base">We need your consent to get started</p>
                </div>

                <div className="space-y-6">
                  <div 
                    className="flex items-start space-x-4 p-4 bg-purple-50 rounded-2xl border-2 border-purple-200 cursor-pointer"
                    onClick={() => setHasConsented(!hasConsented)}
                  >
                    <Checkbox
                      id="consent"
                      checked={hasConsented}
                      onCheckedChange={(checked) => setHasConsented(checked as boolean)}
                      className="mt-1 flex-shrink-0"
                    />
                    <div className="flex-1">
                      <Label htmlFor="consent" className="text-xs sm:text-sm font-bold text-slate-700 leading-relaxed cursor-pointer">
                        By checking this box, I agree to receive daily calls and text messages from Bol at the number provided, including via automated systems. I also agree to the{' '}
                        <Link to="/privacy-policy" className="text-purple-600 hover:text-purple-800 underline font-black">
                          Privacy Policy
                        </Link>{' '}
                        and{' '}
                        <Link to="/terms-of-service" className="text-purple-600 hover:text-purple-800 underline font-black">
                          Terms of Service
                        </Link>
                        . Consent is not required as a condition of purchase. Message & data rates may apply. You may opt out anytime by replying STOP or contacting us.
                      </Label>
                    </div>
                  </div>

                  <Button
                    onClick={handleNext}
                    disabled={!hasConsented}
                    className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white font-black py-6 text-lg sm:text-xl rounded-2xl border-3 border-purple-400 shadow-xl transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:scale-100"
                  >
                    <div className="flex items-center justify-center">
                      I Agree - Continue
                      <ChevronRight className="w-6 h-6 ml-2" />
                    </div>
                  </Button>
                </div>
              </div>

              <div className="text-center p-4 bg-white rounded-2xl border-3 border-purple-200 shadow-lg w-full max-w-md mx-auto">
                <BolMascot size="sm" className="w-6 h-6 inline-block mr-2" />
                <span className="text-purple-700 font-bold text-sm sm:text-base">Your privacy matters to us! 🔒</span>
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="w-full min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
            <AppBar title="Hindi Level 📚" onBack={handleBack} />
            <div className="px-6 pt-4">
              <div className="text-center mb-6">
                <p className="text-slate-700 font-bold text-base sm:text-lg">How well do you know Hindi?</p>
              </div>
            </div>

            <div className="space-y-4 pb-8 px-6">
              <div className="space-y-4 w-full max-w-md mx-auto">
                {proficiencyLevels.map((level, index) => (
                  <button
                    key={level.level}
                    onClick={() => handleProficiencySelect(level.level)}
                    disabled={createUserProfile.isPending}
                    className={`w-full p-4 sm:p-5 rounded-3xl text-left transition-all duration-300 border-4 transform hover:scale-[1.02] hover:shadow-xl ${
                      proficiencyLevel === level.level 
                        ? `bg-gradient-to-r ${level.color} border-white text-white shadow-2xl scale-[1.02] animate-pulse` 
                        : 'bg-white border-green-200 hover:border-green-300 hover:bg-gradient-to-r hover:from-green-50 hover:to-blue-50 shadow-lg'
                    }`}
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="flex items-center space-x-3 sm:space-x-4">
                      <div className={`w-12 h-12 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center text-2xl sm:text-3xl transition-all shadow-lg ${
                        proficiencyLevel === level.level ? 'bg-white bg-opacity-20 shadow-inner transform scale-110' : 'bg-gradient-to-br from-green-100 to-blue-100'
                      }`}>
                        {level.emoji}
                      </div>
                      <div className="flex-1">
                        <div className="font-black text-lg sm:text-xl mb-1 sm:mb-2 uppercase tracking-wide">{level.title}</div>
                        <div className={`text-xs sm:text-sm font-bold ${
                          proficiencyLevel === level.level ? 'text-white text-opacity-90' : 'text-slate-600'
                        }`}>
                          {level.desc}
                        </div>
                      </div>
                      <div className={`transition-all ${proficiencyLevel === level.level ? 'animate-bounce' : ''}`}>
                        <Star className={`w-5 h-5 sm:w-6 sm:h-6 transition-all ${
                          proficiencyLevel === level.level ? 'text-white' : 'text-green-400'
                        }`} />
                      </div>
                    </div>
                  </button>
                ))}
              </div>

              <div className="text-center mt-8 p-4 bg-white rounded-2xl border-3 border-green-200 shadow-lg w-full max-w-md mx-auto">
                <BolMascot size="sm" className="w-6 h-6 inline-block mr-2" />
                <span className="text-green-700 font-bold text-sm sm:text-base">
                  {createUserProfile.isPending ? "Creating your profile..." : "Choose your current level! 🎯"}
                </span>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="w-full">
      {renderStep()}
    </div>
  );
};

export default SimpleOnboardingFlow;
