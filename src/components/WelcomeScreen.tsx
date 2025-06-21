
import { Button } from "@/components/ui/button";
import DuckMascot from "./DuckMascot";

interface WelcomeScreenProps {
  onComplete: () => void;
}

const WelcomeScreen = ({ onComplete }: WelcomeScreenProps) => {
  return (
    <div className="bg-white p-8 rounded-3xl shadow-lg w-full min-h-full flex flex-col overflow-y-auto">
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center space-y-8">
          <DuckMascot className="mx-auto" />
          
          <div className="space-y-4">
            <h1 className="text-4xl font-bold text-slate-800">
              namaste!
            </h1>
            <p className="text-xl text-slate-600 leading-relaxed">
              i'm your hindi teacher<br />
              (who happens to be a goose)
            </p>
            <p className="text-lg text-slate-500">
              ready to talk?
            </p>
          </div>

          <Button 
            onClick={onComplete}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-6 px-8 rounded-2xl text-xl transition-all duration-200 hover:scale-105"
          >
            start learning
          </Button>

          <div className="text-sm text-slate-400">
            🇮🇳 focused on hindi conversation practice
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomeScreen;
