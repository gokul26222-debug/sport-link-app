export function isNotificationSupported(): boolean {
  return "Notification" in window;
}

export async function requestNotificationPermission(): Promise<boolean> {
  if (!isNotificationSupported()) return false;
  const permission = await Notification.requestPermission();
  return permission === "granted";
}

export function sendLocalNotification(title: string, body: string, icon?: string): void {
  if (!isNotificationSupported() || Notification.permission !== "granted") return;
  new Notification(title, {
    body,
    icon: icon || "/icon-192.png",
    badge: "/icon-192.png",
  });
}

export function scheduleGameReminder(gameTitle: string, gameTime: Date): number | null {
  const msUntilReminder = gameTime.getTime() - Date.now() - 3600000;
  if (msUntilReminder <= 0) return null;

  const timerId = window.setTimeout(() => {
    sendLocalNotification(
      "Game starting soon! 🎮",
      `${gameTitle} starts in 1 hour. Get ready!`
    );
  }, msUntilReminder);

  return timerId;
}

export function registerServiceWorker(): void {
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("/sw.js").catch(() => {});
  }
}
