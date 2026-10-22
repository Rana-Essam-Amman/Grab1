import React, { useState, useMemo } from 'react';
import { getAllGovernorates, getAllDistricts, getAllCamps } from '@/data/locations/registry';

interface Props {
  readonly countryCode: string;
  readonly isArabic: boolean;
  readonly activeNeighborhood: string | null;
  readonly onSelect: (nameAr: string | null) => void;
}

const filterItems = <T extends { nameAr: string; nameEn: string }>(items: readonly T[], term: string) => {
  const q = term.trim().toLowerCase();
  if (!q) return items;
  return items.filter((i) => i.nameAr.includes(term.trim()) || i.nameEn.toLowerCase().includes(q));
};

const chipStyle = (isActive: boolean) =>
  `px-2.5 py-1 rounded-full border text-[11px] font-bold transition-all cursor-pointer ${
    isActive ? 'bg-accent/15 border-accent text-accent' : 'bg-surface border-border text-ink hover:border-ink-muted'
  }`;

export const LocationHierarchyFilter: React.FC<Props> = ({ countryCode, isArabic, activeNeighborhood, onSelect }) => {
  const [textFilter, setTextFilter] = useState('');
  const [selectedGov, setSelectedGov] = useState<string | null>(null);
  const [selectedDist, setSelectedDist] = useState<string | null>(null);

  const governorates = useMemo(() => getAllGovernorates(countryCode), [countryCode]);
  const districts = useMemo(() => (selectedGov ? getAllDistricts(countryCode, selectedGov) : []), [countryCode, selectedGov]);
  const villages = useMemo(() => (selectedGov && selectedDist ? districts.find((d) => d.slug === selectedDist)?.villages ?? [] : []), [selectedGov, selectedDist, districts]);
  const camps = useMemo(() => getAllCamps(countryCode), [countryCode]);

  const filteredGovs = useMemo(() => filterItems(governorates, textFilter), [governorates, textFilter]);
  const filteredDistricts = useMemo(() => filterItems(districts, textFilter), [districts, textFilter]);
  const filteredVillages = useMemo(() => filterItems(villages, textFilter), [villages, textFilter]);
  const filteredCamps = useMemo(() => filterItems(camps, textFilter), [camps, textFilter]);

  return (
    <div className="flex flex-col gap-3 mt-3" data-testid="location-hierarchy-filter">
      <input
        type="text"
        value={textFilter}
        onChange={(e) => setTextFilter(e.target.value)}
        placeholder={isArabic ? 'ابحث عن محافظة أو لواء أو قرية...' : 'Search governorate, district, village...'}
        className="w-full h-9 px-3 rounded-lg border border-border bg-surface text-ink text-xs font-medium focus:outline-none focus:border-accent"
        data-testid="geo-hierarchy-search"
      />

      {filteredGovs.length > 0 && (
        <div className="flex flex-col gap-1.5">
          <span className="text-[11px] font-bold text-ink-muted">{isArabic ? 'المحافظة' : 'Governorate'}</span>
          <div className="flex flex-wrap gap-1.5">
            {filteredGovs.map((g) => (
              <button
                key={g.slug}
                type="button"
                onClick={() => {
                  const next = selectedGov === g.slug ? null : g.slug;
                  setSelectedGov(next); setSelectedDist(null); onSelect(next ? g.nameAr : null);
                }}
                className={chipStyle(activeNeighborhood === g.nameAr || selectedGov === g.slug)}
              >
                {isArabic ? g.nameAr : g.nameEn}
              </button>
            ))}
          </div>
        </div>
      )}

      {selectedGov && filteredDistricts.length > 0 && (
        <div className="flex flex-col gap-1.5">
          <span className="text-[11px] font-bold text-ink-muted">{isArabic ? 'الألواء / الأقضية' : 'Districts'}</span>
          <div className="flex flex-wrap gap-1.5">
            {filteredDistricts.map((d) => (
              <button
                key={d.slug}
                type="button"
                onClick={() => {
                  const next = selectedDist === d.slug ? null : d.slug;
                  setSelectedDist(next); onSelect(next ? d.nameAr : null);
                }}
                className={chipStyle(activeNeighborhood === d.nameAr || selectedDist === d.slug)}
              >
                {isArabic ? d.nameAr : d.nameEn}
              </button>
            ))}
          </div>
        </div>
      )}

      {selectedDist && filteredVillages.length > 0 && (
        <div className="flex flex-col gap-1.5">
          <span className="text-[11px] font-bold text-ink-muted">{isArabic ? 'القرى / المناطق' : 'Villages'}</span>
          <div className="flex flex-wrap gap-1.5">
            {filteredVillages.map((v) => (
              <button key={v.slug} type="button" onClick={() => onSelect(activeNeighborhood === v.nameAr ? null : v.nameAr)} className={chipStyle(activeNeighborhood === v.nameAr)}>
                {isArabic ? v.nameAr : v.nameEn}
              </button>
            ))}
          </div>
        </div>
      )}

      {filteredCamps.length > 0 && (
        <div className="flex flex-col gap-1.5">
          <span className="text-[11px] font-bold text-ink-muted">{isArabic ? 'مخيمات' : 'Refugee Camps'}</span>
          <div className="flex flex-wrap gap-1.5">
            {filteredCamps.map((c) => (
              <button key={c.slug} type="button" onClick={() => onSelect(activeNeighborhood === c.nameAr ? null : c.nameAr)} className={chipStyle(activeNeighborhood === c.nameAr)}>
                {isArabic ? c.nameAr : c.nameEn}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
