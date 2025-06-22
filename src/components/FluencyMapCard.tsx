
import { Button } from "@/components/ui/button";
import { ArrowLeft, Home, Phone, CheckCircle, Settings, Target, Star, Lock, Play, CheckCircle2 } from "lucide-react";
import { useCourses } from "@/hooks/useCourses";
import { useCourseNodes } from "@/hooks/useCourseNodes";
import { useUserNodeProgress } from "@/hooks/useUserNodeProgress";
import { useState, useEffect } from "react";

interface FluencyMapCardProps {
  onNavigate: (view: string) => void;
}

const FluencyMapCard = ({ onNavigate }: FluencyMapCardProps) => {
  const { data: courses, isLoading: coursesLoading } = useCourses();
  const [selectedCourse, setSelectedCourse] = useState<string>('');
  
  // Auto-select first course when courses load
  useEffect(() => {
    if (courses && courses.length > 0 && !selectedCourse) {
      setSelectedCourse(courses[0].id);
    }
  }, [courses, selectedCourse]);

  const { data: nodes, isLoading: nodesLoading } = useCourseNodes(selectedCourse);
  const { progress, updateProgress } = useUserNodeProgress(selectedCourse);

  if (coursesLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading your learning path...</p>
        </div>
      </div>
    );
  }

  const getNodeStatus = (nodeId: string) => {
    const nodeProgress = progress?.find(p => p.node_id === nodeId);
    return nodeProgress?.status || 'available';
  };

  const getFluencyPercentage = (nodeId: string) => {
    const nodeProgress = progress?.find(p => p.node_id === nodeId);
    return nodeProgress?.fluency_percentage || 0;
  };

  const getNodeColor = (status: string) => {
    switch (status) {
      case 'locked': return 'bg-gray-400 border-gray-500';
      case 'available': return 'bg-blue-500 border-blue-600 shadow-[0_4px_0_0_#2563eb] hover:shadow-[0_2px_0_0_#2563eb] hover:translate-y-0.5';
      case 'in_progress': return 'bg-orange-500 border-orange-600 shadow-[0_4px_0_0_#ea580c] hover:shadow-[0_2px_0_0_#ea580c] hover:translate-y-0.5';
      case 'completed': return 'bg-green-500 border-green-600 shadow-[0_4px_0_0_#16a34a] hover:shadow-[0_2px_0_0_#16a34a] hover:translate-y-0.5';
      case 'mastered': return 'bg-purple-500 border-purple-600 shadow-[0_4px_0_0_#9333ea] hover:shadow-[0_2px_0_0_#9333ea] hover:translate-y-0.5';
      default: return 'bg-gray-400 border-gray-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'locked': return <Lock className="w-4 h-4" />;
      case 'available': return <Play className="w-4 h-4" />;
      case 'in_progress': return <Target className="w-4 h-4" />;
      case 'completed': return <CheckCircle2 className="w-4 h-4" />;
      case 'mastered': return <Star className="w-4 h-4" />;
      default: return <Lock className="w-4 h-4" />;
    }
  };

  const handleNodeClick = (nodeId: string, currentStatus: string) => {
    if (currentStatus === 'locked') return;
    
    let newStatus = currentStatus;
    if (currentStatus === 'available') {
      newStatus = 'in_progress';
    } else if (currentStatus === 'in_progress') {
      newStatus = 'completed';
    }
    
    updateProgress.mutate({
      nodeId,
      status: newStatus as any,
      fluencyPercentage: newStatus === 'completed' ? 100 : 50,
    });
  };

  return (
    <div className="min-h-screen bg-gray-100 pb-24">
      <div className="px-4 pt-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div
            onClick={() => onNavigate("home")}
            className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center shadow-[0_4px_0_0_#ea580c] hover:shadow-[0_2px_0_0_#ea580c] hover:translate-y-0.5 transition-all duration-100 cursor-pointer active:shadow-[0_1px_0_0_#ea580c] active:translate-y-1"
          >
            <ArrowLeft className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-2xl font-black text-orange-500 uppercase tracking-wider">
            FLUENCY MAP
          </h1>
          <div className="w-12 h-12"></div>
        </div>

        {/* Course Selection */}
        {courses && courses.length > 0 && (
          <div className="bg-white rounded-3xl p-5 mb-6 shadow-[0_6px_0_0_#e5e7eb] hover:shadow-[0_3px_0_0_#e5e7eb] hover:translate-y-0.5 transition-all duration-100">
            <h2 className="font-black text-gray-800 mb-3 text-lg uppercase tracking-wide">
              {courses.find(c => c.id === selectedCourse)?.name || 'Select Course'}
            </h2>
            <p className="text-gray-600 font-medium text-sm mb-4">
              {courses.find(c => c.id === selectedCourse)?.description}
            </p>
            <div className="flex space-x-2">
              {courses.map((course) => (
                <Button
                  key={course.id}
                  onClick={() => setSelectedCourse(course.id)}
                  className={`px-4 py-2 rounded-2xl text-sm font-black transition-all duration-100 ${
                    selectedCourse === course.id
                      ? 'bg-orange-500 text-white shadow-[0_3px_0_0_#ea580c] hover:shadow-[0_1px_0_0_#ea580c] hover:translate-y-0.5'
                      : 'bg-gray-200 text-gray-700 shadow-[0_3px_0_0_#9ca3af] hover:shadow-[0_1px_0_0_#9ca3af] hover:translate-y-0.5'
                  } border-0`}
                >
                  {course.language}
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Learning Tree Visualization */}
        {nodes && nodes.length > 0 && (
          <div className="bg-white rounded-3xl p-6 mb-6 shadow-[0_6px_0_0_#e5e7eb] min-h-[600px] relative overflow-hidden">
            <h3 className="font-black text-gray-800 mb-6 text-xl uppercase tracking-wide text-center">
              Your Learning Journey
            </h3>
            
            {/* Node Grid Layout */}
            <div className="relative w-full h-[500px]">
              {nodes.map((node) => {
                const status = getNodeStatus(node.id);
                const fluency = getFluencyPercentage(node.id);
                
                // Position nodes in a grid with some offset for visual appeal
                const nodeIndex = nodes.indexOf(node);
                const row = Math.floor(nodeIndex / 3);
                const col = nodeIndex % 3;
                const x = col * 120 + (row % 2) * 60; // Offset every other row
                const y = row * 100;
                
                return (
                  <div
                    key={node.id}
                    className="absolute cursor-pointer transition-all duration-200"
                    style={{
                      left: `${Math.min(x, 280)}px`,
                      top: `${Math.min(y, 400)}px`,
                    }}
                    onClick={() => handleNodeClick(node.id, status)}
                  >
                    {/* Node Circle */}
                    <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-white font-black border-2 transition-all duration-100 ${getNodeColor(status)} ${status === 'locked' ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'}`}>
                      {getStatusIcon(status)}
                    </div>
                    
                    {/* Node Label */}
                    <div className="mt-2 text-center">
                      <div className="text-xs font-black text-gray-700 max-w-[80px] leading-tight">
                        {node.name}
                      </div>
                      {fluency > 0 && (
                        <div className="text-xs text-orange-600 font-bold mt-1">
                          {fluency}% fluent
                        </div>
                      )}
                    </div>
                    
                    {/* Difficulty Badge */}
                    <div className={`absolute -top-2 -right-2 w-6 h-6 rounded-full text-xs font-black flex items-center justify-center text-white ${
                      node.difficulty === 'beginner' ? 'bg-green-500' :
                      node.difficulty === 'intermediate' ? 'bg-yellow-500' : 'bg-red-500'
                    }`}>
                      {node.difficulty?.charAt(0).toUpperCase()}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Progress Summary */}
        {progress && progress.length > 0 && (
          <div className="bg-green-500 rounded-3xl p-5 shadow-[0_6px_0_0_#16a34a] hover:shadow-[0_3px_0_0_#16a34a] hover:translate-y-0.5 transition-all duration-100">
            <h3 className="font-black text-white mb-3 text-lg uppercase tracking-wide">
              Your Progress
            </h3>
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-white/90 rounded-2xl p-3 text-center">
                <div className="text-lg font-black text-green-700">
                  {progress.filter(p => p.status === 'completed' || p.status === 'mastered').length}
                </div>
                <div className="text-xs text-green-600 font-bold">COMPLETED</div>
              </div>
              <div className="bg-white/90 rounded-2xl p-3 text-center">
                <div className="text-lg font-black text-orange-700">
                  {progress.filter(p => p.status === 'in_progress').length}
                </div>
                <div className="text-xs text-orange-600 font-bold">IN PROGRESS</div>
              </div>
              <div className="bg-white/90 rounded-2xl p-3 text-center">
                <div className="text-lg font-black text-purple-700">
                  {progress.filter(p => p.status === 'mastered').length}
                </div>
                <div className="text-xs text-purple-600 font-bold">MASTERED</div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white px-4 py-4 shadow-[0_-4px_0_0_#e5e7eb]">
        <div className="max-w-md mx-auto">
          <div className="flex justify-center space-x-4">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => onNavigate("home")}
              className="w-12 h-12 bg-gray-200 hover:bg-gray-300 rounded-2xl text-gray-600 transition-all duration-100 shadow-[0_3px_0_0_#9ca3af] hover:shadow-[0_1px_0_0_#9ca3af] hover:translate-y-0.5 border-0"
            >
              <Home className="w-5 h-5" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => onNavigate("activity")}
              className="w-12 h-12 bg-gray-200 hover:bg-gray-300 rounded-2xl text-gray-600 transition-all duration-100 shadow-[0_3px_0_0_#9ca3af] hover:shadow-[0_1px_0_0_#9ca3af] hover:translate-y-0.5 border-0"
            >
              <Phone className="w-5 h-5" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => onNavigate("curriculum")}
              className="w-12 h-12 bg-gray-200 hover:bg-gray-300 rounded-2xl text-gray-600 transition-all duration-100 shadow-[0_3px_0_0_#9ca3af] hover:shadow-[0_1px_0_0_#9ca3af] hover:translate-y-0.5 border-0"
            >
              <CheckCircle className="w-5 h-5" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => onNavigate("fluency-map")}
              className="w-12 h-12 bg-purple-500 rounded-2xl text-white shadow-[0_3px_0_0_#9333ea] border-0"
            >
              <Target className="w-5 h-5" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => onNavigate("settings")}
              className="w-12 h-12 bg-gray-200 hover:bg-gray-300 rounded-2xl text-gray-600 transition-all duration-100 shadow-[0_3px_0_0_#9ca3af] hover:shadow-[0_1px_0_0_#9ca3af] hover:translate-y-0.5 border-0"
            >
              <Settings className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FluencyMapCard;
