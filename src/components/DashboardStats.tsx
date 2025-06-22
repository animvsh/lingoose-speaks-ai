
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Phone, Clock, TrendingUp, Calendar, Star, Target, Zap, Award, Trophy, Flame } from "lucide-react";

const DashboardStats = () => {
  return (
    <div className="space-y-6 mb-6">
      {/* Main Stats Grid - 2x2 layout like the reference */}
      <div className="grid grid-cols-2 gap-4">
        {/* Total Calls - Orange/Peach */}
        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] rounded-3xl overflow-hidden">
          <CardContent className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 bg-orange-500 rounded-2xl flex items-center justify-center">
                <Phone className="w-6 h-6 text-white" />
              </div>
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-bold text-orange-900">Total Calls</h3>
              <div className="text-4xl font-black text-orange-900">47</div>
              <div className="flex items-center text-sm">
                <TrendingUp className="w-4 h-4 text-green-600 mr-1" />
                <span className="text-green-700 font-semibold">+3 this week</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Talk Time - Green/Mint */}
        <Card className="bg-gradient-to-br from-green-50 to-emerald-100 border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] rounded-3xl overflow-hidden">
          <CardContent className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 bg-green-600 rounded-2xl flex items-center justify-center">
                <Clock className="w-6 h-6 text-white" />
              </div>
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-bold text-green-900">Talk Time</h3>
              <div className="text-4xl font-black text-green-900">6.2h</div>
              <div className="flex items-center text-sm">
                <TrendingUp className="w-4 h-4 text-green-600 mr-1" />
                <span className="text-green-700 font-semibold">+45min this week</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Fluency Score - Orange/Peach */}
        <Card className="bg-gradient-to-br from-orange-50 to-amber-100 border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] rounded-3xl overflow-hidden">
          <CardContent className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 bg-orange-500 rounded-2xl flex items-center justify-center">
                <Award className="w-6 h-6 text-white" />
              </div>
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-bold text-orange-900">Fluency Score</h3>
              <div className="text-4xl font-black text-orange-900">73%</div>
              <div className="flex items-center text-sm">
                <TrendingUp className="w-4 h-4 text-green-600 mr-1" />
                <span className="text-green-700 font-semibold">+8% this month</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Current Streak - Orange/Amber */}
        <Card className="bg-gradient-to-br from-orange-50 to-amber-100 border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] rounded-3xl overflow-hidden">
          <CardContent className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 bg-orange-500 rounded-2xl flex items-center justify-center">
                <Flame className="w-6 h-6 text-white" />
              </div>
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-bold text-orange-900">Current Streak</h3>
              <div className="text-4xl font-black text-orange-900">12</div>
              <div className="flex items-center text-sm">
                <span className="text-red-600 font-semibold">days strong! 🔥</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Achievement Banner - More playful */}
      <Card className="bg-gradient-to-r from-yellow-100 to-orange-100 border-0 shadow-lg rounded-3xl overflow-hidden">
        <CardContent className="p-6">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl flex items-center justify-center">
              <Trophy className="w-8 h-8 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-black text-orange-900 mb-2">Weekly Champion! 🏆</h3>
              <p className="text-orange-800 font-medium">You've completed 5 conversations this week. Keep it up!</p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-black text-orange-900">5/7</div>
              <div className="text-sm text-orange-700 font-medium">conversations</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats Row - More colorful */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-pink-50 to-rose-100 p-6 rounded-3xl border-0 shadow-lg text-center">
          <div className="w-10 h-10 bg-pink-500 rounded-xl flex items-center justify-center mx-auto mb-3">
            <Star className="w-5 h-5 text-white" />
          </div>
          <div className="text-2xl font-black text-pink-900">4.8</div>
          <div className="text-sm text-pink-700 font-medium">Avg Rating</div>
        </div>
        <div className="bg-gradient-to-br from-blue-50 to-indigo-100 p-6 rounded-3xl border-0 shadow-lg text-center">
          <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center mx-auto mb-3">
            <Target className="w-5 h-5 text-white" />
          </div>
          <div className="text-2xl font-black text-blue-900">89%</div>
          <div className="text-sm text-blue-700 font-medium">Goal Progress</div>
        </div>
        <div className="bg-gradient-to-br from-teal-50 to-cyan-100 p-6 rounded-3xl border-0 shadow-lg text-center">
          <div className="w-10 h-10 bg-teal-500 rounded-xl flex items-center justify-center mx-auto mb-3">
            <Calendar className="w-5 h-5 text-white" />
          </div>
          <div className="text-2xl font-black text-teal-900">28</div>
          <div className="text-sm text-teal-700 font-medium">Days Active</div>
        </div>
      </div>
    </div>
  );
};

export default DashboardStats;
