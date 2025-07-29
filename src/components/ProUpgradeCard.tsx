import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Crown, Star, Zap, Clock, CheckCircle, X } from "lucide-react";
import { useStripeCheckout } from "@/hooks/useStripeCheckout";
import { useSubscriptionCheck } from "@/hooks/useSubscriptionCheck";
import { EmbeddedCheckout } from "@/components/EmbeddedCheckout";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerClose } from "@/components/ui/drawer";

const ProUpgradeCard = () => {
  const { createCheckoutSession, openCustomerPortal, isLoading, checkoutData, closeCheckout } = useStripeCheckout();
  const { data: subscription, refetch } = useSubscriptionCheck();

  console.log('🔧 ProUpgradeCard render:', {
    isLoading,
    hasCheckoutData: !!(checkoutData.clientSecret && checkoutData.publishableKey),
    subscription,
    drawerOpen: !!checkoutData.clientSecret
  });

  const isPro = subscription?.subscribed && subscription?.subscription_tier === 'pro';

  if (isPro) {
    return (
      <Card className="border-2 border-green-200 bg-green-50">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center justify-between text-lg">
            <div className="flex items-center gap-2">
              <Crown className="w-5 h-5 text-yellow-600" />
              Pro Member
            </div>
            <Badge className="bg-green-600 text-white">
              <CheckCircle className="w-3 h-3 mr-1" />
              Active
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-green-800">
              <Zap className="w-4 h-4" />
              <span>Unlimited practice calls</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-green-800">
              <Star className="w-4 h-4" />
              <span>Premium features unlocked</span>
            </div>
            {subscription?.subscription_end && (
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Clock className="w-4 h-4" />
                <span>Renews {new Date(subscription.subscription_end).toLocaleDateString()}</span>
              </div>
            )}
          </div>
          
          <Button 
            onClick={openCustomerPortal}
            disabled={isLoading}
            variant="outline"
            className="w-full"
          >
            {isLoading ? "Loading..." : "Manage Subscription"}
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center justify-between text-lg">
            <div className="flex items-center gap-2">
              <Crown className="w-5 h-5 text-primary" />
              Upgrade to Pro
            </div>
            <Badge variant="secondary">
              $4/week
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <Zap className="w-4 h-4 text-primary" />
              <span>Unlimited practice calls</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Star className="w-4 h-4 text-primary" />
              <span>Advanced analytics & insights</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <CheckCircle className="w-4 h-4 text-primary" />
              <span>Priority support</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Crown className="w-4 h-4 text-primary" />
              <span>Exclusive premium content</span>
            </div>
          </div>

          <div className="bg-white/50 rounded-lg p-3 text-center">
            <div className="text-sm text-gray-600 mb-1">Start your pro journey</div>
            <div className="text-xl font-bold text-primary">$4 per week</div>
            <div className="text-xs text-gray-500">Cancel anytime</div>
          </div>
          
          <Button 
            onClick={createCheckoutSession}
            disabled={isLoading}
            className="w-full bg-primary hover:bg-primary/90"
          >
            {isLoading ? "Loading..." : "Upgrade to Pro"}
          </Button>

          <Button 
            onClick={() => refetch()}
            variant="ghost"
            size="sm"
            className="w-full text-xs"
          >
            Refresh Status
          </Button>
        </CardContent>
      </Card>

      <Drawer open={!!checkoutData.clientSecret} onOpenChange={(open) => {
        console.log('Drawer onOpenChange:', open, 'clientSecret exists:', !!checkoutData.clientSecret);
        if (!open) {
          console.log('Drawer closing via onOpenChange');
          closeCheckout();
        }
      }}>
        <DrawerContent className="max-h-[85vh] bg-background border-border">
          <DrawerHeader className="border-b border-border/40">
            <DrawerTitle className="flex items-center justify-between text-foreground">
              <div className="flex items-center gap-2">
                <Crown className="w-5 h-5 text-primary" />
                <span>Complete Your Pro Subscription</span>
              </div>
              <DrawerClose asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    console.log('Close button clicked');
                    closeCheckout();
                  }}
                  className="h-8 w-8 p-0 hover:bg-muted"
                >
                  <X className="h-4 w-4" />
                </Button>
              </DrawerClose>
            </DrawerTitle>
          </DrawerHeader>
          
          <div className="flex-1 overflow-auto p-6">
            {checkoutData.clientSecret && checkoutData.publishableKey ? (
              <EmbeddedCheckout
                clientSecret={checkoutData.clientSecret}
                publishableKey={checkoutData.publishableKey}
                onComplete={() => {
                  console.log('Checkout completed successfully');
                  closeCheckout();
                  refetch();
                }}
                onError={(error) => {
                  console.error('Checkout error occurred:', error);
                  // Don't auto-close on error, let user see the error
                }}
              />
            ) : (
              <div className="flex items-center justify-center p-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                <span className="ml-3 text-muted-foreground">Setting up secure checkout...</span>
              </div>
            )}
          </div>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default ProUpgradeCard;