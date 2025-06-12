
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Trophy, Star, Target, Zap, Clock, Fire } from 'lucide-react';
import { translations } from '@/utils/translations';

interface AchievementsProps {
  isOpen: boolean;
  onClose: () => void;
  language: string;
  completedSessions: {
    focus: number;
    shortBreak: number;
    longBreak: number;
  };
}

interface Achievement {
  id: string;
  icon: React.ReactNode;
  nameKey: string;
  descriptionKey: string;
  requirement: number;
  type: 'focus' | 'shortBreak' | 'longBreak' | 'total';
  color: string;
}

const achievements: Achievement[] = [
  { id: 'first-focus', icon: <Star className="w-6 h-6" />, nameKey: 'firstFocus', descriptionKey: 'firstFocusDesc', requirement: 1, type: 'focus', color: 'bg-yellow-500' },
  { id: 'focus-master', icon: <Target className="w-6 h-6" />, nameKey: 'focusMaster', descriptionKey: 'focusMasterDesc', requirement: 10, type: 'focus', color: 'bg-blue-500' },
  { id: 'focus-legend', icon: <Trophy className="w-6 h-6" />, nameKey: 'focusLegend', descriptionKey: 'focusLegendDesc', requirement: 50, type: 'focus', color: 'bg-purple-500' },
  { id: 'break-taker', icon: <Clock className="w-6 h-6" />, nameKey: 'breakTaker', descriptionKey: 'breakTakerDesc', requirement: 5, type: 'shortBreak', color: 'bg-green-500' },
  { id: 'rest-master', icon: <Zap className="w-6 h-6" />, nameKey: 'restMaster', descriptionKey: 'restMasterDesc', requirement: 3, type: 'longBreak', color: 'bg-indigo-500' },
  { id: 'streak-fire', icon: <Fire className="w-6 h-6" />, nameKey: 'streakFire', descriptionKey: 'streakFireDesc', requirement: 100, type: 'total', color: 'bg-red-500' }
];

const Achievements: React.FC<AchievementsProps> = ({ isOpen, onClose, language, completedSessions }) => {
  const t = translations[language as keyof typeof translations];

  if (!isOpen) return null;

  const getTotalSessions = () => completedSessions.focus + completedSessions.shortBreak + completedSessions.longBreak;

  const isAchievementUnlocked = (achievement: Achievement) => {
    switch (achievement.type) {
      case 'focus':
        return completedSessions.focus >= achievement.requirement;
      case 'shortBreak':
        return completedSessions.shortBreak >= achievement.requirement;
      case 'longBreak':
        return completedSessions.longBreak >= achievement.requirement;
      case 'total':
        return getTotalSessions() >= achievement.requirement;
      default:
        return false;
    }
  };

  const getProgress = (achievement: Achievement) => {
    let current = 0;
    switch (achievement.type) {
      case 'focus':
        current = completedSessions.focus;
        break;
      case 'shortBreak':
        current = completedSessions.shortBreak;
        break;
      case 'longBreak':
        current = completedSessions.longBreak;
        break;
      case 'total':
        current = getTotalSessions();
        break;
    }
    return Math.min((current / achievement.requirement) * 100, 100);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 animate-fade-in">
      <Card className="w-full max-w-2xl bg-slate-800/90 border-slate-700 backdrop-blur-sm max-h-[80vh] overflow-hidden">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Trophy className="w-6 h-6 text-yellow-500" />
            {t.achievements}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 max-h-96 overflow-y-auto">
          {achievements.map((achievement) => {
            const unlocked = isAchievementUnlocked(achievement);
            const progress = getProgress(achievement);
            
            return (
              <div
                key={achievement.id}
                className={`p-4 rounded-lg border transition-all duration-300 hover:scale-[1.02] ${
                  unlocked 
                    ? 'bg-slate-700/50 border-slate-600 animate-scale-in' 
                    : 'bg-slate-800/50 border-slate-700 opacity-60'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-full ${achievement.color} ${unlocked ? 'animate-pulse' : 'grayscale'}`}>
                    {achievement.icon}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-white font-semibold">
                        {t[achievement.nameKey as keyof typeof t]}
                      </h3>
                      {unlocked && (
                        <Badge className="bg-green-500 text-white animate-bounce">
                          {t.unlocked}
                        </Badge>
                      )}
                    </div>
                    <p className="text-slate-300 text-sm mb-2">
                      {t[achievement.descriptionKey as keyof typeof t]}
                    </p>
                    <div className="w-full bg-slate-600 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full transition-all duration-500 ${achievement.color}`}
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                    <p className="text-slate-400 text-xs mt-1">
                      {Math.floor(progress)}% ({Math.min(getProgress(achievement) * achievement.requirement / 100, achievement.requirement)}/{achievement.requirement})
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </CardContent>
        <div className="p-6">
          <Button onClick={onClose} className="w-full bg-gradient-to-r from-blue-500 to-indigo-500">
            {t.close}
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default Achievements;
