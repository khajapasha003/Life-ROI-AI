/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  Sparkles,
  Zap,
  TrendingUp,
  History,
  FileText,
  Upload,
  Image as ImageIcon,
  RotateCcw,
  Check,
  ChevronDown,
  ArrowRight,
  Calculator,
  Loader2,
  AlertTriangle,
  Award,
  Download,
  Bell,
  Target,
} from 'lucide-react';
import { AnalysisResult, CurrencyCode, EmotionalSentimentModifier } from './types/roi';
import { SAMPLE_PRESETS } from './data/presets';
import { generateFallbackAnalysis } from './utils/mockAnalysis';
import { ScoreGauge } from './components/ScoreGauge';
import { LeaksCard } from './components/LeaksCard';
import { OptimizationSwapCard } from './components/OptimizationSwapCard';
import { WealthShiftCard } from './components/WealthShiftCard';
import { QuickWinCard } from './components/QuickWinCard';
import { AutonomousAuditCard } from './components/AutonomousAuditCard';
import { CompoundSimulatorModal } from './components/CompoundSimulatorModal';
import { StrictMarkdownModal } from './components/StrictMarkdownModal';
import { StrictJsonModal } from './components/StrictJsonModal';
import { HistoryDrawer } from './components/HistoryDrawer';
import { MilestonesBanner } from './components/MilestonesBanner';
import { MilestonesModal } from './components/MilestonesModal';
import { PerformanceTrendsView } from './components/PerformanceTrendsView';
import { VoiceLoggerButton } from './components/VoiceLoggerButton';
import { MicroHabitsTracker } from './components/MicroHabitsTracker';
import { DailyReflectionCard } from './components/DailyReflectionCard';
import { NotificationSettingsModal } from './components/NotificationSettingsModal';
import { QuickExpenseFab } from './components/QuickExpenseFab';
import { QuickAddExpenseModal } from './components/QuickAddExpenseModal';
import {
  getSavedNotificationSettings,
  scheduleEveningNotification,
  NotificationSettings,
} from './utils/notificationService';
import { calculateMilestones } from './utils/milestones';
import { exportBlueprintPdf } from './utils/exportPdf';

const CURRENCIES: { code: CurrencyCode; symbol: string; label: string }[] = [
  { code: 'USD', symbol: '$', label: 'USD ($)' },
  { code: 'EUR', symbol: '€', label: 'EUR (€)' },
  { code: 'INR', symbol: '₹', label: 'INR (₹)' },
  { code: 'GBP', symbol: '£', label: 'GBP (£)' },
];

