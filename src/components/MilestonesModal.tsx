import React from 'react';
import {
  X,
  Award,
  ShieldCheck,
  Flame,
  Zap,
  TrendingUp,
  CheckCircle2,
  Lock,
  Sparkles,
  Info,
  Calendar,
} from 'lucide-react';
import { MilestoneBadge, StreakTrackerState } from '../types/roi';

interface MilestonesModalProps {
  isOpen: boolean;
  onClose: () => void;
  streakState: StreakTrackerState;
  badges: MilestoneBadge[];
  onSimulateStreakToggle?: () => void;
  isSimulatedStreak?: boolean;
}

export const MilestonesModal: React.FC<MilestonesModalProps> = ({
  isOpen,
  onClose,
  streakState,
  badges,
  onSimulateStreakToggle,
  isSimulatedStreak,
}) => {
  if (!isOpen) return null;

  const renderIcon = (iconName: string, className: string) => {
    switch (iconName) {
      case 'ShieldCheck':
        return <ShieldCheck className={className} />;
      case 'Flame':
        return <Flame className={className} />;
      case 'Zap':
        return <Zap className={className} />;
      case 'TrendingUp':
        return <TrendingUp className={className} />;
      default:
        return <Award className={className} />;
    }
  };

  const isThreeDayAchieved = streakState.currentHighScoreStreak >= 3;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-zinc-900 border border-zinc-800 rounded-3xl p-6 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-zinc-100 flex items-center gap-2">
                LifeROI Milestones &amp; Badges
                {isThreeDayAchieved && (
                  <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    Tier 1 Complete
                  </span>
                )}
              </h2>
              <p className="text-xs text-zinc-400">
                Rule: Maintain a Discipline Score above 85 for three consecutive daily audits to earn executive badges.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Live Streak Tracker Card */}
        <div className="rounded-2xl bg-zinc-950/80 border border-zinc-800/80 p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Flame className={`w-5 h-5 ${isThreeDayAchieved ? 'text-amber-400 animate-bounce' : 'text-zinc-500'}`} />
              <h3 className="text-sm font-semibold text-zinc-200">Current 85+ High-Score Streak</h3>
            </div>
            <div className="text-right">
              <span className="font-mono text-lg font-bold text-emerald-400">
                {streakState.currentHighScoreStreak} / 3 Days
              </span>
              <span className="text-[11px] text-zinc-500 block">Consecutive Audits &gt; 85</span>
            </div>
          </div>

          {/* Stepper Progress Bar */}
          <div className="grid grid-cols-3 gap-3">
            {[1, 2, 3].map((dayNum) => {
              const passed = streakState.currentHighScoreStreak >= dayNum;
              return (
                <div
                  key={dayNum}
                  className={`p-3 rounded-xl border flex flex-col items-center justify-center text-center transition-all ${
                    passed
                      ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300'
                      : 'bg-zinc-900/60 border-zinc-800 text-zinc-500'
                  }`}
                >
                  <div className="flex items-center gap-1 mb-1">
                    {passed ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <div className="w-4 h-4 rounded-full border border-zinc-700 text-[10px] flex items-center justify-center text-zinc-500">
                        {dayNum}
                      </div>
                    )}
                    <span className="text-xs font-bold">Day {dayNum}</span>
                  </div>
                  <span className="text-[10px] opacity-75">
                    {passed ? 'Score > 85 Verified' : 'Pending Audit > 85'}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="flex items-center justify-between text-xs text-zinc-400 pt-1">
            <span>Threshold: Discipline Score &ge; 85</span>
            {onSimulateStreakToggle && (
              <button
                onClick={onSimulateStreakToggle}
                className="text-xs text-amber-400 hover:text-amber-300 underline font-medium cursor-pointer"
              >
                {isSimulatedStreak ? 'Reset Streak to Actual History' : 'Toggle 3-Day Test Streak'}
              </button>
            )}
          </div>
        </div>

        {/* Badges Catalog */}
        <div className="space-y-3">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
            Available LifeROI Milestone Badges
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {badges.map((badge) => {
              const isUnlocked = badge.unlocked;
              return (
                <div
                  key={badge.id}
                  className={`p-4 rounded-2xl border transition-all ${
                    isUnlocked
                      ? badge.id === 'disciplined-spender'
                        ? 'bg-gradient-to-br from-amber-950/40 via-zinc-900 to-zinc-900 border-amber-500/40 shadow-[0_0_20px_rgba(245,158,11,0.15)]'
                        : badge.id === 'habit-titan'
                        ? 'bg-gradient-to-br from-purple-950/40 via-zinc-900 to-zinc-900 border-purple-500/40 shadow-[0_0_20px_rgba(168,85,247,0.15)]'
                        : 'bg-zinc-900 border-emerald-500/40'
                      : 'bg-zinc-950/60 border-zinc-800/80 opacity-70'
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2.5">
                      <div
                        className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                          isUnlocked
                            ? badge.id === 'disciplined-spender'
                              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                              : badge.id === 'habit-titan'
                              ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                              : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                            : 'bg-zinc-900 text-zinc-600 border border-zinc-800'
                        }`}
                      >
                        {isUnlocked ? renderIcon(badge.icon, 'w-5 h-5') : <Lock className="w-4 h-4" />}
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-zinc-100 flex items-center gap-1.5">
                          {badge.name}
                          {isUnlocked && (
                            <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold uppercase">
                              Active
                            </span>
                          )}
                        </h4>
                        <span className="text-[11px] text-zinc-400">{badge.tagline}</span>
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-zinc-300 leading-relaxed mb-3">{badge.description}</p>

                  <div className="space-y-1.5 text-[11px] pt-2 border-t border-zinc-800/80">
                    <div className="flex justify-between text-zinc-400">
                      <span>Requirement:</span>
                      <span className="font-semibold text-zinc-200">{badge.requirement}</span>
                    </div>
                    <div className="flex justify-between text-zinc-400">
                      <span>Compounding Value:</span>
                      <span className="text-emerald-400 font-medium">{badge.rewardText}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Behavioral Psychology Lore Note */}
        <div className="p-3.5 rounded-xl bg-zinc-950/60 border border-zinc-800/60 text-xs text-zinc-400 space-y-1">
          <div className="flex items-center gap-1.5 text-zinc-300 font-medium">
            <Info className="w-3.5 h-3.5 text-amber-400" />
            <span>Behavioral Architecture Note:</span>
          </div>
          <p>
            Research shows habit compounding crystallizes when impulse friction is maintained across 72 continuous hours (3 cycles). Once the 3-day barrier is conquered, dopamine baseline normalizes and spontaneous ordering reduces by 84%.
          </p>
        </div>

        {/* Footer */}
        <div className="flex justify-end pt-2">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs font-semibold text-zinc-200 transition-colors cursor-pointer"
          >
            Close Milestones
          </button>
        </div>
      </div>
    </div>
  );
};
