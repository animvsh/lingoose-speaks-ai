
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Bell, Send } from "lucide-react";
import { useNotifications } from "@/hooks/useNotifications";

const NotificationsPanel = () => {
  const {
    isSupported,
    isSubscribed,
    loading,
    subscribe,
    unsubscribe,
    sendTestNotification
  } = useNotifications();

  if (!isSupported) {
    return (
      <div className="bg-gray-50 rounded-xl p-4 text-center">
        <Bell className="w-8 h-8 mx-auto mb-2 text-gray-400" />
        <p className="text-sm text-gray-600 font-medium">
          Push notifications are not supported in this browser.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <span className="font-medium text-gray-700">Push Notifications</span>
        <Switch 
          checked={isSubscribed} 
          onCheckedChange={isSubscribed ? unsubscribe : subscribe}
          disabled={loading}
        />
      </div>
      
      {isSubscribed && (
        <>
          <div className="border-t border-gray-200 pt-4 space-y-3">
            <h4 className="font-bold text-gray-800 uppercase tracking-wide">Test Notifications</h4>
            
            <div className="grid grid-cols-1 gap-2">
              <Button
                onClick={() => sendTestNotification('lesson')}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 rounded-xl flex items-center justify-center space-x-2"
              >
                <Send className="w-4 h-4" />
                <span>Test Lesson Alert</span>
              </Button>
              
              <Button
                onClick={() => sendTestNotification('achievement')}
                className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-2 rounded-xl flex items-center justify-center space-x-2"
              >
                <Send className="w-4 h-4" />
                <span>Test Achievement</span>
              </Button>
              
              <Button
                onClick={() => sendTestNotification('reminder')}
                className="w-full bg-purple-500 hover:bg-purple-600 text-white font-bold py-2 rounded-xl flex items-center justify-center space-x-2"
              >
                <Send className="w-4 h-4" />
                <span>Test Reminder</span>
              </Button>
            </div>
          </div>
          
          <div className="bg-blue-50 rounded-xl p-3 border-2 border-blue-200">
            <p className="text-xs text-blue-800 font-medium">
              💡 Test notifications will appear as browser notifications. Make sure your browser allows notifications from this site.
            </p>
          </div>
        </>
      )}
    </div>
  );
};

export default NotificationsPanel;
