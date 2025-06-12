import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Settings as SettingsIcon, Info, Trophy, Palette } from 'lucide-react';
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
    <div className={`min-h-screen ${background} flex items-center justify-center p-4 transition-all duration-500`}>
      <div className="w-full max-w-md space-y-6 animate-fade-in">
        {/* Header with buttons */}
        <div className="text-center space-y-2 relative">
          <div className="absolute top-0 right-0 flex gap-2">
            <Button
              onClick={() => setShowBackgroundSettings(true)}
              variant="outline"
              size="sm"
              className="border-slate-600 text-slate-300 hover:bg-slate-700 animate-scale-in"
            >
              <Palette className="w-4 h-4" />
            </Button>
            <Button
              onClick={() => setShowAchievements(true)}
              variant="outline"
              size="sm"
              className="border-slate-600 text-slate-300 hover:bg-slate-700 animate-scale-in"
            >
              <Trophy className="w-4 h-4" />
            </Button>
            <Button
              onClick={() => setShowSettings(true)}
              variant="outline"
              size="sm"
              className="border-slate-600 text-slate-300 hover:bg-slate-700 animate-scale-in"
            >
              <SettingsIcon className="w-4 h-4" />
            </Button>
            <Button
              onClick={() => setShowAbout(true)}
              variant="outline"
              size="sm"
              className="border-slate-600 text-slate-300 hover:bg-slate-700 animate-scale-in"
            >
              <Info className="w-4 h-4" />
            </Button>
          </div>
          <h1 className="text-3xl font-bold text-white animate-bounce-in">{t.appName}</h1>
          <p className="text-slate-300 animate-fade-in">{t.tagline}</p>
        </div>

        {/* Mode Selector */}
        <div className="flex bg-slate-800/50 rounded-xl p-1 backdrop-blur-sm border border-slate-700 animate-scale-in">
          {Object.entries(TIMER_MODES).map(([key, mode]) => (
            <button
              key={key}
              onClick={() => switchMode(key)}
              className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all duration-300 hover:scale-105 ${
                currentMode === key
                  ? `bg-gradient-to-r ${mode.color} text-white shadow-lg animate-pulse-slow`
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              {t[mode.label as keyof typeof t]}
            </button>
          ))}
        </div>

        {/* Timer Circle */}
        <Card className="bg-slate-800/30 border-slate-700 backdrop-blur-sm animate-scale-in">
          <CardContent className="p-8">
            <div className="relative w-64 h-64 mx-auto">
              <div className="absolute inset-0 rounded-full border-8 border-slate-700"></div>
              
              <div 
                className={`absolute inset-0 rounded-full border-8 transition-all duration-1000 ${isRunning ? 'animate-pulse' : ''}`}
                style={{
                  background: `conic-gradient(from 0deg, transparent ${100 - progress}%, rgb(239 68 68) ${100 - progress}%)`,
                  WebkitMask: 'radial-gradient(farthest-side, transparent calc(100% - 8px), black calc(100% - 8px))',
                  mask: 'radial-gradient(farthest-side, transparent calc(100% - 8px), black calc(100% - 8px))'
                }}
              ></div>
              
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-5xl font-bold text-white mb-2 animate-bounce-in">
                    {formatTime(timeLeft)}
                  </div>
                  <div className={`text-lg font-medium bg-gradient-to-r ${currentModeData.color} bg-clip-text text-transparent`}>
                    {t[currentModeData.label as keyof typeof t]}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Controls */}
        <div className="flex justify-center gap-4 animate-scale-in">
          <Button
            onClick={toggleTimer}
            size="lg"
            className={`bg-gradient-to-r ${currentModeData.color} hover:opacity-90 text-white shadow-lg px-8 transition-all duration-300 hover:scale-105`}
          >
            {isRunning ? <Pause className="w-5 h-5 mr-2" /> : <Play className="w-5 h-5 mr-2" />}
            {isRunning ? t.pause : t.start}
          </Button>
          
          <Button
            onClick={resetTimer}
            variant="outline"
            size="lg"
            className="border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-white transition-all duration-300 hover:scale-105"
          >
            <RotateCcw className="w-5 h-5 mr-2" />
            {t.reset}
          </Button>
        </div>

        {/* Statistics */}
        <Card className="bg-slate-800/30 border-slate-700 backdrop-blur-sm animate-scale-in">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-white mb-4 text-center">{t.todayStats}</h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center animate-bounce-in">
                <div className="text-2xl font-bold text-red-400">{completedSessions.focus}</div>
                <div className="text-sm text-slate-400">{t.focus}</div>
              </div>
              <div className="text-center animate-bounce-in">
                <div className="text-2xl font-bold text-green-400">{completedSessions.shortBreak}</div>
                <div className="text-sm text-slate-400">{t.shortBreak}</div>
              </div>
              <div className="text-center animate-bounce-in">
                <div className="text-2xl font-bold text-blue-400">{completedSessions.longBreak}</div>
                <div className="text-sm text-slate-400">{t.longBreak}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tips */}
        <Card className="bg-slate-800/30 border-slate-700 backdrop-blur-sm animate-fade-in">
          <CardContent className="p-4">
            <div className="text-center text-sm text-slate-300">
              💡 <strong>{t.tip.split(':')[0]}:</strong> {t.tip.split(':')[1]}
            </div>
          </CardContent>
        </Card>
      </div>

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
