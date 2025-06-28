
import { Button } from "@/components/ui/button";
import { Phone, RefreshCw } from "lucide-react";
import { usePostHog } from "@/hooks/usePostHog";

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
    trackActivityRegenerate(currentActivity);
    onRegenerateActivity();
  };

  const handleStartPractice = () => {
    trackPracticeStart(currentActivity);
    onStartPractice();
  };

  return (
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
          disabled={isRegenerating}
          variant="ghost"
          size="sm"
          className="text-white hover:bg-blue-500 p-2"
          title="Generate new activity"
        >
          <RefreshCw className={`w-5 h-5 ${isRegenerating ? 'animate-spin' : ''}`} />
        </Button>
      </div>

      <div className="space-y-4">
        <div className="bg-white rounded-2xl p-4 border-2 border-white">
          <div className="flex items-center justify-between mb-3">
            <span className="text-blue-700 font-bold text-sm uppercase tracking-wide">Skills Tested</span>
            <span className="text-blue-600 font-bold text-sm">{currentActivity.estimated_duration_minutes || 15} min</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {currentActivity.skills?.map((skill: any, index: number) => (
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

        <Button 
          onClick={handleStartPractice}
          disabled={isStartingCall}
          className="w-full bg-white hover:bg-blue-50 text-blue-600 font-bold py-4 text-lg rounded-2xl transition-all duration-300"
        >
          {isStartingCall ? 'STARTING CALL...' : 'START PRACTICE ⚡'}
        </Button>
      </div>
    </div>
  );
};

export default TodaysActivitySection;
