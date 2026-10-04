import { AnalysisResult, MilestoneBadge, StreakTrackerState } from '../types/roi';

const HIGH_SCORE_THRESHOLD = 85;
const REQUIRED_DAYS = 3;

export const INITIAL_BADGES: MilestoneBadge[] = [
  {
    id: 'disciplined-spender',
    name: 'Disciplined Spender',
    tagline: 'Capital Leak Immunity',
    description: 'Maintained a high-discipline lifestyle score above 85 for three consecutive daily audits.',
    requirement: 'Score > 85 for 3 consecutive days',
    icon: 'ShieldCheck',
    category: 'discipline',
    tier: 'gold',
    unlocked: false,
    currentStreak: 0,
    requiredStreak: 3,
    rewardText: 'Recovers estimated $396/mo in friction spending',
  },
  {
    id: 'habit-titan',
    name: 'Habit Titan',
    tagline: 'Unbreakable Routine Mastery',
    description: 'Conquered afternoon dopamine drift and sustained high-output focus across 3 consecutive cycles.',
    requirement: 'Score > 85 for 3 consecutive days',
    icon: 'Flame',
    category: 'habits',
    tier: 'diamond',
    unlocked: false,
    currentStreak: 0,
    requiredStreak: 3,
    rewardText: 'Returns ~1.5 hours of daily cognitive deep-work clarity',
  },
  {
    id: 'friction-breaker',
    name: 'Friction Breaker',
    tagline: 'First Step to Autonomy',
    description: 'Achieved an initial single-day discipline score above 85.',
    requirement: 'Score > 85 on any daily audit',
    icon: 'Zap',
    category: 'discipline',
    tier: 'silver',
    unlocked: false,
    currentStreak: 0,
    requiredStreak: 1,
    rewardText: 'Bypassed impulse triggers for 24 hours',
  },
  {
    id: 'compound-vanguard',
    name: 'Compound Vanguard',
    tagline: 'Elite 10-Year Trajectory',
    description: 'Sustained elite discipline (>85 score) across 5 consecutive audits.',
    requirement: 'Score > 85 for 5 consecutive days',
    icon: 'TrendingUp',
    category: 'wealth',
    tier: 'diamond',
    unlocked: false,
    currentStreak: 0,
    requiredStreak: 5,
    rewardText: 'Projected 10-year wealth acceleration of +$120,000',
  },
];

/**
 * Calculates streak state and badge unlock status from history and current score.
 */
export function calculateMilestones(
  history: AnalysisResult[],
  currentAnalysis: AnalysisResult | null,
  overrideStreak?: number
): { streakState: StreakTrackerState; badges: MilestoneBadge[] } {
  // Combine chronological history (oldest to newest) plus current analysis
  const audits: { date: string; score: number }[] = [];

  // Add history items
  history.forEach((h, index) => {
    audits.push({
      date: h.timestamp ? new Date(h.timestamp).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : `Day ${index + 1}`,
      score: h.score || h.dailyScore || 0,
    });
  });

  // Append current analysis if present
  if (currentAnalysis) {
    const todayScore = currentAnalysis.score || currentAnalysis.dailyScore || 0;
    audits.push({
      date: 'Today',
      score: todayScore,
    });
  }

  // Calculate consecutive streak of score > 85 ending at the latest audit
  let currentStreak = 0;
  for (let i = audits.length - 1; i >= 0; i--) {
    if (audits[i].score > HIGH_SCORE_THRESHOLD) {
      currentStreak++;
    } else {
      break;
    }
  }

  // If user passed in an override streak (e.g. from local storage test mode or simulation)
  if (overrideStreak !== undefined) {
    currentStreak = overrideStreak;
  }

  // Build recent 3-day window visualization
  const recentDays: { date: string; score: number; passed: boolean }[] = [];
  const totalSlots = 3;
  for (let s = 0; s < totalSlots; s++) {
    const dayIndex = audits.length - totalSlots + s;
    if (dayIndex >= 0 && audits[dayIndex]) {
      recentDays.push({
        date: audits[dayIndex].date,
        score: audits[dayIndex].score,
        passed: audits[dayIndex].score > HIGH_SCORE_THRESHOLD,
      });
    } else {
      // Mock day slot if history is short
      const simulatedPassed = s < currentStreak;
      recentDays.push({
        date: s === 2 ? 'Day 3 (Today)' : `Day ${s + 1}`,
        score: simulatedPassed ? 88 + s * 2 : 70,
        passed: simulatedPassed,
      });
    }
  }

  const isThreeDayStreakUnlocked = currentStreak >= REQUIRED_DAYS;

  const streakState: StreakTrackerState = {
    currentHighScoreStreak: currentStreak,
    highestScoreStreak: Math.max(currentStreak, isThreeDayStreakUnlocked ? 3 : 0),
    thresholdScore: HIGH_SCORE_THRESHOLD,
    requiredConsecutiveDays: REQUIRED_DAYS,
    recentScores: recentDays,
    isUnlocked: isThreeDayStreakUnlocked,
  };

  // Evaluate badge statuses
  const badges: MilestoneBadge[] = INITIAL_BADGES.map((badge) => {
    let unlocked = false;
    let streakCount = currentStreak;

    if (badge.id === 'disciplined-spender' || badge.id === 'habit-titan') {
      unlocked = currentStreak >= 3;
    } else if (badge.id === 'friction-breaker') {
      unlocked = currentStreak >= 1 || audits.some((a) => a.score > HIGH_SCORE_THRESHOLD);
    } else if (badge.id === 'compound-vanguard') {
      unlocked = currentStreak >= 5;
    }

    return {
      ...badge,
      unlocked,
      currentStreak: streakCount,
      unlockedAt: unlocked ? 'Active' : undefined,
    };
  });

  return { streakState, badges };
}
