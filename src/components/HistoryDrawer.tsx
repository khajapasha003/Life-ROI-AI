import React from 'react';
import { X, Calendar, ArrowRight, Trash2, TrendingUp } from 'lucide-react';
import { AnalysisResult } from '../types/roi';

interface HistoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  history: AnalysisResult[];
  onSelectEntry: (entry: AnalysisResult) => void;
  onClearHistory: () => void;
}

export const HistoryDrawer: React.FC<HistoryDrawerProps> = ({
  isOpen,
  onClose,
  history,
  onSelectEntry,
  onClearHistory,
}) => {
  if (!isOpen) return null;

  const averageScore = history.length
    ? Math.round(history.reduce((acc, h) => acc + h.dailyScore, 0) / history.length)
    : 0;

  const totalWasteIdentified = history.reduce((acc, h) => acc + h.totalDailyWaste, 0);

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-md h-full bg-zinc-900 border-l border-zinc-800 p-5 flex flex-col justify-between shadow-2xl">
        <div className="space-y-4 flex-1 overflow-hidden flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-zinc-800 text-zinc-300">
                <Calendar className="w-4 h-4" />
              </span>
              <div>
                <h2 className="text-sm font-bold text-zinc-100">Daily Optimization History</h2>
                <div className="text-[11px] text-zinc-400">
                  {history.length} {history.length === 1 ? 'log' : 'logs'} tracked
                </div>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Aggregate Stats */}
          {history.length > 0 && (
            <div className="grid grid-cols-2 gap-3 p-3 rounded-xl bg-zinc-950/70 border border-zinc-800/80">
              <div>
                <div className="text-[11px] text-zinc-400">Avg Daily Score</div>
                <div className="font-mono text-base font-bold text-emerald-400 mt-0.5">
                  {averageScore}/100
                </div>
              </div>
              <div>
                <div className="text-[11px] text-zinc-400">Cumulative Leaks Logged</div>
                <div className="font-mono text-base font-bold text-rose-400 mt-0.5">
                  ${Math.round(totalWasteIdentified).toLocaleString()}
                </div>
              </div>
            </div>
          )}

          {/* List */}
          <div className="flex-1 overflow-y-auto space-y-2.5 pr-1">
            {history.length === 0 ? (
              <div className="py-12 text-center text-zinc-400 space-y-2">
                <TrendingUp className="w-8 h-8 mx-auto text-zinc-400/60" />
                <p className="text-xs">No analysis logs saved yet.</p>
                <p className="text-[11px] text-zinc-400">
                  Run your first daily check-in to track progress!
                </p>
              </div>
            ) : (
              history.map((item, idx) => (
                <div
                  key={item.id || idx}
                  onClick={() => {
                    onSelectEntry(item);
                    onClose();
                  }}
                  className="p-3 rounded-xl bg-zinc-950/60 border border-zinc-800/60 hover:border-zinc-700 cursor-pointer transition-all space-y-1.5 group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] text-zinc-400 font-mono">
                      {item.timestamp ? new Date(item.timestamp).toLocaleDateString(undefined, {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      }) : `Log #${idx + 1}`}
                    </span>
                    <span
                      className={`text-xs font-mono font-bold px-1.5 py-0.5 rounded border ${
                        item.dailyScore >= 80
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                          : item.dailyScore >= 60
                          ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                          : 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                      }`}
                    >
                      {item.dailyScore}/100
                    </span>
                  </div>

                  <p className="text-xs font-medium text-zinc-200 line-clamp-1 group-hover:text-emerald-400 transition-colors">
                    {item.scoreBreakdown.headline}
                  </p>

                  <div className="flex items-center justify-between text-[11px] text-zinc-400 pt-1">
                    <span>
                      Waste: {item.currencySymbol}{item.totalDailyWaste}/day
                    </span>
                    <span className="flex items-center gap-1 text-indigo-400 text-[11px] font-medium">
                      <span>View</span>
                      <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {history.length > 0 && (
          <div className="pt-3 border-t border-zinc-800">
            <button
              onClick={onClearHistory}
              className="w-full py-2 px-3 rounded-lg border border-rose-900/40 text-rose-400 hover:bg-rose-950/30 text-xs font-medium flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear History</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
