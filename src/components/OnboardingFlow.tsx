
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronRight, ChevronLeft, Volume2, Sparkles, ArrowLeft, Heart, Zap, Star } from "lucide-react";
import BolMascot from "./BolMascot";

interface OnboardingFlowProps {
  onComplete: () => void;
}

const OnboardingFlow = ({ onComplete }: OnboardingFlowProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedGoal, setSelectedGoal] = useState("");
  const [selectedTone, setSelectedTone] = useState("");

  const goals = [
    { id: "bollywood", title: "Understand Bollywood", desc: "Movies, songs, and drama", emoji: "🎬", color: "from-red-400 to-pink-500" },
    { id: "family", title: "Talk to My Family", desc: "Connect with loved ones", emoji: "👵", color: "from-blue-400 to-purple-500" },
    { id: "travel", title: "Travel to India", desc: "Navigate like a local", emoji: "✈️", color: "from-green-400 to-cyan-500" },
    { id: "culture", title: "Explore Indian Culture", desc: "Festivals, food, traditions", emoji: "🕉️", color: "from-orange-400 to-yellow-500" },
    { id: "business", title: "Work with Colleagues", desc: "Professional conversations", emoji: "💼", color: "from-gray-400 to-slate-500" }
  ];

  const tones = [
    { id: "chaotic", title: "Chaotic Teacher", desc: "Unpredictable and wild", emoji: "🌪️", color: "from-red-400 to-orange-500" },
    { id: "flirty", title: "Flirty Instructor", desc: "Smooth and charming", emoji: "😘", color: "from-pink-400 to-rose-500" },
    { id: "calm", title: "Zen Master", desc: "Peaceful and mindful", emoji: "🧘", color: "from-green-400 to-emerald-500" },
    { id: "strict", title: "Strict Teacher", desc: "No-nonsense educator", emoji: "👩‍🏫", color: "from-gray-400 to-slate-500" },
    { id: "grandma", title: "Sweet Grandma", desc: "Caring and encouraging", emoji: "👵", color: "from-purple-400 to-indigo-500" },
    { id: "sadboi", title: "Melancholy Poet", desc: "Deep and philosophical", emoji: "😔", color: "from-blue-400 to-cyan-500" }
  ];

  const nextStep = () => {
    if (currentStep < 2) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleGoalSelect = (goalId: string) => {
    setSelectedGoal(goalId);
    setTimeout(() => {
      setCurrentStep(1);
    }, 300);
  };

  const handleToneSelect = (toneId: string) => {
    setSelectedTone(toneId);
    setTimeout(() => {
      setCurrentStep(2);
    }, 300);
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-pink-50 pb-8">
            {/* Header with animated sheep */}
            <div className="px-6 pt-8 pb-6">
              <div className="flex items-center justify-center">
                <div className="text-center">
                  <div className="relative">
                    <BolMascot className="w-24 h-24 mx-auto mb-4 animate-bounce" />
                    <div className="absolute -top-2 -right-4 w-8 h-8 bg-orange-400 rounded-full flex items-center justify-center animate-pulse">
                      <Heart className="w-4 h-4 text-white" />
                    </div>
                  </div>
                  <h1 className="text-4xl font-black text-orange-600 mb-3 tracking-wide uppercase transform -rotate-1">
                    What's Your Goal? 🎯
                  </h1>
                  <p className="text-slate-700 font-bold text-lg">Tell me why you want to learn Hindi!</p>
                </div>
              </div>
            </div>

            <div className="px-6 space-y-4">
              {/* Progress indicator with fun design */}
              <div className="flex items-center justify-center mb-8">
                <div className="flex space-x-3">
                  <div className="w-4 h-4 bg-gradient-to-r from-orange-400 to-orange-500 rounded-full shadow-lg border-2 border-white"></div>
                  <div className="w-4 h-4 bg-gray-300 rounded-full border-2 border-white"></div>
                  <div className="w-4 h-4 bg-gray-300 rounded-full border-2 border-white"></div>
                </div>
              </div>
              
              <div className="space-y-4">
                {goals.map((goal, index) => (
                  <button
                    key={goal.id}
                    onClick={() => handleGoalSelect(goal.id)}
                    className={`w-full p-5 rounded-3xl text-left transition-all duration-300 border-4 transform hover:scale-[1.02] hover:shadow-xl ${
                      selectedGoal === goal.id 
                        ? `bg-gradient-to-r ${goal.color} border-white text-white shadow-2xl scale-[1.02] animate-pulse` 
                        : 'bg-white border-orange-200 hover:border-orange-300 hover:bg-gradient-to-r hover:from-orange-50 hover:to-yellow-50 shadow-lg'
                    }`}
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="flex items-center space-x-4">
                      <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-3xl transition-all shadow-lg ${
                        selectedGoal === goal.id ? 'bg-white bg-opacity-20 shadow-inner transform scale-110' : 'bg-gradient-to-br from-orange-100 to-yellow-100'
                      }`}>
                        {goal.emoji}
                      </div>
                      <div className="flex-1">
                        <div className="font-black text-xl mb-2 uppercase tracking-wide">{goal.title}</div>
                        <div className={`text-sm font-bold ${
                          selectedGoal === goal.id ? 'text-white text-opacity-90' : 'text-slate-600'
                        }`}>
                          {goal.desc}
                        </div>
                      </div>
                      <div className={`transition-all ${selectedGoal === goal.id ? 'animate-bounce' : ''}`}>
                        <ChevronRight className={`w-6 h-6 transition-all ${
                          selectedGoal === goal.id ? 'text-white' : 'text-orange-400'
                        }`} />
                      </div>
                    </div>
                  </button>
                ))}
              </div>

              {/* Fun footer message */}
              <div className="text-center mt-8 p-4 bg-white rounded-2xl border-3 border-orange-200 shadow-lg">
                <span className="text-orange-700 font-bold">Choose what excites you most! 🌟</span>
              </div>
            </div>
          </div>
        );

      case 1:
        return (
          <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 pb-8">
            {/* Header with back button */}
            <div className="px-6 pt-8 pb-6">
              <div className="flex items-center justify-between">
                <Button
                  onClick={prevStep}
                  className="w-14 h-14 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 rounded-2xl text-white shadow-xl border-3 border-purple-400 transition-all duration-300"
                >
                  <ArrowLeft className="w-6 h-6" />
                </Button>
                <div className="text-center">
                  <div className="relative">
                    <h1 className="text-4xl font-black text-purple-600 tracking-wide uppercase transform rotate-1">
                      Choose Your Style 🎭
                    </h1>
                    <Sparkles className="absolute -top-2 -right-4 w-6 h-6 text-purple-400 animate-spin" />
                  </div>
                  <p className="text-slate-700 font-bold text-lg">How should your AI teacher vibe?</p>
                </div>
                <div className="w-14 h-14"></div>
              </div>
            </div>

            <div className="px-6 space-y-4">
              {/* Progress indicator */}
              <div className="flex items-center justify-center mb-8">
                <div className="flex space-x-3">
                  <div className="w-4 h-4 bg-gradient-to-r from-green-400 to-green-500 rounded-full shadow-lg border-2 border-white">
                    <div className="w-full h-full bg-white rounded-full animate-ping opacity-75"></div>
                  </div>
                  <div className="w-4 h-4 bg-gradient-to-r from-purple-400 to-purple-500 rounded-full shadow-lg border-2 border-white"></div>
                  <div className="w-4 h-4 bg-gray-300 rounded-full border-2 border-white"></div>
                </div>
              </div>
              
              <div className="space-y-4">
                {tones.map((tone, index) => (
                  <button
                    key={tone.id}
                    onClick={() => handleToneSelect(tone.id)}
                    className={`w-full p-5 rounded-3xl text-left transition-all duration-300 border-4 transform hover:scale-[1.02] hover:shadow-xl ${
                      selectedTone === tone.id 
                        ? `bg-gradient-to-r ${tone.color} border-white text-white shadow-2xl scale-[1.02] animate-pulse` 
                        : 'bg-white border-purple-200 hover:border-purple-300 hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 shadow-lg'
                    }`}
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-3xl transition-all shadow-lg ${
                          selectedTone === tone.id ? 'bg-white bg-opacity-20 shadow-inner transform scale-110' : 'bg-gradient-to-br from-purple-100 to-pink-100'
                        }`}>
                          {tone.emoji}
                        </div>
                        <div>
                          <div className="font-black text-xl mb-2 uppercase tracking-wide">{tone.title}</div>
                          <div className={`text-sm font-bold ${
                            selectedTone === tone.id ? 'text-white text-opacity-90' : 'text-slate-600'
                          }`}>
                            {tone.desc}
                          </div>
                        </div>
                      </div>
                      <div className={`transition-all ${selectedTone === tone.id ? 'animate-bounce' : ''}`}>
                        <Volume2 className={`w-6 h-6 ${
                          selectedTone === tone.id ? 'text-white' : 'text-purple-400'
                        }`} />
                      </div>
                    </div>
                  </button>
                ))}
              </div>

              {/* Fun footer message */}
              <div className="text-center mt-8 p-4 bg-white rounded-2xl border-3 border-purple-200 shadow-lg">
                
                <span className="text-purple-700 font-bold">Pick your perfect teaching vibe! ✨</span>
              </div>
            </div>
          </div>
        );

      case 2:
        const selectedGoalData = goals.find(g => g.id === selectedGoal);
        const selectedToneData = tones.find(t => t.id === selectedTone);
        
        return (
          <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 pb-8">
            {/* Header with back button */}
            <div className="px-6 pt-8 pb-6">
              <div className="flex items-center justify-between">
                <Button
                  onClick={prevStep}
                  className="w-14 h-14 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 rounded-2xl text-white shadow-xl border-3 border-green-400 transition-all duration-300"
                >
                  <ArrowLeft className="w-6 h-6" />
                </Button>
                <div className="text-center">
                  <div className="relative">
                    <h1 className="text-4xl font-black text-green-600 tracking-wide uppercase transform -rotate-1">
                      You're All Set! 🎉
                    </h1>
                    <Star className="absolute -top-2 -left-4 w-6 h-6 text-yellow-400 animate-pulse" />
                    <Zap className="absolute -top-2 -right-4 w-6 h-6 text-orange-400 animate-bounce" />
                  </div>
                  <p className="text-slate-700 font-bold text-lg">Ready to start your journey?</p>
                </div>
                <div className="w-14 h-14"></div>
              </div>
            </div>

            <div className="px-6 space-y-6">
              {/* Progress indicator - all complete */}
              <div className="flex items-center justify-center mb-8">
                <div className="flex space-x-3">
                  <div className="w-4 h-4 bg-gradient-to-r from-green-400 to-green-500 rounded-full shadow-lg border-2 border-white">
                    <div className="w-full h-full bg-white rounded-full animate-ping opacity-75"></div>
                  </div>
                  <div className="w-4 h-4 bg-gradient-to-r from-green-400 to-green-500 rounded-full shadow-lg border-2 border-white">
                    <div className="w-full h-full bg-white rounded-full animate-ping opacity-75"></div>
                  </div>
                  <div className="w-4 h-4 bg-gradient-to-r from-green-400 to-green-500 rounded-full shadow-lg border-2 border-white">
                    <div className="w-full h-full bg-white rounded-full animate-ping opacity-75"></div>
                  </div>
                </div>
              </div>

              {/* Success Card with celebration */}
              <div className="bg-gradient-to-r from-green-400 to-emerald-500 rounded-3xl p-8 border-4 border-green-600 text-center shadow-2xl relative overflow-hidden">
                <div className="absolute inset-0 bg-white bg-opacity-10 animate-pulse"></div>
                <div className="relative z-10">
                  <div className="relative mb-6">
                    <BolMascot className="w-24 h-24 mx-auto animate-bounce" />
                    <div className="absolute -top-2 -right-8 w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center animate-spin">
                      <Sparkles className="w-5 h-5 text-yellow-800" />
                    </div>
                    <div className="absolute -bottom-2 -left-8 w-8 h-8 bg-pink-400 rounded-full flex items-center justify-center animate-bounce">
                      <Heart className="w-4 h-4 text-white" />
                    </div>
                  </div>
                  <h2 className="text-3xl font-black text-white mb-4 uppercase tracking-wide">Perfect Match! 🤝</h2>
                  <p className="text-green-100 font-bold text-xl">
                    Your AI teacher is ready to help you master Hindi!
                  </p>
                </div>
              </div>
              
              {/* Profile Summary Card with enhanced design */}
              <div className="bg-white rounded-3xl p-8 border-4 border-blue-200 shadow-2xl relative">
                <div className="absolute top-4 right-4">
                  
                </div>
                <div className="flex items-center justify-center space-x-4 mb-6">
                  <div className={`w-20 h-20 bg-gradient-to-br ${selectedGoalData?.color} rounded-3xl flex items-center justify-center text-4xl shadow-xl border-3 border-white`}>
                    {selectedGoalData?.emoji}
                  </div>
                  <div className="text-4xl font-black text-orange-400 animate-pulse">+</div>
                  <div className={`w-20 h-20 bg-gradient-to-br ${selectedToneData?.color} rounded-3xl flex items-center justify-center text-4xl shadow-xl border-3 border-white`}>
                    {selectedToneData?.emoji}
                  </div>
                </div>
                <h3 className="text-center font-black text-slate-800 mb-3 text-2xl uppercase tracking-wide">Your Learning Profile:</h3>
                <p className="text-center text-slate-700 font-bold mb-6 text-xl">
                  {selectedGoalData?.title} + {selectedToneData?.title}
                </p>
                <div className="bg-gradient-to-r from-orange-100 to-pink-100 p-6 rounded-3xl border-4 border-orange-200 relative">
                  <div className="absolute top-2 right-2 w-6 h-6 bg-orange-400 rounded-full flex items-center justify-center">
                    <Star className="w-3 h-3 text-white" />
                  </div>
                  <p className="text-sm text-orange-700 mb-3 font-bold uppercase tracking-wide">🎬 Sample scenario:</p>
                  <p className="font-black text-orange-800 italic text-xl">
                    "Let's plan a Bollywood movie date... but explain everything in Hindi!"
                  </p>
                </div>
              </div>
              
              {/* Enhanced Start Button */}
              <Button 
                onClick={nextStep}
                className="w-full bg-gradient-to-r from-orange-500 via-pink-500 to-purple-500 hover:from-orange-600 hover:via-pink-600 hover:to-purple-600 text-white font-black py-8 text-2xl rounded-3xl border-4 border-orange-600 shadow-2xl transform hover:scale-[1.02] transition-all duration-300 relative overflow-hidden uppercase tracking-wide"
              >
                <div className="absolute inset-0 bg-white bg-opacity-20 animate-pulse"></div>
                <div className="relative z-10 flex items-center justify-center">
                  <Sparkles className="w-8 h-8 mr-3 animate-spin" />
                  Start My Hindi Adventure!
                  <Zap className="w-8 h-8 ml-3 animate-bounce" />
                </div>
              </Button>
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

export default OnboardingFlow;
