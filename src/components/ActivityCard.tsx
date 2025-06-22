import { Button } from "@/components/ui/button";
import { Phone, Clock, CheckCircle, Home, Settings, ArrowLeft, Play, Mic, Users, MapPin, Coffee, Briefcase, Heart, ShoppingCart, Plane, GraduationCap, Car, Music, Book, Star, Target, TrendingUp, TrendingDown, AlertCircle, RefreshCw } from "lucide-react";
import DuckMascot from "./DuckMascot";
import LearningProgressTree from "./LearningProgressTree";
import { useState } from "react";
import AppBar from "./AppBar";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useUserActivityRatings } from "@/hooks/useUserActivityRatings";
import { format } from "date-fns";
import { useAuth } from "@/contexts/AuthContext";

interface ActivityCardProps {
  onNavigate: (view: string) => void;
}

interface GeneratedActivity {
  name: string;
  description: string;
  duration: string;
  skills: Array<{
    name: string;
    level: string;
  }>;
}

const ActivityCard = ({ onNavigate }: ActivityCardProps) => {
  const [isStartingCall, setIsStartingCall] = useState(false);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [currentActivity, setCurrentActivity] = useState({
    name: "Hotel check-in conversation 🏨",
    description: "Practice checking into a hotel",
    duration: "15",
    skills: [
      { name: "Greeting & Politeness", level: "Beginner" },
      { name: "Personal Information", level: "Beginner" },
      { name: "Room Preferences", level: "Intermediate" },
      { name: "Payment Methods", level: "Beginner" }
    ]
  });
  
  const { toast } = useToast();
  const { ratings } = useUserActivityRatings();
  const { user } = useAuth();

  // Get the most recent activity rating
  const lastActivity = ratings?.[0];

  // Analyze recent performance (last 3 activities)
  const recentActivities = ratings?.slice(0, 3) || [];
  const skillPerformance = recentActivities.reduce((acc, activity) => {
    const skillName = activity.activities.name;
    if (!acc[skillName]) {
      acc[skillName] = [];
    }
    acc[skillName].push(activity.rating);
    return acc;
  }, {} as Record<string, number[]>);

  const improvedSkills = [];
  const strugglingSkills = [];

  Object.entries(skillPerformance).forEach(([skillName, ratings]) => {
    const avgRating = ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length;
    if (avgRating >= 4) {
      improvedSkills.push({ name: skillName, avgRating, attempts: ratings.length });
    } else if (avgRating < 3) {
      strugglingSkills.push({ name: skillName, avgRating, attempts: ratings.length });
    }
  });

  const handleRegenerateActivity = async () => {
    setIsRegenerating(true);
    try {
      toast({
        title: "🔄 Generating New Activity",
        description: "Creating a fresh practice session for you...",
        className: "border-2 border-purple-400 bg-purple-50 text-purple-800",
      });

      const { data, error } = await supabase.functions.invoke('generate-activity', {
        body: { 
          currentActivity: currentActivity.name
        }
      });

      if (error) {
        console.error('Error generating activity:', error);
        throw new Error(error.message);
      }

      if (data.error) {
        throw new Error(data.error);
      }

      // Update the current activity with the generated data
      setCurrentActivity({
        name: data.name,
        description: data.description,
        duration: data.duration.toString(),
        skills: data.skills || []
      });

      toast({
        title: "✨ New Activity Generated!",
        description: `Ready to practice: ${data.name}`,
        className: "border-2 border-green-400 bg-green-50 text-green-800",
      });

    } catch (error) {
      console.error('Error regenerating activity:', error);
      toast({
        title: "❌ Generation Failed",
        description: error.message || "Failed to generate new activity. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsRegenerating(false);
    }
  };

  const handleStartCall = async () => {
    if (!user?.user_metadata?.phone_number) {
      toast({
        title: "❌ Phone Number Required",
        description: "Please add your phone number in profile settings to start practice sessions.",
        variant: "destructive",
      });
      return;
    }

    setIsStartingCall(true);
    try {
      toast({
        title: "🎯 Practice Session Starting!",
        description: `Connecting you to your ${currentActivity.name.toLowerCase()} scenario...`,
        className: "border-2 border-blue-400 bg-blue-50 text-blue-800",
      });

      const phoneNumber = user.user_metadata.phone_number;
      
      const { data, error } = await supabase.functions.invoke('start-vapi-call', {
        body: { 
          phoneNumber: phoneNumber,
          userId: user.id,
          topic: `${currentActivity.name} conversation practice`
        }
      });

      if (error) {
        console.error('Error starting call:', error);
        toast({
          title: "❌ Connection Failed",
          description: error.message || "Failed to start practice session. Please try again.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "📞 Call Connected!",
          description: "Your practice session is now live. Good luck!",
          className: "border-2 border-green-400 bg-green-50 text-green-800",
        });
      }
    } catch (error) {
      console.error('Error starting call:', error);
      toast({
        title: "❌ Connection Failed",
        description: "Failed to start practice session. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsStartingCall(false);
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
        }`}
      />
    ));
  };

  return (
    <div className="min-h-screen bg-amber-50 pb-24">
      <AppBar 
        title="PRACTICE HUB" 
        onBack={() => onNavigate("home")} 
        showBackButton={true} 
      />

      <div className="px-6 space-y-6">
        {/* Welcome Section */}
        <div className="text-center mb-8">
          <h2 className="text-4xl font-bold text-orange-600 mb-2 uppercase tracking-wide">
            WELCOME BACK!
          </h2>
          <p className="text-xl font-semibold text-gray-700">
            Ready for today's Hindi adventure?
          </p>
        </div>

        {/* Previous Activity Section */}
        {lastActivity ? (
          <div className="bg-purple-400 rounded-3xl p-6 border-4 border-purple-500 mb-8">
            <div className="flex items-center mb-4">
              <div className="w-14 h-14 bg-purple-600 rounded-2xl flex items-center justify-center mr-4">
                <Phone className="w-7 h-7 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-white uppercase tracking-wide">
                  PREVIOUS ACTIVITY
                </h3>
                <p className="text-purple-100 font-medium text-sm">
                  {lastActivity.activities.name}
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-600 rounded-2xl flex flex-col items-center justify-center border-2 border-purple-700">
                  <div className="text-2xl font-bold text-white">{lastActivity.rating}</div>
                  <div className="text-xs text-purple-100 font-medium">STARS</div>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="bg-purple-300 rounded-2xl p-3 text-center border-2 border-purple-400">
                <div className="w-8 h-8 bg-purple-600 rounded-xl flex items-center justify-center mx-auto mb-2">
                  <Clock className="w-4 h-4 text-white" />
                </div>
                <div className="text-sm font-bold text-purple-800">
                  {lastActivity.duration_seconds ? `${Math.round(lastActivity.duration_seconds / 60)}MIN` : 'N/A'}
                </div>
                <div className="text-xs text-purple-700">duration</div>
              </div>
              <div className="bg-purple-300 rounded-2xl p-3 text-center border-2 border-purple-400">
                <div className="w-8 h-8 bg-purple-600 rounded-xl flex items-center justify-center mx-auto mb-2">
                  <Target className="w-4 h-4 text-white" />
                </div>
                <div className="text-sm font-bold text-purple-800">
                  {format(new Date(lastActivity.completed_at), 'MMM d')}
                </div>
                <div className="text-xs text-purple-700">completed</div>
              </div>
            </div>

            <div className="flex items-center justify-center space-x-1">
              {renderStars(lastActivity.rating)}
            </div>
          </div>
        ) : (
          <div className="bg-gray-400 rounded-3xl p-6 border-4 border-gray-500 mb-8">
            <div className="flex items-center justify-center">
              <div className="w-14 h-14 bg-gray-600 rounded-2xl flex items-center justify-center mr-4">
                <Phone className="w-7 h-7 text-white" />
              </div>
              <div className="text-center">
                <h3 className="text-lg font-bold text-white uppercase tracking-wide">
                  NO PREVIOUS ACTIVITY
                </h3>
                <p className="text-gray-100 font-medium text-sm">
                  Start your first practice session below!
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Today's Activity */}
        <div className="bg-blue-400 rounded-3xl p-6 border-4 border-blue-500 mb-8">
          <div className="flex items-center mb-4">
            <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center mr-4">
              <Phone className="w-7 h-7 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-white uppercase tracking-wide">
                TODAY'S ACTIVITY
              </h3>
              <p className="text-blue-100 font-medium text-sm">
                {currentActivity.description}
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 rounded-2xl flex flex-col items-center justify-center border-2 border-blue-700">
                <div className="text-2xl font-bold text-white">{currentActivity.duration}</div>
                <div className="text-xs text-blue-100 font-medium">MIN</div>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-3 mb-6">
            <div className="bg-blue-300 rounded-2xl p-3 text-center border-2 border-blue-400">
              <div className="w-8 h-8 bg-blue-600 rounded-xl flex items-center justify-center mx-auto mb-2">
                <Users className="w-4 h-4 text-white" />
              </div>
              <div className="text-sm font-bold text-blue-800">2-PERSON</div>
              <div className="text-xs text-blue-700">dialogue</div>
            </div>
            <div className="bg-blue-300 rounded-2xl p-3 text-center border-2 border-blue-400">
              <div className="w-8 h-8 bg-blue-600 rounded-xl flex items-center justify-center mx-auto mb-2">
                <Star className="w-4 h-4 text-white" />
              </div>
              <div className="text-sm font-bold text-blue-800">+50 XP</div>
              <div className="text-xs text-blue-700">reward</div>
            </div>
          </div>

          {/* Skills Tested */}
          <div className="mb-6">
            <h4 className="text-sm font-bold text-white uppercase tracking-wide mb-3">
              Skills Tested:
            </h4>
            <div className="grid grid-cols-2 gap-2">
              {currentActivity.skills.map((skill, index) => (
                <div key={index} className="bg-blue-300 rounded-xl p-2 border-2 border-blue-400">
                  <div className="text-xs font-bold text-blue-800">{skill.name}</div>
                  <div className="text-xs text-blue-700">{skill.level}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <Button 
              onClick={handleStartCall}
              disabled={isStartingCall}
              className="w-full bg-white hover:bg-blue-50 text-blue-600 font-bold py-4 text-lg rounded-2xl border-4 border-white transition-all duration-300"
            >
              {isStartingCall ? (
                <>
                  <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mr-3"></div>
                  STARTING...
                </>
              ) : (
                <>
                  ⚡ START PRACTICE SESSION
                </>
              )}
            </Button>

            <Button 
              onClick={handleRegenerateActivity}
              disabled={isRegenerating}
              variant="outline"
              className="w-full bg-blue-100 hover:bg-blue-200 text-blue-700 font-bold py-3 text-base rounded-2xl border-2 border-blue-300 transition-all duration-300"
            >
              {isRegenerating ? (
                <>
                  <div className="w-4 h-4 border-2 border-blue-700 border-t-transparent rounded-full animate-spin mr-2"></div>
                  GENERATING...
                </>
              ) : (
                <>
                  <RefreshCw className="w-4 h-4 mr-2" />
                  REGENERATE ACTIVITY
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Learning Progress Tree */}
        <LearningProgressTree />

        {/* Skills Performance Analysis */}
        {(improvedSkills.length > 0 || strugglingSkills.length > 0) && (
          <div className="space-y-4">
            {/* Improved Skills */}
            {improvedSkills.length > 0 && (
              <div className="bg-green-400 rounded-3xl p-6 border-4 border-green-500">
                <div className="flex items-center mb-4">
                  <div className="w-14 h-14 bg-green-600 rounded-2xl flex items-center justify-center mr-4">
                    <TrendingUp className="w-7 h-7 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-white uppercase tracking-wide">
                      SKILLS IMPROVED
                    </h3>
                    <p className="text-green-100 font-medium text-sm">
                      You're doing great in these areas!
                    </p>
                  </div>
                </div>
                
                <div className="space-y-3">
                  {improvedSkills.slice(0, 2).map((skill, index) => (
                    <div key={index} className="bg-green-300 rounded-2xl p-4 border-2 border-green-400">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-sm font-bold text-green-800 truncate">
                          {skill.name}
                        </h4>
                        <div className="flex items-center space-x-1">
                          {renderStars(Math.round(skill.avgRating))}
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-xs text-green-700">
                        <span>{skill.avgRating.toFixed(1)}/5.0 average</span>
                        <span>{skill.attempts} attempts</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Struggling Skills */}
            {strugglingSkills.length > 0 && (
              <div className="bg-orange-400 rounded-3xl p-6 border-4 border-orange-500">
                <div className="flex items-center mb-4">
                  <div className="w-14 h-14 bg-orange-600 rounded-2xl flex items-center justify-center mr-4">
                    <AlertCircle className="w-7 h-7 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-white uppercase tracking-wide">
                      NEEDS PRACTICE
                    </h3>
                    <p className="text-orange-100 font-medium text-sm">
                      Focus on these skills next
                    </p>
                  </div>
                </div>
                
                <div className="space-y-3">
                  {strugglingSkills.slice(0, 2).map((skill, index) => (
                    <div key={index} className="bg-orange-300 rounded-2xl p-4 border-2 border-orange-400">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-sm font-bold text-orange-800 truncate">
                          {skill.name}
                        </h4>
                        <div className="flex items-center space-x-1">
                          {renderStars(Math.round(skill.avgRating))}
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-xs text-orange-700">
                        <span>{skill.avgRating.toFixed(1)}/5.0 average</span>
                        <span>{skill.attempts} attempts</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white px-6 py-4 border-t border-gray-100">
        <div className="max-w-md mx-auto">
          <div className="flex justify-center space-x-4">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => onNavigate("home")}
              className="w-14 h-14 bg-gray-200 rounded-2xl text-gray-600"
            >
              <Home className="w-6 h-6" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => onNavigate("activity")}
              className="w-14 h-14 bg-blue-400 rounded-2xl text-white"
            >
              <Phone className="w-6 h-6" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => onNavigate("curriculum")}
              className="w-14 h-14 bg-gray-200 rounded-2xl text-gray-600"
            >
              <CheckCircle className="w-6 h-6" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => onNavigate("settings")}
              className="w-14 h-14 bg-gray-200 rounded-2xl text-gray-600"
            >
              <Settings className="w-6 h-6" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActivityCard;
