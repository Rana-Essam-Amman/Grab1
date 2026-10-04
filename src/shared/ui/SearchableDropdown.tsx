import React, {
  useState, useMemo, useRef, useEffect, useCallback, useId,
} from 'react';
import { Icon } from '@iconify/react';
import { matchScore, findMatchRange } from '@/shared/lib/arabicNormalize';

interface Props {
  readonly options: readonly string[];
  readonly value: string;
  readonly onChange: (v: string) => void;
  readonly placeholder?: string;
  readonly isArabic?: boolean;
  readonly disabled?: boolean;
}

export const SearchableDropdown: React.FC<Props> = ({
  options,
  value,
  onChange,
  placeholder,
  isArabic = false,
  disabled = false,
}) => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [highlighted, setHighlighted] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const listId = useId();

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false);
        setQuery('');
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  // Ranked + filtered results
  const filtered = useMemo(() => {
    if (!query.trim()) return options;
    const scored = options
      .map((o) => ({ option: o, score: matchScore(query, o) }))
      .filter((x) => x.score > 0)
      .sort((a, b) => b.score - a.score);
    return scored.map((x) => x.option);
  }, [options, query]);

  // Reset highlight when results change
  useEffect(() => {
    setHighlighted(0);
  }, [query]);

  // Keep highlighted item in view
  useEffect(() => {
    if (!open || !listRef.current) return;
    const el = listRef.current.querySelector<HTMLElement>(
      `[data-option-index="${highlighted}"]`
    );
    el?.scrollIntoView({ block: 'nearest' });
  }, [highlighted, open]);

  const handleSelect = useCallback(
    (v: string) => {
      onChange(v);
      setOpen(false);
      setQuery('');
    },
    [onChange]
  );

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlighted((i) => Math.min(i + 1, filtered.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlighted((i) => Math.max(i - 1, 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filtered[highlighted]) handleSelect(filtered[highlighted]);
    } else if (e.key === 'Escape') {
      setOpen(false);
      setQuery('');
    } else if (e.key === 'Tab') {
      setOpen(false);
    }
  };

  const renderOptionLabel = (option: string): React.ReactNode => {
    const range = findMatchRange(query, option);
    if (!range) return option;
    const before = option.slice(0, range.start);
    const match = option.slice(range.start, range.end);
    const after = option.slice(range.end);
    return (
      <>
        {before}
        <mark className="bg-primary/20 text-primary font-bold rounded px-0.5">
          {match}
        </mark>
        {after}
      </>
    );
  };

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        onClick={() => !disabled && setOpen((p) => !p)}
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={open}
        className="w-full min-h-11 px-3.5 rounded-xl bg-surface border border-border text-sm text-ink text-start flex items-center justify-between gap-2 disabled:opacity-50"
      >
        <span className={value ? 'text-ink' : 'text-ink-muted'}>
          {value || placeholder || (isArabic ? 'اختر' : 'Select')}
        </span>
        <Icon
          icon="solar:alt-arrow-down-linear"
          width={16}
          className={`text-ink-muted transition-transform ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {open && (
        <div className="absolute z-50 mt-1 w-full rounded-xl bg-surface border border-border shadow-lg max-h-72 overflow-hidden flex flex-col">
          <div className="p-2 border-b border-border">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={isArabic ? 'ابحث...' : 'Search...'}
              role="combobox"
              aria-expanded="true"
              aria-controls={listId}
              aria-activedescendant={
                filtered[highlighted] ? `${listId}-${highlighted}` : undefined
              }
              className="w-full min-h-10 px-3 rounded-lg bg-canvas border border-border text-sm text-ink focus:outline-none focus:border-primary"
              autoFocus
              dir={isArabic ? 'rtl' : 'ltr'}
            />
          </div>

          <div id={listId} role="listbox" ref={listRef} className="overflow-y-auto flex-1">
            {filtered.length === 0 ? (
              <p className="p-3 text-xs text-ink-muted text-center">
                {isArabic ? 'لا توجد نتائج' : 'No results'}
              </p>
            ) : (
              filtered.map((opt, i) => (
                <button
                  key={opt}
                  id={`${listId}-${i}`}
                  role="option"
                  aria-selected={i === highlighted}
                  data-option-index={i}
                  type="button"
                  onClick={() => handleSelect(opt)}
                  onMouseEnter={() => setHighlighted(i)}
                  className={`w-full min-h-11 text-start px-3 py-2 text-sm transition-colors ${
                    i === highlighted
                      ? 'bg-primary/10 text-primary font-bold'
                      : 'text-ink hover:bg-canvas'
                  }`}
                >
                  {renderOptionLabel(opt)}
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};
