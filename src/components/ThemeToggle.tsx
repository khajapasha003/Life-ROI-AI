import React from 'react';
import { Sun, Moon, BookOpen, Sparkles } from 'lucide-react';

export type AppTheme = 'deep-space' | 'financial-ledger';

interface ThemeToggleProps {
  theme: AppTheme;
  onToggle: () => void;
  compact?: boolean;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ theme, onToggle, compact = false }) => {
  const isLedger = theme === 'financial-ledger';

  return (
    <button
      type="button"
      onClick={onToggle}
      className={`group relative flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border transition-all cursor-pointer select-none ${
        isLedger
          ? 'bg-amber-50 hover:bg-amber-100 border-amber-200 text-amber-900 shadow-xs'
          : 'bg-zinc-900 hover:bg-zinc-800 border-zinc-800 text-zinc-300 hover:text-white'
      }`}
      title={
        isLedger
          ? 'Switch to Deep Space (Dark Mode)'
          : 'Switch to Financial Ledger (High-Contrast Light Mode)'
      }
      aria-label={
        isLedger
          ? 'Switch to Deep Space (Dark Mode)'
          : 'Switch to Financial Ledger (High-Contrast Light Mode)'
      }
    >
      <div className="relative flex items-center justify-center">
        {isLedger ? (
          <BookOpen className="w-3.5 h-3.5 text-amber-800 transition-transform group-hover:scale-110" />
        ) : (
          <Moon className="w-3.5 h-3.5 text-indigo-400 transition-transform group-hover:scale-110" />
        )}
      </div>

      {!compact && (
        <div className="flex items-center gap-1 text-[11px] font-medium tracking-tight">
          <span className="hidden sm:inline font-mono">
            {isLedger ? 'Ledger' : 'Deep Space'}
          </span>
          <span
            className={`text-[9px] px-1 py-0.2 rounded font-bold uppercase tracking-wider ${
              isLedger
                ? 'bg-amber-200/60 text-amber-900'
                : 'bg-zinc-800 text-zinc-400'
            }`}
          >
            {isLedger ? 'Light' : 'Dark'}
          </span>
        </div>
      )}
    </button>
  );
};
