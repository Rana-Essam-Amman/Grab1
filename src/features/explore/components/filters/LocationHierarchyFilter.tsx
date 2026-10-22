import React, { useState, useMemo } from 'react';
import { getAllGovernorates, getAllCamps } from '@/data/locations/registry';

interface Props {
  readonly countryCode: string;
  readonly isArabic: boolean;
  readonly selectedGovernorate: string | null;
  readonly selectedCity: string | null;
  readonly selectedCamp: string | null;
  readonly onGovernorateChange: (slug: string | null) => void;
  readonly onCityChange: (name: string | null) => void;
  readonly onCampChange: (slug: string | null) => void;
}

export const LocationHierarchyFilter: React.FC<Props> = ({
  countryCode,
  isArabic,
  selectedGovernorate,
  selectedCity,
  selectedCamp,
  onGovernorateChange,
  onCityChange,
  onCampChange,
}) => {
  const [textFilter, setTextFilter] = useState('');
  const governorates = useMemo(() => getAllGovernorates(countryCode), [countryCode]);
  const camps = useMemo(() => getAllCamps(countryCode), [countryCode]);

  const q = textFilter.trim().toLowerCase();
  const filteredGovernorates = useMemo(() => q ? governorates.filter((g) => g.nameAr.includes(textFilter) || g.nameEn.toLowerCase().includes(q)) : governorates, [governorates, textFilter, q]);

  const filteredCamps = useMemo(() => q ? camps.filter((c) => c.nameAr.includes(textFilter) || c.nameEn.toLowerCase().includes(q)) : camps, [camps, textFilter, q]);

  return (
    <div className="flex flex-col gap-3" data-testid="location-hierarchy-filter">
      <input
        type="text"
        value={textFilter}
        onChange={(e) => setTextFilter(e.target.value)}
        placeholder={isArabic ? 'ابحث عن محافظة أو مخيم...' : 'Search governorate or camp...'}
        className="w-full h-9 px-3 rounded-lg border border-border bg-surface text-ink text-xs font-medium focus:outline-none focus:border-accent"
        data-testid="geo-hierarchy-search"
      />

      <div className="flex flex-col gap-1.5">
        <span className="text-[11px] font-bold text-ink-muted">
          {isArabic ? 'المحافظة' : 'Governorate'}
        </span>
        <div className="flex flex-wrap gap-1.5">
          {filteredGovernorates.map((g) => {
            const isActive = selectedGovernorate === g.slug;
            return (
              <button
                key={g.slug}
                type="button"
                onClick={() => {
                  onGovernorateChange(isActive ? null : g.slug);
                  onCityChange(isActive ? null : g.nameEn);
                }}
                className={`px-2.5 py-1 rounded-full border text-[11px] font-bold transition-all ${
                  isActive
                    ? 'bg-accent/15 border-accent text-accent'
                    : 'bg-surface border-border text-ink'
                }`}
              >
                {isArabic ? g.nameAr : g.nameEn}
              </button>
            );
          })}
          {filteredGovernorates.length === 0 && (
            <span className="text-[11px] text-ink-muted">
              {isArabic ? 'لا نتائج' : 'No results'}
            </span>
          )}
        </div>
      </div>

      {filteredCamps.length > 0 && (
        <div className="flex flex-col gap-1.5">
          <span className="text-[11px] font-bold text-ink-muted">
            {isArabic ? 'مخيمات' : 'Refugee Camps'}
          </span>
          <div className="flex flex-wrap gap-1.5">
            {filteredCamps.map((c) => {
              const isActive = selectedCamp === c.slug;
              return (
                <button
                  key={c.slug}
                  type="button"
                  onClick={() => {
                    onCampChange(isActive ? null : c.slug);
                    onCityChange(isActive ? null : c.nameEn);
                  }}
                  className={`px-2.5 py-1 rounded-full border text-[11px] font-bold transition-all ${
                    isActive
                      ? 'bg-accent/15 border-accent text-accent'
                      : 'bg-surface border-border text-ink'
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
