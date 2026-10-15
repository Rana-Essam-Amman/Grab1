import React, { useState } from 'react';
import { CloseCircle } from 'iconsax-react';
import { SearchSuggestions } from '@/features/listings/components/SearchSuggestions';

interface SearchBarProps {
  readonly isArabic: boolean;
  readonly value: string;
  readonly onChange: (v: string) => void;
  readonly onSubmit: () => void;
  readonly onFocusChange?: (focused: boolean) => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  isArabic,
  value,
  onChange,
  onSubmit,
  onFocusChange,
}) => {
  const [focused, setFocused] = useState(false);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      onSubmit();
    }
  };

  const handleSelect = (suggestion: string) => {
    onChange(suggestion);
    onSubmit();
    setFocused(false);
    onFocusChange?.(false);
  };

  return (
    <div className="relative">
      <div
        id="search-bar-container"
        className="rounded-full bg-surface border border-line h-12 flex items-center gap-2 px-4"
      >
        <input
          id="search-bar-input"
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => {
            setFocused(true);
            onFocusChange?.(true);
            requestAnimationFrame(() => {
              window.scrollTo({ top: 0, behavior: 'instant' });
            });
          }}
          onBlur={() => {
            setTimeout(() => {
              setFocused(false);
              onFocusChange?.(false);
            }, 150);
          }}
          placeholder={isArabic ? 'ابحث في السوق...' : 'Search the marketplace...'}
          className="flex-1 bg-transparent outline-none text-sm font-cairo text-ink placeholder:text-ink-muted/60"
          dir={isArabic ? 'rtl' : 'ltr'}
        />
        {value.trim() !== '' && (
          <button
            id="search-bar-clear"
            type="button"
            onClick={() => onChange('')}
            className="text-ink-muted hover:text-ink flex items-center justify-center cursor-pointer"
          >
            <CloseCircle size={18} variant="Linear" />
          </button>
        )}
      </div>
      <SearchSuggestions
        query={value}
        onSelect={handleSelect}
        visible={focused && value.trim().length >= 2}
      />
    </div>
  );
};
