
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronRight, ChevronLeft, Volume2, Sparkles } from "lucide-react";
import DuckMascot from "./DuckMascot";

interface OnboardingFlowProps {
  onComplete: () => void;
}

const OnboardingFlow = ({ onComplete }: OnboardingFlowProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedGoal, setSelectedGoal] = useState("");
  const [selectedTone, setSelectedTone] = useState("");

  const goals = [
    { id: "bollywood", title: "Understand Bollywood", desc: "Movies, songs, and drama", emoji: "🎬", gradient: "from-pink-500 to-rose-500" },
    { id: "family", title: "Talk to My Family", desc: "Connect with loved ones", emoji: "👵", gradient: "from-orange-500 to-amber-500" },
    { id: "travel", title: "Travel to India", desc: "Navigate like a local", emoji: "✈️", gradient: "from-blue-500 to-cyan-500" },
    { id: "culture", title: "Explore Indian Culture", desc: "Festivals, food, traditions", emoji: "🕉️", gradient: "from-purple-500 to-indigo-500" },
    { id: "business", title: "Work with Colleagues", desc: "Professional conversations", emoji: "💼", gradient: "from-green-500 to-emerald-500" }
  ];

  const tones = [
    { id: "chaotic", title: "Chaotic Teacher", desc: "Unpredictable and wild", emoji: "🌪️", gradient: "from-red-500 to-pink-500" },
    { id: "flirty", title: "Flirty Instructor", desc: "Smooth and charming", emoji: "😘", gradient: "from-rose-500 to-pink-500" },
    { id: "calm", title: "Zen Master", desc: "Peaceful and mindful", emoji: "🧘", gradient: "from-green-500 to-teal-500" },
    { id: "strict", title: "Strict Teacher", desc: "No-nonsense educator", emoji: "👩‍🏫", gradient: "from-slate-600 to-slate-700" },
    { id: "grandma", title: "Sweet Grandma", desc: "Caring and encouraging", emoji: "👵", gradient: "from-amber-500 to-orange-500" },
    { id: "sadboi", title: "Melancholy Poet", desc: "Deep and philosophical", emoji: "😔", gradient: "from-indigo-500 to-purple-500" }
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
          <div className="space-y-8">
            <div className="text-center space-y-4">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-orange-400 to-pink-500 rounded-2xl mb-4">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold text-slate-800 mb-2">What's Your Goal?</h2>
              <p className="text-lg text-slate-600">Tell me why you want to learn Hindi</p>
            </div>
            
            <div className="space-y-4">
              {goals.map((goal) => (
                <button
                  key={goal.id}
                  onClick={() => handleGoalSelect(goal.id)}
                  className={`group w-full p-6 rounded-3xl text-left transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl ${
                    selectedGoal === goal.id 
                      ? `bg-gradient-to-r ${goal.gradient} text-white shadow-2xl scale-[1.02]` 
                      : 'bg-white border-2 border-slate-100 hover:border-orange-200 shadow-lg hover:shadow-xl'
                  }`}
                >
                  <div className="flex items-center space-x-4">
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl transition-all duration-300 ${
                      selectedGoal === goal.id ? 'bg-white/20' : 'bg-slate-50 group-hover:bg-orange-50'
                    }`}>
                      {goal.emoji}
                    </div>
                    <div className="flex-1">
                      <div className="font-bold text-lg mb-1">{goal.title}</div>
                      <div className={`text-sm transition-colors ${
                        selectedGoal === goal.id ? 'text-white/90' : 'text-slate-500 group-hover:text-slate-600'
                      }`}>
                        {goal.desc}
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        );

      case 1:
        return (
          <div className="space-y-8">
            <div className="text-center space-y-4">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-400 to-indigo-500 rounded-2xl mb-4">
                <Volume2 className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold text-slate-800 mb-2">Choose Your Teacher Style</h2>
              <p className="text-lg text-slate-600">How should your AI teacher interact with you?</p>
            </div>
            
            <div className="space-y-4">
              {tones.map((tone) => (
                <button
                  key={tone.id}
                  onClick={() => handleToneSelect(tone.id)}
                  className={`group w-full p-6 rounded-3xl text-left transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl ${
                    selectedTone === tone.id 
                      ? `bg-gradient-to-r ${tone.gradient} text-white shadow-2xl scale-[1.02]` 
                      : 'bg-white border-2 border-slate-100 hover:border-purple-200 shadow-lg hover:shadow-xl'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl transition-all duration-300 ${
                        selectedTone === tone.id ? 'bg-white/20' : 'bg-slate-50 group-hover:bg-purple-50'
                      }`}>
                        {tone.emoji}
                      </div>
                      <div>
                        <div className="font-bold text-lg mb-1">{tone.title}</div>
                        <div className={`text-sm transition-colors ${
                          selectedTone === tone.id ? 'text-white/90' : 'text-slate-500 group-hover:text-slate-600'
                        }`}>
                          {tone.desc}
                        </div>
                      </div>
                    </div>
                    <Volume2 className={`w-5 h-5 transition-colors ${
                      selectedTone === tone.id ? 'text-white/70' : 'text-slate-400'
                    }`} />
                  </div>
                </button>
              ))}
            </div>
          </div>
        );

      case 2:
        const selectedGoalData = goals.find(g => g.id === selectedGoal);
        const selectedToneData = tones.find(t => t.id === selectedTone);
        
        return (
          <div className="text-center space-y-8">
            <div className="relative">
              <DuckMascot className="mx-auto mb-6" />
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
            </div>
            
            <div className="space-y-6">
              <h2 className="text-3xl sm:text-4xl font-bold text-slate-800 mb-4">You're All Set! 🎉</h2>
              <p className="text-lg text-slate-600 mb-6">
                Your AI teacher is ready to help you achieve your goal with a {selectedToneData?.title.toLowerCase()} approach.
              </p>
              
              <div className="bg-gradient-to-br from-orange-50 to-pink-50 p-6 rounded-3xl border border-orange-100">
                <div className="flex items-center justify-center space-x-3 mb-4">
                  <span className="text-2xl">{selectedGoalData?.emoji}</span>
                  <span className="text-2xl">➕</span>
                  <span className="text-2xl">{selectedToneData?.emoji}</span>
                </div>
                <p className="text-sm text-slate-600 mb-3 font-medium">Your Learning Profile:</p>
                <p className="text-slate-800 font-semibold mb-2">{selectedGoalData?.title} + {selectedToneData?.title}</p>
                <div className="bg-white/80 backdrop-blur-sm p-4 rounded-2xl">
                  <p className="text-sm text-slate-600 mb-2">Sample scenario:</p>
                  <p className="font-medium text-slate-800 italic">"Let's plan a movie date... but explain everything in Hindi!"</p>
                </div>
              </div>
            </div>
            
            <Button 
              onClick={nextStep}
              className="w-full bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white font-bold py-6 px-8 rounded-3xl text-xl transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl transform"
            >
              <Sparkles className="w-6 h-6 mr-3" />
              Start Learning!
            </Button>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-pink-50">
      <div className="max-w-md mx-auto p-6">
        <div className="py-8">
          {renderStep()}
        </div>
        
        {currentStep < 2 && (
          <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-lg border-t border-slate-100 px-6 py-4 safe-area-bottom">
            <div className="max-w-md mx-auto">
              <div className="flex justify-between items-center">
                <Button 
                  variant="ghost"
                  onClick={prevStep}
                  disabled={currentStep === 0}
                  className="text-slate-400 hover:text-slate-600 transition-all duration-300 hover:scale-105 disabled:opacity-30 rounded-2xl px-4 py-2"
                >
                  <ChevronLeft className="w-4 h-4 mr-1" /> Back
                </Button>
                
                <div className="flex space-x-3">
                  {[0, 1, 2].map((step) => (
                    <div
                      key={step}
                      className={`w-3 h-3 rounded-full transition-all duration-500 ${
                        step <= currentStep 
                          ? 'bg-gradient-to-r from-orange-500 to-pink-500 scale-110' 
                          : 'bg-slate-200'
                      }`}
                    />
                  ))}
                </div>
                
                <Button 
                  onClick={nextStep}
                  disabled={
                    (currentStep === 0 && !selectedGoal) ||
                    (currentStep === 1 && !selectedTone)
                  }
                  className="bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white px-6 py-2 rounded-2xl disabled:opacity-50 transition-all duration-300 hover:scale-105 font-semibold"
                >
                  Next <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OnboardingFlow;
