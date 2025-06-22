
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Phone, Clock, TrendingUp, Calendar, Star, Target, Zap, Award, Trophy, Flame } from "lucide-react";
import { useCallLogs } from "@/hooks/useCallLogs";

const DashboardStats = () => {
  const { data: callLogs = [] } = useCallLogs();
  
  // Calculate real stats from call logs
  const totalCalls = callLogs.length;
  const totalTalkTime = callLogs.reduce((acc, log) => acc + (log.duration || 0), 0);
  const totalHours = Math.floor(totalTalkTime / 3600);
  const totalMinutes = Math.floor((totalTalkTime % 3600) / 60);
  const talkTimeDisplay = totalHours > 0 ? `${totalHours}.${Math.floor(totalMinutes/6)}h` : `${totalMinutes}m`;
  
  // Calculate streak (consecutive days with calls)
  const today = new Date();
  let currentStreak = 0;
  const sortedLogs = [...callLogs].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  
  for (let i = 0; i < 30; i++) { // Check last 30 days
    const targetDate = new Date(today);
    targetDate.setDate(today.getDate() - i);
    const dateStr = targetDate.toDateString();
    
    const hasCallOnDate = sortedLogs.some(log => 
      new Date(log.created_at).toDateString() === dateStr
    );
    
    if (hasCallOnDate) {
      currentStreak++;
    } else if (i > 0) { // Allow today to not have a call yet
      break;
    }
  }
  
  // Calculate this week's calls
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(today.getDate() - 7);
  const thisWeekCalls = callLogs.filter(log => 
    new Date(log.created_at) >= oneWeekAgo
  ).length;
  
  // Calculate fluency score based on call frequency and duration
  const avgCallDuration = totalCalls > 0 ? totalTalkTime / totalCalls : 0;
  const fluencyScore = Math.min(100, Math.floor(
    (totalCalls * 2) + // 2 points per call
    (avgCallDuration / 60) + // 1 point per minute average
    (currentStreak * 3) // 3 points per streak day
  ));
  
  // Calculate active days
  const uniqueDays = new Set(
    callLogs.map(log => new Date(log.created_at).toDateString())
  ).size;

  return (
    <div className="space-y-6 mb-6">
      {/* Main Stats Grid - 2x2 layout with cartoon style */}
      <div className="grid grid-cols-2 gap-4">
        {/* Total Calls - Bright Orange */}
        <Card className="bg-orange-300 border-4 border-orange-600 rounded-2xl overflow-hidden transform hover:rotate-1 transition-transform duration-200">
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
                <TrendingUp className="w-4 h-4 text-green-700 mr-1" />
                <span className="text-green-800 font-bold">+{thisWeekCalls} this week</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Talk Time - Bright Green */}
        <Card className="bg-green-300 border-4 border-green-600 rounded-2xl overflow-hidden transform hover:-rotate-1 transition-transform duration-200">
          <CardContent className="p-4">
            <div className="flex items-start justify-between mb-3">
              <div className="w-12 h-12 bg-green-600 border-3 border-green-800 rounded-xl flex items-center justify-center">
                <Clock className="w-6 h-6 text-white" />
              </div>
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-black text-green-900 uppercase tracking-wide">Talk Time</h3>
              <div className="text-4xl font-black text-green-900">{talkTimeDisplay}</div>
              <div className="flex items-center text-sm">
                <TrendingUp className="w-4 h-4 text-green-700 mr-1" />
                <span className="text-green-800 font-bold">Total sessions</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Fluency Score - Bright Yellow */}
        <Card className="bg-yellow-300 border-4 border-yellow-600 rounded-2xl overflow-hidden transform hover:rotate-1 transition-transform duration-200">
          <CardContent className="p-4">
            <div className="flex items-start justify-between mb-3">
              <div className="w-12 h-12 bg-yellow-600 border-3 border-yellow-800 rounded-xl flex items-center justify-center">
                <Award className="w-6 h-6 text-white" />
              </div>
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-black text-yellow-900 uppercase tracking-wide">Fluency Score</h3>
              <div className="text-4xl font-black text-yellow-900">{fluencyScore}%</div>
              <div className="flex items-center text-sm">
                <TrendingUp className="w-4 h-4 text-green-700 mr-1" />
                <span className="text-green-800 font-bold">Keep it up!</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Current Streak - Bright Red */}
        <Card className="bg-red-300 border-4 border-red-600 rounded-2xl overflow-hidden transform hover:-rotate-1 transition-transform duration-200">
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
                <span className="text-red-800 font-bold">days strong! 🔥</span>
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
                {thisWeekCalls >= 5 ? "Weekly Champion! 🏆" : "Keep Going! 💪"}
              </h3>
              <p className="text-purple-800 font-bold">
                {thisWeekCalls >= 5 
                  ? `You've completed ${thisWeekCalls} conversations this week. Outstanding!`
                  : `You've completed ${thisWeekCalls} conversations this week. Try for 5!`
                }
              </p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-black text-purple-900">{thisWeekCalls}/7</div>
              <div className="text-sm text-purple-800 font-bold uppercase">conversations</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats Row - Bright cartoon colors */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-pink-300 border-4 border-pink-600 p-4 rounded-2xl text-center transform hover:scale-105 transition-transform duration-200">
          <div className="w-10 h-10 bg-pink-600 border-3 border-pink-800 rounded-xl flex items-center justify-center mx-auto mb-3">
            <Star className="w-5 h-5 text-white" />
          </div>
          <div className="text-2xl font-black text-pink-900">
            {totalCalls > 0 ? Math.min(5.0, 3.0 + (fluencyScore / 50)).toFixed(1) : "0.0"}
          </div>
          <div className="text-sm text-pink-800 font-bold uppercase">Avg Rating</div>
        </div>
        <div className="bg-blue-300 border-4 border-blue-600 p-4 rounded-2xl text-center transform hover:scale-105 transition-transform duration-200">
          <div className="w-10 h-10 bg-blue-600 border-3 border-blue-800 rounded-xl flex items-center justify-center mx-auto mb-3">
            <Target className="w-5 h-5 text-white" />
          </div>
          <div className="text-2xl font-black text-blue-900">
            {Math.min(100, Math.floor((totalCalls / 30) * 100))}%
          </div>
          <div className="text-sm text-blue-800 font-bold uppercase">Goal Progress</div>
        </div>
        <div className="bg-teal-300 border-4 border-teal-600 p-4 rounded-2xl text-center transform hover:scale-105 transition-transform duration-200">
          <div className="w-10 h-10 bg-teal-600 border-3 border-teal-800 rounded-xl flex items-center justify-center mx-auto mb-3">
            <Calendar className="w-5 h-5 text-white" />
          </div>
          <div className="text-2xl font-black text-teal-900">{uniqueDays}</div>
          <div className="text-sm text-teal-800 font-bold uppercase">Days Active</div>
        </div>
      </div>
    </div>
  );
};

export default DashboardStats;
