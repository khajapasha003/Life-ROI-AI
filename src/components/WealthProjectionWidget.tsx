import React, { useState, useMemo, useEffect } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  ReferenceDot,
} from 'recharts';
import {
  TrendingUp,
  Sparkles,
  DollarSign,
  Calendar,
  Layers,
  Percent,
  Sliders,
  RotateCcw,
  Zap,
  Award,
} from 'lucide-react';
import { CurrencyCode } from '../types/roi';

interface WealthProjectionWidgetProps {
  dailyLeakage: number;
  currencySymbol: string;
  currencyCode: CurrencyCode | string;
  wealthGoal?: string;
  onOpenSimulatorModal?: () => void;
}

interface ProjectionDataPoint {
  year: number;
  yearLabel: string;
  principal: number;
  interest: number;
  totalAccumulated: number;
  isMilestone: boolean;
}

const PRESET_RATES = [
  { label: '6% Conservative', value: 6, desc: 'High-Yield Bonds / Treasuries' },
  { label: '8% Balanced', value: 8, desc: 'Global Index Blend' },
  { label: '10% S&P 500', value: 10, desc: 'Historical US Large Cap' },
  { label: '12% Growth', value: 12, desc: 'Aggressive Equity / Nifty 50' },
];

export const WealthProjectionWidget: React.FC<WealthProjectionWidgetProps> = ({
  dailyLeakage,
  currencySymbol,
  currencyCode,
  wealthGoal,
  onOpenSimulatorModal,
}) => {
  const isINR = currencyCode === 'INR';
  const defaultDaily = dailyLeakage > 0 ? dailyLeakage : isINR ? 500 : 12;

  const [activeDaily, setActiveDaily] = useState<number>(defaultDaily);
  const [annualRate, setAnnualRate] = useState<number>(8);
  const [selectedHorizon, setSelectedHorizon] = useState<1 | 5 | 10>(10);

  // Sync when prop updates
  useEffect(() => {
    if (dailyLeakage > 0) {
      setActiveDaily(dailyLeakage);
    }
  }, [dailyLeakage]);

  const maxSlider = isINR ? 4000 : 60;
  const sliderStep = isINR ? 25 : 1;

  // Compute 0 to 10 years curve
  const chartData = useMemo<ProjectionDataPoint[]>(() => {
    const points: ProjectionDataPoint[] = [];
    const dailyRate = annualRate / 100 / 365;

    for (let yr = 0; yr <= 10; yr++) {
      const days = yr * 365;
      const principal = Math.round(activeDaily * days);
      let totalAccumulated = principal;

      if (yr > 0 && dailyRate > 0) {
        const fv = activeDaily * ((Math.pow(1 + dailyRate, days) - 1) / dailyRate);
        totalAccumulated = Math.round(fv);
      }

      const interest = Math.max(0, totalAccumulated - principal);

      points.push({
        year: yr,
        yearLabel: yr === 0 ? 'Now' : `Yr ${yr}`,
        principal,
        interest,
        totalAccumulated,
        isMilestone: yr === 1 || yr === 5 || yr === 10,
      });
    }

    return points;
  }, [activeDaily, annualRate]);

  // Specific milestone values
  const val1Year = chartData.find((p) => p.year === 1)?.totalAccumulated || 0;
  const val5Year = chartData.find((p) => p.year === 5)?.totalAccumulated || 0;
  const val10Year = chartData.find((p) => p.year === 10)?.totalAccumulated || 0;

  const principal10Year = chartData.find((p) => p.year === 10)?.principal || 0;
  const interest10Year = chartData.find((p) => p.year === 10)?.interest || 0;
  const compoundMultiplier = principal10Year > 0 ? (val10Year / principal10Year).toFixed(2) : '1.00';

  const formatShortCurrency = (val: number) => {
    if (val >= 1_000_000) return `${currencySymbol}${(val / 1_000_000).toFixed(1)}M`;
    if (val >= 1_000) return `${currencySymbol}${(val / 1_000).toFixed(1)}k`;
    return `${currencySymbol}${val}`;
  };

  return (
    <div className="p-4 sm:p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 space-y-4 shadow-sm transition-all">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-800/80 pb-3.5">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xs uppercase tracking-wider font-bold text-zinc-100">
                Wealth Projection Engine
              </h3>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 font-semibold">
                Compound Multiplier {compoundMultiplier}x
              </span>
            </div>
            <p className="text-[11px] text-zinc-400 mt-0.5">
              Accumulated compounding value of plugged leaks over 1, 5, and 10 years
            </p>
          </div>
        </div>

        {/* Rate Selector Pills */}
        <div className="flex items-center gap-1.5 self-start sm:self-auto bg-zinc-950/80 p-1 rounded-xl border border-zinc-800">
          {PRESET_RATES.map((rate) => (
            <button
              key={rate.value}
              type="button"
              onClick={() => setAnnualRate(rate.value)}
              className={`px-2 py-1 rounded-lg text-[11px] font-medium transition-all cursor-pointer ${
                annualRate === rate.value
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-semibold shadow-xs'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
              title={rate.desc}
            >
              {rate.value}%
            </button>
          ))}
        </div>
      </div>

      {/* 3 Core Milestone Hero Cards: 1 Year, 5 Years, 10 Years */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* 1 Year */}
        <button
          type="button"
          onClick={() => setSelectedHorizon(1)}
          className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
            selectedHorizon === 1
              ? 'bg-zinc-950 border-emerald-500/50 shadow-md ring-1 ring-emerald-500/20'
              : 'bg-zinc-950/60 border-zinc-800/80 hover:border-zinc-700'
          }`}
        >
          <div className="flex items-center justify-between text-xs text-zinc-400">
            <span className="flex items-center gap-1 font-mono uppercase tracking-wider text-[10px]">
              <Calendar className="w-3 h-3 text-zinc-500" />
              <span>1-Year Horizon</span>
            </span>
            <span className="text-[10px] text-zinc-500 font-mono">Short-term Runway</span>
          </div>
          <div className="mt-1.5 font-mono text-xl font-bold text-zinc-100 tracking-tight">
            {currencySymbol}
            {val1Year.toLocaleString()}
          </div>
          <div className="mt-1 text-[10px] text-zinc-400 flex items-center justify-between font-mono">
            <span>Daily: {currencySymbol}{activeDaily.toFixed(0)}</span>
            <span className="text-emerald-400 font-semibold">12 Mo Shift</span>
          </div>
        </button>

        {/* 5 Years */}
        <button
          type="button"
          onClick={() => setSelectedHorizon(5)}
          className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
            selectedHorizon === 5
              ? 'bg-zinc-950 border-emerald-500/50 shadow-md ring-1 ring-emerald-500/20'
              : 'bg-zinc-950/60 border-zinc-800/80 hover:border-zinc-700'
          }`}
        >
          <div className="flex items-center justify-between text-xs text-zinc-400">
            <span className="flex items-center gap-1 font-mono uppercase tracking-wider text-[10px]">
              <Zap className="w-3 h-3 text-amber-400" />
              <span>5-Year Horizon</span>
            </span>
            <span className="text-[10px] text-amber-400/90 font-mono font-medium">Growth Phase</span>
          </div>
          <div className="mt-1.5 font-mono text-xl font-bold text-amber-300 tracking-tight">
            {currencySymbol}
            {val5Year.toLocaleString()}
          </div>
          <div className="mt-1 text-[10px] text-zinc-400 flex items-center justify-between font-mono">
            <span>Capital Sinking Fund</span>
            <span className="text-amber-300 font-semibold">5x Accelerator</span>
          </div>
        </button>

        {/* 10 Years */}
        <button
          type="button"
          onClick={() => setSelectedHorizon(10)}
          className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
            selectedHorizon === 10
              ? 'bg-zinc-950 border-emerald-500/60 shadow-md ring-1 ring-emerald-500/30'
              : 'bg-zinc-950/60 border-zinc-800/80 hover:border-zinc-700'
          }`}
        >
          <div className="flex items-center justify-between text-xs text-zinc-400">
            <span className="flex items-center gap-1 font-mono uppercase tracking-wider text-[10px]">
              <Sparkles className="w-3 h-3 text-emerald-400" />
              <span>10-Year Horizon</span>
            </span>
            <span className="text-[10px] text-emerald-400 font-mono font-bold">Freedom Milestone</span>
          </div>
          <div className="mt-1.5 font-mono text-xl font-bold text-emerald-400 tracking-tight">
            {currencySymbol}
            {val10Year.toLocaleString()}
          </div>
          <div className="mt-1 text-[10px] text-zinc-400 flex items-center justify-between font-mono">
            <span>
              Pure Growth: <strong className="text-emerald-300">+{currencySymbol}{interest10Year.toLocaleString()}</strong>
            </span>
            <span className="text-emerald-400 font-semibold">{compoundMultiplier}x Multiplier</span>
          </div>
        </button>
      </div>

      {/* Compounding Curve Chart */}
      <div className="p-3.5 rounded-xl bg-zinc-950 border border-zinc-800/90 space-y-2">
        <div className="flex items-center justify-between text-xs text-zinc-400">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 font-mono text-[11px] text-zinc-300">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-xs" />
              <span>Total Wealth ({annualRate}% Compound Growth)</span>
            </span>
            <span className="hidden sm:flex items-center gap-1.5 font-mono text-[11px] text-zinc-500">
              <span className="w-2.5 h-2.5 rounded-full bg-zinc-700" />
              <span>Direct Principal Saved</span>
            </span>
          </div>
          <span className="text-[11px] font-mono text-zinc-500">10-Year Trajectory</span>
        </div>

        <div className="h-44 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="wealthGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="principalGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#64748b" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#64748b" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
              <XAxis
                dataKey="yearLabel"
                stroke="#71717a"
                fontSize={10}
                tickLine={false}
                axisLine={{ stroke: '#27272a' }}
              />
              <YAxis
                stroke="#71717a"
                fontSize={10}
                tickLine={false}
                axisLine={false}
                tickFormatter={(v) => formatShortCurrency(v)}
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload as ProjectionDataPoint;
                    return (
                      <div className="p-2.5 rounded-xl bg-zinc-950/95 border border-zinc-800 shadow-2xl text-xs space-y-1.5 backdrop-blur-md font-mono">
                        <div className="flex items-center justify-between gap-4 font-bold text-zinc-100 border-b border-zinc-800 pb-1 font-sans">
                          <span>{data.year === 0 ? 'Current Baseline' : `Year ${data.year} Milestone`}</span>
                          <span className="text-emerald-400 font-mono">
                            {currencySymbol}
                            {data.totalAccumulated.toLocaleString()}
                          </span>
                        </div>
                        <div className="text-[11px] space-y-0.5 text-zinc-400">
                          <div className="flex justify-between gap-3">
                            <span>Principal Saved:</span>
                            <span className="text-zinc-200">
                              {currencySymbol}
                              {data.principal.toLocaleString()}
                            </span>
                          </div>
                          <div className="flex justify-between gap-3">
                            <span>Compounded Interest:</span>
                            <span className="text-emerald-300 font-semibold">
                              +{currencySymbol}
                              {data.interest.toLocaleString()}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              {/* Principal Baseline */}
              <Area
                type="monotone"
                dataKey="principal"
                stroke="#64748b"
                strokeWidth={1.5}
                strokeDasharray="4 4"
                fill="url(#principalGradient)"
              />
              {/* Compounding Growth */}
              <Area
                type="monotone"
                dataKey="totalAccumulated"
                stroke="#10b981"
                strokeWidth={2.5}
                fill="url(#wealthGradient)"
              />
              {/* Highlight 1, 5, 10-year markers */}
              <ReferenceDot x="Yr 1" y={val1Year} r={4} fill="#10b981" stroke="#ffffff" strokeWidth={1.5} />
              <ReferenceDot x="Yr 5" y={val5Year} r={4} fill="#f59e0b" stroke="#ffffff" strokeWidth={1.5} />
              <ReferenceDot x="Yr 10" y={val10Year} r={5} fill="#10b981" stroke="#ffffff" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Interactive Daily Leakage Slider & Formula Bar */}
      <div className="p-3 rounded-xl bg-zinc-950/80 border border-zinc-800 space-y-2">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5 font-semibold text-zinc-300">
            <Sliders className="w-3.5 h-3.5 text-emerald-400" />
            <span>Interactive Daily Leakage Saved:</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-mono font-bold text-sm text-emerald-400">
              {currencySymbol}{activeDaily.toFixed(isINR ? 0 : 2)} / day
            </span>
            <span className="text-[10px] text-zinc-500 font-mono">
              ({currencySymbol}{Math.round(activeDaily * 30).toLocaleString()} / mo)
            </span>
          </div>
        </div>

        <input
          type="range"
          min={isINR ? 50 : 1}
          max={maxSlider}
          step={sliderStep}
          value={activeDaily}
          onChange={(e) => setActiveDaily(parseFloat(e.target.value))}
          className="w-full accent-emerald-500 cursor-pointer h-1.5 bg-zinc-800 rounded-lg appearance-none"
        />

        <div className="flex items-center justify-between text-[10px] text-zinc-500 font-mono pt-0.5">
          <span>{currencySymbol}{isINR ? 50 : 1}/day</span>
          <span>Plugged Waste Daily Reinvestment</span>
          <span>{currencySymbol}{maxSlider}/day</span>
        </div>
      </div>
    </div>
  );
};
