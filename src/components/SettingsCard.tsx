
import { Button } from "@/components/ui/button";
import { Home, BarChart3, CheckCircle, Settings, ChevronRight, Bell, Phone, User, HelpCircle } from "lucide-react";

interface SettingsCardProps {
  onNavigate: (view: string) => void;
}

const SettingsCard = ({ onNavigate }: SettingsCardProps) => {
  const settingsItems = [
    { 
      icon: <User className="w-5 h-5" />, 
      title: "Change Language", 
      subtitle: "Currently: French",
      action: () => console.log("Change language")
    },
    { 
      icon: <User className="w-5 h-5" />, 
      title: "Change Goose Tone", 
      subtitle: "Currently: Chaotic",
      action: () => console.log("Change tone")
    },
    { 
      icon: <Bell className="w-5 h-5" />, 
      title: "Notifications", 
      subtitle: "Daily reminders enabled",
      action: () => console.log("Toggle notifications")
    },
    { 
      icon: <Phone className="w-5 h-5" />, 
      title: "Manage Number", 
      subtitle: "+1 (555) 123-4567",
      action: () => console.log("Manage number")
    },
    { 
      icon: <HelpCircle className="w-5 h-5" />, 
      title: "Help & Support", 
      subtitle: "Get help or report issues",
      action: () => console.log("Help")
    }
  ];

  return (
    <div className="bg-white p-8 rounded-3xl shadow-lg w-full h-full flex flex-col">
      <div className="text-center space-y-6 flex-1">
        <h1 className="text-4xl font-bold text-slate-800">Settings</h1>
        
        <div className="space-y-3">
          {settingsItems.map((item, index) => (
            <button
              key={index}
              onClick={item.action}
              className="w-full p-4 bg-white border-2 border-slate-200 hover:border-orange-300 rounded-2xl text-left transition-all hover:scale-[1.02]"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center text-orange-500">
                    {item.icon}
                  </div>
                  <div>
                    <div className="font-semibold text-slate-800">{item.title}</div>
                    <div className="text-sm text-slate-500">{item.subtitle}</div>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-slate-400" />
              </div>
            </button>
          ))}
        </div>

        <div className="pt-6">
          <div className="text-xs text-slate-400 mb-2">Lingoose v1.0.0</div>
          <p className="text-sm text-slate-500">Made with 🧡 by chaotic geese</p>
        </div>
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
          className="w-12 h-12 bg-orange-500 hover:bg-orange-600 rounded-xl text-white"
        >
          <Settings className="w-5 h-5" />
        </Button>
      </div>
    </div>
  );
};

export default SettingsCard;