export default function App() {
  const [selectedCurrency, setSelectedCurrency] = useState<CurrencyCode>('USD');
  const [logText, setLogText] = useState(SAMPLE_PRESETS[0].logText);
  const [selectedImage, setSelectedImage] = useState<{ base64: string; mimeType: string; name: string } | null>(null);
  const [activeTab, setActiveTab] = useState<'text' | 'image'>('text');

  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);

  const [isSimulatorOpen, setIsSimulatorOpen] = useState(false);
  const [isMarkdownOpen, setIsMarkdownOpen] = useState(false);
  const [isJsonOpen, setIsJsonOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isMilestonesOpen, setIsMilestonesOpen] = useState(false);
  const [isNotificationModalOpen, setIsNotificationModalOpen] = useState(false);
  const [isQuickExpenseOpen, setIsQuickExpenseOpen] = useState(false);
  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>(getSavedNotificationSettings);
  const [simulatedStreak, setSimulatedStreak] = useState<number | undefined>(undefined);
  const [copiedReport, setCopiedReport] = useState(false);
  const [copiedJson, setCopiedJson] = useState(false);
  const [outputViewMode, setOutputViewMode] = useState<'dashboard' | 'trends' | 'json' | 'markdown'>('dashboard');

  const [history, setHistory] = useState<AnalysisResult[]>(() => {
    try {
      const saved = localStorage.getItem('liferoi_history');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [habitBonus, setHabitBonus] = useState(0);
  const [dailyReflection, setDailyReflection] = useState('');
  const [wealthGoal, setWealthGoal] = useState<string>(() => {
    try {
      return localStorage.getItem('liferoi_wealth_goal') || 'Save $500 for emergency fund';
    } catch {
      return 'Save $500 for emergency fund';
    }
  });

  const handleWealthGoalChange = (val: string) => {
    setWealthGoal(val);
    try {
      localStorage.setItem('liferoi_wealth_goal', val);
    } catch (e) {
      console.warn(e);
    }
  };

  const [sentimentModifier, setSentimentModifier] = useState<EmotionalSentimentModifier>({
    type: 'balanced',
    modifier: 0,
    label: 'Neutral Baseline',
    badgeColor: 'text-zinc-400 bg-zinc-800/60 border-zinc-700',
    insight: 'Log your emotional state to calibrate cognitive fatigue against your Discipline Score.',
    detectedKeywords: [],
  });

  const effectiveAnalysis = useMemo(() => {
    if (!analysis) return null;
    const totalAdjustment = habitBonus + sentimentModifier.modifier;
    const adjusted = Math.min(100, Math.max(1, analysis.score + totalAdjustment));
    return {
      ...analysis,
      score: adjusted,
      dailyScore: adjusted,
      scoreBreakdown: {
        ...analysis.scoreBreakdown,
        habitScore: Math.min(100, Math.max(1, analysis.scoreBreakdown.habitScore + totalAdjustment)),
      },
    };
  }, [analysis, habitBonus, sentimentModifier]);

  const { streakState, badges } = calculateMilestones(history, effectiveAnalysis || analysis, simulatedStreak);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync initial sample analysis on first load if none exists
  useEffect(() => {
    if (!analysis) {
      const initial = generateFallbackAnalysis(SAMPLE_PRESETS[0].logText, 'USD', wealthGoal);
      setAnalysis(initial);
    }
  }, []);

  // Ensure evening reminder is active if enabled
  useEffect(() => {
    const s = getSavedNotificationSettings();
    if (s.enabled) {
      scheduleEveningNotification(s.hour, s.minute).catch(() => {});
    }
  }, []);

  const handleSelectPreset = (presetId: string) => {
    const found = SAMPLE_PRESETS.find((p) => p.id === presetId);
    if (found) {
      setLogText(found.logText);
      setSelectedCurrency(found.currency);
      setActiveTab('text');
      setSelectedImage(null);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setErrorMsg('Please upload a valid image file (PNG, JPG, WebP).');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result as string;
      setSelectedImage({
        base64,
        mimeType: file.type,
        name: file.name,
      });
      setActiveTab('image');
      setErrorMsg(null);
    };
    reader.readAsDataURL(file);
  };

  const runAnalysis = async (overrideText?: string | React.MouseEvent) => {
    const textToAnalyze = typeof overrideText === 'string' ? overrideText : logText;
    if (!textToAnalyze.trim() && !selectedImage) {
      setErrorMsg('Please enter your daily habits & expenses, or upload a receipt.');
      return;
    }

    setIsLoading(true);
    setErrorMsg(null);

    try {
      const payload: any = {
        currency: selectedCurrency,
        wealthGoal: wealthGoal.trim(),
      };

      let combinedLog = textToAnalyze.trim();
      if (dailyReflection.trim()) {
        combinedLog = combinedLog
          ? `${combinedLog}\n\n[Daily Reflection - Emotional Sentiment]: ${dailyReflection.trim()}`
          : `[Daily Reflection - Emotional Sentiment]: ${dailyReflection.trim()}`;
      }

      if (combinedLog) {
        payload.logText = combinedLog;
      }

      if (selectedImage) {
        payload.imageBase64 = selectedImage.base64;
        payload.imageMimeType = selectedImage.mimeType;
      }

      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        throw new Error(errJson.error || `HTTP error ${res.status}`);
      }

      const data: AnalysisResult = await res.json();
      const enrichedResult: AnalysisResult = {
        ...data,
        wealthGoal: wealthGoal.trim(),
        id: `analysis-${Date.now()}`,
        timestamp: new Date().toISOString(),
      };

      setAnalysis(enrichedResult);

      // Save to history
      const updatedHistory = [enrichedResult, ...history.slice(0, 19)];
      setHistory(updatedHistory);
      try {
        localStorage.setItem('liferoi_history', JSON.stringify(updatedHistory));
      } catch (err) {
        console.error('Failed to save to localStorage', err);
      }
    } catch (err: any) {
      console.warn('API call failed, falling back to instant local evaluation engine:', err.message);
      // Fallback
      const fallbackResult = generateFallbackAnalysis(textToAnalyze, selectedCurrency, wealthGoal);
      setAnalysis(fallbackResult);
      setErrorMsg('Using local optimization engine (API connection offline or pending).');
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickExpenseAdded = (formattedLine: string, triggerAuditNow: boolean) => {
    const newText = logText.trim() ? `${logText.trim()}\n${formattedLine}` : formattedLine;
    setLogText(newText);
    if (triggerAuditNow) {
      runAnalysis(newText);
    }
  };

  const handleCopyMarkdown = async () => {
    if (!analysis) return;
    try {
      await navigator.clipboard.writeText(analysis.conciseSummaryMarkdown);
      setCopiedReport(true);
      setTimeout(() => setCopiedReport(false), 2000);
    } catch (err) {
      console.error(err);
    }
  };

  const handleClearHistory = () => {
    setHistory([]);
    try {
      localStorage.removeItem('liferoi_history');
    } catch (err) {
      console.error(err);
    }
  };

  // Keyboard shortcut: Cmd/Ctrl + Enter
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
      e.preventDefault();
      runAnalysis();
    }
  };

  const activeCurrencySymbol =
    CURRENCIES.find((c) => c.code === selectedCurrency)?.symbol || '$';

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col font-sans">
      {/* 1. TOP BAR CONTRACT */}
      <header className="h-14 border-b border-zinc-800/80 px-4 sm:px-6 flex items-center justify-between bg-zinc-950/90 backdrop-blur-md sticky top-0 z-30">
        {/* Zone 1: Single text element wordmark */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 ring-4 ring-emerald-500/20 animate-pulse" />
            <span className="text-base font-bold tracking-tight text-white flex items-center gap-1.5">
              LifeROI <span className="text-xs px-1.5 py-0.5 rounded bg-zinc-800 text-emerald-400 font-mono">AI</span>
            </span>
          </div>
          <span className="hidden md:inline-block text-xs text-zinc-400">
            Daily Habit &amp; Micro-Expense Optimizer
          </span>
        </div>

        {/* Zone 2: Navigation controls / view actions */}
        <nav className="hidden lg:flex items-center gap-5 text-xs font-medium text-zinc-400">
          <button
            onClick={() => setIsJsonOpen(true)}
            className="hover:text-emerald-400 transition-colors flex items-center gap-1.5 cursor-pointer font-mono"
            title="Inspect 9-field strict JSON output"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>Strict JSON</span>
          </button>
          <button
            onClick={() => setIsSimulatorOpen(true)}
            className="hover:text-zinc-100 transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Calculator className="w-3.5 h-3.5 text-indigo-400" />
            <span>Wealth Simulator</span>
          </button>
          <button
            onClick={() => setIsMarkdownOpen(true)}
            className="hover:text-zinc-100 transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <FileText className="w-3.5 h-3.5 text-zinc-400" />
            <span>Strict Markdown</span>
          </button>
          <button
            onClick={() => setOutputViewMode('trends')}
            className={`transition-colors flex items-center gap-1.5 cursor-pointer ${
              outputViewMode === 'trends' ? 'text-emerald-400 font-semibold' : 'hover:text-zinc-100 text-zinc-400'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
            <span>Trends</span>
          </button>
          <button
            onClick={() => setIsHistoryOpen(true)}
            className="hover:text-zinc-100 transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <History className="w-3.5 h-3.5 text-zinc-400" />
            <span>History ({history.length})</span>
          </button>
          <button
            onClick={() => setIsMilestonesOpen(true)}
            className={`px-2 py-1 rounded-lg border transition-colors flex items-center gap-1.5 cursor-pointer ${
              streakState.isUnlocked
                ? 'bg-amber-500/15 border-amber-500/30 text-amber-300 hover:bg-amber-500/25'
                : 'border-transparent hover:text-zinc-100 text-zinc-400 hover:bg-zinc-850'
            }`}
          >
            <Award className={`w-3.5 h-3.5 ${streakState.isUnlocked ? 'text-amber-400' : 'text-zinc-400'}`} />
            <span>Milestones</span>
            {streakState.isUnlocked ? (
              <span className="font-bold text-[10px] px-1.5 py-0.2 rounded bg-amber-400/20 text-amber-300">
                Badges Active
              </span>
            ) : (
              <span className="font-mono text-[10px] text-zinc-500">
                [{streakState.currentHighScoreStreak}/3d]
              </span>
            )}
          </button>
          <button
            onClick={() => setIsNotificationModalOpen(true)}
            className={`px-2 py-1 rounded-lg border transition-colors flex items-center gap-1.5 cursor-pointer ${
              notificationSettings.enabled
                ? 'bg-amber-500/10 border-amber-500/30 text-amber-300 hover:bg-amber-500/20'
                : 'border-transparent text-zinc-400 hover:text-zinc-100 hover:bg-zinc-850'
            }`}
            title="Evening Habit & Expense Reminder"
            aria-label="Evening Habit & Expense Reminder"
          >
            <Bell className="w-3.5 h-3.5 text-amber-400" />
            <span>Evening Reminder</span>
            {notificationSettings.enabled && (
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            )}
          </button>
        </nav>

        {/* Zone 3: 1-2 primary actions & Currency selector */}
        <div className="flex items-center gap-2.5">
          {/* Currency dropdown */}
          <div className="relative">
            <select
              value={selectedCurrency}
              onChange={(e) => setSelectedCurrency(e.target.value as CurrencyCode)}
              aria-label="Select currency"
              className="appearance-none bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-xs font-mono font-medium text-zinc-200 py-1.5 pl-2.5 pr-7 rounded-lg transition-colors cursor-pointer focus:outline-none focus:ring-1 focus:ring-emerald-500"
            >
              {CURRENCIES.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.code} ({c.symbol})
                </option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-zinc-400 absolute right-2 top-2.5 pointer-events-none" />
          </div>

          <button
            onClick={() => setIsNotificationModalOpen(true)}
            className="md:hidden p-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white"
            title="Evening Reminder"
            aria-label="Evening Reminder"
          >
            <Bell className="w-4 h-4 text-amber-400" />
          </button>

          <button
            onClick={() => setIsHistoryOpen(true)}
            className="lg:hidden p-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white"
            title="History"
            aria-label="View history"
          >
            <History className="w-4 h-4" />
          </button>

          <button
            onClick={runAnalysis}
            disabled={isLoading}
            className="px-3.5 py-1.5 text-xs font-semibold text-zinc-950 bg-emerald-400 hover:bg-emerald-300 disabled:opacity-50 rounded-lg transition-all shadow-sm flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Optimizing...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5" />
                <span>Optimize Day</span>
              </>
            )}
          </button>
        </div>
      </header>

      {/* 2. MAIN DASHBOARD VIEWPORT (Single-screen responsive container) */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT COLUMN: Input Deck (5 cols) */}
        <section className="lg:col-span-5 flex flex-col space-y-4">
          <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 space-y-4 shadow-sm">
            {/* Input Header & Mode Switcher */}
            <div className="flex items-center justify-between border-b border-zinc-800/80 pb-3">
              <div>
                <h1 className="text-xs uppercase tracking-wider font-bold text-zinc-200">
                  Daily Log &amp; Routine Input
                </h1>
                <p className="text-[11px] text-zinc-400 mt-0.5">
                  Paste habits, expenses, timestamps, or receipts
                </p>
              </div>

              {/* Mode switch */}
              <div className="flex items-center gap-1 bg-zinc-950 p-0.5 rounded-lg border border-zinc-800/80">
                <button
                  onClick={() => setActiveTab('text')}
                  className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
                    activeTab === 'text'
                      ? 'bg-zinc-800 text-white shadow-xs'
                      : 'text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  Text / Routine
                </button>
                <button
                  onClick={() => setActiveTab('image')}
                  className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors flex items-center gap-1 ${
                    activeTab === 'image'
                      ? 'bg-zinc-800 text-white shadow-xs'
                      : 'text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  <Upload className="w-3 h-3" />
                  <span>Receipt</span>
                </button>
              </div>
            </div>

            {/* Presets Bar */}
            <div className="space-y-1.5">
              <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider block">
                Quick Scenario Presets
              </span>
              <div className="flex flex-wrap gap-1.5">
                {SAMPLE_PRESETS.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => handleSelectPreset(p.id)}
                    className="px-2.5 py-1 rounded-md bg-zinc-950 border border-zinc-800/80 hover:border-zinc-700 text-zinc-300 text-[11px] transition-colors cursor-pointer text-left whitespace-nowrap"
                  >
                    {p.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Input Form Content */}
            {activeTab === 'text' ? (
              <div className="space-y-2">
                <div className="flex items-center justify-between pb-1">
                  <span className="text-[11px] text-zinc-400 font-medium">Daily Routine &amp; Expense Log</span>
                  <VoiceLoggerButton
                    onTranscribe={(transcript) => {
                      setLogText((prev) => (prev ? `${prev}\n\n${transcript}` : transcript));
                    }}
                    disabled={isLoading}
                  />
                </div>
                <div className="relative">
                  <textarea
                    value={logText}
                    onChange={(e) => setLogText(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Enter your day (e.g., 2 lattes $13, DoorDash dinner $28, doomscrolled 1.5h, 4h coding, skipped gym)..."
                    rows={12}
                    className="w-full bg-zinc-950 border border-zinc-800/80 rounded-xl p-3 text-xs text-zinc-200 placeholder-zinc-400 focus:outline-none focus:ring-1 focus:ring-emerald-500 font-mono resize-none leading-relaxed"
                  />
                  <div className="absolute right-3 bottom-3 text-[10px] text-zinc-400 pointer-events-none">
                    Cmd+Enter to optimize
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageUpload}
                  accept="image/*"
                  className="hidden"
                />

                {selectedImage ? (
                  <div className="relative p-3 rounded-xl bg-zinc-950 border border-zinc-800 space-y-2">
                    <div className="flex items-center justify-between text-xs text-zinc-300">
                      <span className="truncate max-w-[200px] font-mono">{selectedImage.name}</span>
                      <button
                        onClick={() => setSelectedImage(null)}
                        className="text-rose-400 hover:text-rose-300 text-xs cursor-pointer"
                      >
                        Remove
                      </button>
                    </div>
                    <div className="max-h-48 rounded-lg overflow-hidden bg-zinc-900 border border-zinc-800 flex items-center justify-center">
                      <img
                        src={selectedImage.base64}
                        alt="Receipt upload preview"
                        className="max-h-48 object-contain"
                      />
                    </div>
                  </div>
                ) : (
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-zinc-800 hover:border-zinc-700 rounded-xl p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-colors bg-zinc-950/40"
                  >
                    <div className="p-3 rounded-full bg-zinc-900 text-zinc-400 mb-2">
                      <ImageIcon className="w-6 h-6" />
                    </div>
                    <span className="text-xs font-semibold text-zinc-200">
                      Upload Receipt or Day Schedule
                    </span>
                    <span className="text-[11px] text-zinc-400 mt-1">
                      PNG, JPG, or WebP. Multimodal Gemini extracts line items &amp; timestamps.
                    </span>
                  </div>
                )}

                {/* Optional additional notes alongside image */}
                <div>
                  <label className="text-[11px] font-semibold text-zinc-400 block mb-1">
                    Additional Context / Day Notes (Optional)
                  </label>
                  <textarea
                    value={logText}
                    onChange={(e) => setLogText(e.target.value)}
                    placeholder="e.g., Felt groggy after 3pm, skipped gym, spent 40 mins doomscrolling..."
                    rows={4}
                    className="w-full bg-zinc-950 border border-zinc-800/80 rounded-xl p-2.5 text-xs text-zinc-200 placeholder-zinc-400 focus:outline-none focus:ring-1 focus:ring-emerald-500 font-mono resize-none"
                  />
                </div>
              </div>
            )}

            {/* Daily Wealth Goal Input Area */}
            <div className="p-3.5 rounded-xl bg-zinc-950/80 border border-zinc-800/80 space-y-2.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-zinc-200 flex items-center gap-1.5">
                  <Target className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Daily Wealth Goal / Target</span>
                </label>
                <span className="text-[10px] text-zinc-500 font-mono">
                  Calibrates Audit Summary
                </span>
              </div>

              <div className="relative">
                <input
                  type="text"
                  value={wealthGoal}
                  onChange={(e) => handleWealthGoalChange(e.target.value)}
                  placeholder={
                    selectedCurrency === 'INR'
                      ? 'e.g., Save ₹25,000 for emergency fund, accumulate ₹50k in Nifty 50'
                      : 'e.g., Save $500 for emergency fund, accumulate $1,000 in VOO index ETF'
                  }
                  className="w-full pl-3 pr-8 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-emerald-500 transition-colors font-sans"
                />
                {wealthGoal && (
                  <button
                    type="button"
                    onClick={() => handleWealthGoalChange('')}
                    className="absolute right-2.5 top-2.5 text-zinc-500 hover:text-zinc-300 text-xs cursor-pointer"
                    title="Clear goal"
                  >
                    ×
                  </button>
                )}
              </div>

              {/* Goal Presets */}
              <div className="flex flex-wrap gap-1.5">
                {[
                  selectedCurrency === 'INR' ? 'Save ₹25,000 emergency fund' : 'Save $500 for emergency fund',
                  selectedCurrency === 'INR' ? 'Accumulate ₹50,000 in Nifty 50' : 'Accumulate $1,000 in VOO ETF',
                  selectedCurrency === 'INR' ? 'Eradicate ₹30,000 debt balance' : 'Pay off $800 credit balance',
                  selectedCurrency === 'INR' ? 'Save ₹15,000 travel fund' : 'Save $350 for travel sinking fund',
                ].map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => handleWealthGoalChange(preset)}
                    className={`px-2 py-0.5 rounded-md text-[10px] border transition-colors cursor-pointer ${
                      wealthGoal === preset
                        ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300 font-medium'
                        : 'bg-zinc-900/60 border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:border-zinc-700'
                    }`}
                  >
                    {preset}
                  </button>
                ))}
              </div>
            </div>

            {/* Daily Emotional Reflection */}
            <DailyReflectionCard
              onSentimentChange={(modifier, text) => {
                setSentimentModifier(modifier);
                setDailyReflection(text);
              }}
              onAppendToDailyLog={(txt) => {
                setLogText((prev) => (prev ? `${prev}\n\n${txt}` : txt));
              }}
            />

            {/* Error Notification */}
            {errorMsg && (
              <div className="p-2.5 rounded-lg bg-amber-950/30 border border-amber-800/40 text-xs text-amber-200 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Primary Action Button */}
            <div className="flex items-center gap-2 pt-1">
              <button
                onClick={runAnalysis}
                disabled={isLoading}
                className="flex-1 py-2.5 px-4 rounded-xl font-semibold text-xs text-zinc-950 bg-emerald-400 hover:bg-emerald-300 disabled:opacity-50 transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Analyzing Habits &amp; Expense Leaks...</span>
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4 fill-zinc-950" />
                    <span>Run Optimization Engine</span>
                  </>
                )}
              </button>

              <button
                onClick={() => {
                  setLogText('');
                  setSelectedImage(null);
                }}
                className="p-2.5 rounded-xl border border-zinc-800 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 transition-colors"
                title="Clear input"
                aria-label="Clear input"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Quick Stats or Engine Guidelines note */}
          <div className="p-3.5 rounded-xl bg-zinc-900/30 border border-zinc-800/60 text-[11px] text-zinc-400 space-y-1">
            <div className="flex items-center justify-between text-zinc-300 font-semibold">
              <span>LifeROI Engine Protocol</span>
              <span className="text-emerald-400 font-mono">Real-Time Math</span>
            </div>
            <p>
              Calculates direct daily burn, compounds stopped waste at 8% APY into long-term capital, and suggests 1 high-leverage lifestyle swap.
            </p>
          </div>
        </section>

        {/* RIGHT COLUMN: Optimization Engine Canvas (7 cols) */}
        <section className="lg:col-span-7 flex flex-col space-y-4">
          {analysis ? (
            <div className="space-y-4">
              {/* Output Mode Segmented Control */}
              <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  <span className="text-xs uppercase tracking-wider font-bold text-zinc-300">
                    Audit Stream
                  </span>
                </div>

                <div className="flex items-center gap-1 p-0.5 bg-zinc-900 border border-zinc-800 rounded-lg">
                  <button
                    onClick={() => setOutputViewMode('dashboard')}
                    className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                      outputViewMode === 'dashboard'
                        ? 'bg-zinc-800 text-white shadow-xs'
                        : 'text-zinc-400 hover:text-zinc-200'
                    }`}
                  >
                    Dashboard
                  </button>
                  <button
                    onClick={() => setOutputViewMode('trends')}
                    className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors flex items-center gap-1.5 cursor-pointer ${
                      outputViewMode === 'trends'
                        ? 'bg-zinc-800 text-emerald-400 shadow-xs font-semibold'
                        : 'text-zinc-400 hover:text-zinc-200'
                    }`}
                  >
                    <TrendingUp className="w-3.5 h-3.5" />
                    <span>Performance Trends</span>
                  </button>
                  <button
                    onClick={() => setOutputViewMode('json')}
                    className={`px-2.5 py-1 text-xs font-medium rounded-md font-mono transition-colors flex items-center gap-1 cursor-pointer ${
                      outputViewMode === 'json'
                        ? 'bg-zinc-800 text-emerald-400 shadow-xs'
                        : 'text-zinc-400 hover:text-zinc-200'
                    }`}
                  >
                    <span>Strict JSON (9-Field)</span>
                  </button>
                  <button
                    onClick={() => setOutputViewMode('markdown')}
                    className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                      outputViewMode === 'markdown'
                        ? 'bg-zinc-800 text-white shadow-xs'
                        : 'text-zinc-400 hover:text-zinc-200'
                    }`}
                  >
                    Markdown
                  </button>
                </div>
              </div>

              {outputViewMode === 'trends' ? (
                /* PERFORMANCE TRENDS VIEW WITH RECHARTS SPARKLINE */
                <PerformanceTrendsView
                  history={history}
                  currentAnalysis={effectiveAnalysis || analysis}
                  onSelectAudit={(entry) => setAnalysis(entry)}
                />
              ) : outputViewMode === 'json' ? (
                /* INLINE STRICT JSON TERMINAL */
                <div className="p-4 rounded-2xl bg-zinc-900/90 border border-emerald-500/30 space-y-3 shadow-xl">
                  <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-emerald-400">
                        OUTPUT_SCHEMA: JSON_ONLY
                      </span>
                      <span className="text-[10px] text-zinc-400 font-mono">
                        9 verified keys · 12% 10-Yr Compounding
                      </span>
                    </div>

                    <button
                      onClick={async () => {
                        const jsonStr = JSON.stringify(
                          {
                            score: analysis.score,
                            headline: analysis.headline,
                            leakName: analysis.leakName,
                            leakMonthlyWaste: analysis.leakMonthlyWaste,
                            leakSolution: analysis.leakSolution,
                            dailySaved: analysis.dailySaved,
                            tenYearCompounded: analysis.tenYearCompounded,
                            assetTarget: analysis.assetTarget,
                            tomorrowQuickWin: analysis.tomorrowQuickWin,
                          },
                          null,
                          2
                        );
                        await navigator.clipboard.writeText(jsonStr);
                        setCopiedJson(true);
                        setTimeout(() => setCopiedJson(false), 2000);
                      }}
                      className="px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      {copiedJson ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>Copied JSON</span>
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>Copy 9-Field JSON</span>
                        </>
                      )}
                    </button>
                  </div>

                  <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 font-mono text-xs text-emerald-300 whitespace-pre-wrap leading-relaxed select-all overflow-x-auto">
                    {JSON.stringify(
                      {
                        score: analysis.score,
                        headline: analysis.headline,
                        leakName: analysis.leakName,
                        leakMonthlyWaste: analysis.leakMonthlyWaste,
                        leakSolution: analysis.leakSolution,
                        dailySaved: analysis.dailySaved,
                        tenYearCompounded: analysis.tenYearCompounded,
                        assetTarget: analysis.assetTarget,
                        tomorrowQuickWin: analysis.tomorrowQuickWin,
                      },
                      null,
                      2
                    )}
                  </div>
                </div>
              ) : outputViewMode === 'markdown' ? (
                /* INLINE MARKDOWN REPORT */
                <div className="p-4 rounded-2xl bg-zinc-900/90 border border-zinc-800 space-y-3 shadow-xl">
                  <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
                    <span className="text-xs font-bold text-zinc-200">
                      Markdown Audit Report (&lt; 200 Words)
                    </span>
                    <button
                      onClick={handleCopyMarkdown}
                      className="px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      {copiedReport ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>Copied!</span>
                        </>
                      ) : (
                        <>
                          <TrendingUp className="w-3.5 h-3.5" />
                          <span>Copy Markdown</span>
                        </>
                      )}
                    </button>
                  </div>

                  <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 font-mono text-xs text-zinc-200 whitespace-pre-wrap leading-relaxed select-all">
                    {analysis.conciseSummaryMarkdown}
                  </div>
                </div>
              ) : (
                /* FULL DASHBOARD VIEW */
                <>
                  {/* 1. Autonomous Intelligence Audit Card (Strict Spec & Telemetry) */}
                  <AutonomousAuditCard
                    analysis={effectiveAnalysis || analysis}
                    onOpenJson={() => setIsJsonOpen(true)}
                  />

                  {/* 2. Daily Micro-Habit Tracker (Pre-defined micro-habits adjusting Discipline Score) */}
                  <MicroHabitsTracker
                    baseScore={analysis.score}
                    onAdjustedScoreChange={(_adjScore, bonus) => setHabitBonus(bonus)}
                    onAppendToLog={(habitsText) => {
                      setLogText((prev) => (prev ? `${prev}\n\n${habitsText}` : habitsText));
                    }}
                  />

                  {/* 3. LifeROI Milestones & Streak System */}
                  <MilestonesBanner
                    streakState={streakState}
                    badges={badges}
                    onOpenDetailsModal={() => setIsMilestonesOpen(true)}
                    onSimulateStreakToggle={() => setSimulatedStreak((prev) => (prev === 3 ? undefined : 3))}
                    isSimulatedStreak={simulatedStreak === 3}
                  />

                  {/* 4. Daily Score Gauge Strip (Reflects live micro-habit & emotional sentiment modifiers) */}
                  <ScoreGauge
                    score={effectiveAnalysis?.dailyScore ?? analysis.dailyScore}
                    breakdown={effectiveAnalysis?.scoreBreakdown ?? analysis.scoreBreakdown}
                    sentimentModifier={sentimentModifier}
                    habitBonus={habitBonus}
                  />

                  {/* Bento Grid: 4 Core Pillars */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* 2. Leaks Detected */}
                    <LeaksCard
                      leaks={analysis.leaksDetected}
                      currencySymbol={analysis.currencySymbol}
                      totalMonthlyWaste={analysis.totalMonthlyWaste}
                    />

                    {/* 3. Immediate Optimization Fix */}
                    <OptimizationSwapCard
                      fix={analysis.immediateOptimizationFix}
                      currencySymbol={analysis.currencySymbol}
                    />

                    {/* 4. Micro-ROI / Wealth Shift */}
                    <WealthShiftCard
                      wealth={analysis.microRoiWealthShift}
                      currencySymbol={analysis.currencySymbol}
                      wealthGoal={analysis.wealthGoal || wealthGoal}
                      wealthGoalRunway={analysis.wealthGoalRunway}
                      onOpenSimulator={() => setIsSimulatorOpen(true)}
                    />

                    {/* 5. Quick Win Task for Tomorrow */}
                    <QuickWinCard quickWin={analysis.quickWinTomorrow} />
                  </div>
                </>
              )}

              {/* Action Ribbon & Markdown Access */}
              <div className="p-3 rounded-xl bg-zinc-900/50 border border-zinc-800 flex flex-wrap items-center justify-between gap-2.5">
                <div className="flex items-center gap-2 text-xs text-zinc-400">
                  <span className="font-semibold text-zinc-200">Strict Output:</span>
                  <span>Autonomous Schema &amp; Markdown Report</span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setOutputViewMode('json');
                    }}
                    className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-xs font-mono font-medium text-emerald-400 flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <span>View Strict JSON</span>
                  </button>

                  <button
                    onClick={() => setIsMarkdownOpen(true)}
                    className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-xs font-medium text-zinc-200 flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>View Blueprint</span>
                  </button>

                  <button
                    onClick={() => {
                      const target = effectiveAnalysis || analysis;
                      if (target) {
                        exportBlueprintPdf(target);
                      }
                    }}
                    className="px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-semibold text-xs flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm hover:shadow-emerald-500/20"
                    title="Export LifeROI 30-Day Behavioral Wealth Blueprint as downloadable PDF"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download PDF Blueprint</span>
                  </button>

                  <button
                    onClick={handleCopyMarkdown}
                    className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-xs font-medium text-zinc-300 flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    {copiedReport ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Copied!</span>
                      </>
                    ) : (
                      <>
                        <TrendingUp className="w-3.5 h-3.5" />
                        <span>Copy Report</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* Empty State */
            <div className="p-12 rounded-2xl bg-zinc-900/40 border border-zinc-800/80 text-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center mx-auto">
                <Sparkles className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-zinc-100">Ready to Optimize Your Day</h3>
                <p className="text-xs text-zinc-400 max-w-md mx-auto mt-1">
                  Enter your daily routine and expenses on the left, or pick one of the sample scenario presets to see instant ROI analytics.
                </p>
              </div>
              <button
                onClick={runAnalysis}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-zinc-950 bg-emerald-400 hover:bg-emerald-300 transition-colors inline-flex items-center gap-1.5 cursor-pointer"
              >
                <span>Run Demo Analysis</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </section>
      </main>

      {/* MODALS & DRAWERS */}
      <CompoundSimulatorModal
        isOpen={isSimulatorOpen}
        onClose={() => setIsSimulatorOpen(false)}
        currencySymbol={analysis?.currencySymbol || activeCurrencySymbol}
        currencyCode={analysis?.currencyCode || selectedCurrency}
        initialDailySavings={analysis?.microRoiWealthShift?.savedToday || 10}
      />

      <StrictMarkdownModal
        isOpen={isMarkdownOpen}
        onClose={() => setIsMarkdownOpen(false)}
        markdownContent={analysis?.conciseSummaryMarkdown || ''}
        analysis={effectiveAnalysis || analysis}
      />

      {analysis && (
        <StrictJsonModal
          isOpen={isJsonOpen}
          onClose={() => setIsJsonOpen(false)}
          analysis={analysis}
        />
      )}

      <HistoryDrawer
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        history={history}
        onSelectEntry={(entry) => setAnalysis(entry)}
        onClearHistory={handleClearHistory}
      />

      <MilestonesModal
        isOpen={isMilestonesOpen}
        onClose={() => setIsMilestonesOpen(false)}
        streakState={streakState}
        badges={badges}
        onSimulateStreakToggle={() => setSimulatedStreak((prev) => (prev === 3 ? undefined : 3))}
        isSimulatedStreak={simulatedStreak === 3}
      />

      <NotificationSettingsModal
        isOpen={isNotificationModalOpen}
        onClose={() => setIsNotificationModalOpen(false)}
        onSettingsSaved={(newSettings) => setNotificationSettings(newSettings)}
      />

      {/* Floating Action Button (Bottom-Right Corner) for Rapid Expense Logging */}
      <QuickExpenseFab
        onClick={() => setIsQuickExpenseOpen(true)}
        currencySymbol={activeCurrencySymbol}
      />

      {/* Quick Add Expense Modal */}
      <QuickAddExpenseModal
        isOpen={isQuickExpenseOpen}
        onClose={() => setIsQuickExpenseOpen(false)}
        currencySymbol={activeCurrencySymbol}
        currencyCode={selectedCurrency}
        onExpenseAdded={handleQuickExpenseAdded}
      />
    </div>
  );
}
