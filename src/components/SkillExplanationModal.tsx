
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, BookOpen, Target, Lightbulb, Sparkles } from "lucide-react";
import { useSkillExplanations } from "@/hooks/useSkillExplanations";
import type { Tables } from "@/integrations/supabase/types";

interface SkillExplanationModalProps {
  isOpen: boolean;
  onClose: () => void;
  skill: Tables<'skills'> | null;
}

const SkillExplanationModal = ({ isOpen, onClose, skill }: SkillExplanationModalProps) => {
  const { explanation, isLoading, generateExplanation } = useSkillExplanations(skill?.id);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerateExplanation = async () => {
    if (!skill) return;
    
    setIsGenerating(true);
    try {
      await generateExplanation.mutateAsync({
        skillId: skill.id,
        skillName: skill.name
      });
    } catch (error) {
      console.error('Failed to generate explanation:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  if (!skill) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <BookOpen className="w-6 h-6 text-purple-600" />
            {skill.name}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
              <span className="ml-2 text-gray-600">Loading explanation...</span>
            </div>
          ) : explanation ? (
            <>
              {/* Main Explanation */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Target className="w-5 h-5 text-blue-600" />
                    What is this skill?
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 leading-relaxed">{explanation.explanation}</p>
                </CardContent>
              </Card>

              {/* Use Cases */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Sparkles className="w-5 h-5 text-green-600" />
                    When to use this skill
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {Array.isArray(explanation.use_cases) && explanation.use_cases.map((useCase: any, index: number) => (
                      <div key={index} className="flex items-start gap-3">
                        <Badge variant="outline" className="mt-1 text-xs">
                          {index + 1}
                        </Badge>
                        <p className="text-gray-700">{useCase}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Examples */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <BookOpen className="w-5 h-5 text-purple-600" />
                    Examples
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {Array.isArray(explanation.examples) && explanation.examples.map((example: any, index: number) => (
                      <div key={index} className="bg-gray-50 rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge className="text-xs bg-purple-100 text-purple-800">
                            Example {index + 1}
                          </Badge>
                        </div>
                        {typeof example === 'string' ? (
                          <p className="text-gray-700">{example}</p>
                        ) : (
                          <div>
                            {example.scenario && (
                              <p className="text-gray-700 mb-2"><strong>Scenario:</strong> {example.scenario}</p>
                            )}
                            {example.example && (
                              <p className="text-gray-700"><strong>Example:</strong> {example.example}</p>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Difficulty Tips */}
              {explanation.difficulty_tips && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Lightbulb className="w-5 h-5 text-yellow-600" />
                      Tips for mastery
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700 leading-relaxed">{explanation.difficulty_tips}</p>
                  </CardContent>
                </Card>
              )}
            </>
          ) : (
            <div className="text-center py-8">
              <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-700 mb-2">
                No explanation available yet
              </h3>
              <p className="text-gray-500 mb-4">
                Generate a detailed explanation for this skill using AI
              </p>
              <Button 
                onClick={handleGenerateExplanation}
                disabled={isGenerating}
                className="bg-purple-600 hover:bg-purple-700"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 mr-2" />
                    Generate Explanation
                  </>
                )}
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SkillExplanationModal;
