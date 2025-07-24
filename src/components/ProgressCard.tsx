
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
    <div className="min-h-screen hindi-bg pb-24 font-nunito">
      <AppBar 
        title="Progress" 
        onBack={() => handleNavigate("home")} 
        showBackButton={true} 
      />

      <div className="px-4 pt-4 space-y-6">
        {/* Header Section */}
        <div className="w-full rounded-3xl border-2 border-handdrawn bg-white/90 p-6 shadow-lg text-center">
          <div className="w-16 h-16 bg-blue-100 border-2 border-blue-300 rounded-3xl flex items-center justify-center mx-auto mb-4">
            <Trophy className="w-8 h-8 text-blue-500" />
          </div>
          <h2 className="text-2xl font-black text-brown-900 mb-2 uppercase tracking-wide">
            Learning Overview
          </h2>
          <p className="text-brown-700 font-bold">
            Your learning journey progress
          </p>
        </div>

        {/* Quick Stats */}
        <div className="w-full rounded-3xl border-2 border-handdrawn bg-white/90 p-6 shadow-lg">
          <h3 className="text-xl font-black text-brown-900 mb-6 uppercase tracking-wide flex items-center">
            <BookOpen className="w-6 h-6 mr-3 text-blue-500" />
            Learning Sessions
          </h3>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between py-4 px-4 bg-blue-50 rounded-2xl border-2 border-blue-200">
              <div className="flex items-center">
                <BookOpen className="w-5 h-5 mr-3 text-blue-500" />
                <span className="text-brown-700 font-bold">Total Sessions</span>
              </div>
              <span className="text-blue-500 font-black text-xl bg-blue-100 px-3 py-1 rounded-xl border-2 border-blue-300">
                {overviewStats.totalSessions}
              </span>
            </div>
            
            <div className="flex items-center justify-between py-4 px-4 bg-green-50 rounded-2xl border-2 border-green-200">
              <div className="flex items-center">
                <Clock className="w-5 h-5 mr-3 text-green-500" />
                <span className="text-brown-700 font-bold">This Week</span>
              </div>
              <span className="text-green-500 font-black text-xl bg-green-100 px-3 py-1 rounded-xl border-2 border-green-300">
                {overviewStats.completedThisWeek}
              </span>
            </div>
          </div>
        </div>

        {/* Performance Section */}
        <div className="w-full rounded-3xl border-2 border-handdrawn bg-white/90 p-6 shadow-lg">
          <h3 className="text-xl font-black text-brown-900 mb-6 uppercase tracking-wide flex items-center">
            <Star className="w-6 h-6 mr-3 text-orange-500" />
            Performance
          </h3>
          
          <div className="flex items-center justify-between py-4 px-4 bg-orange-50 rounded-2xl border-2 border-orange-200">
            <div className="flex items-center">
              <Star className="w-5 h-5 mr-3 text-orange-500" />
              <div>
                <span className="text-brown-700 font-bold block">Average Rating</span>
                <div className="flex items-center mt-1">
                  {Array.from({ length: 5 }, (_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 mr-1 ${
                        i < Math.round(overviewStats.averageRating) ? "fill-orange-500 text-orange-500" : "text-orange-300"
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
            <span className="text-orange-500 font-black text-xl bg-orange-100 px-3 py-1 rounded-xl border-2 border-orange-300">
              {overviewStats.averageRating}/5
            </span>
          </div>
        </div>

        {/* Analytics Section */}
        <div className="w-full rounded-3xl border-2 border-handdrawn bg-white/90 p-6 shadow-lg">
          <h3 className="text-xl font-black text-brown-900 mb-6 uppercase tracking-wide flex items-center">
            <Trophy className="w-6 h-6 mr-3 text-purple-500" />
            Detailed Analytics
          </h3>
          
          <div className="bg-purple-50 rounded-2xl border-2 border-purple-200 p-4 mb-4">
            <p className="text-brown-700 font-bold text-center mb-3">
              View your complete learning analytics and detailed progress
            </p>
            <Button 
              onClick={() => handleNavigate("curriculum")}
              className="w-full bg-purple-500 hover:bg-purple-600 text-white font-black py-3 text-lg rounded-xl border-2 border-purple-400 transition-all duration-200 hover:scale-[1.02]"
            >
              VIEW ANALYTICS →
            </Button>
          </div>
        </div>

        {/* No Data Message */}
        {(!ratings || ratings.length === 0) && (
          <div className="w-full rounded-3xl border-2 border-handdrawn bg-white/90 p-6 shadow-lg text-center">
            <div className="w-16 h-16 bg-gray-100 border-2 border-gray-300 rounded-3xl flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-gray-500" />
            </div>
            <h3 className="text-xl font-black text-brown-900 mb-2 uppercase tracking-wide">Start Learning</h3>
            <p className="text-brown-700 font-bold mb-4">
              Begin your language learning journey to see your progress here!
            </p>
            <Button 
              onClick={() => handleNavigate("activity")}
              className="bg-green-500 hover:bg-green-600 text-white font-black py-3 px-6 rounded-xl border-2 border-green-400 transition-all duration-200 hover:scale-[1.02]"
            >
              START FIRST SESSION
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProgressCard;
