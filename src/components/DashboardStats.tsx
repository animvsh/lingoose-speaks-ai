
import { Card, CardContent } from "@/components/ui/card";
import { Phone, Clock, TrendingUp, Calendar, Star, Target, Zap, Award, Trophy, Flame } from "lucide-react";
import { useCurriculumAnalytics } from "@/hooks/useCurriculumAnalytics";
import { useCurrentActivity } from "@/hooks/useCurrentActivity";
import ProUpgradeCard from "@/components/ProUpgradeCard";
import SubscriptionStatusCard from "@/components/SubscriptionStatusCard";
import AppBar from "./AppBar";

interface DashboardStatsProps {
  onNavigate: (view: string) => void;
}

const DashboardStats = ({ onNavigate }: DashboardStatsProps) => {
  const { data: analytics, isLoading } = useCurriculumAnalytics();
  const { currentActivity, isLoading: isLoadingActivity } = useCurrentActivity();

  const handleCardClick = (action?: () => void) => {
    // Add haptic feedback
    if ('vibrate' in navigator) {
      navigator.vibrate(30);
    }
    if (action) action();
  };

  if (isLoading || isLoadingActivity) {
    return (
      <div className="min-h-screen bg-amber-50">
        <AppBar title="Dashboard" showBackButton={false} />
        <div className="px-6 pt-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-400 rounded-2xl flex items-center justify-center mx-auto mb-4 animate-pulse">
              <div className="w-8 h-8 bg-white rounded-full"></div>
            </div>
            <p className="text-gray-600 font-medium">Loading your progress...</p>
          </div>
        </div>
      </div>
    );
  }

  // Use analytics data or fallback to N/A
  const totalCalls = analytics?.totalCalls || 0;
  const talkTime = analytics?.talkTime || "0min";
  const fluencyScore = Math.round(analytics?.fluencyScore || 0);
  const currentStreak = analytics?.currentStreak || 0;
  const avgRating = Math.round(analytics?.avgRating || 0);

  return (
    <div className="min-h-screen bg-amber-50 overflow-visible">
      <AppBar title="Dashboard" showBackButton={false} />
      <div className="px-6 space-y-4 pb-6 pt-6 overflow-visible">
        {/* Welcome Header - Smaller */}
        <div className="text-center pt-2 animate-fade-in">
          <h2 className="text-2xl font-bold text-orange-600 mb-1 uppercase tracking-wide">
            WELCOME BACK!
          </h2>
          <p className="text-base font-semibold text-gray-700">
            Ready to practice today?
          </p>
        </div>

        {/* Native Speaker Progress KPI - Smaller */}
        <Card 
          className="bg-gradient-to-br from-purple-400 to-indigo-500 border-3 border-purple-600 rounded-2xl overflow-visible 
                     transform transition-all duration-150 ease-out 
                     hover:scale-102 active:scale-98
                     cursor-pointer select-none animate-fade-in" 
          style={{ animationDelay: '0.1s' }}
          onClick={() => handleCardClick(() => onNavigate('curriculum'))}
          onTouchStart={() => {
            if ('vibrate' in navigator) navigator.vibrate(25);
          }}
        >
          <CardContent className="p-4">
            <div className="text-center">
              <div className="w-12 h-12 bg-white/20 border-2 border-white/30 rounded-xl flex items-center justify-center mx-auto mb-2">
                <Target className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-black text-white mb-1 uppercase tracking-wide">
                Native Speaker Progress
              </h3>
              <div className="text-3xl font-black text-white mb-1">{fluencyScore}%</div>
              <p className="text-purple-100 font-bold text-sm">
                {fluencyScore >= 80 ? "Almost there!" : fluencyScore >= 50 ? "Great progress!" : "Keep practicing!"}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Today's Learning Activity - Combined with Start Learning */}
        <Card 
          className="bg-gradient-to-br from-blue-400 to-purple-500 border-3 border-blue-600 rounded-2xl overflow-visible 
                     transform transition-all duration-150 ease-out 
                     hover:scale-102 active:scale-95
                     cursor-pointer select-none animate-fade-in shadow-xl" 
          style={{ animationDelay: '0.15s' }}
          onClick={() => handleCardClick(() => onNavigate('activity'))}
          onTouchStart={() => {
            if ('vibrate' in navigator) navigator.vibrate(30);
          }}
        >
          <CardContent className="p-5">
            <div className="text-center">
              <div className="w-16 h-16 bg-white/20 border-3 border-white/30 rounded-2xl flex items-center justify-center mx-auto mb-3">
                <Zap className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-black text-white mb-2 uppercase tracking-wide">
                TODAY'S ACTIVITY
              </h3>
              
              {currentActivity && (
                <div className="bg-white/10 rounded-xl p-3 mb-3">
                  <h4 className="text-lg font-bold text-white mb-1">
                    {currentActivity.name}
                  </h4>
                  <p className="text-blue-100 font-medium text-sm">
                    {currentActivity.description}
                  </p>
                  <div className="flex justify-center items-center mt-2 text-blue-100 text-sm font-bold">
                    <Clock className="w-4 h-4 mr-1" />
                    {currentActivity.estimated_duration_minutes || 15} min
                  </div>
                </div>
              )}
              
              <p className="text-blue-100 font-bold">
                {totalCalls > 0 
                  ? `Continue your ${currentStreak} day streak!`
                  : "Start your Hindi conversation practice"
                }
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats Row - Smaller */}
        <div className="grid grid-cols-3 gap-3 overflow-visible">
          <div 
            className="bg-pink-300 border-3 border-pink-600 p-3 rounded-xl text-center 
                       transform transition-all duration-150 ease-out 
                       hover:scale-105 active:scale-95
                       cursor-pointer select-none animate-fade-in overflow-visible" 
            style={{ animationDelay: '0.25s' }}
            onClick={() => handleCardClick()}
            onTouchStart={() => {
              if ('vibrate' in navigator) navigator.vibrate(25);
            }}
          >
            <div className="w-8 h-8 bg-pink-600 border-2 border-pink-800 rounded-lg flex items-center justify-center mx-auto mb-2
                           transition-transform duration-150 hover:scale-110">
              <Star className="w-4 h-4 text-white" />
            </div>
            <div className="text-xl font-black text-pink-900">
              {avgRating > 0 ? avgRating : 'N/A'}
            </div>
            <div className="text-xs text-pink-800 font-bold uppercase">Avg Rating</div>
          </div>
          
          <div 
            className="bg-blue-300 border-3 border-blue-600 p-3 rounded-xl text-center 
                       transform transition-all duration-150 ease-out 
                       hover:scale-105 active:scale-95
                       cursor-pointer select-none animate-fade-in overflow-visible" 
            style={{ animationDelay: '0.3s' }}
            onClick={() => handleCardClick(() => onNavigate('curriculum'))}
            onTouchStart={() => {
              if ('vibrate' in navigator) navigator.vibrate(25);
            }}
          >
            <div className="w-8 h-8 bg-blue-600 border-2 border-blue-800 rounded-lg flex items-center justify-center mx-auto mb-2
                           transition-transform duration-150 hover:scale-110">
              <Phone className="w-4 h-4 text-white" />
            </div>
            <div className="text-xl font-black text-blue-900">
              {totalCalls}
            </div>
            <div className="text-xs text-blue-800 font-bold uppercase">Total Calls</div>
          </div>
          
          <div 
            className="bg-teal-300 border-3 border-teal-600 p-3 rounded-xl text-center 
                       transform transition-all duration-150 ease-out 
                       hover:scale-105 active:scale-95
                       cursor-pointer select-none animate-fade-in overflow-visible" 
            style={{ animationDelay: '0.35s' }}
            onClick={() => handleCardClick()}
            onTouchStart={() => {
              if ('vibrate' in navigator) navigator.vibrate(25);
            }}
          >
            <div className="w-8 h-8 bg-teal-600 border-2 border-teal-800 rounded-lg flex items-center justify-center mx-auto mb-2
                           transition-transform duration-150 hover:scale-110">
              <Flame className="w-4 h-4 text-white" />
            </div>
            <div className="text-xl font-black text-teal-900">{currentStreak}</div>
            <div className="text-xs text-teal-800 font-bold uppercase">Day Streak</div>
          </div>
        </div>

        {/* Subscription Management Section */}
        <div className="space-y-4 animate-fade-in" style={{ animationDelay: '0.4s' }}>
          <ProUpgradeCard />
          <SubscriptionStatusCard />
        </div>
      </div>
    </div>
  );
};

export default DashboardStats;
