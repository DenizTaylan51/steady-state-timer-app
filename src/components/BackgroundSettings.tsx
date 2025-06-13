
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
  { id: 'gradient6', name: 'Çikolata', class: 'bg-gradient-to-br from-amber-900 via-orange-800 to-red-900' },
  { id: 'gradient7', name: 'Pembe Rüya', class: 'bg-gradient-to-br from-pink-900 via-rose-800 to-purple-900' },
  { id: 'gradient8', name: 'Buzul', class: 'bg-gradient-to-br from-cyan-900 via-blue-800 to-slate-900' },
  { id: 'gradient9', name: 'Altın Saray', class: 'bg-gradient-to-br from-yellow-900 via-amber-800 to-orange-900' },
  { id: 'gradient10', name: 'Yakut', class: 'bg-gradient-to-br from-red-900 via-rose-800 to-pink-900' },
  { id: 'gradient11', name: 'Zümrüt', class: 'bg-gradient-to-br from-emerald-900 via-green-800 to-teal-900' },
  { id: 'gradient12', name: 'Safir', class: 'bg-gradient-to-br from-blue-900 via-indigo-800 to-violet-900' },
  { id: 'gradient13', name: 'Ametist', class: 'bg-gradient-to-br from-violet-900 via-purple-800 to-fuchsia-900' },
  { id: 'gradient14', name: 'Bronz', class: 'bg-gradient-to-br from-orange-900 via-amber-800 to-yellow-900' },
  { id: 'gradient15', name: 'Gümüş', class: 'bg-gradient-to-br from-gray-900 via-slate-800 to-zinc-900' },
  { id: 'gradient16', name: 'Karamel', class: 'bg-gradient-to-br from-amber-900 via-yellow-800 to-orange-900' },
  { id: 'gradient17', name: 'Gökkuşağı', class: 'bg-gradient-to-br from-red-900 via-yellow-800 via-green-800 via-blue-800 to-purple-900' },
  { id: 'gradient18', name: 'Kuzey Işıkları', class: 'bg-gradient-to-br from-green-900 via-cyan-800 to-blue-900' },
  { id: 'gradient19', name: 'Mars Yüzeyi', class: 'bg-gradient-to-br from-red-900 via-orange-800 to-yellow-900' },
  { id: 'gradient20', name: 'Derin Uzay', class: 'bg-gradient-to-br from-black via-purple-900 to-indigo-900' }
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
      <Card className="w-full max-w-4xl bg-slate-800/90 border-slate-700 backdrop-blur-sm max-h-[80vh] overflow-hidden">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="text-white">{t.backgroundSettings}</CardTitle>
            <Button
              onClick={onClose}
              variant="ghost"
              size="sm"
              className="text-slate-400 hover:text-white"
            >
              ✕
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4 max-h-96 overflow-y-auto">
          <div className="grid grid-cols-4 gap-3">
            {backgrounds.map((bg) => (
              <button
                key={bg.id}
                onClick={() => onBackgroundChange(bg.class)}
                className={`
                  relative h-20 rounded-lg ${bg.class} border-2 transition-all duration-300 hover:scale-105
                  ${currentBackground === bg.class ? 'border-white ring-2 ring-white/50' : 'border-slate-600'}
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
                  <span className="text-xs text-white bg-black/70 px-2 py-1 rounded backdrop-blur-sm">
                    {bg.name}
                  </span>
                </div>
              </button>
            ))}
          </div>
          <div className="text-center text-sm text-slate-400 mt-4">
            Dokunarak arka planı değiştirin
          </div>
        </CardContent>
        <div className="p-4">
          <Button onClick={onClose} className="w-full bg-gradient-to-r from-blue-500 to-indigo-500">
            {t.close}
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default BackgroundSettings;
