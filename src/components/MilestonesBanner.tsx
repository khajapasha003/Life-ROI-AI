import React, { useState } from 'react';
import {
  ShieldCheck,
  Flame,
  Award,
  Zap,
  TrendingUp,
  CheckCircle2,
  Lock,
  Sparkles,
  Info,
  ChevronRight,
  RotateCcw,
} from 'lucide-react';
import { MilestoneBadge, StreakTrackerState } from '../types/roi';

interface MilestonesBannerProps {
  streakState: StreakTrackerState;
  badges: MilestoneBadge[];
  onOpenDetailsModal: () => void;
  onSimulateStreakToggle?: () => void;
  isSimulatedStreak?: boolean;
}

export const MilestonesBanner: React.FC<MilestonesBannerProps> = ({
  streakState,
  badges,
  onOpenDetailsModal,
  onSimulateStreakToggle,
  isSimulatedStreak,
}) => {
  const [selectedBadge, setSelectedBadge] = useState<MilestoneBadge | null>(null);

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
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-zinc-900/90 via-zinc-900/95 to-zinc-900/90 border border-zinc-800/80 p-5 shadow-xl transition-all">
      {/* Background ambient glow if 3-day streak active */}
      {isThreeDayAchieved && (
        <div className="absolute -top-12 -right-12 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none animate-pulse" />
      )}

      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Left: Title & 3-Day Consecutive Tracker */}
        <div className="space-y-3">
          <div className="flex items-center gap-2.5">
            <div className={`p-2 rounded-xl flex items-center justify-center ${
              isThreeDayAchieved
                ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30 shadow-[0_0_15px_rgba(245,158,11,0.2)]'
                : 'bg-zinc-800 text-zinc-400 border border-zinc-700/50'
            }`}>
              <Award className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-semibold text-zinc-100 uppercase tracking-wider flex items-center gap-1.5">
                  LifeROI Milestones
                  {isThreeDayAchieved && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                      <Sparkles className="w-3 h-3 text-amber-400" />
                      3-Day &gt;85 Streak Active!
                    </span>
                  )}
                </h3>
              </div>
              <p className="text-xs text-zinc-400">
                Awards prestigious badges when your Discipline Score stays above <span className="font-semibold text-emerald-400">85</span> for <span className="font-semibold text-zinc-200">3 consecutive days</span>.
              </p>
            </div>
          </div>

          {/* 3-Day Consecutive Meter */}
          <div className="flex items-center gap-2 pt-0.5">
            <span className="text-[11px] font-medium text-zinc-400 mr-1">Consecutive Progress:</span>
            {[1, 2, 3].map((dayNum) => {
              const isPassed = streakState.currentHighScoreStreak >= dayNum;
              return (
                <div
                  key={dayNum}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-mono font-medium transition-all ${
                    isPassed
                      ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-500/40 shadow-[0_0_10px_rgba(16,185,129,0.15)]'
                      : 'bg-zinc-950/60 text-zinc-500 border border-zinc-800'
                  }`}
                >
                  {isPassed ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  ) : (
                    <div className="w-3.5 h-3.5 rounded-full border border-zinc-700 flex items-center justify-center text-[9px] text-zinc-500">
                      {dayNum}
                    </div>
                  )}
                  <span>Day {dayNum}</span>
                  <span className="text-[10px] opacity-75">(&gt;85)</span>
                </div>
              );
            })}

            <span className="text-xs font-mono font-semibold text-zinc-300 ml-1">
              [{Math.min(streakState.currentHighScoreStreak, 3)}/3]
            </span>
          </div>
        </div>

        {/* Right: Badge Cards Showcase */}
        <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
          {badges.map((badge) => {
            const isUnlocked = badge.unlocked;
            const isPrimaryTarget = badge.id === 'disciplined-spender' || badge.id === 'habit-titan';

            return (
              <div
                key={badge.id}
                onClick={() => setSelectedBadge(badge)}
                role="button"
                tabIndex={0}
                className={`group relative flex items-center gap-2.5 px-3 py-2 rounded-xl border transition-all cursor-pointer select-none ${
                  isUnlocked
                    ? badge.id === 'disciplined-spender'
                      ? 'bg-gradient-to-r from-amber-950/50 to-amber-900/30 border-amber-500/40 text-amber-200 shadow-[0_0_15px_rgba(245,158,11,0.25)] hover:border-amber-400 hover:scale-[1.02]'
                      : badge.id === 'habit-titan'
                      ? 'bg-gradient-to-r from-purple-950/50 to-indigo-950/40 border-purple-500/40 text-purple-200 shadow-[0_0_15px_rgba(168,85,247,0.25)] hover:border-purple-400 hover:scale-[1.02]'
                      : 'bg-zinc-950/60 border-emerald-500/30 text-emerald-300 hover:border-emerald-400'
                    : 'bg-zinc-950/40 border-zinc-800 text-zinc-500 opacity-60 hover:opacity-90 hover:border-zinc-700'
                }`}
              >
                {/* Badge Icon */}
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-transform group-hover:scale-110 ${
                    isUnlocked
                      ? badge.id === 'disciplined-spender'
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        : badge.id === 'habit-titan'
                        ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                        : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      : 'bg-zinc-900 text-zinc-600 border border-zinc-800'
                  }`}
                >
                  {isUnlocked ? (
                    renderIcon(badge.icon, 'w-4 h-4')
                  ) : (
                    <Lock className="w-3.5 h-3.5 text-zinc-600" />
                  )}
                </div>

                {/* Badge Info */}
                <div className="text-left">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold leading-tight tracking-tight text-zinc-100 group-hover:text-white">
                      {badge.name}
                    </span>
                    {isUnlocked && (
                      <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 font-semibold uppercase">
                        Awarded
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] text-zinc-400 block leading-tight">
                    {isUnlocked ? badge.tagline : 'Requires 3d >85'}
                  </span>
                </div>

                {/* Glow ring for unlocked high-tier badges */}
                {isUnlocked && isPrimaryTarget && (
                  <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500"></span>
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer controls: Simulation Test Button & View All Lore Modal */}
      <div className="mt-3.5 pt-3 border-t border-zinc-800/80 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          {onSimulateStreakToggle && (
            <button
              onClick={onSimulateStreakToggle}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-mono font-medium flex items-center gap-1.5 transition-colors cursor-pointer border ${
                isSimulatedStreak
                  ? 'bg-amber-950/60 border-amber-500/50 text-amber-300 hover:bg-amber-900/60'
                  : 'bg-zinc-800/80 border-zinc-700/60 text-zinc-300 hover:bg-zinc-750 hover:text-white'
              }`}
            >
              <RotateCcw className="w-3 h-3" />
              <span>
                {isSimulatedStreak ? 'Simulated 3-Day >85 Streak Active (Click to Reset)' : 'Test: Simulate 3-Day >85 Streak'}
              </span>
            </button>
          )}
          <span className="text-zinc-500 text-[11px]">
            {isThreeDayAchieved
              ? 'Badges live on dashboard & executive PDF audits.'
              : 'Log 3 consecutive audits with score >85 to unlock.'}
          </span>
        </div>

        <button
          onClick={onOpenDetailsModal}
          className="text-xs font-medium text-emerald-400 hover:text-emerald-300 flex items-center gap-1 transition-colors cursor-pointer"
        >
          <span>View All Milestones &amp; Lore</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Quick Badge Details Popover */}
      {selectedBadge && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="w-full max-w-sm rounded-2xl bg-zinc-900 border border-zinc-800 p-5 space-y-3 shadow-2xl relative">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    selectedBadge.unlocked
                      ? selectedBadge.id === 'disciplined-spender'
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-[0_0_15px_rgba(245,158,11,0.3)]'
                        : 'bg-purple-500/20 text-purple-300 border border-purple-500/40 shadow-[0_0_15px_rgba(168,85,247,0.3)]'
                      : 'bg-zinc-800 text-zinc-500'
                  }`}
                >
                  {selectedBadge.unlocked ? renderIcon(selectedBadge.icon, 'w-5 h-5') : <Lock className="w-5 h-5" />}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-zinc-100">{selectedBadge.name}</h4>
                  <span className="text-[11px] font-medium text-emerald-400">{selectedBadge.tagline}</span>
                </div>
              </div>
              <button
                onClick={() => setSelectedBadge(null)}
                className="text-zinc-400 hover:text-white p-1 rounded-lg hover:bg-zinc-800"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-zinc-300 leading-relaxed">{selectedBadge.description}</p>

            <div className="rounded-xl bg-zinc-950/70 border border-zinc-800/80 p-3 space-y-1.5 text-xs">
              <div className="flex justify-between text-zinc-400">
                <span>Unlock Criteria:</span>
                <span className="font-semibold text-zinc-200">{selectedBadge.requirement}</span>
              </div>
              <div className="flex justify-between text-zinc-400">
                <span>Current Status:</span>
                <span className={selectedBadge.unlocked ? 'font-bold text-amber-400' : 'text-zinc-500'}>
                  {selectedBadge.unlocked ? 'AWARDED & ACTIVE' : `In Progress (${streakState.currentHighScoreStreak}/${selectedBadge.requiredStreak} days)`}
                </span>
              </div>
              <div className="flex justify-between text-zinc-400">
                <span>Enterprise Reward:</span>
                <span className="text-emerald-400 font-medium text-right">{selectedBadge.rewardText}</span>
              </div>
            </div>

            <button
              onClick={() => setSelectedBadge(null)}
              className="w-full py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs font-semibold text-zinc-200 transition-colors cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
