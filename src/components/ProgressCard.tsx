
import { Button } from "@/components/ui/button";
import { Home, Clock, CheckCircle, Settings, Star, Trophy, ArrowLeft, Phone, Flame, Target, Users, TrendingUp } from "lucide-react";
import { useUserActivityRatings } from "@/hooks/useUserActivityRatings";
import { useUserProgress } from "@/hooks/useUserProgress";
import { format, subDays, isAfter } from "date-fns";
import { useMemo } from "react";

interface ProgressCardProps {
  onNavigate: (view: string) => void;
}

const ProgressCard = ({ onNavigate }: ProgressCardProps) => {
  const { ratings } = useUserActivityRatings();
  const { miniSkillScores } = useUserProgress();

  // Calculate analytics from actual data
  const analytics = useMemo(() => {
    if (!ratings || ratings.length === 0) {
      return {
        totalCalls: 0,
        talkTime: '0h',
        fluencyScore: 0,
        currentStreak: 0,
        thisWeekCalls: 0,
        avgRating: 0
      };
    }

    const totalCalls = ratings.length;
    const totalDurationMinutes = ratings.reduce((sum, rating) => 
      sum + (rating.duration_seconds ? Math.round(rating.duration_seconds / 60) : 0), 0
    );
    const talkTime = totalDurationMinutes >= 60 
      ? `${Math.floor(totalDurationMinutes / 60)}.${Math.round((totalDurationMinutes % 60) / 6)}h`
      : `${totalDurationMinutes}min`;

    // Calculate average rating as fluency score
    const avgRating = Math.round(ratings.reduce((sum, rating) => sum + rating.rating, 0) / ratings.length);
    const fluencyScore = Math.round((avgRating / 5) * 100);

    // Calculate current streak (consecutive days with activities)
    const sortedRatings = [...ratings].sort((a, b) => 
      new Date(b.completed_at).getTime() - new Date(a.completed_at).getTime()
    );
    
    let streak = 0;
    let currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);
    
    for (let i = 0; i < sortedRatings.length; i++) {
      const ratingDate = new Date(sortedRatings[i].completed_at);
      ratingDate.setHours(0, 0, 0, 0);
      
      const daysDiff = Math.floor((currentDate.getTime() - ratingDate.getTime()) / (1000 * 60 * 60 * 24));
      
      if (daysDiff === streak) {
        streak++;
      } else if (daysDiff > streak) {
        break;
      }
    }

    // This week's calls
    const oneWeekAgo = subDays(new Date(), 7);
    const thisWeekCalls = ratings.filter(rating => 
      isAfter(new Date(rating.completed_at), oneWeekAgo)
    ).length;

    return {
      totalCalls,
      talkTime,
      fluencyScore,
      currentStreak: streak,
      thisWeekCalls,
      avgRating
    };
  }, [ratings]);

  // Analyze skill progress over recent activities
  const skillProgressAnalysis = useMemo(() => {
    if (!ratings || !miniSkillScores || ratings.length === 0) {
      return { recentImprovements: [], strugglingAreas: [] };
    }

    // Get last 5 activities to analyze trends
    const recentRatings = ratings.slice(0, 5);
    const skillRatingMap = new Map();

    // Group ratings by skill
    recentRatings.forEach(rating => {
      const skillId = rating.skill_id;
      if (!skillRatingMap.has(skillId)) {
        skillRatingMap.set(skillId, []);
      }
      skillRatingMap.get(skillId).push({
        rating: rating.rating,
        date: rating.completed_at,
        activityName: rating.activities.name
      });
    });

    const recentImprovements = [];
    const strugglingAreas = [];

    // Analyze each skill's trend
    skillRatingMap.forEach((skillRatings, skillId) => {
      if (skillRatings.length >= 2) {
        const sortedRatings = skillRatings.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        const firstRating = sortedRatings[0].rating;
        const lastRating = sortedRatings[sortedRatings.length - 1].rating;
        const improvement = lastRating - firstRating;
        const avgRating = sortedRatings.reduce((sum, r) => sum + r.rating, 0) / sortedRatings.length;

        if (improvement > 0) {
          recentImprovements.push({
            skillId,
            improvement,
            avgRating,
            activityName: sortedRatings[sortedRatings.length - 1].activityName,
            attempts: sortedRatings.length
          });
        } else if (avgRating < 3) {
          strugglingAreas.push({
            skillId,
            avgRating,
            activityName: sortedRatings[sortedRatings.length - 1].activityName,
            attempts: sortedRatings.length
          });
        }
      }
    });

    return {
      recentImprovements: recentImprovements.slice(0, 3),
      strugglingAreas: strugglingAreas.slice(0, 3)
    };
  }, [ratings, miniSkillScores]);

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

  return (
    <div className="min-h-screen bg-amber-50 pb-24">
      {/* Header */}
      <div className="px-6 pt-8 pb-6">
        <div className="flex items-center justify-between">
          <Button
            onClick={() => onNavigate("home")}
            className="w-12 h-12 bg-white hover:bg-gray-50 rounded-xl text-gray-700 shadow-sm border border-gray-200"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-2xl font-bold text-gray-900 uppercase tracking-wide">
            ANALYTICS
          </h1>
          <div className="w-12 h-12"></div>
        </div>
      </div>

      <div className="px-6 space-y-6">
        {/* Welcome Section */}
        <div className="text-center mb-8">
          <h2 className="text-4xl font-bold text-orange-600 mb-2 uppercase tracking-wide">
            YOUR PROGRESS
          </h2>
          <p className="text-xl font-semibold text-gray-700">
            Here's how you're doing!
          </p>
        </div>

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
            <div className="text-4xl font-bold text-orange-900 mb-2">{analytics.totalCalls}</div>
            <div className="flex items-center text-orange-700 text-sm font-medium">
              <span className="mr-1">📈</span>
              +{analytics.thisWeekCalls} this week
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
            <div className="text-4xl font-bold text-green-900 mb-2">{analytics.talkTime}</div>
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
            <div className="text-4xl font-bold text-yellow-900 mb-2">{analytics.fluencyScore}%</div>
            <div className="flex items-center text-yellow-700 text-sm font-medium">
              <span className="mr-1">⭐</span>
              Avg: {analytics.avgRating}/5 stars
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
            <div className="text-4xl font-bold text-red-900 mb-2">{analytics.currentStreak}</div>
            <div className="flex items-center text-red-700 text-sm font-medium">
              <span className="mr-1">🔥</span>
              days strong!
            </div>
          </div>
        </div>

        {/* Skill Progress Analysis */}
        {skillProgressAnalysis.recentImprovements.length > 0 && (
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
                  Skills you're getting better at!
                </p>
              </div>
            </div>
            
            <div className="space-y-3">
              {skillProgressAnalysis.recentImprovements.map((improvement, index) => (
                <div key={index} className="bg-blue-300 rounded-2xl p-4 border-2 border-blue-400">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-sm font-bold text-blue-800 truncate">
                      {improvement.activityName}
                    </h4>
                    <div className="flex items-center space-x-1">
                      {renderStars(Math.round(improvement.avgRating))}
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-xs text-blue-700">
                    <span>+{improvement.improvement} improvement</span>
                    <span>{improvement.attempts} attempts</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {skillProgressAnalysis.strugglingAreas.length > 0 && (
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
                  Skills that need more practice
                </p>
              </div>
            </div>
            
            <div className="space-y-3">
              {skillProgressAnalysis.strugglingAreas.map((area, index) => (
                <div key={index} className="bg-purple-300 rounded-2xl p-4 border-2 border-purple-400">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-sm font-bold text-purple-800 truncate">
                      {area.activityName}
                    </h4>
                    <div className="flex items-center space-x-1">
                      {renderStars(Math.round(area.avgRating))}
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
        {(!ratings || ratings.length === 0) && (
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
      <div className="fixed bottom-0 left-0 right-0 bg-white px-6 py-4 border-t border-gray-100">
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
              className="w-14 h-14 bg-blue-400 rounded-2xl text-white"
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

export default ProgressCard;
