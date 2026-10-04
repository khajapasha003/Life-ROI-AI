import { EmotionalSentimentModifier } from '../types/roi';

const ELEVATED_WORDS = [
  'calm',
  'peaceful',
  'grounded',
  'focused',
  'energized',
  'grateful',
  'content',
  'confident',
  'disciplined',
  'clear',
  'happy',
  'proud',
  'unstoppable',
  'in control',
  'motivated',
  'healthy',
  'rested',
  'relaxed',
  'steady',
  'fulfilled',
  'serene',
  'sharp',
  'mindful',
  'inspired',
];

const VULNERABLE_WORDS = [
  'stressed',
  'anxious',
  'overwhelmed',
  'exhausted',
  'tired',
  'burnout',
  'craving',
  'impulse',
  'frustrated',
  'angry',
  'depressed',
  'lonely',
  'fidgety',
  'distracted',
  'foggy',
  'drained',
  'hangry',
  'sad',
  'worried',
  'chaotic',
  'restless',
  'fatigued',
  'rushed',
  'guilty',
];

export function analyzeEmotionalSentiment(text: string): EmotionalSentimentModifier {
  const trimmed = text.trim().toLowerCase();

  if (!trimmed) {
    return {
      type: 'balanced',
      modifier: 0,
      label: 'Neutral Baseline',
      badgeColor: 'text-zinc-400 bg-zinc-800/60 border-zinc-700',
      insight: 'Log your emotional state to calibrate cognitive fatigue vs discipline index.',
      detectedKeywords: [],
    };
  }

  const detectedElevated: string[] = [];
  const detectedVulnerable: string[] = [];

  ELEVATED_WORDS.forEach((word) => {
    if (new RegExp(`\\b${word}\\b`, 'i').test(trimmed)) {
      detectedElevated.push(word);
    }
  });

  VULNERABLE_WORDS.forEach((word) => {
    if (new RegExp(`\\b${word}\\b`, 'i').test(trimmed)) {
      detectedVulnerable.push(word);
    }
  });

  const elevatedCount = detectedElevated.length;
  const vulnerableCount = detectedVulnerable.length;

  if (vulnerableCount > elevatedCount) {
    // Cognitive Fatigue / Impulse Vulnerability Detected
    const modifier = Math.max(-5, -2 - (vulnerableCount - 1));
    return {
      type: 'vulnerable',
      modifier,
      label: `Cognitive Friction Risk (${modifier} pts)`,
      badgeColor: 'text-rose-400 bg-rose-500/10 border-rose-500/20',
      insight:
        'Cognitive exhaustion and stress trigger convenience bias, increasing dopamine-driven impulse spending risk by ~42%.',
      detectedKeywords: detectedVulnerable,
    };
  }

  if (elevatedCount > 0) {
    // High Focus & Emotional Stability Detected
    const modifier = Math.min(5, 3 + Math.floor((elevatedCount - 1) / 2));
    return {
      type: 'elevated',
      modifier,
      label: `Emotional Stability Bonus (+${modifier} pts)`,
      badgeColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
      insight:
        'Calm and grounded nervous state reduces emotional spending friction and protects high-conviction deep work cycles.',
      detectedKeywords: detectedElevated,
    };
  }

  // Steady / Balanced Reflection
  return {
    type: 'balanced',
    modifier: 1,
    label: 'Emotional Equilibrium (+1 pt)',
    badgeColor: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
    insight: 'Steady baseline emotion maintains baseline behavioral discipline with minimal impulse drift.',
    detectedKeywords: [],
  };
}
