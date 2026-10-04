import React, { useState, useEffect } from 'react';
import {
  X,
  Zap,
  Tag,
  Coffee,
  UtensilsCrossed,
  Car,
  ShoppingBag,
  Tv,
  CheckCircle2,
  AlertTriangle,
  History,
  Trash2,
  ChevronDown,
  Film,
  HeartPulse,
  AlertCircle,
} from 'lucide-react';
import { CurrencyCode } from '../types/roi';

export interface QuickExpenseItem {
  id: string;
  amount: number;
  category: string;
  description: string;
  isImpulse: boolean;
  timestamp: string;
}

interface QuickAddExpenseModalProps {
  isOpen: boolean;
  onClose: () => void;
  currencySymbol: string;
  currencyCode: CurrencyCode;
  onExpenseAdded: (formattedLogLine: string, triggerAuditNow: boolean) => void;
}

export const QUICK_CATEGORIES = [
  {
    name: 'Food & Dining',
    shortLabel: 'Food',
    emoji: '🍲',
    icon: UtensilsCrossed,
    defaultName: 'Food / Takeout',
    group: 'Core Daily Spending',
  },
  {
    name: 'Subscriptions',
    shortLabel: 'Subscriptions',
    emoji: '📱',
    icon: Tv,
    defaultName: 'Digital Streaming / SaaS',
    group: 'Core Daily Spending',
  },
  {
    name: 'Utilities',
    shortLabel: 'Utilities',
    emoji: '⚡',
    icon: Zap,
    defaultName: 'Utility Bill / Internet',
    group: 'Core Daily Spending',
  },
  {
    name: 'Transport & Rides',
    shortLabel: 'Transport',
    emoji: '🚗',
    icon: Car,
    defaultName: 'Rideshare / Fuel',
    group: 'Discretionary & Lifestyle',
  },
  {
    name: 'Shopping & Retail',
    shortLabel: 'Shopping',
    emoji: '🛍️',
    icon: ShoppingBag,
    defaultName: 'Impulse Retail Purchase',
    group: 'Discretionary & Lifestyle',
  },
  {
    name: 'Entertainment & Leisure',
    shortLabel: 'Entertainment',
    emoji: '🎮',
    icon: Film,
    defaultName: 'Gaming / Outing',
    group: 'Discretionary & Lifestyle',
  },
  {
    name: 'Health & Personal Care',
    shortLabel: 'Health',
    emoji: '💪',
    icon: HeartPulse,
    defaultName: 'Gym / Personal Care',
    group: 'Personal & Financial',
  },
  {
    name: 'Fees & Miscellaneous',
    shortLabel: 'Fees / Misc',
    emoji: '⚠️',
    icon: AlertCircle,
    defaultName: 'Convenience / Late Fee',
    group: 'Personal & Financial',
  },
];

const STORAGE_KEY = 'liferoi_quick_expenses';

