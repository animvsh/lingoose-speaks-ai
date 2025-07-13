import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ChevronRight, ArrowLeft, Sparkles, Heart, Star } from "lucide-react";
import BolMascot from "./BolMascot";
import { useCreateUserProfile } from "@/hooks/useCreateUserProfile";

interface SimpleOnboardingFlowProps {
  onComplete: () => void;
  phoneNumber: string;
}

const SimpleOnboardingFlow = ({ onComplete, phoneNumber }: SimpleOnboardingFlowProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [fullName, setFullName] = useState("");
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
    } else if (currentStep === 1 && proficiencyLevel) {
      // Create user profile
      createUserProfile.mutate({
        phone_number: phoneNumber,
        full_name: fullName.trim(),
        proficiency_level: proficiencyLevel,
        language: 'hindi'
      }, {
        onSuccess: () => {
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
          <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-pink-50 flex items-center justify-center p-6">
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

              <div className="bg-white rounded-3xl p-8 border-4 border-orange-200 shadow-2xl">
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
                      className="text-lg py-4 px-6 rounded-2xl border-3 border-orange-200 focus:border-orange-400 font-semibold"
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

              <div className="text-center mt-6 p-4 bg-white rounded-2xl border-3 border-orange-200 shadow-lg">
                <BolMascot size="sm" className="w-6 h-6 inline-block mr-2" />
                <span className="text-orange-700 font-bold">Nice to meet you! 🌟</span>
              </div>
            </div>
          </div>
        );

      case 1:
        return (
          <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-cyan-50 pb-8">
            <div className="px-6 pt-8 pb-6">
              <div className="flex items-center justify-between">
                <Button
                  onClick={handleBack}
                  className="w-14 h-14 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 rounded-2xl text-white shadow-xl border-3 border-purple-400 transition-all duration-300"
                >
                  <ArrowLeft className="w-6 h-6" />
                </Button>
                <div className="text-center">
                  <div className="relative">
                    <h1 className="text-4xl font-black text-purple-600 tracking-wide uppercase transform rotate-1">
                      Your Hindi Level? 📚
                    </h1>
                    <Sparkles className="absolute -top-2 -right-4 w-6 h-6 text-purple-400 animate-spin" />
                  </div>
                  <p className="text-slate-700 font-bold text-lg">How well do you know Hindi?</p>
                </div>
                <div className="w-14 h-14"></div>
              </div>
            </div>

            <div className="px-6 space-y-4">
              <div className="space-y-4">
                {proficiencyLevels.map((level, index) => (
                  <button
                    key={level.level}
                    onClick={() => handleProficiencySelect(level.level)}
                    disabled={createUserProfile.isPending}
                    className={`w-full p-5 rounded-3xl text-left transition-all duration-300 border-4 transform hover:scale-[1.02] hover:shadow-xl ${
                      proficiencyLevel === level.level 
                        ? `bg-gradient-to-r ${level.color} border-white text-white shadow-2xl scale-[1.02] animate-pulse` 
                        : 'bg-white border-purple-200 hover:border-purple-300 hover:bg-gradient-to-r hover:from-purple-50 hover:to-blue-50 shadow-lg'
                    }`}
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="flex items-center space-x-4">
                      <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-3xl transition-all shadow-lg ${
                        proficiencyLevel === level.level ? 'bg-white bg-opacity-20 shadow-inner transform scale-110' : 'bg-gradient-to-br from-purple-100 to-blue-100'
                      }`}>
                        {level.emoji}
                      </div>
                      <div className="flex-1">
                        <div className="font-black text-xl mb-2 uppercase tracking-wide">{level.title}</div>
                        <div className={`text-sm font-bold ${
                          proficiencyLevel === level.level ? 'text-white text-opacity-90' : 'text-slate-600'
                        }`}>
                          {level.desc}
                        </div>
                      </div>
                      <div className={`transition-all ${proficiencyLevel === level.level ? 'animate-bounce' : ''}`}>
                        <Star className={`w-6 h-6 transition-all ${
                          proficiencyLevel === level.level ? 'text-white' : 'text-purple-400'
                        }`} />
                      </div>
                    </div>
                  </button>
                ))}
              </div>

              <div className="text-center mt-8 p-4 bg-white rounded-2xl border-3 border-purple-200 shadow-lg">
                <BolMascot size="sm" className="w-6 h-6 inline-block mr-2" />
                <span className="text-purple-700 font-bold">
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
    <div className="w-full max-w-md mx-auto">
      {renderStep()}
    </div>
  );
};

export default SimpleOnboardingFlow;
