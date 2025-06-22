
import { Button } from "@/components/ui/button";
import { Home, CheckCircle, Settings, ChevronRight, Bell, Phone, User, HelpCircle, ArrowLeft, LogOut } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useUserProfile } from "@/hooks/useUserProfile";
import { useToast } from "@/hooks/use-toast";

interface SettingsCardProps {
  onNavigate: (view: string) => void;
}

const SettingsCard = ({ onNavigate }: SettingsCardProps) => {
  const { signOut, user } = useAuth();
  const { data: userProfile } = useUserProfile();
  const { toast } = useToast();

  const handleSignOut = async () => {
    try {
      await signOut();
      toast({
        title: "✅ Signed Out",
        description: "You have been signed out successfully.",
        className: "border-2 border-green-400 bg-green-50 text-green-800",
      });
    } catch (error) {
      toast({
        title: "❌ Error",
        description: "Failed to sign out. Please try again.",
        variant: "destructive",
        className: "border-2 border-red-400 bg-red-50 text-red-800",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background pb-24">
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
        {/* Language Setting */}
        <div className="bg-white rounded-3xl p-5 border-4 border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-orange-400 rounded-2xl flex items-center justify-center">
                <User className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="font-bold text-gray-800 text-lg uppercase tracking-wide">Change Language</div>
                <div className="text-sm text-gray-600 font-medium">Current: French (from English)</div>
              </div>
            </div>
            <ChevronRight className="w-6 h-6 text-gray-400" />
          </div>
        </div>

        {/* Notifications Section */}
        <div 
          className="bg-white rounded-3xl p-5 border-4 border-gray-200 cursor-pointer hover:bg-gray-50 transition-colors"
          onClick={() => onNavigate("notifications")}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-orange-400 rounded-2xl flex items-center justify-center">
                <Bell className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="font-bold text-gray-800 text-lg uppercase tracking-wide">Notifications</div>
                <div className="text-sm text-gray-600 font-medium">
                  Manage push notifications
                </div>
              </div>
            </div>
            <ChevronRight className="w-6 h-6 text-gray-400" />
          </div>
        </div>

        {/* Profile Management Section */}
        <div 
          className="bg-white rounded-3xl p-5 border-4 border-gray-200 cursor-pointer hover:bg-gray-50 transition-colors"
          onClick={() => onNavigate("profile-management")}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-orange-400 rounded-2xl flex items-center justify-center">
                <User className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="font-bold text-gray-800 text-lg uppercase tracking-wide">Profile Management</div>
                <div className="text-sm text-gray-600 font-medium">Update your information</div>
              </div>
            </div>
            <ChevronRight className="w-6 h-6 text-gray-400" />
          </div>
        </div>

        {/* Phone Management */}
        <div className="bg-white rounded-3xl p-5 border-4 border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-orange-400 rounded-2xl flex items-center justify-center">
                <Phone className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="font-bold text-gray-800 text-lg uppercase tracking-wide">AI Conversation</div>
                <div className="text-sm text-gray-600 font-medium">
                  {userProfile?.phone_number || "Set up voice calls"}
                </div>
              </div>
            </div>
            <ChevronRight className="w-6 h-6 text-gray-400" />
          </div>
        </div>

        {/* Help & Support Section */}
        <div 
          className="bg-white rounded-3xl p-5 border-4 border-gray-200 cursor-pointer hover:bg-gray-50 transition-colors"
          onClick={() => onNavigate("help-support")}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-orange-400 rounded-2xl flex items-center justify-center">
                <HelpCircle className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="font-bold text-gray-800 text-lg uppercase tracking-wide">Help & Support</div>
                <div className="text-sm text-gray-600 font-medium">Get help or report issues</div>
              </div>
            </div>
            <ChevronRight className="w-6 h-6 text-gray-400" />
          </div>
        </div>

        {/* Sign Out Section */}
        <div className="bg-red-50 rounded-3xl p-5 border-4 border-red-200">
          <Button
            onClick={handleSignOut}
            className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-3 rounded-2xl flex items-center justify-center space-x-2"
          >
            <LogOut className="w-5 h-5" />
            <span>SIGN OUT</span>
          </Button>
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
