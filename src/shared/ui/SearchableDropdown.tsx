import React, { useState } from 'react';
import { Icon } from '@iconify/react';
import { findMatchRange } from '@/shared/lib/arabicNormalize';
import { useSearchableDropdown } from './useSearchableDropdown';

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

  const {
    rootRef,
    listRef,
    listId,
    filtered,
    highlighted,
    setHighlighted,
    handleSelect,
    handleKeyDown,
  } = useSearchableDropdown({
    options,
    query,
    setQuery,
    open,
    setOpen,
    onChange,
  });

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
