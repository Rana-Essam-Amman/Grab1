import { describe, it, expect } from 'vitest';
import { gpsVisibleChild } from '../gpsVisibleSelection';

const base = {
  districtAr: null,
  districtEn: null,
  neighborhoodAr: null,
  neighborhoodEn: null,
};

describe('gpsVisibleChild', () => {
  it.each([
    ['JO', 'طبربور', 'Tabarbour', 'قصبة عمان', 'Amman Qasabah', 'طبربور — قصبة عمان', 'Tabarbour — Amman Qasabah'],
    ['SA', 'العليا', 'Al Olaya', 'الرياض', 'Riyadh', 'العليا — الرياض', 'Al Olaya — Riyadh'],
    ['PS', 'جنين', 'Jenin Locality', 'جنين', 'Jenin District', 'جنين — جنين', 'Jenin Locality — Jenin District'],
    ['LB', 'الأشرفية', 'Achrafieh', 'بيروت', 'Beirut', 'الأشرفية — بيروت', 'Achrafieh — Beirut'],
    ['SY', 'الميدان', 'Al Midan', 'دمشق', 'Damascus', 'الميدان — دمشق', 'Al Midan — Damascus'],
  ])('%s shows locality then area in both languages', (market, nAr, nEn, dAr, dEn, expectedAr, expectedEn) => {
    const location = { ...base, districtAr: dAr, districtEn: dEn, neighborhoodAr: nAr, neighborhoodEn: nEn };
    expect(gpsVisibleChild(market, location, true)).toBe(expectedAr);
    expect(gpsVisibleChild(market, location, false)).toBe(expectedEn);
  });

  it('Kuwait stays two-level and ignores a third-level name', () => {
    const location = {
      ...base,
      districtAr: 'مدينة الكويت',
      districtEn: 'Kuwait City',
      neighborhoodAr: 'لا يظهر',
      neighborhoodEn: 'Should Not Render',
    };
    expect(gpsVisibleChild('KW', location, true)).toBe('مدينة الكويت');
    expect(gpsVisibleChild('KW', location, false)).toBe('Kuwait City');
  });

  it('does not fabricate a missing optional level', () => {
    expect(gpsVisibleChild('JO', { ...base, districtAr: 'قصبة عمان', districtEn: 'Amman Qasabah' }, false)).toBe('Amman Qasabah');
    expect(gpsVisibleChild('JO', { ...base, neighborhoodAr: 'طبربور', neighborhoodEn: 'Tabarbour' }, true)).toBe('طبربور');
    expect(gpsVisibleChild('JO', base, false)).toBe('');
    expect(gpsVisibleChild('XX', { ...base, districtEn: 'Anywhere' }, false)).toBe('');
  });
});
