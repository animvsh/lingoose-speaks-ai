
import { Button } from "@/components/ui/button";
import { User, Edit3, Save, Camera, Phone as PhoneIcon, Clock, Home, Settings, ArrowLeft } from "lucide-react";
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useUserProfile } from "@/hooks/useUserProfile";
import { useUpdateUserProfile } from "@/hooks/useUpdateUserProfile";
import AppBar from "./AppBar";

interface ProfileManagementPageProps {
  onNavigate: (view: string) => void;
}

const ProfileManagementPage = ({ onNavigate }: ProfileManagementPageProps) => {
  const { user } = useAuth();
  const { data: userProfile, isLoading } = useUserProfile();
  const updateProfileMutation = useUpdateUserProfile();

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

    console.log('Saving profile data:', profileData);
    
    updateProfileMutation.mutate(profileData, {
      onSuccess: () => {
        setIsEditing(false);
        console.log('Profile updated successfully');
      },
      onError: (error) => {
        console.error('Failed to update profile:', error);
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
    <div className="min-h-screen bg-amber-50 pb-24">
      <AppBar 
        title="MY PROFILE" 
        onBack={() => onNavigate("settings")} 
        showBackButton={true} 
      />

      <div className="px-6 space-y-6">
        {/* Profile Header */}
        <div className="text-center">
          <div className="relative inline-block">
            <div className="w-28 h-28 rounded-full bg-orange-400 flex items-center justify-center text-white text-4xl font-bold uppercase border-4 border-orange-500">
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
          <h2 className="text-3xl font-bold text-orange-600 mt-4">
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
          <p className="text-gray-600">{phoneNumber}</p>
        </div>

        {/* Profile Details */}
        <div className="space-y-4">
          {/* Phone Number */}
          <div className="bg-white rounded-3xl p-4 border-2 border-gray-200">
            <div className="flex items-center space-x-3">
              <PhoneIcon className="w-5 h-5 text-gray-500" />
              <div className="flex-1">
                <label className="text-sm text-gray-500">Phone Number</label>
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
          </div>

          {/* Language */}
          <div className="bg-white rounded-3xl p-4 border-2 border-gray-200">
            <div className="flex items-center space-x-3">
              <User className="w-5 h-5 text-gray-500" />
              <div className="flex-1">
                <label className="text-sm text-gray-500">Language</label>
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
          </div>

          {/* Preferred Call Time */}
          <div className="bg-white rounded-3xl p-4 border-2 border-gray-200">
            <div className="flex items-center space-x-3">
              <Clock className="w-5 h-5 text-gray-500" />
              <div className="flex-1">
                <label className="text-sm text-gray-500">Preferred Call Time</label>
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
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-4">
          {isEditing ? (
            <>
              <Button variant="ghost" onClick={() => setIsEditing(false)}>
                Cancel
              </Button>
              <Button onClick={handleSaveProfile} disabled={updateProfileMutation.isPending}>
                <Save className="w-4 h-4 mr-2" />
                {updateProfileMutation.isPending ? "Saving..." : "Save"}
              </Button>
            </>
          ) : (
            <Button onClick={() => setIsEditing(true)}>
              <Edit3 className="w-4 h-4 mr-2" />
              Edit Profile
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileManagementPage;
