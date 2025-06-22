
import { Button } from "@/components/ui/button";
import { Home, Phone, CheckCircle, Settings, ArrowLeft, Star, Clock, Users, Zap, MapPin, Award } from "lucide-react";
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
        {/* Today's Focus - Enhanced Design */}
        <div className="relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-blue-500 to-purple-600 rounded-3xl"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.2),transparent_50%)] rounded-3xl"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(255,255,255,0.1),transparent_50%)] rounded-3xl"></div>
          
          <div className="relative p-8 text-white">
            {/* Header Section */}
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/30">
                  <Phone className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold mb-1">Today's Focus</h3>
                  <p className="text-blue-100 text-sm opacity-90">Ready for your daily challenge?</p>
                </div>
              </div>
              <div className="flex items-center space-x-2 bg-white/20 backdrop-blur-sm rounded-full px-3 py-1 border border-white/30">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-xs font-medium text-white">LIVE</span>
              </div>
            </div>
            
            {/* Main Content Card */}
            <div className="bg-white/15 backdrop-blur-md rounded-2xl p-6 mb-6 border border-white/20 shadow-xl">
              <div className="flex items-start justify-between mb-5">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center">
                      <Star className="w-3 h-3 text-yellow-800" />
                    </div>
                    <span className="text-xs font-semibold text-yellow-200 uppercase tracking-wide">Intermediate Level</span>
                  </div>
                  <h4 className="font-bold text-xl mb-2 text-white">Hotel Check-in Conversation</h4>
                  <p className="text-blue-100 text-sm leading-relaxed mb-4">
                    Master professional hospitality dialogue with real-world scenarios and interactive practice sessions
                  </p>
                  
                  {/* Features Grid */}
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="flex items-center space-x-2 text-sm">
                      <div className="w-8 h-8 bg-blue-400/30 rounded-lg flex items-center justify-center">
                        <Users className="w-4 h-4 text-blue-200" />
                      </div>
                      <span className="text-blue-100">2-person dialogue</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm">
                      <div className="w-8 h-8 bg-green-400/30 rounded-lg flex items-center justify-center">
                        <Clock className="w-4 h-4 text-green-200" />
                      </div>
                      <span className="text-blue-100">~15 minutes</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm">
                      <div className="w-8 h-8 bg-purple-400/30 rounded-lg flex items-center justify-center">
                        <MapPin className="w-4 h-4 text-purple-200" />
                      </div>
                      <span className="text-blue-100">Hotel lobby</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm">
                      <div className="w-8 h-8 bg-orange-400/30 rounded-lg flex items-center justify-center">
                        <Award className="w-4 h-4 text-orange-200" />
                      </div>
                      <span className="text-blue-100">+50 XP reward</span>
                    </div>
                  </div>
                </div>
                
                {/* Time Display */}
                <div className="text-center ml-6">
                  <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl flex flex-col items-center justify-center border border-white/30">
                    <div className="text-3xl font-bold text-white">15</div>
                    <div className="text-xs text-blue-100 font-medium">MIN</div>
                  </div>
                </div>
              </div>
              
              {/* Progress Bar */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium text-blue-100">Session Progress</span>
                  <span className="text-xs font-medium text-white">0/3 completed</span>
                </div>
                <div className="w-full bg-white/20 h-2 rounded-full overflow-hidden">
                  <div className="w-0 h-full bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full transition-all duration-500"></div>
                </div>
              </div>
            </div>
            
            {/* Action Button */}
            <Button 
              className="w-full bg-white hover:bg-gray-50 text-blue-600 font-bold py-4 rounded-2xl transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-[1.02] active:scale-[0.98] border-0"
            >
              <Zap className="w-6 h-6 mr-3 text-yellow-500" />
              Start Practice Session
              <div className="ml-auto flex items-center space-x-1">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-xs text-gray-500">Ready</span>
              </div>
            </Button>
          </div>
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
