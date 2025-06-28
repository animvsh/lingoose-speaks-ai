
import { Card, CardContent } from "@/components/ui/card";
import { Phone, Clock, TrendingUp, Calendar, Star, Target, Zap, Award, Trophy, Flame } from "lucide-react";
import { useCurriculumAnalytics } from "@/hooks/useCurriculumAnalytics";

interface DashboardStatsProps {
  onNavigate: (view: string) => void;
}

const DashboardStats = ({ onNavigate }: DashboardStatsProps) => {
  const { data: analytics, isLoading } = useCurriculumAnalytics();

  const handleCardClick = (action?: () => void) => {
    // Add haptic feedback
    if ('vibrate' in navigator) {
      navigator.vibrate(30);
    }
    if (action) action();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-amber-50">
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
      <div className="px-6 space-y-6 pb-6 pt-8 overflow-visible">
        {/* Welcome Header */}
        <div className="text-center pt-4 animate-fade-in">
          <h2 className="text-3xl font-bold text-orange-600 mb-2 uppercase tracking-wide">
            WELCOME BACK!
          </h2>
          <p className="text-lg font-semibold text-gray-700">
            Ready to practice today?
          </p>
        </div>

        {/* Native Speaker Progress KPI */}
        <Card 
          className="bg-gradient-to-br from-purple-400 to-indigo-500 border-4 border-purple-600 rounded-2xl overflow-visible 
                     transform transition-all duration-150 ease-out 
                     hover:scale-102 active:scale-98
                     cursor-pointer select-none animate-fade-in" 
          style={{ animationDelay: '0.1s' }}
          onClick={() => handleCardClick(() => onNavigate('curriculum'))}
          onTouchStart={() => {
            if ('vibrate' in navigator) navigator.vibrate(25);
          }}
        >
          <CardContent className="p-6">
            <div className="text-center">
              <div className="w-20 h-20 bg-white/20 border-3 border-white/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Target className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-xl font-black text-white mb-2 uppercase tracking-wide">
                Native Speaker Progress
              </h3>
              <div className="text-5xl font-black text-white mb-2">{fluencyScore}%</div>
              <p className="text-purple-100 font-bold">
                {fluencyScore >= 80 ? "Almost there!" : fluencyScore >= 50 ? "Great progress!" : "Keep practicing!"}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Today's Activity Summary */}
        <Card 
          className="bg-gradient-to-br from-green-400 to-teal-500 border-4 border-green-600 rounded-2xl overflow-visible 
                     transform transition-all duration-150 ease-out 
                     hover:scale-102 active:scale-98
                     cursor-pointer select-none animate-fade-in" 
          style={{ animationDelay: '0.15s' }}
          onClick={() => handleCardClick(() => onNavigate('activity'))}
          onTouchStart={() => {
            if ('vibrate' in navigator) navigator.vibrate(25);
          }}
        >
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-white/20 border-3 border-white/30 rounded-2xl flex items-center justify-center flex-shrink-0">
                <Calendar className="w-8 h-8 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-xl font-black text-white mb-2 uppercase tracking-wide">
                  Today's Activity
                </h3>
                <p className="text-green-100 font-bold text-sm">
                  {totalCalls > 0 
                    ? `Continue your learning journey - ${currentStreak} day streak!`
                    : "Start your first conversation practice session"
                  }
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Start Learning Button */}
        <Card 
          className="bg-gradient-to-br from-orange-400 to-red-500 border-4 border-orange-600 rounded-2xl overflow-visible 
                     transform transition-all duration-150 ease-out 
                     hover:scale-105 active:scale-95
                     cursor-pointer select-none animate-fade-in shadow-2xl" 
          style={{ animationDelay: '0.2s' }}
          onClick={() => handleCardClick(() => onNavigate('activity'))}
          onTouchStart={() => {
            if ('vibrate' in navigator) navigator.vibrate(30);
          }}
        >
          <CardContent className="p-8">
            <div className="text-center">
              <div className="w-24 h-24 bg-white/20 border-4 border-white/30 rounded-3xl flex items-center justify-center mx-auto mb-6">
                <Zap className="w-12 h-12 text-white" />
              </div>
              <h3 className="text-3xl font-black text-white mb-4 uppercase tracking-wide">
                START LEARNING
              </h3>
              <p className="text-orange-100 font-bold text-lg">
                Begin your Hindi conversation practice now!
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats Row */}
        <div className="grid grid-cols-3 gap-4 overflow-visible">
          <div 
            className="bg-pink-300 border-4 border-pink-600 p-4 rounded-2xl text-center 
                       transform transition-all duration-150 ease-out 
                       hover:scale-105 active:scale-95
                       cursor-pointer select-none animate-fade-in overflow-visible" 
            style={{ animationDelay: '0.25s' }}
            onClick={() => handleCardClick()}
            onTouchStart={() => {
              if ('vibrate' in navigator) navigator.vibrate(25);
            }}
          >
            <div className="w-10 h-10 bg-pink-600 border-3 border-pink-800 rounded-xl flex items-center justify-center mx-auto mb-3
                           transition-transform duration-150 hover:scale-110">
              <Star className="w-5 h-5 text-white" />
            </div>
            <div className="text-2xl font-black text-pink-900">
              {avgRating > 0 ? avgRating : 'N/A'}
            </div>
            <div className="text-sm text-pink-800 font-bold uppercase">Avg Rating</div>
          </div>
          
          <div 
            className="bg-blue-300 border-4 border-blue-600 p-4 rounded-2xl text-center 
                       transform transition-all duration-150 ease-out 
                       hover:scale-105 active:scale-95
                       cursor-pointer select-none animate-fade-in overflow-visible" 
            style={{ animationDelay: '0.3s' }}
            onClick={() => handleCardClick(() => onNavigate('curriculum'))}
            onTouchStart={() => {
              if ('vibrate' in navigator) navigator.vibrate(25);
            }}
          >
            <div className="w-10 h-10 bg-blue-600 border-3 border-blue-800 rounded-xl flex items-center justify-center mx-auto mb-3
                           transition-transform duration-150 hover:scale-110">
              <Phone className="w-5 h-5 text-white" />
            </div>
            <div className="text-2xl font-black text-blue-900">
              {totalCalls}
            </div>
            <div className="text-sm text-blue-800 font-bold uppercase">Total Calls</div>
          </div>
          
          <div 
            className="bg-teal-300 border-4 border-teal-600 p-4 rounded-2xl text-center 
                       transform transition-all duration-150 ease-out 
                       hover:scale-105 active:scale-95
                       cursor-pointer select-none animate-fade-in overflow-visible" 
            style={{ animationDelay: '0.35s' }}
            onClick={() => handleCardClick()}
            onTouchStart={() => {
              if ('vibrate' in navigator) navigator.vibrate(25);
            }}
          >
            <div className="w-10 h-10 bg-teal-600 border-3 border-teal-800 rounded-xl flex items-center justify-center mx-auto mb-3
                           transition-transform duration-150 hover:scale-110">
              <Flame className="w-5 h-5 text-white" />
            </div>
            <div className="text-2xl font-black text-teal-900">{currentStreak}</div>
            <div className="text-sm text-teal-800 font-bold uppercase">Day Streak</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardStats;
