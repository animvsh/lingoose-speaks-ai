
import { Button } from "@/components/ui/button";
import { User, Edit3, Save, Camera, Phone as PhoneIcon, Clock, Home, Settings, ArrowLeft } from "lucide-react";
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useUserProfile } from "@/hooks/useUserProfile";
import { useUpdateUserProfile } from "@/hooks/useUpdateUserProfile";
import AppBar from "./AppBar";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

interface ProfileManagementPageProps {
  onNavigate: (view: string) => void;
}

const ProfileManagementPage = ({ onNavigate }: ProfileManagementPageProps) => {
  const { user } = useAuth();
  const { data: userProfile, isLoading } = useUserProfile();
  const updateProfileMutation = useUpdateUserProfile();
  const { toast } = useToast();

  const [isEditing, setIsEditing] = useState(false);
  const [fullName, setFullName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [language, setLanguage] = useState("hindi");
  const [preferredCallTime, setPreferredCallTime] = useState("09:00:00");

  // Update state when profile data loads - use useEffect instead of useState
  useEffect(() => {
    if (userProfile) {
      setFullName(userProfile.full_name || "");
      setPhoneNumber(userProfile.phone_number || "");
      setLanguage(userProfile.language || "hindi");
      setPreferredCallTime(userProfile.preferred_call_time || "09:00:00");
    }
  }, [userProfile]);

  const handleSaveProfile = async () => {
    const profileData = {
      full_name: fullName,
      phone_number: phoneNumber,
      language: language,
      preferred_call_time: preferredCallTime,
    };

    updateProfileMutation.mutate(profileData, {
      onSuccess: () => {
        setIsEditing(false);
        toast({
          title: "Profile Updated",
          description: "Your profile was saved successfully!",
          variant: "default"
        });
      },
      onError: (error) => {
        toast({
          title: "Update Failed",
          description: error?.message || "Could not update profile.",
          variant: "destructive"
        });
      }
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-amber-50 pb-24">
        <AppBar 
          title="MY PROFILE" 
          onBack={() => onNavigate("settings")} 
          showBackButton={true} 
        />
        <div className="px-6 py-8">
          <div className="text-center">Loading profile...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-pink-50 pb-24 animate-fade-in">
      <AppBar 
        title="MY PROFILE" 
        onBack={() => onNavigate("settings")} 
        showBackButton={true} 
      />
      <div className="px-0 sm:px-6 max-w-lg mx-auto space-y-8 pt-4">
        {/* Profile Header */}
        <div className="text-center">
          <div className="relative inline-block animate-bounce-slow">
            <div className="w-28 h-28 rounded-full bg-gradient-to-br from-orange-400 via-orange-300 to-yellow-300 flex items-center justify-center text-white text-4xl font-bold uppercase border-4 border-orange-500 shadow-xl ring-4 ring-orange-100">
              {fullName?.charAt(0) || "U"}
            </div>
            {isEditing && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute bottom-0 right-0 rounded-full shadow-md hover:bg-orange-100"
              >
                <Camera className="w-5 h-5 text-orange-600" />
              </Button>
            )}
          </div>
          <h2 className="text-3xl font-bold text-orange-600 mt-4 animate-fade-in">
            {isEditing ? (
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full text-center text-3xl font-bold text-orange-600 bg-transparent border-b-2 border-orange-300 focus:outline-none focus:border-orange-500"
                placeholder="Enter your name"
              />
            ) : (
              fullName || "New User"
            )}
          </h2>
          <p className="text-gray-600 animate-fade-in-slow">{phoneNumber}</p>
        </div>
        <Card className="rounded-3xl border-4 border-orange-100 shadow-lg bg-white/80 animate-fade-in-slow">
          <CardContent className="space-y-6 py-6">
            <div className="text-lg font-bold text-orange-500 uppercase tracking-wide mb-2">Profile Details</div>
            <div className="space-y-4">
              {/* Phone Number */}
              <div>
                <label className="text-sm text-gray-500">Phone Number</label>
                <div className="flex items-center space-x-3 mt-1">
                  <PhoneIcon className="w-5 h-5 text-gray-400" />
                  {isEditing ? (
                    <input
                      type="tel"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      className="w-full bg-transparent border-b border-gray-300 focus:outline-none focus:border-orange-500"
                      placeholder="+1234567890"
                    />
                  ) : (
                    <p className="font-medium text-gray-800">{phoneNumber || "Add phone number"}</p>
                  )}
                </div>
              </div>
              <hr className="my-2 border-orange-100" />
              {/* Language */}
              <div>
                <label className="text-sm text-gray-500">Language</label>
                <div className="flex items-center space-x-3 mt-1">
                  <User className="w-5 h-5 text-gray-400" />
                  {isEditing ? (
                    <select
                      value={language}
                      onChange={(e) => setLanguage(e.target.value)}
                      className="w-full bg-transparent border-b border-gray-300 focus:outline-none focus:border-orange-500"
                    >
                      <option value="hindi">Hindi</option>
                      <option value="spanish">Spanish</option>
                      <option value="french">French</option>
                    </select>
                  ) : (
                    <p className="font-medium text-gray-800 capitalize">{language}</p>
                  )}
                </div>
              </div>
              <hr className="my-2 border-orange-100" />
              {/* Preferred Call Time */}
              <div>
                <label className="text-sm text-gray-500">Preferred Call Time</label>
                <div className="flex items-center space-x-3 mt-1">
                  <Clock className="w-5 h-5 text-gray-400" />
                  {isEditing ? (
                    <input
                      type="time"
                      value={preferredCallTime}
                      onChange={(e) => setPreferredCallTime(e.target.value)}
                      className="w-full bg-transparent border-b border-gray-300 focus:outline-none focus:border-orange-500"
                    />
                  ) : (
                    <p className="font-medium text-gray-800">{preferredCallTime}</p>
                  )}
                </div>
              </div>
            </div>
            <div className="flex justify-end space-x-4 pt-4">
              {isEditing ? (
                <>
                  <Button variant="ghost" onClick={() => setIsEditing(false)} className="rounded-xl px-6">Cancel</Button>
                  <Button onClick={handleSaveProfile} disabled={updateProfileMutation.isPending} className="rounded-xl px-6 bg-orange-500 hover:bg-orange-600 text-white">
                    <Save className="w-4 h-4 mr-2" />
                    {updateProfileMutation.isPending ? "Saving..." : "Save"}
                  </Button>
                </>
              ) : (
                <Button onClick={() => setIsEditing(true)} className="rounded-xl px-6 bg-orange-500 hover:bg-orange-600 text-white">
                  <Edit3 className="w-4 h-4 mr-2" />
                  Edit Profile
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProfileManagementPage;
