
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
      <div className="min-h-screen hindi-bg font-nunito">
        <AppBar title="Dashboard" showBackButton={false} />
        <div className="px-4 pt-6">
          <div className="text-center">
            <div className="w-16 h-16 rounded-3xl border-2 border-handdrawn bg-white flex items-center justify-center mx-auto mb-4 animate-gentle-float shadow-lg">
              <div className="w-8 h-8 bg-primary rounded-full animate-pulse"></div>
            </div>
            <p className="text-brown-700 font-bold font-nunito">Loading your progress...</p>
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
    <div className="min-h-screen hindi-bg overflow-visible font-nunito">
      <AppBar title="Dashboard" showBackButton={false} />
      <div className="px-4 space-y-6 pb-6 pt-6 overflow-visible">
        {/* Welcome Header */}
        <div className="text-center pt-2 animate-fade-in">
          <h2 className="text-3xl font-black text-brown-900 mb-2 uppercase tracking-wide font-nunito">
            WELCOME BACK!
          </h2>
          <p className="text-lg font-bold text-brown-700 font-nunito">
            Ready to practice today?
          </p>
        </div>

        {/* Native Speaker Progress KPI */}
        <div 
          className="rounded-3xl border-2 border-handdrawn bg-white/90 p-6 shadow-lg hover-lift cursor-pointer animate-fade-in"
          style={{ animationDelay: '0.1s' }}
          onClick={() => handleCardClick(() => onNavigate('curriculum'))}
          onTouchStart={() => {
            if ('vibrate' in navigator) navigator.vibrate(25);
          }}
        >
          <div className="text-center">
            <div className="w-16 h-16 bg-primary rounded-3xl border-2 border-handdrawn flex items-center justify-center mx-auto mb-4 shadow-lg">
              <Target className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-black text-brown-900 mb-3 uppercase tracking-wide font-nunito">
              Native Speaker Progress
            </h3>
            <div className="text-4xl font-black text-primary mb-2 font-nunito">{fluencyScore}%</div>
            <p className="text-brown-700 font-bold font-nunito">
              {fluencyScore >= 80 ? "Almost there!" : fluencyScore >= 50 ? "Great progress!" : "Keep practicing!"}
            </p>
          </div>
        </div>

        {/* Today's Learning Activity */}
        <div 
          className="rounded-3xl border-2 border-handdrawn bg-white/90 p-6 shadow-lg hover-lift cursor-pointer animate-fade-in"
          style={{ animationDelay: '0.15s' }}
          onClick={() => handleCardClick(() => onNavigate('activity'))}
          onTouchStart={() => {
            if ('vibrate' in navigator) navigator.vibrate(30);
          }}
        >
          <div className="text-center">
            <div className="w-20 h-20 bg-primary rounded-3xl border-2 border-handdrawn flex items-center justify-center mx-auto mb-4 shadow-lg">
              <Zap className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-2xl font-black text-brown-900 mb-3 uppercase tracking-wide font-nunito">
              TODAY'S ACTIVITY
            </h3>
            
            {currentActivity && (
              <div className="bg-secondary rounded-3xl border-2 border-handdrawn p-4 mb-4">
                <h4 className="text-lg font-black text-brown-900 mb-2 font-nunito">
                  {currentActivity.name}
                </h4>
                <p className="text-brown-700 font-bold text-sm font-nunito">
                  {currentActivity.description}
                </p>
                <div className="flex justify-center items-center mt-3 text-brown-700 text-sm font-bold font-nunito">
                  <Clock className="w-4 h-4 mr-2" />
                  {currentActivity.estimated_duration_minutes || 15} min
                </div>
              </div>
            )}
            
            <p className="text-brown-700 font-bold font-nunito">
              {totalCalls > 0 
                ? `Continue your ${currentStreak} day streak!`
                : "Start your Hindi conversation practice"
              }
            </p>
          </div>
        </div>

        {/* Quick Stats Row */}
        <div className="grid grid-cols-3 gap-4 overflow-visible">
          <div 
            className="rounded-3xl border-2 border-handdrawn bg-white/90 p-4 text-center shadow-lg hover-lift cursor-pointer animate-fade-in"
            style={{ animationDelay: '0.25s' }}
            onClick={() => handleCardClick()}
            onTouchStart={() => {
              if ('vibrate' in navigator) navigator.vibrate(25);
            }}
          >
            <div className="w-12 h-12 bg-primary rounded-2xl border-2 border-handdrawn flex items-center justify-center mx-auto mb-3 shadow-sm">
              <Star className="w-6 h-6 text-white" />
            </div>
            <div className="text-2xl font-black text-brown-900 font-nunito">
              {avgRating > 0 ? avgRating : 'N/A'}
            </div>
            <div className="text-xs text-brown-700 font-bold uppercase font-nunito">Avg Rating</div>
          </div>
          
          <div 
            className="rounded-3xl border-2 border-handdrawn bg-white/90 p-4 text-center shadow-lg hover-lift cursor-pointer animate-fade-in"
            style={{ animationDelay: '0.3s' }}
            onClick={() => handleCardClick(() => onNavigate('curriculum'))}
            onTouchStart={() => {
              if ('vibrate' in navigator) navigator.vibrate(25);
            }}
          >
            <div className="w-12 h-12 bg-primary rounded-2xl border-2 border-handdrawn flex items-center justify-center mx-auto mb-3 shadow-sm">
              <Phone className="w-6 h-6 text-white" />
            </div>
            <div className="text-2xl font-black text-brown-900 font-nunito">
              {totalCalls}
            </div>
            <div className="text-xs text-brown-700 font-bold uppercase font-nunito">Total Calls</div>
          </div>
          
          <div 
            className="rounded-3xl border-2 border-handdrawn bg-white/90 p-4 text-center shadow-lg hover-lift cursor-pointer animate-fade-in"
            style={{ animationDelay: '0.35s' }}
            onClick={() => handleCardClick()}
            onTouchStart={() => {
              if ('vibrate' in navigator) navigator.vibrate(25);
            }}
          >
            <div className="w-12 h-12 bg-primary rounded-2xl border-2 border-handdrawn flex items-center justify-center mx-auto mb-3 shadow-sm">
              <Flame className="w-6 h-6 text-white" />
            </div>
            <div className="text-2xl font-black text-brown-900 font-nunito">{currentStreak}</div>
            <div className="text-xs text-brown-700 font-bold uppercase font-nunito">Day Streak</div>
          </div>
        </div>

        {/* Subscription Management Section */}
        <div className="space-y-4 animate-fade-in" style={{ animationDelay: '0.4s' }}>
          <SubscriptionStatusCard />
        </div>
      </div>
    </div>
  );
};

export default DashboardStats;
