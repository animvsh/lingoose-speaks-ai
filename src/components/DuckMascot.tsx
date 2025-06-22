
import { cn } from "@/lib/utils";

interface DuckMascotProps {
  className?: string;
  size?: "sm" | "md" | "lg";
}

const DuckMascot = ({ className, size = "lg" }: DuckMascotProps) => {
  const sizeClasses = {
    sm: "w-16 h-16",
    md: "w-24 h-24", 
    lg: "w-32 h-32"
  };

  return (
    <div className={cn("relative", sizeClasses[size], className)}>
      <img 
        src="/lovable-uploads/9b390537-0ebd-41d1-a22b-a1866619c6e8.png"
        alt="Lingoose Mascot"
        className="w-full h-full object-contain animate-bounce"
        style={{ animationDuration: "3s" }}
      />
    </div>
  );
};

export default DuckMascot;
