import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import AppBar from "./AppBar";
import FCMNotificationsPanel from "./FCMNotificationsPanel";

interface NotificationSettingsPageProps {
  onNavigate: (view: string) => void;
}

const NotificationSettingsPage = ({ onNavigate }: NotificationSettingsPageProps) => {
  return (
    <div className="min-h-screen bg-amber-50 pb-24">
      <AppBar title="Notifications" onBack={() => onNavigate("settings")} />

      <div className="px-6 py-6">
        <div className="bg-white p-6 border-4 border-gray-200 rounded-xl">
          <h3 className="text-xl font-bold text-gray-800 mb-6 uppercase tracking-wide">
            Push Notification Settings
          </h3>
          
          <FCMNotificationsPanel />
          
          <div className="mt-6 pt-6 border-t border-gray-200">
            <h4 className="font-bold text-gray-800 mb-4 uppercase tracking-wide">
              About Push Notifications
            </h4>
            <div className="space-y-3 text-sm text-gray-600">
              <p>
                📱 <strong>What are push notifications?</strong><br />
                Push notifications let BOL send you reminders and updates even when the app isn't open.
              </p>
              <p>
                🔔 <strong>What will you receive?</strong><br />
                • Daily learning reminders<br />
                • Achievement celebrations<br />
                • New lesson availability<br />
                • Progress milestones
              </p>
              <p>
                ⚙️ <strong>Privacy & Control:</strong><br />
                You can disable notifications anytime in your browser settings or here in the app.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationSettingsPage;