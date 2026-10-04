import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Icon } from '@iconify/react';

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
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
        setQuery('');
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const filtered = useMemo(() => {
    if (!query.trim()) return options;
    const q = query.trim().toLowerCase();
    return options.filter((o) => o.toLowerCase().includes(q));
  }, [options, query]);

  const handleSelect = (v: string) => {
    onChange(v);
    setOpen(false);
    setQuery('');
  };

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => !disabled && setOpen((p) => !p)}
        disabled={disabled}
        className="w-full h-11 px-3.5 rounded-xl bg-surface border border-border text-sm text-ink text-start flex items-center justify-between disabled:opacity-50"
      >
        <span className={value ? 'text-ink' : 'text-ink-muted'}>
          {value || placeholder || (isArabic ? 'اختر' : 'Select')}
        </span>
        <Icon icon="solar:alt-arrow-down-linear" width={16} className="text-ink-muted" />
      </button>

      {open && (
        <div className="absolute z-50 mt-1 w-full rounded-xl bg-surface border border-border shadow-lg max-h-64 overflow-hidden flex flex-col">
          <div className="p-2 border-b border-border">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={isArabic ? 'ابحث...' : 'Search...'}
              className="w-full h-9 px-3 rounded-lg bg-canvas border border-border text-sm text-ink focus:outline-none focus:border-primary"
              autoFocus
              dir={isArabic ? 'rtl' : 'ltr'}
            />
          </div>
          <div className="overflow-y-auto flex-1">
            {filtered.length === 0 ? (
              <p className="p-3 text-xs text-ink-muted text-center">
                {isArabic ? 'لا توجد نتائج' : 'No results'}
              </p>
            ) : (
              filtered.map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => handleSelect(opt)}
                  className={`w-full text-start px-3 py-2 text-sm hover:bg-canvas transition-colors ${
                    opt === value ? 'bg-primary/10 text-primary font-bold' : 'text-ink'
                  }`}
                >
                  {opt}
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};
