import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type } from '@google/genai';
import { createServer as createViteServer } from 'vite';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json({ limit: '15mb' }));

// Initialise GoogleGenAI
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

const ANALYSIS_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    // 9 Exact Core Fields from Autonomous Intelligence Spec:
    score: {
      type: Type.INTEGER,
      description:
        'Dynamic Discipline Score (1-100). Deduct strictly for impulse consumptions (food delivery, unnecessary cabs, retail therapy) and missed physical/mental routines. Reward deep work hours, hydration, home cooking, and savings discipline.',
    },
    headline: {
      type: Type.STRING,
      description: 'Ultra-precise diagnosis, maximum 8 words.',
    },
    leakName: {
      type: Type.STRING,
      description: 'Top primary cash or time leak identified.',
    },
    leakMonthlyWaste: {
      type: Type.STRING,
      description: 'Exact 30-day recurring waste formatted with currency symbol, e.g. "$420/month" or "₹12,600/month".',
    },
    leakSolution: {
      type: Type.STRING,
      description: 'Behavioral Swap: exactly 1 realistic micro-alternative saving money or generating focus today.',
    },
    dailySaved: {
      type: Type.STRING,
      description: 'Exact cash amount saved today from swap, e.g. "$14.00" or "₹450".',
    },
    tenYearCompounded: {
      type: Type.STRING,
      description: 'Opportunity cost if daily savings is compounded at 12% annual return over 10 years, e.g. "$98,800" or "₹31,75,000".',
    },
    assetTarget: {
      type: Type.STRING,
      description: 'Target high-leverage vehicle to divert funds (e.g. S&P 500 Index Fund, Emergency Reserve, Skill/Tool).',
    },
    tomorrowQuickWin: {
      type: Type.STRING,
      description: 'Exactly 1 high-priority 5-minute task for tomorrow to build momentum.',
    },

    // Extended Visual Dashboard Fields:
    dailyScore: {
      type: Type.INTEGER,
      description: '1-100 score, identical to score.',
    },
    scoreBreakdown: {
      type: Type.OBJECT,
      properties: {
        habitScore: { type: Type.INTEGER, description: '1-100 score for habit discipline' },
        expenseEfficiency: { type: Type.INTEGER, description: '1-100 score for spending efficiency' },
        headline: { type: Type.STRING, description: '4-8 word hyper-concise daily diagnosis' },
      },
      required: ['habitScore', 'expenseEfficiency', 'headline'],
    },
    currencySymbol: { type: Type.STRING, description: 'Currency symbol like $, €, ₹, £' },
    currencyCode: { type: Type.STRING, description: 'Currency code like USD, EUR, INR, GBP' },
    leaksDetected: {
      type: Type.ARRAY,
      description: 'Top 1-2 leaks detected.',
      items: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          type: { type: Type.STRING, description: '"micro_spend" or "time_drain"' },
          dailyAmount: { type: Type.NUMBER },
          monthlyWaste: { type: Type.NUMBER },
          timeDrainMinutes: { type: Type.INTEGER },
          impactSummary: { type: Type.STRING },
        },
        required: ['title', 'type', 'dailyAmount', 'monthlyWaste', 'impactSummary'],
      },
    },
    totalDailyWaste: { type: Type.NUMBER },
    totalMonthlyWaste: { type: Type.NUMBER },
    immediateOptimizationFix: {
      type: Type.OBJECT,
      properties: {
        title: { type: Type.STRING },
        swap: { type: Type.STRING },
        immediateSavings: { type: Type.NUMBER },
        healthProductivityGain: { type: Type.STRING },
      },
      required: ['title', 'swap', 'immediateSavings', 'healthProductivityGain'],
    },
    microRoiWealthShift: {
      type: Type.OBJECT,
      properties: {
        savedToday: { type: Type.NUMBER },
        divertDestination: { type: Type.STRING },
        oneYearCompounded: { type: Type.NUMBER },
        tenYearCompounded: { type: Type.NUMBER, description: '10-year compounded value at 12% APY' },
        actionDirective: { type: Type.STRING },
      },
      required: ['savedToday', 'divertDestination', 'oneYearCompounded', 'tenYearCompounded', 'actionDirective'],
    },
    quickWinTomorrow: {
      type: Type.OBJECT,
      properties: {
        task: { type: Type.STRING },
        durationMinutes: { type: Type.INTEGER },
        projectedImpact: { type: Type.STRING },
      },
      required: ['task', 'durationMinutes', 'projectedImpact'],
    },
    conciseSummaryMarkdown: {
      type: Type.STRING,
    },
  },
  required: [
    'score',
    'headline',
    'leakName',
    'leakMonthlyWaste',
    'leakSolution',
    'dailySaved',
    'tenYearCompounded',
    'assetTarget',
    'tomorrowQuickWin',
    'dailyScore',
    'scoreBreakdown',
    'currencySymbol',
    'currencyCode',
    'leaksDetected',
    'totalDailyWaste',
    'totalMonthlyWaste',
    'immediateOptimizationFix',
    'microRoiWealthShift',
    'quickWinTomorrow',
    'conciseSummaryMarkdown',
  ],
};

