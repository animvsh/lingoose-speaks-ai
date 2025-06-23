
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
    <div className="bg-amber-50 border-b border-gray-100 sticky top-0 z-50">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          {showBackButton && onBack ? (
            <Button
              onClick={onBack}
              className="w-12 h-12 bg-orange-500 hover:bg-orange-600 rounded-xl text-white shadow-md
                         transform transition-all duration-150 hover:scale-105 active:scale-95"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
          ) : (
            <div className="w-12 h-12"></div>
          )}
          
          <div className="flex items-center justify-center flex-1">
            <h1 className="text-2xl font-bold text-orange-600 uppercase tracking-wide text-center">
              {title}
            </h1>
            {showLogo && (
              <DuckMascot size="sm" className="w-6 h-6 ml-2 opacity-60" />
            )}
          </div>
          
          <div className="w-12 h-12"></div>
        </div>
      </div>
    </div>
  );
};

export default AppBar;
