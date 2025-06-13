
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
  { id: 'sunset', name: 'Gün Batımı', class: 'bg-gradient-to-br from-orange-400 to-red-600' },
  { id: 'ocean', name: 'Okyanus', class: 'bg-gradient-to-br from-blue-400 to-blue-800' },
  { id: 'forest', name: 'Orman', class: 'bg-gradient-to-br from-green-400 to-green-800' },
  { id: 'lavender', name: 'Lavanta', class: 'bg-gradient-to-br from-purple-400 to-purple-800' },
  { id: 'rose', name: 'Gül Bahçesi', class: 'bg-gradient-to-br from-pink-400 to-rose-600' },
  { id: 'golden', name: 'Altın Saatler', class: 'bg-gradient-to-br from-yellow-400 to-orange-600' },
  { id: 'midnight', name: 'Gece Yarısı', class: 'bg-gradient-to-br from-indigo-900 to-purple-900' },
  { id: 'aurora', name: 'Kutup Işıkları', class: 'bg-gradient-to-br from-green-400 to-cyan-500' },
  { id: 'cherry', name: 'Kiraz Çiçeği', class: 'bg-gradient-to-br from-pink-300 to-pink-600' },
  { id: 'emerald', name: 'Zümrüt', class: 'bg-gradient-to-br from-emerald-400 to-emerald-800' },
  { id: 'sapphire', name: 'Safir', class: 'bg-gradient-to-br from-blue-500 to-indigo-700' },
  { id: 'coral', name: 'Mercan', class: 'bg-gradient-to-br from-coral-400 to-orange-500' },
  { id: 'mint', name: 'Nane', class: 'bg-gradient-to-br from-mint-300 to-green-500' },
  { id: 'peach', name: 'Şeftali', class: 'bg-gradient-to-br from-peach-300 to-orange-400' },
  { id: 'sky', name: 'Gökyüzü', class: 'bg-gradient-to-br from-sky-300 to-blue-600' },
  { id: 'wine', name: 'Şarap', class: 'bg-gradient-to-br from-red-600 to-purple-800' }
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
      <Card className="w-full max-w-3xl bg-slate-800/90 border-slate-700 backdrop-blur-sm max-h-[80vh] overflow-hidden">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="text-white">Arka Plan Seçimi</CardTitle>
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
            🎨 Dokunarak arka planı değiştirin
          </div>
        </CardContent>
        <div className="p-4">
          <Button onClick={onClose} className="w-full bg-gradient-to-r from-blue-500 to-indigo-500">
            Kapat
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default BackgroundSettings;
