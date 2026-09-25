import React, { useState, ChangeEvent } from 'react';
import { CategoryDef } from '@/types';
import { searchCategories } from '@/data/categoryAliases';

export interface CategorySearchBarProps {
  isArabic: boolean;
  onSelect: (slug: string) => void;
  disabled?: boolean;
}

export const CategorySearchBar: React.FC<CategorySearchBarProps> = ({
  isArabic,
  onSelect,
  disabled = false,
}) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<CategoryDef[]>([]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const nextVal = e.target.value;
    setQuery(nextVal);
    setResults(searchCategories(nextVal));
  };

  const handleItemClick = (slug: string) => {
    onSelect(slug);
    setQuery('');
    setResults([]);
  };

  return (
    <div className="relative w-full" dir={isArabic ? 'rtl' : 'ltr'}>
      <input
        type="text"
        value={query}
        onChange={handleChange}
        disabled={disabled}
        placeholder={isArabic ? 'ابحث: كامري، ايفون، شقة...' : 'Search: camry, iphone...'}
        className="w-full px-4 py-2.5 rounded-xl border border-line bg-surface text-ink text-sm outline-none focus:ring-2 focus:ring-primary/40 disabled:opacity-50"
      />
      {results.length > 0 && (
        <ul className="absolute z-30 left-0 right-0 mt-1 max-h-56 overflow-y-auto rounded-xl border border-line bg-surface shadow-lg divide-y divide-line">
          {results.map((cat) => (
            <li key={cat.slug}>
              <button
                type="button"
                onClick={() => handleItemClick(cat.slug)}
                className="w-full px-4 py-2.5 text-start text-sm text-ink hover:bg-canvas transition-colors flex items-center justify-between"
              >
                <span className="font-medium">{isArabic ? cat.nameAr : cat.nameEn}</span>
                <span className="text-xs text-ink-muted">{isArabic ? cat.nameEn : cat.nameAr}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
