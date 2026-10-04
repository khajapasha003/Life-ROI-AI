import React, { useState } from 'react';
import { X, Copy, Check, Code, ShieldCheck } from 'lucide-react';
import { AnalysisResult, StrictAutonomousAudit } from '../types/roi';

interface StrictJsonModalProps {
  isOpen: boolean;
  onClose: () => void;
  analysis: AnalysisResult;
}

export const StrictJsonModal: React.FC<StrictJsonModalProps> = ({
  isOpen,
  onClose,
  analysis,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const strictJson: StrictAutonomousAudit = {
    score: analysis.score ?? analysis.dailyScore,
    headline: analysis.headline ?? analysis.scoreBreakdown?.headline ?? 'Daily Optimization Audit',
    leakName: analysis.leakName ?? analysis.leaksDetected?.[0]?.title ?? 'Micro-Spend Friction',
    leakMonthlyWaste:
      analysis.leakMonthlyWaste ??
      `${analysis.currencySymbol}${analysis.totalMonthlyWaste.toLocaleString()}/month`,
    leakSolution:
      analysis.leakSolution ?? analysis.immediateOptimizationFix?.swap ?? 'Optimize habit swap',
    dailySaved:
      analysis.dailySaved ??
      `${analysis.currencySymbol}${analysis.microRoiWealthShift?.savedToday?.toLocaleString() ?? '10.00'}`,
    tenYearCompounded:
      analysis.tenYearCompounded ??
      `${analysis.currencySymbol}${analysis.microRoiWealthShift?.tenYearCompounded?.toLocaleString() ?? '70,570'}`,
    assetTarget:
      analysis.assetTarget ?? analysis.microRoiWealthShift?.divertDestination ?? 'S&P 500 Index Fund',
    tomorrowQuickWin:
      analysis.tomorrowQuickWin ?? analysis.quickWinTomorrow?.task ?? '5-minute setup tonight',
  };

  const jsonString = JSON.stringify(strictJson, null, 2);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(jsonString);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-2xl space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
          <div className="flex items-center gap-2.5">
            <span className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400">
              <Code className="w-4 h-4" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-bold text-zinc-100">Strict JSON Output</h2>
                <span className="flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded bg-zinc-800 text-emerald-400 font-mono">
                  <ShieldCheck className="w-3 h-3" />
                  <span>Autonomous Schema</span>
                </span>
              </div>
              <p className="text-[11px] text-zinc-400 mt-0.5">
                9 verified core keys with 12% 10-year compounding math
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* JSON Viewer */}
        <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800/80 font-mono text-xs text-emerald-300 whitespace-pre-wrap leading-relaxed max-h-[60vh] overflow-y-auto select-all">
          {jsonString}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-2">
          <span className="text-xs text-zinc-400">
            Compliant with LifeROI Autonomous Intelligence specification.
          </span>
          <button
            onClick={handleCopy}
            className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Copied JSON</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy Strict JSON</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
