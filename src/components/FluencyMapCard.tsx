
import { Button } from "@/components/ui/button";
import { ArrowLeft, Home, Phone, CheckCircle, Settings, Target, Star, Lock, Play, CheckCircle2 } from "lucide-react";
import { useState } from "react";

interface FluencyMapCardProps {
  onNavigate: (view: string) => void;
}

// Mock data for demonstration since the database tables were removed
const mockCourses = [
  {
    id: "1",
    name: "French Basics",
    language: "French",
    description: "Learn fundamental French conversation skills"
  },
  {
    id: "2", 
    name: "Spanish Essentials",
    language: "Spanish",
    description: "Master essential Spanish phrases and grammar"
  }
];

const mockNodes = [
  { id: "1", name: "Greetings", difficulty: "beginner" as const },
  { id: "2", name: "Numbers", difficulty: "beginner" as const },
  { id: "3", name: "Family", difficulty: "intermediate" as const },
  { id: "4", name: "Food", difficulty: "intermediate" as const },
  { id: "5", name: "Travel", difficulty: "advanced" as const },
  { id: "6", name: "Business", difficulty: "advanced" as const }
];

const FluencyMapCard = ({ onNavigate }: FluencyMapCardProps) => {
  const [selectedCourse, setSelectedCourse] = useState<string>("1");
  const [nodeProgress, setNodeProgress] = useState<Record<string, { status: string; fluency: number }>>({
    "1": { status: "completed", fluency: 100 },
    "2": { status: "in_progress", fluency: 75 },
    "3": { status: "available", fluency: 0 },
    "4": { status: "locked", fluency: 0 },
    "5": { status: "locked", fluency: 0 },
    "6": { status: "locked", fluency: 0 }
  });

  const getNodeStatus = (nodeId: string) => {
    return nodeProgress[nodeId]?.status || 'locked';
  };

  const getFluencyPercentage = (nodeId: string) => {
    return nodeProgress[nodeId]?.fluency || 0;
  };

  const getNodeColor = (status: string) => {
    switch (status) {
      case 'locked': return 'bg-gray-300 border-gray-400 text-gray-500';
      case 'available': return 'bg-blue-400 border-blue-500 text-white hover:bg-blue-500 hover:-translate-y-1';
      case 'in_progress': return 'bg-orange-400 border-orange-500 text-white hover:bg-orange-500 hover:-translate-y-1';
      case 'completed': return 'bg-green-400 border-green-500 text-white hover:bg-green-500 hover:-translate-y-1';
      case 'mastered': return 'bg-purple-400 border-purple-500 text-white hover:bg-purple-500 hover:-translate-y-1';
      default: return 'bg-gray-300 border-gray-400 text-gray-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'locked': return <Lock className="w-5 h-5" />;
      case 'available': return <Play className="w-5 h-5" />;
      case 'in_progress': return <Target className="w-5 h-5" />;
      case 'completed': return <CheckCircle2 className="w-5 h-5" />;
      case 'mastered': return <Star className="w-5 h-5" />;
      default: return <Lock className="w-5 h-5" />;
    }
  };

  const handleNodeClick = (nodeId: string, currentStatus: string) => {
    if (currentStatus === 'locked') return;
    
    let newStatus = currentStatus;
    let newFluency = nodeProgress[nodeId]?.fluency || 0;
    
    if (currentStatus === 'available') {
      newStatus = 'in_progress';
      newFluency = 50;
    } else if (currentStatus === 'in_progress') {
      newStatus = 'completed';
      newFluency = 100;
    }
    
    setNodeProgress(prev => ({
      ...prev,
      [nodeId]: { status: newStatus, fluency: newFluency }
    }));
  };

  const selectedCourseData = mockCourses.find(c => c.id === selectedCourse);
  const completedCount = Object.values(nodeProgress).filter(p => p.status === 'completed' || p.status === 'mastered').length;
  const inProgressCount = Object.values(nodeProgress).filter(p => p.status === 'in_progress').length;
  const masteredCount = Object.values(nodeProgress).filter(p => p.status === 'mastered').length;

  return (
    <div className="min-h-screen bg-stone-50 pb-28">
      <div className="px-6 pt-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div
            onClick={() => onNavigate("home")}
            className="w-16 h-16 bg-orange-400 hover:bg-orange-500 rounded-2xl flex items-center justify-center border-4 border-white hover:border-orange-200 transition-all duration-300 cursor-pointer hover:-translate-y-1"
          >
            <ArrowLeft className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-black text-orange-500 uppercase tracking-wider drop-shadow-sm">
            FLUENCY MAP 🗺️
          </h1>
          <div className="w-16 h-16"></div>
        </div>

        {/* Course Selection */}
        <div className="bg-white rounded-3xl p-6 mb-8 border-4 border-gray-100 hover:border-orange-200 transition-all duration-300 hover:-translate-y-1">
          <h2 className="font-black text-gray-800 mb-4 text-2xl uppercase tracking-wide">
            {selectedCourseData?.name || 'Select Course'} ✨
          </h2>
          <p className="text-gray-600 font-semibold text-base mb-6">
            {selectedCourseData?.description}
          </p>
          <div className="flex space-x-3">
            {mockCourses.map((course) => (
              <Button
                key={course.id}
                onClick={() => setSelectedCourse(course.id)}
                className={`px-6 py-3 rounded-2xl text-base font-black border-4 transition-all duration-300 hover:-translate-y-0.5 ${
                  selectedCourse === course.id
                    ? 'bg-orange-400 text-white border-white hover:border-orange-200'
                    : 'bg-gray-200 text-gray-700 border-white hover:border-gray-200'
                }`}
              >
                {course.language} 🌟
              </Button>
            ))}
          </div>
        </div>

        {/* Learning Tree Visualization */}
        <div className="bg-white rounded-3xl p-8 mb-8 border-4 border-gray-100 min-h-[600px] relative overflow-hidden">
          <h3 className="font-black text-gray-800 mb-8 text-2xl uppercase tracking-wide text-center">
            Your Learning Journey 🌟
          </h3>
          
          {/* Node Grid Layout */}
          <div className="relative w-full h-[500px]">
            {mockNodes.map((node) => {
              const status = getNodeStatus(node.id);
              const fluency = getFluencyPercentage(node.id);
              
              // Position nodes in a grid with some offset for visual appeal
              const nodeIndex = mockNodes.indexOf(node);
              const row = Math.floor(nodeIndex / 3);
              const col = nodeIndex % 3;
              const x = col * 120 + (row % 2) * 60; // Offset every other row
              const y = row * 100;
              
              return (
                <div
                  key={node.id}
                  className="absolute cursor-pointer transition-all duration-300"
                  style={{
                    left: `${Math.min(x, 280)}px`,
                    top: `${Math.min(y, 400)}px`,
                  }}
                  onClick={() => handleNodeClick(node.id, status)}
                >
                  {/* Node Circle */}
                  <div className={`w-20 h-20 rounded-2xl flex items-center justify-center font-black border-4 transition-all duration-300 ${getNodeColor(status)} ${status === 'locked' ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'}`}>
                    {getStatusIcon(status)}
                  </div>
                  
                  {/* Node Label */}
                  <div className="mt-3 text-center">
                    <div className="text-sm font-black text-gray-700 max-w-[90px] leading-tight">
                      {node.name}
                    </div>
                    {fluency > 0 && (
                      <div className="text-sm text-orange-600 font-bold mt-1">
                        {fluency}% fluent ⭐
                      </div>
                    )}
                  </div>
                  
                  {/* Difficulty Badge */}
                  <div className={`absolute -top-2 -right-2 w-8 h-8 rounded-full text-sm font-black flex items-center justify-center text-white border-2 border-white ${
                    node.difficulty === 'beginner' ? 'bg-green-400' :
                    node.difficulty === 'intermediate' ? 'bg-yellow-400' : 'bg-red-400'
                  }`}>
                    {node.difficulty?.charAt(0).toUpperCase()}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Progress Summary */}
        <div className="bg-gradient-to-br from-green-400 to-green-500 rounded-3xl p-6 border-4 border-white hover:border-green-200 transition-all duration-300 hover:-translate-y-1">
          <h3 className="font-black text-white mb-4 text-2xl uppercase tracking-wide">
            Your Progress 🏆
          </h3>
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-white/95 rounded-2xl p-4 text-center border-2 border-white/50">
              <div className="text-2xl font-black text-green-700">
                {completedCount}
              </div>
              <div className="text-xs text-green-600 font-bold">COMPLETED ✅</div>
            </div>
            <div className="bg-white/95 rounded-2xl p-4 text-center border-2 border-white/50">
              <div className="text-2xl font-black text-orange-700">
                {inProgressCount}
              </div>
              <div className="text-xs text-orange-600 font-bold">IN PROGRESS ⚡</div>
            </div>
            <div className="bg-white/95 rounded-2xl p-4 text-center border-2 border-white/50">
              <div className="text-2xl font-black text-purple-700">
                {masteredCount}
              </div>
              <div className="text-xs text-purple-600 font-bold">MASTERED 🌟</div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white px-6 py-4 border-t-4 border-gray-100">
        <div className="max-w-md mx-auto">
          <div className="flex justify-center space-x-3">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => onNavigate("home")}
              className="w-14 h-14 bg-gray-200 hover:bg-gray-300 rounded-2xl text-gray-600 border-4 border-white hover:border-gray-200 transition-all duration-300 hover:-translate-y-0.5"
            >
              <Home className="w-6 h-6" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => onNavigate("activity")}
              className="w-14 h-14 bg-gray-200 hover:bg-gray-300 rounded-2xl text-gray-600 border-4 border-white hover:border-gray-200 transition-all duration-300 hover:-translate-y-0.5"
            >
              <Phone className="w-6 h-6" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => onNavigate("curriculum")}
              className="w-14 h-14 bg-gray-200 hover:bg-gray-300 rounded-2xl text-gray-600 border-4 border-white hover:border-gray-200 transition-all duration-300 hover:-translate-y-0.5"
            >
              <CheckCircle className="w-6 h-6" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => onNavigate("fluency-map")}
              className="w-14 h-14 bg-purple-400 rounded-2xl text-white border-4 border-white transition-all duration-300"
            >
              <Target className="w-6 h-6" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => onNavigate("settings")}
              className="w-14 h-14 bg-gray-200 hover:bg-gray-300 rounded-2xl text-gray-600 border-4 border-white hover:border-gray-200 transition-all duration-300 hover:-translate-y-0.5"
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
