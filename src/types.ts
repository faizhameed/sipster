export interface DrinkLog {
  id: string;
  amount: number; // in ml
  timestamp: number; // epoch ms
}

export interface DayRecord {
  date: string; // YYYY-MM-DD
  total: number;
  goal: number;
}

export interface UserSettings {
  dailyGoal: number; // default: 2500 ml
  containerSize: number; // default quick add: 250 ml
  reminderIntervalMinutes: number; // e.g. 45, 60, 90 mins
  startTime: string; // e.g. "08:00"
  endTime: string; // e.g. "22:00"
  soundEnabled: boolean;
  notificationsEnabled: boolean;
  smartSnoozeMinutes: number; // default 15
}

export interface HydrationState {
  settings: UserSettings;
  logs: DrinkLog[];
  lastDrinkTimestamp: number | null;
  history: Record<string, number>; // date "YYYY-MM-DD" -> total ml
}
