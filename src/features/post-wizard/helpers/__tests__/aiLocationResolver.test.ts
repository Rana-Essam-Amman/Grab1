import { describe, it, expect } from 'vitest';
import { resolveAiLocationSlugs } from '../aiLocationResolver';
import { buildNewListingPayload } from '../buildNewListingPayload';
import { buildAppliedDraft } from '../../hooks/useAiPublishFlow.helpers';
import type { PostDraft, UserProfile } from '@/types';

describe('AI Publish Canonical Location Resolver', () => {
  const dummyUser: UserProfile = {
    id: 'u-1',
    firstName: 'Tariq',
    lastName: 'Test',
    email: 'tariq@example.com',
    phone: '0791112233',
    countryCode: 'JO',
  };

  describe('Test Group A — Fresh AI draft', () => {
    it('populates citySlug, districtSlug, and neighborhoodSlug from fresh labels', () => {
      const res = resolveAiLocationSlugs('JO', 'Amman', 'Wadi as Sir');
      expect(res.citySlug).toBe('amman');
      expect(res.neighborhoodSlug).toBe('wadi-as-sir');

      const draft: PostDraft = {
        title: 'Toyota Camry 2022',
        price: '18000',
        description: 'Clean car with full history',
        city: 'Amman',
        neighborhood: 'Wadi as Sir',
        citySlug: res.citySlug,
        districtSlug: res.districtSlug,
        neighborhoodSlug: res.neighborhoodSlug,
        categorySlug: 'motors',
        subcategorySlug: 'cars',
        photos: ['photo1.jpg'],
        site: '',
        noteText: '',
      };

      const payload = buildNewListingPayload({
        postDraft: draft,
        user: dummyUser,
        browseCountryCode: 'JO',
        isAdmin: false,
        activeCurrency: 'JOD',
      });

      expect(payload.newListing.citySlug).toBe('amman');
      expect(payload.newListing.neighborhoodSlug).toBe('wadi-as-sir');
      expect(payload.newListing.city).toBe('Amman');
    });

    it('buildAppliedDraft resolves canonical slugs when browseCountryCode is passed', () => {
      const applied = buildAppliedDraft({
        generated: {
          title: 'MacBook Pro',
          price: '1200',
          description: 'M2 Pro 16GB',
          categorySlug: 'electronics',
          subcategorySlug: 'laptops',
          city: 'Amman',
          missing: [],
        },
        match: {
          chosenCategory: 'electronics',
          chosenSub: 'laptops',
          effectiveCategory: 'electronics',
          effectiveSub: 'laptops',
          mismatch: false,
        },
        raw: 'Selling Macbook Pro',
        photos: ['mac.jpg'],
        isArabic: false,
        browseCityAr: 'عمّان',
        categoryForAI: 'electronics',
        subForAI: 'laptops',
        browseCountryCode: 'JO',
      });

      expect(applied.city).toBe('Amman');
      expect(applied.citySlug).toBe('amman');
    });
  });

  describe('Test Group B — Stale draft protection', () => {
    it('switching city to Zarqa clears previous Amman slugs', () => {
      const initialAmman = resolveAiLocationSlugs('JO', 'Amman', 'Wadi as Sir');
      expect(initialAmman.citySlug).toBe('amman');

      // User changes city to Zarqa with no neighborhood yet
      const switchedZarqa = resolveAiLocationSlugs('JO', 'Zarqa', '');
      expect(switchedZarqa.citySlug).toBe('zarqa');
      expect(switchedZarqa.districtSlug).toBeUndefined();
      expect(switchedZarqa.neighborhoodSlug).toBeUndefined();
    });
  });

  describe('Test Group C — Descendant clearing', () => {
    it('clears district and neighborhood when city changes', () => {
      const res = resolveAiLocationSlugs('SA', 'Riyadh', 'Al-Olaya');
      expect(res.citySlug).toBe('riyadh-region');

      // Now user changes city to Makkah without neighborhood
      const makkahRes = resolveAiLocationSlugs('SA', 'Makkah', '');
      expect(makkahRes.citySlug).toBe('makkah-region');
      expect(makkahRes.districtSlug).toBeUndefined();
      expect(makkahRes.neighborhoodSlug).toBeUndefined();
    });
  });

  describe('Test Group D — Arabic and English parity', () => {
    it.each([
      ['JO', 'Amman', 'عمّان', 'amman'],
      ['SA', 'Riyadh', 'الرياض', 'riyadh-region'],
      ['LB', 'Beirut', 'بيروت', 'beirut'],
      ['PS', 'Jerusalem', 'القدس', 'jerusalem'],
      ['SY', 'Damascus', 'دمشق', 'damascus'],
      ['KW', 'Kuwait City', 'مدينة الكويت', 'al-asimah'],
    ])('resolves %s city (%s vs %s) to same canonical citySlug: %s', (market, enName, arName, expectedSlug) => {
      const enRes = resolveAiLocationSlugs(market, enName);
      const arRes = resolveAiLocationSlugs(market, arName);
      expect(enRes.citySlug).toBe(expectedSlug);
      expect(arRes.citySlug).toBe(expectedSlug);
    });
  });

  describe('Test Group E — Six-market compatibility', () => {
    it('resolves Kuwait 2-level structure without requiring synthetic village level', () => {
      const res = resolveAiLocationSlugs('KW', 'Hawalli', 'Salmiya');
      expect(res.citySlug).toBe('hawalli');
      // In KW, Salmiya is a district
      expect(res.districtSlug).toBe('salmiya');
      expect(res.neighborhoodSlug).toBeUndefined();
    });

    it('resolves Palestine refugee camp under its parent governorate', () => {
      const res = resolveAiLocationSlugs('PS', 'Jenin', 'Jenin Camp');
      expect(res.citySlug).toBe('jenin');
      expect(res.neighborhoodSlug).toBe('jenin-camp');
    });

    it('resolves Syria city and district', () => {
      const res = resolveAiLocationSlugs('SY', 'Damascus', 'Mezzeh');
      expect(res.citySlug).toBe('damascus');
    });

    it('resolves Lebanon caza', () => {
      const res = resolveAiLocationSlugs('LB', 'Beirut', 'Hamra');
      expect(res.citySlug).toBe('beirut');
      expect(res.neighborhoodSlug).toBe('hamra');
    });
  });

  describe('Test Group F — Error handling', () => {
    it('returns empty object for unknown city without inventing slugs', () => {
      const res = resolveAiLocationSlugs('JO', 'UnknownAtlantisCity');
      expect(res.citySlug).toBeUndefined();
      expect(res.districtSlug).toBeUndefined();
      expect(res.neighborhoodSlug).toBeUndefined();
    });

    it('buildNewListingPayload throws controlled error if citySlug is missing', () => {
      const draft: PostDraft = {
        title: 'Phone',
        price: '100',
        description: 'Clean phone',
        city: 'UnknownCity',
        neighborhood: 'SomePlace',
        categorySlug: 'electronics',
        subcategorySlug: 'phones',
        photos: [],
        site: '',
        noteText: '',
      };

      expect(() =>
        buildNewListingPayload({
          postDraft: draft,
          user: dummyUser,
          browseCountryCode: 'JO',
          isAdmin: false,
          activeCurrency: 'JOD',
        })
      ).toThrow('Location slug missing: cannot publish listing without a valid city');
    });
  });

  describe('Test Group G — Traditional Publish Regression', () => {
    it('preserves traditional drafts that already have verified slugs', () => {
      const draft: PostDraft = {
        title: 'Office Desk',
        price: '50',
        description: 'Solid wood table',
        city: 'Amman',
        neighborhood: 'Wadi as Sir',
        citySlug: 'amman',
        districtSlug: 'amman-qasabah',
        neighborhoodSlug: 'wadi-as-sir',
        categorySlug: 'furniture',
        subcategorySlug: 'desks',
        photos: [],
        site: '',
        noteText: '',
      };

      const payload = buildNewListingPayload({
        postDraft: draft,
        user: dummyUser,
        browseCountryCode: 'JO',
        isAdmin: false,
        activeCurrency: 'JOD',
      });

      expect(payload.newListing.citySlug).toBe('amman');
      expect(payload.newListing.districtSlug).toBe('amman-qasabah');
      expect(payload.newListing.neighborhoodSlug).toBe('wadi-as-sir');
    });
  });
});
