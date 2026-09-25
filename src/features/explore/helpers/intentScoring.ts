// Scores confidence for a PUBLISH-intent classification.
// Consumed by useAiAssistant to gate the Suggestion Card.
// Extend for new markets by appending to the keyword arrays
// or extracting to intentKeywords/<locale>.ts.

export interface IntentScore {
  readonly confidence: number;
  readonly signals: readonly string[];
}

export const INTENT_CONFIDENCE_THRESHOLD = 0.75;

const EXPLICIT_SELL: readonly string[] = [
  'بدي أبيع', 'بدي أنزل', 'بدي ابيع', 'بدي انزل',
  'بدي أبيعها', 'بدي أبيعو',
  'حط إعلان', 'حط اعلان',
];

const WEAK_SELL: readonly string[] = [
  'للبيع', 'للإيجار', 'للايجار',
];

const CONDITION_HINTS: readonly string[] = [
  'بحالة', 'فحص', 'ماشي', 'ماشية', 'عداد', 'حالة الوكالة',
];

const PRICE_PATTERN = /\d+\s*(دينار|دولار|ليرة|ريال|jod|usd|\$|ألف|الف|k)/i;

export const scoreIntent = (text: string): IntentScore => {
  const raw = text.trim().toLowerCase();
  if (!raw) return { confidence: 0, signals: [] };

  const signals: string[] = [];
  let confidence = 0;

  const hasExplicit = EXPLICIT_SELL.some((kw) => raw.includes(kw.toLowerCase()));
  const hasWeak = WEAK_SELL.some((kw) => raw.includes(kw.toLowerCase()));
  const hasCondition = CONDITION_HINTS.some((kw) => raw.includes(kw.toLowerCase()));
  const hasPrice = PRICE_PATTERN.test(raw);
  const isDetailed = raw.length > 30;

  if (hasExplicit) {
    confidence += 0.75;
    signals.push('explicit_sell');
  } else if (hasWeak) {
    confidence += 0.35;
    signals.push('weak_sell');
  }

  if (hasPrice) {
    confidence += 0.15;
    signals.push('price');
  }

  if (hasCondition) {
    confidence += 0.1;
    signals.push('condition');
  }

  if (isDetailed) {
    confidence += 0.05;
    signals.push('detailed');
  }

  return {
    confidence: Math.min(Number(confidence.toFixed(2)), 1),
    signals,
  };
};
