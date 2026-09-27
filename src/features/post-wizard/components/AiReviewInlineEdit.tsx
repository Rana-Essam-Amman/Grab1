import React, { useEffect, useRef } from 'react';

type Variant = 'title' | 'price' | 'description';

interface AiReviewInlineEditProps {
  readonly value: string;
  readonly placeholder: string;
  readonly editing: boolean;
  readonly variant: Variant;
  readonly currency?: string;
  readonly onChange: (v: string) => void;
  readonly onStartEdit: () => void;
  readonly onStopEdit: () => void;
}

const VIEW_CLASS: Record<Variant, string> = {
  title: 'text-[14px] font-bold text-ink leading-snug text-start',
  price: 'text-[14px] font-bold text-brand leading-none text-start',
  description: 'text-[14px] font-medium text-ink-soft leading-relaxed whitespace-pre-wrap text-start',
};

const EDIT_CLASS: Record<Variant, string> = {
  title: 'text-[15px] font-bold text-ink leading-snug w-full bg-transparent border-0 outline-none p-0 m-0 text-start',
  price: 'text-[15px] font-bold text-ink leading-none w-full bg-transparent border-0 outline-none p-0 m-0 text-start',
  description: 'text-[14px] font-medium text-ink-soft leading-relaxed w-full min-h-[80px] bg-transparent border-0 outline-none p-0 m-0 resize-none text-start',
};

const INPUT_ATTRS = {
  autoComplete: 'off' as const,
  autoCorrect: 'off' as const,
  autoCapitalize: 'off' as const,
  spellCheck: false,
};

export const AiReviewInlineEdit: React.FC<AiReviewInlineEditProps> = ({
  value, placeholder, editing, variant, currency, onChange, onStartEdit, onStopEdit,
}) => {
  const ref = useRef<HTMLInputElement & HTMLTextAreaElement>(null);

  useEffect(() => {
    if (editing && ref.current) {
      ref.current.focus();
      if (variant !== 'description') ref.current.select();
    }
  }, [editing, variant]);

  if (editing) {
    return (
      <div className="rounded-xl border-2 border-accent bg-surface px-3.5 py-3 shadow-sm animate-[fade-up_0.2s_ease-out]">
        {variant === 'description' ? (
          <textarea
            ref={ref}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onBlur={onStopEdit}
            className={EDIT_CLASS.description}
            placeholder={placeholder}
            {...INPUT_ATTRS}
          />
        ) : variant === 'price' ? (
          <div className="flex items-baseline gap-2">
            <input
              ref={ref}
              type="text"
              inputMode="numeric"
              value={value}
              onChange={(e) => onChange(e.target.value.replace(/[^0-9]/g, ''))}
              onBlur={onStopEdit}
              onKeyDown={(e) => { if (e.key === 'Enter') onStopEdit(); }}
              className={EDIT_CLASS.price}
              placeholder={placeholder}
              {...INPUT_ATTRS}
            />
            {currency && (
              <span className="text-[13px] font-bold text-ink-muted shrink-0">{currency}</span>
            )}
          </div>
        ) : (
          <input
            ref={ref}
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onBlur={onStopEdit}
            onKeyDown={(e) => { if (e.key === 'Enter') onStopEdit(); }}
            className={EDIT_CLASS.title}
            placeholder={placeholder}
            {...INPUT_ATTRS}
          />
        )}
      </div>
    );
  }

  const isEmpty = !value || !value.trim();
  return (
    <button
      type="button"
      onClick={onStartEdit}
      className="block text-start w-full cursor-text hover:opacity-80 transition-opacity"
    >
      {variant === 'price' && !isEmpty ? (
        <span className={`inline-flex items-baseline gap-2 ${VIEW_CLASS.price}`}>
          <span>{value}</span>
          {currency && <span className="text-[12px] font-bold text-ink-muted">{currency}</span>}
        </span>
      ) : (
        <span className={isEmpty ? 'text-ink-muted/40 italic ' + VIEW_CLASS[variant] : VIEW_CLASS[variant]}>
          {isEmpty ? placeholder : value}
        </span>
      )}
    </button>
  );
};
