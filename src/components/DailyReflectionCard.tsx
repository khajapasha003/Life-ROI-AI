import React, { useState, useEffect, useMemo } from 'react';
import {
  HeartHandshake,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  Smile,
  Frown,
  Meh,
  Zap,
  RotateCcw,
} from 'lucide-react';
import { EmotionalSentimentModifier } from '../types/roi';
import { analyzeEmotionalSentiment } from '../utils/sentimentAnalysis';

interface DailyReflectionCardProps {
  onSentimentChange: (modifier: EmotionalSentimentModifier, text: string) => void;
  onAppendToDailyLog?: (reflectionText: string) => void;
}

const STORAGE_KEY = 'liferoi_daily_reflection';

const PRESET_REFLECTIONS = [
  {
    label: 'Calm & Grounded',
    text: 'Felt calm, clear-headed, and energized. Kept my focus throughout deep work.',
    icon: '🧘',
  },
  {
    label: 'Energized & Motivated',
    text: 'High energy and motivated all morning. Zero craving for impulse snacks or phone scrolling.',
    icon: '⚡',
  },
  {
    label: 'Stressed & Overwhelmed',
    text: 'Stressed by afternoon deadlines, feeling exhausted and tempted to order comfort food.',
    icon: '🌪️',
  },
  {
    label: 'Fatigued / Low Sleep',
    text: 'Tired and drained from late night. Brain fog made it hard to resist convenience deliveries.',
    icon: '😴',
  },
  {
    label: 'Steady Equilibrium',
    text: 'Normal, steady day. Followed routine without major emotional spikes or friction.',
    icon: '⚖️',
  },
];

export const DailyReflectionCard: React.FC<DailyReflectionCardProps> = ({
  onSentimentChange,
  onAppendToDailyLog,
}) => {
  const [reflectionText, setReflectionText] = useState<string>(() => {
    try {
      return (
        localStorage.getItem(STORAGE_KEY) ||
        'Felt calm, grounded, and focused throughout morning deep work with zero impulse friction.'
      );
    } catch {
      return 'Felt calm, grounded, and focused throughout morning deep work with zero impulse friction.';
    }
  });

  const sentiment = useMemo(
    () => analyzeEmotionalSentiment(reflectionText),
    [reflectionText]
  );

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, reflectionText);
    } catch (e) {
      console.warn('Failed to save reflection to localStorage', e);
    }
    onSentimentChange(sentiment, reflectionText);
  }, [reflectionText, sentiment]);

  const handleApplyPreset = (presetText: string) => {
    setReflectionText(presetText);
  };

  const handleClear = () => {
    setReflectionText('');
  };

  return (
    <div className="rounded-2xl bg-zinc-900/90 border border-zinc-800 p-4 shadow-xl space-y-3.5">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-zinc-800/80 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
            <HeartHandshake className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xs font-bold text-zinc-100 uppercase tracking-wide">
                Daily Emotional Reflection
              </h3>
              <span
                className={`text-[10px] font-mono px-2 py-0.5 rounded-full border font-bold ${
                  sentiment.modifier > 0
                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                    : sentiment.modifier < 0
                    ? 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                    : 'bg-zinc-800 text-zinc-400 border-zinc-700'
                }`}
              >
                {sentiment.modifier > 0
                  ? `+${sentiment.modifier} Pts Modifier`
                  : sentiment.modifier < 0
                  ? `${sentiment.modifier} Pts Modifier`
                  : '0 Pts Neutral'}
              </span>
            </div>
            <p className="text-[11px] text-zinc-400">
              Your mental &amp; emotional state calibrates cognitive fatigue against the Discipline Score.
            </p>
          </div>
        </div>

        {/* Sentiment Indicator Icon */}
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-zinc-950 border border-zinc-800 text-xs">
          {sentiment.type === 'elevated' && (
            <div className="flex items-center gap-1.5 text-emerald-400 font-semibold">
              <Smile className="w-3.5 h-3.5" />
              <span>Elevated</span>
            </div>
          )}
          {sentiment.type === 'vulnerable' && (
            <div className="flex items-center gap-1.5 text-rose-400 font-semibold">
              <Frown className="w-3.5 h-3.5" />
              <span>Fatigued</span>
            </div>
          )}
          {sentiment.type === 'balanced' && (
            <div className="flex items-center gap-1.5 text-blue-400 font-semibold">
              <Meh className="w-3.5 h-3.5" />
              <span>Balanced</span>
            </div>
          )}
        </div>
      </div>

      {/* Input Field (1-2 sentences) */}
      <div className="space-y-1.5">
        <label className="text-[11px] font-medium text-zinc-400 flex items-center justify-between">
          <span>How did you feel emotionally &amp; mentally today? (1-2 sentences)</span>
          {reflectionText.length > 0 && (
            <button
              onClick={handleClear}
              className="text-[10px] text-zinc-500 hover:text-zinc-300 transition-colors cursor-pointer"
            >
              Clear
            </button>
          )}
        </label>
        <textarea
          rows={2}
          value={reflectionText}
          onChange={(e) => setReflectionText(e.target.value)}
          placeholder="e.g. Felt calm and in control during the morning; resisted the temptation to order food delivery."
          className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-purple-500/50 transition-colors resize-none leading-relaxed"
        />
      </div>

      {/* Quick Sentiment Presets */}
      <div className="space-y-1.5">
        <div className="text-[10px] font-medium text-zinc-500 uppercase tracking-wider">
          Quick Emotional States:
        </div>
        <div className="flex flex-wrap gap-1.5">
          {PRESET_REFLECTIONS.map((preset) => (
            <button
              key={preset.label}
              onClick={() => handleApplyPreset(preset.text)}
              className="px-2.5 py-1 rounded-lg bg-zinc-950 hover:bg-zinc-800 border border-zinc-800 text-[11px] text-zinc-300 flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <span>{preset.icon}</span>
              <span>{preset.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Sentiment Analysis Telemetry Card */}
      <div
        className={`p-3 rounded-xl border transition-all ${
          sentiment.type === 'elevated'
            ? 'bg-emerald-950/20 border-emerald-500/30'
            : sentiment.type === 'vulnerable'
            ? 'bg-rose-950/20 border-rose-500/30'
            : 'bg-zinc-950 border-zinc-800'
        }`}
      >
        <div className="flex items-start justify-between gap-2">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span
                className={`text-xs font-semibold ${
                  sentiment.type === 'elevated'
                    ? 'text-emerald-300'
                    : sentiment.type === 'vulnerable'
                    ? 'text-rose-300'
                    : 'text-zinc-300'
                }`}
              >
                {sentiment.label}
              </span>

              {sentiment.detectedKeywords.length > 0 && (
                <div className="flex items-center gap-1">
                  {sentiment.detectedKeywords.slice(0, 3).map((kw) => (
                    <span
                      key={kw}
                      className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-400 lowercase"
                    >
                      #{kw}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <p className="text-[11px] text-zinc-400 leading-normal">
              {sentiment.insight}
            </p>
          </div>

          {onAppendToDailyLog && reflectionText.trim().length > 0 && (
            <button
              onClick={() => onAppendToDailyLog(`[Emotional Reflection]: ${reflectionText}`)}
              className="shrink-0 px-2 py-1 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-[10px] text-purple-400 hover:text-purple-300 font-medium transition-colors cursor-pointer"
              title="Add reflection to daily log"
            >
              Sync to Log
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
