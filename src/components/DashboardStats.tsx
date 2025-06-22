
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Phone, Clock, TrendingUp, Calendar, Star, Target, Zap } from "lucide-react";

const DashboardStats = () => {
  return (
    <div className="grid grid-cols-2 gap-4 mb-6">
      <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-orange-700 flex items-center">
            <Phone className="w-4 h-4 mr-2" />
            Total Calls
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-orange-800">47</div>
          <p className="text-xs text-orange-600 mt-1">+3 this week</p>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-green-700 flex items-center">
            <Clock className="w-4 h-4 mr-2" />
            Talk Time
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-800">6.2h</div>
          <p className="text-xs text-green-600 mt-1">+45min this week</p>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-blue-700 flex items-center">
            <TrendingUp className="w-4 h-4 mr-2" />
            Fluency Score
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-blue-800">73%</div>
          <p className="text-xs text-blue-600 mt-1">+8% this month</p>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-purple-700 flex items-center">
            <Zap className="w-4 h-4 mr-2" />
            Current Streak
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-purple-800">12</div>
          <p className="text-xs text-purple-600 mt-1">days strong! 🔥</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardStats;
