
import { Button } from "@/components/ui/button";
import { Home, Phone, CheckCircle, Settings, ArrowLeft, Star, Clock, Users, Zap } from "lucide-react";
import LearningProgressTree from "./LearningProgressTree";

interface ActivityCardProps {
  onNavigate: (view: string) => void;
}

const ActivityCard = ({ onNavigate }: ActivityCardProps) => {
  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header */}
      <div className="px-6 pt-8 pb-6">
        <div className="flex items-center justify-between">
          <Button
            onClick={() => onNavigate("home")}
            className="w-12 h-12 bg-white hover:bg-gray-50 rounded-xl text-gray-700 shadow-sm border border-gray-200"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-2xl font-bold text-gray-900">
            Practice Hub
          </h1>
          <div className="w-12 h-12"></div>
        </div>
      </div>

      <div className="px-6 space-y-6">
        {/* Today's Focus - Redesigned */}
        <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl p-6 text-white shadow-lg">
          <div className="flex items-center mb-4">
            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center mr-4">
              <Phone className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold">Today's Focus</h3>
              <p className="text-blue-100 text-sm">Ready for your daily challenge?</p>
            </div>
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 mb-4">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h4 className="font-semibold text-lg">Hotel Check-in Conversation</h4>
                <p className="text-blue-100 text-sm">Practice professional hospitality dialogue</p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold">15</div>
                <div className="text-xs text-blue-100">MIN</div>
              </div>
            </div>
            
            <div className="flex items-center space-x-4 text-sm">
              <div className="flex items-center space-x-1">
                <Star className="w-4 h-4 text-yellow-300" />
                <span>Intermediate</span>
              </div>
              <div className="flex items-center space-x-1">
                <Users className="w-4 h-4 text-blue-200" />
                <span>2-person dialogue</span>
              </div>
              <div className="flex items-center space-x-1">
                <Clock className="w-4 h-4 text-green-300" />
                <span>~15 min</span>
              </div>
            </div>
          </div>
          
          <Button 
            className="w-full bg-white hover:bg-gray-100 text-blue-600 font-semibold py-3 rounded-xl transition-all duration-200 shadow-sm"
          >
            <Zap className="w-5 h-5 mr-2" />
            Start Practice Session
          </Button>
        </div>

        {/* Learning Progress Tree */}
        <LearningProgressTree />

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white rounded-2xl p-4 border border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">12</div>
                <div className="text-sm text-gray-500">Completed</div>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl p-4 border border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                <Clock className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">47m</div>
                <div className="text-sm text-gray-500">This Week</div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activities */}
        <div className="bg-white rounded-2xl p-6 border border-gray-200">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Recent Activities</h3>
          <div className="space-y-3">
            {[
              { name: "Restaurant Ordering", score: 89, time: "2 hours ago" },
              { name: "Job Interview Prep", score: 76, time: "Yesterday" },
              { name: "Travel Conversation", score: 92, time: "2 days ago" },
            ].map((activity, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                <div>
                  <h4 className="font-medium text-gray-900 text-sm">{activity.name}</h4>
                  <p className="text-xs text-gray-500">{activity.time}</p>
                </div>
                <div className="text-right">
                  <div className={`text-sm font-semibold ${
                    activity.score >= 90 ? "text-green-600" : 
                    activity.score >= 75 ? "text-yellow-600" : "text-red-600"
                  }`}>
                    {activity.score}%
                  </div>
                  <div className="text-xs text-gray-500">Score</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white px-6 py-4 border-t border-gray-100 shadow-lg">
        <div className="max-w-md mx-auto">
          <div className="flex justify-center space-x-4">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => onNavigate("home")}
              className="w-12 h-12 bg-gray-100 hover:bg-gray-200 rounded-xl text-gray-600"
            >
              <Home className="w-5 h-5" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => onNavigate("activity")}
              className="w-12 h-12 bg-blue-500 hover:bg-blue-600 rounded-xl text-white"
            >
              <Phone className="w-5 h-5" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => onNavigate("curriculum")}
              className="w-12 h-12 bg-gray-100 hover:bg-gray-200 rounded-xl text-gray-600"
            >
              <CheckCircle className="w-5 h-5" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => onNavigate("settings")}
              className="w-12 h-12 bg-gray-100 hover:bg-gray-200 rounded-xl text-gray-600"
            >
              <Settings className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActivityCard;
