import { useState, useCallback } from 'react';
import { scoreIntent, INTENT_CONFIDENCE_THRESHOLD } from '../helpers/intentScoring';

export interface SuggestionState {
  readonly confidence: number;
  readonly signals: readonly string[];
  readonly rawText: string;
}

export interface UseAiSuggestionReturn {
  readonly suggestion: SuggestionState | null;
  readonly isDismissed: boolean;
  readonly evaluate: (text: string) => void;
  readonly dismiss: () => void;
  readonly clear: () => void;
}

export const useAiSuggestion = (): UseAiSuggestionReturn => {
  const [suggestion, setSuggestion] = useState<SuggestionState | null>(null);
  const [isDismissed, setIsDismissed] = useState(false);

  const evaluate = useCallback((text: string) => {
    if (isDismissed) return;

    const score = scoreIntent(text);
    if (score.confidence >= INTENT_CONFIDENCE_THRESHOLD) {
      setSuggestion({
        confidence: score.confidence,
        signals: score.signals,
        rawText: text,
      });
    } else {
      setSuggestion(null);
    }
  }, [isDismissed]);

  const dismiss = useCallback(() => {
    setSuggestion(null);
    setIsDismissed(true);
  }, []);

  const clear = useCallback(() => {
    setSuggestion(null);
  }, []);

  return {
    suggestion,
    isDismissed,
    evaluate,
    dismiss,
    clear,
  };
};
