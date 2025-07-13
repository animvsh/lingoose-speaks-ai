
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
    <div className={cn("relative hover-safe", sizeClasses[size], className)}>
      <img 
        src="/lovable-uploads/711f26ed-7bb6-4411-8c08-9a443f487dfa.png"
        alt="Bol Mascot"
        className="w-full h-full object-contain animate-bounce hover:animate-wiggle transition-all duration-300 hover:scale-110 hover:rotate-12 cartoon-shadow hover:cartoon-shadow-hover"
        style={{ animationDuration: "3s" }}
      />
      {/* Floating decorative elements around mascot */}
      <div className="absolute -top-2 -right-2 w-4 h-4 bg-orange-400 rounded-full animate-bounce opacity-70" style={{ animationDelay: '0.5s' }}></div>
      <div className="absolute -bottom-1 -left-1 w-3 h-3 bg-yellow-400 rounded-full animate-bounce opacity-70" style={{ animationDelay: '1s' }}></div>
    </div>
  );
};

export default BolMascot;
