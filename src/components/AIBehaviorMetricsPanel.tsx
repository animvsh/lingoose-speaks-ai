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
    // Show empty state with all metrics displayed as N/A
    const emptyMetrics = [
      {
        name: 'Instruction Adherence',
        value: null,
        icon: Target,
        description: 'How well AI follows system prompt rules',
        status: 'No data available'
      },
      {
        name: 'Question Density',
        value: null,
        icon: MessageSquare,
        description: 'Frequency of engaging questions',
        status: 'No data available'
      },
      {
        name: 'Continuity Score',
        value: null,
        icon: TrendingUp,
        description: 'Topic consistency across responses',
        status: 'No data available'
      },
      {
        name: 'Follow-up Quality',
        value: null,
        icon: RotateCcw,
        description: 'Context-aware response quality',
        status: 'No data available'
      },
      {
        name: 'Tone Consistency',
        value: null,
        icon: Volume2,
        description: 'Emotional tone stability',
        status: 'No data available'
      },
      {
        name: 'Recovery Score',
        value: null,
        icon: Clock,
        description: 'Handling of user silence/short replies',
        status: 'No data available'
      }
    ];

    return (
      <div className="min-h-screen hindi-bg pb-24 font-nunito">
        <AppBar title="AI Behavior Analytics" onBack={() => onNavigate?.("settings")} />
        
        <div className="px-4 pt-4 space-y-6">
          {/* All Metrics Display - Even When Empty */}
          <Card className="w-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5" />
                AI Behavior Metrics (All Tracked Fields)
              </CardTitle>
              <CardDescription>
                Complete overview of all metrics being monitored - generate data to see actual values
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Core Metrics Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {emptyMetrics.map((metric) => {
                  const Icon = metric.icon;
                  return (
                    <div key={metric.name} className="p-4 border rounded-lg space-y-3 bg-muted/30">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Icon className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium text-sm">{metric.name}</span>
                        </div>
                        <Badge variant="outline" className="text-muted-foreground">
                          N/A
                        </Badge>
                      </div>
                      <Progress value={0} className="h-2 opacity-50" />
                      <p className="text-xs text-muted-foreground">{metric.description}</p>
                      <p className="text-xs text-amber-600 font-medium">{metric.status}</p>
                    </div>
                  );
                })}
              </div>

              {/* Special Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 border rounded-lg bg-muted/30">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-sm">Vocabulary Usage Rate</span>
                    <Badge variant="outline" className="text-muted-foreground">N/A</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">Target words included in responses</p>
                </div>
                
                <div className="p-4 border rounded-lg bg-muted/30">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-sm">Callback Usage</span>
                    <Badge variant="outline" className="text-muted-foreground">N/A</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">References to earlier conversation</p>
                </div>

                <div className="p-4 border rounded-lg bg-muted/30">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-sm">User Fluency Delta</span>
                    <Badge variant="outline" className="text-muted-foreground">N/A</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">User improvement during conversation</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* System Prompt Improvement Guide */}
          <Card className="w-full border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-blue-900">
                <Lightbulb className="h-5 w-5 text-blue-600" />
                How to Improve Your AI System Prompt
              </CardTitle>
              <CardDescription className="text-blue-700">
                Guidelines for making your AI more engaging and effective
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Alert className="border-blue-200 bg-white/70">
                  <MessageSquare className="h-4 w-4 text-blue-600" />
                  <AlertDescription className="text-blue-800">
                    <strong>Increase Question Density:</strong> Add "Ask follow-up questions every 2-3 responses" to your prompt
                  </AlertDescription>
                </Alert>
                
                <Alert className="border-green-200 bg-green-50/70">
                  <Sparkles className="h-4 w-4 text-green-600" />
                  <AlertDescription className="text-green-800">
                    <strong>Make It Fun:</strong> Include "Use humor, emojis, and cultural references to keep conversations engaging"
                  </AlertDescription>
                </Alert>
                
                <Alert className="border-purple-200 bg-purple-50/70">
                  <Target className="h-4 w-4 text-purple-600" />
                  <AlertDescription className="text-purple-800">
                    <strong>Target Vocabulary:</strong> "Naturally incorporate these words: [travel, booking, luggage, flight, etc.]"
                  </AlertDescription>
                </Alert>
                
                <Alert className="border-orange-200 bg-orange-50/70">
                  <RotateCcw className="h-4 w-4 text-orange-600" />
                  <AlertDescription className="text-orange-800">
                    <strong>Recovery Strategies:</strong> "When users give short replies, ask 'Can you tell me more about...' or 'What do you think about..?'"
                  </AlertDescription>
                </Alert>
              </div>
              
              <div className="mt-6 p-4 bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg border border-purple-200">
                <h4 className="font-semibold text-purple-900 mb-2 flex items-center gap-2">
                  <Sparkles className="h-4 w-4" />
                  Sample Fun System Prompt Enhancement:
                </h4>
                <pre className="text-sm text-purple-800 whitespace-pre-wrap bg-white/50 p-3 rounded border">
{`"You are an enthusiastic Hindi conversation teacher! 🎉

PERSONALITY:
- Be warm, encouraging, and slightly playful
- Use emojis occasionally (✈️🎒🗣️)
- Celebrate small wins: "Great job!" "Perfect!"
- Reference popular culture when relevant

ENGAGEMENT RULES:
- Ask a follow-up question every 2-3 responses
- If user gives short reply, ask "Tell me more about..." 
- Use scenarios: "Imagine you're at the airport..."
- Mix Hindi and English naturally like real conversations

VOCABULARY FOCUS:
- Naturally include: ticket, flight, booking, luggage, passenger
- Don't force it - make it conversational
- Praise when they use target words

RECOVERY TACTICS:
- Short reply? → Ask opinion or expand scenario
- Silence? → "What would you say if..." 
- Mistake? → Gentle correction + encouragement"`}
                </pre>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="w-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5" />
                Quick Actions
              </CardTitle>
              <CardDescription>
                Generate sample data or manually analyze a call
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button 
                  onClick={generateSampleData} 
                  disabled={isAnalyzing}
                  className="w-full h-16 text-left flex-col items-start justify-center"
                  size="lg"
                >
                  {isAnalyzing ? (
                    <>
                      <Zap className="h-5 w-5 animate-spin mb-1" />
                      <span className="text-sm">Generating Analysis...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-5 w-5 mb-1" />
                      <span className="font-semibold">Generate Sample Data</span>
                      <span className="text-xs opacity-80">See how metrics work with sample conversation</span>
                    </>
                  )}
                </Button>
                
                <div className="p-4 border rounded-lg">
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <Target className="h-4 w-4" />
                    Manual Analysis
                  </h4>
                  <ManualCallDataFetch />
                </div>
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

        {/* AI-Powered System Evolution */}
        {latestMetrics.improvement_suggestions && latestMetrics.improvement_suggestions.length > 0 && (
          <Card className="w-full border-emerald-200 bg-gradient-to-r from-emerald-50 to-green-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-emerald-900">
                <Brain className="h-5 w-5 text-emerald-600" />
                AI System Evolution in Progress
              </CardTitle>
              <CardDescription className="text-emerald-700">
                Your AI is learning and adapting! Here's how your system prompt evolved based on conversation analysis:
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                {latestMetrics.improvement_suggestions.map((suggestion, index) => (
                  <Alert key={index} className="border-emerald-200 bg-white/70">
                    <Sparkles className="h-4 w-4 text-emerald-600" />
                    <AlertDescription className="text-emerald-800">
                      <div className="space-y-1">
                        <div className="font-medium">Evolution #{index + 1}:</div>
                        <div className="text-sm">{suggestion}</div>
                      </div>
                    </AlertDescription>
                  </Alert>
                ))}
              </div>
              
              <div className="mt-4 p-4 bg-gradient-to-r from-emerald-100 to-green-100 rounded-lg border border-emerald-200">
                <div className="flex items-start gap-3">
                  <TrendingUp className="h-5 w-5 text-emerald-600 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-emerald-900 mb-1">🚀 How Your AI Is Getting Better</h4>
                    <p className="text-sm text-emerald-800 mb-3">
                      Each conversation is analyzed by GPT-4 to identify patterns and generate specific improvements. 
                      These insights are automatically integrated into your system prompt, making your AI more engaging for the next user.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                      <div className="bg-white/50 p-2 rounded border">
                        <strong>📊 Pattern Analysis:</strong> Conversation flow, question frequency, vocabulary usage
                      </div>
                      <div className="bg-white/50 p-2 rounded border">
                        <strong>🎯 Targeted Improvements:</strong> Specific phrases and techniques that work for this user
                      </div>
                      <div className="bg-white/50 p-2 rounded border">
                        <strong>🔄 Automatic Evolution:</strong> System prompt updates based on real performance data
                      </div>
                      <div className="bg-white/50 p-2 rounded border">
                        <strong>🎉 Engagement Boost:</strong> Cultural references, emojis, and personality enhancements
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Enhanced Current System Prompt Display */}
        {currentPrompt && (
          <Card className="w-full border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-blue-900">
                <MessageSquare className="h-5 w-5 text-blue-600" />
                Current Evolved VAPI System Prompt
              </CardTitle>
              <CardDescription className="text-blue-700">
                🧬 This prompt has evolved {currentPrompt.evolution_reason ? 'through AI analysis' : 'based on your conversations'} • Last updated: {new Date(currentPrompt.created_at).toLocaleDateString()}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-white/70 rounded-lg border border-blue-200">
                  <pre className="text-sm whitespace-pre-wrap font-mono text-blue-900">
                    {currentPrompt.current_prompt}
                  </pre>
                </div>
                
                {currentPrompt.improvement_rationale && (
                  <div className="space-y-2">
                    <h4 className="font-medium text-sm text-blue-900 flex items-center gap-2">
                      <Sparkles className="h-4 w-4" />
                      Latest AI-Driven Evolution
                    </h4>
                    <div className="p-3 bg-blue-100/70 rounded border border-blue-200">
                      <p className="text-sm text-blue-800">
                        <strong>Changes:</strong> {currentPrompt.improvement_rationale}
                      </p>
                      {currentPrompt.evolution_reason && (
                        <p className="text-xs text-blue-600 mt-2">
                          <strong>How it evolved:</strong> {currentPrompt.evolution_reason}
                        </p>
                      )}
                    </div>
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