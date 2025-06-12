
import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, Square, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';

const TIMER_MODES = {
  FOCUS: { duration: 25 * 60, label: 'Odaklanma', color: 'from-red-500 to-orange-500' },
  SHORT_BREAK: { duration: 5 * 60, label: 'Kısa Mola', color: 'from-green-500 to-emerald-500' },
  LONG_BREAK: { duration: 15 * 60, label: 'Uzun Mola', color: 'from-blue-500 to-indigo-500' }
};

const Index = () => {
  const [currentMode, setCurrentMode] = useState('FOCUS');
  const [timeLeft, setTimeLeft] = useState(TIMER_MODES.FOCUS.duration);
  const [isRunning, setIsRunning] = useState(false);
  const [completedSessions, setCompletedSessions] = useState({ focus: 0, shortBreak: 0, longBreak: 0 });
  const { toast } = useToast();
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

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
    
    // Update completed sessions
    if (currentMode === 'FOCUS') {
      setCompletedSessions(prev => ({ ...prev, focus: prev.focus + 1 }));
      toast({
        title: "Odaklanma süresi tamamlandı! 🎉",
        description: "Kısa bir mola verme zamanı.",
      });
      // Auto switch to short break
      setTimeout(() => switchMode('SHORT_BREAK'), 2000);
    } else if (currentMode === 'SHORT_BREAK') {
      setCompletedSessions(prev => ({ ...prev, shortBreak: prev.shortBreak + 1 }));
      toast({
        title: "Mola tamamlandı! 💪",
        description: "Tekrar odaklanma zamanı!",
      });
      setTimeout(() => switchMode('FOCUS'), 2000);
    } else {
      setCompletedSessions(prev => ({ ...prev, longBreak: prev.longBreak + 1 }));
      toast({
        title: "Uzun mola tamamlandı! 🚀",
        description: "Yeni bir odaklanma döngüsü başlıyor!",
      });
      setTimeout(() => switchMode('FOCUS'), 2000);
    }
  };

  const switchMode = (mode: string) => {
    setCurrentMode(mode);
    setTimeLeft(TIMER_MODES[mode as keyof typeof TIMER_MODES].duration);
    setIsRunning(false);
  };

  const toggleTimer = () => {
    setIsRunning(!isRunning);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(TIMER_MODES[currentMode as keyof typeof TIMER_MODES].duration);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const currentModeData = TIMER_MODES[currentMode as keyof typeof TIMER_MODES];
  const progress = ((currentModeData.duration - timeLeft) / currentModeData.duration) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-white">Pomodoro Timer</h1>
          <p className="text-slate-300">Odaklanın, mola verin, tekrarlayın</p>
        </div>

        {/* Mode Selector */}
        <div className="flex bg-slate-800/50 rounded-xl p-1 backdrop-blur-sm border border-slate-700">
          {Object.entries(TIMER_MODES).map(([key, mode]) => (
            <button
              key={key}
              onClick={() => switchMode(key)}
              className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                currentMode === key
                  ? `bg-gradient-to-r ${mode.color} text-white shadow-lg`
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              {mode.label}
            </button>
          ))}
        </div>

        {/* Timer Circle */}
        <Card className="bg-slate-800/30 border-slate-700 backdrop-blur-sm">
          <CardContent className="p-8">
            <div className="relative w-64 h-64 mx-auto">
              {/* Background Circle */}
              <div className="absolute inset-0 rounded-full border-8 border-slate-700"></div>
              
              {/* Progress Circle */}
              <div 
                className={`absolute inset-0 rounded-full border-8 bg-gradient-to-r ${currentModeData.color}`}
                style={{
                  background: `conic-gradient(from 0deg, transparent ${100 - progress}%, rgb(239 68 68) ${100 - progress}%)`,
                  WebkitMask: 'radial-gradient(farthest-side, transparent calc(100% - 8px), black calc(100% - 8px))',
                  mask: 'radial-gradient(farthest-side, transparent calc(100% - 8px), black calc(100% - 8px))'
                }}
              ></div>
              
              {/* Time Display */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-5xl font-bold text-white mb-2">
                    {formatTime(timeLeft)}
                  </div>
                  <div className={`text-lg font-medium bg-gradient-to-r ${currentModeData.color} bg-clip-text text-transparent`}>
                    {currentModeData.label}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Controls */}
        <div className="flex justify-center gap-4">
          <Button
            onClick={toggleTimer}
            size="lg"
            className={`bg-gradient-to-r ${currentModeData.color} hover:opacity-90 text-white shadow-lg px-8`}
          >
            {isRunning ? <Pause className="w-5 h-5 mr-2" /> : <Play className="w-5 h-5 mr-2" />}
            {isRunning ? 'Duraklat' : 'Başlat'}
          </Button>
          
          <Button
            onClick={resetTimer}
            variant="outline"
            size="lg"
            className="border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-white"
          >
            <RotateCcw className="w-5 h-5 mr-2" />
            Sıfırla
          </Button>
        </div>

        {/* Statistics */}
        <Card className="bg-slate-800/30 border-slate-700 backdrop-blur-sm">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-white mb-4 text-center">Bugünkü İstatistikler</h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-red-400">{completedSessions.focus}</div>
                <div className="text-sm text-slate-400">Odaklanma</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-400">{completedSessions.shortBreak}</div>
                <div className="text-sm text-slate-400">Kısa Mola</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-400">{completedSessions.longBreak}</div>
                <div className="text-sm text-slate-400">Uzun Mola</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tips */}
        <Card className="bg-slate-800/30 border-slate-700 backdrop-blur-sm">
          <CardContent className="p-4">
            <div className="text-center text-sm text-slate-300">
              💡 <strong>İpucu:</strong> Her 4 odaklanma seansından sonra uzun mola verin
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Index;
