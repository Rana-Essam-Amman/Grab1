import { useCallback, useState } from 'react';
import { stripEmojisFromInput } from '@/shared/lib/stripEmojis';

export interface UseChatComposerReturn {
  readonly inputText: string;
  readonly handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  readonly clearInput: () => void;
}

export function useChatComposer(notifyTyping: () => void): UseChatComposerReturn {
  const [inputText, setInputText] = useState('');

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const cleaned = stripEmojisFromInput(e.target.value);
      setInputText(cleaned);
      if (cleaned.trim().length > 0) notifyTyping();
    },
    [notifyTyping]
  );

  const clearInput = useCallback(() => setInputText(''), []);

  return { inputText, handleInputChange, clearInput };
}
