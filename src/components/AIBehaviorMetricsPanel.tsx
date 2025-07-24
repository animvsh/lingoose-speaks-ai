import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Brain, TrendingUp, MessageSquare, Target, RotateCcw, Volume2, Clock, Lightbulb, ArrowLeft, Zap, AlertCircle, Sparkles } from 'lucide-react';
import { useLatestAIBehaviorMetrics, useCurrentSystemPrompt, useAIBehaviorAnalysis } from '@/hooks/useAIBehaviorMetrics';
import { ManualCallDataFetch } from '@/components/ManualCallDataFetch';
import AppBar from './AppBar';

interface AIBehaviorMetricsPanelProps {
  onNavigate?: (view: string) => void;
}

const AIBehaviorMetricsPanel = ({ onNavigate }: AIBehaviorMetricsPanelProps) => {
  const { data: latestMetrics, isLoading: metricsLoading } = useLatestAIBehaviorMetrics();
  const { data: currentPrompt, isLoading: promptLoading } = useCurrentSystemPrompt();
  const { analyzeAIBehavior, isAnalyzing } = useAIBehaviorAnalysis();

  // Sample data for demonstration
  const generateSampleData = () => {
    const sampleTranscript = `AI: Hello! I'm excited to help you practice your Hindi conversation skills today. What would you like to talk about?
User: Hi, I want to practice talking about travel and booking flights.
AI: Great choice! Travel conversations are very practical. Let me ask you - have you booked a flight recently? Can you tell me about that experience?
User: Yes, I booked a flight to Mumbai last month. It was my first time booking online.
AI: That's wonderful! Booking flights online can be tricky the first time. What was the most challenging part for you during the booking process?
User: I had trouble understanding the baggage policy and seat selection options.
AI: Those are very common concerns! Let's practice that scenario. Can you ask me questions about baggage allowance as if I'm an airline representative?
User: Um, what can I bring in my luggage?
AI: That's a good start! In Hindi, you could say "Mujhe apne samaan ke baare mein jaankaari chahiye." Can you try asking about weight limits?
User: Kitna weight allowed hai for baggage?
AI: Perfect! You're mixing Hindi and English naturally. The weight limit for domestic flights is usually 15kg for check-in baggage. Now try asking about carry-on restrictions.
User: What about hand luggage? Main kya le sakta hun?
AI: Excellent! You used "Main kya le sakta hun" perfectly. For carry-on, you can bring one bag up to 7kg. Electronics like laptops and phones are allowed, but liquids must be under 100ml.`;

    analyzeAIBehavior({
      callAnalysisId: 'sample-analysis-' + Date.now(),
      transcript: sampleTranscript
    });
  };

  if (metricsLoading || promptLoading) {
    return (
      <div className="min-h-screen hindi-bg pb-24 font-nunito">
        <AppBar title="AI Behavior Analytics" onBack={() => onNavigate?.("settings")} />
        
        <div className="px-4 pt-4 space-y-6">
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
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="h-4 bg-muted animate-pulse rounded" />
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (!latestMetrics) {
    return (
      <div className="min-h-screen hindi-bg pb-24 font-nunito">
        <AppBar title="AI Behavior Analytics" onBack={() => onNavigate?.("settings")} />
        
        <div className="px-4 pt-4 space-y-6">
          <Card className="w-full border-dashed border-2">
            <CardHeader className="text-center">
              <Brain className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <CardTitle>No AI Behavior Data Available</CardTitle>
              <CardDescription>
                Complete a practice call to see detailed AI performance metrics and OpenAI-powered insights
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center space-y-4">
                <Button 
                  onClick={generateSampleData} 
                  disabled={isAnalyzing}
                  className="w-full"
                  size="lg"
                >
                  {isAnalyzing ? (
                    <>
                      <Zap className="h-5 w-5 mr-2 animate-spin" />
                      Generating AI Analysis...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-5 w-5 mr-2" />
                      Generate Sample Analysis
                    </>
                  )}
                </Button>
                <p className="text-sm text-muted-foreground">
                  See how our AI behavior analysis works with sample conversation data
                </p>
              </div>
              
              <Separator className="my-6" />
              
              <div className="space-y-4">
                <h4 className="font-semibold flex items-center gap-2">
                  <Target className="h-4 w-4" />
                  Manual Call Analysis
                </h4>
                <ManualCallDataFetch />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
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

  const overallScore = metrics.reduce((sum, metric) => sum + (metric.value || 0), 0) / metrics.length;

  return (
    <div className="min-h-screen hindi-bg pb-24 font-nunito">
      <AppBar title="AI Behavior Analytics" onBack={() => onNavigate?.("settings")} />
      
      <div className="px-4 pt-4 space-y-6">
        {/* Overall Performance Card */}
        <Card className="w-full bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Brain className="h-5 w-5 text-blue-600" />
                AI Performance Overview
              </div>
              <Badge variant={getScoreBadge(overallScore)} className="text-lg px-3 py-1">
                {(overallScore * 100).toFixed(0)}%
              </Badge>
            </CardTitle>
            <CardDescription className="text-blue-700">
              Analysis from {new Date(latestMetrics.call_date).toLocaleDateString()} • Powered by OpenAI
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Progress value={overallScore * 100} className="h-3 mb-2" />
            <p className="text-sm text-blue-600">
              Overall AI teaching effectiveness score across all metrics
            </p>
          </CardContent>
        </Card>

        {/* Core Metrics Grid */}
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Detailed Performance Metrics</CardTitle>
            <CardDescription>
              Comprehensive analysis of AI conversation behavior patterns
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
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
          </CardContent>
        </Card>

        {/* AI-Generated Insights */}
        {latestMetrics.improvement_suggestions && latestMetrics.improvement_suggestions.length > 0 && (
          <Card className="w-full border-amber-200 bg-gradient-to-r from-amber-50 to-orange-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-amber-900">
                <Lightbulb className="h-5 w-5 text-amber-600" />
                AI-Powered Insights for Next Call
              </CardTitle>
              <CardDescription className="text-amber-700">
                Advanced OpenAI analysis suggests these specific improvements
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                {latestMetrics.improvement_suggestions.map((suggestion, index) => (
                  <Alert key={index} className="border-amber-200 bg-white/70">
                    <Sparkles className="h-4 w-4 text-amber-600" />
                    <AlertDescription className="text-amber-800 font-medium">
                      {suggestion}
                    </AlertDescription>
                  </Alert>
                ))}
              </div>
              
              <div className="mt-4 p-4 bg-gradient-to-r from-amber-100 to-orange-100 rounded-lg border border-amber-200">
                <div className="flex items-start gap-3">
                  <Brain className="h-5 w-5 text-amber-600 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-amber-900 mb-1">How These Insights Work</h4>
                    <p className="text-sm text-amber-800">
                      These recommendations are generated by analyzing your conversation patterns using GPT-4. 
                      Each insight is tailored to your specific interaction style and learning objectives.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

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
    </div>
  );
};

export default AIBehaviorMetricsPanel;