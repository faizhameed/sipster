import React from 'react';
import { Settings as SettingsIcon, Volume2, VolumeX, Bell, BellOff, Clock, Target, Moon } from 'lucide-react';
import type { UserSettings } from '../types';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: UserSettings;
  onUpdate: (updated: Partial<UserSettings>) => void;
  notificationPermission: NotificationPermission;
  onRequestPermission: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onUpdate,
  notificationPermission,
  onRequestPermission,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-slate-900 border-t sm:border border-slate-800 rounded-t-3xl sm:rounded-2xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-4 px-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <SettingsIcon size={20} className="text-sky-400" />
            <h3 className="text-base font-bold text-white">Hydration Settings</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
          >
            ✕
          </button>
        </div>

        <div className="p-5 overflow-y-auto space-y-5">
          {/* Daily Goal */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <Target size={14} className="text-sky-400" />
              Daily Water Target
            </label>
            <div className="grid grid-cols-4 gap-2">
              {[2000, 2500, 3000, 3500].map((val) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => onUpdate({ dailyGoal: val })}
                  className={`py-2 text-xs font-bold rounded-xl border transition ${
                    settings.dailyGoal === val
                      ? 'bg-sky-500 text-white border-sky-400 shadow-md shadow-sky-500/20'
                      : 'bg-slate-950/60 text-slate-300 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  {val / 1000}L
                </button>
              ))}
            </div>
            <div className="pt-1">
              <input
                type="range"
                min="1000"
                max="5000"
                step="100"
                value={settings.dailyGoal}
                onChange={(e) => onUpdate({ dailyGoal: Number(e.target.value) })}
                className="w-full accent-sky-500"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                <span>1000ml</span>
                <span className="text-sky-400 font-bold">{settings.dailyGoal}ml</span>
                <span>5000ml</span>
              </div>
            </div>
          </div>

          {/* Reminder Interval */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <Clock size={14} className="text-sky-400" />
              Reminder Frequency
            </label>
            <div className="grid grid-cols-4 gap-2">
              {[30, 45, 60, 90].map((mins) => (
                <button
                  key={mins}
                  type="button"
                  onClick={() => onUpdate({ reminderIntervalMinutes: mins })}
                  className={`py-2 text-xs font-bold rounded-xl border transition ${
                    settings.reminderIntervalMinutes === mins
                      ? 'bg-sky-500 text-white border-sky-400 shadow-md shadow-sky-500/20'
                      : 'bg-slate-950/60 text-slate-300 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  {mins} min
                </button>
              ))}
            </div>
          </div>

          {/* Active Hours (Wake & Sleep) */}
          <div className="space-y-2 bg-slate-950/50 p-3.5 rounded-2xl border border-slate-800/80">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-300">
              <Moon size={14} className="text-indigo-400" />
              Active Hours (Do Not Disturb at night)
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <span className="text-[10px] text-slate-400 block mb-1">Start Time (Wake)</span>
                <input
                  type="time"
                  value={settings.startTime}
                  onChange={(e) => onUpdate({ startTime: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white"
                />
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block mb-1">End Time (Sleep)</span>
                <input
                  type="time"
                  value={settings.endTime}
                  onChange={(e) => onUpdate({ endTime: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white"
                />
              </div>
            </div>
          </div>

          {/* Sound & Notifications Toggles */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950/60 border border-slate-800">
              <div className="flex items-center gap-2.5">
                {settings.notificationsEnabled ? (
                  <Bell size={18} className="text-sky-400" />
                ) : (
                  <BellOff size={18} className="text-slate-500" />
                )}
                <div>
                  <div className="text-xs font-semibold text-white">Browser Notifications</div>
                  <div className="text-[10px] text-slate-400">
                    {notificationPermission === 'granted'
                      ? 'Chrome notifications enabled'
                      : 'Permission needed'}
                  </div>
                </div>
              </div>
              <button
                onClick={() => {
                  if (notificationPermission !== 'granted') {
                    onRequestPermission();
                  } else {
                    onUpdate({ notificationsEnabled: !settings.notificationsEnabled });
                  }
                }}
                className={`w-11 h-6 rounded-full transition-colors relative p-0.5 ${
                  settings.notificationsEnabled && notificationPermission === 'granted'
                    ? 'bg-sky-500'
                    : 'bg-slate-700'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white transition-transform ${
                    settings.notificationsEnabled && notificationPermission === 'granted'
                      ? 'translate-x-5'
                      : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950/60 border border-slate-800">
              <div className="flex items-center gap-2.5">
                {settings.soundEnabled ? (
                  <Volume2 size={18} className="text-sky-400" />
                ) : (
                  <VolumeX size={18} className="text-slate-500" />
                )}
                <div>
                  <div className="text-xs font-semibold text-white">Water Droplet & Chime Sound</div>
                  <div className="text-[10px] text-slate-400">Audio feedback on drinks and reminders</div>
                </div>
              </div>
              <button
                onClick={() => onUpdate({ soundEnabled: !settings.soundEnabled })}
                className={`w-11 h-6 rounded-full transition-colors relative p-0.5 ${
                  settings.soundEnabled ? 'bg-sky-500' : 'bg-slate-700'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white transition-transform ${
                    settings.soundEnabled ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-full py-3 bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs rounded-xl shadow-lg transition mt-2"
          >
            Save & Done
          </button>
        </div>
      </div>
    </div>
  );
};
