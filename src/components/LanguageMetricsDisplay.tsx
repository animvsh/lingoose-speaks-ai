import { Clock, BarChart3, MessageCircle, Activity, Volume2, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface LanguageMetricsData {
  words_per_minute?: number;
  speech_time_ratio?: number;
  filler_words_per_minute?: number;
  pauses_per_minute?: number;
  self_correction_rate?: number;
  speech_clarity_percent?: number;
  unique_word_count?: number;
  target_vocabulary_usage_percent?: number;
  vocabulary_diversity_score?: number;
  turn_count?: number;
  average_response_time_seconds?: number;
  silence_time_percent?: number;
  interruption_count?: number;
  total_user_speaking_time_seconds?: number;
  total_call_duration_seconds?: number;
  longest_continuous_speech_seconds?: number;
  conversation_depth_score?: number;
  engagement_level?: number;
  confidence_indicators?: any;
  pronunciation_issues?: any;
  grammar_patterns?: any;
}

interface LanguageMetricsDisplayProps {
  metrics: LanguageMetricsData | null;
  isLoading?: boolean;
}

export const LanguageMetricsDisplay = ({ metrics, isLoading }: LanguageMetricsDisplayProps) => {
  if (isLoading) {
    return (
      <div className="bg-white rounded-3xl p-6 border-4 border-gray-200">
        <div className="flex items-center mb-4">
          <div className="w-14 h-14 bg-blue-400 rounded-2xl flex items-center justify-center mr-4 animate-pulse">
            <BarChart3 className="w-7 h-7 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-800 uppercase tracking-wide">
              LANGUAGE METRICS
            </h3>
            <p className="text-gray-600 font-medium text-sm">Loading detailed analysis...</p>
          </div>
        </div>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-gray-50 rounded-2xl p-4 animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!metrics) {
    return (
      <div className="bg-white rounded-3xl p-6 border-4 border-gray-200">
        <div className="flex items-center mb-4">
          <div className="w-14 h-14 bg-blue-400 rounded-2xl flex items-center justify-center mr-4">
            <BarChart3 className="w-7 h-7 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-800 uppercase tracking-wide">
              LANGUAGE METRICS
            </h3>
            <p className="text-gray-600 font-medium text-sm">No detailed metrics available</p>
          </div>
        </div>
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <BarChart3 className="w-8 h-8 text-blue-500" />
          </div>
          <p className="text-gray-600">
            Complete a call session to see detailed language analysis metrics.
          </p>
        </div>
      </div>
    );
  }

  const formatNumber = (value?: number, decimals = 1) => {
    if (value === undefined || value === null) return 'N/A';
    return value.toFixed(decimals);
  };

  const formatTime = (seconds?: number) => {
    if (!seconds) return 'N/A';
    const mins = Math.floor(seconds / 60);
    const secs = Math.round(seconds % 60);
    return `${mins}m ${secs}s`;
  };

  const getScoreColor = (score: number, type: 'good' | 'bad') => {
    if (type === 'good') {
      if (score >= 80) return 'text-green-600';
      if (score >= 60) return 'text-yellow-600';
      return 'text-red-600';
    } else {
      if (score <= 20) return 'text-green-600';
      if (score <= 40) return 'text-yellow-600';
      return 'text-red-600';
    }
  };

  const getProgressColor = (score: number, type: 'good' | 'bad') => {
    if (type === 'good') {
      if (score >= 80) return 'bg-green-500';
      if (score >= 60) return 'bg-yellow-500';
      return 'bg-red-500';
    } else {
      if (score <= 20) return 'bg-green-500';
      if (score <= 40) return 'bg-yellow-500';
      return 'bg-red-500';
    }
  };

  return (
    <div className="bg-white rounded-3xl p-6 border-4 border-gray-200">
      <div className="flex items-center mb-6">
        <div className="w-14 h-14 bg-blue-400 rounded-2xl flex items-center justify-center mr-4">
          <BarChart3 className="w-7 h-7 text-white" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-gray-800 uppercase tracking-wide">
            LANGUAGE METRICS
          </h3>
          <p className="text-gray-600 font-medium text-sm">
            Detailed analysis of your speaking performance
          </p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Fluency Metrics */}
        <Card className="border-2 border-green-200 bg-green-50">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center text-green-800">
              <Volume2 className="w-5 h-5 mr-2" />
              Fluency & Speech
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-sm text-gray-600 mb-1">Words per Minute</div>
                <div className="text-2xl font-bold text-green-700">
                  {formatNumber(metrics.words_per_minute, 0)}
                </div>
                <div className="text-xs text-gray-500">Target: 150-180 WPM</div>
              </div>
              <div>
                <div className="text-sm text-gray-600 mb-1">Speech Time Ratio</div>
                <div className="text-2xl font-bold text-green-700">
                  {formatNumber((metrics.speech_time_ratio || 0) * 100, 0)}%
                </div>
                <div className="text-xs text-gray-500">% of time speaking</div>
              </div>
            </div>
            
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Speech Clarity</span>
                  <span className={getScoreColor(metrics.speech_clarity_percent || 0, 'good')}>
                    {formatNumber(metrics.speech_clarity_percent, 0)}%
                  </span>
                </div>
                <Progress 
                  value={metrics.speech_clarity_percent || 0} 
                  className="h-2"
                />
              </div>
              
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Filler Words/Min</span>
                  <span className={getScoreColor(metrics.filler_words_per_minute || 0, 'bad')}>
                    {formatNumber(metrics.filler_words_per_minute, 1)}
                  </span>
                </div>
                <div className="text-xs text-gray-500">Lower is better</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Vocabulary Metrics */}
        <Card className="border-2 border-purple-200 bg-purple-50">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center text-purple-800">
              <MessageCircle className="w-5 h-5 mr-2" />
              Vocabulary & Diversity
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-sm text-gray-600 mb-1">Unique Words</div>
                <div className="text-2xl font-bold text-purple-700">
                  {metrics.unique_word_count || 0}
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-600 mb-1">Target Vocab Usage</div>
                <div className="text-2xl font-bold text-purple-700">
                  {formatNumber(metrics.target_vocabulary_usage_percent, 0)}%
                </div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Vocabulary Diversity</span>
                <span className={getScoreColor(metrics.vocabulary_diversity_score || 0, 'good')}>
                  {formatNumber(metrics.vocabulary_diversity_score, 1)}
                </span>
              </div>
              <Progress 
                value={metrics.vocabulary_diversity_score || 0} 
                className="h-2"
              />
            </div>
          </CardContent>
        </Card>

        {/* Conversation Flow */}
        <Card className="border-2 border-orange-200 bg-orange-50">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center text-orange-800">
              <Activity className="w-5 h-5 mr-2" />
              Conversation Flow
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-sm text-gray-600 mb-1">Turn Count</div>
                <div className="text-2xl font-bold text-orange-700">
                  {metrics.turn_count || 0}
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-600 mb-1">Avg Response Time</div>
                <div className="text-2xl font-bold text-orange-700">
                  {formatNumber(metrics.average_response_time_seconds, 1)}s
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-sm text-gray-600 mb-1">Interruptions</div>
                <div className="text-xl font-bold text-orange-700">
                  {metrics.interruption_count || 0}
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-600 mb-1">Silence Time</div>
                <div className="text-xl font-bold text-orange-700">
                  {formatNumber((metrics.silence_time_percent || 0), 0)}%
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Timing Analysis */}
        <Card className="border-2 border-blue-200 bg-blue-50">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center text-blue-800">
              <Clock className="w-5 h-5 mr-2" />
              Timing Analysis
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Total Speaking Time</span>
                <span className="font-bold text-blue-700">
                  {formatTime(metrics.total_user_speaking_time_seconds)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Total Call Duration</span>
                <span className="font-bold text-blue-700">
                  {formatTime(metrics.total_call_duration_seconds)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Longest Continuous Speech</span>
                <span className="font-bold text-blue-700">
                  {formatTime(metrics.longest_continuous_speech_seconds)}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Engagement Metrics */}
        <Card className="border-2 border-indigo-200 bg-indigo-50">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center text-indigo-800">
              <TrendingUp className="w-5 h-5 mr-2" />
              Engagement & Quality
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-sm text-gray-600 mb-1">Conversation Depth</div>
                <div className="text-2xl font-bold text-indigo-700">
                  {metrics.conversation_depth_score || 0}/10
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-600 mb-1">Engagement Level</div>
                <div className="text-2xl font-bold text-indigo-700">
                  {metrics.engagement_level || 0}/10
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Conversation Depth</span>
                  <span>{metrics.conversation_depth_score || 0}/10</span>
                </div>
                <Progress 
                  value={(metrics.conversation_depth_score || 0) * 10} 
                  className="h-2"
                />
              </div>
              
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Engagement Level</span>
                  <span>{metrics.engagement_level || 0}/10</span>
                </div>
                <Progress 
                  value={(metrics.engagement_level || 0) * 10} 
                  className="h-2"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};