export const QuickAddExpenseModal: React.FC<QuickAddExpenseModalProps> = ({
  isOpen,
  onClose,
  currencySymbol,
  currencyCode,
  onExpenseAdded,
}) => {
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState(QUICK_CATEGORIES[0].name);
  const [isImpulse, setIsImpulse] = useState(true);
  const [recentExpenses, setRecentExpenses] = useState<QuickExpenseItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [successToast, setSuccessToast] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setAmount('');
      setDescription('');
      setCategory(QUICK_CATEGORIES[0].name);
      setIsImpulse(true);
      setSuccessToast(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const numAmount = parseFloat(amount) || 0;
  const recoverableDaily = isImpulse ? Math.round(numAmount * 0.72 * 100) / 100 : 0;
  const tenYearCompoundAt12 = isImpulse ? Math.round(recoverableDaily * 30 * 12 * 17.5) : 0;

  const handleCategoryChange = (selectedCatName: string) => {
    setCategory(selectedCatName);
    const catObj = QUICK_CATEGORIES.find((c) => c.name === selectedCatName);
    // If description is empty or currently matches a default from any category, replace with new default
    const isCurrentDefault = QUICK_CATEGORIES.some((c) => c.defaultName === description);
    if (!description.trim() || isCurrentDefault) {
      setDescription(catObj?.defaultName || selectedCatName);
    }
  };

  const handleSaveExpense = (triggerAudit: boolean) => {
    if (numAmount <= 0) return;

    const finalDesc = description.trim() || category;
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const newItem: QuickExpenseItem = {
      id: `exp-${Date.now()}`,
      amount: numAmount,
      category,
      description: finalDesc,
      isImpulse,
      timestamp: now.toISOString(),
    };

    const updated = [newItem, ...recentExpenses.slice(0, 19)];
    setRecentExpenses(updated);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      // Dispatch storage event so dashboard pie chart updates immediately in real-time
      window.dispatchEvent(new Event('liferoi_quick_expenses_updated'));
    } catch (e) {
      console.warn('Failed to save to localStorage', e);
    }

    // Formatted line to append directly to the daily log
    const logLine = `[${timeStr}] ${currencySymbol}${numAmount.toFixed(2)} - ${finalDesc} (${category})${
      isImpulse ? ' [IMPULSE LEAK]' : ' [ESSENTIAL]'
    }`;

    onExpenseAdded(logLine, triggerAudit);

    setSuccessToast(true);
    setTimeout(() => {
      onClose();
    }, 700);
  };

  const handleDeleteRecent = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const filtered = recentExpenses.filter((item) => item.id !== id);
    setRecentExpenses(filtered);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
      window.dispatchEvent(new Event('liferoi_quick_expenses_updated'));
    } catch (err) {
      console.warn(err);
    }
  };

  const handleClearHistory = () => {
    setRecentExpenses([]);
    localStorage.removeItem(STORAGE_KEY);
    window.dispatchEvent(new Event('liferoi_quick_expenses_updated'));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="relative w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl p-6 text-zinc-100 space-y-4 max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-white tracking-tight">Quick Add Expense</h2>
                <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-400 border border-zinc-700">
                  {currencyCode} ({currencySymbol})
                </span>
              </div>
              <p className="text-xs text-zinc-400 mt-0.5">Rapid friction-free cash-flow logger</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Input Form */}
        <div className="space-y-4">
          {/* Amount Input */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-zinc-300">Amount Spent</label>
            <div className="relative flex items-center">
              <span className="absolute left-3.5 text-lg font-mono font-bold text-zinc-400">
                {currencySymbol}
              </span>
              <input
                type="number"
                step="0.01"
                min="0"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                autoFocus
                className="w-full pl-8 pr-4 py-3 rounded-xl bg-zinc-950 border border-zinc-800 text-xl font-mono font-bold text-white placeholder-zinc-600 focus:outline-none focus:border-emerald-500 transition-colors"
              />
            </div>
          </div>

          {/* Spending Category Dropdown & Quick Chips */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label htmlFor="spending-category-dropdown" className="text-xs font-semibold text-zinc-300 flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5 text-emerald-400" />
                <span>Spending Category</span>
              </label>
              <span className="text-[10px] text-zinc-500 font-mono">Category Dropdown</span>
            </div>

            {/* Dropdown Selector */}
            <div className="relative">
              <select
                id="spending-category-dropdown"
                value={category}
                onChange={(e) => handleCategoryChange(e.target.value)}
                className="w-full appearance-none pl-3.5 pr-10 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-xs font-medium text-zinc-100 focus:outline-none focus:border-emerald-500 transition-colors cursor-pointer"
              >
                <optgroup label="Core Daily Spending">
                  <option value="Food & Dining">🍲 Food & Dining (e.g., Takeout, Dining, Coffee, Groceries)</option>
                  <option value="Subscriptions">📱 Subscriptions (e.g., Netflix, Spotify, SaaS, Cloud Apps)</option>
                  <option value="Utilities">⚡ Utilities & Bills (e.g., Electricity, Internet, Mobile, Water)</option>
                </optgroup>
                <optgroup label="Discretionary & Lifestyle">
                  <option value="Transport & Rides">🚗 Transport & Rides (e.g., Uber/Cab, Fuel, Transit, Parking)</option>
                  <option value="Shopping & Retail">🛍️ Shopping & Retail (e.g., Apparel, Amazon, Gadgets, Impulse)</option>
                  <option value="Entertainment & Leisure">🎮 Entertainment & Leisure (e.g., Gaming, Movies, Events, Bars)</option>
                </optgroup>
                <optgroup label="Personal & Financial">
                  <option value="Health & Personal Care">💪 Health & Personal Care (e.g., Gym, Supplements, Grooming)</option>
                  <option value="Fees & Miscellaneous">⚠️ Fees & Miscellaneous (e.g., Convenience, Overdraft, Late Fees)</option>
                </optgroup>
              </select>
              <ChevronDown className="absolute right-3.5 top-3 w-4 h-4 text-zinc-400 pointer-events-none" />
            </div>

            {/* Quick 1-Tap Category Pills */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              {QUICK_CATEGORIES.map((cat) => {
                const isSelected = category === cat.name;
                return (
                  <button
                    key={cat.name}
                    type="button"
                    onClick={() => handleCategoryChange(cat.name)}
                    className={`px-2 py-1 rounded-lg border text-[11px] flex items-center gap-1.5 transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-emerald-500/15 border-emerald-500/50 text-emerald-300 font-semibold'
                        : 'bg-zinc-950/80 border-zinc-800/80 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/40'
                    }`}
                  >
                    <span>{cat.emoji}</span>
                    <span>{cat.shortLabel}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Optional Item Description */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-zinc-300">
              Description <span className="text-zinc-500 font-normal">(optional details)</span>
            </label>
            <input
              type="text"
              placeholder="e.g. Swiggy Dinner, Netflix Premium, Electric Bill"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-emerald-500"
            />
          </div>

          {/* Impulse vs Essential Toggle */}
          <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5 text-zinc-400" />
                <span className="text-xs font-semibold text-zinc-200">Spend Classification</span>
              </div>
              <div className="flex items-center gap-1 bg-zinc-900 p-0.5 rounded-lg border border-zinc-800">
                <button
                  type="button"
                  onClick={() => setIsImpulse(true)}
                  className={`px-2.5 py-1 text-[11px] font-semibold rounded-md transition-all cursor-pointer ${
                    isImpulse
                      ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                      : 'text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  Impulse Leak
                </button>
                <button
                  type="button"
                  onClick={() => setIsImpulse(false)}
                  className={`px-2.5 py-1 text-[11px] font-semibold rounded-md transition-all cursor-pointer ${
                    !isImpulse
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      : 'text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  Essential Need
                </button>
              </div>
            </div>

            {/* Live Opportunity Cost Preview if Impulse */}
            {isImpulse && numAmount > 0 && (
              <div className="p-2 rounded-lg bg-rose-950/20 border border-rose-900/30 flex items-center justify-between text-[11px] animate-in fade-in duration-150">
                <div className="flex items-center gap-1 text-rose-300">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>10-Yr Compounded Cost:</span>
                </div>
                <div className="font-mono font-bold text-rose-200">
                  {currencySymbol}
                  {tenYearCompoundAt12.toLocaleString()}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Success Alert */}
        {successToast && (
          <div className="p-2.5 rounded-xl bg-emerald-950/40 border border-emerald-800/50 text-xs text-emerald-300 flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Expense recorded &amp; synced to daily audit log!</span>
          </div>
        )}

        {/* Modal Actions */}
        <div className="flex items-center gap-2 pt-1">
          <button
            type="button"
            onClick={() => handleSaveExpense(false)}
            disabled={numAmount <= 0}
            className="flex-1 py-2.5 px-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 disabled:opacity-40 text-xs font-semibold text-zinc-200 transition-colors cursor-pointer text-center"
          >
            Add to Log
          </button>
          <button
            type="button"
            onClick={() => handleSaveExpense(true)}
            disabled={numAmount <= 0}
            className="flex-1 py-2.5 px-3 rounded-xl bg-emerald-400 hover:bg-emerald-300 disabled:opacity-40 text-xs font-semibold text-zinc-950 transition-colors shadow-md cursor-pointer flex items-center justify-center gap-1.5"
          >
            <Zap className="w-3.5 h-3.5" />
            <span>Add &amp; Audit</span>
          </button>
        </div>

        {/* Recent Rapid Entries Accordion */}
        {recentExpenses.length > 0 && (
          <div className="pt-2 border-t border-zinc-800/80 space-y-2">
            <div className="flex items-center justify-between text-[11px] text-zinc-400">
              <span className="flex items-center gap-1">
                <History className="w-3 h-3" />
                <span>Recent Quick Entries ({recentExpenses.length})</span>
              </span>
              <button
                type="button"
                onClick={handleClearHistory}
                className="text-[10px] text-zinc-500 hover:text-rose-400 transition-colors cursor-pointer"
              >
                Clear all
              </button>
            </div>
            <div className="max-h-28 overflow-y-auto space-y-1 pr-1">
              {recentExpenses.map((exp) => (
                <div
                  key={exp.id}
                  className="p-1.5 px-2.5 rounded-lg bg-zinc-950/70 border border-zinc-800/60 flex items-center justify-between text-[11px] text-zinc-300"
                >
                  <div className="flex items-center gap-2 truncate">
                    <span className="font-mono font-bold text-zinc-100">
                      {currencySymbol}
                      {exp.amount.toFixed(2)}
                    </span>
                    <span className="text-zinc-400 truncate">{exp.description}</span>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span
                      className={`text-[9px] px-1.5 py-0.2 rounded-full font-medium ${
                        exp.isImpulse
                          ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                          : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                      }`}
                    >
                      {exp.isImpulse ? 'Impulse' : 'Need'}
                    </span>
                    <button
                      type="button"
                      onClick={(e) => handleDeleteRecent(exp.id, e)}
                      className="text-zinc-600 hover:text-rose-400 p-0.5 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
