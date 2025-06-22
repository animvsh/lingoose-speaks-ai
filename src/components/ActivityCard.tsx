
import { Button } from "@/components/ui/button";
import { RefreshCw, Trophy, Home, Phone, CheckCircle, Settings } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import AppBar from "./AppBar";
import LearningProgressTree from "./LearningProgressTree";
import PreviousActivitySection from "./PreviousActivitySection";
import TodaysActivitySection from "./TodaysActivitySection";
import { useCallInitiation } from "@/hooks/useCallInitiation";
import { useActivityGeneration } from "@/hooks/useActivityGeneration";

interface ActivityCardProps {
  onNavigate: (view: string) => void;
}

const ActivityCard = ({ onNavigate }: ActivityCardProps) => {
  const { user } = useAuth();
  const { startCall, isStartingCall } = useCallInitiation();
  const { regenerateActivity, isRegenerating } = useActivityGeneration();

  // Fetch the latest activity from database
  const { data: currentActivity, isLoading: isLoadingActivity } = useQuery({
    queryKey: ['current-activity', user?.id],
    queryFn: async () => {
      if (!user) throw new Error('No user found');

      // Get the first active activity (we'll treat this as the current activity)
      const { data, error } = await supabase
        .from('activities')
        .select('*')
        .eq('is_active', true)
        .order('activity_order')
        .limit(1)
        .single();
      
      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      // If no activity found, return a default one
      if (!data) {
        return {
          id: null,
          name: "Hotel check-in conversation",
          description: "Practice checking into a hotel 🏨",
          estimated_duration_minutes: 15,
          prompt: "You are checking into a hotel. Practice greeting the receptionist, providing your reservation details, asking about amenities, and completing the check-in process.",
          skills: [
            { name: "Greeting phrases", rating: 65 },
            { name: "Personal information", rating: 78 },
            { name: "Room preferences", rating: 42 },
            { name: "Payment discussion", rating: 89 }
          ]
        };
      }

      return {
        ...data,
        skills: [
          { name: "Greeting phrases", rating: 65 },
          { name: "Personal information", rating: 78 },
          { name: "Room preferences", rating: 42 },
          { name: "Payment discussion", rating: 89 }
        ]
      };
    },
    enabled: !!user
  });

  // Fetch call logs from conversations table and vapi_call_analysis
  const { data: callLogs = [] } = useQuery({
    queryKey: ['call-logs', user?.id],
    queryFn: async () => {
      if (!user) throw new Error('No user found');

      // First try to get data from vapi_call_analysis (most complete data)
      const { data: vapiAnalysis, error: vapiError } = await supabase
        .from('vapi_call_analysis')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (!vapiError && vapiAnalysis && vapiAnalysis.length > 0) {
        return vapiAnalysis.map(call => ({
          id: call.id,
          user_id: call.user_id,
          phone_number: call.phone_number,
          call_status: call.call_status || 'completed',
          duration_seconds: call.call_duration || 0,
          created_at: call.created_at,
          vapi_call_id: call.vapi_call_id,
          transcript: call.transcript,
          sentiment: call.sentiment_analysis ? (call.sentiment_analysis as any)?.overall_sentiment : null
        }));
      }

      // Fallback to conversations table
      const { data: conversations, error: convError } = await supabase
        .from('conversations')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      
      if (convError) throw convError;
      
      return (conversations || []).map(conv => ({
        id: conv.id,
        user_id: conv.user_id,
        phone_number: conv.conversation_data ? (conv.conversation_data as any)?.phone_number || '' : '',
        call_status: conv.conversation_data ? (conv.conversation_data as any)?.status || 'completed' : 'completed',
        duration_seconds: conv.duration_seconds || 300, // Default 5 minutes if not available
        created_at: conv.created_at,
        vapi_call_id: conv.conversation_data ? (conv.conversation_data as any)?.call_id : null,
        scenario: conv.conversation_data ? (conv.conversation_data as any)?.scenario : null
      }));
    },
    enabled: !!user
  });

  const handleRegenerateActivity = () => {
    if (currentActivity) {
      regenerateActivity(currentActivity);
    }
  };

  const handleStartPractice = () => {
    if (currentActivity) {
      startCall(currentActivity);
    }
  };

  const lastCall = callLogs[0];

  if (isLoadingActivity || !currentActivity) {
    return (
      <div className="min-h-screen bg-amber-50">
        <AppBar 
          title="ACTIVITY" 
          onBack={() => onNavigate("home")} 
          showBackButton={true} 
        />
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
      <AppBar 
        title="ACTIVITY" 
        onBack={() => onNavigate("home")} 
        showBackButton={true} 
      />

      <div className="px-6 space-y-6">
        {/* Previous Activity Section */}
        <PreviousActivitySection lastCall={lastCall} />

        {/* Today's Activity */}
        <TodaysActivitySection 
          currentActivity={currentActivity}
          onRegenerateActivity={handleRegenerateActivity}
          onStartPractice={handleStartPractice}
          isRegenerating={isRegenerating}
          isStartingCall={isStartingCall}
        />

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

      {/* Bottom Navigation - Fixed positioning */}
      <div className="fixed bottom-0 left-0 right-0 bg-amber-50 border-t border-gray-100 z-50">
        <div className="max-w-md mx-auto px-6 py-4">
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
              className="w-14 h-14 bg-blue-400 rounded-2xl text-white"
            >
              <Phone className="w-6 h-6" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onNavigate("curriculum")}
              className="w-14 h-14 bg-gray-200 rounded-2xl text-gray-600"
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

export default ActivityCard;
