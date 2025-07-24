import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Brain, TrendingUp, MessageSquare, Target, RotateCcw, Volume2, Clock, Lightbulb } from 'lucide-react';
import { useLatestAIBehaviorMetrics, useCurrentSystemPrompt } from '@/hooks/useAIBehaviorMetrics';

const AIBehaviorMetricsPanel = () => {
  const { data: latestMetrics, isLoading: metricsLoading } = useLatestAIBehaviorMetrics();
  const { data: currentPrompt, isLoading: promptLoading } = useCurrentSystemPrompt();

  if (metricsLoading || promptLoading) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            AI Behavior Analysis
          </CardTitle>
          <CardDescription>Loading performance metrics...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-4 bg-muted animate-pulse rounded" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!latestMetrics) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            AI Behavior Analysis
          </CardTitle>
          <CardDescription>No metrics available yet</CardDescription>
        </CardHeader>
        <CardContent>
          <Alert>
            <Lightbulb className="h-4 w-4" />
            <AlertDescription>
              Complete a practice call to see AI behavior analysis and improvement suggestions.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  const metrics = [
    {
      name: 'Instruction Adherence',
      value: latestMetrics.instruction_adherence,
      icon: Target,
      description: 'How well AI follows system prompt rules'
    },
    {
      name: 'Question Density',
      value: latestMetrics.question_density,
      icon: MessageSquare,
      description: 'Frequency of engaging questions'
    },
    {
      name: 'Continuity Score',
      value: latestMetrics.continuity_score,
      icon: TrendingUp,
      description: 'Topic consistency across responses'
    },
    {
      name: 'Follow-up Quality',
      value: latestMetrics.followup_quality,
      icon: RotateCcw,
      description: 'Context-aware response quality'
    },
    {
      name: 'Tone Consistency',
      value: latestMetrics.tone_consistency,
      icon: Volume2,
      description: 'Emotional tone stability'
    },
    {
      name: 'Recovery Score',
      value: latestMetrics.recovery_score,
      icon: Clock,
      description: 'Handling of user silence/short replies'
    }
  ];

  const getScoreColor = (score: number) => {
    if (score >= 0.8) return 'text-green-600';
    if (score >= 0.6) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBadge = (score: number) => {
    if (score >= 0.8) return 'default';
    if (score >= 0.6) return 'secondary';
    return 'destructive';
  };

  return (
    <div className="space-y-6">
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            AI Behavior Analysis
          </CardTitle>
          <CardDescription>
            Latest performance metrics from {new Date(latestMetrics.call_date).toLocaleDateString()}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Core Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {metrics.map((metric) => {
              const Icon = metric.icon;
              const score = metric.value || 0;
              return (
                <div key={metric.name} className="p-4 border rounded-lg space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Icon className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium text-sm">{metric.name}</span>
                    </div>
                    <Badge variant={getScoreBadge(score)}>
                      {(score * 100).toFixed(0)}%
                    </Badge>
                  </div>
                  <Progress value={score * 100} className="h-2" />
                  <p className="text-xs text-muted-foreground">{metric.description}</p>
                </div>
              );
            })}
          </div>

          {/* Special Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 border rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-sm">Vocabulary Usage</span>
                <Badge variant="outline">
                  {(latestMetrics.target_vocab_prompt_rate * 100).toFixed(0)}%
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground">Target words included in responses</p>
            </div>
            
            <div className="p-4 border rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-sm">Callback Usage</span>
                <Badge variant="outline">
                  {latestMetrics.callback_usage} references
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground">References to earlier conversation</p>
            </div>
          </div>

          {/* Improvement Suggestions */}
          {latestMetrics.improvement_suggestions && latestMetrics.improvement_suggestions.length > 0 && (
            <>
              <Separator />
              <div className="space-y-3">
                <h3 className="font-semibold text-sm flex items-center gap-2">
                  <Lightbulb className="h-4 w-4" />
                  Improvement Suggestions
                </h3>
                <div className="space-y-2">
                  {latestMetrics.improvement_suggestions.map((suggestion, index) => (
                    <Alert key={index}>
                      <AlertDescription className="text-sm">
                        {suggestion}
                      </AlertDescription>
                    </Alert>
                  ))}
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Current System Prompt */}
      {currentPrompt && (
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              Current VAPI System Prompt
            </CardTitle>
            <CardDescription>
              Active prompt updated on {new Date(currentPrompt.created_at).toLocaleDateString()}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 bg-muted rounded-lg">
                <pre className="text-sm whitespace-pre-wrap font-mono">
                  {currentPrompt.current_prompt}
                </pre>
              </div>
              
              {currentPrompt.improvement_rationale && (
                <div className="space-y-2">
                  <h4 className="font-medium text-sm">Latest Changes</h4>
                  <p className="text-sm text-muted-foreground">
                    {currentPrompt.improvement_rationale}
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AIBehaviorMetricsPanel;