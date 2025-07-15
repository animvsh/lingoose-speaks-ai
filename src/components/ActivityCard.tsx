import { Button } from "@/components/ui/button";
import { RefreshCw, Trophy, Home, Phone, CheckCircle, Settings } from "lucide-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import LearningProgressTree from "./LearningProgressTree";
import PreviousActivitySection from "./PreviousActivitySection";
import TodaysActivitySection from "./TodaysActivitySection";
import { useCallInitiation } from "@/hooks/useCallInitiation";
import { useActivityGeneration } from "@/hooks/useActivityGeneration";
import AppBar from "./AppBar";

interface ActivityCardProps {
  onNavigate: (view: string) => void;
}

const ActivityCard = ({ onNavigate }: ActivityCardProps) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { startCall, isStartingCall } = useCallInitiation();
  const { regenerateActivity, isRegenerating } = useActivityGeneration();

  // Fetch the latest activity from database
  const {
    data: currentActivity,
    isLoading: isLoadingActivity
  } = useQuery({
    queryKey: ['current-activity', user?.id],
    queryFn: async () => {
      if (!user) throw new Error('No user found');
      console.log('Fetching current activity for user:', user.id);

      // Get the first active activity (we'll treat this as the current activity)
      const {
        data,
        error
      } = await supabase.from('activities').select('*').eq('is_active', true).order('activity_order').limit(1).single();
      console.log('Current activity query result:', {
        data,
        error
      });
      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching current activity:', error);
        throw error;
      }

      // If no activity found, return a default one
      if (!data) {
        console.log('No active activity found, returning default');
        return {
          id: null,
          name: "Hotel check-in conversation",
          description: "Practice checking into a hotel 🏨",
          estimated_duration_minutes: 15,
          prompt: "You are checking into a hotel. Practice greeting the receptionist, providing your reservation details, asking about amenities, and completing the check-in process.",
          skills: [{
            name: "Greeting phrases",
            rating: 65
          }, {
            name: "Personal information",
            rating: 78
          }, {
            name: "Room preferences",
            rating: 42
          }, {
            name: "Payment discussion",
            rating: 89
          }]
        };
      }
      console.log('Active activity found:', data);
      return {
        ...data,
        skills: [{
          name: "Greeting phrases",
          rating: 65
        }, {
          name: "Personal information",
          rating: 78
        }, {
          name: "Room preferences",
          rating: 42
        }, {
          name: "Payment discussion",
          rating: 89
        }]
      };
    },
    enabled: !!user
  });

  // Enhanced previous activity data fetching with better logging
  const {
    data: previousActivityData
  } = useQuery({
    queryKey: ['previous-activity-data', user?.id],
    queryFn: async () => {
      if (!user) throw new Error('No user found');
      console.log('Fetching previous activity data for user:', user.id);

      // Test activities table access first
      const {
        data: activitiesCount,
        error: activitiesError
      } = await supabase.from('activities').select('id', {
        count: 'exact',
        head: true
      });
      console.log('Activities table test:', {
        count: activitiesCount,
        error: activitiesError
      });

      // Test user_activity_ratings table access
      const {
        data: ratingsCount,
        error: ratingsError
      } = await supabase.from('user_activity_ratings').select('id', {
        count: 'exact',
        head: true
      }).eq('user_id', user.id);
      console.log('User activity ratings test:', {
        count: ratingsCount,
        error: ratingsError
      });

      // Fetch the latest completed user activity rating with activity details
      const {
        data: latestRating,
        error: ratingError
      } = await supabase.from('user_activity_ratings').select(`
          *,
          activities (
            id,
            name,
            description,
            estimated_duration_minutes,
            difficulty_level
          )
        `).eq('user_id', user.id).order('completed_at', {
        ascending: false
      }).limit(1).maybeSingle();
      console.log('Latest activity rating query:', {
        data: latestRating,
        error: ratingError
      });
      if (ratingError) {
        console.error('Error fetching latest activity rating:', ratingError);
      }

      // Fetch call analysis data as backup
      const {
        data: callAnalysis,
        error: callError
      } = await supabase.from('vapi_call_analysis').select('*').eq('user_id', user.id).order('created_at', {
        ascending: false
      }).limit(1).maybeSingle();
      console.log('Call analysis query:', {
        data: callAnalysis,
        error: callError
      });
      if (callError) {
        console.error('Error fetching call analysis:', callError);
      }

      // Prefer activity rating data over call analysis
      if (latestRating && latestRating.activities) {
        console.log('Using activity rating data as previous activity');
        return {
          type: 'activity_rating',
          id: latestRating.id,
          activity_name: latestRating.activities.name,
          activity_description: latestRating.activities.description,
          duration_seconds: latestRating.duration_seconds || latestRating.activities.estimated_duration_minutes * 60,
          completed_at: latestRating.completed_at,
          rating: latestRating.rating,
          call_status: 'completed',
          source: 'user_activity'
        };
      }

      // Fallback to call analysis data
      if (callAnalysis) {
        console.log('Using call analysis data as previous activity');
        return {
          type: 'call_analysis',
          id: callAnalysis.id,
          activity_name: 'Phone Conversation',
          activity_description: 'Voice conversation practice',
          duration_seconds: callAnalysis.call_duration || 0,
          completed_at: callAnalysis.created_at,
          call_status: callAnalysis.call_status || 'completed',
          vapi_call_id: callAnalysis.vapi_call_id,
          sentiment: callAnalysis.sentiment_analysis ? (callAnalysis.sentiment_analysis as any)?.overall_sentiment : null,
          source: 'call_analysis'
        };
      }
      console.log('No previous activity data found');
      return null;
    },
    enabled: !!user
  });

  const handleRegenerateActivity = () => {
    if (currentActivity) {
      regenerateActivity(currentActivity);
    }
  };

  const handleStartPractice = async () => {
    if (currentActivity) {
      await startCall(currentActivity);

      // Refresh all relevant queries after starting a call
      queryClient.invalidateQueries({ queryKey: ['previous-activity-data'] });
      queryClient.invalidateQueries({ queryKey: ['latest-completed-activity'] });
      queryClient.invalidateQueries({ queryKey: ['curriculum-analytics'] });
      queryClient.invalidateQueries({ queryKey: ['user-activity-ratings'] });
      queryClient.invalidateQueries({ queryKey: ['call-analysis'] });
      queryClient.invalidateQueries({ queryKey: ['latest-call-analysis'] });
    }
  };

  console.log('ActivityCard render state:', {
    user: user?.id,
    isLoadingActivity,
    currentActivity: currentActivity?.id,
    previousActivityData: previousActivityData?.type
  });

  if (isLoadingActivity || !currentActivity) {
    return (
      <div className="min-h-screen bg-amber-50">
        <AppBar title="Practice" showBackButton={false} />
        <div className="px-6 pt-6">
          <div className="bg-amber-50 rounded-3xl p-6 border-4 border-gray-200 text-center">
            <div className="w-16 h-16 bg-gray-200 rounded-2xl flex items-center justify-center mx-auto mb-4 animate-pulse">
              <RefreshCw className="w-8 h-8 text-gray-400 animate-spin" />
            </div>
            <h3 className="text-lg font-bold text-gray-800 uppercase tracking-wide mb-2">
              LOADING ACTIVITY
            </h3>
            <p className="text-gray-600 font-medium text-sm">
              Preparing your practice session...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-amber-50 pb-28">
      <AppBar title="Practice" showBackButton={false} />
      <div className="px-6 space-y-6 pt-6">
        {/* Previous Activity Section */}
        <PreviousActivitySection 
          previousActivity={previousActivityData} 
          onNavigate={onNavigate} 
        />

        {/* Main Learning Section - with relative positioning for button */}
        <div className="relative">
          <TodaysActivitySection 
            currentActivity={currentActivity} 
            onRegenerateActivity={handleRegenerateActivity} 
            onStartPractice={handleStartPractice} 
            isRegenerating={isRegenerating} 
            isStartingCall={isStartingCall} 
          />
        </div>

        {/* Learning Progress Tree */}
        <div className="bg-amber-50 rounded-3xl p-6 border-4 border-gray-200">
          <div className="flex items-center mb-4">
            <div className="w-14 h-14 bg-purple-400 rounded-2xl flex items-center justify-center mr-4">
              <Trophy className="w-7 h-7 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-800 uppercase tracking-wide">
                LEARNING PROGRESS
              </h3>
              <p className="text-gray-600 font-medium text-sm">
                Your skill development path
              </p>
            </div>
          </div>
          <LearningProgressTree />
        </div>
      </div>
    </div>
  );
};

export default ActivityCard;
