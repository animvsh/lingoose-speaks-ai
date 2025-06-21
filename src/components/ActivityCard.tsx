
import { Button } from "@/components/ui/button";
import { Phone, Home, Clock, CheckCircle, BarChart3, Settings } from "lucide-react";
import DuckMascot from "./DuckMascot";

interface ActivityCardProps {
  onNavigate: (view: string) => void;
}

const ActivityCard = ({ onNavigate }: ActivityCardProps) => {
  const handleStartCall = () => {
    // Simulate starting a call
    setTimeout(() => onNavigate("progress"), 2000);
  };

  return (
    <div className="bg-white p-8 rounded-3xl shadow-lg w-full h-full flex flex-col">
      <div className="text-center space-y-6 flex-1">
        <div className="bg-orange-500 text-white px-6 py-3 rounded-2xl">
          <h2 className="text-2xl font-bold">आज की गतिविधि</h2>
        </div>

        <div className="flex justify-center space-x-4 my-6">
          <div className="w-12 h-12 bg-amber-800 rounded-full flex items-center justify-center">
            <div className="w-8 h-8 bg-amber-600 rounded-full"></div>
          </div>
          <div className="w-12 h-12 bg-orange-400 rounded-full flex items-center justify-center">
            <div className="w-8 h-8 bg-orange-300 rounded-full"></div>
          </div>
        </div>

        <div className="space-y-4 text-left">
          <div className="bg-orange-50 p-4 rounded-2xl">
            <p className="text-slate-700 font-medium mb-2">परिदृश्य: फिल्म डेट गलत हो गई</p>
            <p className="text-slate-600 text-sm">
              मैं अजीब तरीके से आपको फिल्म के लिए आमंत्रित करने का नाटक करूंगा। हम आकस्मिक बातचीत और रिफ्लेक्सिव क्रियाओं का अभ्यास करेंगे।
            </p>
          </div>
          
          <div className="bg-slate-50 p-4 rounded-2xl">
            <p className="text-slate-600 text-sm">
              <strong>फोकस:</strong> रिफ्लेक्सिव क्रियाएं • आकस्मिक टोन • अस्वीकृति वाक्य
            </p>
          </div>
        </div>

        <Button 
          onClick={handleStartCall}
          className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-6 px-6 rounded-2xl text-xl transition-all duration-200 hover:scale-105"
        >
          <Phone className="w-6 h-6 mr-3" />
          कॉल शुरू करें
        </Button>

        <p className="text-xs text-slate-400">आपको ~30 सेकंड में कॉल आएगी</p>
      </div>

      <div className="flex justify-center space-x-8 pt-4 border-t border-slate-100">
        <Button 
          variant="ghost" 
          size="sm"
          onClick={() => onNavigate("home")}
          className="w-12 h-12 rounded-xl text-slate-400 hover:bg-slate-100"
        >
          <Home className="w-5 h-5" />
        </Button>
        <Button 
          variant="ghost" 
          size="sm"
          onClick={() => onNavigate("progress")}
          className="w-12 h-12 rounded-xl text-slate-400 hover:bg-slate-100"
        >
          <BarChart3 className="w-5 h-5" />
        </Button>
        <Button 
          variant="ghost" 
          size="sm"
          onClick={() => onNavigate("curriculum")}
          className="w-12 h-12 rounded-xl text-slate-400 hover:bg-slate-100"
        >
          <CheckCircle className="w-5 h-5" />
        </Button>
        <Button 
          variant="ghost" 
          size="sm"
          onClick={() => onNavigate("settings")}
          className="w-12 h-12 rounded-xl text-slate-400 hover:bg-slate-100"
        >
          <Settings className="w-5 h-5" />
        </Button>
      </div>
    </div>
  );
};

export default ActivityCard;
