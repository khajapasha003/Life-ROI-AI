import React, { useState, useEffect } from 'react';
import {
  Bell,
  Clock,
  CheckCircle2,
  AlertCircle,
  X,
  Smartphone,
  Sparkles,
  Volume2,
  Calendar,
  Send,
} from 'lucide-react';
import {
  getSavedNotificationSettings,
  saveNotificationSettings,
  scheduleEveningNotification,
  cancelEveningNotification,
  triggerImmediateTestNotification,
  checkNotificationPermission,
  NotificationSettings,
} from '../utils/notificationService';
import { Capacitor } from '@capacitor/core';

interface NotificationSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSettingsSaved?: (settings: NotificationSettings) => void;
}

const PRESET_TIMES = [
  { label: '7:00 PM', hour: 19, minute: 0, tag: 'Post-Work Winddown' },
  { label: '8:30 PM', hour: 20, minute: 30, tag: 'Golden Hour (Recommended)' },
  { label: '9:30 PM', hour: 21, minute: 30, tag: 'Pre-Sleep Reconciliation' },
];

export const NotificationSettingsModal: React.FC<NotificationSettingsModalProps> = ({
  isOpen,
  onClose,
  onSettingsSaved,
}) => {
  const [settings, setSettings] = useState<NotificationSettings>(getSavedNotificationSettings);
  const [permStatus, setPermStatus] = useState<'granted' | 'denied' | 'prompt'>('prompt');
  const [isTesting, setIsTesting] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setSettings(getSavedNotificationSettings());
      checkNotificationPermission().then(setPermStatus);
      setStatusMessage(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleToggle = () => {
    setSettings((prev) => ({ ...prev, enabled: !prev.enabled }));
  };

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const [h, m] = e.target.value.split(':').map(Number);
    if (!isNaN(h) && !isNaN(m)) {
      setSettings((prev) => ({ ...prev, hour: h, minute: m }));
    }
  };

  const handleApplyPreset = (h: number, m: number) => {
    setSettings((prev) => ({ ...prev, hour: h, minute: m }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    setStatusMessage(null);

    try {
      if (settings.enabled) {
        const success = await scheduleEveningNotification(settings.hour, settings.minute);
        if (success) {
          setStatusMessage('Evening reminder scheduled successfully!');
          setPermStatus('granted');
        } else {
          setStatusMessage('Could not activate notifications. Please grant notification permission.');
        }
      } else {
        await cancelEveningNotification();
        setStatusMessage('Evening reminder deactivated.');
      }

      onSettingsSaved?.(settings);
      setTimeout(() => {
        setIsSaving(false);
        onClose();
      }, 900);
    } catch (err: any) {
      setStatusMessage(`Error: ${err.message || 'Failed to save settings'}`);
      setIsSaving(false);
    }
  };

  const handleTestNow = async () => {
    setIsTesting(true);
    setStatusMessage(null);
    try {
      const delivered = await triggerImmediateTestNotification();
      if (delivered) {
        setStatusMessage('Test notification dispatched! Check your device or browser notifications.');
        setPermStatus('granted');
      } else {
        setStatusMessage('Notification permission denied or blocked in system settings.');
        setPermStatus('denied');
      }
    } catch {
      setStatusMessage('Failed to trigger test notification.');
    } finally {
      setIsTesting(false);
    }
  };

  const formattedTime = `${String(settings.hour).padStart(2, '0')}:${String(
    settings.minute
  ).padStart(2, '0')}`;

  const isNative = Capacitor.isNativePlatform();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl p-6 text-zinc-100 space-y-5 max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-white tracking-tight">
                  Evening Habit &amp; Expense Check-in
                </h2>
                <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-400 border border-zinc-700">
                  {isNative ? 'Capacitor Android' : 'Web Push / Local'}
                </span>
              </div>
              <p className="text-xs text-zinc-400 mt-0.5">
                Automated local notifications to ensure zero-willpower consistency.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Master Toggle */}
        <div className="p-4 rounded-xl bg-zinc-950/80 border border-zinc-800/80 flex items-center justify-between">
          <div className="space-y-0.5">
            <span className="text-xs font-semibold text-zinc-200">
              Daily Evening Push Notification
            </span>
            <p className="text-[11px] text-zinc-400">
              Dispatches every day to lock in micro-habits &amp; calculate daily leak run-rate.
            </p>
          </div>

          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={settings.enabled}
              onChange={handleToggle}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-zinc-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
          </label>
        </div>

        {/* Time Selector & Presets */}
        {settings.enabled && (
          <div className="space-y-3.5 animate-in fade-in duration-200">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-300 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-amber-400" />
                <span>Scheduled Time</span>
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="time"
                  value={formattedTime}
                  onChange={handleTimeChange}
                  className="px-3.5 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-sm font-mono text-zinc-100 focus:outline-none focus:border-amber-500/60"
                />
                <span className="text-xs text-zinc-400">
                  Every evening at {formattedTime}
                </span>
              </div>
            </div>

            {/* Presets */}
            <div className="space-y-1.5">
              <div className="text-[11px] font-medium text-zinc-400 uppercase tracking-wider">
                Recommended Check-in Windows:
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {PRESET_TIMES.map((preset) => {
                  const isSelected =
                    settings.hour === preset.hour && settings.minute === preset.minute;
                  return (
                    <button
                      key={preset.label}
                      onClick={() => handleApplyPreset(preset.hour, preset.minute)}
                      className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-amber-500/10 border-amber-500/40 text-amber-300'
                          : 'bg-zinc-950 hover:bg-zinc-800 border-zinc-800/80 text-zinc-300'
                      }`}
                    >
                      <div className="text-xs font-mono font-bold">{preset.label}</div>
                      <div className="text-[10px] text-zinc-400 mt-0.5 line-clamp-1">
                        {preset.tag}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Live Notification Mockup Preview */}
            <div className="space-y-1.5">
              <div className="text-[11px] font-medium text-zinc-400 uppercase tracking-wider flex items-center justify-between">
                <span>Notification Preview:</span>
                <span className="text-[10px] text-zinc-500">Android / iOS Lockscreen</span>
              </div>
              <div className="p-3.5 rounded-xl bg-zinc-950 border border-zinc-800 space-y-1.5 shadow-inner">
                <div className="flex items-center justify-between text-[11px] text-zinc-400">
                  <div className="flex items-center gap-1.5">
                    <div className="w-4 h-4 rounded bg-emerald-500 flex items-center justify-center text-[10px] font-bold text-black">
                      L
                    </div>
                    <span className="font-semibold text-zinc-200">LifeROI</span>
                    <span>•</span>
                    <span className="text-zinc-500">Every day at {formattedTime}</span>
                  </div>
                  <Volume2 className="w-3.5 h-3.5 text-zinc-500" />
                </div>
                <div className="text-xs font-bold text-zinc-100 flex items-center gap-1">
                  <span>LifeROI Evening Audit 🎯</span>
                </div>
                <p className="text-[11px] text-zinc-400 leading-snug">
                  Lock in your daily micro-habits &amp; log today's expenses to protect your discipline streak!
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Status Message */}
        {statusMessage && (
          <div
            className={`p-3 rounded-xl border text-xs flex items-center gap-2 ${
              statusMessage.toLowerCase().includes('error') ||
              statusMessage.toLowerCase().includes('denied')
                ? 'bg-rose-950/30 border-rose-800/40 text-rose-300'
                : 'bg-emerald-950/30 border-emerald-800/40 text-emerald-300'
            }`}
          >
            {statusMessage.toLowerCase().includes('error') ||
            statusMessage.toLowerCase().includes('denied') ? (
              <AlertCircle className="w-4 h-4 shrink-0" />
            ) : (
              <CheckCircle2 className="w-4 h-4 shrink-0" />
            )}
            <span>{statusMessage}</span>
          </div>
        )}

        {/* Footer Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2.5 pt-2 border-t border-zinc-800/80">
          <button
            onClick={handleTestNow}
            disabled={isTesting}
            className="w-full sm:w-auto px-3.5 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs font-semibold text-zinc-200 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            <Send className="w-3.5 h-3.5" />
            <span>{isTesting ? 'Sending...' : 'Send Test Notification'}</span>
          </button>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={onClose}
              className="flex-1 sm:flex-initial px-4 py-2 rounded-xl bg-zinc-800/50 hover:bg-zinc-800 text-xs font-medium text-zinc-300 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="flex-1 sm:flex-initial px-5 py-2 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-xs font-semibold text-zinc-950 transition-colors shadow-md cursor-pointer flex items-center justify-center gap-1.5"
            >
              {isSaving ? 'Activating...' : 'Save & Activate'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
