
import React from 'react';
import { useCallAnalysis } from '@/hooks/useCallAnalysis';
import { CallAnalysisCard } from './CallAnalysisCard';
import { Loader2, Phone, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const CallAnalysisPage: React.FC = () => {
  const { data: callAnalyses, isLoading, error } = useCallAnalysis();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <Card>
          <CardContent className="pt-6">
            <p className="text-red-600">Error loading call analyses: {error.message}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const totalCalls = callAnalyses?.length || 0;
  const positiveCalls = callAnalyses?.filter(
    (call: any) => call.sentiment_analysis?.overall_sentiment === 'positive'
  ).length || 0;
  const averageDuration = totalCalls > 0 
    ? Math.round((callAnalyses?.reduce((sum: number, call: any) => sum + (call.call_duration || 0), 0) || 0) / totalCalls)
    : 0;

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Call Analysis Dashboard</h1>
        <p className="text-gray-600">Review your conversation performance and insights</p>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Calls</CardTitle>
            <Phone className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCalls}</div>
            <p className="text-xs text-muted-foreground">Analyzed conversations</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Positive Sentiment</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{positiveCalls}</div>
            <p className="text-xs text-muted-foreground">
              {totalCalls > 0 ? Math.round((positiveCalls / totalCalls) * 100) : 0}% of total calls
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Duration</CardTitle>
            <Phone className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.floor(averageDuration / 60)}m {averageDuration % 60}s
            </div>
            <p className="text-xs text-muted-foreground">Average call length</p>
          </CardContent>
        </Card>
      </div>

      {/* Call Analysis Cards */}
      <div className="space-y-4">
        {callAnalyses && callAnalyses.length > 0 ? (
          callAnalyses.map((analysis: any) => (
            <CallAnalysisCard key={analysis.id} analysis={analysis} />
          ))
        ) : (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-8">
                <Phone className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Call Analyses Yet</h3>
                <p className="text-gray-600">
                  Make some practice calls to see your conversation analysis and insights here.
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};
