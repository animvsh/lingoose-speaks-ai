
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Phone, Clock, TrendingUp, Calendar, Star, Target, Zap, Award, Trophy, Flame, Home, CheckCircle, Settings } from "lucide-react";
import { useCurriculumAnalytics } from "@/hooks/useCurriculumAnalytics";
import AppBar from "./AppBar";

interface DashboardStatsProps {
  onNavigate: (view: string) => void;
}

const DashboardStats = ({ onNavigate }: DashboardStatsProps) => {
  const { data: analytics, isLoading } = useCurriculumAnalytics();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-amber-50 pb-24">
        <AppBar title="DASHBOARD" showBackButton={false} />
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
    <div className="min-h-screen bg-amber-50 pb-24">
      <AppBar title="DASHBOARD" showBackButton={false} />
      
      <div className="px-6 space-y-6">
        {/* Welcome Header */}
        <div className="text-center pt-4">
          <h2 className="text-3xl font-bold text-orange-600 mb-2 uppercase tracking-wide">
            WELCOME BACK!
          </h2>
          <p className="text-lg font-semibold text-gray-700">
            Ready to practice today?
          </p>
        </div>

        {/* Main Stats Grid - 2x2 layout with cartoon style */}
        <div className="grid grid-cols-2 gap-4">
          {/* Total Calls - Bright Orange */}
          <Card className="bg-orange-300 border-4 border-orange-600 rounded-2xl overflow-hidden">
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="w-12 h-12 bg-orange-600 border-3 border-orange-800 rounded-xl flex items-center justify-center">
                  <Phone className="w-6 h-6 text-white" />
                </div>
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-black text-orange-900 uppercase tracking-wide">Total Calls</h3>
                <div className="text-4xl font-black text-orange-900">{totalCalls}</div>
                <div className="flex items-center text-sm">
                  <span className="text-orange-800 font-bold">
                    {totalCalls > 0 ? `Keep it up!` : `Start practicing!`}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Talk Time - Bright Green */}
          <Card className="bg-green-300 border-4 border-green-600 rounded-2xl overflow-hidden">
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="w-12 h-12 bg-green-600 border-3 border-green-800 rounded-xl flex items-center justify-center">
                  <Clock className="w-6 h-6 text-white" />
                </div>
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-black text-green-900 uppercase tracking-wide">Talk Time</h3>
                <div className="text-4xl font-black text-green-900">{talkTime}</div>
                <div className="flex items-center text-sm">
                  <span className="text-green-800 font-bold">
                    {totalCalls > 0 ? `Total practice time` : `No practice yet`}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Native Fluency Score - Bright Yellow */}
          <Card className="bg-yellow-300 border-4 border-yellow-600 rounded-2xl overflow-hidden">
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="w-12 h-12 bg-yellow-600 border-3 border-yellow-800 rounded-xl flex items-center justify-center">
                  <Award className="w-6 h-6 text-white" />
                </div>
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-black text-yellow-900 uppercase tracking-wide">Native Fluency</h3>
                <div className="text-4xl font-black text-yellow-900">{fluencyScore}%</div>
                <div className="flex items-center text-sm">
                  <span className="text-yellow-800 font-bold">
                    {fluencyScore > 0 ? `AI-powered score` : `Start practicing!`}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Current Streak - Bright Red */}
          <Card className="bg-red-300 border-4 border-red-600 rounded-2xl overflow-hidden">
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="w-12 h-12 bg-red-600 border-3 border-red-800 rounded-xl flex items-center justify-center">
                  <Flame className="w-6 h-6 text-white" />
                </div>
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-black text-red-900 uppercase tracking-wide">Current Streak</h3>
                <div className="text-4xl font-black text-red-900">{currentStreak}</div>
                <div className="flex items-center text-sm">
                  <span className="text-red-800 font-bold">
                    {currentStreak > 0 ? `days strong!` : `Start your streak!`}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Achievement Banner - Cartoon style */}
        <Card className="bg-purple-300 border-4 border-purple-600 rounded-2xl overflow-hidden">
          <CardContent className="p-4">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-purple-600 border-3 border-purple-800 rounded-2xl flex items-center justify-center">
                <Trophy className="w-8 h-8 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-black text-purple-900 mb-2 uppercase tracking-wide">
                  {totalCalls > 0 ? `Great Progress! 🎉` : `Ready to Start? 🚀`}
                </h3>
                <p className="text-purple-800 font-bold">
                  {totalCalls > 0 
                    ? `You've completed ${totalCalls} practice sessions!`
                    : `Start your first conversation to see your progress here!`
                  }
                </p>
              </div>
              <div className="text-right">
                <div className="text-3xl font-black text-purple-900">{avgRating > 0 ? avgRating : 'N/A'}</div>
                <div className="text-sm text-purple-800 font-bold uppercase">avg rating</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats Row - Bright cartoon colors */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-pink-300 border-4 border-pink-600 p-4 rounded-2xl text-center">
            <div className="w-10 h-10 bg-pink-600 border-3 border-pink-800 rounded-xl flex items-center justify-center mx-auto mb-3">
              <Star className="w-5 h-5 text-white" />
            </div>
            <div className="text-2xl font-black text-pink-900">
              {avgRating > 0 ? avgRating : 'N/A'}
            </div>
            <div className="text-sm text-pink-800 font-bold uppercase">Avg Rating</div>
          </div>
          <div className="bg-blue-300 border-4 border-blue-600 p-4 rounded-2xl text-center">
            <div className="w-10 h-10 bg-blue-600 border-3 border-blue-800 rounded-xl flex items-center justify-center mx-auto mb-3">
              <Target className="w-5 h-5 text-white" />
            </div>
            <div className="text-2xl font-black text-blue-900">
              {Math.round((fluencyScore / 100) * 100)}%
            </div>
            <div className="text-sm text-blue-800 font-bold uppercase">Goal Progress</div>
          </div>
          <div className="bg-teal-300 border-4 border-teal-600 p-4 rounded-2xl text-center">
            <div className="w-10 h-10 bg-teal-600 border-3 border-teal-800 rounded-xl flex items-center justify-center mx-auto mb-3">
              <Calendar className="w-5 h-5 text-white" />
            </div>
            <div className="text-2xl font-black text-teal-900">{currentStreak}</div>
            <div className="text-sm text-teal-800 font-bold uppercase">Days Active</div>
          </div>
        </div>
      </div>

      {/* Bottom Navigation - Fixed positioning */}
      <div className="fixed bottom-0 left-0 right-0 bg-amber-50 border-t border-gray-100 z-50">
        <div className="max-w-md mx-auto px-6 py-4">
          <div className="flex justify-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onNavigate("home")}
              className="w-14 h-14 bg-blue-400 rounded-2xl text-white"
            >
              <Home className="w-6 h-6" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onNavigate("activity")}
              className="w-14 h-14 bg-gray-200 rounded-2xl text-gray-600"
            >
              <Phone className="w-6 h-6" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onNavigate("curriculum")}
              className="w-14 h-14 bg-gray-200 rounded-2xl text-gray-600"
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

export default DashboardStats;
