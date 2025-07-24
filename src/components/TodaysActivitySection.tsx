
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
    <div className="rounded-3xl border-2 border-handdrawn bg-gradient-to-br from-primary to-orange-500 p-8 shadow-lg font-nunito relative">
      {/* Header with main learning message */}
      <div className="text-center mb-8">
        <div className="w-20 h-20 bg-white/20 border-2 border-handdrawn rounded-3xl flex items-center justify-center mx-auto mb-6 animate-gentle-float">
          <Zap className="w-10 h-10 text-white" />
        </div>
        <h2 className="text-3xl font-black text-white mb-4 uppercase tracking-wide">
          WHAT YOU'RE LEARNING TODAY
        </h2>
        <div className="bg-white/20 rounded-3xl border-2 border-white/30 p-6 mb-4">
          <h3 className="text-xl font-black text-white mb-2">
            {currentActivity.name}
          </h3>
          <p className="text-white/90 font-bold text-lg">
            {currentActivity.description}
          </p>
        </div>

        {/* Usage Status Display */}
        {subscriptionStatus && (
          <div className="bg-white/20 rounded-3xl border-2 border-white/30 p-4 mb-4">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Clock className="w-5 h-5 text-white" />
              <span className="text-white font-black">
                {minutesRemaining.toFixed(1)} minutes remaining this week
              </span>
            </div>
            {!canStartCall && (
              <div className="flex items-center justify-center gap-2 text-red-200">
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

      {/* Regenerate button positioned at top right */}
      <div className="absolute top-4 right-4">
        <Button
          onClick={handleRegenerateActivity}
          disabled={isRegenerating}
          variant="ghost"
          size="sm"
          className="text-white hover:bg-white/20 p-3 rounded-2xl border border-white/30 font-bold"
          title="Generate new activity"
        >
          <RefreshCw className={`w-5 h-5 ${isRegenerating ? 'animate-spin' : ''}`} />
        </Button>
      </div>

      <div className="space-y-6">
        {/* Skills section */}
        <div className="bg-white/90 rounded-3xl border-2 border-handdrawn p-6 shadow-lg">
          <div className="flex items-center justify-between mb-6">
            <span className="text-brown-900 font-black text-lg uppercase tracking-wide">Skills You'll Practice</span>
            <span className="text-primary font-black text-lg bg-orange-100 px-3 py-1 rounded-xl border border-orange-300">
              {currentActivity.estimated_duration_minutes || 15} min
            </span>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {currentActivity.skills?.map((skill: any, index: number) => (
              <div key={index} className={`rounded-2xl border-2 border-handdrawn p-4 ${getRatingBgColor(skill.rating)} hover:scale-105 transition-all duration-200`}>
                <div className="text-sm font-black text-brown-900 uppercase tracking-wide mb-2">
                  {skill.name}
                </div>
                <div className={`text-xl font-black ${getRatingColor(skill.rating)}`}>
                  {skill.rating}/100
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Main CTA Button */}
        <Button 
          onClick={handleStartPractice}
          disabled={isStartingCall || !canStartCall}
          className={`w-full ${
            canStartCall 
              ? 'warm-button font-black text-white shadow-lg border-2 border-handdrawn' 
              : 'bg-gray-400 hover:bg-gray-500 cursor-not-allowed text-white font-black border-2 border-gray-500'
          } py-8 text-2xl rounded-3xl transition-all duration-300 transform hover:scale-105`}
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
          <div className="text-center bg-white/20 rounded-3xl border-2 border-white/30 p-4">
            <p className="text-white/90 text-sm mb-3 font-bold">
              Need more practice time? Upgrade for unlimited weekly minutes!
            </p>
            <Button 
              variant="outline" 
              className="bg-white/10 border-2 border-white/30 text-white hover:bg-white/20 font-bold px-6 py-2 rounded-xl"
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
