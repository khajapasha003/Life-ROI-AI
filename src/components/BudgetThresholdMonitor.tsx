import React from 'react';
import { Target, AlertTriangle, ShieldCheck, ShieldAlert, Bell, ChevronRight } from 'lucide-react';

interface BudgetThresholdMonitorProps {
  trackedExpenses: number;
  dailyGoalTarget: number;
  goalTitle: string;
  currencySymbol: string;
  onTriggerTestAlert?: () => void;
  onViewLeaks?: () => void;
}

export const BudgetThresholdMonitor: React.FC<BudgetThresholdMonitorProps> = ({
  trackedExpenses,
  dailyGoalTarget,
  goalTitle,
  currencySymbol,
  onTriggerTestAlert,
  onViewLeaks,
}) => {
  const percentage = Math.round((trackedExpenses / Math.max(1, dailyGoalTarget)) * 100);
  const isExceeded = percentage >= 70;
  const isCritical = percentage >= 100;
  const remaining = Math.max(0, dailyGoalTarget - trackedExpenses);
  const thresholdValue = Math.round(dailyGoalTarget * 0.7 * 100) / 100;

  return (
    <div
      className={`p-4 rounded-2xl border transition-all ${
        isCritical
          ? 'bg-rose-950/20 border-rose-800/60 shadow-xs shadow-rose-950/20'
          : isExceeded
          ? 'bg-amber-950/20 border-amber-700/60 shadow-xs shadow-amber-950/20'
          : 'bg-zinc-900/60 border-zinc-800/80'
      }`}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-zinc-800/80 pb-3">
        <div className="flex items-center gap-2.5">
          <div
            className={`p-1.5 rounded-lg border ${
              isCritical
                ? 'bg-rose-500/15 border-rose-500/30 text-rose-400'
                : isExceeded
                ? 'bg-amber-500/15 border-amber-500/30 text-amber-400 animate-pulse'
                : 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400'
            }`}
          >
            {isCritical ? (
              <ShieldAlert className="w-4 h-4" />
            ) : isExceeded ? (
              <AlertTriangle className="w-4 h-4" />
            ) : (
              <ShieldCheck className="w-4 h-4" />
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xs uppercase tracking-wider font-bold text-zinc-200">
                Budget Threshold Monitor
              </h3>
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider border ${
                  isCritical
                    ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                    : isExceeded
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                    : 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                }`}
              >
                {isCritical
                  ? 'Budget Exceeded'
                  : isExceeded
                  ? '70% Threshold Warning'
                  : 'Safe Margin'}
              </span>
            </div>
            <p className="text-[11px] text-zinc-400 mt-0.5 truncate max-w-sm">
              Linked to:{' '}
              <span className="text-zinc-300 font-medium">{goalTitle || 'Daily Wealth Goal'}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          {onTriggerTestAlert && (
            <button
              onClick={onTriggerTestAlert}
              className="text-[11px] text-zinc-400 hover:text-amber-300 hover:bg-zinc-800/60 border border-zinc-800 px-2.5 py-1 rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
              title="Test the 70% threshold toast notification"
            >
              <Bell className="w-3 h-3 text-amber-400" />
              <span>Test Toast</span>
            </button>
          )}

          {onViewLeaks && isExceeded && (
            <button
              onClick={onViewLeaks}
              className="text-[11px] text-emerald-400 hover:text-emerald-300 flex items-center gap-0.5 font-medium cursor-pointer"
            >
              <span>Inspect Leaks</span>
              <ChevronRight className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>

      {/* Progress & Metrics */}
      <div className="mt-3.5 space-y-3">
        {/* Progress bar with 70% threshold marker */}
        <div>
          <div className="flex justify-between items-baseline text-xs mb-1.5 font-mono">
            <span className="text-zinc-400">
              Tracked Spend:{' '}
              <strong className={isExceeded ? 'text-amber-300' : 'text-zinc-100'}>
                {currencySymbol}
                {trackedExpenses.toFixed(2)}
              </strong>
            </span>
            <span className="text-zinc-400">
              Target Target:{' '}
              <strong className="text-zinc-100">
                {currencySymbol}
                {dailyGoalTarget.toFixed(2)}
              </strong>{' '}
              ({percentage}%)
            </span>
          </div>

          <div className="relative w-full h-3 rounded-full bg-zinc-950 border border-zinc-800/80 overflow-hidden">
            {/* 70% threshold indicator vertical tick */}
            <div
              className="absolute top-0 bottom-0 w-0.5 bg-amber-400 z-10 shadow-xs shadow-amber-400"
              style={{ left: '70%' }}
              title={`70% Warning Threshold: ${currencySymbol}${thresholdValue.toFixed(2)}`}
            />

            {/* Filled bar */}
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                isCritical
                  ? 'bg-gradient-to-r from-amber-500 to-rose-500'
                  : isExceeded
                  ? 'bg-gradient-to-r from-emerald-500 via-amber-400 to-amber-500'
                  : 'bg-gradient-to-r from-emerald-500 to-teal-400'
              }`}
              style={{ width: `${Math.min(100, percentage)}%` }}
            />
          </div>

          <div className="flex justify-between items-center text-[10px] text-zinc-500 font-mono mt-1">
            <span>0%</span>
            <span className="text-amber-400 font-semibold">
              ▲ 70% Alert Line ({currencySymbol}
              {thresholdValue.toFixed(2)})
            </span>
            <span>100% Target</span>
          </div>
        </div>

        {/* 3-Pillar Summary Cards */}
        <div className="grid grid-cols-3 gap-2 pt-1">
          <div className="p-2.5 rounded-xl bg-zinc-950/60 border border-zinc-800/60">
            <span className="text-[10px] uppercase tracking-wider text-zinc-500 block">
              Daily Spend
            </span>
            <span
              className={`font-mono text-sm font-bold mt-0.5 block ${
                isExceeded ? 'text-amber-400' : 'text-zinc-200'
              }`}
            >
              {currencySymbol}
              {trackedExpenses.toFixed(2)}
            </span>
          </div>

          <div className="p-2.5 rounded-xl bg-zinc-950/60 border border-zinc-800/60">
            <span className="text-[10px] uppercase tracking-wider text-amber-500/90 block">
              70% Threshold
            </span>
            <span className="font-mono text-sm font-bold text-amber-300 mt-0.5 block">
              {currencySymbol}
              {thresholdValue.toFixed(2)}
            </span>
          </div>

          <div className="p-2.5 rounded-xl bg-zinc-950/60 border border-zinc-800/60">
            <span className="text-[10px] uppercase tracking-wider text-zinc-500 block">
              Buffer Headroom
            </span>
            <span
              className={`font-mono text-sm font-bold mt-0.5 block ${
                remaining === 0 ? 'text-rose-400' : 'text-emerald-400'
              }`}
            >
              {currencySymbol}
              {remaining.toFixed(2)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
