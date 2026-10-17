import { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Settings, History, Droplet, Trophy, Flame, RotateCcw, Undo2 } from 'lucide-react';
import { useHydration } from './hooks/useHydration';
import { useReminderScheduler } from './hooks/useReminderScheduler';
import { CircularWaterVisual } from './components/CircularWaterVisual';
import { QuickIntakeButtons } from './components/QuickIntakeButtons';
import { ReminderCard } from './components/ReminderCard';
import { HistoryModal } from './components/HistoryModal';
import { SettingsModal } from './components/SettingsModal';
import { KidsMascotCompanion } from './components/KidsMascotCompanion';
import { playCartoonGulp, playGoalAchievedSound } from './utils/audio';
import {
  requestNotificationPermission,
  getNotificationStatus,
  sendHydrationNotification,
} from './utils/notifications';

export function App() {
  const {
    settings,
    todayLogs,
    todayTotal,
    dailyGoal,
    lastDrinkTimestamp,
    history,
    canUndo,
    undo,
    addWater,
    removeWaterLog,
    resetToday,
    updateSettings,
  } = useHydration();

  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission>(
    () => getNotificationStatus()
  );

  const [currentMascotId, setCurrentMascotId] = useState<string>(() => {
    return localStorage.getItem('sipster_mascot_id') || 'droppy';
  });
  const [isSipping, setIsSipping] = useState(false);

  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [hasCelebratedGoal, setHasCelebratedGoal] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  // Save mascot preference
  const handleSelectMascot = (id: string) => {
    setCurrentMascotId(id);
    localStorage.setItem('sipster_mascot_id', id);
  };

  // Reminder scheduler
  const { secondsRemaining, isWithinActiveHours, snooze } = useReminderScheduler({
    settings,
    lastDrinkTimestamp,
  });

  // Calculate percentage
  const percentage = Math.min(100, Math.round((todayTotal / dailyGoal) * 100));

  // Trigger celebration when goal is reached
  useEffect(() => {
    if (todayTotal >= dailyGoal && dailyGoal > 0 && !hasCelebratedGoal) {
      setHasCelebratedGoal(true);
      if (settings.soundEnabled) {
        playGoalAchievedSound();
      }
      confetti({
        particleCount: 150,
        spread: 90,
        origin: { y: 0.6 },
        colors: ['#38bdf8', '#0284c7', '#34d399', '#f59e0b', '#ec4899'],
      });
      sendHydrationNotification("🎉 Fantastic job! You've achieved your daily hydration goal!");
    } else if (todayTotal < dailyGoal) {
      setHasCelebratedGoal(false);
    }
  }, [todayTotal, dailyGoal, hasCelebratedGoal, settings.soundEnabled]);

  const handleAddWater = (amount: number) => {
    if (settings.soundEnabled) {
      playCartoonGulp();
    }
    // Trigger animated reaction on mascot
    setIsSipping(true);
    setTimeout(() => setIsSipping(false), 1600);

    addWater(amount);
  };

  const handleUndo = () => {
    if (canUndo) {
      undo();
    }
  };

  const handleConfirmReset = () => {
    resetToday();
    setShowResetConfirm(false);
  };

  const handleRequestPermission = async () => {
    const res = await requestNotificationPermission();
    setNotificationPermission(res);
    if (res === 'granted') {
      sendHydrationNotification("Notifications activated! Sipster will remind you to drink water 💧");
    }
  };

  const handleTestNotification = () => {
    if (notificationPermission !== 'granted') {
      handleRequestPermission();
    } else {
      sendHydrationNotification("Water reminder test: Your Chrome notifications are working seamlessly! 🌊");
    }
  };

  // Calculate streak (consecutive days met goal)
  const calculateStreak = () => {
    let streak = 0;
    const d = new Date();
    // check today
    if (todayTotal >= dailyGoal) streak++;

    // check past days
    for (let i = 1; i <= 30; i++) {
      const prevDate = new Date();
      prevDate.setDate(d.getDate() - i);
      const year = prevDate.getFullYear();
      const month = String(prevDate.getMonth() + 1).padStart(2, '0');
      const day = String(prevDate.getDate()).padStart(2, '0');
      const key = `${year}-${month}-${day}`;
      const pastVal = history[key] || 0;
      if (pastVal >= dailyGoal) {
        streak++;
      } else {
        break;
      }
    }
    return streak;
  };

  const streak = calculateStreak();

  return (
    <main className="min-h-screen bg-slate-950 flex flex-col items-center justify-start p-4 sm:p-6 text-slate-100 max-w-md mx-auto relative overflow-hidden pb-12">
      {/* Background radial atmosphere */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-sky-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Header Bar */}
      <header className="w-full flex items-center justify-between z-10 pt-2 pb-1 mb-2">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-sky-600 to-sky-400 flex items-center justify-center shadow-lg shadow-sky-500/20">
            <Droplet className="text-white fill-white" size={20} />
          </div>
          <div>
            <h1 className="text-xl font-extrabold tracking-tight text-white m-0 p-0 leading-none">
              Sipster
            </h1>
            <p className="text-[11px] text-sky-400 font-medium tracking-wide m-0 p-0 mt-0.5">
              Hydration Companion
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {streak > 0 && (
            <div className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-orange-500/10 border border-orange-500/20 text-orange-400 text-xs font-bold">
              <Flame size={14} className="fill-orange-400" />
              <span>{streak}d</span>
            </div>
          )}

          <button
            onClick={() => setIsHistoryOpen(true)}
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800 transition active:scale-95 cursor-pointer"
            title="Hydration History"
          >
            <History size={18} />
          </button>

          <button
            onClick={() => setIsSettingsOpen(true)}
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800 transition active:scale-95 cursor-pointer"
            title="Preferences & Timer Settings"
          >
            <Settings size={18} />
          </button>
        </div>
      </header>

      {/* Kids Mascot Companion Banner */}
      <section className="w-full z-10">
        <KidsMascotCompanion
          currentMascotId={currentMascotId}
          onSelectMascot={handleSelectMascot}
          percentage={percentage}
          isSipping={isSipping}
          soundEnabled={settings.soundEnabled}
        />
      </section>

      {/* Main Hydration Circle */}
      <section className="w-full flex flex-col items-center z-10">
        <CircularWaterVisual
          percentage={percentage}
          currentAmount={todayTotal}
          goalAmount={dailyGoal}
          onQuickDrink={() => handleAddWater(settings.containerSize)}
          quickAmount={settings.containerSize}
          currentMascotId={currentMascotId}
          isSipping={isSipping}
        />
      </section>

      {/* Quick Intake Adders */}
      <section className="w-full z-10 mb-2">
        <QuickIntakeButtons
          onAdd={handleAddWater}
          defaultQuickAmount={settings.containerSize}
        />
      </section>

      {/* Undo & Reset Action Row */}
      <section className="w-full z-10 mb-3.5 flex items-center justify-between gap-2.5 px-0.5">
        <button
          onClick={handleUndo}
          disabled={!canUndo}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl border text-xs font-semibold transition active:scale-95 cursor-pointer ${
            canUndo
              ? 'bg-slate-900/90 hover:bg-slate-800 text-slate-200 border-slate-700/80 shadow-sm'
              : 'bg-slate-950/40 text-slate-600 border-slate-800/40 cursor-not-allowed opacity-50'
          }`}
          title="Revert to previous hydration state"
        >
          <Undo2 size={15} className={canUndo ? 'text-sky-400' : 'text-slate-600'} />
          <span>Undo Last</span>
        </button>

        <button
          onClick={() => setShowResetConfirm(true)}
          disabled={todayTotal === 0 && todayLogs.length === 0}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl border text-xs font-semibold transition active:scale-95 cursor-pointer ${
            todayTotal > 0 || todayLogs.length > 0
              ? 'bg-rose-950/20 hover:bg-rose-950/40 text-rose-300 border-rose-500/20 shadow-sm'
              : 'bg-slate-950/40 text-slate-600 border-slate-800/40 cursor-not-allowed opacity-50'
          }`}
          title="Reset today's water count"
        >
          <RotateCcw size={15} className={todayTotal > 0 ? 'text-rose-400' : 'text-slate-600'} />
          <span>Reset Today</span>
        </button>
      </section>

      {/* Web Reminder Timer & Notification Status */}
      <section className="w-full z-10 space-y-3">
        <ReminderCard
          secondsRemaining={secondsRemaining}
          intervalMinutes={settings.reminderIntervalMinutes}
          notificationsEnabled={settings.notificationsEnabled}
          notificationPermission={notificationPermission}
          isWithinActiveHours={isWithinActiveHours}
          onRequestPermission={handleRequestPermission}
          onSnooze={() => snooze()}
          onTestNotification={handleTestNotification}
        />
      </section>

      {/* Today summary footer badges */}
      <footer className="w-full mt-5 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400 z-10">
        <span className="flex items-center gap-1.5">
          <Trophy size={14} className="text-amber-400" />
          <span>{todayLogs.length} sips logged today</span>
        </span>
        <span className="text-[11px] text-slate-500 font-mono">
          Remaining: {Math.max(0, dailyGoal - todayTotal)}ml
        </span>
      </footer>

      {/* Reset Confirmation Dialog */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-xs bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-2xl">
            <div className="flex items-center gap-2.5 mb-2 text-rose-400">
              <RotateCcw size={20} />
              <h3 className="text-base font-bold text-white">Reset Today?</h3>
            </div>
            <p className="text-xs text-slate-300 mb-4 leading-relaxed">
              This will reset today's intake back to 0 ml. Don't worry, you can still tap <strong>Undo</strong> if you change your mind!
            </p>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setShowResetConfirm(false)}
                className="px-3.5 py-2.5 rounded-xl text-xs font-semibold text-slate-300 bg-slate-800 hover:bg-slate-700 transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmReset}
                className="px-3.5 py-2.5 rounded-xl text-xs font-semibold text-white bg-rose-600 hover:bg-rose-500 shadow-md shadow-rose-600/30 transition cursor-pointer"
              >
                Yes, Reset
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modals */}
      <HistoryModal
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        logs={todayLogs}
        history={history}
        onDeleteLog={removeWaterLog}
        onResetToday={resetToday}
        dailyGoal={dailyGoal}
      />

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onUpdate={updateSettings}
        notificationPermission={notificationPermission}
        onRequestPermission={handleRequestPermission}
      />
    </main>
  );
}

export default App;
