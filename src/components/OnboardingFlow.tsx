
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronRight, ChevronLeft, Volume2, Sparkles, ArrowLeft } from "lucide-react";
import DuckMascot from "./DuckMascot";

interface OnboardingFlowProps {
  onComplete: () => void;
}

const OnboardingFlow = ({ onComplete }: OnboardingFlowProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedGoal, setSelectedGoal] = useState("");
  const [selectedTone, setSelectedTone] = useState("");

  const goals = [
    { id: "bollywood", title: "Understand Bollywood", desc: "Movies, songs, and drama", emoji: "🎬" },
    { id: "family", title: "Talk to My Family", desc: "Connect with loved ones", emoji: "👵" },
    { id: "travel", title: "Travel to India", desc: "Navigate like a local", emoji: "✈️" },
    { id: "culture", title: "Explore Indian Culture", desc: "Festivals, food, traditions", emoji: "🕉️" },
    { id: "business", title: "Work with Colleagues", desc: "Professional conversations", emoji: "💼" }
  ];

  const tones = [
    { id: "chaotic", title: "Chaotic Teacher", desc: "Unpredictable and wild", emoji: "🌪️" },
    { id: "flirty", title: "Flirty Instructor", desc: "Smooth and charming", emoji: "😘" },
    { id: "calm", title: "Zen Master", desc: "Peaceful and mindful", emoji: "🧘" },
    { id: "strict", title: "Strict Teacher", desc: "No-nonsense educator", emoji: "👩‍🏫" },
    { id: "grandma", title: "Sweet Grandma", desc: "Caring and encouraging", emoji: "👵" },
    { id: "sadboi", title: "Melancholy Poet", desc: "Deep and philosophical", emoji: "😔" }
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
            {/* Header */}
            <div className="px-6 pt-8 pb-6">
              <div className="flex items-center justify-center">
                <div className="text-center">
                  <DuckMascot className="w-20 h-20 mx-auto mb-4 animate-bounce" />
                  <h1 className="text-3xl font-bold text-orange-600 mb-2 tracking-wide">
                    What's Your Goal? 🎯
                  </h1>
                  <p className="text-slate-600 font-medium">Tell me why you want to learn Hindi!</p>
                </div>
              </div>
            </div>

            <div className="px-6 space-y-4">
              {/* Progress indicator */}
              <div className="flex items-center justify-center mb-6">
                <div className="flex space-x-2">
                  <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-gray-200 rounded-full"></div>
                  <div className="w-3 h-3 bg-gray-200 rounded-full"></div>
                </div>
              </div>
              
              <div className="space-y-3">
                {goals.map((goal) => (
                  <button
                    key={goal.id}
                    onClick={() => handleGoalSelect(goal.id)}
                    className={`w-full p-4 rounded-2xl text-left transition-all duration-300 border-3 transform hover:scale-[1.02] hover:shadow-lg ${
                      selectedGoal === goal.id 
                        ? 'bg-gradient-to-r from-green-400 to-green-500 border-green-600 text-white shadow-lg scale-[1.02]' 
                        : 'bg-white border-orange-200 hover:border-orange-300 hover:bg-orange-50 shadow-md'
                    }`}
                  >
                    <div className="flex items-center space-x-4">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl transition-all ${
                        selectedGoal === goal.id ? 'bg-green-600 shadow-inner' : 'bg-orange-100'
                      }`}>
                        {goal.emoji}
                      </div>
                      <div className="flex-1">
                        <div className="font-bold text-lg mb-1">{goal.title}</div>
                        <div className={`text-sm ${
                          selectedGoal === goal.id ? 'text-green-100' : 'text-slate-600'
                        }`}>
                          {goal.desc}
                        </div>
                      </div>
                      <ChevronRight className={`w-5 h-5 transition-all ${
                        selectedGoal === goal.id ? 'text-white' : 'text-orange-400'
                      }`} />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        );

      case 1:
        return (
          <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 pb-8">
            {/* Header */}
            <div className="px-6 pt-8 pb-6">
              <div className="flex items-center justify-between">
                <Button
                  onClick={prevStep}
                  className="w-12 h-12 bg-purple-500 hover:bg-purple-600 rounded-xl text-white shadow-lg"
                >
                  <ArrowLeft className="w-5 h-5" />
                </Button>
                <div className="text-center">
                  <h1 className="text-3xl font-bold text-purple-600 tracking-wide">
                    Choose Your Style 🎭
                  </h1>
                  <p className="text-slate-600 font-medium">How should your AI teacher vibe?</p>
                </div>
                <div className="w-12 h-12"></div>
              </div>
            </div>

            <div className="px-6 space-y-4">
              {/* Progress indicator */}
              <div className="flex items-center justify-center mb-6">
                <div className="flex space-x-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-gray-200 rounded-full"></div>
                </div>
              </div>
              
              <div className="space-y-3">
                {tones.map((tone) => (
                  <button
                    key={tone.id}
                    onClick={() => handleToneSelect(tone.id)}
                    className={`w-full p-4 rounded-2xl text-left transition-all duration-300 border-3 transform hover:scale-[1.02] hover:shadow-lg ${
                      selectedTone === tone.id 
                        ? 'bg-gradient-to-r from-green-400 to-green-500 border-green-600 text-white shadow-lg scale-[1.02]' 
                        : 'bg-white border-purple-200 hover:border-purple-300 hover:bg-purple-50 shadow-md'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl transition-all ${
                          selectedTone === tone.id ? 'bg-green-600 shadow-inner' : 'bg-purple-100'
                        }`}>
                          {tone.emoji}
                        </div>
                        <div>
                          <div className="font-bold text-lg mb-1">{tone.title}</div>
                          <div className={`text-sm ${
                            selectedTone === tone.id ? 'text-green-100' : 'text-slate-600'
                          }`}>
                            {tone.desc}
                          </div>
                        </div>
                      </div>
                      <Volume2 className={`w-5 h-5 ${
                        selectedTone === tone.id ? 'text-white' : 'text-purple-400'
                      }`} />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        );

      case 2:
        const selectedGoalData = goals.find(g => g.id === selectedGoal);
        const selectedToneData = tones.find(t => t.id === selectedTone);
        
        return (
          <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 pb-8">
            {/* Header */}
            <div className="px-6 pt-8 pb-6">
              <div className="flex items-center justify-between">
                <Button
                  onClick={prevStep}
                  className="w-12 h-12 bg-green-500 hover:bg-green-600 rounded-xl text-white shadow-lg"
                >
                  <ArrowLeft className="w-5 h-5" />
                </Button>
                <div className="text-center">
                  <h1 className="text-3xl font-bold text-green-600 tracking-wide">
                    You're All Set! 🎉
                  </h1>
                  <p className="text-slate-600 font-medium">Ready to start your journey?</p>
                </div>
                <div className="w-12 h-12"></div>
              </div>
            </div>

            <div className="px-6 space-y-6">
              {/* Progress indicator */}
              <div className="flex items-center justify-center mb-6">
                <div className="flex space-x-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                </div>
              </div>

              {/* Success Card */}
              <div className="bg-gradient-to-r from-green-400 to-green-500 rounded-3xl p-6 border-4 border-green-600 text-center shadow-xl">
                <div className="relative">
                  <DuckMascot className="w-20 h-20 mx-auto mb-4" />
                  <div className="absolute -top-2 -right-8 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center animate-pulse">
                    <Sparkles className="w-4 h-4 text-yellow-800" />
                  </div>
                </div>
                <h2 className="text-2xl font-bold text-white mb-3">Perfect Match! 🤝</h2>
                <p className="text-green-100 font-medium text-lg">
                  Your AI teacher is ready to help you master Hindi!
                </p>
              </div>
              
              {/* Profile Summary Card */}
              <div className="bg-white rounded-3xl p-6 border-4 border-blue-200 shadow-xl">
                <div className="flex items-center justify-center space-x-3 mb-4">
                  <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center text-2xl">
                    {selectedGoalData?.emoji}
                  </div>
                  <div className="text-3xl">+</div>
                  <div className="w-14 h-14 bg-purple-100 rounded-2xl flex items-center justify-center text-2xl">
                    {selectedToneData?.emoji}
                  </div>
                </div>
                <h3 className="text-center font-bold text-slate-800 mb-2 text-lg">Your Learning Profile:</h3>
                <p className="text-center text-slate-700 font-semibold mb-4 text-lg">
                  {selectedGoalData?.title} + {selectedToneData?.title}
                </p>
                <div className="bg-gradient-to-r from-orange-100 to-pink-100 p-4 rounded-2xl border-3 border-orange-200">
                  <p className="text-sm text-orange-700 mb-2 font-semibold">🎬 Sample scenario:</p>
                  <p className="font-bold text-orange-800 italic text-lg">
                    "Let's plan a Bollywood movie date... but explain everything in Hindi!"
                  </p>
                </div>
              </div>
              
              {/* Start Button */}
              <Button 
                onClick={nextStep}
                className="w-full bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white font-bold py-6 text-xl rounded-3xl border-4 border-orange-600 shadow-xl transform hover:scale-[1.02] transition-all duration-300"
              >
                <Sparkles className="w-6 h-6 mr-3" />
                Start My Hindi Adventure!
              </Button>
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

export default OnboardingFlow;
