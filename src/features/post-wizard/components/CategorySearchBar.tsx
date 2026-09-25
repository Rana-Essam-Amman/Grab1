import React, { useState } from 'react';
import { searchCategories } from '../../../data/categoryAliases';
import { CategoryDef } from '../../../types';

interface CategorySearchBarProps {
  isArabic: boolean;
  onSelect: (slug: string) => void;
  disabled?: boolean;
}

export const CategorySearchBar: React.FC<CategorySearchBarProps> = ({ isArabic, onSelect, disabled }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<CategoryDef[]>([]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setQuery(val);
    setResults(searchCategories(val));
  };

  const handleSelect = (slug: string) => {
    onSelect(slug);
    setQuery('');
    setResults([]);
  };

  return (
    <div className="relative w-full">
      <input
        type="text"
        disabled={disabled}
        value={query}
        onChange={handleChange}
        placeholder={isArabic ? 'ابحث: كامري، ايفون، شقة...' : 'Search: camry, iphone...'}
        className="w-full px-4 py-2 bg-surface border border-line rounded-lg text-ink focus:outline-none focus:ring-2 focus:ring-primary text-sm"
      />
      {results.length > 0 && (
        <div className="absolute z-50 left-0 right-0 mt-1 bg-surface border border-line rounded-lg shadow-lg max-h-60 overflow-y-auto">
          {results.map((cat) => (
            <button
              key={cat.slug}
              type="button"
              onClick={() => handleSelect(cat.slug)}
              className="w-full px-4 py-2.5 text-left flex items-center justify-between hover:bg-line/20 text-ink text-sm transition-colors border-b border-line last:border-b-0"
            >
              <span>{isArabic ? cat.nameAr : cat.nameEn}</span>
              <span className="text-xs text-muted capitalize">{cat.slug}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
