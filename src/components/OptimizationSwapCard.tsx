import React from 'react';
import { ArrowRightLeft, Sparkles, TrendingUp } from 'lucide-react';
import { OptimizationFix } from '../types/roi';

interface OptimizationSwapCardProps {
  fix: OptimizationFix;
  currencySymbol: string;
}

export const OptimizationSwapCard: React.FC<OptimizationSwapCardProps> = ({ fix, currencySymbol }) => {
  return (
    <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800/80 flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="p-1 rounded bg-emerald-500/10 text-emerald-400">
              <ArrowRightLeft className="w-4 h-4" />
            </span>
            <h3 className="text-xs uppercase tracking-wider font-semibold text-zinc-300">
              Immediate Optimization Fix
            </h3>
          </div>
          {fix.immediateSavings > 0 && (
            <div className="text-xs text-zinc-400">
              Day 1 Savings: <span className="font-mono font-bold text-emerald-400">+{currencySymbol}{fix.immediateSavings}</span>
            </div>
          )}
        </div>

        <div className="p-3 rounded-lg bg-zinc-950/60 border border-zinc-800/60">
          <div className="text-xs font-semibold text-zinc-100 mb-2 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span>{fix.title}</span>
          </div>

          <div className="bg-emerald-950/20 border border-emerald-800/30 p-2.5 rounded-md mb-2.5">
            <span className="text-[11px] font-semibold text-emerald-400 uppercase tracking-wider block mb-0.5">
              The Swap Action
            </span>
            <p className="text-xs font-medium text-emerald-200/90 leading-relaxed">
              {fix.swap}
            </p>
          </div>

          <div className="flex items-start gap-1.5 text-xs text-zinc-300 pt-1">
            <TrendingUp className="w-3.5 h-3.5 text-indigo-400 shrink-0 mt-0.5" />
            <span className="leading-snug">
              <strong className="text-zinc-200">Health & Focus Gain:</strong> {fix.healthProductivityGain}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
