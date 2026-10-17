import { useState, useEffect, useRef } from 'react';
import type { DrinkLog, HydrationState, UserSettings } from '../types';

const STORAGE_KEY = 'sipster_hydration_v1';

export function getTodayKey(): string {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

const DEFAULT_SETTINGS: UserSettings = {
  dailyGoal: 2500,
  containerSize: 250,
  reminderIntervalMinutes: 60,
  startTime: '08:00',
  endTime: '22:00',
  soundEnabled: true,
  notificationsEnabled: true,
  smartSnoozeMinutes: 15,
};

function getInitialState(): HydrationState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return {
        settings: { ...DEFAULT_SETTINGS, ...(parsed.settings || {}) },
        logs: Array.isArray(parsed.logs) ? parsed.logs : [],
        lastDrinkTimestamp: parsed.lastDrinkTimestamp || null,
        history: parsed.history || {},
      };
    }
  } catch (err) {
    console.error('Failed to parse localStorage hydration state:', err);
  }

  return {
    settings: DEFAULT_SETTINGS,
    logs: [],
    lastDrinkTimestamp: null,
    history: {},
  };
}

export function useHydration() {
  const [state, setState] = useState<HydrationState>(getInitialState);
  
  // History stack for undo capability (stores up to 20 past states)
  const [pastStates, setPastStates] = useState<HydrationState[]>([]);
  const currentStateRef = useRef<HydrationState>(state);
  currentStateRef.current = state;

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      console.error('Could not save to localStorage', e);
    }
  }, [state]);

  const todayKey = getTodayKey();

  // Filter logs for today only
  const todayLogs = state.logs.filter((log) => {
    const logDate = new Date(log.timestamp);
    const key = `${logDate.getFullYear()}-${String(logDate.getMonth() + 1).padStart(2, '0')}-${String(logDate.getDate()).padStart(2, '0')}`;
    return key === todayKey;
  });

  const todayTotal = todayLogs.reduce((acc, curr) => acc + curr.amount, 0);

  // Helper to push to undo stack before mutating
  const pushPastState = () => {
    setPastStates((prev) => [...prev.slice(-19), currentStateRef.current]);
  };

  // Undo last action (reverts to previous state)
  const undo = () => {
    if (pastStates.length === 0) return false;
    const previous = pastStates[pastStates.length - 1];
    setPastStates((prev) => prev.slice(0, prev.length - 1));
    setState(previous);
    return true;
  };

  // Add water intake
  const addWater = (amount: number) => {
    pushPastState();

    const newLog: DrinkLog = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      amount,
      timestamp: Date.now(),
    };

    setState((prev) => {
      const updatedLogs = [newLog, ...prev.logs];
      const newTodayTotal = todayTotal + amount;
      return {
        ...prev,
        logs: updatedLogs,
        lastDrinkTimestamp: newLog.timestamp,
        history: {
          ...prev.history,
          [todayKey]: newTodayTotal,
        },
      };
    });

    return newLog;
  };

  // Remove specific drink entry
  const removeWaterLog = (id: string) => {
    pushPastState();

    setState((prev) => {
      const target = prev.logs.find((l) => l.id === id);
      if (!target) return prev;
      const updatedLogs = prev.logs.filter((l) => l.id !== id);
      
      const newTodayTotal = Math.max(0, todayTotal - target.amount);
      return {
        ...prev,
        logs: updatedLogs,
        history: {
          ...prev.history,
          [todayKey]: newTodayTotal,
        },
      };
    });
  };

  // Reset today's progress (with undo snapshot preserved)
  const resetToday = () => {
    pushPastState();

    setState((prev) => {
      const nonTodayLogs = prev.logs.filter((log) => {
        const logDate = new Date(log.timestamp);
        const key = `${logDate.getFullYear()}-${String(logDate.getMonth() + 1).padStart(2, '0')}-${String(logDate.getDate()).padStart(2, '0')}`;
        return key !== todayKey;
      });

      return {
        ...prev,
        logs: nonTodayLogs,
        lastDrinkTimestamp: nonTodayLogs.length > 0 ? nonTodayLogs[0].timestamp : null,
        history: {
          ...prev.history,
          [todayKey]: 0,
        },
      };
    });
  };

  // Update Settings
  const updateSettings = (partial: Partial<UserSettings>) => {
    setState((prev) => ({
      ...prev,
      settings: {
        ...prev.settings,
        ...partial,
      },
    }));
  };

  return {
    settings: state.settings,
    logs: state.logs,
    todayLogs,
    todayTotal,
    dailyGoal: state.settings.dailyGoal,
    lastDrinkTimestamp: state.lastDrinkTimestamp,
    history: state.history,
    canUndo: pastStates.length > 0,
    undo,
    addWater,
    removeWaterLog,
    resetToday,
    updateSettings,
  };
}
