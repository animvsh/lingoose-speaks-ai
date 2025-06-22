
import { CheckCircle, TrendingUp, Target, Clock } from "lucide-react";

interface PreviousActivitySectionProps {
  lastCall: any;
}

const PreviousActivitySection = ({ lastCall }: PreviousActivitySectionProps) => {
  if (!lastCall) {
    return (
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
    );
  }

  return (
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
  );
};

export default PreviousActivitySection;
