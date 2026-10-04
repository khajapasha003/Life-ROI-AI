/**
 * Budget Threshold calculation utilities for LifeROI.
 */

export interface BudgetThresholdStatus {
  dailyGoalTarget: number;
  trackedExpenses: number;
  thresholdValue: number; // 70% of goal target
  percentage: number;
  isExceeded: boolean;
  isCritical: boolean; // >= 100%
  remainingBuffer: number;
}

/**
 * Extracts or computes the daily target amount from the user's Daily Wealth Goal string.
 * Supports:
 * - Direct daily values: "$30/day", "₹1,500 daily", "$25 a day", "$50"
 * - Milestone targets: "Save $500 for emergency fund" -> amortized daily allowance ($22.73/day)
 * - INR specific scaling
 */
export function parseDailyGoalTarget(goalText: string, currency: string): number {
  const isINR = currency === 'INR';
  const defaultTarget = isINR ? 1500 : 25;

  if (!goalText || !goalText.trim()) {
    return defaultTarget;
  }

  // Check for explicit daily notation e.g. "$30/day", "daily $25", "30 a day"
  const dailyPattern = /(?:daily|per day|\/day|\/d)\s*[:=]?\s*[\$€₹£]?\s*(\d+(?:\.\d+)?)/i;
  const matchDaily = goalText.match(dailyPattern);
  if (matchDaily && matchDaily[1]) {
    const val = parseFloat(matchDaily[1]);
    if (!isNaN(val) && val > 0) return val;
  }

  const dailyPatternAlt = /[\$€₹£]?\s*(\d+(?:\.\d+)?)\s*(?:daily|per day|\/day|\/d)/i;
  const matchDailyAlt = goalText.match(dailyPatternAlt);
  if (matchDailyAlt && matchDailyAlt[1]) {
    const val = parseFloat(matchDailyAlt[1]);
    if (!isNaN(val) && val > 0) return val;
  }

  // Extract first number
  const generalMatch = goalText.match(/[\$€₹£]?\s*([\d,]+(?:\.\d+)?)/);
  if (!generalMatch || !generalMatch[1]) {
    return defaultTarget;
  }

  const rawNum = parseFloat(generalMatch[1].replace(/,/g, ''));
  if (isNaN(rawNum) || rawNum <= 0) {
    return defaultTarget;
  }

  // If the number is modest (<= 150 for USD/EUR/GBP, or <= 7500 for INR), treat as direct daily target
  if ((isINR && rawNum <= 7500) || (!isINR && rawNum <= 150)) {
    return Math.round(rawNum * 100) / 100;
  }

  // Otherwise, it's a larger milestone (e.g. $500 emergency reserve, ₹25,000).
  // Amortize across standard 22 monthly working days:
  const amortized = Math.round((rawNum / 22) * 100) / 100;
  return Math.max(isINR ? 200 : 5, amortized);
}

export function computeBudgetThreshold(
  trackedExpenses: number,
  dailyGoalTarget: number
): BudgetThresholdStatus {
  const safeTarget = Math.max(1, dailyGoalTarget);
  const percentage = Math.round((trackedExpenses / safeTarget) * 100);
  const thresholdValue = Math.round(safeTarget * 0.7 * 100) / 100;
  const isExceeded = percentage >= 70;
  const isCritical = percentage >= 100;
  const remainingBuffer = Math.max(0, safeTarget - trackedExpenses);

  return {
    dailyGoalTarget: safeTarget,
    trackedExpenses,
    thresholdValue,
    percentage,
    isExceeded,
    isCritical,
    remainingBuffer,
  };
}
