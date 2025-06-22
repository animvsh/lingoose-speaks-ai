
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
      bgColor: 'bg-orange-300',
      borderColor: 'border-orange-600',
      iconBg: 'bg-orange-600',
      iconBorder: 'border-orange-800',
      textColor: 'text-orange-900'
    },
    {
      id: 2,
      type: 'success',
      title: 'Grammar Victory!',
      message: 'Perfect use of past tense in yesterday\'s conversation!',
      timestamp: '1 day ago',
      icon: CheckCircle,
      bgColor: 'bg-green-300',
      borderColor: 'border-green-600',
      iconBg: 'bg-green-600',
      iconBorder: 'border-green-800',
      textColor: 'text-green-900'
    },
    {
      id: 3,
      type: 'tip',
      title: 'Cultural Context',
      message: 'Great question about "जी" - it shows respect in Hindi!',
      timestamp: '2 days ago',
      icon: Star,
      bgColor: 'bg-purple-300',
      borderColor: 'border-purple-600',
      iconBg: 'bg-purple-600',
      iconBorder: 'border-purple-800',
      textColor: 'text-purple-900'
    }
  ];

  return (
    <Card className="mb-6 bg-pink-300 border-4 border-pink-600 rounded-2xl overflow-hidden transform hover:rotate-1 transition-transform duration-200">
      <CardHeader>
        <CardTitle className="text-xl font-black text-pink-900 uppercase tracking-wide flex items-center">
          <div className="w-10 h-10 bg-pink-600 border-3 border-pink-800 rounded-xl flex items-center justify-center mr-3">
            <MessageSquare className="w-5 h-5 text-white" />
          </div>
          Recent Feedback
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {feedbackItems.map((item) => {
          const IconComponent = item.icon;
          
          return (
            <div key={item.id} className={`${item.bgColor} border-3 ${item.borderColor} rounded-xl p-4 transform hover:scale-105 transition-transform duration-200`}>
              <div className="flex space-x-3">
                <div className={`w-10 h-10 ${item.iconBg} border-2 ${item.iconBorder} rounded-xl flex items-center justify-center`}>
                  <IconComponent className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-black ${item.textColor} uppercase tracking-wide`}>{item.title}</p>
                  <p className={`text-sm ${item.textColor} font-bold mt-1`}>{item.message}</p>
                  <p className={`text-xs ${item.textColor} font-bold mt-2 opacity-70`}>{item.timestamp}</p>
                </div>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
};

export default RecentFeedback;
