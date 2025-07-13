
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Zap, AlertTriangle } from "lucide-react";
import { useSubscriptionStatus } from "@/hooks/useSubscriptionStatus";
import { useSubscriptionCheck } from "@/hooks/useSubscriptionCheck";

const SubscriptionStatusCard = () => {
  const { data: subscriptionStatus, isLoading } = useSubscriptionStatus();
  const { data: stripeSubscription } = useSubscriptionCheck();

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
    // Check Stripe subscription first for pro status
    if (stripeSubscription?.subscribed && stripeSubscription?.subscription_tier === 'pro') {
      return 'bg-green-500';
    }
    if (subscriptionStatus.subscription_status === 'free_trial') return 'bg-blue-500';
    return 'bg-red-500';
  };

  const getStatusText = () => {
    // Check Stripe subscription first for pro status
    if (stripeSubscription?.subscribed && stripeSubscription?.subscription_tier === 'pro') {
      return 'Pro';
    }
    if (subscriptionStatus.subscription_status === 'free_trial') return 'Free Trial';
    return 'Expired';
  };

  // Pro users have unlimited minutes, so show different calculation
  const isProUser = stripeSubscription?.subscribed && stripeSubscription?.subscription_tier === 'pro';
  const weeklyLimit = isProUser ? 999 : 25; // Unlimited for pro users
  const minutesUsedPercentage = isProUser ? 0 : (subscriptionStatus.minutes_used / 25) * 100;

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
              {subscriptionStatus.minutes_used.toFixed(1)} / {isProUser ? '∞' : '25'} min
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
            <span>Remaining: {isProUser ? '∞' : subscriptionStatus.minutes_remaining.toFixed(1)} min</span>
            {!isProUser && subscriptionStatus.needs_upgrade && (
              <span className="text-red-600 flex items-center gap-1">
                <AlertTriangle className="w-3 h-3" />
                Upgrade needed
              </span>
            )}
          </div>
        </div>

        {!isProUser && !subscriptionStatus.has_minutes && (
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

        {(isProUser || subscriptionStatus.has_minutes) && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-3">
            <div className="flex items-center gap-2 text-green-800">
              <Zap className="w-4 h-4" />
              <span className="font-medium text-sm">
                {isProUser ? 'Unlimited calls available!' : 'Ready for practice calls!'}
              </span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SubscriptionStatusCard;
