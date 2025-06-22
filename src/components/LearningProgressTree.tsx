
import { Trophy, Star, Lock, CheckCircle2, MapPin, Route, Mountain, Home as HomeIcon, Compass } from "lucide-react";
import { useState } from "react";

const LearningProgressTree = () => {
  // Mock data for learning nodes in a map-like structure
  const mapNodes = [
    { 
      id: "start", 
      name: "Starting Village", 
      type: "village",
      status: "completed", 
      x: 20, 
      y: 80, 
      progress: 100,
      description: "Your learning journey begins here"
    },
    { 
      id: "basics", 
      name: "Grammar Forest", 
      type: "forest",
      status: "completed", 
      x: 35, 
      y: 60, 
      progress: 95,
      description: "Master basic grammar rules"
    },
    { 
      id: "vocabulary", 
      name: "Vocabulary Lake", 
      type: "lake",
      status: "in_progress", 
      x: 65, 
      y: 55, 
      progress: 65,
      description: "Expand your word knowledge"
    },
    { 
      id: "conversation", 
      name: "Conversation City", 
      type: "city",
      status: "locked", 
      x: 80, 
      y: 30, 
      progress: 0,
      description: "Practice real conversations"
    },
    { 
      id: "advanced", 
      name: "Fluency Peak", 
      type: "mountain",
      status: "locked", 
      x: 70, 
      y: 10, 
      progress: 0,
      description: "Achieve native-like fluency"
    },
    { 
      id: "culture", 
      name: "Culture Harbor", 
      type: "harbor",
      status: "available", 
      x: 45, 
      y: 35, 
      progress: 25,
      description: "Learn cultural context"
    }
  ];

  // Define paths between nodes
  const paths = [
    { from: "start", to: "basics" },
    { from: "basics", to: "vocabulary" },
    { from: "basics", to: "culture" },
    { from: "vocabulary", to: "conversation" },
    { from: "culture", to: "conversation" },
    { from: "conversation", to: "advanced" }
  ];

  const getNodeIcon = (type: string, status: string) => {
    switch (type) {
      case "village": return <HomeIcon className="w-5 h-5" />;
      case "forest": return <span className="text-lg">🌲</span>;
      case "lake": return <span className="text-lg">🏞️</span>;
      case "city": return <span className="text-lg">🏙️</span>;
      case "mountain": return <Mountain className="w-5 h-5" />;
      case "harbor": return <span className="text-lg">⚓</span>;
      default: return <MapPin className="w-5 h-5" />;
    }
  };

  const getNodeColor = (status: string) => {
    switch (status) {
      case "completed": return "bg-green-400 border-green-500 text-white hover:bg-green-500";
      case "in_progress": return "bg-orange-400 border-orange-500 text-white hover:bg-orange-500";
      case "available": return "bg-blue-400 border-blue-500 text-white hover:bg-blue-500";
      case "locked": return "bg-gray-300 border-gray-400 text-gray-600";
      default: return "bg-gray-300 border-gray-400 text-gray-600";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed": return <CheckCircle2 className="w-3 h-3" />;
      case "in_progress": return <Star className="w-3 h-3" />;
      case "available": return <Compass className="w-3 h-3" />;
      case "locked": return <Lock className="w-3 h-3" />;
      default: return <Lock className="w-3 h-3" />;
    }
  };

  return (
    <div className="bg-gradient-to-br from-sky-100 to-emerald-100 rounded-3xl p-8 border-4 border-white relative overflow-hidden min-h-[500px]">
      {/* Map Background Elements */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-10 left-10 w-20 h-20 bg-green-200 rounded-full"></div>
        <div className="absolute top-32 right-16 w-16 h-16 bg-blue-200 rounded-full"></div>
        <div className="absolute bottom-20 left-20 w-24 h-24 bg-yellow-200 rounded-full"></div>
        <div className="absolute bottom-10 right-10 w-12 h-12 bg-purple-200 rounded-full"></div>
      </div>

      {/* Map Title */}
      <div className="text-center mb-8 relative z-10">
        <h3 className="text-2xl font-black text-gray-800 uppercase tracking-wide mb-2">
          YOUR LEARNING MAP 🗺️
        </h3>
        <p className="text-gray-600 font-semibold">
          Explore the world of Hindi language
        </p>
      </div>

      {/* Map Container */}
      <div className="relative w-full h-96 bg-gradient-to-br from-green-50 to-blue-50 rounded-2xl border-4 border-white overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10">
          <svg width="100%" height="100%" viewBox="0 0 100 100" className="w-full h-full">
            <defs>
              <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                <path d="M 10 0 L 0 0 0 10" fill="none" stroke="#34d399" strokeWidth="0.5"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>

        {/* Paths between nodes */}
        <svg className="absolute inset-0 w-full h-full" style={{ zIndex: 1 }}>
          {paths.map((path, index) => {
            const fromNode = mapNodes.find(n => n.id === path.from);
            const toNode = mapNodes.find(n => n.id === path.to);
            if (!fromNode || !toNode) return null;

            const fromX = `${fromNode.x}%`;
            const fromY = `${fromNode.y}%`;
            const toX = `${toNode.x}%`;
            const toY = `${toNode.y}%`;

            // Create a curved path
            const midX = (fromNode.x + toNode.x) / 2;
            const midY = (fromNode.y + toNode.y) / 2 - 5; // Slight curve

            return (
              <path
                key={index}
                d={`M ${fromX} ${fromY} Q ${midX}% ${midY}% ${toX} ${toY}`}
                stroke={toNode.status === 'locked' ? '#d1d5db' : '#10b981'}
                strokeWidth="3"
                fill="none"
                strokeDasharray={toNode.status === 'locked' ? '8,4' : 'none'}
                className="drop-shadow-sm"
              />
            );
          })}
        </svg>

        {/* Map Nodes */}
        {mapNodes.map((node) => (
          <div
            key={node.id}
            className="absolute transform -translate-x-1/2 -translate-y-1/2 group cursor-pointer"
            style={{ 
              left: `${node.x}%`, 
              top: `${node.y}%`,
              zIndex: 10
            }}
          >
            {/* Main Node */}
            <div className={`
              w-16 h-16 rounded-2xl flex flex-col items-center justify-center 
              border-4 transition-all duration-300 shadow-lg
              ${getNodeColor(node.status)}
              ${node.status !== 'locked' ? 'hover:-translate-y-2 hover:shadow-2xl' : ''}
            `}>
              <div className="flex items-center justify-center mb-1">
                {getNodeIcon(node.type, node.status)}
              </div>
              <div className="absolute -top-1 -right-1 w-6 h-6 bg-white rounded-full flex items-center justify-center border-2 border-gray-200">
                {getStatusIcon(node.status)}
              </div>
            </div>

            {/* Progress Bar */}
            {node.progress > 0 && (
              <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 w-20">
                <div className="bg-white rounded-full h-2 border border-gray-200 overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-green-400 to-blue-400 transition-all duration-500"
                    style={{ width: `${node.progress}%` }}
                  ></div>
                </div>
                <div className="text-xs font-bold text-center mt-1 text-gray-700">
                  {node.progress}%
                </div>
              </div>
            )}

            {/* Node Info Tooltip */}
            <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
              <div className="bg-white rounded-xl p-3 shadow-lg border-2 border-gray-100 min-w-48">
                <h4 className="font-bold text-gray-800 text-sm mb-1">{node.name}</h4>
                <p className="text-xs text-gray-600 mb-2">{node.description}</p>
                <div className="flex items-center justify-between">
                  <span className={`text-xs font-bold px-2 py-1 rounded-full ${
                    node.status === 'completed' ? 'bg-green-100 text-green-700' :
                    node.status === 'in_progress' ? 'bg-orange-100 text-orange-700' :
                    node.status === 'available' ? 'bg-blue-100 text-blue-700' :
                    'bg-gray-100 text-gray-600'
                  }`}>
                    {node.status.replace('_', ' ').toUpperCase()}
                  </span>
                  {node.progress > 0 && (
                    <span className="text-xs font-bold text-gray-700">
                      {node.progress}%
                    </span>
                  )}
                </div>
              </div>
              {/* Tooltip Arrow */}
              <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-8 border-transparent border-t-white"></div>
            </div>

            {/* Node Label */}
            <div className="absolute top-20 left-1/2 transform -translate-x-1/2 text-center">
              <div className="bg-white/90 backdrop-blur-sm rounded-lg px-2 py-1 border border-gray-200 shadow-sm">
                <div className="text-xs font-bold text-gray-700 whitespace-nowrap">
                  {node.name}
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Compass */}
        <div className="absolute top-4 right-4 w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center border-2 border-gray-200 shadow-lg">
          <Compass className="w-6 h-6 text-gray-600" />
        </div>

        {/* Legend */}
        <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 border border-gray-200 shadow-lg">
          <h4 className="text-xs font-bold text-gray-700 mb-2">LEGEND</h4>
          <div className="space-y-1">
            <div className="flex items-center text-xs">
              <div className="w-3 h-3 bg-green-400 rounded mr-2"></div>
              <span className="text-gray-600">Completed</span>
            </div>
            <div className="flex items-center text-xs">
              <div className="w-3 h-3 bg-orange-400 rounded mr-2"></div>
              <span className="text-gray-600">In Progress</span>
            </div>
            <div className="flex items-center text-xs">
              <div className="w-3 h-3 bg-blue-400 rounded mr-2"></div>
              <span className="text-gray-600">Available</span>
            </div>
            <div className="flex items-center text-xs">
              <div className="w-3 h-3 bg-gray-300 rounded mr-2"></div>
              <span className="text-gray-600">Locked</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LearningProgressTree;
