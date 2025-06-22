
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Phone, Clock, TrendingUp, Calendar, Star, Target, Zap, Award, Trophy, Flame } from "lucide-react";

const DashboardStats = () => {
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
              <div className="text-4xl font-black text-orange-900">47</div>
              <div className="flex items-center text-sm">
                <TrendingUp className="w-4 h-4 text-green-700 mr-1" />
                <span className="text-green-800 font-bold">+3 this week</span>
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
              <div className="text-4xl font-black text-green-900">6.2h</div>
              <div className="flex items-center text-sm">
                <TrendingUp className="w-4 h-4 text-green-700 mr-1" />
                <span className="text-green-800 font-bold">+45min this week</span>
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
              <div className="text-4xl font-black text-yellow-900">73%</div>
              <div className="flex items-center text-sm">
                <TrendingUp className="w-4 h-4 text-green-700 mr-1" />
                <span className="text-green-800 font-bold">+8% this month</span>
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
              <div className="text-4xl font-black text-red-900">12</div>
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
              <h3 className="text-xl font-black text-purple-900 mb-2 uppercase tracking-wide">Weekly Champion! 🏆</h3>
              <p className="text-purple-800 font-bold">You've completed 5 conversations this week. Keep it up!</p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-black text-purple-900">5/7</div>
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
          <div className="text-2xl font-black text-pink-900">4.8</div>
          <div className="text-sm text-pink-800 font-bold uppercase">Avg Rating</div>
        </div>
        <div className="bg-blue-300 border-4 border-blue-600 p-4 rounded-2xl text-center transform hover:scale-105 transition-transform duration-200">
          <div className="w-10 h-10 bg-blue-600 border-3 border-blue-800 rounded-xl flex items-center justify-center mx-auto mb-3">
            <Target className="w-5 h-5 text-white" />
          </div>
          <div className="text-2xl font-black text-blue-900">89%</div>
          <div className="text-sm text-blue-800 font-bold uppercase">Goal Progress</div>
        </div>
        <div className="bg-teal-300 border-4 border-teal-600 p-4 rounded-2xl text-center transform hover:scale-105 transition-transform duration-200">
          <div className="w-10 h-10 bg-teal-600 border-3 border-teal-800 rounded-xl flex items-center justify-center mx-auto mb-3">
            <Calendar className="w-5 h-5 text-white" />
          </div>
          <div className="text-2xl font-black text-teal-900">28</div>
          <div className="text-sm text-teal-800 font-bold uppercase">Days Active</div>
        </div>
      </div>
    </div>
  );
};

export default DashboardStats;
