
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Zap, AlertTriangle } from "lucide-react";
import { useSubscriptionStatus } from "@/hooks/useSubscriptionStatus";

const SubscriptionStatusCard = () => {
  const { data: subscriptionStatus, isLoading } = useSubscriptionStatus();

  if (isLoading) {
    return (
      <Card className="border-2">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Clock className="w-5 h-5" />
            Loading Usage...
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse bg-gray-200 h-4 rounded mb-2"></div>
          <div className="animate-pulse bg-gray-200 h-4 rounded w-2/3"></div>
        </CardContent>
      </Card>
    );
  }

  if (!subscriptionStatus) {
    return null;
  }

  const getStatusColor = () => {
    if (subscriptionStatus.subscription_status === 'pro') return 'bg-green-500';
    if (subscriptionStatus.subscription_status === 'free_trial') return 'bg-blue-500';
    return 'bg-red-500';
  };

  const getStatusText = () => {
    if (subscriptionStatus.subscription_status === 'pro') return 'Pro';
    if (subscriptionStatus.subscription_status === 'free_trial') return 'Free Trial';
    return 'Expired';
  };

  const minutesUsedPercentage = (subscriptionStatus.minutes_used / 25) * 100;

  return (
    <Card className="border-2">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between text-lg">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Weekly Usage
          </div>
          <Badge className={getStatusColor()}>
            {getStatusText()}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Minutes Used</span>
            <span className="font-medium">
              {subscriptionStatus.minutes_used.toFixed(1)} / 25 min
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div 
              className={`h-3 rounded-full transition-all duration-300 ${
                minutesUsedPercentage >= 90 ? 'bg-red-500' : 
                minutesUsedPercentage >= 70 ? 'bg-orange-500' : 'bg-green-500'
              }`}
              style={{ width: `${Math.min(minutesUsedPercentage, 100)}%` }}
            />
          </div>
          <div className="flex justify-between text-sm text-gray-600">
            <span>Remaining: {subscriptionStatus.minutes_remaining.toFixed(1)} min</span>
            {subscriptionStatus.needs_upgrade && (
              <span className="text-red-600 flex items-center gap-1">
                <AlertTriangle className="w-3 h-3" />
                Upgrade needed
              </span>
            )}
          </div>
        </div>

        {!subscriptionStatus.has_minutes && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <div className="flex items-center gap-2 text-red-800">
              <AlertTriangle className="w-4 h-4" />
              <span className="font-medium text-sm">
                {subscriptionStatus.subscription_status === 'free_trial' 
                  ? 'Free trial expired or limit reached' 
                  : 'Weekly limit reached'}
              </span>
            </div>
          </div>
        )}

        {subscriptionStatus.has_minutes && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-3">
            <div className="flex items-center gap-2 text-green-800">
              <Zap className="w-4 h-4" />
              <span className="font-medium text-sm">Ready for practice calls!</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SubscriptionStatusCard;
