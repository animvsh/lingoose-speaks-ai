
import { cn } from "@/lib/utils";

interface BolMascotProps {
  className?: string;
  size?: "sm" | "md" | "lg";
}

const BolMascot = ({ className, size = "lg" }: BolMascotProps) => {
  const sizeClasses = {
    sm: "w-16 h-16",
    md: "w-24 h-24", 
    lg: "w-32 h-32"
  };

  return (
    <div className={cn("relative", sizeClasses[size], className)}>
      <img 
        src="/lovable-uploads/585adb06-92d0-4a3a-87cc-fb71d70d8f29.png"
        alt="Bol Logo"
        className="w-full h-full object-contain hover:scale-110 transition-transform duration-200 soft-shadow rounded-xl"
      />
    </div>
  );
};

export default BolMascot;
