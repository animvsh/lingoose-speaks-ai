
import { Button } from "@/components/ui/button";
import { Phone, Home, Clock, CheckCircle, BarChart3, Settings, Play, Zap, ArrowLeft } from "lucide-react";
import DuckMascot from "./DuckMascot";
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
    <div className="min-h-screen bg-gray-50">
      <div className="px-4 pt-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Button
            onClick={() => onNavigate("home")}
            className="w-14 h-14 bg-orange-500 hover:bg-orange-600 rounded-full text-white shadow-lg transition-all duration-200"
          >
            <ArrowLeft className="w-6 h-6" />
          </Button>
          <h1 className="text-3xl font-black text-orange-500 uppercase tracking-wide">
            TODAY'S ACTIVITY
          </h1>
          <div className="w-14 h-14"></div>
        </div>

        {/* Today's Challenge Card */}
        <div className="bg-orange-500 rounded-3xl p-6 mb-6 shadow-lg relative">
          <div className="absolute -top-3 -right-3 w-12 h-12 bg-green-500 rounded-full flex items-center justify-center shadow-lg">
            <Zap className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-2xl font-black text-white text-center mb-4 uppercase tracking-wide">
            TODAY'S CHALLENGE
          </h2>
          
          {/* Icon decorations */}
          <div className="flex justify-center space-x-4 mb-6">
            <div className="w-16 h-16 bg-orange-400 rounded-2xl shadow-inner"></div>
            <div className="w-16 h-16 bg-pink-400 rounded-2xl shadow-inner"></div>
          </div>
        </div>

        {/* Scenario Card */}
        <div className="bg-orange-400 rounded-3xl p-6 mb-6 shadow-lg">
          <div className="flex items-center space-x-4 mb-4">
            <div className="w-14 h-14 bg-orange-600 rounded-2xl flex items-center justify-center shadow-md">
              <Play className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-xl font-black text-orange-900 uppercase tracking-wide">
              SCENARIO: MOVIE DATE GONE WRONG
            </h3>
          </div>
          <p className="text-orange-900 font-semibold text-base leading-relaxed">
            I'll awkwardly pretend to ask you out to a movie. We'll practice casual conversation and reflexive verbs while navigating this hilariously uncomfortable situation.
          </p>
        </div>

        {/* Learning Focus Card */}
        <div className="bg-white rounded-3xl p-6 mb-6 shadow-lg border border-gray-100">
          <div className="flex items-start space-x-4">
            <div className="w-12 h-12 bg-purple-500 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-md">
              <CheckCircle className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-black text-gray-800 mb-3 uppercase tracking-wide">Learning Focus:</h3>
              <div className="flex flex-wrap gap-3">
                <span className="bg-purple-100 text-purple-800 px-4 py-2 rounded-full font-bold text-sm">Reflexive Verbs</span>
                <span className="bg-blue-100 text-blue-800 px-4 py-2 rounded-full font-bold text-sm">Casual Tone</span>
                <span className="bg-green-100 text-green-800 px-4 py-2 rounded-full font-bold text-sm">Rejection Phrases</span>
              </div>
            </div>
          </div>
        </div>

        {/* Start Call Button */}
        <Button 
          onClick={handleStartCall}
          disabled={isStartingCall}
          className="w-full bg-orange-500 hover:bg-orange-600 text-white font-black py-6 rounded-3xl text-xl shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed mb-6"
        >
          <Phone className="w-6 h-6 mr-3" />
          {isStartingCall ? "Starting Call..." : "START CALL"}
        </Button>

        {/* Info Card */}
        <div className="bg-white rounded-3xl p-4 shadow-lg border border-gray-100 text-center">
          <div className="flex items-center justify-center space-x-2 text-gray-700">
            <Clock className="w-5 h-5" />
            <p className="font-semibold text-sm">
              {isStartingCall ? "Initiating call..." : "You'll receive a call in ~30 seconds"}
            </p>
          </div>
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
              className="w-14 h-14 bg-orange-500 rounded-2xl text-white shadow-md"
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
              className="w-14 h-14 bg-gray-100 hover:bg-gray-200 rounded-2xl text-gray-600 transition-all duration-200 shadow-md"
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
