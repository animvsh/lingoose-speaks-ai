
import { ArrowLeft, Clock, TrendingUp, Target, MessageSquare, BookOpen, Award, Calendar, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect } from "react";
import AppBar from "./AppBar";
import { TranscriptDisplay } from "./TranscriptDisplay";
import { useCallCompletionTracker } from "@/hooks/useCallCompletionTracker";
import { useLanguageMetrics } from "@/hooks/useLanguageMetrics";
import { LanguageMetricsDisplay } from "./LanguageMetricsDisplay";

interface ActivityDetailsViewProps {
  activity: any;
  onNavigate: (view: string) => void;
}

const ActivityDetailsView = ({ activity, onNavigate }: ActivityDetailsViewProps) => {
  const { user } = useAuth();
  const { 
    latestCall, 
    startActivityDetailsTracking, 
    stopActivityDetailsTracking,
    hasProcessedTranscript 
  } = useCallCompletionTracker();

  // Get language metrics for the latest call
  const { data: languageMetrics, isLoading: metricsLoading } = useLanguageMetrics();

  // Track time spent in activity details for call completion detection
  useEffect(() => {
    console.log('ActivityDetailsView mounted - starting tracking');
    startActivityDetailsTracking();
    
    return () => {
      console.log('ActivityDetailsView unmounted - stopping tracking');
      stopActivityDetailsTracking();
    };
  }, []);

  // Log when we detect processed transcript
  useEffect(() => {
    if (hasProcessedTranscript) {
      console.log('Processed transcript detected in ActivityDetailsView');
    }
  }, [hasProcessedTranscript]);

  // Fetch detailed activity data including transcripts and analysis
  const { data: activityDetails, isLoading } = useQuery({
    queryKey: ['activity-details', activity?.id, user?.id],
    queryFn: async () => {
      if (!user || !activity) throw new Error('No user or activity found');

      // Fetch call analysis data if available
      const { data: callData, error: callError } = await supabase
        .from('vapi_call_analysis')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      // Fetch user activity rating for this specific activity
      const { data: ratingData, error: ratingError } = await supabase
        .from('user_activity_ratings')
        .select(`
          *,
          activities (*)
        `)
        .eq('user_id', user.id)
        .eq('activity_id', activity.id)
        .order('completed_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      // Fetch real skill analysis data if call analysis exists
      let skillsAnalysis = null;
      if (callData) {
        const { data: skillsData, error: skillsError } = await supabase
          .from('vapi_skill_analysis')
          .select('*')
          .eq('vapi_call_analysis_id', callData.id)
          .order('created_at', { ascending: false });

        if (!skillsError && skillsData && skillsData.length > 0) {
          skillsAnalysis = skillsData;
        }
      }

      console.log('Activity details query:', { callData, ratingData, skillsAnalysis, callError, ratingError });

      return {
        callAnalysis: callData,
        rating: ratingData,
        activity: activity,
        skillsAnalysis: skillsAnalysis
      };
    },
    enabled: !!user && !!activity
  });

  const formatDuration = (seconds: number) => {
    if (!seconds) return 'N/A';
    const mins = Math.floor(seconds / 60);
    const secs = Math.round(seconds % 60);
    return `${mins}m ${secs}s`;
  };

  const getSkillsTestedData = () => {
    // Use real skills analysis data if available
    if (activityDetails?.skillsAnalysis && activityDetails.skillsAnalysis.length > 0) {
      return activityDetails.skillsAnalysis.map(skill => ({
        name: skill.skill_name,
        before: skill.before_score,
        after: skill.after_score,
        improvement: skill.improvement,
        isReal: true
      }));
    }

    // Return empty array if no real data is available
    return [];
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-amber-50">
        <AppBar 
          title="ACTIVITY DETAILS" 
          onBack={() => onNavigate("activity")} 
          showBackButton={true} 
        />
        <div className="px-6 pt-6 text-center">
          <div className="w-16 h-16 bg-gray-200 rounded-2xl flex items-center justify-center mx-auto mb-4 animate-pulse">
            <Clock className="w-8 h-8 text-gray-400" />
          </div>
          <p className="text-gray-600">Loading activity details...</p>
        </div>
      </div>
    );
  }

  const skillsData = getSkillsTestedData();
  const hasRealTranscript = activityDetails?.callAnalysis?.transcript;
  const hasRealSkillsAnalysis = skillsData.length > 0;

  return (
    <div className="min-h-screen bg-amber-50 pb-6">
      <AppBar 
        title="ACTIVITY DETAILS" 
        onBack={() => onNavigate("activity")} 
        showBackButton={true} 
      />

      <div className="px-6 space-y-6">
        {/* Activity Overview */}
        <div className="bg-white rounded-3xl p-6 border-4 border-gray-200">
          <div className="flex items-center mb-4">
            <div className="w-14 h-14 bg-green-400 rounded-2xl flex items-center justify-center mr-4">
              <Award className="w-7 h-7 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-gray-800 uppercase tracking-wide">
                {activity?.name || 'Activity Details'}
              </h3>
              <p className="text-gray-600 font-medium text-sm">
                {activity?.description}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-700">
                {Math.round(activityDetails?.rating?.rating || 4)}/5
              </div>
              <div className="text-xs text-green-600 font-bold uppercase">Overall Rating</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-700">
                {formatDuration(activityDetails?.rating?.duration_seconds || activity?.estimated_duration_minutes * 60)}
              </div>
              <div className="text-xs text-blue-600 font-bold uppercase">Duration</div>
            </div>
          </div>

          {activity?.completed_at && (
            <div className="flex items-center text-gray-600 text-sm">
              <Calendar className="w-4 h-4 mr-2" />
              Completed on {new Date(activity.completed_at).toLocaleDateString()} at {new Date(activity.completed_at).toLocaleTimeString()}
            </div>
          )}
        </div>

        {/* Skills Tested & Improved */}
        <div className="bg-white rounded-3xl p-6 border-4 border-gray-200">
          <div className="flex items-center mb-4">
            <div className="w-14 h-14 bg-purple-400 rounded-2xl flex items-center justify-center mr-4">
              <TrendingUp className="w-7 h-7 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-800 uppercase tracking-wide">
                SKILLS TESTED & IMPROVED
              </h3>
              <p className="text-gray-600 font-medium text-sm">
                {hasRealSkillsAnalysis ? 'Real analysis from your practice session' : 'No skill analysis data available'}
              </p>
            </div>
          </div>

          {hasRealSkillsAnalysis ? (
            <>
              <div className="mb-4 p-3 bg-green-50 rounded-2xl">
                <p className="text-green-700 text-sm font-medium">
                  ✓ Analysis based on real conversation data from VAPI call
                </p>
              </div>

              <div className="space-y-4">
                {skillsData.map((skill, index) => (
                  <div key={index} className="bg-gray-50 rounded-2xl p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-bold text-gray-800">{skill.name}</span>
                      <span className="text-green-600 font-bold">+{skill.improvement}%</span>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="flex-1">
                        <div className="text-xs text-gray-600 mb-1">Before: {skill.before}%</div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className="bg-red-400 h-2 rounded-full" style={{ width: `${skill.before}%` }}></div>
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="text-xs text-gray-600 mb-1">After: {skill.after}%</div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className="bg-green-400 h-2 rounded-full" style={{ width: `${skill.after}%` }}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="w-8 h-8 text-orange-500" />
              </div>
              <h4 className="text-lg font-bold text-gray-800 mb-2">No Skills Analysis Available</h4>
              <p className="text-gray-600 mb-4">
                Complete a practice call session to see detailed skill analysis here.
              </p>
              <p className="text-sm text-gray-500">
                Your conversation will be analyzed to provide insights on greeting, conversation flow, vocabulary usage, and pronunciation.
              </p>
            </div>
          )}
        </div>

        {/* Language Metrics */}
        <LanguageMetricsDisplay 
          metrics={languageMetrics as any} 
          isLoading={metricsLoading}
        />

        {/* Conversation Transcript with Speaker Identification */}
        <TranscriptDisplay 
          callAnalysis={activityDetails?.callAnalysis || latestCall} 
          className="bg-white rounded-3xl"
        />

        {/* Feedback & Recommendations */}
        {activityDetails?.rating?.feedback_notes && (
          <div className="bg-white rounded-3xl p-6 border-4 border-gray-200">
            <div className="flex items-center mb-4">
              <div className="w-14 h-14 bg-orange-400 rounded-2xl flex items-center justify-center mr-4">
                <BookOpen className="w-7 h-7 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-800 uppercase tracking-wide">
                  FEEDBACK & RECOMMENDATIONS
                </h3>
                <p className="text-gray-600 font-medium text-sm">
                  Personalized insights for improvement
                </p>
              </div>
            </div>

            <div className="bg-orange-50 rounded-2xl p-4">
              <p className="text-orange-800 font-medium">
                {activityDetails.rating.feedback_notes}
              </p>
            </div>
          </div>
        )}

        {/* Performance Analysis */}
        {activityDetails?.callAnalysis?.sentiment_analysis && (
          <div className="bg-white rounded-3xl p-6 border-4 border-gray-200">
            <div className="flex items-center mb-4">
              <div className="w-14 h-14 bg-indigo-400 rounded-2xl flex items-center justify-center mr-4">
                <Target className="w-7 h-7 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-800 uppercase tracking-wide">
                  PERFORMANCE ANALYSIS
                </h3>
                <p className="text-gray-600 font-medium text-sm">
                  AI-powered conversation insights
                </p>
              </div>
            </div>

            <div className="mb-3 p-3 bg-green-50 rounded-2xl">
              <p className="text-green-700 text-sm font-medium">
                ✓ Real sentiment analysis from VAPI call
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4">
              <div className="bg-indigo-50 rounded-2xl p-4 text-center">
                <div className="text-lg font-bold text-indigo-700 capitalize">
                  {(activityDetails.callAnalysis.sentiment_analysis as any)?.overall_sentiment || 'Positive'}
                </div>
                <div className="text-xs text-indigo-600 font-bold uppercase">Overall Sentiment</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ActivityDetailsView;
