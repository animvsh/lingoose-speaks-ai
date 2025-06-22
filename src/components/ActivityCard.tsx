
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
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
      <div className="px-6 pt-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <div 
            onClick={() => onNavigate("home")}
            className="w-16 h-16 bg-orange-500 hover:bg-orange-600 rounded-full flex items-center justify-center shadow-[0_8px_0_0_#ea580c] hover:shadow-[0_4px_0_0_#ea580c] hover:translate-y-1 transition-all duration-150 cursor-pointer active:shadow-[0_2px_0_0_#ea580c] active:translate-y-2"
          >
            <ArrowLeft className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-3xl font-black text-orange-600 uppercase tracking-wider drop-shadow-md">
            TODAY'S ACTIVITY
          </h1>
          <div className="w-16 h-16"></div>
        </div>

        {/* Today's Challenge Card */}
        <div className="relative mb-8">
          <div className="bg-gradient-to-br from-orange-400 to-orange-500 rounded-[2rem] p-8 shadow-[0_12px_0_0_#ea580c] border-4 border-orange-600">
            <div className="absolute -top-4 -right-4 w-16 h-16 bg-green-500 rounded-full flex items-center justify-center shadow-[0_6px_0_0_#16a34a] border-4 border-white">
              <Zap className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-3xl font-black text-white text-center mb-6 uppercase tracking-wider drop-shadow-lg">
              TODAY'S CHALLENGE
            </h2>
            
            {/* Decorative blocks */}
            <div className="flex justify-center space-x-6 mb-8">
              <div className="w-20 h-20 bg-orange-300 rounded-3xl shadow-[0_8px_0_0_#fb923c] border-4 border-orange-400 transform rotate-3"></div>
              <div className="w-20 h-20 bg-pink-400 rounded-3xl shadow-[0_8px_0_0_#ec4899] border-4 border-pink-500 transform -rotate-3"></div>
            </div>
          </div>
        </div>

        {/* Scenario Card */}
        <div className="bg-gradient-to-br from-orange-300 to-orange-400 rounded-[2rem] p-8 mb-8 shadow-[0_10px_0_0_#fb923c] border-4 border-orange-500">
          <div className="flex items-center space-x-6 mb-6">
            <div className="w-16 h-16 bg-orange-600 rounded-2xl flex items-center justify-center shadow-[0_6px_0_0_#ea580c] border-3 border-orange-700">
              <Play className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-black text-orange-900 uppercase tracking-wider">
              SCENARIO: MOVIE DATE GONE WRONG
            </h3>
          </div>
          <p className="text-orange-900 font-bold text-lg leading-relaxed">
            I'll awkwardly pretend to ask you out to a movie. We'll practice casual conversation and reflexive verbs while navigating this hilariously uncomfortable situation.
          </p>
        </div>

        {/* Learning Focus Card */}
        <div className="bg-white rounded-[2rem] p-8 mb-8 shadow-[0_10px_0_0_#e5e7eb] border-4 border-gray-200">
          <div className="flex items-start space-x-6">
            <div className="w-16 h-16 bg-purple-500 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-[0_6px_0_0_#9333ea] border-3 border-purple-600">
              <CheckCircle className="w-8 h-8 text-white" />
            </div>
            <div>
              <h3 className="text-2xl font-black text-gray-800 mb-6 uppercase tracking-wider">Learning Focus:</h3>
              <div className="flex flex-wrap gap-4">
                <span className="bg-purple-200 text-purple-900 px-6 py-3 rounded-2xl font-black text-sm shadow-[0_4px_0_0_#c4b5fd] border-2 border-purple-300">Reflexive Verbs</span>
                <span className="bg-blue-200 text-blue-900 px-6 py-3 rounded-2xl font-black text-sm shadow-[0_4px_0_0_#93c5fd] border-2 border-blue-300">Casual Tone</span>
                <span className="bg-green-200 text-green-900 px-6 py-3 rounded-2xl font-black text-sm shadow-[0_4px_0_0_#86efac] border-2 border-green-300">Rejection Phrases</span>
              </div>
            </div>
          </div>
        </div>

        {/* Start Call Button */}
        <Button 
          onClick={handleStartCall}
          disabled={isStartingCall}
          className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-black py-8 rounded-[2rem] text-2xl shadow-[0_8px_0_0_#ea580c] hover:shadow-[0_4px_0_0_#ea580c] hover:translate-y-1 active:shadow-[0_2px_0_0_#ea580c] active:translate-y-2 transition-all duration-150 border-4 border-orange-700 disabled:opacity-50 disabled:cursor-not-allowed mb-8"
        >
          <Phone className="w-8 h-8 mr-4" />
          {isStartingCall ? "Starting Call..." : "START CALL"}
        </Button>

        {/* Info Card */}
        <div className="bg-yellow-200 rounded-[2rem] p-6 shadow-[0_6px_0_0_#fbbf24] border-4 border-yellow-300 text-center mb-6">
          <div className="flex items-center justify-center space-x-3 text-yellow-900">
            <Clock className="w-6 h-6" />
            <p className="font-black text-lg">
              {isStartingCall ? "Initiating call..." : "You'll receive a call in ~30 seconds"}
            </p>
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white px-6 py-6 shadow-[0_-8px_32px_rgba(0,0,0,0.1)] border-t-4 border-gray-200">
        <div className="max-w-md mx-auto">
          <div className="flex justify-center space-x-6">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => onNavigate("home")}
              className="w-16 h-16 bg-gray-200 hover:bg-gray-300 rounded-2xl text-gray-600 transition-all duration-150 shadow-[0_4px_0_0_#9ca3af] hover:shadow-[0_2px_0_0_#9ca3af] hover:translate-y-0.5 border-2 border-gray-300"
            >
              <Home className="w-7 h-7" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => onNavigate("activity")}
              className="w-16 h-16 bg-orange-500 rounded-2xl text-white shadow-[0_4px_0_0_#ea580c] border-2 border-orange-600"
            >
              <Phone className="w-7 h-7" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => onNavigate("curriculum")}
              className="w-16 h-16 bg-gray-200 hover:bg-gray-300 rounded-2xl text-gray-600 transition-all duration-150 shadow-[0_4px_0_0_#9ca3af] hover:shadow-[0_2px_0_0_#9ca3af] hover:translate-y-0.5 border-2 border-gray-300"
            >
              <CheckCircle className="w-7 h-7" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => onNavigate("settings")}
              className="w-16 h-16 bg-gray-200 hover:bg-gray-300 rounded-2xl text-gray-600 transition-all duration-150 shadow-[0_4px_0_0_#9ca3af] hover:shadow-[0_2px_0_0_#9ca3af] hover:translate-y-0.5 border-2 border-gray-300"
            >
              <Settings className="w-7 h-7" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActivityCard;
