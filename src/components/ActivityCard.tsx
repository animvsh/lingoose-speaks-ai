
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 pb-24 relative overflow-hidden">
      {/* Cartoon Background Elements */}
      <div className="absolute top-16 left-8 w-24 h-24 bg-blue-300 rounded-full opacity-30 animate-bounce" style={{ animationDelay: '0s', animationDuration: '3s' }}></div>
      <div className="absolute top-40 right-12 w-20 h-20 bg-pink-300 rounded-full opacity-30 animate-bounce" style={{ animationDelay: '1s', animationDuration: '4s' }}></div>
      <div className="absolute top-80 left-1/4 w-16 h-16 bg-yellow-300 rounded-full opacity-30 animate-bounce" style={{ animationDelay: '2s', animationDuration: '5s' }}></div>

      <div className="px-6 pt-8">
        {/* Header - Ultra Cartoonish */}
        <div className="flex items-center justify-between mb-10">
          <div
            onClick={() => onNavigate("home")}
            className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-[2rem] flex items-center justify-center shadow-[0_8px_0_0_#ea580c] hover:shadow-[0_4px_0_0_#ea580c] hover:translate-y-2 transition-all duration-300 cursor-pointer active:shadow-[0_2px_0_0_#ea580c] active:translate-y-3 transform hover:scale-110 hover:rotate-12"
          >
            <ArrowLeft className="w-8 h-8 text-white drop-shadow-lg" />
          </div>
          <h1 className="text-3xl font-black text-orange-500 uppercase tracking-wider drop-shadow-lg transform hover:scale-105 transition-all duration-300">
            TODAY'S ACTIVITY 🎮
          </h1>
          <div className="w-16 h-16"></div>
        </div>

        {/* Today's Challenge Card - Super Cartoonish */}
        <div className="relative mb-10">
          <div className="bg-gradient-to-br from-orange-500 via-orange-600 to-red-500 rounded-[2rem] p-8 shadow-[0_12px_0_0_#ea580c] hover:shadow-[0_6px_0_0_#ea580c] hover:translate-y-2 transition-all duration-300 transform hover:scale-105 relative overflow-hidden">
            <div className="absolute -top-4 -right-4 w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-[2rem] flex items-center justify-center shadow-[0_8px_0_0_#16a34a] animate-bounce border-4 border-white" style={{ animationDuration: '2s' }}>
              <Zap className="w-8 h-8 text-white drop-shadow-lg" />
            </div>
            {/* Cartoon sparkles */}
            <div className="absolute top-4 left-4 text-3xl animate-spin" style={{ animationDuration: '4s' }}>⚡</div>
            <div className="absolute bottom-4 right-16 text-2xl animate-pulse">🔥</div>
            
            <h2 className="text-3xl font-black text-white text-center mb-8 uppercase tracking-wider drop-shadow-lg animate-pulse">
              TODAY'S CHALLENGE 🚀
            </h2>
            
            {/* Decorative blocks - More Cartoonish */}
            <div className="flex justify-center space-x-6 mb-8">
              <div className="w-20 h-20 bg-gradient-to-br from-orange-400 to-orange-500 rounded-[2rem] shadow-[0_8px_0_0_#fb923c] transform rotate-12 hover:rotate-0 transition-all duration-500 animate-bounce" style={{ animationDuration: '3s', animationDelay: '0s' }}></div>
              <div className="w-20 h-20 bg-gradient-to-br from-pink-400 to-pink-500 rounded-[2rem] shadow-[0_8px_0_0_#ec4899] transform -rotate-12 hover:rotate-0 transition-all duration-500 animate-bounce" style={{ animationDuration: '3s', animationDelay: '1s' }}></div>
            </div>
          </div>
        </div>

        {/* Scenario Card - Extra Cartoonish */}
        <div className="bg-gradient-to-br from-orange-400 via-orange-500 to-yellow-500 rounded-[2rem] p-8 mb-8 shadow-[0_10px_0_0_#fb923c] hover:shadow-[0_5px_0_0_#fb923c] hover:translate-y-2 transition-all duration-300 transform hover:scale-105 border-6 border-white relative">
          <div className="absolute -top-3 -right-3 text-3xl animate-spin" style={{ animationDuration: '5s' }}>🎬</div>
          <div className="flex items-center space-x-6 mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-orange-600 to-orange-700 rounded-[2rem] flex items-center justify-center shadow-[0_6px_0_0_#ea580c] transform hover:rotate-12 transition-all duration-300">
              <Play className="w-8 h-8 text-white drop-shadow-lg" />
            </div>
            <h3 className="text-2xl font-black text-white uppercase tracking-wide drop-shadow-lg">
              SCENARIO: MOVIE DATE GONE WRONG 💔
            </h3>
          </div>
          <p className="text-white font-bold text-lg drop-shadow-md leading-relaxed">
            I'll awkwardly pretend to ask you out to a movie. We'll practice casual conversation and reflexive verbs while navigating this hilariously uncomfortable situation. 😅
          </p>
        </div>

        {/* Learning Focus Card - Super Cartoonish */}
        <div className="bg-white rounded-[2rem] p-8 mb-8 shadow-[0_10px_0_0_#e5e7eb] hover:shadow-[0_5px_0_0_#e5e7eb] hover:translate-y-2 transition-all duration-300 transform hover:scale-105 border-6 border-purple-200 relative overflow-hidden">
          <div className="absolute top-4 right-4 text-2xl animate-pulse">📚</div>
          <div className="absolute bottom-4 left-4 text-2xl animate-bounce" style={{ animationDelay: '1s' }}>🎯</div>
          
          <div className="flex items-start space-x-6">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-[2rem] flex items-center justify-center flex-shrink-0 shadow-[0_6px_0_0_#9333ea] border-4 border-white transform hover:rotate-12 transition-all duration-300">
              <CheckCircle className="w-8 h-8 text-white drop-shadow-lg" />
            </div>
            <div>
              <h3 className="text-2xl font-black text-gray-800 mb-6 uppercase tracking-wide drop-shadow-sm">Learning Focus: 🎓</h3>
              <div className="flex flex-wrap gap-4">
                <span className="bg-gradient-to-r from-purple-200 to-purple-300 text-purple-900 px-6 py-3 rounded-[2rem] font-black text-base shadow-[0_6px_0_0_#c4b5fd] hover:shadow-[0_3px_0_0_#c4b5fd] hover:translate-y-1 transition-all duration-300 transform hover:scale-105 border-4 border-white">Reflexive Verbs 🔄</span>
                <span className="bg-gradient-to-r from-blue-200 to-blue-300 text-blue-900 px-6 py-3 rounded-[2rem] font-black text-base shadow-[0_6px_0_0_#93c5fd] hover:shadow-[0_3px_0_0_#93c5fd] hover:translate-y-1 transition-all duration-300 transform hover:scale-105 border-4 border-white">Casual Tone 😎</span>
                <span className="bg-gradient-to-r from-green-200 to-green-300 text-green-900 px-6 py-3 rounded-[2rem] font-black text-base shadow-[0_6px_0_0_#86efac] hover:shadow-[0_3px_0_0_#86efac] hover:translate-y-1 transition-all duration-300 transform hover:scale-105 border-4 border-white">Rejection Phrases 🙅</span>
              </div>
            </div>
          </div>
        </div>

        {/* Start Call Button - Ultra Cartoonish */}
        <Button 
          onClick={handleStartCall}
          disabled={isStartingCall}
          className="w-full bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 hover:from-orange-600 hover:via-red-600 hover:to-pink-600 text-white font-black py-8 rounded-[2rem] text-2xl shadow-[0_12px_0_0_#ea580c] hover:shadow-[0_6px_0_0_#ea580c] hover:translate-y-2 active:shadow-[0_2px_0_0_#ea580c] active:translate-y-4 transition-all duration-300 border-8 border-white disabled:opacity-50 disabled:cursor-not-allowed mb-8 transform hover:scale-105 relative overflow-hidden"
        >
          <Phone className="w-8 h-8 mr-4 animate-bounce" style={{ animationDuration: '2s' }} />
          {isStartingCall ? "Starting Call... 📞" : "START CALL 🚀"}
          <div className="absolute top-2 right-4 text-2xl animate-spin" style={{ animationDuration: '3s' }}>📱</div>
        </Button>

        {/* Info Card - Super Cartoonish */}
        <div className="bg-gradient-to-r from-yellow-300 via-yellow-400 to-orange-300 rounded-[2rem] p-6 shadow-[0_8px_0_0_#fbbf24] text-center border-6 border-white transform hover:scale-105 transition-all duration-300 relative">
          <div className="absolute -top-3 -left-3 text-2xl animate-bounce">⏰</div>
          <div className="absolute -top-3 -right-3 text-2xl animate-pulse">📞</div>
          <div className="flex items-center justify-center space-x-4 text-yellow-900">
            <Clock className="w-6 h-6 animate-spin" style={{ animationDuration: '4s' }} />
            <p className="font-black text-lg drop-shadow-sm">
              {isStartingCall ? "Initiating call... 🔄" : "You'll receive a call in ~30 seconds ⚡"}
            </p>
          </div>
        </div>
      </div>

      {/* Bottom Navigation - Extra Cartoonish */}
      <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-r from-white via-blue-50 to-white px-6 py-6 border-t-8 border-blue-200 shadow-[0_-8px_0_0_#dbeafe]">
        <div className="max-w-md mx-auto">
          <div className="flex justify-center space-x-4">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => onNavigate("home")}
              className="w-16 h-16 bg-gradient-to-br from-gray-200 to-gray-300 hover:from-gray-300 hover:to-gray-400 rounded-[2rem] text-gray-600 transition-all duration-300 shadow-[0_6px_0_0_#9ca3af] hover:shadow-[0_3px_0_0_#9ca3af] hover:translate-y-1 border-6 border-white transform hover:scale-110 hover:rotate-12"
            >
              <Home className="w-6 h-6" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => onNavigate("activity")}
              className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-[2rem] text-white shadow-[0_6px_0_0_#ea580c] border-6 border-white transform scale-110"
            >
              <Phone className="w-6 h-6 drop-shadow-lg" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => onNavigate("curriculum")}
              className="w-16 h-16 bg-gradient-to-br from-gray-200 to-gray-300 hover:from-gray-300 hover:to-gray-400 rounded-[2rem] text-gray-600 transition-all duration-300 shadow-[0_6px_0_0_#9ca3af] hover:shadow-[0_3px_0_0_#9ca3af] hover:translate-y-1 border-6 border-white transform hover:scale-110 hover:rotate-12"
            >
              <CheckCircle className="w-6 h-6" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => onNavigate("settings")}
              className="w-16 h-16 bg-gradient-to-br from-gray-200 to-gray-300 hover:from-gray-300 hover:to-gray-400 rounded-[2rem] text-gray-600 transition-all duration-300 shadow-[0_6px_0_0_#9ca3af] hover:shadow-[0_3px_0_0_#9ca3af] hover:translate-y-1 border-6 border-white transform hover:scale-110 hover:rotate-12"
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
