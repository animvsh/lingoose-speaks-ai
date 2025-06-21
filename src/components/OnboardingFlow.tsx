
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
    { code: "hi", name: "हिंदी", emoji: "🇮🇳", comment: "नमस्ते!" },
    { code: "fr", name: "French", emoji: "🇫🇷", comment: "Oui oui baguette!" },
    { code: "es", name: "Spanish", emoji: "🇪🇸", comment: "¡Hola amigo!" },
    { code: "de", name: "German", emoji: "🇩🇪", comment: "Guten Tag!" },
    { code: "it", name: "Italian", emoji: "🇮🇹", comment: "Ciao bella!" }
  ];

  const goals = [
    { id: "light", title: "हल्का और आसान", desc: "5 मिनट कॉल, 3 बार/सप्ताह", emoji: "🌸" },
    { id: "medium", title: "स्थिर प्रगति", desc: "10 मिनट कॉल, रोज़ाना", emoji: "🚀" },
    { id: "intense", title: "गूज़ मोड", desc: "15 मिनट कॉल, रोज़ाना + अतिरिक्त", emoji: "🔥" }
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
              <h1 className="text-4xl font-bold text-slate-800 mb-4">आपका स्वागत है!</h1>
              <p className="text-xl text-slate-600">गूज़ तरीके से धाराप्रवाह बनने के लिए तैयार हैं?</p>
            </div>
            <Button 
              onClick={nextStep}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 px-6 rounded-2xl text-xl"
            >
              चलो गूज़ करते हैं! <ChevronRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        );

      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-slate-800 mb-2">अपनी भाषा चुनें</h2>
              <p className="text-slate-600">आज हम कौन सी भाषा में गूज़िंग कर रहे हैं?</p>
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
              <h2 className="text-3xl font-bold text-slate-800 mb-2">अपना लक्ष्य निर्धारित करें</h2>
              <p className="text-slate-600">हमें कितनी तीव्रता से करना चाहिए?</p>
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
              <h2 className="text-3xl font-bold text-slate-800 mb-2">अपने गूज़ का टोन चुनें</h2>
              <p className="text-slate-600">मुझे आपसे कैसे बात करनी चाहिए?</p>
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
              <h2 className="text-3xl font-bold text-slate-800 mb-4">सभी तैयार!</h2>
              <p className="text-slate-600 mb-4">
                मैं आपको {selectedLanguage === "hi" ? "हिंदी" : selectedLanguage.toUpperCase()} अभ्यास सत्रों के लिए {selectedTone} वाइब के साथ कॉल करूंगा।
              </p>
              <div className="bg-orange-50 p-4 rounded-2xl text-left">
                <p className="text-sm text-slate-600 mb-2">नमूना परिदृश्य:</p>
                <p className="font-medium text-slate-800">"आइए रोम में डकैती की योजना बनाते हैं... लेकिन हिंदी में!"</p>
              </div>
            </div>
            <Button 
              onClick={nextStep}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 px-6 rounded-2xl text-xl"
            >
              सीखना शुरू करें!
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
            <ChevronLeft className="w-4 h-4 mr-1" /> वापस
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
            आगे <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
      )}
    </div>
  );
};

export default OnboardingFlow;
