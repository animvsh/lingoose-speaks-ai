
import { CheckCircle, TrendingUp, Target, Clock } from "lucide-react";

interface PreviousActivitySectionProps {
  lastCall: any;
}

const PreviousActivitySection = ({ lastCall }: PreviousActivitySectionProps) => {
  if (!lastCall) {
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
            Last conversation session
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <div className={`rounded-2xl p-4 border-2 ${getStatusBgColor(lastCall.call_status)}`}>
          <div className="flex items-center justify-between mb-2">
            <span className={`font-bold text-sm ${getStatusColor(lastCall.call_status)}`}>
              {lastCall.scenario || 'Practice Session'}
            </span>
            <span className={`font-bold text-sm ${getStatusColor(lastCall.call_status)}`}>
              {lastCall.call_status?.toUpperCase() || 'COMPLETED'}
            </span>
          </div>
          <div className="flex items-center justify-between mb-2">
            <span className={`font-bold text-sm ${getStatusColor(lastCall.call_status)}`}>Duration</span>
            <span className={`font-bold ${getStatusColor(lastCall.call_status)}`}>
              {formatDuration(lastCall.duration_seconds || 0)}
            </span>
          </div>
          <div className={`text-xs ${getStatusColor(lastCall.call_status)} opacity-70`}>
            Completed on {new Date(lastCall.created_at).toLocaleDateString()}
          </div>
          {lastCall.vapi_call_id && (
            <div className={`text-xs ${getStatusColor(lastCall.call_status)} opacity-50 mt-1`}>
              Call ID: {lastCall.vapi_call_id.substring(0, 8)}...
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="bg-blue-50 rounded-2xl p-3 text-center border-2 border-blue-100">
            <div className="w-8 h-8 bg-blue-400 rounded-xl flex items-center justify-center mx-auto mb-2">
              <TrendingUp className="w-4 h-4 text-white" />
            </div>
            <div className="text-lg font-bold text-blue-700">
              {lastCall.sentiment === 'positive' ? '4' : lastCall.sentiment === 'negative' ? '1' : '3'}
            </div>
            <div className="text-xs text-blue-600 font-bold uppercase">Performance</div>
          </div>
          <div className="bg-orange-50 rounded-2xl p-3 text-center border-2 border-orange-100">
            <div className="w-8 h-8 bg-orange-400 rounded-xl flex items-center justify-center mx-auto mb-2">
              <Target className="w-4 h-4 text-white" />
            </div>
            <div className="text-lg font-bold text-orange-700">
              {lastCall.transcript ? Math.floor(lastCall.transcript.length / 100) : '2'}
            </div>
            <div className="text-xs text-orange-600 font-bold uppercase">Engagement</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PreviousActivitySection;
