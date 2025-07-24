import { Button } from "@/components/ui/button";
import { CheckCircle, Clock, Home, Phone, Settings, Star, Trophy, Target, TrendingUp, Flame, BarChart3, Activity } from "lucide-react";
import { useCurriculumAnalytics } from "@/hooks/useCurriculumAnalytics";
import { useMemo } from "react";
import AppBar from "./AppBar";

interface CurriculumCardProps {
  onNavigate: (view: string) => void;
}

const CurriculumCard = ({
  onNavigate
}: CurriculumCardProps) => {
  const {
    data: analytics,
    isLoading,
    refetch
  } = useCurriculumAnalytics();

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
    return Array.from({
      length: 5
    }, (_, i) => <Star key={i} className={`w-3 h-3 ${i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`} />);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen hindi-bg pb-24 font-nunito">
        <AppBar title="Progress" showBackButton={false} />
        <div className="px-4 pt-4">
          <div className="w-full rounded-3xl border-2 border-handdrawn bg-white/90 p-8 shadow-lg text-center">
            <div className="w-16 h-16 bg-gray-200 rounded-3xl flex items-center justify-center mx-auto mb-4 animate-pulse">
              <BarChart3 className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-black text-brown-800 uppercase tracking-wide mb-2">
              LOADING ANALYTICS
            </h3>
            <p className="text-brown-600 font-bold text-sm">
              Gathering your learning insights...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen hindi-bg pb-24 font-nunito">
      <AppBar title="Progress" showBackButton={false} />
      
      <div className="px-4 pt-4">
        {/* Analytics Header */}
        <div className="w-full rounded-3xl border-2 border-handdrawn bg-white/90 p-6 shadow-lg mb-6">
          <div className="text-center">
            <div className="flex items-center justify-center mb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-orange-600 rounded-3xl flex items-center justify-center">
                <BarChart3 className="w-8 h-8 text-white" />
              </div>
            </div>
            <h2 className="text-3xl font-black text-brown-900 mb-2 uppercase tracking-wide">
              ANALYTICS
            </h2>
            <p className="text-lg font-bold text-brown-700">
              Your learning progress
            </p>
            {analyticsData.lastActivity && (
              <p className="text-sm text-brown-600 mt-2 font-medium">
                Last activity: {analyticsData.lastActivity.toLocaleDateString()}
              </p>
            )}
          </div>
        </div>

        {/* Data Source Indicator */}
        {(analyticsData.callAnalysisCount > 0 || analyticsData.activityRatingsCount > 0) && (
          <div className="w-full rounded-3xl border-2 border-handdrawn bg-white/90 p-6 shadow-lg mb-6">
            <h3 className="text-xl font-black text-brown-900 mb-4 uppercase tracking-wide flex items-center">
              <Activity className="w-6 h-6 mr-3 text-blue-500" />
              Data Sources
            </h3>
            <div className="flex items-center justify-center space-x-8 bg-blue-50 rounded-2xl border-2 border-blue-200 p-4">
              <div className="text-center">
                <div className="text-2xl font-black text-blue-700">{analyticsData.callAnalysisCount}</div>
                <div className="text-sm text-blue-600 font-bold">AI Calls</div>
              </div>
              <div className="w-px h-12 bg-blue-300"></div>
              <div className="text-center">
                <div className="text-2xl font-black text-blue-700">{analyticsData.activityRatingsCount}</div>
                <div className="text-sm text-blue-600 font-bold">Practice Sessions</div>
              </div>
            </div>
          </div>
        )}

        {/* Main Stats */}
        <div className="w-full rounded-3xl border-2 border-handdrawn bg-white/90 p-6 shadow-lg mb-6">
          <h3 className="text-xl font-black text-brown-900 mb-6 uppercase tracking-wide flex items-center">
            <Trophy className="w-6 h-6 mr-3 text-yellow-500" />
            Key Metrics
          </h3>
          
          <div className="grid grid-cols-2 gap-4">
            {/* Total Calls */}
            <div className="bg-orange-50 rounded-2xl border-2 border-orange-200 p-4">
              <div className="flex items-center mb-3">
                <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center mr-3">
                  <Phone className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-black text-orange-800 uppercase tracking-wide">
                    Total Calls
                  </h4>
                </div>
              </div>
              <div className="text-3xl font-black text-orange-900 mb-2">{analyticsData.totalCalls}</div>
              <div className="flex items-center text-orange-700 text-sm font-bold">
                <span className="mr-1">📈</span>
                +{analyticsData.thisWeekCalls} this week
              </div>
            </div>

            {/* Talk Time */}
            <div className="bg-green-50 rounded-2xl border-2 border-green-200 p-4">
              <div className="flex items-center mb-3">
                <div className="w-10 h-10 bg-green-500 rounded-xl flex items-center justify-center mr-3">
                  <Clock className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-black text-green-800 uppercase tracking-wide">
                    Talk Time
                  </h4>
                </div>
              </div>
              <div className="text-3xl font-black text-green-900 mb-2">{analyticsData.talkTime}</div>
              <div className="flex items-center text-green-700 text-sm font-bold">
                <span className="mr-1">🎯</span>
                Total practice
              </div>
            </div>

            {/* Fluency Score */}
            <div className="bg-yellow-50 rounded-2xl border-2 border-yellow-200 p-4">
              <div className="flex items-center mb-3">
                <div className="w-10 h-10 bg-yellow-500 rounded-xl flex items-center justify-center mr-3">
                  <Trophy className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-black text-yellow-800 uppercase tracking-wide">
                    Fluency Score
                  </h4>
                </div>
              </div>
              <div className="text-3xl font-black text-yellow-900 mb-2">{analyticsData.fluencyScore}%</div>
              <div className="flex items-center text-yellow-700 text-sm font-bold">
                <span className="mr-1">⭐</span>
                {analyticsData.avgRating > 0 ? `Avg: ${analyticsData.avgRating}/5` : 'AI analysis'}
              </div>
            </div>

            {/* Current Streak */}
            <div className="bg-red-50 rounded-2xl border-2 border-red-200 p-4">
              <div className="flex items-center mb-3">
                <div className="w-10 h-10 bg-red-500 rounded-xl flex items-center justify-center mr-3">
                  <Flame className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-black text-red-800 uppercase tracking-wide">
                    Streak
                  </h4>
                </div>
              </div>
              <div className="text-3xl font-black text-red-900 mb-2">{analyticsData.currentStreak}</div>
              <div className="flex items-center text-red-700 text-sm font-bold">
                <span className="mr-1">🔥</span>
                days strong!
              </div>
            </div>
          </div>
        </div>

        {/* Recent Improvements */}
        {analyticsData.recentImprovements.length > 0 && (
          <div className="w-full rounded-3xl border-2 border-handdrawn bg-white/90 p-6 shadow-lg mb-6">
            <h3 className="text-xl font-black text-brown-900 mb-6 uppercase tracking-wide flex items-center">
              <TrendingUp className="w-6 h-6 mr-3 text-blue-500" />
              Recent Improvements
            </h3>
            
            <div className="space-y-3">
              {analyticsData.recentImprovements.map((improvement, index) => (
                <div key={index} className="bg-blue-50 rounded-2xl border-2 border-blue-200 p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-sm font-bold text-blue-800 truncate">
                      {improvement.area}
                    </h4>
                    <div className="flex items-center space-x-1">
                      {improvement.source === 'ratings' && renderStars(Math.round(improvement.improvement))}
                      {improvement.source === 'call_analysis' && (
                        <div className="text-xs font-bold text-blue-700 bg-blue-200 px-2 py-1 rounded-xl border border-blue-300">
                          AI Analysis
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-xs text-blue-700 font-medium">
                    <span>
                      {improvement.source === 'ratings' ? `+${improvement.improvement} improvement` : `${improvement.improvement} positive sessions`}
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
          <div className="w-full rounded-3xl border-2 border-handdrawn bg-white/90 p-6 shadow-lg mb-6">
            <h3 className="text-xl font-black text-brown-900 mb-6 uppercase tracking-wide flex items-center">
              <Target className="w-6 h-6 mr-3 text-purple-500" />
              Focus Areas
            </h3>
            
            <div className="space-y-3">
              {analyticsData.strugglingAreas.map((area, index) => (
                <div key={index} className="bg-purple-50 rounded-2xl border-2 border-purple-200 p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-sm font-bold text-purple-800 truncate">
                      {area.area}
                    </h4>
                    <div className="text-xs font-bold text-purple-700 bg-purple-200 px-2 py-1 rounded-xl border border-purple-300">
                      {area.avgPerformance}% performance
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-xs text-purple-700 font-medium">
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
          <div className="w-full rounded-3xl border-2 border-handdrawn bg-white/90 p-8 shadow-lg text-center">
            <div className="w-16 h-16 bg-gray-300 rounded-3xl flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-black text-brown-900 mb-2 uppercase tracking-wide">No Data Yet</h3>
            <p className="text-brown-700 font-bold">
              Start practicing to see your analytics and progress here!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CurriculumCard;