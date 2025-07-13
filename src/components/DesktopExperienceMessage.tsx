
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Smartphone, QrCode } from "lucide-react";

const DesktopExperienceMessage = () => {
  return (
    <div className="min-h-screen w-full bg-amber-50 flex items-center justify-center p-8">
      <div className="w-full max-w-lg">
        <Card className="warm-card p-12 text-center soft-shadow">
          {/* Bol Logo */}
          <div className="mb-8">
            <img 
              src="/lovable-uploads/711f26ed-7bb6-4411-8c08-9a443f487dfa.png" 
              alt="Bol Logo" 
              className="h-20 w-auto object-contain mx-auto mb-4" 
            />
            <h1 className="text-4xl font-black text-primary mb-2 uppercase tracking-wider transform -rotate-1">
              BOL
            </h1>
          </div>

          {/* Main Message */}
          <div className="space-y-6 mb-8">
            <div className="text-6xl mb-4">📱</div>
            <h2 className="text-2xl font-black text-foreground mb-4">
              This works much better on your phone!
            </h2>
            <p className="text-lg font-semibold text-muted-foreground mb-6">
              Bol is designed as a mobile-first experience for daily Hindi calls with your kids.
            </p>
            
            <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4 mb-6">
              <div className="flex items-center justify-center gap-3 mb-3">
                <Smartphone className="w-6 h-6 text-blue-600" />
                <span className="font-bold text-blue-800">Best Experience</span>
              </div>
              <p className="text-sm font-medium text-blue-700">
                Open this on your phone for the full Bol experience with notifications, calls, and daily progress tracking.
              </p>
            </div>
          </div>

          {/* Instructions */}
          <div className="space-y-4">
            <p className="text-sm font-bold text-foreground mb-4">
              To get the best experience:
            </p>
            <div className="text-left space-y-3 mb-6">
              <div className="flex items-start gap-3">
                <span className="w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-sm font-bold">1</span>
                <span className="text-sm font-medium">Open this URL on your phone</span>
              </div>
              <div className="flex items-start gap-3">
                <span className="w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-sm font-bold">2</span>
                <span className="text-sm font-medium">Add Bol to your home screen</span>
              </div>
              <div className="flex items-start gap-3">
                <span className="w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-sm font-bold">3</span>
                <span className="text-sm font-medium">Enable notifications for call reminders</span>
              </div>
            </div>

            <div className="pt-4 border-t border-border">
              <p className="text-xs text-muted-foreground mb-4">
                Current URL: <span className="font-mono bg-gray-100 px-2 py-1 rounded">{window.location.href}</span>
              </p>
              <Button
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href);
                }}
                variant="outline"
                className="w-full bg-white hover:bg-gray-50 border-2 border-primary text-primary font-bold"
              >
                📋 Copy URL to Share with Phone
              </Button>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-8 pt-6 border-t border-border">
            <p className="text-xs text-muted-foreground">
              💡 <strong>Tip:</strong> You can still manage your account settings from desktop, but the daily learning experience is optimized for mobile.
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default DesktopExperienceMessage;
