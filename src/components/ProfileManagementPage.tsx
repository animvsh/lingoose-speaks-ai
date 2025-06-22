import { Button } from "@/components/ui/button";
import { User, Edit3, Save, Camera, Mail, Phone as PhoneIcon, MapPin, Calendar, Home, Settings, ArrowLeft } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useUserProfile } from "@/hooks/useUserProfile";
import AppBar from "./AppBar";

interface ProfileManagementPageProps {
  onNavigate: (view: string) => void;
}

const ProfileManagementPage = ({ onNavigate }: ProfileManagementPageProps) => {
  const { user } = useAuth();
  const { data: userProfile, isLoading, mutate } = useUserProfile();

  const [isEditing, setIsEditing] = useState(false);
  const [fullName, setFullName] = useState(userProfile?.full_name || "");
  const [email, setEmail] = useState(userProfile?.email || "");
  const [phone, setPhone] = useState(userProfile?.phone || "");
  const [location, setLocation] = useState(userProfile?.location || "");
  const [birthdate, setBirthdate] = useState<Date | null>(userProfile?.birthdate ? new Date(userProfile.birthdate) : null);

  const handleSaveProfile = async () => {
    setIsEditing(false);
    
    const profileData = {
      full_name: fullName,
      email: email,
      phone: phone,
      location: location,
      birthdate: birthdate ? birthdate.toISOString() : null,
    };

    mutate(profileData);
  };

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
              {userProfile?.full_name?.charAt(0) || "U"}
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
              />
            ) : (
              fullName
            )}
          </h2>
          <p className="text-gray-600">{user?.email}</p>
        </div>

        {/* Profile Details */}
        <div className="space-y-4">
          {/* Email */}
          <div className="bg-white rounded-3xl p-4 border-2 border-gray-200">
            <div className="flex items-center space-x-3">
              <Mail className="w-5 h-5 text-gray-500" />
              <div className="flex-1">
                <label className="text-sm text-gray-500">Email</label>
                {isEditing ? (
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-transparent border-b border-gray-300 focus:outline-none focus:border-orange-500"
                  />
                ) : (
                  <p className="font-medium text-gray-800">{email}</p>
                )}
              </div>
            </div>
          </div>

          {/* Phone */}
          <div className="bg-white rounded-3xl p-4 border-2 border-gray-200">
            <div className="flex items-center space-x-3">
              <PhoneIcon className="w-5 h-5 text-gray-500" />
              <div className="flex-1">
                <label className="text-sm text-gray-500">Phone</label>
                {isEditing ? (
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-transparent border-b border-gray-300 focus:outline-none focus:border-orange-500"
                  />
                ) : (
                  <p className="font-medium text-gray-800">{phone || "Add phone number"}</p>
                )}
              </div>
            </div>
          </div>

          {/* Location */}
          <div className="bg-white rounded-3xl p-4 border-2 border-gray-200">
            <div className="flex items-center space-x-3">
              <MapPin className="w-5 h-5 text-gray-500" />
              <div className="flex-1">
                <label className="text-sm text-gray-500">Location</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full bg-transparent border-b border-gray-300 focus:outline-none focus:border-orange-500"
                  />
                ) : (
                  <p className="font-medium text-gray-800">{location || "Add location"}</p>
                )}
              </div>
            </div>
          </div>

          {/* Birthdate */}
          <div className="bg-white rounded-3xl p-4 border-2 border-gray-200">
            <div className="flex items-center space-x-3">
              <Calendar className="w-5 h-5 text-gray-500" />
              <div className="flex-1">
                <label className="text-sm text-gray-500">Birthdate</label>
                {isEditing ? (
                  <input
                    type="date"
                    value={birthdate ? birthdate.toISOString().split('T')[0] : ''}
                    onChange={(e) => setBirthdate(e.target.value ? new Date(e.target.value) : null)}
                    className="w-full bg-transparent border-b border-gray-300 focus:outline-none focus:border-orange-500"
                  />
                ) : (
                  <p className="font-medium text-gray-800">{birthdate ? birthdate.toLocaleDateString() : "Add birthdate"}</p>
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
              <Button onClick={handleSaveProfile}>
                <Save className="w-4 h-4 mr-2" />
                Save
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
