
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronRight, ChevronLeft, Volume2 } from "lucide-react";
import DuckMascot from "./DuckMascot";

interface OnboardingFlowProps {
  onComplete: () => void;
}

const OnboardingFlow = ({ onComplete }: OnboardingFlowProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedGoal, setSelectedGoal] = useState("");
  const [selectedTone, setSelectedTone] = useState("");

  const goals = [
    { id: "bollywood", title: "i wanna understand bollywood", desc: "movies, songs, and drama", emoji: "🎬" },
    { id: "family", title: "i want to talk to my nani", desc: "family conversations", emoji: "👵" },
    { id: "travel", title: "i'm planning to visit india", desc: "practical travel phrases", emoji: "✈️" },
    { id: "culture", title: "i love indian culture", desc: "festivals, food, traditions", emoji: "🕉️" },
    { id: "business", title: "i work with indian colleagues", desc: "professional conversations", emoji: "💼" }
  ];

  const tones = [
    { id: "chaotic", title: "अराजक", desc: "अप्रत्याशित और जंगली", emoji: "🌪️" },
    { id: "flirty", title: "फ्लर्टी", desc: "चिकना और आकर्षक", emoji: "😘" },
    { id: "calm", title: "शांत", desc: "ज़ेन और शांतिपूर्ण", emoji: "🧘" },
    { id: "strict", title: "सख्त", desc: "बकवास नहीं शिक्षक", emoji: "👩‍🏫" },
    { id: "grandma", title: "नरम दादी", desc: "मधुर और प्रोत्साहनकारी", emoji: "👵" },
    { id: "sadboi", title: "उदास लड़का", desc: "उदासीन लेकिन बुद्धिमान", emoji: "😔" }
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
    // Automatically move to next step after selection
    setTimeout(() => {
      setCurrentStep(1);
    }, 300);
  };

  const handleToneSelect = (toneId: string) => {
    setSelectedTone(toneId);
    // Automatically move to next step after selection
    setTimeout(() => {
      setCurrentStep(2);
    }, 300);
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-800 mb-2">what's your goal?</h2>
              <p className="text-slate-600">tell me why you want to learn hindi</p>
            </div>
            
            <div className="space-y-3">
              {goals.map((goal) => (
                <button
                  key={goal.id}
                  onClick={() => handleGoalSelect(goal.id)}
                  className={`w-full p-4 rounded-2xl text-left transition-all duration-300 hover:scale-[1.02] ${
                    selectedGoal === goal.id 
                      ? 'bg-orange-500 text-white shadow-lg' 
                      : 'bg-white border-2 border-slate-200 hover:border-orange-300 hover:shadow-md'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{goal.emoji}</span>
                    <div>
                      <div className="font-semibold">{goal.title}</div>
                      <div className="text-sm opacity-80">{goal.desc}</div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        );

      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-800 mb-2">choose your goose vibe</h2>
              <p className="text-slate-600">how should i talk to you?</p>
            </div>
            
            <div className="space-y-3">
              {tones.map((tone) => (
                <button
                  key={tone.id}
                  onClick={() => handleToneSelect(tone.id)}
                  className={`w-full p-4 rounded-2xl text-left transition-all duration-300 hover:scale-[1.02] ${
                    selectedTone === tone.id 
                      ? 'bg-orange-500 text-white shadow-lg' 
                      : 'bg-white border-2 border-slate-200 hover:border-orange-300 hover:shadow-md'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">{tone.emoji}</span>
                      <div>
                        <div className="font-semibold">{tone.title}</div>
                        <div className="text-sm opacity-80">{tone.desc}</div>
                      </div>
                    </div>
                    <Volume2 className="w-4 h-4 opacity-60" />
                  </div>
                </button>
              ))}
            </div>
          </div>
        );

      case 2:
        return (
          <div className="text-center space-y-6">
            <DuckMascot className="mx-auto" />
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-800 mb-4">सभी तैयार!</h2>
              <p className="text-slate-600 mb-4">
                i'll call you for hindi practice sessions with a {selectedTone} vibe.
              </p>
              <div className="bg-orange-50 p-4 rounded-2xl text-left">
                <p className="text-sm text-slate-600 mb-2">sample scenario:</p>
                <p className="font-medium text-slate-800">"let's plan a heist in rome... but in hindi!"</p>
              </div>
            </div>
            <Button 
              onClick={nextStep}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 px-6 rounded-2xl text-xl transition-all duration-300 hover:scale-[1.02] hover:shadow-lg"
            >
              start learning!
            </Button>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-md mx-auto p-4 sm:p-6">
        <div className="py-8">
          {renderStep()}
        </div>
        
        {/* Navigation for all steps except the final one */}
        {currentStep < 2 && (
          <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-100 px-4 py-4 safe-area-bottom">
            <div className="max-w-md mx-auto">
              <div className="flex justify-between items-center">
                <Button 
                  variant="ghost"
                  onClick={prevStep}
                  disabled={currentStep === 0}
                  className="text-slate-400 hover:text-slate-600 transition-all duration-200 hover:scale-105 disabled:opacity-30"
                >
                  <ChevronLeft className="w-4 h-4 mr-1" /> back
                </Button>
                
                <div className="flex space-x-2">
                  {[0, 1, 2].map((step) => (
                    <div
                      key={step}
                      className={`w-2 h-2 rounded-full transition-all duration-300 ${
                        step <= currentStep ? 'bg-orange-500' : 'bg-slate-200'
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
                  className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-xl disabled:opacity-50 transition-all duration-200 hover:scale-105"
                >
                  next <ChevronRight className="w-4 h-4 ml-1" />
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
