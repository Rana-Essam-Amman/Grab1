import React, { useState, useEffect } from 'react';
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
  onFocusChange,
}) => {
  const DEBUG_MODE = new URLSearchParams(window.location.search).has('debug');
  const [focused, setFocused] = useState(false);

  useEffect(() => {
    onFocusChange?.(focused);
  }, [focused, onFocusChange]);

  const handleSelect = (suggestion: string) => {
    onChange(suggestion);
    onSubmit();
    setFocused(false);
  };

  const handleClose = () => {
    setFocused(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      setFocused(false);
      onSubmit();
    }
  };

  return (
    <div className="relative flex items-center w-full" data-testid="search-container">
      {focused && (
        <button
          type="button"
          onClick={handleClose}
          className="absolute left-2 z-10 flex h-8 w-8 items-center justify-center rounded-full text-content-secondary hover:bg-canvas"
          aria-label={isArabic ? 'إغلاق البحث' : 'Close search'}
          data-testid="search-close-btn"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12.5 5L7.5 10L12.5 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      )}
      <input
        type="text"
        data-testid="search-input"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        onFocus={() => setFocused(true)}
        onBlur={() => {
          setTimeout(() => setFocused(false), 150);
        }}
        placeholder={isArabic ? 'ابحث في الماركت بليس...' : 'Search marketplace...'}
        className={`w-full h-11 bg-surface border border-border rounded-xl text-sm text-content-primary placeholder:text-content-tertiary focus:outline-none focus:border-primary transition-colors ${
          focused ? 'pl-12 pr-4' : 'px-4'
        }`}
        style={DEBUG_MODE ? { outline: '3px solid blue' } : undefined}
      />
      {DEBUG_MODE && (
        <span style={{position:'absolute',top:'-16px',right:0,background:'blue',color:'white',fontSize:'12px',padding:'1px 4px',zIndex:9999}}>
          INPUT focused:{String(focused)}
        </span>
      )}
      <SearchSuggestions
        query={value}
        onSelect={handleSelect}
        visible={focused && value.trim().length >= 2}
      />
    </div>
  );
};
