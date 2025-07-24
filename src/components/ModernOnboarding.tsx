import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Sparkles, Heart, Star, User, Zap, ArrowRight, Loader2 } from "lucide-react";
import BolMascot from "./BolMascot";
import LoadingOverlay from "./LoadingOverlay";
import { useCreateUserProfile } from "@/hooks/useCreateUserProfile";
import { useToast } from "@/hooks/use-toast";

interface ModernOnboardingProps {
  phoneNumber: string;
  onComplete: () => void;
}

const ModernOnboarding = ({ phoneNumber, onComplete }: ModernOnboardingProps) => {
  const [step, setStep] = useState<'name' | 'level'>('name');
  const [fullName, setFullName] = useState("");
  const [selectedLevel, setSelectedLevel] = useState<number | null>(null);
  const [isCreatingProfile, setIsCreatingProfile] = useState(false);
  
  const createUserProfile = useCreateUserProfile();
  const { toast } = useToast();

  const levels = [
    { 
      level: 1, 
      title: "Complete Beginner", 
      desc: "I know no Hindi", 
      emoji: "🌱",
      gradient: "from-emerald-400 to-green-500"
    },
    { 
      level: 2, 
      title: "Basic", 
      desc: "Few words & phrases", 
      emoji: "🌿",
      gradient: "from-blue-400 to-cyan-500"
    },
    { 
      level: 3, 
      title: "Intermediate", 
      desc: "Simple conversations", 
      emoji: "🌳",
      gradient: "from-orange-400 to-yellow-500"
    },
    { 
      level: 4, 
      title: "Advanced", 
      desc: "Quite fluent", 
      emoji: "🎯",
      gradient: "from-purple-400 to-pink-500"
    },
    { 
      level: 5, 
      title: "Expert", 
      desc: "Nearly fluent", 
      emoji: "⭐",
      gradient: "from-red-400 to-rose-500"
    }
  ];

  const handleNameSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (fullName.trim()) {
      setStep('level');
    }
  };

  const handleLevelSelect = async (level: number) => {
    setSelectedLevel(level);
    setIsCreatingProfile(true);

    try {
      await createUserProfile.mutateAsync({
        phone_number: phoneNumber,
        full_name: fullName.trim(),
        proficiency_level: level,
        language: 'hindi'
      });

      toast({
        title: "Welcome to Bol! 🎉",
        description: "Your profile has been created successfully.",
        className: "border-2 border-primary/20 bg-primary/5",
      });

      // Small delay for better UX, then complete
      setTimeout(() => {
        onComplete();
      }, 1000);

    } catch (error) {
      console.error('Profile creation failed:', error);
      toast({
        title: "Something went wrong",
        description: "Please try again.",
        variant: "destructive",
      });
      setIsCreatingProfile(false);
      setSelectedLevel(null);
    }
  };

  if (isCreatingProfile) {
    return (
      <div className="min-h-screen hindi-bg flex items-center justify-center p-6">
        <div className="text-center space-y-6">
          <BolMascot className="w-24 h-24 mx-auto animate-bounce" />
          <div className="space-y-2">
            <h2 className="text-2xl font-black text-primary">Creating your profile...</h2>
            <div className="w-32 h-1 bg-primary/20 rounded-full mx-auto overflow-hidden">
              <div className="w-full h-full bg-gradient-to-r from-primary/40 to-primary animate-pulse rounded-full"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (step === 'level') {
    return (
      <div className="min-h-screen hindi-bg p-6">
        <div className="w-full max-w-md mx-auto space-y-6">
          {/* Header */}
          <div className="text-center space-y-4">
            <BolMascot className="w-20 h-20 mx-auto animate-gentle-float" />
            <div>
              <h1 className="text-3xl font-black text-primary mb-2">
                Nice to meet you, {fullName}! 👋
              </h1>
              <p className="text-lg text-muted-foreground">
                What's your Hindi level?
              </p>
            </div>
          </div>

          {/* Level Selection */}
          <div className="space-y-3">
            {levels.map((level, index) => (
              <button
                key={level.level}
                onClick={() => handleLevelSelect(level.level)}
                disabled={isCreatingProfile}
                className={`w-full p-4 rounded-2xl text-left transition-all duration-300 border-2 transform hover:scale-[1.02] hover:shadow-lg ${
                  selectedLevel === level.level 
                    ? `bg-gradient-to-r ${level.gradient} border-white text-white shadow-xl scale-[1.02]` 
                    : 'warm-card border-handdrawn hover:border-primary/30 hover:shadow-md'
                }`}
                style={{ 
                  animationDelay: `${index * 0.1}s`,
                  animation: 'fade-in 0.5s ease-out forwards'
                }}
              >
                <div className="flex items-center space-x-4">
                  <div className={`w-14 h-14 rounded-xl flex items-center justify-center text-2xl shadow-sm ${
                    selectedLevel === level.level ? 'bg-white/20' : 'bg-primary/10'
                  }`}>
                    {level.emoji}
                  </div>
                  <div className="flex-1">
                    <div className="font-black text-lg mb-1">{level.title}</div>
                    <div className={`text-sm font-medium ${
                      selectedLevel === level.level ? 'text-white/90' : 'text-muted-foreground'
                    }`}>
                      {level.desc}
                    </div>
                  </div>
                  <Star className={`w-6 h-6 transition-all ${
                    selectedLevel === level.level ? 'text-white animate-pulse' : 'text-primary/40'
                  }`} />
                </div>
              </button>
            ))}
          </div>

          {/* Footer */}
          <div className="text-center warm-card p-4 border border-handdrawn rounded-xl">
            <p className="text-sm text-muted-foreground">
              <BolMascot size="sm" className="w-5 h-5 inline mr-2" />
              Don't worry, we'll adjust as we learn together! 🎯
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen hindi-bg flex items-center justify-center p-6">
      <div className="w-full max-w-md space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <BolMascot className="w-24 h-24 mx-auto animate-gentle-float" />
          <div>
            <h1 className="text-4xl font-black text-primary mb-2">What's your name?</h1>
            <p className="text-lg text-muted-foreground">
              Let's get to know you better
            </p>
          </div>
        </div>

        {/* Name Form */}
        <Card className="warm-card border-2 border-handdrawn shadow-lg">
          <CardContent className="p-6">
            <form onSubmit={handleNameSubmit} className="space-y-4">
              <div className="relative">
                <User className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Your full name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="pl-10 py-6 text-lg font-semibold border-2 border-handdrawn rounded-xl"
                  required
                />
              </div>

              <Button
                type="submit"
                disabled={!fullName.trim()}
                className="w-full warm-button py-6 text-lg font-black"
              >
                <ArrowRight className="w-5 h-5 mr-2" />
                Continue
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Fun message */}
        <div className="text-center warm-card p-4 border border-handdrawn rounded-xl">
          <div className="flex items-center justify-center gap-2">
            <Heart className="w-5 h-5 text-primary animate-pulse" />
            <span className="text-sm text-muted-foreground">Ready to start your Hindi journey?</span>
            <Sparkles className="w-5 h-5 text-primary animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModernOnboarding;