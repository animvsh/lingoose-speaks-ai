
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

  if (!previousActivity) {
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
      </div>
    );
  }

  const formatDuration = (durationSeconds: number) => {
    const minutes = Math.floor(durationSeconds / 60);
    const seconds = durationSeconds % 60;
    return `${minutes}m ${seconds}s`;
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'completed':
        return 'text-green-700';
      case 'ended':
        return 'text-green-700';
      case 'failed':
        return 'text-red-700';
      case 'in-progress':
        return 'text-blue-700';
      default:
        return 'text-gray-700';
    }
  };

  const getStatusBgColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'completed':
        return 'bg-green-50 border-green-100';
      case 'ended':
        return 'bg-green-50 border-green-100';
      case 'failed':
        return 'bg-red-50 border-red-100';
      case 'in-progress':
        return 'bg-blue-50 border-blue-100';
      default:
        return 'bg-gray-50 border-gray-100';
    }
  };

  // Calculate performance score based on activity data
  const getPerformanceScore = () => {
    if (previousActivity.type === 'activity_rating' && previousActivity.rating) {
      return previousActivity.rating.toString();
    }
    if (previousActivity.sentiment === 'positive') return '4';
    if (previousActivity.sentiment === 'negative') return '1';
    return '3';
  };

  // Calculate engagement score
  const getEngagementScore = () => {
    if (previousActivity.type === 'activity_rating') {
      return Math.min(Math.floor((previousActivity.duration_seconds || 0) / 60), 5).toString();
    }
    return Math.floor((previousActivity.duration_seconds || 0) / 100).toString() || '2';
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
            Last practice session
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <div className={`rounded-2xl p-4 border-2 ${getStatusBgColor(previousActivity.call_status)}`}>
          <div className="flex items-center justify-between mb-2">
            <span className={`font-bold text-sm ${getStatusColor(previousActivity.call_status)}`}>
              {previousActivity.activity_name || 'Practice Session'}
            </span>
            <span className={`font-bold text-sm ${getStatusColor(previousActivity.call_status)}`}>
              {previousActivity.call_status?.toUpperCase() || 'COMPLETED'}
            </span>
          </div>
          <div className="flex items-center justify-between mb-2">
            <span className={`font-bold text-sm ${getStatusColor(previousActivity.call_status)}`}>Duration</span>
            <span className={`font-bold ${getStatusColor(previousActivity.call_status)}`}>
              {formatDuration(previousActivity.duration_seconds || 0)}
            </span>
          </div>
          <div className={`text-xs ${getStatusColor(previousActivity.call_status)} opacity-70`}>
            Completed on {new Date(previousActivity.completed_at).toLocaleDateString()}
          </div>
          {previousActivity.activity_description && (
            <div className={`text-xs ${getStatusColor(previousActivity.call_status)} opacity-60 mt-1`}>
              {previousActivity.activity_description}
            </div>
          )}
          {previousActivity.source && (
            <div className={`text-xs ${getStatusColor(previousActivity.call_status)} opacity-50 mt-1`}>
              Source: {previousActivity.source === 'user_activity' ? 'Activity Practice' : 'Voice Call'}
            </div>
          )}
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
      </div>
    </div>
  );
};

export default PreviousActivitySection;
