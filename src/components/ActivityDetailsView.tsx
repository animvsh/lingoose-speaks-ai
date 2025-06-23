
import { ArrowLeft, Clock, TrendingUp, Target, MessageSquare, BookOpen, Award, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import AppBar from "./AppBar";

interface ActivityDetailsViewProps {
  activity: any;
  onNavigate: (view: string) => void;
}

const ActivityDetailsView = ({ activity, onNavigate }: ActivityDetailsViewProps) => {
  const { user } = useAuth();

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

      console.log('Activity details query:', { callData, ratingData, callError, ratingError });

      return {
        callAnalysis: callData,
        rating: ratingData,
        activity: activity
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
    // Mock skills data based on activity type
    const baseSkills = [
      { name: "Greeting & Introductions", before: 65, after: 78, improvement: 13 },
      { name: "Conversation Flow", before: 58, after: 72, improvement: 14 },
      { name: "Vocabulary Usage", before: 71, after: 84, improvement: 13 },
      { name: "Pronunciation", before: 62, after: 75, improvement: 13 }
    ];

    if (activityDetails?.rating?.rating) {
      const rating = activityDetails.rating.rating;
      return baseSkills.map(skill => ({
        ...skill,
        after: Math.round(skill.before + (rating * 3)),
        improvement: Math.round(rating * 3)
      }));
    }

    return baseSkills;
  };

  const getTranscript = () => {
    if (activityDetails?.callAnalysis?.transcript) {
      return activityDetails.callAnalysis.transcript;
    }
    
    // Mock transcript based on activity
    return `User: Hello, I'd like to check into my reservation.

Receptionist: Good morning! Welcome to our hotel. May I have your last name and confirmation number?

User: Yes, it's Smith, and my confirmation number is ABC123.

Receptionist: Perfect! I have your reservation here. You're staying with us for 3 nights in a deluxe room. 

User: That's correct. What time is checkout?

Receptionist: Checkout is at 11 AM. Here's your room key and some information about our amenities. Enjoy your stay!

User: Thank you very much!`;
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
  const transcript = getTranscript();

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
                Performance before and after this session
              </p>
            </div>
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
        </div>

        {/* Conversation Transcript */}
        <div className="bg-white rounded-3xl p-6 border-4 border-gray-200">
          <div className="flex items-center mb-4">
            <div className="w-14 h-14 bg-blue-400 rounded-2xl flex items-center justify-center mr-4">
              <MessageSquare className="w-7 h-7 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-800 uppercase tracking-wide">
                CONVERSATION TRANSCRIPT
              </h3>
              <p className="text-gray-600 font-medium text-sm">
                Full conversation from your practice session
              </p>
            </div>
          </div>

          <div className="bg-gray-50 rounded-2xl p-4 max-h-64 overflow-y-auto">
            <pre className="text-sm text-gray-700 whitespace-pre-wrap font-medium leading-relaxed">
              {transcript}
            </pre>
          </div>
        </div>

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
