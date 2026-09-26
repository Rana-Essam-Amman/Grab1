import React, { ChangeEvent } from 'react';

export interface CategorySearchBarProps {
  isArabic: boolean;
  value: string;
  onChange: (next: string) => void;
  disabled?: boolean;
}

export const CategorySearchBar: React.FC<CategorySearchBarProps> = ({
  isArabic,
  value,
  onChange,
  disabled = false,
}) => {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => onChange(e.target.value);
  return (
    <input
      type="text"
      value={value}
      onChange={handleChange}
      disabled={disabled}
      autoComplete="off"
      autoCorrect="off"
      autoCapitalize="off"
      spellCheck={false}
      name="category-search-input"
      data-testid="category-search-input"
      placeholder={isArabic ? 'ابحث: كامري، شقة، ايفون...' : 'Search: camry, apartment, iphone...'}
      className="w-full px-4 py-2.5 rounded-xl border border-line bg-surface text-ink text-sm outline-none focus:ring-2 focus:ring-primary/40 disabled:opacity-50"
    />
  );
};
