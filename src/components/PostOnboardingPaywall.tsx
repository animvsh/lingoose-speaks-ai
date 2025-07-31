import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Crown, Star, Zap, CheckCircle, Sparkles, Heart, Target, TrendingUp } from 'lucide-react';
import { useStripeCheckout } from '@/hooks/useStripeCheckout';
import { useSubscriptionCheck } from '@/hooks/useSubscriptionCheck';
import { EmbeddedCheckout } from '@/components/EmbeddedCheckout';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerClose } from '@/components/ui/drawer';
import BolMascot from '@/components/BolMascot';

interface PostOnboardingPaywallProps {
  onComplete: () => void;
  userName: string;
}

export const PostOnboardingPaywall: React.FC<PostOnboardingPaywallProps> = ({
  onComplete,
  userName
}) => {
  const [currentPhase, setCurrentPhase] = useState<'loading' | 'message' | 'paywall'>('loading');
  const { createCheckoutSession, isLoading, checkoutData, closeCheckout } = useStripeCheckout();
  const { data: subscription, refetch } = useSubscriptionCheck();

  const isPro = subscription?.subscribed && subscription?.subscription_tier === 'pro';

  useEffect(() => {
    // Check if user is already pro, if so skip to completion
    if (isPro) {
      onComplete();
      return;
    }

    // Phase 1: Loading
    const loadingTimer = setTimeout(() => {
      setCurrentPhase('message');
    }, 2000);

    return () => clearTimeout(loadingTimer);
  }, [isPro, onComplete]);

  useEffect(() => {
    // Phase 2: Ready to invest message
    if (currentPhase === 'message') {
      const messageTimer = setTimeout(() => {
        setCurrentPhase('paywall');
      }, 3000);

      return () => clearTimeout(messageTimer);
    }
  }, [currentPhase]);

  const handleGetStarted = async () => {
    await createCheckoutSession();
  };

  const handleSkipForNow = () => {
    onComplete();
  };

  // Phase 1: Beautiful Loading
  if (currentPhase === 'loading') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-primary/10 flex items-center justify-center p-6">
        <div className="text-center space-y-8">
          <div className="relative">
            <BolMascot className="w-32 h-32 mx-auto animate-gentle-float" />
            <div className="absolute -top-4 -right-4 w-8 h-8 bg-primary rounded-full flex items-center justify-center animate-pulse">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-center space-x-2">
              <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
              <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
              <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
            </div>
            
            <h2 className="text-2xl font-bold text-foreground">Setting up your learning journey</h2>
            <p className="text-muted-foreground">Creating your personalized Hindi experience...</p>
          </div>
        </div>
      </div>
    );
  }

  // Phase 2: Ready to Invest Message
  if (currentPhase === 'message') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-primary/10 flex items-center justify-center p-6">
        <div className="text-center space-y-8 animate-fade-in">
          <div className="relative">
            <BolMascot className="w-40 h-40 mx-auto animate-gentle-float" />
            <div className="absolute -top-6 -right-6 w-12 h-12 bg-primary rounded-full flex items-center justify-center shadow-glow">
              <Heart className="w-6 h-6 text-white" />
            </div>
          </div>
          
          <div className="space-y-6">
            <div className="space-y-2">
              <h1 className="text-4xl font-black text-primary animate-pulse">
                Ready to invest in your Hindi skills?
              </h1>
              <p className="text-xl text-muted-foreground">
                {userName}, let's unlock your full potential! 🚀
              </p>
            </div>
            
            <div className="flex items-center justify-center gap-4">
              <div className="flex items-center gap-2 text-primary">
                <Target className="w-5 h-5" />
                <span className="font-semibold">Personalized</span>
              </div>
              <div className="flex items-center gap-2 text-primary">
                <TrendingUp className="w-5 h-5" />
                <span className="font-semibold">Effective</span>
              </div>
              <div className="flex items-center gap-2 text-primary">
                <Star className="w-5 h-5" />
                <span className="font-semibold">Premium</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Phase 3: Paywall
  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-primary/10 flex items-center justify-center p-6">
        <div className="w-full max-w-md space-y-8 animate-fade-in">
          {/* Header */}
          <div className="text-center space-y-4">
            <BolMascot className="w-24 h-24 mx-auto" />
            <div className="space-y-2">
              <h1 className="text-3xl font-black text-primary">Unlock Premium Hindi Learning</h1>
              <p className="text-muted-foreground">Join thousands mastering Hindi with BOL</p>
            </div>
          </div>

          {/* Pricing Card */}
          <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10 shadow-glow">
            <div className="p-6 space-y-6">
              {/* Header with Badge */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Crown className="w-6 h-6 text-primary" />
                  <span className="text-xl font-bold">BOL Premium</span>
                </div>
                <Badge className="bg-primary text-white">
                  Most Popular
                </Badge>
              </div>

              {/* Price */}
              <div className="text-center py-4">
                <div className="text-4xl font-black text-primary mb-2">
                  $4<span className="text-xl">/week</span>
                </div>
                <p className="text-sm text-muted-foreground">Cancel anytime • No commitment</p>
              </div>

              {/* Features */}
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                  <span className="text-sm">Unlimited practice calls with AI teacher</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                  <span className="text-sm">Advanced progress analytics & insights</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                  <span className="text-sm">Personalized learning curriculum</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                  <span className="text-sm">Real-time pronunciation feedback</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                  <span className="text-sm">Premium vocabulary & phrases</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                  <span className="text-sm">Priority customer support</span>
                </div>
              </div>

              {/* Social Proof */}
              <div className="bg-white/50 rounded-lg p-4 text-center">
                <div className="flex items-center justify-center mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-yellow-500 fill-current" />
                  ))}
                </div>
                <p className="text-sm font-semibold text-foreground">
                  "Best Hindi learning app I've used!"
                </p>
                <p className="text-xs text-muted-foreground">- Priya, Pro Member</p>
              </div>

              {/* CTA Buttons */}
              <div className="space-y-3">
                <Button 
                  onClick={handleGetStarted}
                  disabled={isLoading}
                  className="w-full h-12 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-white font-bold text-lg shadow-glow"
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Setting up...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Zap className="w-5 h-5" />
                      Start Your Hindi Journey
                    </div>
                  )}
                </Button>
                
                <Button 
                  onClick={handleSkipForNow}
                  variant="ghost"
                  className="w-full text-muted-foreground hover:text-foreground"
                >
                  Continue with Free Trial
                </Button>
              </div>

              {/* Trust Indicators */}
              <div className="text-center text-xs text-muted-foreground">
                <p>🔒 Secure payment • 💯 100% satisfaction guarantee</p>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Checkout Drawer */}
      <Drawer open={!!checkoutData.clientSecret} onOpenChange={(open) => {
        if (!open) {
          closeCheckout();
        }
      }}>
        <DrawerContent className="max-h-[85vh] bg-background border-border">
          <DrawerHeader className="border-b border-border/40">
            <DrawerTitle className="flex items-center justify-between text-foreground">
              <div className="flex items-center gap-2">
                <Crown className="w-5 h-5 text-primary" />
                <span>Complete Your Premium Subscription</span>
              </div>
              <DrawerClose asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => closeCheckout()}
                  className="h-8 w-8 p-0 hover:bg-muted"
                >
                  ×
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
                  closeCheckout();
                  refetch();
                  onComplete();
                }}
                onError={(error) => {
                  console.error('Checkout error:', error);
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