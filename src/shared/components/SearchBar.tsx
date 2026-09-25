import React from 'react';
import { CloseCircle } from 'iconsax-react';
import { Icon } from '@iconify/react';

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
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      onSubmit();
    }
  };

  return (
    <div
      id="search-bar-container"
      className="rounded-full bg-surface border border-line h-12 flex items-center gap-2 px-4"
    >
      <Icon icon="fluent-emoji:magnifying-glass-tilted-right" width={20} height={20} />
      <input
        id="search-bar-input"
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        onFocus={() => {
          onFocusChange?.(true);
          requestAnimationFrame(() => {
            window.scrollTo({ top: 0, behavior: 'instant' });
          });
        }}
        onBlur={() => onFocusChange?.(false)}
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
  );
};
