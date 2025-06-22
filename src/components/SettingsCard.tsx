
import { Button } from "@/components/ui/button";
import { Home, BarChart3, CheckCircle, Settings, ChevronRight, Bell, Phone, User, HelpCircle, ArrowLeft, LogOut } from "lucide-react";
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
      icon: <User className="w-5 h-5" />, 
      title: "Change Language", 
      subtitle: "Current: English",
      action: () => console.log("Change language")
    },
    { 
      icon: <User className="w-5 h-5" />, 
      title: "Change Goose Tone", 
      subtitle: `Current: ${userProfile?.persona?.replace('goose_', '').replace('_', ' ') || 'Chaotic'}`,
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
      subtitle: userProfile?.phone_number || "+91 98765 43210",
      action: () => console.log("Manage number")
    },
    { 
      icon: <HelpCircle className="w-5 h-5" />, 
      title: "Help & Support", 
      subtitle: "Get help or report issues",
      action: () => console.log("Help")
    },
    { 
      icon: <LogOut className="w-5 h-5" />, 
      title: "Sign Out", 
      subtitle: "Sign out of your account",
      action: signOut
    }
  ];

  return (
    <div className="min-h-screen bg-yellow-100">
      <div className="px-4 pt-6">
        {/* Header with Back Button */}
        <div className="flex items-center justify-between mb-6">
          <Button
            onClick={() => onNavigate("home")}
            className="w-12 h-12 bg-orange-400 hover:bg-orange-500 border-4 border-orange-600 rounded-2xl text-white transition-all duration-200 hover:scale-110 transform hover:-rotate-3"
          >
            <ArrowLeft className="w-6 h-6" />
          </Button>
          <h1 className="text-3xl font-black text-orange-600 uppercase tracking-wider transform -rotate-1">
            Settings
          </h1>
          <div className="w-12 h-12"></div> {/* Spacer */}
        </div>

        {/* User Profile Info */}
        {userProfile && (
          <div className="bg-white border-4 border-slate-400 rounded-2xl p-4 mb-6">
            <div className="flex items-center space-x-3">
              <div className="w-16 h-16 bg-orange-300 border-3 border-orange-600 rounded-xl flex items-center justify-center text-orange-900">
                <User className="w-8 h-8" />
              </div>
              <div>
                <div className="font-black text-slate-800 text-xl uppercase tracking-wide">{userProfile.full_name}</div>
                <div className="text-sm text-slate-600 font-bold">Level: {userProfile.proficiency_level}</div>
                <div className="text-sm text-slate-600 font-bold">Goal: {userProfile.language_goal}</div>
              </div>
            </div>
          </div>
        )}
        
        <div className="space-y-4 mb-8">
          {settingsItems.map((item, index) => (
            <button
              key={index}
              onClick={item.action}
              className="w-full p-4 bg-white border-4 border-slate-400 hover:border-orange-500 rounded-2xl text-left transition-all hover:scale-[1.02] transform hover:rotate-1 duration-200"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-orange-300 border-3 border-orange-600 rounded-xl flex items-center justify-center text-orange-900">
                    {item.icon}
                  </div>
                  <div>
                    <div className="font-black text-slate-800 text-lg uppercase tracking-wide">{item.title}</div>
                    <div className="text-sm text-slate-600 font-bold">{item.subtitle}</div>
                  </div>
                </div>
                <ChevronRight className="w-6 h-6 text-slate-400" />
              </div>
            </button>
          ))}
        </div>

        <div className="bg-purple-300 border-4 border-purple-600 rounded-2xl p-6 text-center transform hover:rotate-1 transition-transform duration-200 mb-8">
          <div className="text-xs text-purple-800 font-bold mb-2 uppercase tracking-wide">Lingoose v1.0.0</div>
          <p className="text-sm text-purple-900 font-black">🧡 Made with Love by Chaotic Geese</p>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="bg-white border-t-4 border-slate-400 px-4 py-4 w-full">
        <div className="max-w-md mx-auto">
          <div className="flex justify-center space-x-6">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => onNavigate("home")}
              className="w-16 h-16 bg-blue-300 hover:bg-blue-400 border-4 border-blue-600 rounded-2xl text-blue-900 transition-all duration-200 hover:scale-110 transform hover:-rotate-3"
            >
              <Home className="w-6 h-6" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => onNavigate("progress")}
              className="w-16 h-16 bg-orange-300 hover:bg-orange-400 border-4 border-orange-600 rounded-2xl text-orange-900 transition-all duration-200 hover:scale-110 transform hover:rotate-3"
            >
              <BarChart3 className="w-6 h-6" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => onNavigate("curriculum")}
              className="w-16 h-16 bg-green-300 hover:bg-green-400 border-4 border-green-600 rounded-2xl text-green-900 transition-all duration-200 hover:scale-110 transform hover:-rotate-3"
            >
              <CheckCircle className="w-6 h-6" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => onNavigate("settings")}
              className="w-16 h-16 bg-purple-400 hover:bg-purple-500 border-4 border-purple-600 rounded-2xl text-white transition-all duration-200 hover:scale-110 transform hover:rotate-3"
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
