import React from 'react';
import { AlertCircle, Clock, DollarSign } from 'lucide-react';
import { LeakItem } from '../types/roi';

interface LeaksCardProps {
  leaks: LeakItem[];
  currencySymbol: string;
  totalMonthlyWaste: number;
}

export const LeaksCard: React.FC<LeaksCardProps> = ({ leaks, currencySymbol, totalMonthlyWaste }) => {
  return (
    <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800/80 flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="p-1 rounded bg-rose-500/10 text-rose-400">
              <AlertCircle className="w-4 h-4" />
            </span>
            <h3 className="text-xs uppercase tracking-wider font-semibold text-zinc-300">
              Leaks Detected ({leaks.length})
            </h3>
          </div>
          <div className="text-xs text-zinc-400">
            Monthly Burn: <span className="font-mono font-bold text-rose-400">{currencySymbol}{totalMonthlyWaste.toLocaleString()}</span>
          </div>
        </div>

        <div className="space-y-2.5">
          {leaks.map((leak, idx) => (
            <div
              key={idx}
              className="p-3 rounded-lg bg-zinc-950/60 border border-zinc-800/60 hover:border-zinc-700/60 transition-colors"
            >
              <div className="flex items-start justify-between gap-2 mb-1">
                <div className="text-xs font-semibold text-zinc-100 flex items-center gap-1.5">
                  {leak.type === 'micro_spend' ? (
                    <DollarSign className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                  ) : (
                    <Clock className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  )}
                  <span>{leak.title}</span>
                </div>
                <div className="text-right shrink-0">
                  {leak.type === 'micro_spend' ? (
                    <span className="font-mono text-xs font-semibold text-rose-400">
                      -{currencySymbol}{leak.monthlyWaste.toLocaleString()}/mo
                    </span>
                  ) : (
                    <span className="font-mono text-xs font-semibold text-amber-400">
                      -{leak.timeDrainMinutes || 45}m/day
                    </span>
                  )}
                </div>
              </div>

              {/* Zero-pill metadata */}
              <div className="flex items-center gap-1.5 text-[11px] text-zinc-400 mb-1">
                <span>{leak.type === 'micro_spend' ? 'Financial Drain' : 'Cognitive Drain'}</span>
                <span aria-hidden="true">·</span>
                {leak.dailyAmount > 0 && (
                  <>
                    <span>Daily: {currencySymbol}{leak.dailyAmount}</span>
                    <span aria-hidden="true">·</span>
                  </>
                )}
                <span>Monthly: {currencySymbol}{leak.monthlyWaste}</span>
              </div>

              <p className="text-xs text-zinc-300 leading-relaxed">
                {leak.impactSummary}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
