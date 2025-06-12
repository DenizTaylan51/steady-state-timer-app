
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { translations } from '@/utils/translations';

interface AboutProps {
  isOpen: boolean;
  onClose: () => void;
  language: string;
}

const About: React.FC<AboutProps> = ({ isOpen, onClose, language }) => {
  const t = translations[language as keyof typeof translations];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-md bg-slate-800/90 border-slate-700 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-white text-center">{t.about}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 text-center">
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-white">{t.appName}</h2>
            <p className="text-slate-300">{t.tagline}</p>
            <div className="py-4">
              <p className="text-slate-400 text-sm">{t.madeBy}</p>
            </div>
          </div>
          
          <Button onClick={onClose} className="w-full bg-gradient-to-r from-blue-500 to-indigo-500">
            {t.cancel}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default About;
