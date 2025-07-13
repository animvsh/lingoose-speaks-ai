
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useStripeCheckout } from "@/hooks/useStripeCheckout";
import { useSubscriptionCheck } from "@/hooks/useSubscriptionCheck";
import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";
import { CheckCircle, XCircle, AlertCircle, RefreshCw } from "lucide-react";

const StripeTestingPanel = () => {
  const { user } = useAuth();
  const { createCheckoutSession, openCustomerPortal, isLoading } = useStripeCheckout();
  const { data: subscription, refetch, isLoading: isCheckingSubscription } = useSubscriptionCheck();
  const [testResults, setTestResults] = useState<any[]>([]);

  const addTestResult = (test: string, status: 'success' | 'error' | 'info', message: string) => {
    setTestResults(prev => [...prev, { 
      test, 
      status, 
      message, 
      timestamp: new Date().toLocaleTimeString() 
    }]);
  };

  const testSubscriptionCheck = async () => {
    addTestResult('Subscription Check', 'info', 'Starting subscription check...');
    try {
      await refetch();
      addTestResult('Subscription Check', 'success', 'Subscription status fetched successfully');
    } catch (error) {
      addTestResult('Subscription Check', 'error', `Failed: ${error}`);
    }
  };

  const testCheckoutCreation = async () => {
    addTestResult('Checkout Creation', 'info', 'Creating checkout session...');
    try {
      await createCheckoutSession();
      addTestResult('Checkout Creation', 'success', 'Checkout session created (should open in new tab)');
    } catch (error) {
      addTestResult('Checkout Creation', 'error', `Failed: ${error}`);
    }
  };

  const testCustomerPortal = async () => {
    addTestResult('Customer Portal', 'info', 'Opening customer portal...');
    try {
      await openCustomerPortal();
      addTestResult('Customer Portal', 'success', 'Customer portal opened (should open in new tab)');
    } catch (error) {
      addTestResult('Customer Portal', 'error', `Failed: ${error}`);
    }
  };

  const clearResults = () => {
    setTestResults([]);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success': return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'error': return <XCircle className="w-4 h-4 text-red-600" />;
      case 'info': return <AlertCircle className="w-4 h-4 text-blue-600" />;
      default: return null;
    }
  };

  if (!user) {
    return (
      <Card className="border-yellow-200 bg-yellow-50">
        <CardHeader>
          <CardTitle className="text-yellow-800">⚠️ Authentication Required</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-yellow-700">Please sign in to test Stripe functionality.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-2 border-purple-200 bg-purple-50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          🧪 Stripe Integration Testing Panel
          <Badge variant="secondary">Test Mode</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Current Status */}
        <div className="bg-white rounded-lg p-4 space-y-2">
          <h3 className="font-semibold text-gray-800">Current Status</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-600">User Email:</span>
              <p className="font-medium">{user.email}</p>
            </div>
            <div>
              <span className="text-gray-600">Subscription Status:</span>
              <p className="font-medium">
                {isCheckingSubscription ? 'Loading...' : 
                  subscription?.subscribed ? 
                    `Active (${subscription.subscription_tier})` : 
                    'Not Subscribed'
                }
              </p>
            </div>
          </div>
        </div>

        {/* Test Buttons */}
        <div className="space-y-2">
          <h3 className="font-semibold text-gray-800">Test Functions</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
            <Button 
              onClick={testSubscriptionCheck}
              disabled={isLoading || isCheckingSubscription}
              variant="outline"
              size="sm"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Test Subscription Check
            </Button>
            
            <Button 
              onClick={testCheckoutCreation}
              disabled={isLoading}
              className="bg-blue-600 hover:bg-blue-700"
              size="sm"
            >
              Test Checkout Creation
            </Button>
            
            <Button 
              onClick={testCustomerPortal}
              disabled={isLoading}
              variant="outline"
              size="sm"
            >
              Test Customer Portal
            </Button>
          </div>
        </div>

        {/* Test Results */}
        {testResults.length > 0 && (
          <div className="bg-white rounded-lg p-4">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-semibold text-gray-800">Test Results</h3>
              <Button onClick={clearResults} variant="ghost" size="sm">
                Clear
              </Button>
            </div>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {testResults.map((result, index) => (
                <div key={index} className="flex items-start gap-2 p-2 bg-gray-50 rounded text-sm">
                  {getStatusIcon(result.status)}
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <span className="font-medium">{result.test}</span>
                      <span className="text-gray-500 text-xs">{result.timestamp}</span>
                    </div>
                    <p className="text-gray-700">{result.message}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Testing Instructions */}
        <div className="bg-blue-50 rounded-lg p-4">
          <h3 className="font-semibold text-blue-800 mb-2">Testing Instructions</h3>
          <ol className="text-sm text-blue-700 space-y-1 list-decimal list-inside">
            <li>First, test "Subscription Check" to verify edge function connectivity</li>
            <li>Test "Checkout Creation" - this should open Stripe checkout in a new tab</li>
            <li>Use Stripe test card: 4242 4242 4242 4242, any future date, any CVC</li>
            <li>Complete the test payment and return to the app</li>
            <li>Test "Subscription Check" again to see updated status</li>
            <li>If subscribed, test "Customer Portal" for subscription management</li>
          </ol>
        </div>

        {/* Debug Info */}
        <details className="bg-gray-50 rounded-lg p-4">
          <summary className="font-semibold text-gray-800 cursor-pointer">Debug Information</summary>
          <pre className="text-xs mt-2 bg-white p-2 rounded overflow-auto">
            {JSON.stringify({
              user: {
                id: user.id,
                email: user.email
              },
              subscription: subscription,
              isLoading: isLoading,
              isCheckingSubscription: isCheckingSubscription
            }, null, 2)}
          </pre>
        </details>
      </CardContent>
    </Card>
  );
};

export default StripeTestingPanel;
