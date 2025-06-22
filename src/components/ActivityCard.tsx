
import { Button } from "@/components/ui/button";
import { Target, TrendingUp, Star, Clock, CheckCircle, Zap, Trophy, Users, Home, Phone, Settings, ArrowLeft, RefreshCw } from "lucide-react";
import { useState, useEffect } from "react";
import AppBar from "./AppBar";
import LearningProgressTree from "./LearningProgressTree";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

interface ActivityCardProps {
  onNavigate: (view: string) => void;
}

const ActivityCard = ({ onNavigate }: ActivityCardProps) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

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

  // Fetch call logs
  const { data: callLogs = [] } = useQuery({
    queryKey: ['call-logs'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('conversations')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    }
  });

  // Generate new activity mutation
  const generateActivityMutation = useMutation({
    mutationFn: async () => {
      if (!user || !currentActivity) {
        throw new Error('User or current activity not found');
      }

      const response = await supabase.functions.invoke('generate-activity', {
        body: { 
          currentActivity: currentActivity.name,
          userId: user.id,
          activityId: currentActivity.id
        }
      });
      
      if (response.error) {
        throw new Error(response.error.message || 'Failed to generate activity');
      }
      
      return response.data;
    },
    onSuccess: (data) => {
      console.log('Activity regenerated successfully:', data);
      // Invalidate and refetch the current activity
      queryClient.invalidateQueries({ queryKey: ['current-activity', user?.id] });
    },
    onError: (error) => {
      console.error('Failed to regenerate activity:', error);
    }
  });

  const handleRegenerateActivity = () => {
    generateActivityMutation.mutate();
  };

  const lastCall = callLogs[0];

  const getRatingColor = (rating: number) => {
    if (rating < 40) return "text-red-600";
    if (rating < 70) return "text-orange-600";
    return "text-green-600";
  };

  const getRatingBgColor = (rating: number) => {
    if (rating < 40) return "bg-red-50 border-red-100";
    if (rating < 70) return "bg-orange-50 border-orange-100";
    return "bg-green-50 border-green-100";
  };

  if (isLoadingActivity || !currentActivity) {
    return (
      <div className="min-h-screen bg-amber-50">
        <AppBar 
          title="ACTIVITY" 
          onBack={() => onNavigate("home")} 
          showBackButton={true} 
        />
        <div className="px-6 pt-6">
          <div className="bg-white rounded-3xl p-6 border-4 border-gray-200 text-center">
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
        {lastCall ? (
          <div className="bg-white rounded-3xl p-6 border-4 border-gray-200">
            <div className="flex items-center mb-4">
              <div className="w-14 h-14 bg-green-400 rounded-2xl flex items-center justify-center mr-4">
                <CheckCircle className="w-7 h-7 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-800 uppercase tracking-wide">
                  PREVIOUS ACTIVITY
                </h3>
                <p className="text-gray-600 font-medium text-sm">
                  Last completed session
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="bg-green-50 rounded-2xl p-4 border-2 border-green-100">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-green-700 font-bold text-sm">Duration</span>
                  <span className="text-green-800 font-bold">
                    {Math.floor((lastCall.duration_seconds || 0) / 60)}m {(lastCall.duration_seconds || 0) % 60}s
                  </span>
                </div>
                <div className="text-green-600 text-xs">
                  Completed on {new Date(lastCall.created_at).toLocaleDateString()}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-blue-50 rounded-2xl p-3 text-center border-2 border-blue-100">
                  <div className="w-8 h-8 bg-blue-400 rounded-xl flex items-center justify-center mx-auto mb-2">
                    <TrendingUp className="w-4 h-4 text-white" />
                  </div>
                  <div className="text-lg font-bold text-blue-700">3</div>
                  <div className="text-xs text-blue-600 font-bold uppercase">Skills Improved</div>
                </div>
                <div className="bg-orange-50 rounded-2xl p-3 text-center border-2 border-orange-100">
                  <div className="w-8 h-8 bg-orange-400 rounded-xl flex items-center justify-center mx-auto mb-2">
                    <Target className="w-4 h-4 text-white" />
                  </div>
                  <div className="text-lg font-bold text-orange-700">2</div>
                  <div className="text-xs text-orange-600 font-bold uppercase">Need Practice</div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-3xl p-6 border-4 border-gray-200 text-center">
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
        )}

        {/* Today's Activity */}
        <div className="bg-blue-400 rounded-3xl p-6 border-4 border-blue-500">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center mr-4">
                <Phone className="w-7 h-7 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white uppercase tracking-wide">
                  TODAY'S ACTIVITY
                </h3>
                <p className="text-blue-100 font-medium text-sm">
                  {currentActivity.description}
                </p>
              </div>
            </div>
            <Button
              onClick={handleRegenerateActivity}
              disabled={generateActivityMutation.isPending}
              variant="ghost"
              size="sm"
              className="text-white hover:bg-blue-500 p-2"
              title="Generate new activity"
            >
              <RefreshCw className={`w-5 h-5 ${generateActivityMutation.isPending ? 'animate-spin' : ''}`} />
            </Button>
          </div>

          <div className="space-y-4">
            <div className="bg-white rounded-2xl p-4 border-2 border-white">
              <div className="flex items-center justify-between mb-3">
                <span className="text-blue-700 font-bold text-sm uppercase tracking-wide">Skills Tested</span>
                <span className="text-blue-600 font-bold text-sm">{currentActivity.estimated_duration_minutes || 15} min</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {currentActivity.skills?.map((skill, index) => (
                  <div key={index} className={`rounded-xl p-2 border ${getRatingBgColor(skill.rating)}`}>
                    <div className="text-xs font-bold text-blue-700 uppercase tracking-wide">
                      {skill.name}
                    </div>
                    <div className={`text-sm font-bold ${getRatingColor(skill.rating)}`}>
                      {skill.rating}/100
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <Button className="w-full bg-white hover:bg-blue-50 text-blue-600 font-bold py-4 text-lg rounded-2xl transition-all duration-300">
              START PRACTICE ⚡
            </Button>
          </div>
        </div>

        {/* Learning Progress Tree */}
        <div className="bg-white rounded-3xl p-6 border-4 border-gray-200">
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
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 z-50">
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
