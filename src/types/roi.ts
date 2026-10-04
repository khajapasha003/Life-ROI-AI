export type CurrencyCode = 'USD' | 'EUR' | 'INR' | 'GBP';

export interface CurrencyConfig {
  code: CurrencyCode;
  symbol: string;
  name: string;
}

export interface LeakItem {
  title: string;
  type: 'micro_spend' | 'time_drain';
  dailyAmount: number;
  monthlyWaste: number;
  timeDrainMinutes?: number;
  impactSummary: string;
}

export interface OptimizationFix {
  title: string;
  swap: string;
  immediateSavings: number;
  healthProductivityGain: string;
}

export interface WealthShift {
  savedToday: number;
  divertDestination: string;
  oneYearCompounded: number;
  tenYearCompounded: number;
  actionDirective: string;
}

export interface QuickWin {
  task: string;
  durationMinutes: number;
  projectedImpact: string;
  isCompleted?: boolean;
}

export interface ScoreBreakdown {
  habitScore: number;
  expenseEfficiency: number;
  headline: string;
}

export interface StrictAutonomousAudit {
  score: number;
  headline: string;
  leakName: string;
  leakMonthlyWaste: string;
  leakSolution: string;
  dailySaved: string;
  tenYearCompounded: string;
  assetTarget: string;
  tomorrowQuickWin: string;
}

export interface AnalysisResult {
  id?: string;
  timestamp?: string;
  // Strict 9-field core autonomous schema
  score: number;
  headline: string;
  leakName: string;
  leakMonthlyWaste: string;
  leakSolution: string;
  dailySaved: string;
  tenYearCompounded: string;
  assetTarget: string;
  tomorrowQuickWin: string;
  // Extended visual dashboard metrics
  dailyScore: number;
  scoreBreakdown: ScoreBreakdown;
  currencySymbol: string;
  currencyCode: CurrencyCode | string;
  leaksDetected: LeakItem[];
  totalDailyWaste: number;
  totalMonthlyWaste: number;
  immediateOptimizationFix: OptimizationFix;
  microRoiWealthShift: WealthShift;
  quickWinTomorrow: QuickWin;
  conciseSummaryMarkdown: string;
}

export interface LogPreset {
  id: string;
  name: string;
  currency: CurrencyCode;
  logText: string;
  description: string;
}

export interface MilestoneBadge {
  id: string;
  name: string;
  tagline: string;
  description: string;
  requirement: string;
  icon: string;
  category: 'discipline' | 'wealth' | 'habits';
  tier: 'bronze' | 'silver' | 'gold' | 'diamond';
  unlocked: boolean;
  unlockedAt?: string;
  currentStreak: number;
  requiredStreak: number;
  rewardText: string;
}

export interface StreakTrackerState {
  currentHighScoreStreak: number;
  highestScoreStreak: number;
  thresholdScore: number;
  requiredConsecutiveDays: number;
  recentScores: { date: string; score: number; passed: boolean }[];
  isUnlocked: boolean;
}

export interface MicroHabit {
  id: string;
  name: string;
  category: 'spending' | 'focus' | 'wellness';
  points: number;
  description: string;
  financialImpact: string;
  icon: string;
}

export type SentimentType = 'elevated' | 'balanced' | 'vulnerable';

export interface EmotionalSentimentModifier {
  type: SentimentType;
  modifier: number;
  label: string;
  badgeColor: string;
  insight: string;
  detectedKeywords: string[];
}
