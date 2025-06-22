
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Phone, Clock, TrendingUp, MessageSquare, BarChart3 } from "lucide-react";

interface CallAnalysisData {
  id: string;
  vapi_call_id: string;
  call_duration: number;
  call_status: string;
  sentiment_analysis: {
    overall_sentiment: string;
    positive_score: number;
    negative_score: number;
    confidence: number;
  };
  performance_metrics: {
    call_duration_seconds: number;
    transcript_length: number;
    call_quality: string;
  };
  extracted_insights: {
    user_satisfaction: string;
    call_summary: string;
  };
  call_started_at: string;
  transcript: string;
}

interface CallAnalysisCardProps {
  analysis: CallAnalysisData;
}

export const CallAnalysisCard: React.FC<CallAnalysisCardProps> = ({ analysis }) => {
  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return 'bg-green-500';
      case 'negative': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getSatisfactionColor = (satisfaction: string) => {
    switch (satisfaction) {
      case 'high': return 'bg-green-100 text-green-800';
      case 'low': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Phone className="h-5 w-5" />
            Call Analysis
          </CardTitle>
          <Badge variant="outline">
            {analysis.call_status}
          </Badge>
        </div>
        <CardDescription>
          {new Date(analysis.call_started_at).toLocaleDateString()} at{' '}
          {new Date(analysis.call_started_at).toLocaleTimeString()}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Call Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-gray-500" />
            <div>
              <p className="text-sm text-gray-600">Duration</p>
              <p className="font-semibold">
                {formatDuration(analysis.call_duration || 0)}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4 text-gray-500" />
            <div>
              <p className="text-sm text-gray-600">Transcript Length</p>
              <p className="font-semibold">
                {analysis.performance_metrics?.transcript_length || 0} chars
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-gray-500" />
            <div>
              <p className="text-sm text-gray-600">Sentiment</p>
              <Badge className={getSentimentColor(analysis.sentiment_analysis?.overall_sentiment || 'neutral')}>
                {analysis.sentiment_analysis?.overall_sentiment || 'neutral'}
              </Badge>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4 text-gray-500" />
            <div>
              <p className="text-sm text-gray-600">Satisfaction</p>
              <Badge className={getSatisfactionColor(analysis.extracted_insights?.user_satisfaction || 'medium')}>
                {analysis.extracted_insights?.user_satisfaction || 'medium'}
              </Badge>
            </div>
          </div>
        </div>

        {/* Sentiment Analysis Details */}
        {analysis.sentiment_analysis && (
          <div className="space-y-2">
            <h4 className="font-semibold text-sm">Sentiment Analysis</h4>
            <div className="flex gap-4 text-sm">
              <span className="flex items-center gap-1">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                Positive: {analysis.sentiment_analysis.positive_score}
              </span>
              <span className="flex items-center gap-1">
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                Negative: {analysis.sentiment_analysis.negative_score}
              </span>
              <span className="text-gray-600">
                Confidence: {Math.round((analysis.sentiment_analysis.confidence || 0) * 100)}%
              </span>
            </div>
          </div>
        )}

        {/* Call Summary */}
        {analysis.extracted_insights?.call_summary && (
          <div className="space-y-2">
            <h4 className="font-semibold text-sm">Call Summary</h4>
            <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-md">
              {analysis.extracted_insights.call_summary}
            </p>
          </div>
        )}

        {/* Full Transcript (collapsible) */}
        {analysis.transcript && (
          <details className="space-y-2">
            <summary className="font-semibold text-sm cursor-pointer hover:text-blue-600">
              View Full Transcript
            </summary>
            <div className="text-sm text-gray-700 bg-gray-50 p-3 rounded-md max-h-40 overflow-y-auto">
              {analysis.transcript}
            </div>
          </details>
        )}
      </CardContent>
    </Card>
  );
};
