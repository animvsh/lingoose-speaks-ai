
import { CheckCircle, TrendingUp, Target, Clock, MessageSquare } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

interface PreviousActivitySectionProps {
  previousActivity: any;
}

const PreviousActivitySection = ({ previousActivity }: PreviousActivitySectionProps) => {
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

  // Test query to verify activities table access
  const { data: activitiesTest } = useQuery({
    queryKey: ['activities-test', user?.id],
    queryFn: async () => {
      console.log('Testing activities table access...');
      
      const { data, error, count } = await supabase
        .from('activities')
        .select('*', { count: 'exact' })
        .limit(5);

      console.log('Activities table test results:', {
        data,
        error,
        count,
        user_id: user?.id
      });

      if (error) {
        console.error('Activities table access error:', error);
      }

      return { data, error, count };
    },
    enabled: !!user,
  });

  // Test query to verify user_activity_ratings access
  const { data: ratingsTest } = useQuery({
    queryKey: ['ratings-test', user?.id],
    queryFn: async () => {
      if (!user) return null;

      console.log('Testing user_activity_ratings table access...');
      
      const { data, error, count } = await supabase
        .from('user_activity_ratings')
        .select('*', { count: 'exact' })
        .eq('user_id', user.id)
        .limit(5);

      console.log('User activity ratings test results:', {
        data,
        error,
        count,
        user_id: user.id
      });

      if (error) {
        console.error('User activity ratings access error:', error);
      }

      return { data, error, count };
    },
    enabled: !!user,
  });

  // Use the fetched activity data instead of the prop
  const displayActivity = latestActivity || previousActivity;

  console.log('PreviousActivitySection render:', {
    latestActivity,
    previousActivity,
    displayActivity,
    isLoadingActivity,
    activitiesTest,
    ratingsTest
  });

  if (isLoadingActivity) {
    return (
      <div className="bg-amber-50 rounded-3xl p-6 border-4 border-gray-200 text-center">
        <div className="w-16 h-16 bg-gray-200 rounded-2xl flex items-center justify-center mx-auto mb-4 animate-pulse">
          <Clock className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-bold text-gray-800 uppercase tracking-wide mb-2">
          LOADING ACTIVITY
        </h3>
        <p className="text-gray-600 font-medium text-sm">
          Fetching your latest activity...
        </p>
      </div>
    );
  }

  if (!displayActivity) {
    return (
      <div className="bg-amber-50 rounded-3xl p-6 border-4 border-gray-200 text-center">
        <div className="w-16 h-16 bg-gray-200 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Clock className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-bold text-gray-800 uppercase tracking-wide mb-2">
          NO PREVIOUS ACTIVITY
        </h3>
        <p className="text-gray-600 font-medium text-sm">
          Start your first conversation practice session
        </p>
        {/* Debug info */}
        <div className="mt-4 text-xs text-gray-500">
          Debug: Activities: {activitiesTest?.count || 0}, Ratings: {ratingsTest?.count || 0}
        </div>
      </div>
    );
  }

  const formatDuration = (durationSeconds: number) => {
    if (!durationSeconds) return 'N/A';
    const minutes = Math.floor(durationSeconds / 60);
    const seconds = durationSeconds % 60;
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

  // Calculate performance score based on activity data
  const getPerformanceScore = () => {
    if (displayActivity.rating) {
      return displayActivity.rating.toString();
    }
    if (displayActivity.type === 'activity_available') return 'N/A';
    return '3';
  };

  // Calculate engagement score
  const getEngagementScore = () => {
    if (displayActivity.duration_seconds) {
      return Math.min(Math.floor(displayActivity.duration_seconds / 60), 5).toString();
    }
    if (displayActivity.estimated_duration_minutes) {
      return Math.min(displayActivity.estimated_duration_minutes / 3, 5).toString();
    }
    return 'N/A';
  };

  return (
    <div className="bg-amber-50 rounded-3xl p-6 border-4 border-gray-200">
      <div className="flex items-center mb-4">
        <div className="w-14 h-14 bg-green-400 rounded-2xl flex items-center justify-center mr-4">
          <CheckCircle className="w-7 h-7 text-white" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-gray-800 uppercase tracking-wide">
            PREVIOUS ACTIVITY
          </h3>
          <p className="text-gray-600 font-medium text-sm">
            From activities table
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <div className={`rounded-2xl p-4 border-2 ${getStatusBgColor(displayActivity.type)}`}>
          <div className="flex items-center justify-between mb-2">
            <span className={`font-bold text-sm ${getStatusColor(displayActivity.type)}`}>
              {displayActivity.name || 'Practice Activity'}
            </span>
            <span className={`font-bold text-sm ${getStatusColor(displayActivity.type)}`}>
              {getStatusText(displayActivity)}
            </span>
          </div>
          <div className="flex items-center justify-between mb-2">
            <span className={`font-bold text-sm ${getStatusColor(displayActivity.type)}`}>Duration</span>
            <span className={`font-bold ${getStatusColor(displayActivity.type)}`}>
              {displayActivity.duration_seconds 
                ? formatDuration(displayActivity.duration_seconds)
                : `~${displayActivity.estimated_duration_minutes || 10}min`
              }
            </span>
          </div>
          {displayActivity.completed_at && (
            <div className={`text-xs ${getStatusColor(displayActivity.type)} opacity-70`}>
              Completed on {new Date(displayActivity.completed_at).toLocaleDateString()}
            </div>
          )}
          {displayActivity.description && (
            <div className={`text-xs ${getStatusColor(displayActivity.type)} opacity-60 mt-1`}>
              {displayActivity.description}
            </div>
          )}
          {displayActivity.difficulty_level && (
            <div className={`text-xs ${getStatusColor(displayActivity.type)} opacity-50 mt-1`}>
              Difficulty: {displayActivity.difficulty_level}
            </div>
          )}
          <div className={`text-xs ${getStatusColor(displayActivity.type)} opacity-50 mt-1`}>
            Source: {displayActivity.source || 'activities_table'}
          </div>
        </div>

        {/* Conversation Summary Section */}
        {userProfile?.last_conversation_summary && (
          <div className="bg-blue-50 rounded-2xl p-4 border-2 border-blue-100">
            <div className="flex items-center mb-3">
              <div className="w-8 h-8 bg-blue-400 rounded-xl flex items-center justify-center mr-3">
                <MessageSquare className="w-4 h-4 text-white" />
              </div>
              <h4 className="text-sm font-bold text-blue-800 uppercase tracking-wide">
                Conversation Summary
              </h4>
            </div>
            <p className="text-blue-700 text-sm font-medium leading-relaxed">
              {userProfile.last_conversation_summary}
            </p>
          </div>
        )}

        <div className="grid grid-cols-2 gap-3">
          <div className="bg-blue-50 rounded-2xl p-3 text-center border-2 border-blue-100">
            <div className="w-8 h-8 bg-blue-400 rounded-xl flex items-center justify-center mx-auto mb-2">
              <TrendingUp className="w-4 h-4 text-white" />
            </div>
            <div className="text-lg font-bold text-blue-700">
              {getPerformanceScore()}
            </div>
            <div className="text-xs text-blue-600 font-bold uppercase">Performance</div>
          </div>
          <div className="bg-orange-50 rounded-2xl p-3 text-center border-2 border-orange-100">
            <div className="w-8 h-8 bg-orange-400 rounded-xl flex items-center justify-center mx-auto mb-2">
              <Target className="w-4 h-4 text-white" />
            </div>
            <div className="text-lg font-bold text-orange-700">
              {getEngagementScore()}
            </div>
            <div className="text-xs text-orange-600 font-bold uppercase">Engagement</div>
          </div>
        </div>

        {/* Debug Information */}
        {process.env.NODE_ENV === 'development' && (
          <div className="bg-gray-100 rounded-2xl p-3 text-xs">
            <div className="font-bold mb-1">Debug Info:</div>
            <div>Activity Type: {displayActivity.type}</div>
            <div>Activity ID: {displayActivity.id}</div>
            <div>Source: {displayActivity.source}</div>
            <div>Activities in DB: {activitiesTest?.count || 0}</div>
            <div>User Ratings: {ratingsTest?.count || 0}</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PreviousActivitySection;
