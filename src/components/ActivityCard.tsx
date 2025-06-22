
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
    <div className="min-h-screen bg-gray-100 pb-24">
      <div className="px-4 pt-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div
            onClick={() => onNavigate("home")}
            className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center shadow-[0_4px_0_0_#ea580c] hover:shadow-[0_2px_0_0_#ea580c] hover:translate-y-0.5 transition-all duration-100 cursor-pointer active:shadow-[0_1px_0_0_#ea580c] active:translate-y-1"
          >
            <ArrowLeft className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-2xl font-black text-orange-500 uppercase tracking-wider">
            TODAY'S ACTIVITY
          </h1>
          <div className="w-12 h-12"></div>
        </div>

        {/* Today's Challenge Card */}
        <div className="relative mb-8">
          <div className="bg-orange-500 rounded-3xl p-6 shadow-[0_8px_0_0_#ea580c] hover:shadow-[0_4px_0_0_#ea580c] hover:translate-y-1 transition-all duration-100">
            <div className="absolute -top-3 -right-3 w-12 h-12 bg-green-500 rounded-full flex items-center justify-center shadow-[0_4px_0_0_#16a34a]">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-2xl font-black text-white text-center mb-6 uppercase tracking-wider">
              TODAY'S CHALLENGE
            </h2>
            
            {/* Decorative blocks */}
            <div className="flex justify-center space-x-4 mb-6">
              <div className="w-16 h-16 bg-orange-400 rounded-2xl shadow-[0_4px_0_0_#fb923c] transform rotate-3"></div>
              <div className="w-16 h-16 bg-pink-400 rounded-2xl shadow-[0_4px_0_0_#ec4899] transform -rotate-3"></div>
            </div>
          </div>
        </div>

        {/* Scenario Card */}
        <div className="bg-orange-400 rounded-3xl p-6 mb-6 shadow-[0_6px_0_0_#fb923c] hover:shadow-[0_3px_0_0_#fb923c] hover:translate-y-0.5 transition-all duration-100">
          <div className="flex items-center space-x-4 mb-4">
            <div className="w-12 h-12 bg-orange-600 rounded-2xl flex items-center justify-center shadow-[0_3px_0_0_#ea580c]">
              <Play className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-black text-orange-900 uppercase tracking-wide">
              SCENARIO: MOVIE DATE GONE WRONG
            </h3>
          </div>
          <p className="text-orange-900 font-bold text-base">
            I'll awkwardly pretend to ask you out to a movie. We'll practice casual conversation and reflexive verbs while navigating this hilariously uncomfortable situation.
          </p>
        </div>

        {/* Learning Focus Card */}
        <div className="bg-white rounded-3xl p-6 mb-6 shadow-[0_6px_0_0_#e5e7eb] hover:shadow-[0_3px_0_0_#e5e7eb] hover:translate-y-0.5 transition-all duration-100">
          <div className="flex items-start space-x-4">
            <div className="w-12 h-12 bg-purple-500 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-[0_3px_0_0_#9333ea]">
              <CheckCircle className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-black text-gray-800 mb-4 uppercase tracking-wide">Learning Focus:</h3>
              <div className="flex flex-wrap gap-3">
                <span className="bg-purple-200 text-purple-900 px-4 py-2 rounded-2xl font-black text-sm shadow-[0_3px_0_0_#c4b5fd]">Reflexive Verbs</span>
                <span className="bg-blue-200 text-blue-900 px-4 py-2 rounded-2xl font-black text-sm shadow-[0_3px_0_0_#93c5fd]">Casual Tone</span>
                <span className="bg-green-200 text-green-900 px-4 py-2 rounded-2xl font-black text-sm shadow-[0_3px_0_0_#86efac]">Rejection Phrases</span>
              </div>
            </div>
          </div>
        </div>

        {/* Start Call Button */}
        <Button 
          onClick={handleStartCall}
          disabled={isStartingCall}
          className="w-full bg-orange-500 hover:bg-orange-600 text-white font-black py-6 rounded-3xl text-xl shadow-[0_6px_0_0_#ea580c] hover:shadow-[0_3px_0_0_#ea580c] hover:translate-y-0.5 active:shadow-[0_1px_0_0_#ea580c] active:translate-y-1 transition-all duration-100 border-0 disabled:opacity-50 disabled:cursor-not-allowed mb-6"
        >
          <Phone className="w-6 h-6 mr-3" />
          {isStartingCall ? "Starting Call..." : "START CALL"}
        </Button>

        {/* Info Card */}
        <div className="bg-yellow-300 rounded-3xl p-5 shadow-[0_4px_0_0_#fbbf24] text-center">
          <div className="flex items-center justify-center space-x-3 text-yellow-900">
            <Clock className="w-5 h-5" />
            <p className="font-black text-base">
              {isStartingCall ? "Initiating call..." : "You'll receive a call in ~30 seconds"}
            </p>
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white px-4 py-4 shadow-[0_-4px_0_0_#e5e7eb]">
        <div className="max-w-md mx-auto">
          <div className="flex justify-center space-x-4">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => onNavigate("home")}
              className="w-12 h-12 bg-gray-200 hover:bg-gray-300 rounded-2xl text-gray-600 transition-all duration-100 shadow-[0_3px_0_0_#9ca3af] hover:shadow-[0_1px_0_0_#9ca3af] hover:translate-y-0.5 border-0"
            >
              <Home className="w-5 h-5" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => onNavigate("activity")}
              className="w-12 h-12 bg-orange-500 rounded-2xl text-white shadow-[0_3px_0_0_#ea580c] border-0"
            >
              <Phone className="w-5 h-5" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => onNavigate("curriculum")}
              className="w-12 h-12 bg-gray-200 hover:bg-gray-300 rounded-2xl text-gray-600 transition-all duration-100 shadow-[0_3px_0_0_#9ca3af] hover:shadow-[0_1px_0_0_#9ca3af] hover:translate-y-0.5 border-0"
            >
              <CheckCircle className="w-5 h-5" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => onNavigate("settings")}
              className="w-12 h-12 bg-gray-200 hover:bg-gray-300 rounded-2xl text-gray-600 transition-all duration-100 shadow-[0_3px_0_0_#9ca3af] hover:shadow-[0_1px_0_0_#9ca3af] hover:translate-y-0.5 border-0"
            >
              <Settings className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActivityCard;
