import { Button } from "@/components/ui/button";
import { Target, TrendingUp, Star, Clock, CheckCircle, Zap, Trophy, Users, Home, Phone, Settings, ArrowLeft } from "lucide-react";
import { useState } from "react";
import AppBar from "./AppBar";

interface FluencyMapCardProps {
  onNavigate: (view: string) => void;
}

const FluencyMapCard = ({ onNavigate }: FluencyMapCardProps) => {
  const [expandedCategory, setExpandedCategory] = useState(null);

  const toggleCategory = (category: any) => {
    setExpandedCategory(expandedCategory === category ? null : category);
  };

  const categories = [
    {
      name: "Basic Greetings",
      skills: ["Hello", "Goodbye", "Thank You", "You're Welcome"],
    },
    {
      name: "Everyday Conversations",
      skills: ["How are you?", "What's your name?", "Where are you from?", "What do you do?"],
    },
    {
      name: "Travel Phrases",
      skills: ["Where is the bathroom?", "How much does this cost?", "Can you help me?", "I need a taxi"],
    },
    {
      name: "Food & Drink",
      skills: ["I'd like to order", "Water, please", "The bill, please", "Delicious!"],
    },
    {
      name: "Emergency Phrases",
      skills: ["Help!", "I need a doctor", "Call the police", "I'm lost"],
    },
  ];

  return (
    <div className="min-h-screen bg-amber-50 pb-24">
      <AppBar 
        title="FLUENCY MAP" 
        onBack={() => onNavigate("home")} 
        showBackButton={true} 
      />

      <div className="px-6 space-y-6">
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-4xl font-bold text-purple-600 mb-2 uppercase tracking-wide">
            Fluency Map
          </h2>
          <p className="text-xl font-semibold text-gray-700">
            Explore your language skills
          </p>
        </div>

        {/* Categories */}
        <div className="space-y-4">
          {categories.map((category, index) => (
            <div key={index} className="bg-white rounded-3xl p-4 border-4 border-gray-200">
              <div
                className="flex items-center justify-between cursor-pointer"
                onClick={() => toggleCategory(category)}
              >
                <h3 className="text-lg font-bold text-gray-800 uppercase tracking-wide">
                  {category.name}
                </h3>
                <ChevronRight
                  className={`w-6 h-6 text-gray-600 transition-transform duration-200 ${
                    expandedCategory === category ? "rotate-90" : ""
                  }`}
                />
              </div>

              {expandedCategory === category && (
                <div className="mt-4 space-y-2">
                  {category.skills.map((skill, skillIndex) => (
                    <Button
                      key={skillIndex}
                      variant="outline"
                      className="w-full justify-start text-sm font-medium"
                    >
                      <Target className="w-4 h-4 mr-2" />
                      {skill}
                    </Button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Start Learning Button */}
        <Button
          onClick={() => onNavigate("curriculum")}
          className="w-full bg-orange-400 hover:bg-orange-500 text-white font-bold py-6 text-xl rounded-3xl border-4 border-orange-500"
        >
          START LEARNING 🚀
        </Button>
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
              className="w-14 h-14 bg-gray-200 rounded-2xl text-gray-600"
            >
              <Phone className="w-6 h-6" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onNavigate("curriculum")}
              className="w-14 h-14 bg-blue-400 rounded-2xl text-white"
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

export default FluencyMapCard;
