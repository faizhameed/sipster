import React from 'react';
import { History as HistoryIcon, Trash2, Calendar } from 'lucide-react';
import type { DrinkLog } from '../types';

interface HistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  logs: DrinkLog[];
  history: Record<string, number>;
  onDeleteLog: (id: string) => void;
  onResetToday: () => void;
  dailyGoal: number;
}

export const HistoryModal: React.FC<HistoryModalProps> = ({
  isOpen,
  onClose,
  logs,
  history,
  onDeleteLog,
  onResetToday,
  dailyGoal,
}) => {
  if (!isOpen) return null;

  // Last 7 days history
  const past7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const dateKey = `${year}-${month}-${day}`;
    const dayName = d.toLocaleDateString(undefined, { weekday: 'short' });
    const amount = history[dateKey] || 0;
    const pct = Math.min(100, Math.round((amount / dailyGoal) * 100));
    return { dateKey, dayName, amount, pct, isToday: i === 6 };
  });

  const formatLogTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatLogDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString([], { month: 'short', day: 'numeric' });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-slate-900 border-t sm:border border-slate-800 rounded-t-3xl sm:rounded-2xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-4 px-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <HistoryIcon size={20} className="text-sky-400" />
            <h3 className="text-base font-bold text-white">Hydration History</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
          >
            ✕
          </button>
        </div>

        <div className="p-5 overflow-y-auto space-y-6">
          {/* 7-Day Chart Bar */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <Calendar size={14} className="text-sky-400" />
                Past 7 Days
              </span>
              <span className="text-[11px] text-slate-400">Goal: {dailyGoal}ml</span>
            </div>

            <div className="grid grid-cols-7 gap-2 bg-slate-950/60 p-3 rounded-2xl border border-slate-800/80">
              {past7Days.map((day) => (
                <div key={day.dateKey} className="flex flex-col items-center">
                  <div className="relative w-full h-24 bg-slate-800/40 rounded-lg flex items-end overflow-hidden">
                    <div
                      className={`w-full transition-all duration-500 rounded-b-md ${
                        day.pct >= 100
                          ? 'bg-gradient-to-t from-emerald-600 to-emerald-400'
                          : 'bg-gradient-to-t from-sky-600 to-sky-400'
                      }`}
                      style={{ height: `${day.pct}%` }}
                    />
                  </div>
                  <span className={`text-[10px] mt-1.5 font-medium ${day.isToday ? 'text-sky-400 font-bold' : 'text-slate-400'}`}>
                    {day.dayName}
                  </span>
                  <span className="text-[9px] text-slate-500 font-mono">
                    {day.amount > 0 ? `${(day.amount / 1000).toFixed(1)}L` : '0'}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Detailed Drink Log List */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-300">Recent Intakes</span>
              {logs.length > 0 && (
                <button
                  onClick={onResetToday}
                  className="text-[11px] text-rose-400 hover:text-rose-300 transition flex items-center gap-1"
                >
                  <Trash2 size={12} />
                  <span>Clear Today</span>
                </button>
              )}
            </div>

            {logs.length === 0 ? (
              <div className="text-center py-8 text-slate-500 text-xs">
                No logs recorded yet. Tap on the water droplet to start tracking!
              </div>
            ) : (
              <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                {logs.slice(0, 30).map((log) => (
                  <div
                    key={log.id}
                    className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950/40 border border-slate-800/60"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-sky-500/15 flex items-center justify-center text-sky-400 font-bold text-xs">
                        💧
                      </div>
                      <div>
                        <div className="text-xs font-semibold text-white">+{log.amount} ml</div>
                        <div className="text-[10px] text-slate-400">
                          {formatLogDate(log.timestamp)} at {formatLogTime(log.timestamp)}
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => onDeleteLog(log.id)}
                      className="p-1.5 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition"
                      title="Delete entry"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
