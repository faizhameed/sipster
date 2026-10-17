import React from 'react';
import { Bell, BellOff, Clock } from 'lucide-react';

interface ReminderCardProps {
  secondsRemaining: number | null;
  intervalMinutes: number;
  notificationsEnabled: boolean;
  notificationPermission: NotificationPermission;
  isWithinActiveHours: boolean;
  onRequestPermission: () => void;
  onSnooze: () => void;
  onTestNotification: () => void;
}

export const ReminderCard: React.FC<ReminderCardProps> = ({
  secondsRemaining,
  intervalMinutes,
  notificationsEnabled: _notificationsEnabled,
  notificationPermission,
  isWithinActiveHours,
  onRequestPermission,
  onSnooze,
  onTestNotification,
}) => {
  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const s = secs % 60;
    return `${mins}:${s < 10 ? '0' : ''}${s}`;
  };

  const isDue = secondsRemaining !== null && secondsRemaining <= 0;

  return (
    <div className="w-full glass-card rounded-2xl p-4 border border-sky-500/20 shadow-lg">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-sky-500/15 text-sky-400">
            <Clock size={18} />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-white">Hydration Timer</h4>
            <p className="text-[11px] text-slate-400">Every {intervalMinutes} minutes</p>
          </div>
        </div>

        {notificationPermission === 'granted' ? (
          <span className="flex items-center gap-1 text-[11px] font-medium text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Active
          </span>
        ) : (
          <button
            onClick={onRequestPermission}
            className="flex items-center gap-1 text-[11px] font-medium text-amber-300 bg-amber-500/15 hover:bg-amber-500/25 px-2.5 py-1 rounded-full border border-amber-500/30 transition cursor-pointer"
          >
            <Bell size={12} />
            <span>Enable alerts</span>
          </button>
        )}
      </div>

      <div className="flex items-center justify-between bg-slate-900/60 rounded-xl p-3 border border-white/5">
        <div>
          <span className="text-[11px] text-slate-400 block font-medium">Next reminder in</span>
          <span className={`text-2xl font-bold font-mono tracking-tight ${isDue ? 'text-amber-400 animate-bounce' : 'text-sky-300'}`}>
            {!isWithinActiveHours
              ? 'Sleeping'
              : secondsRemaining !== null
              ? isDue
                ? 'Time to Drink! 💧'
                : formatTime(secondsRemaining)
              : '--:--'}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onSnooze}
            className="px-3 py-1.5 text-xs font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 rounded-lg border border-slate-700 transition active:scale-95 cursor-pointer"
            title="Snooze 15 minutes"
          >
            +15m Snooze
          </button>
          <button
            onClick={onTestNotification}
            className="p-1.5 text-sky-400 bg-sky-500/10 hover:bg-sky-500/20 rounded-lg border border-sky-500/20 transition active:scale-95 cursor-pointer"
            title="Send test web notification"
          >
            <Bell size={16} />
          </button>
        </div>
      </div>

      {notificationPermission !== 'granted' && (
        <div className="mt-2.5 px-3 py-2 bg-amber-950/30 border border-amber-600/30 rounded-xl flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BellOff size={14} className="text-amber-400 shrink-0" />
            <p className="text-[11px] text-amber-200/90 leading-tight">
              Turn on Chrome web notifications so you get alerted when you're working or on the go!
            </p>
          </div>
          <button
            onClick={onRequestPermission}
            className="ml-2 shrink-0 px-2.5 py-1 bg-amber-500 text-slate-950 font-bold text-[11px] rounded-lg shadow transition hover:bg-amber-400"
          >
            Allow
          </button>
        </div>
      )}
    </div>
  );
};
