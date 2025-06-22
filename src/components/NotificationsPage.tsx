
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import NotificationsPanel from "./NotificationsPanel";

interface NotificationsPageProps {
  onNavigate: (view: string) => void;
}

const NotificationsPage = ({ onNavigate }: NotificationsPageProps) => {
  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <div className="px-6 pt-8 pb-6">
        <div className="flex items-center justify-between">
          <Button
            onClick={() => onNavigate("settings")}
            className="w-14 h-14 bg-orange-500 hover:bg-orange-600 rounded-2xl text-white shadow-lg"
          >
            <ArrowLeft className="w-6 h-6" />
          </Button>
          <h1 className="text-3xl font-bold text-orange-500 uppercase tracking-wide">
            NOTIFICATIONS
          </h1>
          <div className="w-14 h-14"></div>
        </div>
      </div>

      <div className="px-6">
        <div className="bg-white rounded-3xl p-6 border-4 border-gray-200">
          <NotificationsPanel />
        </div>
      </div>
    </div>
  );
};

export default NotificationsPage;
