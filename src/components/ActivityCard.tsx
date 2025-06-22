import { Button } from "@/components/ui/button";
import { Phone, Home, Clock, CheckCircle, Settings, Play, ArrowLeft } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useUserProfile } from "@/hooks/useUserProfile";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface ActivityCardProps {
  onNavigate: (view: string) => void;
}

const ActivityCard = ({ onNavigate }: ActivityCardProps) => {
  const { user } = useAuth();
  const { data: userProfile } = useUserProfile();
  const { toast } = useToast();
  const [isStartingCall, setIsStartingCall] = useState(false);

  const handleStartCall = async () => {
    if (!user || !userProfile) {
      toast({
        title: "Error",
        description: "Please log in to start a call",
        variant: "destructive",
      });
      return;
    }

    if (!userProfile.phone_number) {
      toast({
        title: "Phone Number Required",
        description: "Please add your phone number in settings to start calls",
        variant: "destructive",
      });
      return;
    }

    setIsStartingCall(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('start-vapi-call', {
        body: {
          phoneNumber: userProfile.phone_number,
          userId: user.id
        }
      });

      if (error) throw error;

      toast({
        title: "Call Started!",
        description: "You should receive a call shortly. Get ready to practice Hindi!",
        variant: "default",
      });

      setTimeout(() => {
        onNavigate("progress");
      }, 2000);

    } catch (error: any) {
      console.error('Error starting call:', error);
      toast({
        title: "Call Failed",
        description: error.message || "Failed to start the call. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsStartingCall(false);
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
            TODAY'S CALL
          </h1>
          <div className="w-14 h-14"></div>
        </div>
      </div>

      <div className="px-6 space-y-6">
        {/* Today's Challenge Card */}
        <div className="bg-orange-400 rounded-3xl p-6 border-4 border-orange-500">
          <h2 className="text-2xl font-bold text-white text-center mb-6 uppercase tracking-wide">
            TODAY'S CHALLENGE 🚀
          </h2>
        </div>

        {/* Scenario Card */}
        <div className="bg-white rounded-3xl p-6 border-4 border-gray-200">
          <div className="flex items-center space-x-4 mb-4">
            <div className="w-12 h-12 bg-orange-400 rounded-2xl flex items-center justify-center">
              <Play className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 uppercase tracking-wide">
              SCENARIO: MOVIE DATE GONE WRONG 💔
            </h3>
          </div>
          <p className="text-gray-700 font-medium text-base leading-relaxed">
            I'll awkwardly pretend to ask you out to a movie. We'll practice casual conversation and reflexive verbs while navigating this hilariously uncomfortable situation. 😅
          </p>
        </div>

        {/* Learning Focus Card */}
        <div className="bg-purple-400 rounded-3xl p-6 border-4 border-purple-500">
          <h3 className="text-xl font-bold text-white mb-4 uppercase tracking-wide flex items-center">
            <CheckCircle className="w-6 h-6 mr-3" />
            Learning Focus: 🎓
          </h3>
          <div className="flex flex-wrap gap-3">
            <span className="bg-white text-purple-700 px-4 py-2 rounded-2xl font-bold text-sm border-2 border-white">
              Reflexive Verbs 🔄
            </span>
            <span className="bg-white text-purple-700 px-4 py-2 rounded-2xl font-bold text-sm border-2 border-white">
              Casual Tone 😎
            </span>
            <span className="bg-white text-purple-700 px-4 py-2 rounded-2xl font-bold text-sm border-2 border-white">
              Rejection Phrases 🙅
            </span>
          </div>
        </div>

        {/* Start Call Button */}
        <Button 
          onClick={handleStartCall}
          disabled={isStartingCall}
          className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-6 rounded-3xl text-xl disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Phone className="w-6 h-6 mr-3" />
          {isStartingCall ? "Starting Call... 📞" : "START CALL 🚀"}
        </Button>

        {/* Info Card */}
        <div className="bg-yellow-400 rounded-3xl p-6 border-4 border-yellow-500 text-center">
          <div className="flex items-center justify-center space-x-3 text-yellow-900">
            <Clock className="w-6 h-6" />
            <p className="font-bold text-lg">
              {isStartingCall ? "Initiating call... 🔄" : "You'll receive a call in ~30 seconds ⚡"}
            </p>
          </div>
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
              className="w-14 h-14 bg-gray-200 rounded-2xl text-gray-600"
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
              className="w-14 h-14 bg-gray-200 rounded-2xl text-gray-600"
            >
              <CheckCircle className="w-6 h-6" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => onNavigate("settings")}
              className="w-14 h-14 bg-gray-200 rounded-2xl text-gray-600"
            >
              <Settings className="w-6 h-6" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActivityCard;
