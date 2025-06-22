
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
          <div className="min-h-screen bg-amber-50 pb-24">
            {/* Header */}
            <div className="px-6 pt-8 pb-6">
              <div className="flex items-center justify-between">
                <div className="w-14 h-14"></div>
                <h1 className="text-3xl font-bold text-orange-500 uppercase tracking-wide">
                  WHAT'S YOUR GOAL?
                </h1>
                <div className="w-14 h-14"></div>
              </div>
            </div>

            <div className="px-6 space-y-6">
              {/* Intro Card */}
              <div className="bg-orange-400 rounded-3xl p-6 border-4 border-orange-500 text-center">
                <div className="w-16 h-16 bg-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Sparkles className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-2 uppercase tracking-wide">Tell me why you want to learn Hindi</h2>
                <p className="text-white font-medium">Choose your learning motivation</p>
              </div>
              
              <div className="space-y-4">
                {goals.map((goal) => (
                  <button
                    key={goal.id}
                    onClick={() => handleGoalSelect(goal.id)}
                    className={`w-full p-6 rounded-3xl text-left transition-all duration-300 border-4 ${
                      selectedGoal === goal.id 
                        ? 'bg-green-400 border-green-500 text-white scale-[1.02]' 
                        : 'bg-white border-gray-200 hover:border-orange-200 hover:bg-orange-50'
                    }`}
                  >
                    <div className="flex items-center space-x-4">
                      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl ${
                        selectedGoal === goal.id ? 'bg-green-600' : 'bg-gray-100'
                      }`}>
                        {goal.emoji}
                      </div>
                      <div className="flex-1">
                        <div className="font-bold text-lg mb-1 uppercase tracking-wide">{goal.title}</div>
                        <div className={`text-sm ${
                          selectedGoal === goal.id ? 'text-white' : 'text-gray-600'
                        }`}>
                          {goal.desc}
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        );

      case 1:
        return (
          <div className="min-h-screen bg-amber-50 pb-24">
            {/* Header */}
            <div className="px-6 pt-8 pb-6">
              <div className="flex items-center justify-between">
                <Button
                  onClick={prevStep}
                  className="w-14 h-14 bg-orange-500 hover:bg-orange-600 rounded-2xl text-white shadow-lg"
                >
                  <ArrowLeft className="w-6 h-6" />
                </Button>
                <h1 className="text-3xl font-bold text-orange-500 uppercase tracking-wide">
                  CHOOSE STYLE
                </h1>
                <div className="w-14 h-14"></div>
              </div>
            </div>

            <div className="px-6 space-y-6">
              {/* Intro Card */}
              <div className="bg-purple-400 rounded-3xl p-6 border-4 border-purple-500 text-center">
                <div className="w-16 h-16 bg-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Volume2 className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-2 uppercase tracking-wide">Choose Your Teacher Style</h2>
                <p className="text-white font-medium">How should your AI teacher interact with you?</p>
              </div>
              
              <div className="space-y-4">
                {tones.map((tone) => (
                  <button
                    key={tone.id}
                    onClick={() => handleToneSelect(tone.id)}
                    className={`w-full p-6 rounded-3xl text-left transition-all duration-300 border-4 ${
                      selectedTone === tone.id 
                        ? 'bg-green-400 border-green-500 text-white scale-[1.02]' 
                        : 'bg-white border-gray-200 hover:border-purple-200 hover:bg-purple-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl ${
                          selectedTone === tone.id ? 'bg-green-600' : 'bg-gray-100'
                        }`}>
                          {tone.emoji}
                        </div>
                        <div>
                          <div className="font-bold text-lg mb-1 uppercase tracking-wide">{tone.title}</div>
                          <div className={`text-sm ${
                            selectedTone === tone.id ? 'text-white' : 'text-gray-600'
                          }`}>
                            {tone.desc}
                          </div>
                        </div>
                      </div>
                      <Volume2 className={`w-5 h-5 ${
                        selectedTone === tone.id ? 'text-white' : 'text-gray-400'
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
          <div className="min-h-screen bg-amber-50 pb-24">
            {/* Header */}
            <div className="px-6 pt-8 pb-6">
              <div className="flex items-center justify-between">
                <Button
                  onClick={prevStep}
                  className="w-14 h-14 bg-orange-500 hover:bg-orange-600 rounded-2xl text-white shadow-lg"
                >
                  <ArrowLeft className="w-6 h-6" />
                </Button>
                <h1 className="text-3xl font-bold text-orange-500 uppercase tracking-wide">
                  ALL SET!
                </h1>
                <div className="w-14 h-14"></div>
              </div>
            </div>

            <div className="px-6 space-y-6">
              {/* Success Card */}
              <div className="bg-green-400 rounded-3xl p-6 border-4 border-green-500 text-center">
                <DuckMascot className="w-16 h-16 mx-auto mb-4" />
                <h2 className="text-3xl font-bold text-white mb-2 uppercase tracking-wide">You're All Set! 🎉</h2>
                <p className="text-white font-medium">
                  Your AI teacher is ready to help you achieve your goal with a {selectedToneData?.title.toLowerCase()} approach.
                </p>
              </div>
              
              {/* Profile Summary Card */}
              <div className="bg-white rounded-3xl p-6 border-4 border-gray-200">
                <div className="flex items-center justify-center space-x-3 mb-4">
                  <span className="text-2xl">{selectedGoalData?.emoji}</span>
                  <span className="text-2xl">➕</span>
                  <span className="text-2xl">{selectedToneData?.emoji}</span>
                </div>
                <h3 className="text-center font-bold text-gray-800 mb-3 uppercase tracking-wide">Your Learning Profile:</h3>
                <p className="text-center text-gray-800 font-semibold mb-4">{selectedGoalData?.title} + {selectedToneData?.title}</p>
                <div className="bg-orange-50 p-4 rounded-2xl border-2 border-orange-100">
                  <p className="text-sm text-orange-700 mb-2 font-medium">Sample scenario:</p>
                  <p className="font-medium text-orange-800 italic">"Let's plan a movie date... but explain everything in Hindi!"</p>
                </div>
              </div>
              
              {/* Start Button */}
              <Button 
                onClick={nextStep}
                className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-6 text-xl rounded-3xl border-4 border-orange-600 uppercase tracking-wide"
              >
                <Sparkles className="w-6 h-6 mr-3" />
                Start Learning!
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
