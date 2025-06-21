
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronRight, ChevronLeft, Volume2 } from "lucide-react";
import DuckMascot from "./DuckMascot";

interface OnboardingFlowProps {
  onComplete: () => void;
}

const OnboardingFlow = ({ onComplete }: OnboardingFlowProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedLanguage, setSelectedLanguage] = useState("");
  const [selectedGoal, setSelectedGoal] = useState("");
  const [selectedTone, setSelectedTone] = useState("");

  const languages = [
    { code: "fr", name: "French", emoji: "🇫🇷", comment: "Oui oui baguette!" },
    { code: "es", name: "Spanish", emoji: "🇪🇸", comment: "¡Hola amigo!" },
    { code: "de", name: "German", emoji: "🇩🇪", comment: "Guten Tag!" },
    { code: "it", name: "Italian", emoji: "🇮🇹", comment: "Ciao bella!" },
    { code: "pt", name: "Portuguese", emoji: "🇵🇹", comment: "Olá!" }
  ];

  const goals = [
    { id: "light", title: "Light & Breezy", desc: "5 min calls, 3x/week", emoji: "🌸" },
    { id: "medium", title: "Steady Progress", desc: "10 min calls, daily", emoji: "🚀" },
    { id: "intense", title: "Goose Mode", desc: "15 min calls, daily + extras", emoji: "🔥" }
  ];

  const tones = [
    { id: "chaotic", title: "Chaotic", desc: "Unpredictable & wild", emoji: "🌪️" },
    { id: "flirty", title: "Flirty", desc: "Smooth & charming", emoji: "😘" },
    { id: "calm", title: "Calm", desc: "Zen & peaceful", emoji: "🧘" },
    { id: "strict", title: "Strict", desc: "No nonsense teacher", emoji: "👩‍🏫" },
    { id: "grandma", title: "Soft Grandma", desc: "Sweet & encouraging", emoji: "👵" },
    { id: "sadboi", title: "Sadboi", desc: "Melancholic but wise", emoji: "😔" }
  ];

  const nextStep = () => {
    if (currentStep < 4) {
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
          <div className="text-center space-y-6">
            <DuckMascot className="mx-auto" />
            <div>
              <h1 className="text-4xl font-bold text-slate-800 mb-4">Welcome!</h1>
              <p className="text-xl text-slate-600">Ready to get fluent the goose way?</p>
            </div>
            <Button 
              onClick={nextStep}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 px-6 rounded-2xl text-xl"
            >
              Let's Goose! <ChevronRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        );

      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-slate-800 mb-2">Choose Your Language</h2>
              <p className="text-slate-600">Which language are we goosin' today?</p>
            </div>
            
            <div className="space-y-3">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => setSelectedLanguage(lang.code)}
                  className={`w-full p-4 rounded-2xl text-left transition-all ${
                    selectedLanguage === lang.code 
                      ? 'bg-orange-500 text-white' 
                      : 'bg-white border-2 border-slate-200 hover:border-orange-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">{lang.emoji}</span>
                      <span className="font-semibold">{lang.name}</span>
                    </div>
                    <span className="text-sm opacity-80">{lang.comment}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-slate-800 mb-2">Set Your Goal</h2>
              <p className="text-slate-600">How intense should we get?</p>
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

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-slate-800 mb-2">Choose Your Goose's Tone</h2>
              <p className="text-slate-600">How should I talk to you?</p>
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

      case 4:
        return (
          <div className="text-center space-y-6">
            <DuckMascot className="mx-auto" />
            <div>
              <h2 className="text-3xl font-bold text-slate-800 mb-4">All Set!</h2>
              <p className="text-slate-600 mb-4">
                I'll call you for quick {selectedLanguage.toUpperCase()} practice sessions with a {selectedTone} vibe.
              </p>
              <div className="bg-orange-50 p-4 rounded-2xl text-left">
                <p className="text-sm text-slate-600 mb-2">Sample scenario:</p>
                <p className="font-medium text-slate-800">"Let's plan a robbery in Rome... but in Italian!"</p>
              </div>
            </div>
            <Button 
              onClick={nextStep}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 px-6 rounded-2xl text-xl"
            >
              Start Learning!
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
      
      {currentStep > 0 && currentStep < 4 && (
        <div className="flex justify-between items-center pt-4 border-t border-slate-100">
          <Button 
            variant="ghost"
            onClick={prevStep}
            className="text-slate-400 hover:text-slate-600"
          >
            <ChevronLeft className="w-4 h-4 mr-1" /> Back
          </Button>
          
          <div className="flex space-x-2">
            {[0, 1, 2, 3, 4].map((step) => (
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
              (currentStep === 1 && !selectedLanguage) ||
              (currentStep === 2 && !selectedGoal) ||
              (currentStep === 3 && !selectedTone)
            }
            className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-xl disabled:opacity-50"
          >
            Next <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
      )}
    </div>
  );
};

export default OnboardingFlow;