app.post('/api/analyze', async (req, res) => {
  try {
    const { logText, currency = 'USD', imageBase64, imageMimeType } = req.body;

    if (!logText && !imageBase64) {
      return res.status(400).json({ error: 'Please provide either daily activity text or an image/receipt to analyze.' });
    }

    const currencyMap: Record<string, { symbol: string; code: string }> = {
      USD: { symbol: '$', code: 'USD' },
      EUR: { symbol: '€', code: 'EUR' },
      INR: { symbol: '₹', code: 'INR' },
      GBP: { symbol: '£', code: 'GBP' },
    };

    const targetCurrency = currencyMap[currency] || currencyMap.USD;

    const systemPrompt = `You are "LifeROI Autonomous Multi-Engine Intelligence" — an enterprise-grade behavioral finance, lifestyle telemetry, and capital compounding system.

CORE OPERATIONAL ARCHITECTURE:
When raw human daily text, routine logs, or expense figures are received, orchestrate the following:
1. Actuarial Math Engine:
   - 30-Day Waste = Base Spend * 22 days.
   - Daily Recoverable Cash = Exactly 72% of identified impulse spend.
   - 10-Year Opportunity Cost = Daily Recoverable Cash * 30 * 12 compounded at 12.0% annual yield (~17.5x annual multiplier).
2. Behavioral Substitution Engine:
   - Generate high-friction eradication micro-swaps requiring < 3 minutes of physical preparation.
3. Schema Enforcement Engine:
   - Strictly output pure valid JSON adhering to the 9-key contract with zero markdown wrappers, code fences, or preambles.

STRICT JSON OUTPUT CONTRACT:
{
  "score": <number 1-100 based on habit vs spend discipline>,
  "headline": "<max 8 punchy words diagnostic headline>",
  "leakName": "<precise name of primary micro-leak>",
  "leakMonthlyWaste": "<formatted 30-day recurring waste with currency>",
  "leakSolution": "<concrete 1-sentence behavioral substitute>",
  "dailySaved": "<formatted daily cash recovered with currency>",
  "tenYearCompounded": "<formatted 10-year value at 12% APY with currency>",
  "assetTarget": "<exact low-cost index ETF asset class>",
  "tomorrowQuickWin": "<one 5-minute micro-task for tomorrow morning>"
}

RULES:
- Currency Adaptation:
  - If user currency is "$" (USD): Base spend in USD ($10-$30 range), divert capital into "Low-Cost Vanguard S&P 500 ETF (VOO)".
  - If user currency is "₹" (INR): Base spend in INR (₹200-₹800 range), divert capital into "Nifty 50 Index Fund / Liquid SGB".
  - If user currency is "€" (EUR): Divert into "iShares Core MSCI World ETF".
- Deduct points for impulse food delivery and skipped physical habits. Reward deep work, hydration, and home cooking.
- Deterministic Actuarial Compounding:
  - 30-Day Monthly Leak = Daily Base Spend * 22 days.
  - Recoverable Daily Cash = 72% of impulse spend.
  - 10-Year Opportunity Cost = Daily Recoverable Cash * 30 * 12 compounded at 12.0% annual yield (~17.5x annual multiplier).
- Never output markdown fences or conversational preambles. Output pure JSON only.

Also populate supporting dashboard fields: dailyScore (= score), scoreBreakdown, currencySymbol = "${targetCurrency.symbol}", currencyCode = "${targetCurrency.code}", leaksDetected, totalDailyWaste, totalMonthlyWaste, immediateOptimizationFix, microRoiWealthShift, quickWinTomorrow.
CRITICAL FOR conciseSummaryMarkdown: Synthesize an executive-grade 4-section summary strictly in this format:
# LIFEROI™ 30-DAY BEHAVIORAL WEALTH BLUEPRINT
**Client Diagnostic ID:** LR-2026-X89 | **Methodology:** 12% Annuity Decay Model

## 1. EXECUTIVE DIAGNOSTIC SUMMARY
- **Behavioral Discipline Index:** [Score]/100
- **30-Day Compound Capital Leak:** [leakMonthlyWaste]
- **Recoverable Cash Rate:** 72%

## 2. ROOT LEAK ERADICATION PLAYBOOK
- **Primary Friction Source:** [leakName]
- **The Psychology Behind It:** [1-sentence breakdown of dopamine drift / convenience bias]
- **The Zero-Willpower Swap:** [Specific pantry/routine substitute taking < 3 mins]

## 3. 10-YEAR CAPITAL WEALTH TARGET
- **Daily Capital Diverted:** [dailySaved]
- **10-Year Projected Wealth (12% CAGR):** [tenYearCompounded]
- **Target Asset Allocation:** 70% Broad-Market Index ETF, 20% Liquid Overnight Reserves, 10% High-Yield Gold Bonds.

## 4. 7-DAY MOMENTUM PROTOCOL
- Day 1-2: Audit 100% active auto-debits; revoke 1 neglected service.
- Day 3-5: Deploy the physical workstation friction barrier.
- Day 6-7: Automate daily [dailySaved] auto-sweep into index fund SIP.`;

    const contents: any[] = [];

    if (imageBase64) {
      contents.push({
        inlineData: {
          mimeType: imageMimeType || 'image/jpeg',
          data: imageBase64.replace(/^data:image\/\w+;base64,/, ''),
        },
      });
    }

    const userPromptText = logText
      ? `User Daily Log & Expense Input:\n"""\n${logText}\n"""\nPreferred Currency: ${targetCurrency.code} (${targetCurrency.symbol})`
      : `Please analyze this uploaded receipt/schedule image for lifestyle habits, micro-expenses, and potential leaks. Preferred Currency: ${targetCurrency.code} (${targetCurrency.symbol})`;

    contents.push({ text: userPromptText });

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: contents,
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: 'application/json',
        responseSchema: ANALYSIS_SCHEMA,
        temperature: 0.2,
      },
    });

    const responseText = response.text;
    if (!responseText) {
      throw new Error('Empty response received from LifeROI AI engine.');
    }

    const parsedData = JSON.parse(responseText);

    const strictResult = {
      score: parsedData.score,
      headline: parsedData.headline,
      leakName: parsedData.leakName,
      leakMonthlyWaste: parsedData.leakMonthlyWaste,
      leakSolution: parsedData.leakSolution,
      dailySaved: parsedData.dailySaved,
      tenYearCompounded: parsedData.tenYearCompounded,
      assetTarget: parsedData.assetTarget,
      tomorrowQuickWin: parsedData.tomorrowQuickWin,
    };

    if (req.query.format === 'strict' || req.body.strictOnly) {
      return res.json(strictResult);
    }

    return res.json({
      ...parsedData,
      strictAudit: strictResult,
    });
  } catch (error: any) {
    console.error('Error analyzing log:', error);
    return res.status(500).json({
      error: error.message || 'Failed to analyze daily log with LifeROI AI.',
    });
  }
});

