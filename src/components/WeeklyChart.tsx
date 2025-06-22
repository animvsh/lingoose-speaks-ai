
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3 } from "lucide-react";

const WeeklyChart = () => {
  const weeklyData = [
    { day: 'Mon', calls: 0, duration: 0 },
    { day: 'Tue', calls: 0, duration: 0 },
    { day: 'Wed', calls: 0, duration: 0 },
    { day: 'Thu', calls: 0, duration: 0 },
    { day: 'Fri', calls: 0, duration: 0 },
    { day: 'Sat', calls: 0, duration: 0 },
    { day: 'Sun', calls: 0, duration: 0 },
  ];

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
                  className="w-6 bg-gray-300 border-2 border-gray-400 rounded-t-lg mb-2 min-h-[4px]"
                  style={{ height: '4px' }}
                />
                <span className="text-xs text-blue-800 font-black uppercase">{day.day}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="text-center">
          <p className="text-blue-900 font-black text-sm uppercase">This week: N/A calls • N/A minutes</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default WeeklyChart;
