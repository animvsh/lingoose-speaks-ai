import { Button } from "@/components/ui/button";
import { Phone, Clock, CheckCircle, Home, Settings, ArrowLeft, Play, Mic, Users, MapPin, Coffee, Briefcase, Heart, ShoppingCart, Plane, GraduationCap, Car, Music, GameController2, Book } from "lucide-react";
import DuckMascot from "./DuckMascot";
import { useState } from "react";
import AppBar from "./AppBar";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useUserActivityRatings } from "@/hooks/useUserActivityRatings";
import { format } from "date-fns";
import { useAuth } from "@/contexts/AuthContext";

interface ActivityCardProps {
  onNavigate: (view: string) => void;
}

const ActivityCard = ({ onNavigate }: ActivityCardProps) => {
  const [isStartingCall, setIsStartingCall] = useState(false);
  const { toast } = useToast();
  const { ratings } = useUserActivityRatings();
  const { user } = useAuth();

  // Get the most recent activity rating
  const lastActivity = ratings?.[0];

  const handleStartCall = async () => {
    if (!user?.user_metadata?.phone_number) {
      toast({
        title: "❌ Phone Number Required",
        description: "Please add your phone number in profile settings to start practice sessions.",
        variant: "destructive",
      });
      return;
    }

    setIsStartingCall(true);
    try {
      toast({
        title: "🎯 Practice Session Starting!",
        description: "Connecting you to your hotel check-in scenario...",
        className: "border-2 border-blue-400 bg-blue-50 text-blue-800",
      });

      const phoneNumber = user.user_metadata.phone_number;
      
      // Call the Supabase Edge Function to start the VAPI call
      const { data, error } = await supabase.functions.invoke('start-vapi-call', {
        body: { 
          phoneNumber: phoneNumber,
          userId: user.id,
          topic: "Hotel check-in conversation practice"
        }
      });

      if (error) {
        console.error('Error starting call:', error);
        toast({
          title: "❌ Connection Failed",
          description: error.message || "Failed to start practice session. Please try again.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "📞 Call Connected!",
          description: "Your practice session is now live. Good luck!",
          className: "border-2 border-green-400 bg-green-50 text-green-800",
        });
      }
    } catch (error) {
      console.error('Error starting call:', error);
      toast({
        title: "❌ Connection Failed",
        description: "Failed to start practice session. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsStartingCall(false);
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
        }`}
      />
    ));
  };

  return (
    <div className="min-h-screen bg-amber-50 pb-24">
      <AppBar 
        title="PRACTICE HUB" 
        onBack={() => onNavigate("home")} 
        showBackButton={true} 
      />

      <div className="px-6 space-y-6">
        {/* Welcome Section */}
        <div className="text-center mb-8">
          <h2 className="text-4xl font-bold text-orange-600 mb-2 uppercase tracking-wide">
            WELCOME BACK!
          </h2>
          <p className="text-xl font-semibold text-gray-700">
            Ready for today's Hindi adventure?
          </p>
        </div>

        {/* Last Activity Panel */}
        {lastActivity && (
          <div className="bg-purple-400 rounded-3xl p-6 border-4 border-purple-500 mb-8">
            <div className="flex items-center mb-4">
              <div className="w-14 h-14 bg-purple-600 rounded-2xl flex items-center justify-center mr-4">
                <CheckCircle className="w-7 h-7 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-white uppercase tracking-wide">
                  LAST COMPLETED
                </h3>
                <p className="text-purple-100 font-medium text-sm">
                  {lastActivity.activities.name}
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-600 rounded-2xl flex flex-col items-center justify-center border-2 border-purple-700">
                  <div className="text-2xl font-bold text-white">{lastActivity.rating}</div>
                  <div className="text-xs text-purple-100 font-medium">STARS</div>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="bg-purple-300 rounded-2xl p-3 text-center border-2 border-purple-400">
                <div className="w-8 h-8 bg-purple-600 rounded-xl flex items-center justify-center mx-auto mb-2">
                  <Clock className="w-4 h-4 text-white" />
                </div>
                <div className="text-sm font-bold text-purple-800">
                  {lastActivity.duration_seconds ? `${Math.round(lastActivity.duration_seconds / 60)}MIN` : 'N/A'}
                </div>
                <div className="text-xs text-purple-700">duration</div>
              </div>
              <div className="bg-purple-300 rounded-2xl p-3 text-center border-2 border-purple-400">
                <div className="w-8 h-8 bg-purple-600 rounded-xl flex items-center justify-center mx-auto mb-2">
                  <Target className="w-4 h-4 text-white" />
                </div>
                <div className="text-sm font-bold text-purple-800">
                  {format(new Date(lastActivity.completed_at), 'MMM d')}
                </div>
                <div className="text-xs text-purple-700">completed</div>
              </div>
            </div>

            {/* Rating Stars */}
            <div className="flex items-center justify-center space-x-1">
              {renderStars(lastActivity.rating)}
            </div>
          </div>
        )}

        {/* Today's Challenge */}
        <div className="bg-blue-400 rounded-3xl p-6 border-4 border-blue-500 mb-8">
          <div className="flex items-center mb-4">
            <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center mr-4">
              <Phone className="w-7 h-7 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-white uppercase tracking-wide">
                TODAY'S CHALLENGE
              </h3>
              <p className="text-blue-100 font-medium text-sm">
                Hotel check-in conversation 🏨
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 rounded-2xl flex flex-col items-center justify-center border-2 border-blue-700">
                <div className="text-2xl font-bold text-white">15</div>
                <div className="text-xs text-blue-100 font-medium">MIN</div>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-3 mb-6">
            <div className="bg-blue-300 rounded-2xl p-3 text-center border-2 border-blue-400">
              <div className="w-8 h-8 bg-blue-600 rounded-xl flex items-center justify-center mx-auto mb-2">
                <Users className="w-4 h-4 text-white" />
              </div>
              <div className="text-sm font-bold text-blue-800">2-PERSON</div>
              <div className="text-xs text-blue-700">dialogue</div>
            </div>
            <div className="bg-blue-300 rounded-2xl p-3 text-center border-2 border-blue-400">
              <div className="w-8 h-8 bg-blue-600 rounded-xl flex items-center justify-center mx-auto mb-2">
                <Star className="w-4 h-4 text-white" />
              </div>
              <div className="text-sm font-bold text-blue-800">+50 XP</div>
              <div className="text-xs text-blue-700">reward</div>
            </div>
          </div>
          
          <Button 
            onClick={handleStartCall}
            disabled={isStartingCall}
            className="w-full bg-white hover:bg-blue-50 text-blue-600 font-bold py-4 text-lg rounded-2xl border-4 border-white transition-all duration-300"
          >
            {isStartingCall ? (
              <>
                <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mr-3"></div>
                STARTING...
              </>
            ) : (
              <>
                ⚡ START PRACTICE SESSION
              </>
            )}
          </Button>
        </div>

        {/* Learning Progress Tree */}
        <LearningProgressTree />
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
              className="w-14 h-14 bg-blue-400 rounded-2xl text-white"
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
