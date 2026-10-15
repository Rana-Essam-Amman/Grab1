import React, { useRef, useState } from 'react';
import { SearchSuggestions } from '@/features/listings/components/SearchSuggestions';

export interface SearchBarProps {
  readonly isArabic: boolean;
  readonly value: string;
  readonly onChange: (value: string) => void;
  readonly onSubmit: () => void;
  readonly onFocusChange?: (focused: boolean) => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  isArabic,
  value,
  onChange,
  onSubmit,
}) => {
  const [focused, setFocused] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleSelect = (suggestion: string) => {
    onChange(suggestion);
    onSubmit();
    setFocused(false);
  };

  return (
    <div
      ref={containerRef}
      className="relative flex items-center w-full scroll-mt-32"
      data-testid="search-container"
    >
      <input
        type="text"
        data-testid="search-input"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') onSubmit();
        }}
        onFocus={() => {
          setFocused(true);
          requestAnimationFrame(() => {
            containerRef.current?.scrollIntoView({
              block: 'start',
              behavior: 'instant',
            });
          });
        }}
        onBlur={() => {
          setTimeout(() => setFocused(false), 150);
        }}
        placeholder={isArabic ? 'ابحث في الماركت بليس...' : 'Search marketplace...'}
        className="w-full h-11 px-4 bg-surface border border-border rounded-xl text-sm text-content-primary placeholder:text-content-tertiary focus:outline-none focus:border-primary transition-colors"
      />
      <SearchSuggestions
        query={value}
        onSelect={handleSelect}
        visible={focused && value.trim().length >= 2}
      />
    </div>
  );
};
