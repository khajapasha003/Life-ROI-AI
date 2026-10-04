import { AnalysisResult, CurrencyCode } from '../types/roi';

const CURRENCY_SYMBOLS: Record<CurrencyCode, string> = {
  USD: '$',
  EUR: '€',
  INR: '₹',
  GBP: '£',
};

export function generateFallbackAnalysis(logText: string, currency: CurrencyCode): AnalysisResult {
  const sym = CURRENCY_SYMBOLS[currency] || '$';

  // Detect high-discipline input
  const isHighDiscipline =
    /aerobic|5-mile|titan|uninterrupted|zero screen|homebrewed/i.test(logText);

  // Scale numbers appropriately for INR vs USD/EUR/GBP
  const isINR = currency === 'INR';
  const multiplier = isINR ? 80 : 1;

  const latteSpend = isHighDiscipline ? 1.5 * multiplier : 6.5 * multiplier;
  const foodDeliveryFee = isHighDiscipline ? 2.5 * multiplier : 14 * multiplier;
  const totalDaily = latteSpend + foodDeliveryFee;
  // Actuarial formula: 30-Day Waste = Base Spend * 22 days
  const monthly = Math.round(totalDaily * 22);
  // Actuarial formula: Daily Recoverable Cash = Exactly 72% of identified impulse spend
  const dailySaved = Math.round(totalDaily * 0.72 * 100) / 100;
  const oneYearComp = Math.round(dailySaved * 365 * 1.06);
  // Actuarial formula: 10-Year Opportunity Cost = Daily Recoverable Cash * 30 * 12 compounded at 12.0% annual yield (~17.5x annual multiplier)
  const tenYearCompAt12 = Math.round(dailySaved * 30 * 12 * 17.5);

  const calculatedScore = isHighDiscipline ? 91 : 68;
  const headline = isHighDiscipline
    ? 'Elite Habit Execution, Minimal Friction'
    : 'Solid Core Focus, Leaky Mid-Day Friction';

  return {
    id: `analysis-${Date.now()}`,
    timestamp: new Date().toISOString(),
    // Strict 9-field Autonomous Intelligence schema
    score: calculatedScore,
    headline: headline,
    leakName: isHighDiscipline ? 'Incidental Digital Subscriptions' : 'Impulse Delivery Surcharges & Screen Drift',
    leakMonthlyWaste: `${sym}${monthly}/month`,
    leakSolution: isHighDiscipline
      ? 'Audit recurring software passes; lock in annual discount rate.'
      : 'Prep a 3-minute desk meal bowl from pantry staples instead of opening delivery apps.',
    dailySaved: `${sym}${dailySaved}`,
    tenYearCompounded: `${sym}${tenYearCompAt12.toLocaleString()}`,
    assetTarget:
      currency === 'INR'
        ? 'Nifty 50 Index Fund / Liquid SGB'
        : 'Low-Cost Vanguard S&P 500 ETF (VOO)',
    tomorrowQuickWin: 'Set up coffee beans and water tumbler on counter tonight (Saves 18 mins).',
    // Extended metrics
    dailyScore: calculatedScore,
    scoreBreakdown: {
      habitScore: isHighDiscipline ? 94 : 72,
      expenseEfficiency: isHighDiscipline ? 88 : 64,
      headline: headline,
    },
    currencySymbol: sym,
    currencyCode: currency,
    leaksDetected: [
      {
        title: 'Impulse Food Delivery & Service Surcharges',
        type: 'micro_spend',
        dailyAmount: foodDeliveryFee,
        monthlyWaste: Math.round(foodDeliveryFee * 22),
        impactSummary: `Paying ~${sym}${foodDeliveryFee}/day on delivery markup & fees burns ${sym}${Math.round(foodDeliveryFee * 22)} across 22 work cycles with zero asset gain.`,
      },
      {
        title: 'Passive Afternoon Social Scrolling',
        type: 'time_drain',
        dailyAmount: 0,
        monthlyWaste: 0,
        timeDrainMinutes: 50,
        impactSummary: '50 minutes lost to doomscrolling creates 25 hours of monthly cognitive fog and delays evening rest.',
      },
    ],
    totalDailyWaste: totalDaily,
    totalMonthlyWaste: monthly,
    immediateOptimizationFix: {
      title: '5-Minute Batch Assembly Swap',
      swap: 'Prep a 3-minute desk meal bowl from pantry staples instead of opening delivery apps.',
      immediateSavings: Math.round(foodDeliveryFee * 0.75 * 10) / 10,
      healthProductivityGain: '+35 min returned to deep work, avoids post-takeout insulin crash',
    },
    microRoiWealthShift: {
      savedToday: dailySaved,
      divertDestination:
        currency === 'INR'
          ? 'Nifty 50 Index Fund / Liquid SGB'
          : 'Low-Cost Vanguard S&P 500 ETF (VOO)',
      oneYearCompounded: oneYearComp,
      tenYearCompounded: tenYearCompAt12,
      actionDirective: `Instantly auto-transfer ${sym}${dailySaved} to your index investment app today.`,
    },
    quickWinTomorrow: {
      task: 'Set up your coffee beans and water tumbler on the counter tonight before sleep.',
      durationMinutes: 5,
      projectedImpact: `Eliminates the morning cafe detour, instantly saving ${sym}${latteSpend} and 18 minutes.`,
    },
    conciseSummaryMarkdown: `# LIFEROI™ 30-DAY BEHAVIORAL WEALTH BLUEPRINT
**Client Diagnostic ID:** LR-2026-X89 | **Methodology:** 12% Annuity Decay Model

## 1. EXECUTIVE DIAGNOSTIC SUMMARY
- **Behavioral Discipline Index:** 68/100
- **30-Day Compound Capital Leak:** ${sym}${Math.round(foodDeliveryFee * 30)}
- **Recoverable Cash Rate:** 72%

## 2. ROOT LEAK ERADICATION PLAYBOOK
- **Primary Friction Source:** Impulse Food Delivery Surcharges
- **The Psychology Behind It:** Cognitive fatigue at mid-day triggers convenience bias and dopamine seeking via delivery apps.
- **The Zero-Willpower Swap:** Assemble a 3-minute desk pantry bowl from pre-stocked dry grains and olive oil instead of opening delivery apps.

## 3. 10-YEAR CAPITAL WEALTH TARGET
- **Daily Capital Diverted:** ${sym}${dailySaved}/day
- **10-Year Projected Wealth (12% CAGR):** ${sym}${tenYearCompAt12.toLocaleString()}
- **Target Asset Allocation:** 70% Broad-Market Index ETF, 20% Liquid Overnight Reserves, 10% High-Yield Gold Bonds.

## 4. 7-DAY MOMENTUM PROTOCOL
- Day 1-2: Audit 100% active auto-debits; revoke 1 neglected service.
- Day 3-5: Deploy the physical workstation friction barrier.
- Day 6-7: Automate daily ${sym}${dailySaved} auto-sweep into index fund SIP.`,
  };
}
