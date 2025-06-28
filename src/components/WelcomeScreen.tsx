
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

interface WelcomeScreenProps {
  onComplete: () => void;
}

const WelcomeScreen = ({ onComplete }: WelcomeScreenProps) => {
  const handleStartAdventure = () => {
    console.log('Start Hindi adventure clicked');
    onComplete();
  };

  return (
    <div className="min-h-screen bg-amber-50 flex flex-col items-center justify-center p-6">
      <div className="text-center max-w-md">
        <div className="w-32 h-32 bg-orange-400 rounded-full flex items-center justify-center mx-auto mb-8 shadow-xl">
          <div className="text-6xl">🦆</div>
        </div>
        
        <h1 className="text-4xl font-bold text-orange-600 mb-4 uppercase tracking-wide">
          WELCOME
        </h1>
        
        <p className="text-xl text-gray-700 mb-8 font-medium">
          Ready to start your language learning journey?
        </p>
        
        <Button
          onClick={handleStartAdventure}
          className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 text-lg rounded-3xl transition-all duration-300 shadow-lg"
        >
          Start my Hindi adventure
          <ArrowRight className="w-6 h-6 ml-2" />
        </Button>
      </div>
    </div>
  );
};

export default WelcomeScreen;
