import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, Save, RotateCcw, Sparkles } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useSystemPromptTemplate, useUpdateSystemPromptTemplate, useCreateSystemPromptTemplate } from '@/hooks/useSystemPromptTemplate';

const DEFAULT_TEMPLATE = `[🧠 Identity]  
You are a friendly and supportive **AI language coach** helping a learner practice **{{language}}** through voice-based conversations.

[🎯 Objectives]  
Your main goals in every call are:
1. Encourage the learner using simple, motivating language.
2. Guide them through real conversational practice on **'{{topic}}'**.
3. Gently correct or rephrase when they make mistakes — always kindly.

[🗣️ Tone & Style]  
- Keep the tone **warm, patient, and encouraging**.  
- Use **simple vocabulary and short sentences**, as if talking to a beginner.  
- Smile with your words :)  

[📋 Response Guidelines]
In every session, follow this structure:

**1. Introduction in English:**  
- Greet the user and introduce yourself.
- Mention today's topic: **'{{topic}}'**.
- Remind them of any prior context or progress ({{last_summary}} if available).

**2. Switch to {{language}}:**  
- After the intro, speak entirely in **{{language}}**, using beginner-level words and sentences.  
- Slow your pace. Repeat ideas if needed.

**3. Keep it interactive:**  
- Ask 1–2 open-ended questions.
- Listen patiently. Respond with encouragement.  
- Add quick corrections **in {{language}}**, either by rephrasing or modeling better sentences.

**4. Stick to the topic:**  
- Stay focused on **'{{topic}}'** unless the user changes it.
- Don't introduce unrelated ideas or new vocabulary.

[🛟 Error Handling & Confusion]  
If the user seems confused, lost, or gives a short reply:
- Pause briefly, then ask a simpler question.
- Reassure them: "That's okay! Let's try again together."

[🧾 Call Closure]  
- Wrap up in **{{language}}** with a brief compliment or recap.  
- End the call by logging a short summary (max 1 sentence) of what was practiced.`;

export const SystemPromptTemplateEditor: React.FC = () => {
  const { data: template, isLoading } = useSystemPromptTemplate();
  const updateTemplate = useUpdateSystemPromptTemplate();
  const createTemplate = useCreateSystemPromptTemplate();
  
  const [templateContent, setTemplateContent] = useState(DEFAULT_TEMPLATE);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    if (template) {
      setTemplateContent(template.template_content);
      setHasChanges(false);
    }
  }, [template]);

  const handleContentChange = (value: string) => {
    setTemplateContent(value);
    setHasChanges(value !== (template?.template_content || DEFAULT_TEMPLATE));
  };

  const handleSave = () => {
    if (template) {
      updateTemplate.mutate({ templateContent });
    } else {
      createTemplate.mutate({ templateContent });
    }
    setHasChanges(false);
  };

  const handleReset = () => {
    setTemplateContent(template?.template_content || DEFAULT_TEMPLATE);
    setHasChanges(false);
  };

  const placeholders = [
    '{{language}}',
    '{{topic}}', 
    '{{last_summary}}',
    '{{headerz}}',
    '{{prompz}}'
  ];

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <div className="text-sm text-muted-foreground">Loading template...</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            System Prompt Template
          </CardTitle>
          <CardDescription>
            This template is used to construct the system prompt for every VAPI call. 
            The AI will continuously improve this prompt based on conversation analysis.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <strong>Available Placeholders:</strong> {placeholders.map((placeholder) => (
                <Badge key={placeholder} variant="secondary" className="ml-1">
                  {placeholder}
                </Badge>
              ))}
            </AlertDescription>
          </Alert>

          <div className="space-y-3">
            <label className="text-sm font-medium">Template Content:</label>
            <Textarea
              value={templateContent}
              onChange={(e) => handleContentChange(e.target.value)}
              placeholder="Enter your system prompt template..."
              className="min-h-[400px] font-mono text-sm"
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="text-xs text-muted-foreground">
              {template && `Last updated: ${new Date(template.updated_at).toLocaleString()}`}
            </div>
            
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleReset}
                disabled={!hasChanges}
              >
                <RotateCcw className="h-4 w-4 mr-2" />
                Reset
              </Button>
              
              <Button
                onClick={handleSave}
                disabled={!hasChanges || updateTemplate.isPending || createTemplate.isPending}
                size="sm"
              >
                <Save className="h-4 w-4 mr-2" />
                {updateTemplate.isPending || createTemplate.isPending ? 'Saving...' : 'Save Template'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm">How It Works</CardTitle>
        </CardHeader>
        <CardContent className="text-sm space-y-2">
          <div>• <strong>{'{{language}}'}:</strong> Replaced with user's target language</div>
          <div>• <strong>{'{{topic}}'}:</strong> Replaced with current conversation topic</div>
          <div>• <strong>{'{{last_summary}}'}:</strong> Replaced with previous conversation summary</div>
          <div>• <strong>{'{{headerz}}'}:</strong> Used for VAPI first message</div>
          <div>• <strong>{'{{prompz}}'}:</strong> Used for VAPI system prompt</div>
          <div className="pt-2 text-xs text-muted-foreground">
            The AI automatically evolves this template based on conversation analysis to improve learning outcomes.
          </div>
        </CardContent>
      </Card>
    </div>
  );
};