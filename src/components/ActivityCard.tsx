
import { Button } from "@/components/ui/button";
import { Home, Phone, CheckCircle, Settings, ArrowLeft, Star, Clock, Users, Target, Trophy, Flame, Calendar, TrendingUp } from "lucide-react";
import LearningProgressTree from "./LearningProgressTree";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useUserActivityRatings } from "@/hooks/useUserActivityRatings";

interface ActivityCardProps {
  onNavigate: (view: string) => void;
}

const ActivityCard = ({ onNavigate }: ActivityCardProps) => {
  const [isStartingCall, setIsStartingCall] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();
  const { ratings } = useUserActivityRatings();

  const handleStartCall = async () => {
    setIsStartingCall(true);
    try {
      // Simulate call initiation
      toast({
        title: "🎯 Practice Session Starting!",
        description: "Connecting you to your hotel check-in scenario...",
        className: "border-2 border-blue-400 bg-blue-50 text-blue-800",
      });
      
      // In real implementation, you would call the VAPI function here
      // const { data, error } = await supabase.functions.invoke('start-vapi-call', {
      //   body: { scenario: 'hotel-checkin' }
      // });
      
      setTimeout(() => {
        toast({
          title: "📞 Call Connected!",
          description: "Your practice session is now live. Good luck!",
          className: "border-2 border-green-400 bg-green-50 text-green-800",
        });
        setIsStartingCall(false);
      }, 2000);
      
    } catch (error) {
      console.error('Error starting call:', error);
      toast({
        title: "❌ Connection Failed",
        description: "Failed to start practice session. Please try again.",
        variant: "destructive",
      });
      setIsStartingCall(false);
    }
  };

  // Get recent activity records
  const recentActivities = ratings?.slice(0, 3) || [];

  const getRatingColor = (rating: number) => {
    if (rating >= 90) return "text-green-600 bg-green-100";
    if (rating >= 75) return "text-blue-600 bg-blue-100";
    if (rating >= 60) return "text-orange-600 bg-orange-100";
    return "text-red-600 bg-red-100";
  };

  const getRatingEmoji = (rating: number) => {
    if (rating >= 90) return "🌟";
    if (rating >= 75) return "⭐";
    if (rating >= 60) return "👍";
    return "💪";
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-amber-50 pb-24">
      {/* Header */}
      <div className="px-6 pt-8 pb-6">
        <div className="flex items-center justify-between">
          <Button
            onClick={() => onNavigate("home")}
            className="w-12 h-12 bg-white hover:bg-gray-50 rounded-xl text-gray-700 shadow-sm border border-gray-200"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-2xl font-bold text-gray-900 uppercase tracking-wide">
            PRACTICE HUB
          </h1>
          <div className="w-12 h-12"></div>
        </div>
      </div>

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

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          {/* Total Calls */}
          <div className="bg-orange-400 rounded-3xl p-6 border-4 border-orange-500">
            <div className="w-12 h-12 bg-orange-600 rounded-2xl flex items-center justify-center mb-4">
              <Phone className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-sm font-bold text-orange-800 uppercase tracking-wide mb-1">
              TOTAL CALLS
            </h3>
            <div className="text-4xl font-bold text-orange-900 mb-2">{ratings?.length || 47}</div>
            <div className="flex items-center text-orange-700 text-sm font-medium">
              <span className="mr-1">📈</span>
              +3 this week
            </div>
          </div>

          {/* Talk Time */}
          <div className="bg-green-400 rounded-3xl p-6 border-4 border-green-500">
            <div className="w-12 h-12 bg-green-600 rounded-2xl flex items-center justify-center mb-4">
              <Clock className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-sm font-bold text-green-800 uppercase tracking-wide mb-1">
              TALK TIME
            </h3>
            <div className="text-4xl font-bold text-green-900 mb-2">6.2h</div>
            <div className="flex items-center text-green-700 text-sm font-medium">
              <span className="mr-1">📈</span>
              +45min this week
            </div>
          </div>

          {/* Fluency Score */}
          <div className="bg-yellow-400 rounded-3xl p-6 border-4 border-yellow-500">
            <div className="w-12 h-12 bg-yellow-600 rounded-2xl flex items-center justify-center mb-4">
              <Trophy className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-sm font-bold text-yellow-800 uppercase tracking-wide mb-1">
              FLUENCY SCORE
            </h3>
            <div className="text-4xl font-bold text-yellow-900 mb-2">73%</div>
            <div className="flex items-center text-yellow-700 text-sm font-medium">
              <span className="mr-1">📈</span>
              +8% this month
            </div>
          </div>

          {/* Current Streak */}
          <div className="bg-red-400 rounded-3xl p-6 border-4 border-red-500">
            <div className="w-12 h-12 bg-red-600 rounded-2xl flex items-center justify-center mb-4">
              <Flame className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-sm font-bold text-red-800 uppercase tracking-wide mb-1">
              CURRENT STREAK
            </h3>
            <div className="text-4xl font-bold text-red-900 mb-2">12</div>
            <div className="flex items-center text-red-700 text-sm font-medium">
              <span className="mr-1">🔥</span>
              days strong!
            </div>
          </div>
        </div>

        {/* Recent Activity Records */}
        {recentActivities.length > 0 && (
          <div className="bg-white rounded-3xl p-6 border-4 border-gray-200 mb-8">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-purple-400 rounded-2xl flex items-center justify-center mr-4">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-800 uppercase tracking-wide">
                  RECENT SESSIONS 📊
                </h3>
                <p className="text-gray-600 font-medium text-sm">Your latest practice results</p>
              </div>
            </div>
            
            <div className="space-y-4">
              {recentActivities.map((activity, index) => (
                <div key={activity.id} className="bg-gray-50 rounded-2xl p-4 border-2 border-gray-100">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center">
                      <div className={`w-8 h-8 rounded-xl flex items-center justify-center mr-3 text-sm font-bold ${getRatingColor(activity.rating)}`}>
                        {getRatingEmoji(activity.rating)}
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-800 text-sm">
                          {activity.activities?.name || 'Practice Session'}
                        </h4>
                        <p className="text-xs text-gray-500">
                          {activity.completed_at ? formatDate(activity.completed_at) : 'Recently'}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`text-lg font-bold ${getRatingColor(activity.rating).split(' ')[0]}`}>
                        {activity.rating}%
                      </div>
                      {activity.duration_seconds && (
                        <div className="text-xs text-gray-500">
                          {Math.round(activity.duration_seconds / 60)}min
                        </div>
                      )}
                    </div>
                  </div>
                  {activity.feedback_notes && (
                    <p className="text-xs text-gray-600 mt-2 italic">
                      "{activity.feedback_notes}"
                    </p>
                  )}
                </div>
              ))}
            </div>
            
            <Button 
              onClick={() => onNavigate("progress")}
              className="w-full mt-4 bg-purple-400 hover:bg-purple-500 text-white font-bold py-3 text-base rounded-2xl border-4 border-purple-500"
            >
              VIEW ALL SESSIONS 📈
            </Button>
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

        {/* Learning Progress Tree (Map Style) */}
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
