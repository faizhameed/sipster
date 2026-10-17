// Notification manager for Web & Service Worker

export async function requestNotificationPermission(): Promise<NotificationPermission> {
  if (!('Notification' in window)) {
    console.warn('Notifications not supported by browser');
    return 'denied';
  }

  let permission = Notification.permission;
  if (permission === 'default') {
    permission = await Notification.requestPermission();
  }
  return permission;
}

export function isNotificationSupported(): boolean {
  return typeof window !== 'undefined' && 'Notification' in window;
}

export function getNotificationStatus(): NotificationPermission {
  if (!isNotificationSupported()) return 'denied';
  return Notification.permission;
}

const HYDRATION_MESSAGES = [
  "Time for a sip! Keep your body energized and mind clear 💧",
  "Hydration check! Drink a glass of water right now 🥤",
  "Your body is asking for water! Pause for a refreshing sip 🌊",
  "Stay healthy & hydrated! Grab your water bottle 💦",
  "Quick water break! You're making great progress today ✨",
  "Sip, refresh, repeat! It's hydration o'clock 💧",
];

export async function sendHydrationNotification(customBody?: string) {
  const randomMsg = HYDRATION_MESSAGES[Math.floor(Math.random() * HYDRATION_MESSAGES.length)];
  const bodyText = customBody || randomMsg;

  // Try service worker notification first (works reliably on mobile PWAs)
  if ('serviceWorker' in navigator) {
    try {
      const reg = await navigator.serviceWorker.ready;
      if (reg && reg.showNotification) {
        // Cast options to any to allow modern PWA vibration and tag options safely
        const pwaOptions: NotificationOptions & { vibrate?: number[]; renotify?: boolean } = {
          body: bodyText,
          icon: '/icon.svg',
          badge: '/icon.svg',
          tag: 'sipster-reminder',
          vibrate: [200, 100, 200],
          renotify: true,
        };
        await reg.showNotification('Sipster Reminder 💧', pwaOptions);
        return;
      }
    } catch (e) {
      console.warn('Service worker notification failed, falling back to desktop Notification API:', e);
    }
  }

  // Fallback to standard web notification
  if ('Notification' in window && Notification.permission === 'granted') {
    new Notification('Sipster Reminder 💧', {
      body: bodyText,
      icon: '/icon.svg',
      tag: 'sipster-reminder',
    });
  }
}
