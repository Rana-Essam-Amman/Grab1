import React, { useState, useMemo, useCallback } from 'react';
import { searchLocationsHierarchical, type LocationSearchResult } from '@/data/locations/registry';

interface Props {
  readonly countryCode: string;
  readonly isArabic: boolean;
  readonly activeNeighborhood: string | null;
  readonly onSelect: (result: LocationSearchResult | null) => void;
}

export const LocationHierarchyFilter: React.FC<Props> = ({ countryCode, isArabic, activeNeighborhood, onSelect }) => {
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState<LocationSearchResult | null>(null);

  const results = useMemo(
    () => (query.trim().length >= 1 ? searchLocationsHierarchical(countryCode, query).slice(0, 30) : []),
    [countryCode, query],
  );

  const handleSelect = useCallback((item: LocationSearchResult) => {
    setSelected(item);
    setQuery('');
    onSelect(item);
  }, [onSelect]);

  const handleClear = useCallback(() => {
    setSelected(null);
    setQuery('');
    onSelect(null);
  }, [onSelect]);

  const displayPath = (item: LocationSearchResult) => (isArabic ? item.parentPathAr : item.parentPathEn).join(' › ');

  return (
    <div className="flex flex-col gap-2 mt-3" data-testid="location-hierarchy-filter" dir={isArabic ? 'rtl' : 'ltr'}>
      <label htmlFor="location-global-search" className="text-[11px] font-bold text-ink-muted">
        {isArabic ? 'ابحث عن محافظة أو منطقة أو قرية' : 'Search governorate, district, or village'}
      </label>
      <div className="relative">
        <input
          id="location-global-search"
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={isArabic ? 'اكتب اسم المكان...' : 'Type a place name...'}
          className="w-full px-3 py-2 rounded-lg border border-border bg-surface text-ink text-xs font-medium focus:outline-none focus:border-accent"
          data-testid="location-global-search"
          aria-label={isArabic ? 'بحث الموقع' : 'Location search'}
          autoComplete="off"
        />
      </div>

      {selected && (
        <div className="flex items-center justify-between gap-2 px-2.5 py-1.5 rounded-lg bg-accent/10 border border-accent/30" data-testid="location-selected">
          <span className="text-xs font-bold text-accent truncate">{displayPath(selected)}</span>
          <button
            type="button"
            onClick={handleClear}
            className="shrink-0 text-[11px] font-bold text-accent hover:underline"
            data-testid="location-clear"
            aria-label={isArabic ? 'مسح الموقع' : 'Clear location'}
          >
            {isArabic ? 'مسح' : 'Clear'}
          </button>
        </div>
      )}

      {!selected && activeNeighborhood && (
        <div className="flex items-center justify-between gap-2 px-2.5 py-1.5 rounded-lg bg-surface border border-border" data-testid="location-active-fallback">
          <span className="text-xs text-ink truncate">{activeNeighborhood}</span>
          <button type="button" onClick={handleClear} className="shrink-0 text-[11px] font-bold text-ink-muted hover:underline" data-testid="location-clear">
            {isArabic ? 'مسح' : 'Clear'}
          </button>
        </div>
      )}

      {results.length > 0 && (
        <ul className="flex flex-col gap-0.5 max-h-48 overflow-y-auto border border-border rounded-lg bg-surface" role="listbox" data-testid="location-results">
          {results.map((item) => (
            <li key={item.id}>
              <button
                type="button"
                role="option"
                onClick={() => handleSelect(item)}
                className="w-full text-start px-2.5 py-1.5 text-xs hover:bg-accent/10 transition-colors flex flex-col gap-0.5"
                data-testid="location-result"
                data-id={item.id}
              >
                <span className="font-bold text-ink">{isArabic ? item.nameAr : item.nameEn}</span>
                <span className="text-[10px] text-ink-muted truncate">{displayPath(item)}</span>
              </button>
            </li>
          ))}
        </ul>
      )}

      {query.trim().length >= 1 && results.length === 0 && (
        <p className="text-[11px] text-ink-muted px-1" data-testid="location-no-results">
          {isArabic ? 'لا توجد نتائج' : 'No results'}
        </p>
      )}
    </div>
  );
};
