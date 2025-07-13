
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
        src="/lovable-uploads/bffc16a0-a627-446a-bf2b-ff86182ebeea.png"
        alt="Bol Mascot"
        className="w-full h-full object-contain animate-bounce"
        style={{ animationDuration: "3s" }}
      />
    </div>
  );
};

export default BolMascot;
