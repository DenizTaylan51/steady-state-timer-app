
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { translations, languages } from '@/utils/translations';

interface SettingsProps {
  isOpen: boolean;
  onClose: () => void;
  language: string;
  onLanguageChange: (lang: string) => void;
  timerSettings: {
    focus: number;
    shortBreak: number;
    longBreak: number;
  };
  onTimerSettingsChange: (settings: { focus: number; shortBreak: number; longBreak: number; }) => void;
}

const Settings: React.FC<SettingsProps> = ({
  isOpen,
  onClose,
  language,
  onLanguageChange,
  timerSettings,
  onTimerSettingsChange
}) => {
  const [localSettings, setLocalSettings] = useState(timerSettings);
  const t = translations[language as keyof typeof translations];

  if (!isOpen) return null;

  const handleSave = () => {
    onTimerSettingsChange(localSettings);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-md bg-slate-800/90 border-slate-700 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-white">{t.settings}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label className="text-slate-300">{t.language}</Label>
            <Select value={language} onValueChange={onLanguageChange}>
              <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-slate-700 border-slate-600">
                {languages.map((lang) => (
                  <SelectItem key={lang.code} value={lang.code} className="text-white">
                    {lang.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-slate-300">{t.focusTime}</Label>
              <Input
                type="number"
                min="1"
                max="60"
                value={localSettings.focus}
                onChange={(e) => setLocalSettings(prev => ({ ...prev, focus: parseInt(e.target.value) || 25 }))}
                className="bg-slate-700 border-slate-600 text-white"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-slate-300">{t.shortBreakTime}</Label>
              <Input
                type="number"
                min="1"
                max="30"
                value={localSettings.shortBreak}
                onChange={(e) => setLocalSettings(prev => ({ ...prev, shortBreak: parseInt(e.target.value) || 5 }))}
                className="bg-slate-700 border-slate-600 text-white"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-slate-300">{t.longBreakTime}</Label>
              <Input
                type="number"
                min="1"
                max="60"
                value={localSettings.longBreak}
                onChange={(e) => setLocalSettings(prev => ({ ...prev, longBreak: parseInt(e.target.value) || 15 }))}
                className="bg-slate-700 border-slate-600 text-white"
              />
            </div>
          </div>

          <div className="flex gap-3">
            <Button onClick={handleSave} className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500">
              {t.save}
            </Button>
            <Button onClick={onClose} variant="outline" className="flex-1 border-slate-600 text-slate-300">
              {t.cancel}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Settings;
