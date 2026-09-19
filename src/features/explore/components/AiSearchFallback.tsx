import React, { useState } from 'react';
import { SearchNormal1, Add } from 'iconsax-react';

export interface AiSearchFallbackProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (query: string) => void;
  isArabic: boolean;
}

export const AiSearchFallback: React.FC<AiSearchFallbackProps> = ({ isOpen, onClose, onSubmit, isArabic }) => {
  const [query, setQuery] = useState('');

  // Not rendering standard component if closed
  if (!isOpen) return null;

  return (
    <div
      id="manual-search-fallback-container"
      dir={isArabic ? 'rtl' : 'ltr'}
      className="w-full max-w-[440px] mx-auto bg-surface rounded-2xl shadow-xs p-3.5 flex items-center gap-2 border border-neutral-100 font-cairo transition-all duration-300"
    >
      <SearchNormal1 size={18} variant="Linear" color="#64748B" className="text-ink-muted shrink-0 select-none" />
      <input
        type="text"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          onSubmit(e.target.value);
        }}
        placeholder={
          isArabic
            ? 'ابحث يدوياً عن سيارات، هواتف، عقارات في بلدك...'
            : 'Search manually for cars, phones, real estate in your country...'
        }
        className="w-full bg-transparent border-none outline-hidden text-sm text-ink placeholder:text-ink-soft font-medium font-cairo"
      />
      {query && (
        <button
          type="button"
          onClick={() => {
            setQuery('');
            onSubmit('');
          }}
          className="p-1 text-ink-muted hover:text-ink-soft transition-colors cursor-pointer shrink-0 rounded-full hover:bg-neutral-100"
          title={isArabic ? 'مسح البحث' : 'Clear search'}
        >
          <Add size={15} variant="Linear" color="#64748B" className="rotate-45" />
        </button>
      )}
    </div>
  );
};
