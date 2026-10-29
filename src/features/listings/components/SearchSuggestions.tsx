import React, { useEffect, useRef, useState } from 'react';
import { searchSuggestions, type SearchSuggestion } from '../services/searchSuggestions';

interface SearchSuggestionsProps {
  readonly query: string;
  readonly onSelect: (s: string) => void;
  readonly visible: boolean;
}

export const SearchSuggestions: React.FC<SearchSuggestionsProps> = ({
  query,
  onSelect,
  visible,
}) => {
  const [items, setItems] = useState<SearchSuggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const debounceRef = useRef<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!visible || query.trim().length < 2) {
      setItems([]);
      setLoading(false);
      return;
    }

    if (debounceRef.current) window.clearTimeout(debounceRef.current);

    setLoading(true);
    debounceRef.current = window.setTimeout(async () => {
      try {
        const results = await searchSuggestions(query.trim());
        setItems(results);
      } catch {
        setItems([]);
      } finally {
        setLoading(false);
        setActiveIndex(-1);
      }
    }, 250);

    return () => {
      if (debounceRef.current) window.clearTimeout(debounceRef.current);
    };
  }, [query, visible]);

  useEffect(() => {
    if (!visible) return;

    const handleKey = (e: KeyboardEvent) => {
      if (items.length === 0) return;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setActiveIndex((i) => (i + 1) % items.length);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setActiveIndex((i) => (i <= 0 ? items.length - 1 : i - 1));
      } else if (e.key === 'Enter' && activeIndex >= 0) {
        e.preventDefault();
        onSelect(items[activeIndex].suggestion);
      } else if (e.key === 'Escape') {
        e.preventDefault();
        setItems([]);
      }
    };

    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [visible, items, activeIndex, onSelect]);

  if (!visible || (!loading && items.length === 0)) return null;

  return (
    <div
      ref={containerRef}
      className="relative mt-1 w-full max-h-80 overflow-y-auto rounded-lg border border-border bg-surface shadow-lg"
      role="listbox"
    >
      {loading && items.length === 0 && (
        <div className="flex items-center justify-center p-3 text-content-tertiary">
          <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
        </div>
      )}
      {items.map((item, idx) => (
        <button
          key={`${item.suggestion}-${item.suggestionType}-${idx}`}
          type="button"
          role="option"
          aria-selected={idx === activeIndex}
          className={`flex w-full items-center gap-2 px-3 py-2 text-start text-sm cursor-pointer transition-colors hover:bg-canvas ${
            idx === activeIndex ? 'bg-canvas' : ''
          }`}
          onClick={() => onSelect(item.suggestion)}
          onMouseEnter={() => setActiveIndex(idx)}
        >
          <span className="flex-1 truncate">{item.suggestion}</span>
        </button>
      ))}
    </div>
  );
};
