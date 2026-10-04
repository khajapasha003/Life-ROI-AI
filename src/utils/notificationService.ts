import { LocalNotifications } from '@capacitor/local-notifications';
import { Capacitor } from '@capacitor/core';

export const EVENING_NOTIFICATION_ID = 1001;
export const TEST_NOTIFICATION_ID = 1002;
const NOTIFICATION_STORAGE_KEY = 'liferoi_notification_settings';

export interface NotificationSettings {
  enabled: boolean;
  hour: number;
  minute: number;
  lastScheduled?: string;
}

export const DEFAULT_NOTIFICATION_SETTINGS: NotificationSettings = {
  enabled: true,
  hour: 20,
  minute: 30, // 8:30 PM
};

export function getSavedNotificationSettings(): NotificationSettings {
  try {
    const raw = localStorage.getItem(NOTIFICATION_STORAGE_KEY);
    if (raw) {
      return { ...DEFAULT_NOTIFICATION_SETTINGS, ...JSON.parse(raw) };
    }
  } catch (e) {
    console.warn('Failed to load notification settings from localStorage', e);
  }
  return DEFAULT_NOTIFICATION_SETTINGS;
}

export function saveNotificationSettings(settings: NotificationSettings): void {
  try {
    localStorage.setItem(NOTIFICATION_STORAGE_KEY, JSON.stringify(settings));
  } catch (e) {
    console.warn('Failed to save notification settings to localStorage', e);
  }
}

/**
 * Check permission status across Native Capacitor and Web
 */
export async function checkNotificationPermission(): Promise<'granted' | 'denied' | 'prompt'> {
  try {
    if (Capacitor.isNativePlatform()) {
      const status = await LocalNotifications.checkPermissions();
      if (status.display === 'granted') return 'granted';
      if (status.display === 'denied') return 'denied';
      return 'prompt';
    } else if (typeof window !== 'undefined' && 'Notification' in window) {
      const perm = Notification.permission;
      if (perm === 'granted') return 'granted';
      if (perm === 'denied') return 'denied';
      return 'prompt';
    }
  } catch (err) {
    console.warn('Error checking notification permission:', err);
  }
  return 'prompt';
}

/**
 * Request permission across Native Capacitor and Web
 */
export async function requestNotificationPermission(): Promise<boolean> {
  try {
    if (Capacitor.isNativePlatform()) {
      const req = await LocalNotifications.requestPermissions();
      return req.display === 'granted';
    } else if (typeof window !== 'undefined' && 'Notification' in window) {
      const perm = await Notification.requestPermission();
      return perm === 'granted';
    }
  } catch (err) {
    console.warn('Error requesting notification permission:', err);
  }
  return false;
}

/**
 * Schedule recurring evening reminder
 */
export async function scheduleEveningNotification(
  hour: number = 20,
  minute: number = 30
): Promise<boolean> {
  const permGranted = await requestNotificationPermission();
  if (!permGranted) {
    console.warn('Notification permission not granted.');
    return false;
  }

  try {
    if (Capacitor.isNativePlatform()) {
      // First cancel existing evening notification
      await LocalNotifications.cancel({
        notifications: [{ id: EVENING_NOTIFICATION_ID }],
      }).catch(() => {});

      // Calculate next trigger time
      const now = new Date();
      const scheduledDate = new Date();
      scheduledDate.setHours(hour, minute, 0, 0);

      // If scheduled time has already passed today, set to tomorrow
      if (scheduledDate.getTime() <= now.getTime()) {
        scheduledDate.setDate(scheduledDate.getDate() + 1);
      }

      await LocalNotifications.schedule({
        notifications: [
          {
            id: EVENING_NOTIFICATION_ID,
            title: 'LifeROI Evening Audit 🎯',
            body: "Lock in your daily micro-habits & log today's expenses to protect your discipline streak!",
            schedule: {
              at: scheduledDate,
              repeats: true,
              every: 'day',
            },
            sound: 'beep.wav',
            attachments: undefined,
            actionTypeId: '',
            extra: {
              route: '/audit',
              type: 'evening_reminder',
            },
          },
        ],
      });
    }

    saveNotificationSettings({
      enabled: true,
      hour,
      minute,
      lastScheduled: new Date().toISOString(),
    });

    return true;
  } catch (err) {
    console.error('Failed to schedule local notification:', err);
    return false;
  }
}

/**
 * Cancel scheduled reminder
 */
export async function cancelEveningNotification(): Promise<void> {
  try {
    if (Capacitor.isNativePlatform()) {
      await LocalNotifications.cancel({
        notifications: [{ id: EVENING_NOTIFICATION_ID }],
      }).catch(() => {});
    }
  } catch (err) {
    console.warn('Error cancelling notification:', err);
  }

  const current = getSavedNotificationSettings();
  saveNotificationSettings({
    ...current,
    enabled: false,
  });
}

/**
 * Trigger an immediate test notification to verify delivery
 */
export async function triggerImmediateTestNotification(): Promise<boolean> {
  const permGranted = await requestNotificationPermission();
  if (!permGranted) {
    return false;
  }

  const title = 'LifeROI Evening Audit 🎯';
  const body = 'Test Notification: Daily habit & expense check-in is active! Your discipline streak is guarded.';

  try {
    if (Capacitor.isNativePlatform()) {
      await LocalNotifications.schedule({
        notifications: [
          {
            id: TEST_NOTIFICATION_ID,
            title,
            body,
            schedule: {
              at: new Date(Date.now() + 1000), // 1 second from now
            },
          },
        ],
      });
      return true;
    } else if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
      new Notification(title, {
        body,
        icon: '/favicon.ico',
      });
      return true;
    }
  } catch (err) {
    console.error('Failed to trigger immediate notification:', err);
  }
  return false;
}