// Voice dictation transcription endpoint using Gemini audio processing
app.post('/api/transcribe', async (req, res) => {
  try {
    const { audioBase64, mimeType } = req.body;
    if (!audioBase64) {
      return res.status(400).json({ error: 'Missing audio recording payload' });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.json({
        transcript:
          'Morning: Iced vanilla latte and pastry $12.50. 3 hours focused deep work coding. Lunch: DoorDash burger combo $26.80 with delivery surcharge. Afternoon: 45 mins idle doomscrolling. Evening: 30 min outdoor walk, cooked dinner at home.',
      });
    }

    const cleanBase64 = audioBase64.replace(/^data:audio\/\w+;base64,/, '');

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [
        {
          inlineData: {
            mimeType: mimeType || 'audio/webm',
            data: cleanBase64,
          },
        },
        {
          text: 'You are an accurate audio transcription system for a daily routine and financial habit logger. Transcribe the spoken audio verbatim. Capture all expense amounts, merchant names, activities, deep work intervals, and habits. Output ONLY the clean transcribed text without markdown fences, quotes, or conversational preamble.',
        },
      ],
    });

    const transcript = response.text ? response.text.trim() : '';
    return res.json({ transcript });
  } catch (error: any) {
    console.error('Audio transcription error:', error);
    return res.status(500).json({
      error: error.message || 'Audio transcription failed.',
    });
  }
});

// Dedicated strict audit endpoint returning exclusively the 9-field schema
app.post('/api/audit', async (req, res) => {
  req.body.strictOnly = true;
  // Redirect to handler
  const analyzeHandler = app._router.stack.find((s: any) => s.route?.path === '/api/analyze')?.route?.stack?.[0]?.handle;
  if (analyzeHandler) {
    return analyzeHandler(req, res);
  }
  return res.status(500).json({ error: 'Audit handler unavailable' });
});

// Setup Vite middleware in dev or static files in production
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`LifeROI AI server running at http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Server startup error:', err);
  process.exit(1);
});
