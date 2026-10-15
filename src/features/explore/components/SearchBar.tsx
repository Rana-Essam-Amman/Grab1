import React, { useState } from 'react';
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

  const handleSelect = (suggestion: string) => {
    onChange(suggestion);
    onSubmit();
    setFocused(false);
  };

  return (
    <div className="relative flex items-center w-full" data-testid="search-container">
      <input
        type="text"
        data-testid="search-input"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') onSubmit();
        }}
        onFocus={() => setFocused(true)}
        onBlur={() => {
          // Delay so click on suggestion can fire
          setTimeout(() => setFocused(false), 150);
        }}
        placeholder={isArabic ? 'ابحث في الماركت بليس...' : 'Search marketplace...'}
        className="w-full h-11 pl-10 pr-4 bg-surface-raised border border-border rounded-xl text-sm text-content-primary placeholder:text-content-tertiary focus:outline-none focus:border-primary transition-colors"
      />
      <svg
        className="absolute left-3.5 w-4 h-4 text-content-tertiary pointer-events-none"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
        />
      </svg>
      <SearchSuggestions
        query={value}
        onSelect={handleSelect}
        visible={focused && value.trim().length >= 2}
      />
    </div>
  );
};
