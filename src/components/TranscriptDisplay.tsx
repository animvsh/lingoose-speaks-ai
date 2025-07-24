import React from 'react';
import { MessageSquare, User, Bot, Clock, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface SpeakerTurn {
  speaker: string;
  text: string;
  timestamp: number;
}

interface ProcessedTranscript {
  formatted_transcript: string;
  speaker_turns: SpeakerTurn[];
  processing_method: 'existing_labels' | 'heuristic_analysis';
}

interface TranscriptDisplayProps {
  callAnalysis: any;
  className?: string;
}

export const TranscriptDisplay: React.FC<TranscriptDisplayProps> = ({ 
  callAnalysis, 
  className = "" 
}) => {
  if (!callAnalysis) {
    return (
      <Card className={`${className} border-4 border-gray-200`}>
        <CardHeader>
          <CardTitle className="flex items-center text-lg font-bold text-gray-800 uppercase tracking-wide">
            <MessageSquare className="w-6 h-6 mr-3 text-blue-500" />
            CONVERSATION TRANSCRIPT
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center text-gray-500 py-8">
            <MessageSquare className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p className="font-medium">No call data available</p>
            <p className="text-sm">Complete a practice call to see your conversation here</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const processedTranscript = (callAnalysis.extracted_insights as any)?.processed_transcript as ProcessedTranscript;
  const rawTranscript = callAnalysis.transcript;

  const renderSpeakerTurns = (turns: SpeakerTurn[]) => {
    return turns.map((turn, index) => (
      <div key={index} className="mb-4 last:mb-0">
        <div className="flex items-start space-x-3">
          <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
            turn.speaker.toLowerCase().includes('user') 
              ? 'bg-blue-100 text-blue-600' 
              : 'bg-green-100 text-green-600'
          }`}>
            {turn.speaker.toLowerCase().includes('user') ? (
              <User className="w-4 h-4" />
            ) : (
              <Bot className="w-4 h-4" />
            )}
          </div>
          
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-1">
              <span className={`text-sm font-bold uppercase tracking-wide ${
                turn.speaker.toLowerCase().includes('user') 
                  ? 'text-blue-700' 
                  : 'text-green-700'
              }`}>
                {turn.speaker}
              </span>
              <span className="text-xs text-gray-500">
                <Clock className="w-3 h-3 inline mr-1" />
                Turn {turn.timestamp + 1}
              </span>
            </div>
            
            <div className={`p-3 rounded-2xl ${
              turn.speaker.toLowerCase().includes('user') 
                ? 'bg-blue-50 text-blue-900' 
                : 'bg-green-50 text-green-900'
            }`}>
              <p className="text-sm font-medium leading-relaxed">
                {turn.text.trim()}
              </p>
            </div>
          </div>
        </div>
      </div>
    ));
  };

  const renderRawTranscript = () => {
    // Try to parse raw transcript for any existing speaker labels
    const lines = rawTranscript.split('\n').filter((line: string) => line.trim());
    
    if (lines.some((line: string) => line.includes(':') && (line.includes('User') || line.includes('Assistant')))) {
      // Raw transcript has some speaker identification
      return lines.map((line: string, index: number) => {
        const speakerMatch = line.match(/^(User|Assistant|Speaker \d+):\s*(.+)$/);
        
        if (speakerMatch) {
          const speaker = speakerMatch[1];
          const text = speakerMatch[2];
          
          return (
            <div key={index} className="mb-3 last:mb-0">
              <div className="flex items-start space-x-3">
                <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                  speaker.toLowerCase().includes('user') 
                    ? 'bg-blue-100 text-blue-600' 
                    : 'bg-green-100 text-green-600'
                }`}>
                  {speaker.toLowerCase().includes('user') ? (
                    <User className="w-4 h-4" />
                  ) : (
                    <Bot className="w-4 h-4" />
                  )}
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <span className={`text-sm font-bold uppercase tracking-wide ${
                      speaker.toLowerCase().includes('user') 
                        ? 'text-blue-700' 
                        : 'text-green-700'
                    }`}>
                      {speaker}
                    </span>
                  </div>
                  
                  <div className={`p-3 rounded-2xl ${
                    speaker.toLowerCase().includes('user') 
                      ? 'bg-blue-50 text-blue-900' 
                      : 'bg-green-50 text-green-900'
                  }`}>
                    <p className="text-sm font-medium leading-relaxed">
                      {text.trim()}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          );
        }
        
        // Line without speaker identification
        return (
          <div key={index} className="mb-3 last:mb-0">
            <div className="p-3 bg-gray-50 rounded-2xl">
              <p className="text-sm text-gray-700 font-medium leading-relaxed">
                {line.trim()}
              </p>
            </div>
          </div>
        );
      });
    }
    
    // No speaker identification found, display as plain text
    return (
      <div className="bg-gray-50 rounded-2xl p-4">
        <pre className="text-sm text-gray-700 whitespace-pre-wrap font-medium leading-relaxed">
          {rawTranscript}
        </pre>
      </div>
    );
  };

  return (
    <Card className={`${className} border-4 border-gray-200`}>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center text-lg font-bold text-gray-800 uppercase tracking-wide">
            <MessageSquare className="w-6 h-6 mr-3 text-blue-500" />
            CONVERSATION TRANSCRIPT
          </div>
          
          {processedTranscript && (
            <div className="flex items-center text-sm text-green-600 bg-green-50 px-3 py-1 rounded-full">
              <CheckCircle className="w-4 h-4 mr-1" />
              <span className="font-medium">Speaker ID Applied</span>
            </div>
          )}
        </CardTitle>
        
        <p className="text-gray-600 font-medium text-sm">
          {processedTranscript 
            ? `Speaker identification processed using ${processedTranscript.processing_method === 'existing_labels' ? 'existing labels' : 'AI analysis'}`
            : rawTranscript 
              ? 'Raw conversation transcript from your practice session'
              : 'No conversation data available'
          }
        </p>
      </CardHeader>
      
      <CardContent>
        {processedTranscript?.speaker_turns ? (
          <>
            <div className="mb-4 p-3 bg-green-50 rounded-2xl">
              <p className="text-green-700 text-sm font-medium">
                ✓ Conversation analyzed with speaker identification ({processedTranscript.speaker_turns.length} turns detected)
              </p>
            </div>
            
            <div className="max-h-96 overflow-y-auto space-y-4">
              {renderSpeakerTurns(processedTranscript.speaker_turns)}
            </div>
          </>
        ) : rawTranscript ? (
          <>
            <div className="mb-4 p-3 bg-blue-50 rounded-2xl">
              <p className="text-blue-700 text-sm font-medium">
                ✓ Raw conversation transcript from VAPI call
              </p>
            </div>
            
            <div className="max-h-96 overflow-y-auto">
              {renderRawTranscript()}
            </div>
          </>
        ) : (
          <div className="text-center text-gray-500 py-8">
            <MessageSquare className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p className="font-medium">No conversation transcript available</p>
            <p className="text-sm">Complete a practice call to see your conversation here</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};