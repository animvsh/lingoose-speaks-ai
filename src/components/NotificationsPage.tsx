
import { Button } from "@/components/ui/button";
import { Bell, Clock, CheckCircle, X, Home, Phone, Settings, ArrowLeft, Trophy } from "lucide-react";
import { useState } from "react";
import AppBar from "./AppBar";

interface NotificationsPageProps {
  onNavigate: (view: string) => void;
}

const NotificationsPage = ({ onNavigate }: NotificationsPageProps) => {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: "call",
      message: "New practice call available!",
      time: "5 min ago",
    },
    {
      id: 2,
      type: "achievement",
      message: "You've unlocked a new badge!",
      time: "1 hour ago",
    },
    {
      id: 3,
      type: "reminder",
      message: "Don't forget to practice today!",
      time: "Yesterday",
    },
  ]);

  const handleClearNotification = (id: number) => {
    setNotifications(notifications.filter((notification) => notification.id !== id));
  };

  return (
    <div className="min-h-screen bg-amber-50 pb-24">
      <AppBar 
        title="NOTIFICATIONS" 
        onBack={() => onNavigate("settings")} 
        showBackButton={true} 
      />

      <div className="px-6 space-y-4">
        {notifications.length > 0 ? (
          notifications.map((notification) => (
            <div
              key={notification.id}
              className="bg-white rounded-2xl p-4 border border-gray-200 shadow-sm"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  {notification.type === "call" && (
                    <Phone className="w-5 h-5 text-blue-500" />
                  )}
                  {notification.type === "achievement" && (
                    <Trophy className="w-5 h-5 text-green-500" />
                  )}
                  {notification.type === "reminder" && (
                    <Clock className="w-5 h-5 text-orange-500" />
                  )}
                  <div>
                    <p className="text-sm font-medium text-gray-800">
                      {notification.message}
                    </p>
                    <p className="text-xs text-gray-500">{notification.time}</p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-gray-400 hover:text-gray-600"
                  onClick={() => handleClearNotification(notification.id)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12">
            <Bell className="w-10 h-10 text-gray-400 mx-auto mb-4" />
            <p className="text-lg font-medium text-gray-600">
              No notifications yet.
            </p>
          </div>
        )}
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white px-6 py-4 border-t border-gray-100">
        <div className="max-w-md mx-auto">
          <div className="flex justify-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onNavigate("home")}
              className="w-14 h-14 bg-gray-200 rounded-2xl text-gray-600"
            >
              <Home className="w-6 h-6" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onNavigate("activity")}
              className="w-14 h-14 bg-gray-200 rounded-2xl text-gray-600"
            >
              <Phone className="w-6 h-6" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onNavigate("curriculum")}
              className="w-14 h-14 bg-gray-200 rounded-2xl text-gray-600"
            >
              <CheckCircle className="w-6 h-6" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onNavigate("settings")}
              className="w-14 h-14 bg-gray-200 rounded-2xl text-gray-600"
            >
              <Settings className="w-6 h-6" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationsPage;
