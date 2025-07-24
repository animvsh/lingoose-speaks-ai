
import { Button } from "@/components/ui/button";
import { Phone, RefreshCw, Zap, Clock, AlertTriangle } from "lucide-react";
import { usePostHog } from "@/hooks/usePostHog";
import { useEngagementTracking } from "@/hooks/useEngagementTracking";
import { useLearningAnalytics } from "@/hooks/useLearningAnalytics";
import { useSubscriptionStatus } from "@/hooks/useSubscriptionStatus";

interface TodaysActivitySectionProps {
  currentActivity: any;
  onRegenerateActivity: () => void;
  onStartPractice: () => void;
  isRegenerating: boolean;
  isStartingCall: boolean;
}

const TodaysActivitySection = ({ 
  currentActivity, 
  onRegenerateActivity, 
  onStartPractice, 
  isRegenerating, 
  isStartingCall 
}: TodaysActivitySectionProps) => {
  const { trackPracticeStart, trackActivityRegenerate } = usePostHog();
  const { trackTap } = useEngagementTracking();
  const { trackLearningSessionStart } = useLearningAnalytics();
  const { data: subscriptionStatus } = useSubscriptionStatus();

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

  const handleRegenerateActivity = () => {
    trackTap('regenerate_activity', 'todays_activity', {
      activity_id: currentActivity.id,
      activity_name: currentActivity.name
    });
    trackActivityRegenerate(currentActivity);
    onRegenerateActivity();
  };

  const handleStartPractice = () => {
    trackTap('start_practice', 'todays_activity', {
      activity_id: currentActivity.id,
      activity_name: currentActivity.name,
      difficulty: currentActivity.difficulty_level || 'medium'
    });

    // Track learning session start
    const sessionId = trackLearningSessionStart({
      activityId: currentActivity.id,
      activityName: currentActivity.name,
      startTime: Date.now(),
      difficulty: currentActivity.difficulty_level || 'medium',
      skillsTargeted: currentActivity.skills?.map((s: any) => s.name) || []
    });

    trackPracticeStart(currentActivity);
    onStartPractice();
  };

  const canStartCall = subscriptionStatus?.has_minutes;
  const minutesRemaining = subscriptionStatus?.minutes_remaining || 0;

  return (
    <div className="space-y-6 font-nunito">
      {/* Header Section */}
      <div className="w-full rounded-3xl border-2 border-handdrawn bg-white/90 p-6 shadow-lg relative">
        {/* Regenerate button positioned at top right */}
        <div className="absolute top-4 right-4">
          <Button
            onClick={handleRegenerateActivity}
            disabled={isRegenerating}
            variant="outline"
            size="sm"
            className="bg-blue-100 text-blue-700 border-2 border-blue-300 hover:bg-blue-200 font-bold p-3 rounded-xl"
            title="Generate new activity"
          >
            <RefreshCw className={`w-5 h-5 ${isRegenerating ? 'animate-spin' : ''}`} />
          </Button>
        </div>

        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-orange-100 border-2 border-orange-300 rounded-3xl flex items-center justify-center mx-auto mb-4">
            <Zap className="w-8 h-8 text-orange-500" />
          </div>
          <h2 className="text-2xl font-black text-brown-900 mb-4 uppercase tracking-wide">
            TODAY'S LEARNING SESSION
          </h2>
        </div>

        <div className="bg-orange-50 rounded-2xl border-2 border-orange-200 p-4 mb-4">
          <h3 className="text-lg font-black text-brown-900 mb-2 text-center">
            {currentActivity.name}
          </h3>
          <p className="text-brown-700 font-bold text-sm text-center">
            {currentActivity.description}
          </p>
        </div>

        {/* Usage Status Display */}
        {subscriptionStatus && (
          <div className="bg-blue-50 rounded-2xl border-2 border-blue-200 p-4">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Clock className="w-5 h-5 text-blue-500" />
              <span className="text-brown-900 font-bold">
                {minutesRemaining.toFixed(1)} minutes remaining this week
              </span>
            </div>
            {!canStartCall && (
              <div className="flex items-center justify-center gap-2 text-red-600">
                <AlertTriangle className="w-4 h-4" />
                <span className="text-sm font-bold">
                  {subscriptionStatus.subscription_status === 'free_trial' 
                    ? 'Free trial expired or limit reached' 
                    : 'Weekly limit reached'}
                </span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Skills Section */}
      <div className="w-full rounded-3xl border-2 border-handdrawn bg-white/90 p-6 shadow-lg">
        <h3 className="text-xl font-black text-brown-900 mb-6 uppercase tracking-wide flex items-center">
          <Zap className="w-6 h-6 mr-3 text-orange-500" />
          Skills You'll Practice
        </h3>
        <div className="flex items-center justify-between mb-4">
          <span className="text-brown-700 font-bold">Session Duration</span>
          <span className="text-orange-500 font-black bg-orange-100 px-3 py-1 rounded-xl border-2 border-orange-300">
            {currentActivity.estimated_duration_minutes || 15} min
          </span>
        </div>
        <div className="space-y-3">
          {currentActivity.skills?.map((skill: any, index: number) => (
            <div key={index} className={`flex items-center justify-between py-4 px-4 ${getRatingBgColor(skill.rating)} rounded-2xl border-2 border-handdrawn transition-all duration-200 hover:scale-[1.02]`}>
              <div className="flex items-center">
                <div className="text-sm font-black text-brown-900 uppercase tracking-wide">
                  {skill.name}
                </div>
              </div>
              <div className={`text-lg font-black ${getRatingColor(skill.rating)} bg-white px-3 py-1 rounded-xl border border-current`}>
                {skill.rating}/100
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Action Section */}
      <div className="w-full rounded-3xl border-2 border-handdrawn bg-white/90 p-6 shadow-lg">
        <h3 className="text-xl font-black text-brown-900 mb-6 uppercase tracking-wide flex items-center">
          <Phone className="w-6 h-6 mr-3 text-green-500" />
          Start Practice
        </h3>
        
        <Button 
          onClick={handleStartPractice}
          disabled={isStartingCall || !canStartCall}
          className={`w-full ${
            canStartCall 
              ? 'bg-green-500 hover:bg-green-600 text-white font-black border-2 border-green-400 shadow-lg' 
              : 'bg-gray-400 hover:bg-gray-500 cursor-not-allowed text-white font-black border-2 border-gray-500'
          } py-6 text-xl rounded-2xl transition-all duration-200 hover:scale-[1.02]`}
          title={!canStartCall ? 'No minutes remaining - upgrade or wait for weekly reset' : ''}
        >
          {isStartingCall ? (
            <>
              <Phone className="w-6 h-6 mr-3 animate-pulse" />
              STARTING CALL...
            </>
          ) : !canStartCall ? (
            <>
              <AlertTriangle className="w-6 h-6 mr-3" />
              NO MINUTES REMAINING
            </>
          ) : (
            <>
              <Zap className="w-6 h-6 mr-3" />
              START LEARNING NOW! 🚀
            </>
          )}
        </Button>

        {!canStartCall && subscriptionStatus?.needs_upgrade && (
          <div className="mt-4 text-center bg-orange-50 rounded-2xl border-2 border-orange-200 p-4">
            <p className="text-brown-700 text-sm mb-3 font-bold">
              Need more practice time? Upgrade for unlimited weekly minutes!
            </p>
            <Button 
              variant="outline" 
              className="bg-orange-100 border-2 border-orange-300 text-orange-700 hover:bg-orange-200 font-bold px-6 py-2 rounded-xl"
            >
              Upgrade to Pro ⭐
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TodaysActivitySection;
