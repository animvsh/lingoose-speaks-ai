
import { Button } from "@/components/ui/button";
import { Home, Clock, CheckCircle, Settings, Star, Trophy, ArrowLeft, Phone, Users, BookOpen } from "lucide-react";
import { useUserActivityRatings } from "@/hooks/useUserActivityRatings";
import { usePostHog } from "@/hooks/usePostHog";
import { useMemo, useEffect } from "react";
import AppBar from "./AppBar";

interface ProgressCardProps {
  onNavigate: (view: string) => void;
}

const ProgressCard = ({ onNavigate }: ProgressCardProps) => {
  const { ratings } = useUserActivityRatings();
  const { trackProgressView, trackNavigation } = usePostHog();

  // Simple overview stats
  const overviewStats = useMemo(() => {
    if (!ratings || ratings.length === 0) {
      return {
        totalSessions: 0,
        averageRating: 0,
        completedThisWeek: 0
      };
    }

    const totalSessions = ratings.length;
    const averageRating = ratings.reduce((sum, rating) => sum + rating.rating, 0) / ratings.length;
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    const completedThisWeek = ratings.filter(rating => 
      new Date(rating.completed_at) > oneWeekAgo
    ).length;

    return {
      totalSessions,
      averageRating: Math.round(averageRating * 10) / 10,
      completedThisWeek
    };
  }, [ratings]);

  useEffect(() => {
    // Track progress view when component mounts
    trackProgressView(overviewStats);
  }, [trackProgressView, overviewStats]);

  const handleNavigate = (view: string) => {
    trackNavigation('progress', view);
    onNavigate(view);
  };

  return (
    <div className="min-h-screen bg-amber-50 pb-24">
      <AppBar 
        title="PROGRESS" 
        onBack={() => handleNavigate("home")} 
        showBackButton={true} 
      />

      <div className="px-6 space-y-6">
        {/* Header Section */}
        <div className="text-center mb-8">
          <h2 className="text-4xl font-bold text-orange-600 mb-2 uppercase tracking-wide">
            OVERVIEW
          </h2>
          <p className="text-xl font-semibold text-gray-700">
            Your learning journey
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 gap-4 mb-8">
          <div className="bg-blue-400 rounded-3xl p-6 border-4 border-blue-500">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center mr-4">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white uppercase tracking-wide">
                  LEARNING SESSIONS
                </h3>
                <p className="text-blue-100 font-medium text-sm">
                  Total completed sessions
                </p>
              </div>
            </div>
            <div className="text-4xl font-bold text-white mb-2">{overviewStats.totalSessions}</div>
            <div className="text-blue-100 text-sm font-medium">
              {overviewStats.completedThisWeek} completed this week
            </div>
          </div>

          <div className="bg-green-400 rounded-3xl p-6 border-4 border-green-500">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-green-600 rounded-2xl flex items-center justify-center mr-4">
                <Star className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white uppercase tracking-wide">
                  AVERAGE RATING
                </h3>
                <p className="text-green-100 font-medium text-sm">
                  Your performance score
                </p>
              </div>
            </div>
            <div className="text-4xl font-bold text-white mb-2">{overviewStats.averageRating}/5</div>
            <div className="flex items-center text-green-100 text-sm font-medium">
              {Array.from({ length: 5 }, (_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 mr-1 ${
                    i < Math.round(overviewStats.averageRating) ? "fill-white text-white" : "text-green-200"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Redirect to Analytics */}
        <div className="bg-orange-400 rounded-3xl p-6 border-4 border-orange-500">
          <div className="flex items-center mb-4">
            <div className="w-12 h-12 bg-orange-600 rounded-2xl flex items-center justify-center mr-4">
              <Trophy className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-white uppercase tracking-wide">
                DETAILED ANALYTICS
              </h3>
              <p className="text-orange-100 font-medium text-sm">
                View your complete learning analytics
              </p>
            </div>
          </div>
          <Button 
            onClick={() => handleNavigate("curriculum")}
            className="w-full bg-white hover:bg-orange-50 text-orange-600 font-bold py-3 text-lg rounded-2xl"
          >
            VIEW ANALYTICS →
          </Button>
        </div>

        {/* No Data Message */}
        {(!ratings || ratings.length === 0) && (
          <div className="bg-gray-200 rounded-3xl p-8 border-4 border-gray-300 text-center">
            <div className="w-16 h-16 bg-gray-400 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-700 mb-2">Start Learning</h3>
            <p className="text-gray-600 font-medium mb-4">
              Begin your language learning journey to see your progress here!
            </p>
            <Button 
              onClick={() => handleNavigate("activity")}
              className="bg-orange-400 hover:bg-orange-500 text-white font-bold py-3 px-6 rounded-2xl"
            >
              START FIRST SESSION
            </Button>
          </div>
        )}
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white px-6 py-4 border-t border-gray-100">
        <div className="max-w-md mx-auto">
          <div className="flex justify-center space-x-4">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => handleNavigate("home")}
              className="w-14 h-14 bg-gray-200 rounded-2xl text-gray-600"
            >
              <Home className="w-6 h-6" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => handleNavigate("activity")}
              className="w-14 h-14 bg-gray-200 rounded-2xl text-gray-600"
            >
              <Phone className="w-6 h-6" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => handleNavigate("curriculum")}
              className="w-14 h-14 bg-gray-200 rounded-2xl text-gray-600"
            >
              <CheckCircle className="w-6 h-6" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => handleNavigate("settings")}
              className="w-14 h-14 bg-blue-400 rounded-2xl text-white"
            >
              <Settings className="w-6 h-6" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgressCard;
