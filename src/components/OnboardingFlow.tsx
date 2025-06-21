
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

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-slate-800 mb-2">what's your goal?</h2>
              <p className="text-slate-600">tell me why you want to learn hindi</p>
            </div>
            
            <div className="space-y-3">
              {goals.map((goal) => (
                <button
                  key={goal.id}
                  onClick={() => setSelectedGoal(goal.id)}
                  className={`w-full p-4 rounded-2xl text-left transition-all ${
                    selectedGoal === goal.id 
                      ? 'bg-orange-500 text-white' 
                      : 'bg-white border-2 border-slate-200 hover:border-orange-300'
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
              <h2 className="text-3xl font-bold text-slate-800 mb-2">choose your goose vibe</h2>
              <p className="text-slate-600">how should i talk to you?</p>
            </div>
            
            <div className="space-y-3">
              {tones.map((tone) => (
                <button
                  key={tone.id}
                  onClick={() => setSelectedTone(tone.id)}
                  className={`w-full p-4 rounded-2xl text-left transition-all ${
                    selectedTone === tone.id 
                      ? 'bg-orange-500 text-white' 
                      : 'bg-white border-2 border-slate-200 hover:border-orange-300'
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
              <h2 className="text-3xl font-bold text-slate-800 mb-4">सभी तैयार!</h2>
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
              className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 px-6 rounded-2xl text-xl"
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
    <div className="bg-white p-8 rounded-3xl shadow-lg w-full h-full flex flex-col">
      <div className="flex-1 flex items-center justify-center">
        <div className="w-full max-w-sm">
          {renderStep()}
        </div>
      </div>
      
      {currentStep > 0 && currentStep < 2 && (
        <div className="flex justify-between items-center pt-4 border-t border-slate-100">
          <Button 
            variant="ghost"
            onClick={prevStep}
            className="text-slate-400 hover:text-slate-600"
          >
            <ChevronLeft className="w-4 h-4 mr-1" /> back
          </Button>
          
          <div className="flex space-x-2">
            {[0, 1, 2].map((step) => (
              <div
                key={step}
                className={`w-2 h-2 rounded-full ${
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
            className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-xl disabled:opacity-50"
          >
            next <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
      )}
    </div>
  );
};

export default OnboardingFlow;
