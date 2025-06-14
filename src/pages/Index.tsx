import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Settings as SettingsIcon, Info, Trophy, Palette, BarChart3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { translations } from '@/utils/translations';
import Settings from '@/components/Settings';
import About from '@/components/About';
import Achievements from '@/components/Achievements';
import BackgroundSettings from '@/components/BackgroundSettings';

const TIMER_MODES = {
  FOCUS: { duration: 25 * 60, label: 'focus', color: 'from-red-500 to-orange-500' },
  SHORT_BREAK: { duration: 5 * 60, label: 'shortBreak', color: 'from-green-500 to-emerald-500' },
  LONG_BREAK: { duration: 15 * 60, label: 'longBreak', color: 'from-blue-500 to-indigo-500' }
};

const Index = () => {
  const [language, setLanguage] = useState('tr');
  const [timerSettings, setTimerSettings] = useState({
    focus: 25,
    shortBreak: 5,
    longBreak: 15
  });
  const [background, setBackground] = useState('bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900');

  const [currentMode, setCurrentMode] = useState('FOCUS');
  const [timeLeft, setTimeLeft] = useState(TIMER_MODES.FOCUS.duration);
  const [isRunning, setIsRunning] = useState(false);
  const [completedSessions, setCompletedSessions] = useState({ focus: 0, shortBreak: 0, longBreak: 0 });
  const [showSettings, setShowSettings] = useState(false);
  const [showAbout, setShowAbout] = useState(false);
  const [showAchievements, setShowAchievements] = useState(false);
  const [showBackgroundSettings, setShowBackgroundSettings] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const { toast } = useToast();
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const t = translations[language as keyof typeof translations];

  useEffect(() => {
    const updatedModes = {
      FOCUS: { ...TIMER_MODES.FOCUS, duration: timerSettings.focus * 60 },
      SHORT_BREAK: { ...TIMER_MODES.SHORT_BREAK, duration: timerSettings.shortBreak * 60 },
      LONG_BREAK: { ...TIMER_MODES.LONG_BREAK, duration: timerSettings.longBreak * 60 }
    };
    
    if (!isRunning) {
      setTimeLeft(updatedModes[currentMode as keyof typeof updatedModes].duration);
    }
  }, [timerSettings, currentMode, isRunning]);

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            handleTimerComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, timeLeft]);

  const handleTimerComplete = () => {
    setIsRunning(false);
    
    if (currentMode === 'FOCUS') {
      setCompletedSessions(prev => ({ ...prev, focus: prev.focus + 1 }));
      toast({
        title: `${t.sessionComplete} 🎉`,
        description: t.shortBreak,
      });
      setTimeout(() => switchMode('SHORT_BREAK'), 2000);
    } else if (currentMode === 'SHORT_BREAK') {
      setCompletedSessions(prev => ({ ...prev, shortBreak: prev.shortBreak + 1 }));
      toast({
        title: `${t.breakComplete} 💪`,
        description: t.focus,
      });
      setTimeout(() => switchMode('FOCUS'), 2000);
    } else {
      setCompletedSessions(prev => ({ ...prev, longBreak: prev.longBreak + 1 }));
      toast({
        title: `${t.breakComplete} 🚀`,
        description: t.focus,
      });
      setTimeout(() => switchMode('FOCUS'), 2000);
    }
  };

  const switchMode = (mode: string) => {
    setCurrentMode(mode);
    const updatedModes = {
      FOCUS: { ...TIMER_MODES.FOCUS, duration: timerSettings.focus * 60 },
      SHORT_BREAK: { ...TIMER_MODES.SHORT_BREAK, duration: timerSettings.shortBreak * 60 },
      LONG_BREAK: { ...TIMER_MODES.LONG_BREAK, duration: timerSettings.longBreak * 60 }
    };
    setTimeLeft(updatedModes[mode as keyof typeof updatedModes].duration);
    setIsRunning(false);
  };

  const toggleTimer = () => {
    setIsRunning(!isRunning);
  };

  const resetTimer = () => {
    setIsRunning(false);
    const updatedModes = {
      FOCUS: { ...TIMER_MODES.FOCUS, duration: timerSettings.focus * 60 },
      SHORT_BREAK: { ...TIMER_MODES.SHORT_BREAK, duration: timerSettings.shortBreak * 60 },
      LONG_BREAK: { ...TIMER_MODES.LONG_BREAK, duration: timerSettings.longBreak * 60 }
    };
    setTimeLeft(updatedModes[currentMode as keyof typeof updatedModes].duration);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const currentModeData = TIMER_MODES[currentMode as keyof typeof TIMER_MODES];
  const updatedModes = {
    FOCUS: { ...TIMER_MODES.FOCUS, duration: timerSettings.focus * 60 },
    SHORT_BREAK: { ...TIMER_MODES.SHORT_BREAK, duration: timerSettings.shortBreak * 60 },
    LONG_BREAK: { ...TIMER_MODES.LONG_BREAK, duration: timerSettings.longBreak * 60 }
  };
  const progress = ((updatedModes[currentMode as keyof typeof updatedModes].duration - timeLeft) / updatedModes[currentMode as keyof typeof updatedModes].duration) * 100;

  return (
    <div className={`min-h-screen ${background} transition-all duration-500 flex flex-col`}>
      {/* Ana İçerik - Tam ekran */}
      <div className="flex-1 flex items-center justify-center p-2 sm:p-4">
        <div className="w-full max-w-4xl space-y-3 sm:space-y-4 animate-fade-in">
          {/* Header - Ortalanmış */}
          <div className="text-center mb-4 sm:mb-6">
            <h1 className="text-xl sm:text-2xl font-bold text-white animate-bounce-in mb-2">Fokusio</h1>
            <p className="text-xs sm:text-sm text-slate-300 animate-fade-in">Odaklanın ve başarın 🎯</p>
            
            {/* Butonlar sağ üstte */}
            <div className="absolute top-4 right-4 flex gap-1 sm:gap-2">
              <Button
                onClick={() => setShowStats(true)}
                variant="outline"
                size="sm"
                className="border-slate-600 text-slate-300 hover:bg-slate-700 animate-scale-in p-2"
              >
                <BarChart3 className="w-3 h-3 sm:w-4 sm:h-4" />
              </Button>
              <Button
                onClick={() => setShowBackgroundSettings(true)}
                variant="outline"
                size="sm"
                className="border-slate-600 text-slate-300 hover:bg-slate-700 animate-scale-in p-2"
              >
                <Palette className="w-3 h-3 sm:w-4 sm:h-4" />
              </Button>
              <Button
                onClick={() => setShowAchievements(true)}
                variant="outline"
                size="sm"
                className="border-slate-600 text-slate-300 hover:bg-slate-700 animate-scale-in p-2"
              >
                <Trophy className="w-3 h-3 sm:w-4 sm:h-4" />
              </Button>
              <Button
                onClick={() => setShowSettings(true)}
                variant="outline"
                size="sm"
                className="border-slate-600 text-slate-300 hover:bg-slate-700 animate-scale-in p-2"
              >
                <SettingsIcon className="w-3 h-3 sm:w-4 sm:h-4" />
              </Button>
              <Button
                onClick={() => setShowAbout(true)}
                variant="outline"
                size="sm"
                className="border-slate-600 text-slate-300 hover:bg-slate-700 animate-scale-in p-2"
              >
                <Info className="w-3 h-3 sm:w-4 sm:h-4" />
              </Button>
            </div>
          </div>

          {/* Ana Timer Bölümü - Merkezi Yerleşim */}
          <div className="flex flex-col items-center justify-center space-y-3 sm:space-y-6">
            {/* Mode Selector */}
            <div className="flex bg-slate-800/50 rounded-xl p-1 backdrop-blur-sm border border-slate-700 animate-scale-in w-full max-w-md">
              {Object.entries(TIMER_MODES).map(([key, mode]) => (
                <button
                  key={key}
                  onClick={() => switchMode(key)}
                  className={`flex-1 py-2 px-2 sm:px-3 rounded-lg text-xs sm:text-sm font-medium transition-all duration-300 hover:scale-105 ${
                    currentMode === key
                      ? `bg-gradient-to-r ${mode.color} text-white shadow-lg animate-pulse-slow`
                      : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
                  }`}
                >
                  {t[mode.label as keyof typeof t]}
                </button>
              ))}
            </div>

            {/* Timer Circle - Yatay ekranlar için optimize */}
            <Card className="bg-slate-800/30 border-slate-700 backdrop-blur-sm animate-scale-in">
              <CardContent className="p-3 sm:p-6">
                <div className="relative w-40 h-40 sm:w-56 sm:h-56 mx-auto">
                  <div className="absolute inset-0 rounded-full border-4 sm:border-6 border-slate-700"></div>
                  
                  <div 
                    className={`absolute inset-0 rounded-full border-4 sm:border-6 transition-all duration-1000 ${isRunning ? 'animate-pulse' : ''}`}
                    style={{
                      background: `conic-gradient(from 0deg, transparent ${100 - progress}%, rgb(239 68 68) ${100 - progress}%)`,
                      WebkitMask: 'radial-gradient(farthest-side, transparent calc(100% - 4px), black calc(100% - 4px))',
                      mask: 'radial-gradient(farthest-side, transparent calc(100% - 4px), black calc(100% - 4px))'
                    }}
                  ></div>
                  
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-2xl sm:text-4xl font-bold text-white mb-1 sm:mb-2 animate-bounce-in">
                        {formatTime(timeLeft)}
                      </div>
                      <div className={`text-xs sm:text-sm font-medium bg-gradient-to-r ${currentModeData.color} bg-clip-text text-transparent`}>
                        {t[currentModeData.label as keyof typeof t]}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Controls - Kompakt */}
            <div className="flex justify-center gap-3 sm:gap-4 animate-scale-in">
              <Button
                onClick={toggleTimer}
                size="lg"
                className={`bg-gradient-to-r ${currentModeData.color} hover:opacity-90 text-white shadow-lg px-4 sm:px-6 py-2 sm:py-3 transition-all duration-300 hover:scale-105`}
              >
                {isRunning ? <Pause className="w-3 h-3 sm:w-4 sm:h-4 mr-2" /> : <Play className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />}
                <span className="text-sm sm:text-base">{isRunning ? t.pause : t.start}</span>
              </Button>
              
              <Button
                onClick={resetTimer}
                variant="outline"
                size="lg"
                className="border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-white transition-all duration-300 hover:scale-105 px-4 sm:px-6 py-2 sm:py-3"
              >
                <RotateCcw className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                <span className="text-sm sm:text-base">{t.reset}</span>
              </Button>
            </div>

            {/* Tips - Ortalanmış */}
            <Card className="bg-slate-800/30 border-slate-700 backdrop-blur-sm animate-fade-in w-full max-w-md">
              <CardContent className="p-3">
                <div className="text-center text-xs sm:text-sm text-slate-300">
                  💡 <strong>{t.tip.split(':')[0]}:</strong> {t.tip.split(':')[1]}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Statistics Modal */}
      {showStats && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 animate-fade-in">
          <Card className="w-full max-w-md bg-slate-800/90 border-slate-700 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold text-white flex items-center gap-2">
                  <BarChart3 className="w-6 h-6" />
                  Detaylı İstatistikler
                </h3>
                <Button
                  onClick={() => setShowStats(false)}
                  variant="ghost"
                  size="sm"
                  className="text-slate-400 hover:text-white"
                >
                  ✕
                </Button>
              </div>
              
              <div className="space-y-4">
                <div className="bg-slate-700/50 p-4 rounded-lg">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-red-400 mb-2">{completedSessions.focus}</div>
                    <div className="text-slate-300">Tamamlanan Odaklanma Seansı</div>
                    <div className="text-sm text-slate-400 mt-1">
                      Toplam {completedSessions.focus * timerSettings.focus} dakika
                    </div>
                  </div>
                </div>
                
                <div className="bg-slate-700/50 p-4 rounded-lg">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-green-400 mb-2">{completedSessions.shortBreak}</div>
                    <div className="text-slate-300">Kısa Mola</div>
                    <div className="text-sm text-slate-400 mt-1">
                      Toplam {completedSessions.shortBreak * timerSettings.shortBreak} dakika
                    </div>
                  </div>
                </div>
                
                <div className="bg-slate-700/50 p-4 rounded-lg">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-blue-400 mb-2">{completedSessions.longBreak}</div>
                    <div className="text-slate-300">Uzun Mola</div>
                    <div className="text-sm text-slate-400 mt-1">
                      Toplam {completedSessions.longBreak * timerSettings.longBreak} dakika
                    </div>
                  </div>
                </div>
                
                <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 p-4 rounded-lg border border-purple-500/30">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white mb-2">
                      {(completedSessions.focus * timerSettings.focus) + 
                       (completedSessions.shortBreak * timerSettings.shortBreak) + 
                       (completedSessions.longBreak * timerSettings.longBreak)} dk
                    </div>
                    <div className="text-purple-200">Toplam Çalışma Süresi</div>
                  </div>
                </div>
              </div>
              
              <Button 
                onClick={() => setShowStats(false)} 
                className="w-full mt-6 bg-gradient-to-r from-blue-500 to-indigo-500"
              >
                Kapat
              </Button>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Diğer modaller */}
      <Settings
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        language={language}
        onLanguageChange={setLanguage}
        timerSettings={timerSettings}
        onTimerSettingsChange={setTimerSettings}
      />

      <About
        isOpen={showAbout}
        onClose={() => setShowAbout(false)}
        language={language}
      />

      <Achievements
        isOpen={showAchievements}
        onClose={() => setShowAchievements(false)}
        language={language}
        completedSessions={completedSessions}
      />

      <BackgroundSettings
        isOpen={showBackgroundSettings}
        onClose={() => setShowBackgroundSettings(false)}
        language={language}
        currentBackground={background}
        onBackgroundChange={setBackground}
      />
    </div>
  );
};

export default Index;
