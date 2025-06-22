
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
      icon: <User className="w-7 h-7" />, 
      title: "Change Language", 
      subtitle: "Current: English",
      color: "from-blue-400 to-blue-500",
      borderColor: "border-blue-600",
      iconBg: "bg-blue-600",
      action: () => console.log("Change language")
    },
    { 
      icon: <User className="w-7 h-7" />, 
      title: "Change Goose Tone", 
      subtitle: `Current: ${userProfile?.persona?.replace('goose_', '').replace('_', ' ') || 'Chaotic'}`,
      color: "from-purple-400 to-purple-500",
      borderColor: "border-purple-600",
      iconBg: "bg-purple-600",
      action: () => console.log("Change tone")
    },
    { 
      icon: <Bell className="w-7 h-7" />, 
      title: "Notifications", 
      subtitle: "Daily reminders enabled",
      color: "from-green-400 to-green-500",
      borderColor: "border-green-600",
      iconBg: "bg-green-600",
      action: () => console.log("Toggle notifications")
    },
    { 
      icon: <Phone className="w-7 h-7" />, 
      title: "Manage Number", 
      subtitle: userProfile?.phone_number || "+91 98765 43210",
      color: "from-pink-400 to-pink-500",
      borderColor: "border-pink-600",
      iconBg: "bg-pink-600",
      action: () => console.log("Manage number")
    },
    { 
      icon: <HelpCircle className="w-7 h-7" />, 
      title: "Help & Support", 
      subtitle: "Get help or report issues",
      color: "from-orange-400 to-orange-500",
      borderColor: "border-orange-600",
      iconBg: "bg-orange-600",
      action: () => console.log("Help")
    }
  ];

  return (
    <div className="min-h-screen bg-[#F5F2E8] pb-24">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-400 to-orange-500 rounded-b-[2.5rem] px-6 py-8 mb-6 shadow-xl border-b-8 border-orange-600">
        <div className="flex items-center justify-between">
          <Button
            onClick={() => onNavigate("home")}
            className="w-14 h-14 bg-orange-500 hover:bg-orange-600 border-4 border-orange-600 rounded-3xl text-white transition-all duration-200 hover:scale-110 transform hover:-rotate-3 shadow-lg"
          >
            <ArrowLeft className="w-7 h-7" />
          </Button>
          <h1 className="text-4xl font-black text-white uppercase tracking-wider drop-shadow-lg">
            SETTINGS
          </h1>
          <div className="w-14 h-14"></div>
        </div>
      </div>

      <div className="px-6 space-y-6">
        {/* User Profile Card */}
        {userProfile && (
          <div className="bg-gradient-to-r from-purple-300 to-purple-400 rounded-[2rem] p-6 border-4 border-purple-500 transform hover:rotate-1 transition-transform shadow-xl hover:shadow-purple-300/50">
            <div className="flex items-center space-x-4">
              <div className="w-20 h-20 bg-purple-600 rounded-2xl flex items-center justify-center border-4 border-purple-700 shadow-lg">
                <User className="w-10 h-10 text-white" />
              </div>
              <div>
                <div className="font-black text-purple-800 text-3xl uppercase tracking-wide drop-shadow-sm">{userProfile.full_name}</div>
                <div className="text-purple-700 font-bold text-lg bg-purple-200/50 px-3 py-1 rounded-full mt-1 inline-block">Level: {userProfile.proficiency_level}</div>
                <div className="text-purple-700 font-bold text-lg bg-purple-200/50 px-3 py-1 rounded-full mt-1 inline-block ml-2">Goal: {userProfile.language_goal}</div>
              </div>
            </div>
          </div>
        )}
        
        {/* Settings Items */}
        <div className="space-y-4">
          {settingsItems.map((item, index) => (
            <div
              key={index}
              className={`bg-gradient-to-r ${item.color} rounded-[2rem] p-6 border-4 ${item.borderColor} transform hover:scale-[1.02] transition-transform cursor-pointer shadow-xl`}
              onClick={item.action}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className={`w-16 h-16 ${item.iconBg} rounded-2xl flex items-center justify-center border-3 border-black/20 shadow-lg`}>
                    {item.icon}
                  </div>
                  <div>
                    <div className="font-black text-white text-xl uppercase tracking-wide drop-shadow-sm">{item.title}</div>
                    <div className="text-sm text-white/90 font-bold bg-white/20 px-3 py-1 rounded-full mt-1">{item.subtitle}</div>
                  </div>
                </div>
                <ChevronRight className="w-8 h-8 text-white/80" />
              </div>
            </div>
          ))}
        </div>

        {/* Sign Out Button */}
        <div className="bg-gradient-to-r from-red-400 to-red-500 rounded-[2rem] p-4 border-4 border-red-600 transform hover:scale-[1.02] transition-transform shadow-xl hover:shadow-red-300/50">
          <Button
            onClick={signOut}
            className="w-full bg-transparent hover:bg-red-600/20 text-white font-black py-6 text-xl border-0 tracking-wide"
          >
            <LogOut className="w-8 h-8 mr-4" />
            SIGN OUT
          </Button>
        </div>

        {/* App Info */}
        <div className="bg-gradient-to-r from-yellow-300 to-yellow-400 rounded-[2rem] p-6 border-4 border-yellow-500 text-center transform hover:rotate-1 transition-transform shadow-xl hover:shadow-yellow-300/50">
          <div className="text-sm text-yellow-800 font-bold mb-2 uppercase tracking-wide bg-yellow-200/50 px-3 py-1 rounded-full inline-block">Lingoose v1.0.0</div>
          <p className="text-lg text-yellow-900 font-black drop-shadow-sm">🧡 Made with Love by Chaotic Geese</p>
        </div>
      </div>

      {/* Bottom Navigation - Fixed to show all 4 buttons */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t-6 border-slate-400 px-4 py-4 shadow-2xl">
        <div className="max-w-md mx-auto">
          <div className="flex justify-center space-x-6">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => onNavigate("home")}
              className="w-18 h-18 bg-orange-300 hover:bg-orange-400 border-4 border-orange-600 rounded-3xl text-orange-900 transition-all duration-200 hover:scale-110 transform hover:-rotate-3 shadow-lg"
            >
              <Home className="w-7 h-7" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => onNavigate("activity")}
              className="w-18 h-18 bg-green-300 hover:bg-green-400 border-4 border-green-600 rounded-3xl text-green-900 transition-all duration-200 hover:scale-110 transform hover:rotate-3 shadow-lg"
            >
              <Phone className="w-7 h-7" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => onNavigate("curriculum")}
              className="w-18 h-18 bg-purple-300 hover:bg-purple-400 border-4 border-purple-600 rounded-3xl text-purple-900 transition-all duration-200 hover:scale-110 transform hover:rotate-3 shadow-lg"
            >
              <CheckCircle className="w-7 h-7" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => onNavigate("settings")}
              className="w-18 h-18 bg-pink-400 hover:bg-pink-500 border-4 border-pink-600 rounded-3xl text-white transition-all duration-200 hover:scale-110 transform hover:-rotate-3 shadow-lg"
            >
              <Settings className="w-7 h-7" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsCard;
