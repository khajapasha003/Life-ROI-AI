import React from 'react';
import { PiggyBank, ArrowUpRight, Calculator, Target } from 'lucide-react';
import { WealthShift } from '../types/roi';

interface WealthShiftCardProps {
  wealth: WealthShift;
  currencySymbol: string;
  wealthGoal?: string;
  wealthGoalRunway?: string;
  onOpenSimulator: () => void;
}

export const WealthShiftCard: React.FC<WealthShiftCardProps> = ({
  wealth,
  currencySymbol,
  wealthGoal,
  wealthGoalRunway,
  onOpenSimulator,
}) => {
  return (
    <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800/80 flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="p-1 rounded bg-indigo-500/10 text-indigo-400">
              <PiggyBank className="w-4 h-4" />
            </span>
            <h3 className="text-xs uppercase tracking-wider font-semibold text-zinc-300">
              Micro-ROI & Wealth Shift
            </h3>
          </div>
          <button
            onClick={onOpenSimulator}
            className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1 transition-colors font-medium cursor-pointer"
            title="Open Interactive Compound Simulator"
          >
            <Calculator className="w-3.5 h-3.5" />
            <span>Simulate Compound</span>
          </button>
        </div>

        <div className="p-3 rounded-lg bg-zinc-950/60 border border-zinc-800/60 space-y-2.5">
          <div className="flex items-baseline justify-between">
            <span className="text-xs text-zinc-400">Shift Saved Today:</span>
            <span className="font-mono text-base font-bold text-emerald-400">
              +{currencySymbol}{wealth.savedToday.toLocaleString()}
            </span>
          </div>

          <div className="text-xs text-zinc-300 bg-zinc-900/80 p-2 rounded border border-zinc-800/80">
            <span className="text-[11px] uppercase tracking-wider text-zinc-500 font-semibold block mb-0.5">
              Target Destination
            </span>
            <span className="font-semibold text-zinc-100">{wealth.divertDestination}</span>
          </div>

          {/* Active Wealth Goal Highlight */}
          {wealthGoal && (
            <div className="p-2.5 rounded-lg bg-emerald-950/30 border border-emerald-800/40 space-y-1">
              <div className="flex items-center justify-between text-[10px] font-semibold text-emerald-400 uppercase tracking-wider">
                <span className="flex items-center gap-1">
                  <Target className="w-3.5 h-3.5" />
                  <span>Target Wealth Goal</span>
                </span>
                <span className="font-mono text-zinc-300">{wealthGoal}</span>
              </div>
              {wealthGoalRunway && (
                <p className="text-[11px] text-emerald-200/90 leading-tight">
                  {wealthGoalRunway}
                </p>
              )}
            </div>
          )}

          {/* Compounding Projections */}
          <div className="grid grid-cols-2 gap-2 pt-1 border-t border-zinc-800/80">
            <div className="bg-zinc-900/40 p-2 rounded">
              <div className="text-[10px] text-zinc-400 uppercase tracking-wide">1-Year Value (8%)</div>
              <div className="font-mono text-xs font-bold text-zinc-100 mt-0.5">
                {currencySymbol}{wealth.oneYearCompounded.toLocaleString()}
              </div>
            </div>
            <div className="bg-zinc-900/40 p-2 rounded">
              <div className="text-[10px] text-indigo-400 uppercase tracking-wide">10-Year Value (8%)</div>
              <div className="font-mono text-xs font-bold text-indigo-300 mt-0.5">
                {currencySymbol}{wealth.tenYearCompounded.toLocaleString()}
              </div>
            </div>
          </div>

          <div className="text-[11px] text-zinc-300 italic pt-0.5 flex items-center gap-1">
            <ArrowUpRight className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span>{wealth.actionDirective}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
