import React, { useState, useMemo } from 'react';
import * as Popover from '@radix-ui/react-popover';
import { ArrowDown2, SearchNormal1 } from 'iconsax-react';

interface ComboboxProps {
  readonly value: string;
  readonly options: readonly string[];
  readonly placeholder: string;
  readonly searchPlaceholder?: string;
  readonly emptyText?: string;
  readonly onChange: (value: string) => void;
  readonly disabled?: boolean;
  readonly testId?: string;
}

export const Combobox: React.FC<ComboboxProps> = ({
  value,
  options,
  placeholder,
  searchPlaceholder = 'Search...',
  emptyText = 'No results',
  onChange,
  disabled,
  testId,
}) => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return options;
    return options.filter((o) => o.toLowerCase().includes(q));
  }, [options, query]);

  const handleSelect = (opt: string) => {
    onChange(opt);
    setOpen(false);
    setQuery('');
  };

  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger asChild>
        <button
          type="button"
          disabled={disabled}
          data-testid={testId}
          data-combobox="true"
          className="w-full h-10 px-3.5 rounded-xl bg-surface text-ink border border-line focus:border-primary text-sm flex items-center justify-between gap-2 disabled:opacity-50 cursor-pointer"
        >
          <span className={value ? 'text-ink font-medium' : 'text-ink-muted'}>
            {value || placeholder}
          </span>
          <ArrowDown2 size={16} className="text-ink-muted shrink-0" />
        </button>
      </Popover.Trigger>

      <Popover.Portal>
        <Popover.Content
          sideOffset={4}
          align="start"
          className="z-50 w-[var(--radix-popover-trigger-width)] max-h-72 rounded-xl bg-white border border-line shadow-lg overflow-hidden"
        >
          <div className="p-2 border-b border-line">
            <div className="flex items-center gap-2 px-2.5 h-9 rounded-lg bg-canvas">
              <SearchNormal1 size={14} className="text-ink-muted shrink-0" />
              <input
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={searchPlaceholder}
                className="flex-1 bg-transparent text-sm text-ink outline-none placeholder:text-ink-muted"
              />
            </div>
          </div>
          <div className="overflow-y-auto max-h-56 py-1">
            {filtered.length === 0 ? (
              <div className="px-3 py-4 text-xs text-ink-muted text-center">{emptyText}</div>
            ) : (
              filtered.map((opt) => (
                <button
                  key={opt}
                  type="button"
                  data-combobox-option="true"
                  onClick={() => handleSelect(opt)}
                  className={`w-full text-start px-3 py-2 text-sm hover:bg-canvas transition-colors cursor-pointer ${
                    opt === value ? 'font-bold text-primary bg-canvas' : 'text-ink'
                  }`}
                >
                  {opt}
                </button>
              ))
            )}
          </div>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
};
