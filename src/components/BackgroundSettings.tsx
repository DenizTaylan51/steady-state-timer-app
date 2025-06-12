
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { translations } from '@/utils/translations';

interface BackgroundSettingsProps {
  isOpen: boolean;
  onClose: () => void;
  language: string;
  currentBackground: string;
  onBackgroundChange: (background: string) => void;
}

const backgrounds = [
  { id: 'gradient1', name: 'Gece Gökyüzü', class: 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900' },
  { id: 'gradient2', name: 'Okyanus', class: 'bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900' },
  { id: 'gradient3', name: 'Gün Batımı', class: 'bg-gradient-to-br from-orange-900 via-red-800 to-purple-900' },
  { id: 'gradient4', name: 'Orman', class: 'bg-gradient-to-br from-green-900 via-emerald-800 to-teal-900' },
  { id: 'gradient5', name: 'Lavanta', class: 'bg-gradient-to-br from-purple-900 via-violet-800 to-indigo-900' },
  { id: 'gradient6', name: 'Çikolata', class: 'bg-gradient-to-br from-amber-900 via-orange-800 to-red-900' }
];

const BackgroundSettings: React.FC<BackgroundSettingsProps> = ({
  isOpen,
  onClose,
  language,
  currentBackground,
  onBackgroundChange
}) => {
  const t = translations[language as keyof typeof translations];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 animate-fade-in">
      <Card className="w-full max-w-md bg-slate-800/90 border-slate-700 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-white">{t.backgroundSettings}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            {backgrounds.map((bg) => (
              <button
                key={bg.id}
                onClick={() => onBackgroundChange(bg.class)}
                className={`
                  relative h-20 rounded-lg ${bg.class} border-2 transition-all duration-300 hover:scale-105
                  ${currentBackground === bg.class ? 'border-white' : 'border-slate-600'}
                `}
              >
                {currentBackground === bg.class && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
                      <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                    </div>
                  </div>
                )}
                <div className="absolute bottom-1 left-1 right-1 text-center">
                  <span className="text-xs text-white bg-black/50 px-2 py-1 rounded">
                    {bg.name}
                  </span>
                </div>
              </button>
            ))}
          </div>
          <Button onClick={onClose} className="w-full bg-gradient-to-r from-blue-500 to-indigo-500">
            {t.close}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default BackgroundSettings;
