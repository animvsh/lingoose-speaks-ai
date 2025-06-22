
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Phone, Clock, TrendingUp, Calendar, Star, Target, Zap, Award, Trophy, Flame } from "lucide-react";

const DashboardStats = () => {
  return (
    <div className="space-y-6 mb-6">
      {/* Main Stats Grid */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="bg-gradient-to-br from-orange-100 to-orange-200 border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold text-orange-800 flex items-center">
              <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center mr-3">
                <Phone className="w-4 h-4 text-white" />
              </div>
              Total Calls
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-orange-900 mb-1">47</div>
            <div className="flex items-center text-sm">
              <TrendingUp className="w-3 h-3 text-green-600 mr-1" />
              <span className="text-green-700 font-medium">+3 this week</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-100 to-emerald-200 border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold text-green-800 flex items-center">
              <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center mr-3">
                <Clock className="w-4 h-4 text-white" />
              </div>
              Talk Time
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-900 mb-1">6.2h</div>
            <div className="flex items-center text-sm">
              <TrendingUp className="w-3 h-3 text-green-600 mr-1" />
              <span className="text-green-700 font-medium">+45min this week</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-100 to-blue-200 border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold text-blue-800 flex items-center">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center mr-3">
                <Award className="w-4 h-4 text-white" />
              </div>
              Fluency Score
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-900 mb-1">73%</div>
            <div className="flex items-center text-sm">
              <TrendingUp className="w-3 h-3 text-green-600 mr-1" />
              <span className="text-green-700 font-medium">+8% this month</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-100 to-pink-200 border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold text-purple-800 flex items-center">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center mr-3">
                <Flame className="w-4 h-4 text-white animate-pulse" />
              </div>
              Current Streak
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-900 mb-1">12</div>
            <div className="flex items-center text-sm">
              <Flame className="w-3 h-3 text-orange-500 mr-1" />
              <span className="text-orange-700 font-medium">days strong! 🔥</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Achievement Banner */}
      <Card className="bg-gradient-to-r from-amber-50 to-yellow-100 border-2 border-amber-200 shadow-lg">
        <CardContent className="p-4">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-yellow-500 rounded-xl flex items-center justify-center">
              <Trophy className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-amber-900 mb-1">Weekly Champion! 🏆</h3>
              <p className="text-sm text-amber-700">You've completed 5 conversations this week. Keep it up!</p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-amber-900">5/7</div>
              <div className="text-xs text-amber-600">conversations</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats Row */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-gradient-to-br from-rose-50 to-pink-100 p-4 rounded-2xl border border-rose-200 text-center">
          <Star className="w-6 h-6 text-rose-500 mx-auto mb-2" />
          <div className="text-lg font-bold text-rose-800">4.8</div>
          <div className="text-xs text-rose-600">Avg Rating</div>
        </div>
        <div className="bg-gradient-to-br from-indigo-50 to-blue-100 p-4 rounded-2xl border border-indigo-200 text-center">
          <Target className="w-6 h-6 text-indigo-500 mx-auto mb-2" />
          <div className="text-lg font-bold text-indigo-800">89%</div>
          <div className="text-xs text-indigo-600">Goal Progress</div>
        </div>
        <div className="bg-gradient-to-br from-teal-50 to-cyan-100 p-4 rounded-2xl border border-teal-200 text-center">
          <Calendar className="w-6 h-6 text-teal-500 mx-auto mb-2" />
          <div className="text-lg font-bold text-teal-800">28</div>
          <div className="text-xs text-teal-600">Days Active</div>
        </div>
      </div>
    </div>
  );
};

export default DashboardStats;
