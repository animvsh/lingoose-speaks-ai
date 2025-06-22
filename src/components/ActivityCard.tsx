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

      // Navigate to progress after a short delay
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
    <div className="min-h-screen bg-[#F5F2E8]">
      <div className="px-4 pt-6">
        {/* Header with Back Button */}
        <div className="flex items-center justify-between mb-6">
          <Button
            onClick={() => onNavigate("home")}
            className="w-14 h-14 bg-orange-400 hover:bg-orange-500 border-4 border-orange-600 rounded-3xl text-white transition-all duration-200 hover:scale-110 transform hover:-rotate-3 shadow-lg"
          >
            <ArrowLeft className="w-7 h-7" />
          </Button>
          <h1 className="text-4xl font-black text-orange-600 uppercase tracking-wider transform -rotate-1 drop-shadow-lg">
            Today's Activity
          </h1>
          <div className="w-14 h-14"></div> {/* Spacer */}
        </div>

        <div className="bg-white border-6 border-slate-400 p-8 rounded-[2.5rem] shadow-2xl mb-8 transform hover:rotate-1 transition-transform duration-200">
          <div className="text-center space-y-6">
            <div className="relative">
              <div className="bg-gradient-to-r from-orange-400 to-orange-500 border-4 border-orange-600 text-white px-8 py-4 rounded-[2rem] shadow-xl">
                <h2 className="text-3xl font-black uppercase tracking-wide drop-shadow-lg">Today's Challenge</h2>
              </div>
              <div className="absolute -top-3 -right-3 w-12 h-12 bg-gradient-to-r from-green-400 to-green-500 border-4 border-green-600 rounded-full flex items-center justify-center animate-bounce shadow-lg">
                <Zap className="w-6 h-6 text-white" />
              </div>
            </div>

            <div className="flex justify-center space-x-4 my-8">
              <div className="w-20 h-20 bg-gradient-to-br from-orange-300 to-orange-400 border-4 border-orange-600 rounded-3xl flex items-center justify-center shadow-xl transform hover:scale-110 transition-transform">
                <div className="w-12 h-12 bg-orange-500 border-3 border-orange-700 rounded-2xl shadow-inner"></div>
              </div>
              <div className="w-20 h-20 bg-gradient-to-br from-pink-300 to-pink-400 border-4 border-pink-600 rounded-3xl flex items-center justify-center shadow-xl transform hover:scale-110 transition-transform">
                <div className="w-12 h-12 bg-pink-500 border-3 border-pink-700 rounded-2xl shadow-inner"></div>
              </div>
            </div>

            <div className="space-y-6 text-left">
              <div className="bg-gradient-to-r from-orange-300 to-orange-400 border-4 border-orange-600 p-6 rounded-[2rem] transform hover:scale-105 transition-transform duration-200 shadow-xl">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-16 h-16 bg-orange-600 border-4 border-orange-800 rounded-2xl flex items-center justify-center shadow-lg">
                    <Play className="w-8 h-8 text-white" />
                  </div>
                  <p className="text-orange-900 font-black text-xl uppercase tracking-wide drop-shadow-sm">Scenario: Movie Date Gone Wrong</p>
                </div>
                <p className="text-orange-800 font-bold text-base leading-relaxed">
                  I'll awkwardly pretend to ask you out to a movie. We'll practice casual conversation and reflexive verbs while navigating this hilariously uncomfortable situation.
                </p>
              </div>
              
              <div className="bg-gradient-to-r from-slate-300 to-slate-400 border-4 border-slate-600 p-6 rounded-[2rem] transform hover:scale-105 transition-transform duration-200 shadow-xl">
                <div className="flex items-start space-x-3">
                  <div className="w-12 h-12 bg-purple-500 border-4 border-purple-700 rounded-2xl flex items-center justify-center flex-shrink-0 mt-1 shadow-lg">
                    <CheckCircle className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-slate-900 font-black mb-3 text-xl uppercase tracking-wide drop-shadow-sm">Learning Focus:</p>
                    <div className="flex flex-wrap gap-3">
                      <span className="bg-gradient-to-r from-purple-300 to-purple-400 border-3 border-purple-600 text-purple-900 px-4 py-2 rounded-full font-black uppercase tracking-wide shadow-lg">Reflexive Verbs</span>
                      <span className="bg-gradient-to-r from-blue-300 to-blue-400 border-3 border-blue-600 text-blue-900 px-4 py-2 rounded-full font-black uppercase tracking-wide shadow-lg">Casual Tone</span>
                      <span className="bg-gradient-to-r from-green-300 to-green-400 border-3 border-green-600 text-green-900 px-4 py-2 rounded-full font-black uppercase tracking-wide shadow-lg">Rejection Phrases</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <Button 
              onClick={handleStartCall}
              disabled={isStartingCall}
              className="w-full bg-gradient-to-r from-orange-400 to-orange-500 hover:from-orange-500 hover:to-orange-600 border-4 border-orange-600 text-white font-black py-6 px-6 rounded-[2rem] text-xl transition-all duration-200 hover:scale-105 transform hover:-rotate-1 disabled:opacity-50 disabled:cursor-not-allowed shadow-2xl"
            >
              <Phone className="w-8 h-8 mr-4" />
              {isStartingCall ? "Starting Call..." : "START CALL"}
            </Button>

            <div className="flex items-center justify-center space-x-2 text-slate-800 bg-white border-4 border-slate-400 rounded-full px-6 py-4 font-bold shadow-lg">
              <Clock className="w-6 h-6" />
              <p className="text-sm font-black uppercase tracking-wide">
                {isStartingCall ? "Initiating call..." : "You'll receive a call in ~30 seconds"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Navigation - Fixed to show all 4 buttons */}
      <div className="bg-white border-t-6 border-slate-400 px-4 py-4 shadow-2xl">
        <div className="max-w-md mx-auto">
          <div className="flex justify-center space-x-6">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => onNavigate("home")}
              className="w-18 h-18 bg-blue-300 hover:bg-blue-400 border-4 border-blue-600 rounded-3xl text-blue-900 transition-all duration-200 hover:scale-110 transform hover:-rotate-3 shadow-lg"
            >
              <Home className="w-7 h-7" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => onNavigate("activity")}
              className="w-18 h-18 bg-green-400 hover:bg-green-500 border-4 border-green-600 rounded-3xl text-white transition-all duration-200 hover:scale-110 transform hover:rotate-3 shadow-lg"
            >
              <Phone className="w-7 h-7" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => onNavigate("curriculum")}
              className="w-18 h-18 bg-purple-300 hover:bg-purple-400 border-4 border-purple-600 rounded-3xl text-purple-900 transition-all duration-200 hover:scale-110 transform hover:rotate-3 shadow-lg"
            >
              <CheckCircle className="w-7 h-7" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => onNavigate("settings")}
              className="w-18 h-18 bg-pink-300 hover:bg-pink-400 border-4 border-pink-600 rounded-3xl text-pink-900 transition-all duration-200 hover:scale-110 transform hover:-rotate-3 shadow-lg"
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
