import React, { useEffect, useState } from 'react';
import { AlertTriangle, X, ShieldAlert, ArrowRight, TrendingDown } from 'lucide-react';

export interface BudgetThresholdToastData {
  id: string;
  trackedExpenses: number;
  dailyGoalTarget: number;
  percentage: number;
  currencySymbol: string;
  goalTitle: string;
  timestamp: number;
}

interface BudgetThresholdToastProps {
  toast: BudgetThresholdToastData | null;
  onDismiss: () => void;
  onViewLeaks?: () => void;
}

export const BudgetThresholdToast: React.FC<BudgetThresholdToastProps> = ({
  toast,
  onDismiss,
  onViewLeaks,
}) => {
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    if (!toast) return;

    setProgress(100);
    const duration = 9000; // 9 seconds
    const intervalTime = 50;
    const step = (intervalTime / duration) * 100;

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev <= step) {
          clearInterval(timer);
          onDismiss();
          return 0;
        }
        return prev - step;
      });
    }, intervalTime);

    return () => clearInterval(timer);
  }, [toast, onDismiss]);

  if (!toast) return null;

  const isCritical = toast.percentage >= 100;
  const remainingBudget = Math.max(0, toast.dailyGoalTarget - toast.trackedExpenses);

  return (
    <div
      role="alert"
      aria-live="assertive"
      className="fixed top-16 right-4 sm:right-6 z-50 max-w-md w-[calc(100vw-2rem)] sm:w-[420px] bg-zinc-950/95 border border-amber-500/40 shadow-2xl shadow-amber-950/30 rounded-2xl p-4 backdrop-blur-md transition-all animate-in fade-in slide-in-from-top-4 duration-300"
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-400 shrink-0">
            {isCritical ? (
              <ShieldAlert className="w-5 h-5 text-rose-400 animate-pulse" />
            ) : (
              <AlertTriangle className="w-5 h-5 text-amber-400" />
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-100">
                Budget Threshold Warning
              </h4>
              <span
                className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                  isCritical
                    ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                    : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                }`}
              >
                {toast.percentage}% OF GOAL
              </span>
            </div>
            <p className="text-[11px] text-zinc-400 mt-0.5 truncate max-w-[260px]">
              {toast.goalTitle}
            </p>
          </div>
        </div>

        <button
          onClick={onDismiss}
          className="p-1 rounded-lg text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/80 transition-colors cursor-pointer"
          title="Dismiss alert"
          aria-label="Dismiss alert"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Main Metric Details */}
      <div className="mt-3 p-3 rounded-xl bg-zinc-900/90 border border-zinc-800/80 space-y-2">
        <div className="flex items-baseline justify-between text-xs">
          <span className="text-zinc-400">Daily Tracked Spend:</span>
          <span className="font-mono font-bold text-amber-300">
            {toast.currencySymbol}
            {toast.trackedExpenses.toFixed(2)}
            <span className="text-[11px] text-zinc-500 font-normal">
              {' '}
              / {toast.currencySymbol}
              {toast.dailyGoalTarget.toFixed(2)} target
            </span>
          </span>
        </div>

        {/* Threshold Meter Bar with 70% marker */}
        <div className="space-y-1">
          <div className="relative w-full h-2.5 rounded-full bg-zinc-950 overflow-hidden border border-zinc-800">
            {/* 70% marker indicator line */}
            <div
              className="absolute top-0 bottom-0 w-0.5 bg-amber-400/80 z-10"
              style={{ left: '70%' }}
              title="70% Threshold Alert Line"
            />
            {/* Fill bar */}
            <div
              className={`h-full transition-all duration-500 ${
                isCritical
                  ? 'bg-gradient-to-r from-amber-500 to-rose-500'
                  : 'bg-gradient-to-r from-amber-400 to-amber-500'
              }`}
              style={{ width: `${Math.min(100, toast.percentage)}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-[10px] text-zinc-500 font-mono">
            <span>0%</span>
            <span className="text-amber-400 font-semibold">▲ 70% Alert Threshold</span>
            <span>100%</span>
          </div>
        </div>

        <p className="text-[11px] text-zinc-300 leading-tight">
          {isCritical ? (
            <span className="text-rose-300 font-medium">
              Daily budget ceiling depleted! Discretionary impulse leaks will prolong your wealth goal runway.
            </span>
          ) : (
            <span>
              Daily expenses exceeded 70% of your target budget. You have{' '}
              <strong className="text-emerald-400 font-mono">
                {toast.currencySymbol}
                {remainingBudget.toFixed(2)}
              </strong>{' '}
              safe buffer remaining today.
            </span>
          )}
        </p>
      </div>

      {/* Action Footer */}
      <div className="mt-3 flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 text-[11px] text-amber-400/90 font-mono">
          <TrendingDown className="w-3.5 h-3.5" />
          <span>Tighten Leaks Today</span>
        </div>

        <div className="flex items-center gap-2">
          {onViewLeaks && (
            <button
              onClick={() => {
                onViewLeaks();
                onDismiss();
              }}
              className="px-2.5 py-1 text-xs font-semibold text-zinc-200 hover:text-white bg-zinc-800/80 hover:bg-zinc-700 rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
            >
              <span>View Leaks</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          )}

          <button
            onClick={onDismiss}
            className="px-2.5 py-1 text-xs font-medium text-zinc-400 hover:text-zinc-200 transition-colors cursor-pointer"
          >
            Dismiss
          </button>
        </div>
      </div>

      {/* Auto-dismiss timer progress bar */}
      <div className="mt-2.5 w-full bg-zinc-900 h-1 rounded-full overflow-hidden">
        <div
          className="bg-amber-400/60 h-full transition-all duration-75"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
};
