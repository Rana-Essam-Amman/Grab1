import React, { useState, useMemo } from 'react';
import { CloseCircle, SearchNormal1 } from 'iconsax-react';
import { searchJordanLocations, JordanLocationSearchResult } from '../helpers/jordanLocationIndex';

interface Props {
  readonly isArabic: boolean;
  readonly selectedCity: string;
  readonly selectedNeighborhood: string;
  readonly onSelect: (res: JordanLocationSearchResult) => void;
  readonly onClear: () => void;
}

export const JordanLocationPicker: React.FC<Props> = ({
  isArabic,
  selectedCity,
  selectedNeighborhood,
  onSelect,
  onClear,
}) => {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const results = useMemo(() => searchJordanLocations(query, isArabic), [query, isArabic]);

  const hasSelection = Boolean(selectedCity || selectedNeighborhood);
  const displayText = selectedNeighborhood
    ? `${selectedNeighborhood} (${selectedCity})`
    : selectedCity;

  return (
    <div className="flex flex-col gap-2" data-testid="jordan-location-picker">
      <label className="block text-xs font-bold text-ink">
        {isArabic ? 'الموقع (المدينة، اللواء، أو الحي)' : 'Location (City, District, or Area)'}
      </label>

      {hasSelection && !isFocused ? (
        <div
          data-testid="jordan-selected-pill"
          className="flex items-center justify-between p-3 rounded-xl border border-primary/30 bg-primary/5 text-ink text-sm font-bold"
        >
          <span className="truncate">{displayText}</span>
          <button
            type="button"
            onClick={onClear}
            className="p-1 text-ink-muted hover:text-danger cursor-pointer"
            aria-label={isArabic ? 'مسح الموقع' : 'Clear location'}
          >
            <CloseCircle size={18} variant="Bold" />
          </button>
        </div>
      ) : (
        <div className="relative">
          <div className="relative flex items-center">
            <SearchNormal1 size={16} className="absolute left-3 text-ink-muted pointer-events-none" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => setIsFocused(true)}
              placeholder={
                isArabic
                  ? 'اكتب اسم المنطقة أو الحي (مثال: طبربور، خلدا، عبدون...)'
                  : 'Search area or neighborhood (e.g., Abdoun, Khalda...)'
              }
              className="w-full h-11 pl-9 pr-3 rounded-xl border border-border bg-surface text-sm font-medium text-ink focus:outline-none focus:border-primary"
              data-testid="jordan-location-search-input"
            />
          </div>

          {query.trim().length > 0 && (
            <div
              className="absolute top-12 left-0 right-0 z-30 max-h-64 overflow-y-auto rounded-xl border border-border bg-surface shadow-xl flex flex-col divide-y divide-border/50"
              data-testid="jordan-location-results"
            >
              {results.length === 0 ? (
                <div className="p-3 text-center text-xs text-ink-muted">
                  {isArabic ? 'لا توجد نتائج مطابقة' : 'No matching locations found'}
                </div>
              ) : (
                results.map((item) => {
                  const label = isArabic ? item.nameAr : item.nameEn;
                  const parent = isArabic ? item.parentPathAr : item.parentPathEn;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => {
                        onSelect(item);
                        setQuery('');
                        setIsFocused(false);
                      }}
                      className="flex flex-col items-start p-2.5 hover:bg-canvas text-start cursor-pointer transition-colors"
                      data-testid={`jordan-loc-item-${item.id}`}
                    >
                      <span className="text-sm font-bold text-ink">{label}</span>
                      <span className="text-[11px] text-ink-muted">{parent}</span>
                    </button>
                  );
                })
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
