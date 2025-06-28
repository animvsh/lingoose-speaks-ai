import { Button } from "@/components/ui/button";
import { CheckCircle, Clock, Home, Phone, Settings, Star, Trophy, Target, TrendingUp, Flame, BarChart3 } from "lucide-react";
import { useCurriculumAnalytics } from "@/hooks/useCurriculumAnalytics";
import { useMemo } from "react";

interface CurriculumCardProps {
  onNavigate: (view: string) => void;
}

const CurriculumCard = ({ onNavigate }: CurriculumCardProps) => {
  const { data: analytics, isLoading, refetch } = useCurriculumAnalytics();

  // Memoized analytics to prevent unnecessary re-renders
  const analyticsData = useMemo(() => {
    if (!analytics) {
      return {
        totalCalls: 0,
        talkTime: '0h',
        fluencyScore: 0,
        currentStreak: 0,
        thisWeekCalls: 0,
        avgRating: 0,
        recentImprovements: [],
        strugglingAreas: [],
        callAnalysisCount: 0,
        activityRatingsCount: 0,
        lastActivity: null as Date | null
      };
    }
    return analytics;
  }, [analytics]);

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-3 h-3 ${
          i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
        }`}
      />
    ));
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-amber-50 pb-24">
        <div className="px-6 space-y-6 pt-6">
          <div className="bg-amber-50 rounded-3xl p-6 border-4 border-gray-200 text-center">
            <div className="w-16 h-16 bg-gray-200 rounded-2xl flex items-center justify-center mx-auto mb-4 animate-pulse">
              <BarChart3 className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-bold text-gray-800 uppercase tracking-wide mb-2">
              LOADING ANALYTICS
            </h3>
            <p className="text-gray-600 font-medium text-sm">
              Gathering your learning insights...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-amber-50 pb-24">
      <div className="px-6 space-y-6 pt-6">
        {/* Analytics Header */}
        <div className="text-center mb-8">
          <h2 className="text-4xl font-bold text-orange-600 mb-2 uppercase tracking-wide">
            ANALYTICS
          </h2>
          <p className="text-xl font-semibold text-gray-700">
            Your learning progress
          </p>
          {analyticsData.lastActivity && (
            <p className="text-sm text-gray-500 mt-2">
              Last activity: {analyticsData.lastActivity.toLocaleDateString()}
            </p>
          )}
        </div>

        {/* Data Source Indicator */}
        {(analyticsData.callAnalysisCount > 0 || analyticsData.activityRatingsCount > 0) && (
          <div className="bg-blue-100 rounded-2xl p-4 border-2 border-blue-200 mb-6">
            <div className="flex items-center justify-center space-x-4">
              <div className="text-center">
                <div className="text-lg font-bold text-blue-700">{analyticsData.callAnalysisCount}</div>
                <div className="text-xs text-blue-600 font-medium">AI Calls</div>
              </div>
              <div className="w-px h-8 bg-blue-300"></div>
              <div className="text-center">
                <div className="text-lg font-bold text-blue-700">{analyticsData.activityRatingsCount}</div>
                <div className="text-xs text-blue-600 font-medium">Practice Sessions</div>
              </div>
            </div>
          </div>
        )}

        {/* Main Stats Grid */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          {/* Total Calls */}
          <div className="bg-orange-400 rounded-3xl p-6 border-4 border-orange-500">
            <div className="w-12 h-12 bg-orange-600 rounded-2xl flex items-center justify-center mb-4">
              <Phone className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-sm font-bold text-orange-800 uppercase tracking-wide mb-1">
              TOTAL CALLS
            </h3>
            <div className="text-4xl font-bold text-orange-900 mb-2">{analyticsData.totalCalls}</div>
            <div className="flex items-center text-orange-700 text-sm font-medium">
              <span className="mr-1">📈</span>
              +{analyticsData.thisWeekCalls} this week
            </div>
          </div>

          {/* Talk Time */}
          <div className="bg-green-400 rounded-3xl p-6 border-4 border-green-500">
            <div className="w-12 h-12 bg-green-600 rounded-2xl flex items-center justify-center mb-4">
              <Clock className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-sm font-bold text-green-800 uppercase tracking-wide mb-1">
              TALK TIME
            </h3>
            <div className="text-4xl font-bold text-green-900 mb-2">{analyticsData.talkTime}</div>
            <div className="flex items-center text-green-700 text-sm font-medium">
              <span className="mr-1">🎯</span>
              Total practice time
            </div>
          </div>

          {/* Fluency Score */}
          <div className="bg-yellow-400 rounded-3xl p-6 border-4 border-yellow-500">
            <div className="w-12 h-12 bg-yellow-600 rounded-2xl flex items-center justify-center mb-4">
              <Trophy className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-sm font-bold text-yellow-800 uppercase tracking-wide mb-1">
              FLUENCY SCORE
            </h3>
            <div className="text-4xl font-bold text-yellow-900 mb-2">{analyticsData.fluencyScore}%</div>
            <div className="flex items-center text-yellow-700 text-sm font-medium">
              <span className="mr-1">⭐</span>
              {analyticsData.avgRating > 0 ? `Avg: ${analyticsData.avgRating}/5 stars` : 'AI-powered analysis'}
            </div>
          </div>

          {/* Current Streak */}
          <div className="bg-red-400 rounded-3xl p-6 border-4 border-red-500">
            <div className="w-12 h-12 bg-red-600 rounded-2xl flex items-center justify-center mb-4">
              <Flame className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-sm font-bold text-red-800 uppercase tracking-wide mb-1">
              CURRENT STREAK
            </h3>
            <div className="text-4xl font-bold text-red-900 mb-2">{analyticsData.currentStreak}</div>
            <div className="flex items-center text-red-700 text-sm font-medium">
              <span className="mr-1">🔥</span>
              days strong!
            </div>
          </div>
        </div>

        {/* Recent Improvements */}
        {analyticsData.recentImprovements.length > 0 && (
          <div className="bg-blue-400 rounded-3xl p-6 border-4 border-blue-500 mb-8">
            <div className="flex items-center mb-4">
              <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center mr-4">
                <TrendingUp className="w-7 h-7 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-white uppercase tracking-wide">
                  RECENT IMPROVEMENTS
                </h3>
                <p className="text-blue-100 font-medium text-sm">
                  Areas where you're excelling!
                </p>
              </div>
            </div>
            
            <div className="space-y-3">
              {analyticsData.recentImprovements.map((improvement, index) => (
                <div key={index} className="bg-blue-300 rounded-2xl p-4 border-2 border-blue-400">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-sm font-bold text-blue-800 truncate">
                      {improvement.area}
                    </h4>
                    <div className="flex items-center space-x-1">
                      {improvement.source === 'ratings' && renderStars(Math.round(improvement.improvement))}
                      {improvement.source === 'call_analysis' && (
                        <div className="text-xs font-bold text-blue-700 bg-blue-200 px-2 py-1 rounded">
                          AI Analysis
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-xs text-blue-700">
                    <span>
                      {improvement.source === 'ratings' ? 
                        `+${improvement.improvement} improvement` : 
                        `${improvement.improvement} positive sessions`
                      }
                    </span>
                    <span>{improvement.attempts} attempts</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Struggling Areas */}
        {analyticsData.strugglingAreas.length > 0 && (
          <div className="bg-purple-400 rounded-3xl p-6 border-4 border-purple-500 mb-8">
            <div className="flex items-center mb-4">
              <div className="w-14 h-14 bg-purple-600 rounded-2xl flex items-center justify-center mr-4">
                <Target className="w-7 h-7 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-white uppercase tracking-wide">
                  FOCUS AREAS
                </h3>
                <p className="text-purple-100 font-medium text-sm">
                  Areas that need more practice
                </p>
              </div>
            </div>
            
            <div className="space-y-3">
              {analyticsData.strugglingAreas.map((area, index) => (
                <div key={index} className="bg-purple-300 rounded-2xl p-4 border-2 border-purple-400">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-sm font-bold text-purple-800 truncate">
                      {area.area}
                    </h4>
                    <div className="text-xs font-bold text-purple-700 bg-purple-200 px-2 py-1 rounded">
                      {area.avgPerformance}% performance
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-xs text-purple-700">
                    <span>Needs improvement</span>
                    <span>{area.attempts} attempts</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* No Data Message */}
        {analyticsData.totalCalls === 0 && (
          <div className="bg-gray-200 rounded-3xl p-8 border-4 border-gray-300 text-center">
            <div className="w-16 h-16 bg-gray-400 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-700 mb-2">No Data Yet</h3>
            <p className="text-gray-600 font-medium">
              Start practicing to see your analytics and progress here!
            </p>
          </div>
        )}
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-amber-50 px-6 py-4 border-t border-gray-100">
        <div className="max-w-md mx-auto">
          <div className="flex justify-center space-x-4">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => onNavigate("home")}
              className="w-14 h-14 bg-gray-200 rounded-2xl text-gray-600"
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
              className="w-14 h-14 bg-green-400 rounded-2xl text-white"
            >
              <CheckCircle className="w-6 h-6" />
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

export default CurriculumCard;
