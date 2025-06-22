
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Home, CheckCircle, Settings, ChevronRight, Bell, Phone, User, HelpCircle, ArrowLeft, LogOut, Mail, Lock, ChevronDown, ChevronUp } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useUserProfile } from "@/hooks/useUserProfile";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface SettingsCardProps {
  onNavigate: (view: string) => void;
}

const SettingsCard = ({ onNavigate }: SettingsCardProps) => {
  const { signOut, user } = useAuth();
  const { data: userProfile } = useUserProfile();
  const { toast } = useToast();
  
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const [showFAQ, setShowFAQ] = useState(false);
  
  // Profile form states
  const [fullName, setFullName] = useState(userProfile?.full_name || "");
  const [phoneNumber, setPhoneNumber] = useState(userProfile?.phone_number || "");
  const [newPassword, setNewPassword] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

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

  const handleUpdateProfile = async () => {
    if (!user) return;
    
    setIsUpdating(true);
    try {
      const { error } = await supabase
        .from('user_profiles')
        .update({
          full_name: fullName,
          phone_number: phoneNumber,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);

      if (error) throw error;

      toast({
        title: "✅ Profile Updated",
        description: "Your profile has been updated successfully.",
        className: "border-2 border-green-400 bg-green-50 text-green-800",
      });
    } catch (error: any) {
      toast({
        title: "❌ Update Failed",
        description: error.message || "Failed to update profile.",
        variant: "destructive",
        className: "border-2 border-red-400 bg-red-50 text-red-800",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleUpdatePassword = async () => {
    if (!newPassword) {
      toast({
        title: "❌ Missing Password",
        description: "Please enter a new password.",
        variant: "destructive",
        className: "border-2 border-red-400 bg-red-50 text-red-800",
      });
      return;
    }

    setIsUpdating(true);
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) throw error;

      setNewPassword("");
      setCurrentPassword("");
      
      toast({
        title: "✅ Password Updated",
        description: "Your password has been updated successfully.",
        className: "border-2 border-green-400 bg-green-50 text-green-800",
      });
    } catch (error: any) {
      toast({
        title: "❌ Update Failed",
        description: error.message || "Failed to update password.",
        variant: "destructive",
        className: "border-2 border-red-400 bg-red-50 text-red-800",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const faqItems = [
    {
      question: "How do I improve my pronunciation?",
      answer: "Practice regularly with our AI conversations, focus on listening to native speakers, and don't be afraid to make mistakes!"
    },
    {
      question: "Can I change my learning pace?",
      answer: "Yes! You can adjust your daily goals and lesson frequency in the curriculum section."
    },
    {
      question: "How does the fluency scoring work?",
      answer: "Our AI analyzes your speech patterns, vocabulary usage, and conversational flow to give you a comprehensive fluency score."
    },
    {
      question: "Is my data secure?",
      answer: "Absolutely! We use industry-standard encryption and never share your personal information with third parties."
    }
  ];

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
                <div className="text-sm text-gray-600 font-medium">Current: English</div>
              </div>
            </div>
            <ChevronRight className="w-6 h-6 text-gray-400" />
          </div>
        </div>

        {/* Notifications Section */}
        <div className="bg-white rounded-3xl border-4 border-gray-200 overflow-hidden">
          <div
            className="p-5 cursor-pointer"
            onClick={() => toggleSection('notifications')}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-orange-400 rounded-2xl flex items-center justify-center">
                  <Bell className="w-6 h-6 text-white" />
                </div>
                <div>
                  <div className="font-bold text-gray-800 text-lg uppercase tracking-wide">Notifications</div>
                  <div className="text-sm text-gray-600 font-medium">
                    {notificationsEnabled ? "Enabled" : "Disabled"}
                  </div>
                </div>
              </div>
              {expandedSection === 'notifications' ? 
                <ChevronUp className="w-6 h-6 text-gray-400" /> : 
                <ChevronDown className="w-6 h-6 text-gray-400" />
              }
            </div>
          </div>
          
          {expandedSection === 'notifications' && (
            <div className="px-5 pb-5 border-t border-gray-100 pt-4 space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-medium text-gray-700">Daily Reminders</span>
                <Switch 
                  checked={notificationsEnabled} 
                  onCheckedChange={setNotificationsEnabled}
                />
              </div>
              
              <Button
                onClick={handleSignOut}
                className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-3 rounded-2xl flex items-center justify-center space-x-2"
              >
                <LogOut className="w-5 h-5" />
                <span>SIGN OUT</span>
              </Button>
            </div>
          )}
        </div>

        {/* Profile Management Section */}
        <div className="bg-white rounded-3xl border-4 border-gray-200 overflow-hidden">
          <div
            className="p-5 cursor-pointer"
            onClick={() => toggleSection('profile')}
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
              {expandedSection === 'profile' ? 
                <ChevronUp className="w-6 h-6 text-gray-400" /> : 
                <ChevronDown className="w-6 h-6 text-gray-400" />
              }
            </div>
          </div>
          
          {expandedSection === 'profile' && (
            <div className="px-5 pb-5 border-t border-gray-100 pt-4 space-y-4">
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Full Name</label>
                  <Input
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="border-2 border-gray-300 rounded-xl font-medium"
                    placeholder="Enter your full name"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Phone Number</label>
                  <Input
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="border-2 border-gray-300 rounded-xl font-medium"
                    placeholder="Enter your phone number"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Email</label>
                  <Input
                    value={user?.email || ""}
                    disabled
                    className="border-2 border-gray-200 rounded-xl font-medium bg-gray-50"
                  />
                  <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
                </div>
                
                <Button
                  onClick={handleUpdateProfile}
                  disabled={isUpdating}
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 rounded-xl"
                >
                  {isUpdating ? "Updating..." : "Update Profile"}
                </Button>
              </div>
              
              <div className="border-t border-gray-200 pt-4 space-y-3">
                <h4 className="font-bold text-gray-800 uppercase tracking-wide">Change Password</h4>
                
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">New Password</label>
                  <Input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="border-2 border-gray-300 rounded-xl font-medium"
                    placeholder="Enter new password"
                  />
                </div>
                
                <Button
                  onClick={handleUpdatePassword}
                  disabled={isUpdating}
                  className="w-full bg-purple-500 hover:bg-purple-600 text-white font-bold py-2 rounded-xl"
                >
                  {isUpdating ? "Updating..." : "Update Password"}
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Phone Management */}
        <div className="bg-white rounded-3xl p-5 border-4 border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-orange-400 rounded-2xl flex items-center justify-center">
                <Phone className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="font-bold text-gray-800 text-lg uppercase tracking-wide">Manage Number</div>
                <div className="text-sm text-gray-600 font-medium">{userProfile?.phone_number || "+91 98765 43210"}</div>
              </div>
            </div>
            <ChevronRight className="w-6 h-6 text-gray-400" />
          </div>
        </div>

        {/* Help & Support Section */}
        <div className="bg-white rounded-3xl border-4 border-gray-200 overflow-hidden">
          <div
            className="p-5 cursor-pointer"
            onClick={() => toggleSection('help')}
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
              {expandedSection === 'help' ? 
                <ChevronUp className="w-6 h-6 text-gray-400" /> : 
                <ChevronDown className="w-6 h-6 text-gray-400" />
              }
            </div>
          </div>
          
          {expandedSection === 'help' && (
            <div className="border-t border-gray-100 space-y-4">
              {/* FAQ Toggle */}
              <div className="px-5 pt-4">
                <Button
                  onClick={() => setShowFAQ(!showFAQ)}
                  className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold py-2 rounded-xl mb-4"
                >
                  {showFAQ ? "Hide FAQs" : "Show FAQs"}
                </Button>
                
                {showFAQ && (
                  <div className="space-y-3 mb-4">
                    {faqItems.map((item, index) => (
                      <div key={index} className="bg-gray-50 rounded-xl p-3">
                        <h4 className="font-bold text-gray-800 mb-2">{item.question}</h4>
                        <p className="text-sm text-gray-600">{item.answer}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              {/* Embedded YouForm */}
              <div className="px-5 pb-5">
                <div className="bg-gray-50 rounded-xl p-4">
                  <h4 className="font-bold text-gray-800 mb-3 uppercase tracking-wide">Contact Support</h4>
                  <iframe
                    src="https://app.youform.com/forms/i8pgpq7n"
                    width="100%"
                    height="500"
                    frameBorder="0"
                    className="rounded-lg"
                    title="Support Form"
                  />
                </div>
              </div>
            </div>
          )}
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
