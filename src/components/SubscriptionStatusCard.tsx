
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Zap, AlertTriangle } from "lucide-react";
import { useSubscriptionStatus } from "@/hooks/useSubscriptionStatus";
import { useSubscriptionCheck } from "@/hooks/useSubscriptionCheck";

const SubscriptionStatusCard = () => {
  const { data: subscriptionStatus, isLoading } = useSubscriptionStatus();
  const { data: stripeSubscription } = useSubscriptionCheck();

  // Debug log
  console.log('SubscriptionStatusCard:', { subscriptionStatus, stripeSubscription });

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

  const isProUser = stripeSubscription?.subscribed && stripeSubscription?.subscription_tier === 'pro';
  const isFreeTrial = subscriptionStatus.subscription_status === 'free_trial';

  // Calculate free trial days left and current day (assume backend sets subscription_end and trial_start_date for trial users)
  let daysLeft = null;
  let currentDay = null;
  let totalTrialDays = 3;
  if (isFreeTrial && stripeSubscription?.subscription_end && stripeSubscription?.trial_start_date) {
    const now = new Date();
    const start = new Date(stripeSubscription.trial_start_date);
    const end = new Date(stripeSubscription.subscription_end);
    daysLeft = Math.max(0, Math.ceil((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)));
    // Calculate current day (1-based)
    const elapsed = Math.floor((now.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    currentDay = Math.min(totalTrialDays, Math.max(1, elapsed + 1));
  }

  // Free trial minute logic
  const freeTrialMinutes = 25;
  const minutesUsed = subscriptionStatus.minutes_used || 0;
  const minutesRemaining = Math.max(0, freeTrialMinutes - minutesUsed);
  const outOfMinutes = isFreeTrial && minutesRemaining <= 0;

  return (
    <Card className="border-2">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between text-lg">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            {isProUser ? 'Pro Subscription' : isFreeTrial ? 'Free Trial' : 'Trial Expired'}
          </div>
          <Badge className={isProUser ? 'bg-green-500' : isFreeTrial ? 'bg-blue-500' : 'bg-red-500'}>
            {isProUser ? 'Pro' : isFreeTrial ? 'Free Trial' : 'Expired'}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {isProUser && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-3">
            <div className="flex items-center gap-2 text-green-800">
              <Zap className="w-4 h-4" />
              <span className="font-medium text-sm">Unlimited calls available!</span>
            </div>
          </div>
        )}
        {isFreeTrial && daysLeft !== null && daysLeft > 0 && !outOfMinutes && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-center">
            <div className="text-blue-800 font-bold text-lg mb-1">
              {currentDay ? `Day ${currentDay}/${totalTrialDays}` : ''} {daysLeft} day{daysLeft !== 1 ? 's' : ''} left in your free trial
            </div>
            <div className="text-blue-700 text-sm mb-1">You have {minutesRemaining} of 25 free minutes remaining.</div>
            <div className="text-blue-700 text-xs">Your free trial lasts 3 days or 25 minutes, whichever comes first.</div>
          </div>
        )}
        {isFreeTrial && (daysLeft === 0 || outOfMinutes) && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-center">
            <div className="text-red-800 font-bold text-lg mb-1">Your free trial has ended</div>
            <div className="text-red-700 text-sm mb-2">{outOfMinutes ? 'You have used all 25 free minutes.' : 'Your 3-day trial period is over.'} Upgrade to Pro to continue using Bol.</div>
          </div>
        )}
        {!isProUser && !isFreeTrial && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-center">
            <div className="text-red-800 font-bold text-lg mb-1">Subscription Expired</div>
            <div className="text-red-700 text-sm mb-2">Upgrade to Pro to regain access.</div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SubscriptionStatusCard;
