import React from 'react';
import { ScoreBreakdown, EmotionalSentimentModifier } from '../types/roi';

interface ScoreGaugeProps {
  score: number;
  breakdown: ScoreBreakdown;
  sentimentModifier?: EmotionalSentimentModifier;
  habitBonus?: number;
}

export const ScoreGauge: React.FC<ScoreGaugeProps> = ({
  score,
  breakdown,
  sentimentModifier,
  habitBonus,
}) => {
  // Score color calculation
  const getScoreColor = (val: number) => {
    if (val >= 80) return 'text-emerald-400 stroke-emerald-500';
    if (val >= 60) return 'text-amber-400 stroke-amber-500';
    return 'text-rose-400 stroke-rose-500';
  };

  const getScoreBg = (val: number) => {
    if (val >= 80) return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
    if (val >= 60) return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
    return 'bg-rose-500/10 text-rose-400 border-rose-500/30';
  };

  const radius = 38;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 p-4 rounded-xl bg-zinc-900/60 border border-zinc-800/80">
      {/* Circular Gauge */}
      <div className="relative w-24 h-24 shrink-0 flex items-center justify-center">
        <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r={radius}
            className="stroke-zinc-800"
            strokeWidth="7"
            fill="transparent"
          />
          <circle
            cx="50"
            cy="50"
            r={radius}
            className={`${getScoreColor(score)} transition-all duration-700 ease-out`}
            strokeWidth="7"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className="text-2xl font-bold font-mono tracking-tight text-white">{score}</span>
          <span className="text-[10px] uppercase tracking-wider text-zinc-400 font-medium">Daily ROI</span>
        </div>
      </div>

      {/* Breakdown Details */}
      <div className="flex-1 w-full space-y-2">
        <div className="flex flex-wrap items-center justify-between gap-1.5">
          <h2 className="text-sm font-semibold text-zinc-100 tracking-tight">{breakdown.headline}</h2>
          <div className="flex items-center gap-1.5">
            {sentimentModifier && sentimentModifier.modifier !== 0 && (
              <span
                className={`text-[10px] px-2 py-0.5 rounded-full border font-mono font-bold ${
                  sentimentModifier.modifier > 0
                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                    : 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                }`}
              >
                Sentiment: {sentimentModifier.modifier > 0 ? `+${sentimentModifier.modifier}` : sentimentModifier.modifier} pts
              </span>
            )}
            <span className={`text-xs px-2 py-0.5 rounded border font-mono ${getScoreBg(score)}`}>
              {score >= 80 ? 'Optimized' : score >= 60 ? 'Moderate Leak' : 'Heavy Drain'}
            </span>
          </div>
        </div>

        {/* Sub-bars */}
        <div className="grid grid-cols-2 gap-3 pt-1">
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-zinc-400">Habit Discipline</span>
              <span className="font-mono text-zinc-200">{breakdown.habitScore}%</span>
            </div>
            <div className="h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-indigo-500 rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, Math.max(0, breakdown.habitScore))}%` }}
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-zinc-400">Expense Efficiency</span>
              <span className="font-mono text-zinc-200">{breakdown.expenseEfficiency}%</span>
            </div>
            <div className="h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, Math.max(0, breakdown.expenseEfficiency))}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
