import React from 'react';
import { SystemPromptTemplateEditor } from './SystemPromptTemplateEditor';
import AppBar from './AppBar';

interface SystemPromptSettingsPageProps {
  onNavigate?: (view: string) => void;
}

export const SystemPromptSettingsPage: React.FC<SystemPromptSettingsPageProps> = ({ onNavigate }) => {
  return (
    <div className="min-h-screen hindi-bg pb-24 font-nunito">
      <AppBar title="System Prompt Settings" onBack={() => onNavigate?.("settings")} />
      
      <div className="px-4 pt-4">
        <SystemPromptTemplateEditor />
      </div>
    </div>
  );
};