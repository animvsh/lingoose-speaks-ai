
import { Button } from "@/components/ui/button";
import { Home, CheckCircle, Settings, ChevronRight, Bell, Phone, User, HelpCircle, ArrowLeft } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useUserProfile } from "@/hooks/useUserProfile";

interface SettingsCardProps {
  onNavigate: (view: string) => void;
}

const SettingsCard = ({ onNavigate }: SettingsCardProps) => {
  const { signOut } = useAuth();
  const { data: userProfile } = useUserProfile();

  const settingsItems = [
    { 
      icon: <User className="w-6 h-6 text-white" />, 
      title: "Change Language", 
      subtitle: "Current: English",
      bgColor: "bg-orange-400",
      action: () => console.log("Change language")
    },
    { 
      icon: <User className="w-6 h-6 text-white" />, 
      title: "Change Goose Tone", 
      subtitle: `Current: ${userProfile?.persona?.replace('goose_', '').replace('_', ' ') || 'Chaotic'}`,
      bgColor: "bg-orange-400",
      action: () => console.log("Change tone")
    },
    { 
      icon: <Bell className="w-6 h-6 text-white" />, 
      title: "Notifications", 
      subtitle: "Daily reminders enabled",
      bgColor: "bg-orange-400",
      action: () => console.log("Toggle notifications")
    },
    { 
      icon: <Phone className="w-6 h-6 text-white" />, 
      title: "Manage Number", 
      subtitle: userProfile?.phone_number || "+91 98765 43210",
      bgColor: "bg-orange-400",
      action: () => console.log("Manage number")
    },
    { 
      icon: <HelpCircle className="w-6 h-6 text-white" />, 
      title: "Help & Support", 
      subtitle: "Get help or report issues",
      bgColor: "bg-orange-400",
      action: () => console.log("Help")
    }
  ];

  return (
    <div className="min-h-screen bg-yellow-50 pb-24">
      {/* Header */}
      <div className="px-6 pt-8 pb-6">
        <div className="flex items-center justify-between">
          <Button
            onClick={() => onNavigate("home")}
            className="w-14 h-14 bg-orange-500 hover:bg-orange-600 rounded-2xl text-white shadow-lg"
          >
            <ArrowLeft className="w-6 h-6" />
          </Button>
          <h1 className="text-3xl font-bold text-orange-500 uppercase tracking-wide">
            SETTINGS
          </h1>
          <div className="w-14 h-14"></div>
        </div>
      </div>

      <div className="px-6 space-y-4">
        {/* Settings Items */}
        <div className="space-y-4">
          {settingsItems.map((item, index) => (
            <div
              key={index}
              className="bg-white rounded-3xl p-5 border-4 border-gray-200 cursor-pointer transition-all duration-200"
              onClick={item.action}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className={`w-12 h-12 ${item.bgColor} rounded-2xl flex items-center justify-center`}>
                    {item.icon}
                  </div>
                  <div>
                    <div className="font-bold text-gray-800 text-lg uppercase tracking-wide">{item.title}</div>
                    <div className="text-sm text-gray-600 font-medium">{item.subtitle}</div>
                  </div>
                </div>
                <ChevronRight className="w-6 h-6 text-gray-400" />
              </div>
            </div>
          ))}
        </div>

        {/* App Info */}
        <div className="bg-purple-400 rounded-3xl p-6 border-4 border-purple-500 text-center">
          <div className="text-white font-bold mb-2 uppercase tracking-wide">Lingoose v1.0.0</div>
          <p className="text-white font-medium">🧡 Made with Love by Chaotic Geese</p>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white px-6 py-4 border-t border-gray-100">
        <div className="max-w-md mx-auto">
          <div className="flex justify-center space-x-4">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => onNavigate("home")}
              className="w-14 h-14 bg-blue-400 rounded-2xl text-white"
            >
              <Home className="w-6 h-6" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => onNavigate("activity")}
              className="w-14 h-14 bg-orange-400 rounded-2xl text-white"
            >
              <Phone className="w-6 h-6" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => onNavigate("curriculum")}
              className="w-14 h-14 bg-green-400 rounded-2xl text-white"
            >
              <CheckCircle className="w-6 h-6" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => onNavigate("settings")}
              className="w-14 h-14 bg-purple-400 rounded-2xl text-white"
            >
              <Settings className="w-6 h-6" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsCard;
