
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
    <Card className="mb-6 bg-blue-300 border-4 border-blue-600 rounded-2xl overflow-hidden transform hover:-rotate-1 transition-transform duration-200">
      <CardHeader>
        <CardTitle className="text-xl font-black text-blue-900 uppercase tracking-wide flex items-center">
          <div className="w-10 h-10 bg-blue-600 border-3 border-blue-800 rounded-xl flex items-center justify-center mr-3">
            <BarChart3 className="w-5 h-5 text-white" />
          </div>
          Weekly Activity
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="bg-white border-3 border-blue-500 rounded-xl p-4 mb-4">
          <div className="flex justify-between items-end h-24 mb-4">
            {weeklyData.map((day) => (
              <div key={day.day} className="flex flex-col items-center flex-1">
                <div 
                  className="w-6 bg-blue-500 border-2 border-blue-700 rounded-t-lg mb-2 min-h-[4px] transition-all duration-300 hover:bg-blue-600"
                  style={{ 
                    height: `${(day.calls / (maxCalls || 1)) * 60}px` 
                  }}
                />
                <span className="text-xs text-blue-800 font-black uppercase">{day.day}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="text-center">
          <p className="text-blue-900 font-black text-sm uppercase">This week: 10 calls • 100 minutes</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default WeeklyChart;
