import React, { useState, useMemo } from 'react';
import { getAllGovernorates, getAllCamps } from '@/data/locations/registry';

interface Props {
  readonly countryCode: string;
  readonly isArabic: boolean;
  readonly activeNeighborhood: string | null;
  readonly onSelect: (nameAr: string | null) => void;
}

export const LocationHierarchyFilter: React.FC<Props> = ({
  countryCode,
  isArabic,
  activeNeighborhood,
  onSelect,
}) => {
  const [textFilter, setTextFilter] = useState('');
  const governorates = useMemo(() => getAllGovernorates(countryCode), [countryCode]);
  const camps = useMemo(() => getAllCamps(countryCode), [countryCode]);

  const filteredGovernorates = useMemo(
    () =>
      textFilter.trim()
        ? governorates.filter(
            (g) =>
              g.nameAr.includes(textFilter) ||
              g.nameEn.toLowerCase().includes(textFilter.toLowerCase()),
          )
        : governorates,
    [governorates, textFilter],
  );

  const filteredCamps = useMemo(
    () =>
      textFilter.trim()
        ? camps.filter(
            (c) =>
              c.nameAr.includes(textFilter) ||
              c.nameEn.toLowerCase().includes(textFilter.toLowerCase()),
          )
        : camps,
    [camps, textFilter],
  );

  return (
    <div className="flex flex-col gap-3 mt-3" data-testid="location-hierarchy-filter">
      <input
        type="text"
        value={textFilter}
        onChange={(e) => setTextFilter(e.target.value)}
        placeholder={isArabic ? 'ابحث عن محافظة أو مخيم...' : 'Search governorate or camp...'}
        className="w-full h-9 px-3 rounded-lg border border-border bg-surface text-ink text-xs font-medium focus:outline-none focus:border-accent"
        data-testid="geo-hierarchy-search"
      />

      {filteredGovernorates.length > 0 && (
        <div className="flex flex-col gap-1.5">
          <span className="text-[11px] font-bold text-ink-muted">
            {isArabic ? 'المحافظة' : 'Governorate'}
          </span>
          <div className="flex flex-wrap gap-1.5">
            {filteredGovernorates.map((g) => {
              const isActive = activeNeighborhood === g.nameAr;
              return (
                <button
                  key={g.slug}
                  type="button"
                  onClick={() => onSelect(isActive ? null : g.nameAr)}
                  className={`px-2.5 py-1 rounded-full border text-[11px] font-bold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-accent/15 border-accent text-accent'
                      : 'bg-surface border-border text-ink hover:border-ink-muted'
                  }`}
                >
                  {isArabic ? g.nameAr : g.nameEn}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {filteredCamps.length > 0 && (
        <div className="flex flex-col gap-1.5">
          <span className="text-[11px] font-bold text-ink-muted">
            {isArabic ? 'مخيمات' : 'Refugee Camps'}
          </span>
          <div className="flex flex-wrap gap-1.5">
            {filteredCamps.map((c) => {
              const isActive = activeNeighborhood === c.nameAr;
              return (
                <button
                  key={c.slug}
                  type="button"
                  onClick={() => onSelect(isActive ? null : c.nameAr)}
                  className={`px-2.5 py-1 rounded-full border text-[11px] font-bold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-accent/15 border-accent text-accent'
                      : 'bg-surface border-border text-ink hover:border-ink-muted'
                  }`}
                >
                  {isArabic ? c.nameAr : c.nameEn}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
