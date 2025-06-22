
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageSquare, Star, AlertCircle, CheckCircle } from "lucide-react";

const RecentFeedback = () => {
  const feedbackItems = [
    {
      id: 1,
      type: 'improvement',
      title: 'Pronunciation Practice',
      message: 'Try emphasizing the "र" sound in "करना" - roll that R!',
      timestamp: '2 hours ago',
      icon: AlertCircle,
      color: 'orange'
    },
    {
      id: 2,
      type: 'success',
      title: 'Grammar Victory!',
      message: 'Perfect use of past tense in yesterday\'s conversation!',
      timestamp: '1 day ago',
      icon: CheckCircle,
      color: 'green'
    },
    {
      id: 3,
      type: 'tip',
      title: 'Cultural Context',
      message: 'Great question about "जी" - it shows respect in Hindi!',
      timestamp: '2 days ago',
      icon: Star,
      color: 'blue'
    }
  ];

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-slate-800 flex items-center">
          <MessageSquare className="w-5 h-5 mr-2 text-orange-500" />
          Recent Feedback
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {feedbackItems.map((item) => {
          const IconComponent = item.icon;
          const colorClasses = {
            orange: 'text-orange-500 bg-orange-50',
            green: 'text-green-500 bg-green-50',
            blue: 'text-blue-500 bg-blue-50'
          };
          
          return (
            <div key={item.id} className="flex space-x-3">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${colorClasses[item.color as keyof typeof colorClasses]}`}>
                <IconComponent className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-800">{item.title}</p>
                <p className="text-sm text-slate-600 mt-1">{item.message}</p>
                <p className="text-xs text-slate-400 mt-2">{item.timestamp}</p>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
};

export default RecentFeedback;
