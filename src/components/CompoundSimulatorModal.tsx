import React, { useState } from 'react';
import { X, TrendingUp, Sparkles, DollarSign } from 'lucide-react';
import { CurrencyCode } from '../types/roi';

interface CompoundSimulatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  currencySymbol: string;
  currencyCode: CurrencyCode | string;
  initialDailySavings: number;
}

export const CompoundSimulatorModal: React.FC<CompoundSimulatorModalProps> = ({
  isOpen,
  onClose,
  currencySymbol,
  currencyCode,
  initialDailySavings,
}) => {
  if (!isOpen) return null;

  const isINR = currencyCode === 'INR';
  const maxRange = isINR ? 3000 : 50;
  const step = isINR ? 50 : 1;

  const [dailySavings, setDailySavings] = useState(
    initialDailySavings > 0 ? initialDailySavings : isINR ? 400 : 10
  );
  const [annualRate, setAnnualRate] = useState(8); // 8% average index return

  // Calculate future value of daily annuity:
  // r = annualRate / 100 / 365
  // FV = PMT * (((1 + r)^n - 1) / r)
  const calculateFV = (years: number) => {
    const days = years * 365;
    const r = annualRate / 100 / 365;
    if (r === 0) return dailySavings * days;
    const fv = dailySavings * ((Math.pow(1 + r, days) - 1) / r);
    return Math.round(fv);
  };

  const horizons = [
    { label: '1 Year', years: 1, value: calculateFV(1) },
    { label: '3 Years', years: 3, value: calculateFV(3) },
    { label: '5 Years', years: 5, value: calculateFV(5) },
    { label: '10 Years', years: 10, value: calculateFV(10) },
    { label: '20 Years', years: 20, value: calculateFV(20) },
    { label: '30 Years', years: 30, value: calculateFV(30) },
  ];

  const maxVal = horizons[horizons.length - 1].value;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-2xl space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400">
              <TrendingUp className="w-5 h-5" />
            </span>
            <div>
              <h2 className="text-base font-bold text-zinc-100">Micro-ROI Compounding Engine</h2>
              <p className="text-xs text-zinc-400">
                Turn plugged daily expense leaks into long-term financial freedom.
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

        {/* Controls */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-xl bg-zinc-950/70 border border-zinc-800/80">
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="text-xs font-semibold text-zinc-300">Daily Leak Plugged</label>
              <span className="font-mono text-sm font-bold text-emerald-400">
                {currencySymbol}{dailySavings.toLocaleString()} / day
              </span>
            </div>
            <input
              type="range"
              min={isINR ? 50 : 2}
              max={maxRange}
              step={step}
              value={dailySavings}
              onChange={(e) => setDailySavings(parseFloat(e.target.value))}
              className="w-full accent-emerald-500 cursor-pointer"
            />
            <div className="flex justify-between text-[11px] text-zinc-400 mt-1">
              <span>{currencySymbol}{isINR ? 50 : 2}/day</span>
              <span>{currencySymbol}{Math.round(dailySavings * 30).toLocaleString()}/month</span>
              <span>{currencySymbol}{maxRange}/day</span>
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="text-xs font-semibold text-zinc-300">Expected Annual Return</label>
              <span className="font-mono text-sm font-bold text-indigo-400">{annualRate}% APY</span>
            </div>
            <input
              type="range"
              min={4}
              max={12}
              step={0.5}
              value={annualRate}
              onChange={(e) => setAnnualRate(parseFloat(e.target.value))}
              className="w-full accent-indigo-500 cursor-pointer"
            />
            <div className="flex justify-between text-[11px] text-zinc-400 mt-1">
              <span>4% (Treasuries/HYSA)</span>
              <span>8% (Index S&P 500)</span>
              <span>12% (Aggressive)</span>
            </div>
          </div>
        </div>

        {/* Projections Matrix */}
        <div className="space-y-2">
          <div className="text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>Compounded Wealth Horizons</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {horizons.map((h, i) => (
              <div
                key={i}
                className="p-3 rounded-xl bg-zinc-950/60 border border-zinc-800/80 hover:border-zinc-700 transition-colors"
              >
                <div className="text-xs text-zinc-400 mb-1">{h.label}</div>
                <div className="font-mono text-base sm:text-lg font-bold text-zinc-100">
                  {currencySymbol}{h.value.toLocaleString()}
                </div>
                <div className="h-1.5 w-full bg-zinc-800 rounded-full mt-2 overflow-hidden">
                  <div
                    className="h-full bg-indigo-500 rounded-full"
                    style={{ width: `${Math.max(5, (h.value / maxVal) * 100)}%` }}
                  />
                </div>
                <div className="text-[10px] text-zinc-400 mt-1">
                  Principal: {currencySymbol}{(dailySavings * h.years * 365).toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Wealth Insight Note */}
        <div className="p-3 rounded-lg bg-indigo-950/20 border border-indigo-800/30 text-xs text-indigo-200/90 leading-relaxed flex items-start gap-2">
          <DollarSign className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
          <div>
            <strong>The LifeROI Principle:</strong> Cutting just{' '}
            <span className="font-mono font-bold text-white">
              {currencySymbol}{dailySavings}/day
            </span>{' '}
            in passive friction isn't about depravation — it creates{' '}
            <span className="font-mono font-bold text-emerald-400">
              {currencySymbol}{calculateFV(10).toLocaleString()}
            </span>{' '}
            of freedom capital in 10 years.
          </div>
        </div>
      </div>
    </div>
  );
};
