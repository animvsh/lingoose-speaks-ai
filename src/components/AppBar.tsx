
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import BolMascot from "./BolMascot";

interface AppBarProps {
  title: string;
  onBack?: () => void;
  showBackButton?: boolean;
  showLogo?: boolean;
}

const AppBar = ({ title, onBack, showBackButton = true, showLogo = true }: AppBarProps) => {
  return (
    <div className="px-6 pt-8 pb-6 bg-background/80 backdrop-blur-sm border-b border-border">
      <div className="flex items-center justify-between">
        {showBackButton && onBack ? (
          <Button
            onClick={onBack}
            className="w-14 h-14 warm-button rounded-2xl text-white soft-shadow"
          >
            <ArrowLeft className="w-6 h-6" />
          </Button>
        ) : showLogo ? (
          <BolMascot size="sm" className="w-14 h-14 animate-gentle-float" />
        ) : (
          <div className="w-14 h-14"></div>
        )}
        
        <div className="flex items-center justify-center flex-1">
          <h1 className="text-3xl font-bold text-primary uppercase tracking-wide text-center">
            {title}
          </h1>
        </div>
        
        <div className="w-14 h-14"></div>
      </div>
    </div>
  );
};

export default AppBar;
