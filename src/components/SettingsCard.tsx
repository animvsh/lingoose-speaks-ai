
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
      icon: <User className="w-6 h-6" />, 
      title: "Change Language", 
      subtitle: "Current: English",
      color: "bg-blue-500",
      action: () => console.log("Change language")
    },
    { 
      icon: <User className="w-6 h-6" />, 
      title: "Change Goose Tone", 
      subtitle: `Current: ${userProfile?.persona?.replace('goose_', '').replace('_', ' ') || 'Chaotic'}`,
      color: "bg-purple-500",
      action: () => console.log("Change tone")
    },
    { 
      icon: <Bell className="w-6 h-6" />, 
      title: "Notifications", 
      subtitle: "Daily reminders enabled",
      color: "bg-green-500",
      action: () => console.log("Toggle notifications")
    },
    { 
      icon: <Phone className="w-6 h-6" />, 
      title: "Manage Number", 
      subtitle: userProfile?.phone_number || "+91 98765 43210",
      color: "bg-pink-500",
      action: () => console.log("Manage number")
    },
    { 
      icon: <HelpCircle className="w-6 h-6" />, 
      title: "Help & Support", 
      subtitle: "Get help or report issues",
      color: "bg-orange-500",
      action: () => console.log("Help")
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header */}
      <div className="px-4 pt-6 mb-8">
        <div className="flex items-center justify-between">
          <Button
            onClick={() => onNavigate("home")}
            className="w-14 h-14 bg-orange-500 hover:bg-orange-600 rounded-full text-white shadow-lg transition-all duration-200"
          >
            <ArrowLeft className="w-6 h-6" />
          </Button>
          <h1 className="text-3xl font-black text-orange-500 uppercase tracking-wide">
            SETTINGS
          </h1>
          <div className="w-14 h-14"></div>
        </div>
      </div>

      <div className="px-4 space-y-4">
        {/* User Profile Card */}
        {userProfile && (
          <div className="bg-purple-400 rounded-3xl p-6 shadow-lg">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-purple-600 rounded-2xl flex items-center justify-center shadow-md">
                <User className="w-8 h-8 text-white" />
              </div>
              <div>
                <div className="font-black text-white text-xl uppercase tracking-wide">{userProfile.full_name}</div>
                <div className="text-purple-100 font-semibold text-sm bg-white/20 px-3 py-1 rounded-full mt-1 inline-block">Level: {userProfile.proficiency_level}</div>
                <div className="text-purple-100 font-semibold text-sm bg-white/20 px-3 py-1 rounded-full mt-1 inline-block ml-2">Goal: {userProfile.language_goal}</div>
              </div>
            </div>
          </div>
        )}
        
        {/* Settings Items */}
        <div className="space-y-3">
          {settingsItems.map((item, index) => (
            <div
              key={index}
              className="bg-white rounded-3xl p-6 shadow-lg border border-gray-100 cursor-pointer transition-all duration-200 hover:shadow-xl"
              onClick={item.action}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className={`w-12 h-12 ${item.color} rounded-2xl flex items-center justify-center shadow-md`}>
                    {item.icon}
                  </div>
                  <div>
                    <div className="font-black text-gray-800 text-lg uppercase tracking-wide">{item.title}</div>
                    <div className="text-sm text-gray-600 font-semibold">{item.subtitle}</div>
                  </div>
                </div>
                <ChevronRight className="w-6 h-6 text-gray-400" />
              </div>
            </div>
          ))}
        </div>

        {/* Sign Out Button */}
        <div className="bg-red-500 rounded-3xl p-4 shadow-lg">
          <Button
            onClick={signOut}
            className="w-full bg-transparent hover:bg-red-600/20 text-white font-black py-4 text-lg border-0 uppercase tracking-wide"
          >
            <LogOut className="w-6 h-6 mr-3" />
            SIGN OUT
          </Button>
        </div>

        {/* App Info */}
        <div className="bg-yellow-400 rounded-3xl p-6 shadow-lg text-center">
          <div className="text-sm text-yellow-800 font-bold mb-2 uppercase tracking-wide bg-yellow-200/50 px-3 py-1 rounded-full inline-block">Lingoose v1.0.0</div>
          <p className="text-lg text-yellow-900 font-black">🧡 Made with Love by Chaotic Geese</p>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white px-4 py-4 shadow-lg border-t border-gray-200">
        <div className="max-w-md mx-auto">
          <div className="flex justify-center space-x-4">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => onNavigate("home")}
              className="w-14 h-14 bg-gray-100 hover:bg-gray-200 rounded-2xl text-gray-600 transition-all duration-200 shadow-md"
            >
              <Home className="w-6 h-6" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => onNavigate("activity")}
              className="w-14 h-14 bg-gray-100 hover:bg-gray-200 rounded-2xl text-gray-600 transition-all duration-200 shadow-md"
            >
              <Phone className="w-6 h-6" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => onNavigate("curriculum")}
              className="w-14 h-14 bg-gray-100 hover:bg-gray-200 rounded-2xl text-gray-600 transition-all duration-200 shadow-md"
            >
              <CheckCircle className="w-6 h-6" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => onNavigate("settings")}
              className="w-14 h-14 bg-pink-500 rounded-2xl text-white shadow-md"
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
