
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import DuckMascot from "./DuckMascot";

interface AppBarProps {
  title: string;
  onBack?: () => void;
  showBackButton?: boolean;
  showLogo?: boolean;
}

const AppBar = ({ title, onBack, showBackButton = true, showLogo = false }: AppBarProps) => {
  return (
    <div className="px-6 pt-8 pb-6">
      <div className="flex items-center justify-between">
        {showBackButton && onBack ? (
          <Button
            onClick={onBack}
            className="w-14 h-14 bg-orange-500 hover:bg-orange-600 rounded-2xl text-white shadow-lg"
          >
            <ArrowLeft className="w-6 h-6" />
          </Button>
        ) : showLogo ? (
          <DuckMascot size="sm" className="w-14 h-14" />
        ) : (
          <div className="w-14 h-14"></div>
        )}
        
        <h1 className="text-3xl font-bold text-orange-500 uppercase tracking-wide text-center flex-1">
          {title}
        </h1>
        
        <div className="w-14 h-14"></div>
      </div>
    </div>
  );
};

export default AppBar;
