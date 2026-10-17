import { useEffect, useRef, useState } from 'react';
import type { UserSettings } from '../types';
import { playReminderChime } from '../utils/audio';
import { sendHydrationNotification } from '../utils/notifications';

interface ReminderManagerProps {
  settings: UserSettings;
  lastDrinkTimestamp: number | null;
  onReminderTriggered?: () => void;
}

export function useReminderScheduler({ settings, lastDrinkTimestamp }: ReminderManagerProps) {
  const [secondsRemaining, setSecondsRemaining] = useState<number | null>(null);
  const [isWithinActiveHours, setIsWithinActiveHours] = useState(true);
  const lastAlertTimeRef = useRef<number>(0);

  // Check if current time falls within user's configured active wake window
  const checkWithinHours = () => {
    const now = new Date();
    const currentMins = now.getHours() * 60 + now.getMinutes();

    const [startH, startM] = settings.startTime.split(':').map(Number);
    const [endH, endM] = settings.endTime.split(':').map(Number);
    const startMins = startH * 60 + startM;
    const endMins = endH * 60 + endM;

    if (startMins <= endMins) {
      return currentMins >= startMins && currentMins <= endMins;
    } else {
      // Over midnight case (e.g. 20:00 to 04:00)
      return currentMins >= startMins || currentMins <= endMins;
    }
  };

  useEffect(() => {
    const intervalMs = settings.reminderIntervalMinutes * 60 * 1000;

    const timer = setInterval(() => {
      const withinHours = checkWithinHours();
      setIsWithinActiveHours(withinHours);

      const baseTimestamp = lastDrinkTimestamp || Date.now();
      const nextDueTimestamp = baseTimestamp + intervalMs;
      const diffMs = nextDueTimestamp - Date.now();

      if (diffMs <= 0) {
        setSecondsRemaining(0);

        // Prevent firing multiple times in same minute
        const nowMs = Date.now();
        if (withinHours && settings.notificationsEnabled && (nowMs - lastAlertTimeRef.current > 60000)) {
          lastAlertTimeRef.current = nowMs;

          if (settings.soundEnabled) {
            playReminderChime();
          }
          sendHydrationNotification();
        }
      } else {
        setSecondsRemaining(Math.max(0, Math.floor(diffMs / 1000)));
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [settings, lastDrinkTimestamp]);

  const snooze = (minutes: number = settings.smartSnoozeMinutes) => {
    const fakeDrinkTimestamp = Date.now() - (settings.reminderIntervalMinutes - minutes) * 60 * 1000;
    // We adjust local state or let caller reset
    setSecondsRemaining(minutes * 60);
    return fakeDrinkTimestamp;
  };

  return {
    secondsRemaining,
    isWithinActiveHours,
    snooze,
  };
}
