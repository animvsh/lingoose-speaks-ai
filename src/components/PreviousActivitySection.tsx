
import { CheckCircle, TrendingUp, Target, Clock, MessageSquare, ArrowRight } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";

interface PreviousActivitySectionProps {
  previousActivity: any;
  onNavigate: (view: string, data?: any) => void;
}

const PreviousActivitySection = ({ previousActivity, onNavigate }: PreviousActivitySectionProps) => {
  const { user } = useAuth();

  // Fetch user profile for last conversation summary
  const { data: userProfile } = useQuery({
    queryKey: ['user-profile', user?.id],
    queryFn: async () => {
      if (!user) throw new Error('No user found');

      const { data, error } = await supabase
        .from('user_profiles')
        .select('last_conversation_summary')
        .eq('auth_user_id', user.id)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  // Fetch the most recent completed activity from the activities table
  const { data: latestActivity, isLoading: isLoadingActivity } = useQuery({
    queryKey: ['latest-completed-activity', user?.id],
    queryFn: async () => {
      if (!user) throw new Error('No user found');

      console.log('Fetching latest completed activity for user:', user.id);

      // First, get the most recent activity rating to find which activity was completed
      const { data: latestRating, error: ratingError } = await supabase
        .from('user_activity_ratings')
        .select(`
          *,
          activities (
            id,
            name,
            description,
            estimated_duration_minutes,
            difficulty_level,
            prompt
          )
        `)
        .eq('user_id', user.id)
        .order('completed_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (ratingError) {
        console.error('Error fetching latest activity rating:', ratingError);
      }

      console.log('Latest activity rating found:', latestRating);

      if (latestRating && latestRating.activities) {
        return {
          type: 'activity_completion',
          id: latestRating.activities.id,
          name: latestRating.activities.name,
          description: latestRating.activities.description,
          estimated_duration_minutes: latestRating.activities.estimated_duration_minutes,
          difficulty_level: latestRating.activities.difficulty_level,
          prompt: latestRating.activities.prompt,
          rating: latestRating.rating,
          duration_seconds: latestRating.duration_seconds,
          completed_at: latestRating.completed_at,
          feedback_notes: latestRating.feedback_notes,
          source: 'activities_table'
        };
      }

      // Fallback: get any activity from the activities table as backup
      const { data: anyActivity, error: activityError } = await supabase
        .from('activities')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (activityError) {
        console.error('Error fetching fallback activity:', activityError);
      }

      console.log('Fallback activity found:', anyActivity);

      if (anyActivity) {
        return {
          type: 'activity_available',
          id: anyActivity.id,
          name: anyActivity.name,
          description: anyActivity.description,
          estimated_duration_minutes: anyActivity.estimated_duration_minutes,
          difficulty_level: anyActivity.difficulty_level,
          prompt: anyActivity.prompt,
          source: 'activities_table_fallback'
        };
      }

      return null;
    },
    enabled: !!user,
  });

  // Use the fetched activity data instead of the prop
  const displayActivity = latestActivity || previousActivity;

  console.log('PreviousActivitySection render:', {
    latestActivity,
    previousActivity,
    displayActivity,
    isLoadingActivity
  });

  const formatDuration = (durationSeconds: number) => {
    if (!durationSeconds) return 'N/A';
    const minutes = Math.round(durationSeconds / 60);
    const seconds = Math.round(durationSeconds % 60);
    return `${minutes}m ${seconds}s`;
  };

  const getStatusColor = (type: string) => {
    switch (type) {
      case 'activity_completion':
        return 'text-green-700';
      case 'activity_available':
        return 'text-blue-700';
      default:
        return 'text-gray-700';
    }
  };

  const getStatusBgColor = (type: string) => {
    switch (type) {
      case 'activity_completion':
        return 'bg-green-50 border-green-100';
      case 'activity_available':
        return 'bg-blue-50 border-blue-100';
      default:
        return 'bg-gray-50 border-gray-100';
    }
  };

  const getStatusText = (activity: any) => {
    if (activity.type === 'activity_completion') {
      return 'COMPLETED';
    } else if (activity.type === 'activity_available') {
      return 'AVAILABLE';
    }
    return 'UNKNOWN';
  };

  // Calculate performance score based on activity data (rounded)
  const getPerformanceScore = () => {
    if (displayActivity.rating) {
      return Math.round(displayActivity.rating);
    }
    if (displayActivity.type === 'activity_available') return 'N/A';
    return 3;
  };

  // Calculate engagement score (rounded)
  const getEngagementScore = () => {
    if (displayActivity.duration_seconds) {
      return Math.round(Math.min(displayActivity.duration_seconds / 60, 5));
    }
    if (displayActivity.estimated_duration_minutes) {
      return Math.round(Math.min(displayActivity.estimated_duration_minutes / 3, 5));
    }
    return 'N/A';
  };

  const handleViewDetails = () => {
    onNavigate('activity-details', displayActivity);
  };

  if (isLoadingActivity) {
    return (
      <div className="rounded-3xl border-2 border-handdrawn bg-white/90 p-6 text-center shadow-lg font-nunito">
        <div className="w-16 h-16 bg-orange-100 border-2 border-orange-300 rounded-3xl flex items-center justify-center mx-auto mb-4 animate-pulse">
          <Clock className="w-8 h-8 text-orange-500" />
        </div>
        <h3 className="text-lg font-black text-brown-900 uppercase tracking-wide mb-2">
          LOADING ACTIVITY
        </h3>
        <p className="text-brown-700 font-bold text-sm">
          Fetching your latest activity...
        </p>
      </div>
    );
  }

  if (!displayActivity) {
    return (
      <div className="rounded-3xl border-2 border-handdrawn bg-white/90 p-6 text-center shadow-lg font-nunito">
        <div className="w-16 h-16 bg-blue-100 border-2 border-blue-300 rounded-3xl flex items-center justify-center mx-auto mb-4">
          <Clock className="w-8 h-8 text-blue-500" />
        </div>
        <h3 className="text-lg font-black text-brown-900 uppercase tracking-wide mb-2">
          NO PREVIOUS ACTIVITY
        </h3>
        <p className="text-brown-700 font-bold text-sm">
          Start your first conversation practice session
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-3xl border-2 border-handdrawn bg-white/90 p-6 shadow-lg font-nunito">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <div className="w-14 h-14 bg-green-400 border-2 border-handdrawn rounded-3xl flex items-center justify-center mr-4 shadow-lg">
            <CheckCircle className="w-7 h-7 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-black text-brown-900 uppercase tracking-wide">
              PREVIOUS ACTIVITY
            </h3>
            <p className="text-brown-700 font-bold text-sm">
              From activities table
            </p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleViewDetails}
          className="text-green-600 hover:text-green-700 hover:bg-green-100 p-2 rounded-xl border border-green-300 font-bold"
        >
          <ArrowRight className="w-5 h-5" />
        </Button>
      </div>

      <div className="space-y-4">
        <div className={`rounded-3xl border-2 border-handdrawn p-4 ${getStatusBgColor(displayActivity.type)} cursor-pointer hover:scale-[1.02] transition-all duration-200 shadow-sm`}
             onClick={handleViewDetails}>
          <div className="flex items-center justify-between mb-3">
            <span className={`font-black text-sm ${getStatusColor(displayActivity.type)} uppercase tracking-wide`}>
              {displayActivity.name || 'Practice Activity'}
            </span>
            <span className={`font-black text-sm ${getStatusColor(displayActivity.type)} bg-white/50 px-2 py-1 rounded-xl border border-white/70`}>
              {getStatusText(displayActivity)}
            </span>
          </div>
          <div className="flex items-center justify-between mb-2">
            <span className={`font-black text-sm ${getStatusColor(displayActivity.type)}`}>Duration</span>
            <span className={`font-black ${getStatusColor(displayActivity.type)}`}>
              {displayActivity.duration_seconds 
                ? formatDuration(displayActivity.duration_seconds)
                : `~${displayActivity.estimated_duration_minutes || 10}min`
              }
            </span>
          </div>
          {displayActivity.completed_at && (
            <div className={`text-xs ${getStatusColor(displayActivity.type)} opacity-70 font-medium`}>
              Completed on {new Date(displayActivity.completed_at).toLocaleDateString()}
            </div>
          )}
          {displayActivity.description && (
            <div className={`text-xs ${getStatusColor(displayActivity.type)} opacity-60 mt-1 font-medium`}>
              {displayActivity.description}
            </div>
          )}
          {displayActivity.difficulty_level && (
            <div className={`text-xs ${getStatusColor(displayActivity.type)} opacity-50 mt-1 font-medium`}>
              Difficulty: {displayActivity.difficulty_level}
            </div>
          )}
        </div>

        {/* Conversation Summary Section */}
        {userProfile?.last_conversation_summary && (
          <div className="bg-blue-50 rounded-3xl border-2 border-blue-200 p-4 shadow-sm">
            <div className="flex items-center mb-3">
              <div className="w-8 h-8 bg-blue-400 border border-blue-500 rounded-2xl flex items-center justify-center mr-3">
                <MessageSquare className="w-4 h-4 text-white" />
              </div>
              <h4 className="text-sm font-black text-blue-800 uppercase tracking-wide">
                Conversation Summary
              </h4>
            </div>
            <p className="text-blue-700 text-sm font-bold leading-relaxed">
              {userProfile.last_conversation_summary}
            </p>
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-blue-50 rounded-3xl border-2 border-blue-200 p-4 text-center shadow-sm hover:scale-105 transition-all duration-200">
            <div className="w-10 h-10 bg-blue-400 border border-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-3">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <div className="text-xl font-black text-blue-700">
              {getPerformanceScore()}
            </div>
            <div className="text-xs text-blue-600 font-black uppercase tracking-wide">Performance</div>
          </div>
          <div className="bg-orange-50 rounded-3xl border-2 border-orange-200 p-4 text-center shadow-sm hover:scale-105 transition-all duration-200">
            <div className="w-10 h-10 bg-orange-400 border border-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-3">
              <Target className="w-5 h-5 text-white" />
            </div>
            <div className="text-xl font-black text-orange-700">
              {getEngagementScore()}
            </div>
            <div className="text-xs text-orange-600 font-black uppercase tracking-wide">Engagement</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PreviousActivitySection;
