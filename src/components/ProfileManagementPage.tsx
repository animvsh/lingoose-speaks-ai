
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useUserProfile } from "@/hooks/useUserProfile";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface ProfileManagementPageProps {
  onNavigate: (view: string) => void;
}

const ProfileManagementPage = ({ onNavigate }: ProfileManagementPageProps) => {
  const { user } = useAuth();
  const { data: userProfile, refetch: refetchProfile } = useUserProfile();
  const { toast } = useToast();
  
  // Profile form states
  const [fullName, setFullName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [preferredCallTime, setPreferredCallTime] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  // Update form values when userProfile changes
  useEffect(() => {
    if (userProfile) {
      setFullName(userProfile.full_name || "");
      setPhoneNumber(userProfile.phone_number || "");
      setPreferredCallTime(userProfile.preferred_call_time || "09:00");
    }
  }, [userProfile]);

  const handleUpdateProfile = async () => {
    if (!user) return;
    
    setIsUpdating(true);
    try {
      const { error } = await supabase
        .from('user_profiles')
        .update({
          full_name: fullName,
          phone_number: phoneNumber,
          preferred_call_time: preferredCallTime,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);

      if (error) throw error;

      // Refetch the profile to update the UI
      await refetchProfile();

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

    if (newPassword.length < 6) {
      toast({
        title: "❌ Password Too Short",
        description: "Password must be at least 6 characters long.",
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

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <div className="px-6 pt-8 pb-6">
        <div className="flex items-center justify-between">
          <Button
            onClick={() => onNavigate("settings")}
            className="w-14 h-14 bg-orange-500 hover:bg-orange-600 rounded-2xl text-white shadow-lg"
          >
            <ArrowLeft className="w-6 h-6" />
          </Button>
          <h1 className="text-3xl font-bold text-orange-500 uppercase tracking-wide">
            PROFILE
          </h1>
          <div className="w-14 h-14"></div>
        </div>
      </div>

      <div className="px-6 space-y-6">
        {/* Profile Information Section */}
        <div className="bg-white rounded-3xl p-6 border-4 border-gray-200">
          <h3 className="font-bold text-gray-800 text-lg uppercase tracking-wide mb-4">
            Profile Information
          </h3>
          <div className="space-y-4">
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
              <label className="block text-sm font-bold text-gray-700 mb-1">Preferred Call Time</label>
              <Input
                type="time"
                value={preferredCallTime}
                onChange={(e) => setPreferredCallTime(e.target.value)}
                className="border-2 border-gray-300 rounded-xl font-medium"
              />
              <p className="text-xs text-gray-500 mt-1">Set your preferred time for daily practice calls</p>
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
              disabled={isUpdating || (!fullName.trim() && !phoneNumber.trim())}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 rounded-xl disabled:bg-gray-400"
            >
              {isUpdating ? "Updating..." : "Update Profile"}
            </Button>
          </div>
        </div>

        {/* Password Section */}
        <div className="bg-white rounded-3xl p-6 border-4 border-gray-200">
          <h3 className="font-bold text-gray-800 text-lg uppercase tracking-wide mb-4">
            Change Password
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">New Password</label>
              <Input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="border-2 border-gray-300 rounded-xl font-medium"
                placeholder="Enter new password (min 6 characters)"
              />
            </div>
            
            <Button
              onClick={handleUpdatePassword}
              disabled={isUpdating || newPassword.length < 6}
              className="w-full bg-purple-500 hover:bg-purple-600 text-white font-bold py-3 rounded-xl disabled:bg-gray-400"
            >
              {isUpdating ? "Updating..." : "Update Password"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileManagementPage;
