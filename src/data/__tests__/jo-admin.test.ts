import { describe, it, expect } from 'vitest';
import { getCountryGeo } from '../locations';
import { JO_ADMIN_AUX } from '../locations/JO.geo';

const DOS_GOVERNORATES = 12;
const DOS_LIWA = 51;
const DOS_QADA = 54;
const SAME_NAME_QADA = 14;
const LOCALITY_COUNT = 1748;

describe('JO administrative hierarchy (DOS 2025)', () => {
  const geo = getCountryGeo('JO');

  it('registers exactly 12 governorates', () => {
    expect(geo).not.toBeNull();
    expect(geo?.governorates.length).toBe(DOS_GOVERNORATES);
  });

  it('has exactly 51 Liwa plus one Unverified district per governorate', () => {
    if (!geo) return;
    const liwa = geo.governorates.flatMap((g) =>
      g.districts.filter((d) => d.nameEn !== 'Unverified'),
    );
    expect(liwa.length).toBe(DOS_LIWA);
    for (const g of geo.governorates) {
      expect(g.districts.some((d) => d.slug === 'unverified')).toBe(true);
    }
  });

  it('stores exactly 54 Qada only in JO_ADMIN_AUX', () => {
    expect(JO_ADMIN_AUX.qada.length).toBe(DOS_QADA);
    expect(JO_ADMIN_AUX.qada.filter((q) => q.sameNameAsLiwa).length).toBe(SAME_NAME_QADA);
  });

  it('every Qada references a real Liwa under the correct governorate', () => {
    if (!geo) return;
    for (const q of JO_ADMIN_AUX.qada) {
      const gov = geo.governorates.find((g) => g.slug === q.governorateSlug);
      expect(gov, q.slug).toBeDefined();
      const liwa = gov?.districts.find((d) => d.slug === q.liwaSlug);
      expect(liwa, `${q.slug} -> ${q.liwaSlug}`).toBeDefined();
      expect(liwa?.nameEn).not.toBe('Unverified');
    }
  });

  it('no non-same-name Qada appears as a peer District, and every Village is a locality', () => {
    if (!geo) return;
    const districtNames = new Set(
      geo.governorates.flatMap((g) => g.districts.map((d) => d.nameEn)),
    );
    for (const q of JO_ADMIN_AUX.qada) {
      if (!q.sameNameAsLiwa) {
        expect(districtNames.has(q.nameEn), q.nameEn).toBe(false);
      }
    }
    const linked = new Set(
      JO_ADMIN_AUX.localityLinks.map((l) => `${l.governorateSlug}/${l.localitySlug}`),
    );
    for (const g of geo.governorates) {
      for (const d of g.districts) {
        for (const v of d.villages) {
          expect(linked.has(`${g.slug}/${v.slug}`), v.slug).toBe(true);
        }
      }
    }
  });

  it('places Kufranjah under Ajlun', () => {
    if (!geo) return;
    const ajlun = geo.governorates.find((g) => g.slug === 'ajloun');
    expect(ajlun?.districts.some((d) => d.slug === 'kufranjah')).toBe(true);
    const balqa = geo.governorates.find((g) => g.slug === 'balqa');
    expect(balqa?.districts.some((d) => d.slug === 'kufranjah')).toBe(false);
  });

  it('preserves 1748 localities with unique link keys and geonameids', () => {
    if (!geo) return;
    const villages = geo.governorates.flatMap((g) => g.districts.flatMap((d) => d.villages));
    expect(villages.length).toBe(LOCALITY_COUNT);
    expect(JO_ADMIN_AUX.localityLinks.length).toBe(LOCALITY_COUNT);

    const keys = JO_ADMIN_AUX.localityLinks.map((l) => l.linkKey);
    const ids = JO_ADMIN_AUX.localityLinks.map((l) => l.geonameid);
    expect(new Set(keys).size).toBe(LOCALITY_COUNT);
    expect(new Set(ids).size).toBe(LOCALITY_COUNT);
    for (const l of JO_ADMIN_AUX.localityLinks) {
      expect(l.linkKey).toBe(`${l.governorateSlug}/${l.geonameid}`);
      expect(l.parentStatus === 'source-association' || l.parentStatus === 'unknown').toBe(true);
    }
  });

  it('every locality link resolves to exactly one existing Village', () => {
    if (!geo) return;
    for (const l of JO_ADMIN_AUX.localityLinks) {
      const gov = geo.governorates.find((g) => g.slug === l.governorateSlug);
      expect(gov, l.linkKey).toBeDefined();
      const matches = gov?.districts.flatMap((d) => d.villages).filter((v) => v.slug === l.localitySlug) ?? [];
      expect(matches.length, l.linkKey).toBe(1);
      if (l.liwaSlug) {
        const liwa = gov?.districts.find((d) => d.slug === l.liwaSlug);
        expect(liwa?.villages.some((v) => v.slug === l.localitySlug)).toBe(true);
      }
    }
  });

  it('every locality link with a qadaSlug resolves to exactly one matching Qada and its parent Liwa', () => {
    if (!geo) return;
    const withQada = JO_ADMIN_AUX.localityLinks.filter((l) => l.qadaSlug !== null);
    expect(withQada.length).toBeGreaterThan(0);
    for (const l of withQada) {
      const matches = JO_ADMIN_AUX.qada.filter(
        (q) => q.governorateSlug === l.governorateSlug && q.slug === l.qadaSlug,
      );
      expect(matches.length, l.linkKey).toBe(1);
      const q = matches[0];
      expect(q.governorateSlug).toBe(l.governorateSlug);
      expect(q.liwaSlug).toBe(l.liwaSlug);
      const gov = geo.governorates.find((g) => g.slug === l.governorateSlug);
      const liwa = gov?.districts.find((d) => d.slug === l.liwaSlug);
      expect(liwa, l.linkKey).toBeDefined();
      expect(liwa?.nameEn).not.toBe('Unverified');
    }
  });
});
