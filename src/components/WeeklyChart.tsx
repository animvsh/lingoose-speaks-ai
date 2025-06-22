
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3 } from "lucide-react";

const WeeklyChart = () => {
  const weeklyData = [
    { day: 'Mon', calls: 2, duration: 18 },
    { day: 'Tue', calls: 1, duration: 12 },
    { day: 'Wed', calls: 3, duration: 25 },
    { day: 'Thu', calls: 2, duration: 22 },
    { day: 'Fri', calls: 1, duration: 8 },
    { day: 'Sat', calls: 0, duration: 0 },
    { day: 'Sun', calls: 1, duration: 15 },
  ];

  const maxCalls = Math.max(...weeklyData.map(d => d.calls));

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-slate-800 flex items-center">
          <BarChart3 className="w-5 h-5 mr-2 text-orange-500" />
          Weekly Activity
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-end h-24 mb-4">
          {weeklyData.map((day) => (
            <div key={day.day} className="flex flex-col items-center flex-1">
              <div 
                className="w-6 bg-orange-500 rounded-t-sm mb-2 min-h-[4px]"
                style={{ 
                  height: `${(day.calls / (maxCalls || 1)) * 60}px` 
                }}
              />
              <span className="text-xs text-slate-500 font-medium">{day.day}</span>
            </div>
          ))}
        </div>
        <div className="text-center">
          <p className="text-sm text-slate-600">This week: 10 calls • 100 minutes</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default WeeklyChart;
