import React, { useRef, useEffect } from 'react';
import { useTranslation } from '@/shared/i18n';

export interface AiInputTextareaProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onFocus: () => void;
  onBlur: (e: React.FocusEvent<HTMLTextAreaElement>) => void;
  onSend: () => void;
  disabled?: boolean;
  isArabic: boolean;
  placeholderOverride?: string;
}

export const AiInputTextarea: React.FC<AiInputTextareaProps> = ({
  value,
  onChange,
  onFocus,
  onBlur,
  onSend,
  disabled,
  isArabic,
  placeholderOverride,
}) => {
  const { t } = useTranslation();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  }, [value]);

  return (
    <textarea
      ref={textareaRef}
      dir={isArabic ? 'rtl' : 'ltr'}
      rows={1}
      value={value}
      onChange={onChange}
      onFocus={onFocus}
      onBlur={onBlur}
      onKeyDown={(e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
          e.preventDefault();
          if (!disabled) onSend();
        }
      }}
      disabled={disabled}
      placeholder={placeholderOverride || t('explore.searchPlaceholder')}
      className="w-full bg-transparent resize-none overflow-hidden border-none outline-none focus:ring-0 text-ink text-sm leading-snug font-medium [font-family:'Cairo','Tajawal',sans-serif] antialiased p-0 min-h-[24px] max-h-[120px] placeholder:text-ink-muted placeholder:font-normal placeholder:opacity-90"
      style={{ height: 'auto' }}
    />
  );
};
