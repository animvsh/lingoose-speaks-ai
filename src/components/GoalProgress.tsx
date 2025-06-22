
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Target, Trophy } from "lucide-react";

const GoalProgress = () => {
  const goals = [
    {
      title: 'Monthly Call Goal',
      current: 14,
      target: 20,
      unit: 'calls',
      color: 'orange'
    },
    {
      title: 'Speaking Time',
      current: 85,
      target: 120,
      unit: 'minutes',
      color: 'blue'
    },
    {
      title: 'New Words Learned',
      current: 23,
      target: 30,
      unit: 'words',
      color: 'green'
    }
  ];

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-slate-800 flex items-center">
          <Target className="w-5 h-5 mr-2 text-orange-500" />
          This Month's Goals
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {goals.map((goal, index) => {
          const percentage = Math.min((goal.current / goal.target) * 100, 100);
          const colorClasses = {
            orange: 'bg-orange-500',
            blue: 'bg-blue-500',
            green: 'bg-green-500'
          };
          
          return (
            <div key={index}>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-slate-700">{goal.title}</span>
                <span className="text-sm text-slate-500">
                  {goal.current}/{goal.target} {goal.unit}
                </span>
              </div>
              <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                <div 
                  className={`h-2 rounded-full transition-all duration-500 ${colorClasses[goal.color as keyof typeof colorClasses]}`}
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
