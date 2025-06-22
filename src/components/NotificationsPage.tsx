
import AppBar from "./AppBar";
import NotificationsPanel from "./NotificationsPanel";

interface NotificationsPageProps {
  onNavigate: (view: string) => void;
}

const NotificationsPage = ({ onNavigate }: NotificationsPageProps) => {
  return (
    <div className="min-h-screen bg-background pb-24">
      <AppBar 
        title="NOTIFICATIONS"
        onBack={() => onNavigate("settings")}
      />

      <div className="px-6">
        <div className="bg-white rounded-3xl p-6 border-4 border-gray-200">
          <NotificationsPanel />
        </div>
      </div>
    </div>
  );
};

export default NotificationsPage;
