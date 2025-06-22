
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Target, Trophy } from "lucide-react";

const GoalProgress = () => {
  const goals = [
    {
      title: 'Monthly Call Goal',
      current: 14,
      target: 20,
      unit: 'calls',
      bgColor: 'bg-orange-400',
      borderColor: 'border-orange-600'
    },
    {
      title: 'Speaking Time',
      current: 85,
      target: 120,
      unit: 'minutes',
      bgColor: 'bg-blue-400',
      borderColor: 'border-blue-600'
    },
    {
      title: 'New Words Learned',
      current: 23,
      target: 30,
      unit: 'words',
      bgColor: 'bg-green-400',
      borderColor: 'border-green-600'
    }
  ];

  return (
    <Card className="mb-6 bg-teal-300 border-4 border-teal-600 rounded-2xl overflow-hidden transform hover:-rotate-1 transition-transform duration-200">
      <CardHeader>
        <CardTitle className="text-xl font-black text-teal-900 uppercase tracking-wide flex items-center">
          <div className="w-10 h-10 bg-teal-600 border-3 border-teal-800 rounded-xl flex items-center justify-center mr-3">
            <Target className="w-5 h-5 text-white" />
          </div>
          This Month's Goals
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {goals.map((goal, index) => {
          const percentage = Math.min((goal.current / goal.target) * 100, 100);
          
          return (
            <div key={index} className="bg-white border-3 border-teal-500 rounded-xl p-4 transform hover:scale-105 transition-transform duration-200">
              <div className="flex justify-between items-center mb-3">
                <span className="text-sm font-black text-teal-900 uppercase tracking-wide">{goal.title}</span>
                <span className="text-sm text-teal-800 font-bold bg-teal-100 px-3 py-1 rounded-full border-2 border-teal-400">
                  {goal.current}/{goal.target} {goal.unit}
                </span>
              </div>
              <div className="w-full bg-teal-200 h-4 rounded-full overflow-hidden border-2 border-teal-400">
                <div 
                  className={`h-full rounded-full transition-all duration-500 ${goal.bgColor} border-r-2 ${goal.borderColor}`}
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
};

export default GoalProgress;
