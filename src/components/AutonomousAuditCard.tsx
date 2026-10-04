import React from 'react';
import { Cpu, TrendingUp, AlertTriangle, ArrowRightLeft, Target, Zap, Code } from 'lucide-react';
import { AnalysisResult } from '../types/roi';

interface AutonomousAuditCardProps {
  analysis: AnalysisResult;
  onOpenJson: () => void;
}

export const AutonomousAuditCard: React.FC<AutonomousAuditCardProps> = ({ analysis, onOpenJson }) => {
  const score = analysis.score ?? analysis.dailyScore;
  const headline = analysis.headline ?? analysis.scoreBreakdown?.headline;
  const leakName = analysis.leakName ?? analysis.leaksDetected?.[0]?.title;
  const leakMonthlyWaste =
    analysis.leakMonthlyWaste ??
    `${analysis.currencySymbol}${analysis.totalMonthlyWaste.toLocaleString()}/month`;
  const leakSolution = analysis.leakSolution ?? analysis.immediateOptimizationFix?.swap;
  const dailySaved =
    analysis.dailySaved ??
    `${analysis.currencySymbol}${analysis.microRoiWealthShift?.savedToday?.toLocaleString()}`;
  const tenYearCompounded =
    analysis.tenYearCompounded ??
    `${analysis.currencySymbol}${analysis.microRoiWealthShift?.tenYearCompounded?.toLocaleString()}`;
  const assetTarget = analysis.assetTarget ?? analysis.microRoiWealthShift?.divertDestination;
  const tomorrowQuickWin = analysis.tomorrowQuickWin ?? analysis.quickWinTomorrow?.task;

  return (
    <div className="p-4 rounded-2xl bg-zinc-900/80 border border-emerald-500/20 shadow-lg space-y-4">
      {/* Top Banner */}
      <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
        <div className="flex items-center gap-2">
          <span className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400">
            <Cpu className="w-4 h-4" />
          </span>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xs uppercase tracking-wider font-bold text-zinc-200">
                Autonomous Intelligence Audit
              </h2>
              <span className="text-[10px] px-1.5 py-0.2 bg-emerald-950/60 text-emerald-300 rounded border border-emerald-800/40 font-mono">
                12% 10-Yr Compounding
              </span>
            </div>
            <p className="text-xs font-semibold text-zinc-100 mt-0.5 max-w-md">
              &ldquo;{headline}&rdquo;
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onOpenJson}
            className="px-2.5 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-mono font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
            title="Inspect 9-field strict JSON"
          >
            <Code className="w-3.5 h-3.5 text-emerald-400" />
            <span>Strict JSON</span>
          </button>
        </div>
      </div>

      {/* 4 Quick Telemetry Pillars */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
        {/* Metric 1: Discipline Score */}
        <div className="p-3 rounded-xl bg-zinc-950/70 border border-zinc-800/80">
          <div className="text-[11px] text-zinc-400">Discipline Score</div>
          <div className="font-mono text-xl font-bold text-emerald-400 mt-0.5">
            {score}<span className="text-xs text-zinc-400 font-normal">/100</span>
          </div>
          <div className="text-[10px] text-zinc-400 mt-1">
            Deducts for impulse buys &amp; drains
          </div>
        </div>

        {/* Metric 2: 30-Day Recurring Waste */}
        <div className="p-3 rounded-xl bg-zinc-950/70 border border-zinc-800/80">
          <div className="text-[11px] text-zinc-400 flex items-center gap-1">
            <AlertTriangle className="w-3 h-3 text-rose-400" />
            <span>Monthly Decay</span>
          </div>
          <div className="font-mono text-base font-bold text-rose-400 mt-0.5">
            {leakMonthlyWaste}
          </div>
          <div className="text-[10px] text-zinc-400 truncate mt-1">
            {leakName}
          </div>
        </div>

        {/* Metric 3: Daily Saved */}
        <div className="p-3 rounded-xl bg-zinc-950/70 border border-zinc-800/80">
          <div className="text-[11px] text-zinc-400">Daily Cash Recovered</div>
          <div className="font-mono text-base font-bold text-zinc-100 mt-0.5">
            {dailySaved}
          </div>
          <div className="text-[10px] text-zinc-400 mt-1 truncate">
            Via micro-swap
          </div>
        </div>

        {/* Metric 4: 10-Year Opportunity Cost */}
        <div className="p-3 rounded-xl bg-zinc-950/70 border border-indigo-900/40 bg-indigo-950/10">
          <div className="text-[11px] text-indigo-300 flex items-center gap-1">
            <TrendingUp className="w-3 h-3 text-indigo-400" />
            <span>10-Yr Value @ 12%</span>
          </div>
          <div className="font-mono text-base font-bold text-indigo-300 mt-0.5">
            {tenYearCompounded}
          </div>
          <div className="text-[10px] text-zinc-400 mt-1 truncate">
            Compounded opportunity cost
          </div>
        </div>
      </div>

      {/* Behavioral Swap & Target Vector */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1 text-xs">
        <div className="p-3 rounded-xl bg-zinc-950/70 border border-zinc-800/80 space-y-1">
          <div className="flex items-center gap-1.5 text-zinc-400 text-[11px] font-semibold uppercase tracking-wider">
            <ArrowRightLeft className="w-3.5 h-3.5 text-emerald-400" />
            <span>Behavioral Swap</span>
          </div>
          <p className="text-zinc-200 leading-relaxed font-medium">
            {leakSolution}
          </p>
        </div>

        <div className="p-3 rounded-xl bg-zinc-950/70 border border-zinc-800/80 space-y-1">
          <div className="flex items-center gap-1.5 text-zinc-400 text-[11px] font-semibold uppercase tracking-wider">
            <Target className="w-3.5 h-3.5 text-indigo-400" />
            <span>Asset Destination</span>
          </div>
          <p className="text-zinc-200 leading-relaxed font-medium">
            {assetTarget}
          </p>
          <div className="text-[11px] text-zinc-400 flex items-center gap-1 mt-1 pt-1 border-t border-zinc-900">
            <Zap className="w-3 h-3 text-amber-400 shrink-0" />
            <span className="truncate">
              <strong>Tomorrow:</strong> {tomorrowQuickWin}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
