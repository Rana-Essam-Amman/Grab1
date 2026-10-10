import { useState, useMemo, useRef, useEffect, useCallback, useId } from 'react';
import { matchScore } from '@/shared/lib/arabicNormalize';

interface Params {
  readonly options: readonly string[];
  readonly query: string;
  readonly setQuery: (v: string) => void;
  readonly open: boolean;
  readonly setOpen: (v: boolean) => void;
  readonly onChange: (v: string) => void;
}

export function useSearchableDropdown(params: Params) {
  const { options, query, setQuery, open, setOpen, onChange } = params;
  const [highlighted, setHighlighted] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const listId = useId();

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
  }, [open, setOpen, setQuery]);

  const filtered = useMemo(() => {
    if (!query.trim()) return options;
    const scored = options
      .map((o) => ({ option: o, score: matchScore(query, o) }))
      .filter((x) => x.score > 0)
      .sort((a, b) => b.score - a.score);
    return scored.map((x) => x.option);
  }, [options, query]);

  useEffect(() => {
    setHighlighted(0);
  }, [query]);

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
    [onChange, setOpen, setQuery]
  );

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const k = e.key;
    if (k === 'ArrowDown') {
      e.preventDefault();
      setHighlighted((i) => Math.min(i + 1, filtered.length - 1));
      return;
    }
    if (k === 'ArrowUp') {
      e.preventDefault();
      setHighlighted((i) => Math.max(i - 1, 0));
      return;
    }
    if (k === 'Enter') {
      e.preventDefault();
      if (filtered[highlighted]) handleSelect(filtered[highlighted]);
      return;
    }
    if (k === 'Escape' || k === 'Tab') {
      setOpen(false);
      if (k === 'Escape') setQuery('');
    }
  };

  return {
    rootRef,
    listRef,
    listId,
    filtered,
    highlighted,
    setHighlighted,
    handleSelect,
    handleKeyDown,
  };
}
