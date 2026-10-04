import React from 'react';
import { Plus, Zap, Receipt } from 'lucide-react';
import { CurrencyCode } from '../types/roi';

interface QuickExpenseFabProps {
  onClick: () => void;
  currencySymbol: string;
}

export const QuickExpenseFab: React.FC<QuickExpenseFabProps> = ({ onClick, currencySymbol }) => {
  return (
    <div className="fixed bottom-6 right-6 z-40 flex items-center gap-2 group animate-in fade-in slide-in-from-bottom-4 duration-300">
      <button
        onClick={onClick}
        aria-label="Quick Add Expense"
        className="flex items-center gap-2 px-3.5 py-3 sm:px-4 sm:py-3 rounded-full bg-emerald-500 hover:bg-emerald-400 active:scale-95 text-zinc-950 font-bold shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 border border-emerald-300/40 transition-all duration-200 cursor-pointer group"
      >
        <div className="p-1 rounded-full bg-zinc-950/15 flex items-center justify-center">
          <Plus className="w-4 h-4 stroke-[2.8] transition-transform duration-200 group-hover:rotate-90" />
        </div>
        <span className="text-xs tracking-tight flex items-center gap-1 font-semibold">
          <span>Log Expense</span>
          <span className="font-mono text-[11px] opacity-80">({currencySymbol})</span>
        </span>
      </button>
    </div>
  );
};
