import React, { useState, useEffect } from 'react';
import {
  CheckCircle2,
  Circle,
  PlusCircle,
  Sparkles,
  Zap,
  TrendingUp,
  RotateCcw,
  UtensilsCrossed,
  ShieldBan,
  Brain,
  Dumbbell,
  Smartphone,
  Coffee,
  Droplets,
  Car,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { MicroHabit } from '../types/roi';

export const DEFAULT_MICRO_HABITS: MicroHabit[] = [
  {
    id: 'cooked-home-meal',
    name: 'Cooked Home Meal',
    category: 'spending',
    points: 4,
    description: 'Avoided delivery apps & restaurant surcharges',
    financialImpact: 'Saves ~$14.00/meal',
    icon: 'UtensilsCrossed',
  },
  {
    id: 'no-impulse-purchase',
    name: 'No Impulse Purchase',
    category: 'spending',
    points: 5,
    description: 'Zero non-essential checkouts or spontaneous carts',
    financialImpact: 'Saves ~$25-50/day',
    icon: 'ShieldBan',
  },
  {
    id: 'deep-work-4h',
    name: 'Deep Work 4h+',
    category: 'focus',
    points: 4,
    description: 'Uninterrupted creative/engineering focus blocks',
    financialImpact: 'High career & output ROI',
    icon: 'Brain',
  },
  {
    id: 'workout-exercise',
    name: 'Physical Workout (30m+)',
    category: 'wellness',
    points: 3,
    description: 'Aerobic, strength, or high-intensity movement',
    financialImpact: 'Reduces health friction',
    icon: 'Dumbbell',
  },
  {
    id: 'screen-time-under-2h',
    name: 'Screen Time ≤ 2h',
    category: 'focus',
    points: 3,
    description: 'Avoided afternoon algorithm rabbit-holes & doomscrolling',
    financialImpact: '+90 mins recaptured',
    icon: 'Smartphone',
  },
  {
    id: 'homebrewed-coffee',
    name: 'Homebrewed Coffee',
    category: 'spending',
    points: 2,
    description: 'Brewed coffee/tea at home instead of cafe run',
    financialImpact: 'Saves ~$6.50/day',
    icon: 'Coffee',
  },
  {
    id: 'hydration-2l',
    name: 'Hydration & Clean Diet',
    category: 'wellness',
    points: 2,
    description: '2L+ water and whole foods, avoiding sugar crashes',
    financialImpact: 'Prevents 3PM energy slump',
    icon: 'Droplets',
  },
  {
    id: 'zero-convenience-ride',
    name: 'Zero Convenience Cabs',
    category: 'spending',
    points: 3,
    description: 'Walked, biked, or used transit instead of surge ride',
    financialImpact: 'Saves ~$18.00/day',
    icon: 'Car',
  },
];

interface MicroHabitsTrackerProps {
  baseScore: number;
  onAdjustedScoreChange?: (adjustedScore: number, bonusPoints: number, activeHabitNames: string[]) => void;
  onAppendToLog?: (habitsText: string) => void;
}

const STORAGE_KEY = 'liferoi_micro_habits_selected';

export const MicroHabitsTracker: React.FC<MicroHabitsTrackerProps> = ({
  baseScore,
  onAdjustedScoreChange,
  onAppendToLog,
}) => {
  const [selectedIds, setSelectedIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : ['cooked-home-meal', 'no-impulse-purchase'];
    } catch {
      return ['cooked-home-meal', 'no-impulse-purchase'];
    }
  });

  const [isExpanded, setIsExpanded] = useState(true);

  // Compute bonus points
  const activeHabits = DEFAULT_MICRO_HABITS.filter((h) => selectedIds.includes(h.id));
  const bonusPoints = activeHabits.reduce((acc, h) => acc + h.points, 0);

  // Total adjusted score capped at 100
  const adjustedScore = Math.min(100, Math.max(1, baseScore + bonusPoints));

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(selectedIds));
    } catch (e) {
      console.warn('Failed to save micro-habits to localStorage', e);
    }

    if (onAdjustedScoreChange) {
      onAdjustedScoreChange(
        adjustedScore,
        bonusPoints,
        activeHabits.map((h) => h.name)
      );
    }
  }, [selectedIds, baseScore, bonusPoints, adjustedScore]);

  const toggleHabit = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    setSelectedIds(DEFAULT_MICRO_HABITS.map((h) => h.id));
  };

  const handleClearAll = () => {
    setSelectedIds([]);
  };

  const handleAppendLog = () => {
    if (!onAppendToLog || activeHabits.length === 0) return;
    const lines = activeHabits.map((h) => `✓ ${h.name} (${h.financialImpact})`).join('\n');
    const textToAppend = `[Daily Micro-Habits Verified]:\n${lines}`;
    onAppendToLog(textToAppend);
  };

  const renderIcon = (iconName: string) => {
    const props = { className: 'w-3.5 h-3.5 shrink-0' };
    switch (iconName) {
      case 'UtensilsCrossed':
        return <UtensilsCrossed {...props} />;
      case 'ShieldBan':
        return <ShieldBan {...props} />;
      case 'Brain':
        return <Brain {...props} />;
      case 'Dumbbell':
        return <Dumbbell {...props} />;
      case 'Smartphone':
        return <Smartphone {...props} />;
      case 'Coffee':
        return <Coffee {...props} />;
      case 'Droplets':
        return <Droplets {...props} />;
      case 'Car':
        return <Car {...props} />;
      default:
        return <Sparkles {...props} />;
    }
  };

  return (
    <div className="rounded-2xl bg-zinc-900/90 border border-zinc-800 p-4 shadow-xl space-y-3">
      {/* Header Bar */}
      <div className="flex items-center justify-between border-b border-zinc-800/80 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <Zap className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xs font-bold text-zinc-100 uppercase tracking-wide">
                Daily Micro-Habit Tracker
              </h3>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold">
                +{bonusPoints} Pts Active
              </span>
            </div>
            <p className="text-[11px] text-zinc-400">
              Toggle daily executions to dynamically adjust your live Discipline Score.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Live Score Adjustment Pill */}
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-zinc-950 border border-zinc-800 font-mono text-xs">
            <span className="text-zinc-500">Base {baseScore}</span>
            <span className="text-emerald-400 font-bold">+{bonusPoints}</span>
            <span className="text-zinc-600">=</span>
            <span className={`font-bold ${adjustedScore >= 85 ? 'text-amber-400' : 'text-emerald-300'}`}>
              {adjustedScore}/100
            </span>
          </div>

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1 rounded-lg text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 transition-colors cursor-pointer"
            title={isExpanded ? 'Collapse' : 'Expand'}
          >
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {isExpanded && (
        <div className="space-y-3 pt-1">
          {/* Quick Action Controls */}
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-zinc-400 font-medium">
              Active Executions: {activeHabits.length} of {DEFAULT_MICRO_HABITS.length}
            </span>

            <div className="flex items-center gap-2">
              <button
                onClick={handleSelectAll}
                className="text-zinc-400 hover:text-zinc-200 transition-colors cursor-pointer"
              >
                Select All
              </button>
              <span className="text-zinc-700">·</span>
              <button
                onClick={handleClearAll}
                className="text-zinc-400 hover:text-zinc-200 transition-colors cursor-pointer"
              >
                Clear
              </button>
              {onAppendToLog && (
                <>
                  <span className="text-zinc-700">·</span>
                  <button
                    onClick={handleAppendLog}
                    disabled={activeHabits.length === 0}
                    className="text-emerald-400 hover:text-emerald-300 font-medium transition-colors cursor-pointer disabled:opacity-40"
                  >
                    Sync to Daily Log
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Micro-Habits Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {DEFAULT_MICRO_HABITS.map((habit) => {
              const isChecked = selectedIds.includes(habit.id);
              return (
                <div
                  key={habit.id}
                  onClick={() => toggleHabit(habit.id)}
                  className={`flex items-start justify-between p-2.5 rounded-xl border transition-all cursor-pointer select-none ${
                    isChecked
                      ? 'bg-emerald-950/20 border-emerald-500/40 shadow-xs'
                      : 'bg-zinc-950/60 border-zinc-800/80 hover:border-zinc-700/80'
                  }`}
                >
                  <div className="flex items-start gap-2.5">
                    <div
                      className={`mt-0.5 p-1 rounded-lg transition-colors ${
                        isChecked
                          ? 'bg-emerald-500/20 text-emerald-400'
                          : 'bg-zinc-900 text-zinc-500'
                      }`}
                    >
                      {renderIcon(habit.icon)}
                    </div>

                    <div className="space-y-0.5">
                      <div className="flex items-center gap-1.5">
                        <span
                          className={`text-xs font-semibold ${
                            isChecked ? 'text-zinc-100' : 'text-zinc-300'
                          }`}
                        >
                          {habit.name}
                        </span>
                        <span
                          className={`text-[10px] font-mono px-1.5 py-0.2 rounded font-bold ${
                            isChecked
                              ? 'bg-emerald-500/20 text-emerald-300'
                              : 'bg-zinc-800 text-zinc-400'
                          }`}
                        >
                          +{habit.points} pts
                        </span>
                      </div>
                      <p className="text-[10px] text-zinc-400 line-clamp-1">
                        {habit.description}
                      </p>
                      <span className="text-[9px] font-mono text-emerald-400/80 block">
                        {habit.financialImpact}
                      </span>
                    </div>
                  </div>

                  <div className="shrink-0 mt-0.5 ml-2">
                    {isChecked ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 fill-emerald-400/20" />
                    ) : (
                      <Circle className="w-4 h-4 text-zinc-600 hover:text-zinc-400" />
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Milestone Notification Banner when Adjusted Score reaches 85 */}
          {adjustedScore >= 85 && (
            <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/25 flex items-center justify-between text-xs text-amber-300 animate-in fade-in duration-200">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
                <span>
                  Adjusted score <strong>{adjustedScore}/100</strong> qualifies for{' '}
                  <strong>&gt;85 Milestone Badges</strong> (Disciplined Spender &amp; Habit Titan)!
                </span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
