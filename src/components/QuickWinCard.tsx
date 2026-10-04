import React, { useState } from 'react';
import { Zap, CheckCircle2, Circle } from 'lucide-react';
import { QuickWin } from '../types/roi';

interface QuickWinCardProps {
  quickWin: QuickWin;
}

export const QuickWinCard: React.FC<QuickWinCardProps> = ({ quickWin }) => {
  const [completed, setCompleted] = useState(false);

  return (
    <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800/80 flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="p-1 rounded bg-amber-500/10 text-amber-400">
              <Zap className="w-4 h-4" />
            </span>
            <h3 className="text-xs uppercase tracking-wider font-semibold text-zinc-300">
              Quick Win Task for Tomorrow
            </h3>
          </div>
          <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-zinc-800 text-zinc-300">
            5-Minute Sprint
          </span>
        </div>

        <div
          onClick={() => setCompleted(!completed)}
          className={`p-3 rounded-lg border transition-all cursor-pointer select-none ${
            completed
              ? 'bg-emerald-950/20 border-emerald-600/40 text-emerald-200'
              : 'bg-zinc-950/60 border-zinc-800/60 hover:border-zinc-700/60 text-zinc-100'
          }`}
        >
          <div className="flex items-start gap-2.5">
            <button
              type="button"
              className="mt-0.5 text-zinc-400 hover:text-emerald-400 transition-colors focus:outline-none"
              aria-label={completed ? 'Mark incomplete' : 'Mark complete'}
            >
              {completed ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              ) : (
                <Circle className="w-4 h-4 text-zinc-500 shrink-0" />
              )}
            </button>
            <div className="flex-1">
              <p
                className={`text-xs font-medium leading-relaxed ${
                  completed ? 'line-through text-zinc-400' : 'text-zinc-100'
                }`}
              >
                {quickWin.task}
              </p>
              <p className="text-[11px] text-zinc-400 mt-1.5 flex items-center gap-1">
                <span className="font-semibold text-amber-400/90">Outcome:</span>{' '}
                <span>{quickWin.projectedImpact}</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-2 text-[11px] text-zinc-400 text-right">
        {completed ? '⚡ Quick Win committed for tomorrow' : 'Click to lock in for tomorrow morning'}
      </div>
    </div>
  );
};
