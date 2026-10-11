import { describe, expect, it } from 'vitest';
import { matchSearch, scoreListing } from '../listingSearch';
import {
  EVALUATION_CASES,
  EVALUATION_LISTINGS,
  type EvaluationCase,
  type EvaluationListing,
} from './listingSearch.evaluation.fixtures';

/**
 * Client-side helper evaluation and Phase 2A regressions.
 *
 * These tests exercise scoreListing / matchSearch in listingSearch.ts.
 * They do NOT call Supabase and do NOT prove PostgreSQL RPC behavior.
 */

function inMarket(
  listing: EvaluationListing,
  market?: EvaluationListing['countryCode'],
): boolean {
  return market === undefined || listing.countryCode === market;
}

function matchesFor(
  query: string,
  market?: EvaluationListing['countryCode'],
): EvaluationListing[] {
  return EVALUATION_LISTINGS.filter(
    (listing) => inMarket(listing, market) && matchSearch(listing, query),
  );
}

function ids(listings: readonly EvaluationListing[]): string[] {
  return listings.map((listing) => listing.id).sort();
}

describe('listingSearch client-side evaluation', () => {
  it('records a stable fixture set', () => {
    expect(EVALUATION_LISTINGS.length).toBe(10);
    expect(EVALUATION_CASES.length).toBe(19);

    const unique = new Set(EVALUATION_LISTINGS.map((listing) => listing.id));
    expect(unique.size).toBe(EVALUATION_LISTINGS.length);
  });

  describe('supported matches', () => {
    it('exact English Toyota matches the English Camry listing', () => {
      const hits = matchesFor('Toyota', 'JO');

      expect(ids(hits)).toEqual(
        expect.arrayContaining(['jo-toyota-camry-2018', 'jo-punctuation']),
      );
      expect(ids(hits)).not.toContain('sa-kia-cerato');
    });

    it('Arabic تويوتا matches the Arabic Camry listing and the Latin Toyota listing via phonetic fallback', () => {
      const hits = matchesFor('تويوتا', 'JO');

      expect(ids(hits)).toContain('jo-toyota-camry-ar');
      expect(ids(hits)).toContain('jo-toyota-camry-2018');
    });

    it('Arabic كيا matches both Arabic and English Kia listings', () => {
      const hits = matchesFor('كيا', 'SA');

      expect(ids(hits)).toContain('sa-kia-ar');
      expect(ids(hits)).toContain('sa-kia-cerato');
      expect(ids(hits)).not.toContain('jo-toyota-camry-2018');
    });

    it('English Kia matches both Arabic and English Kia listings', () => {
      const hits = matchesFor('Kia', 'SA');

      expect(ids(hits)).toContain('sa-kia-ar');
      expect(ids(hits)).toContain('sa-kia-cerato');
      expect(ids(hits)).not.toContain('jo-toyota-camry-2018');
    });

    it('English Camry and Arabic كامري match their respective listings', () => {
      expect(ids(matchesFor('Camry', 'JO'))).toEqual(
        expect.arrayContaining(['jo-toyota-camry-2018', 'jo-punctuation']),
      );

      expect(ids(matchesFor('كامري', 'JO'))).toContain(
        'jo-toyota-camry-ar',
      );
    });

    it('prefix, middle, and suffix fragments of Toyota match via includes()', () => {
      expect(ids(matchesFor('toy', 'JO'))).toContain(
        'jo-toyota-camry-2018',
      );
      expect(ids(matchesFor('yot', 'JO'))).toContain(
        'jo-toyota-camry-2018',
      );
      expect(ids(matchesFor('ota', 'JO'))).toContain(
        'jo-toyota-camry-2018',
      );
    });

    it('numeric year fragment 2018 matches both Camry listings in JO', () => {
      const hits = ids(matchesFor('2018', 'JO'));

      expect(hits).toEqual(
        expect.arrayContaining([
          'jo-toyota-camry-2018',
          'jo-toyota-camry-ar',
        ]),
      );
    });

    it('whitespace around a real query is trimmed before matching', () => {
      expect(ids(matchesFor('  Camry  ', 'JO'))).toEqual(
        expect.arrayContaining(['jo-toyota-camry-2018', 'jo-punctuation']),
      );
    });

    it('multi-term Toyota Camry ranks the full match above an unrelated listing', () => {
      const full = scoreListing(
        EVALUATION_LISTINGS.find(
          (listing) => listing.id === 'jo-toyota-camry-2018',
        )!,
        'Toyota Camry',
      );

      const unrelated = scoreListing(
        EVALUATION_LISTINGS.find(
          (listing) => listing.id === 'jo-samsung-tv',
        )!,
        'Toyota Camry',
      );

      expect(full).toBeGreaterThan(0);
      expect(unrelated).toBe(0);
      expect(full).toBeGreaterThan(unrelated);
    });

    it('market filter excludes the other market when applied by the caller', () => {
      const hits = matchesFor('Kia', 'JO');

      expect(ids(hits)).not.toContain('sa-kia-cerato');
      expect(ids(hits)).not.toContain('sa-kia-ar');
    });
  });

  describe('Phase 2A short-query and empty-query regressions', () => {
    it('"Sam" matches Samsung (prefix) and the exact "Sam" token, not unrelated listings', () => {
      const hits = ids(matchesFor('Sam', 'JO'));

      expect(hits).toEqual(
        expect.arrayContaining(['jo-samsung-tv', 'jo-sam-the-seller']),
      );
      expect(hits).not.toContain('jo-toyota-camry-2018');
      expect(hits).not.toContain('lb-unrelated');
    });

    it('"sam" and "samsung" match the Samsung listing', () => {
      expect(ids(matchesFor('sam', 'JO'))).toContain('jo-samsung-tv');
      expect(ids(matchesFor('samsung', 'JO'))).toContain('jo-samsung-tv');
      expect(ids(matchesFor('samsung', 'JO'))).not.toContain(
        'jo-sam-the-seller',
      );
    });

    it('one-character query "s" matches nothing', () => {
      expect(matchesFor('s', 'JO')).toEqual([]);
      expect(scoreListing(EVALUATION_LISTINGS[0], 's')).toBe(0);
    });

    it('two-character query "sa" matches nothing', () => {
      expect(matchesFor('sa', 'JO')).toEqual([]);
      expect(scoreListing(EVALUATION_LISTINGS[0], 'sa')).toBe(0);
    });

    it('empty string scores 0 and is not a match', () => {
      for (const listing of EVALUATION_LISTINGS) {
        expect(scoreListing(listing, '')).toBe(0);
        expect(matchSearch(listing, '')).toBe(false);
      }
    });

    it('whitespace-only query scores 0 and is not a match', () => {
      for (const listing of EVALUATION_LISTINGS) {
        expect(scoreListing(listing, '   ')).toBe(0);
        expect(matchSearch(listing, '   ')).toBe(false);
      }
    });

    it('normalized-empty input (stop words only) is not a match', () => {
      for (const listing of EVALUATION_LISTINGS) {
        expect(scoreListing(listing, 'the and')).toBe(0);
        expect(matchSearch(listing, 'the and')).toBe(false);
      }
    });
  });

  describe('eligibility is not a client-helper responsibility', () => {
    it('scoreListing does not filter pending listings; callers and the server own eligibility', () => {
      const draft = EVALUATION_LISTINGS.find(
        (listing) => listing.id === 'jo-draft-toyota',
      )!;

      expect(draft.status).toBe('pending');
      expect(matchSearch(draft, 'Toyota')).toBe(true);
    });
  });

  describe('cross-script', () => {
    it('Toyota ↔ تويوتا is bridged by phoneticKey, not by the synonym table', () => {
      const enHits = ids(matchesFor('Toyota', 'JO'));
      const arHits = ids(matchesFor('تويوتا', 'JO'));

      expect(enHits).toContain('jo-toyota-camry-2018');
      expect(enHits).toContain('jo-toyota-camry-ar');
      expect(arHits).toContain('jo-toyota-camry-ar');
      expect(arHits).toContain('jo-toyota-camry-2018');
    });

    it('Arabic car synonym matches without requiring every synonym', () => {
      const arabicListing = EVALUATION_LISTINGS.find(
        (listing) => listing.id === 'jo-toyota-camry-ar',
      )!;

      const englishListing = EVALUATION_LISTINGS.find(
        (listing) => listing.id === 'jo-toyota-camry-2018',
      )!;

      expect(matchSearch(arabicListing, 'سيارة')).toBe(true);
      expect(matchSearch(englishListing, 'car')).toBe(true);
    });

    it('all original query words are still required', () => {
      const listing = EVALUATION_LISTINGS.find(
        (item) => item.id === 'jo-toyota-camry-2018',
      )!;

      expect(matchSearch(listing, 'Toyota Camry')).toBe(true);
      expect(matchSearch(listing, 'Toyota Samsung')).toBe(false);
    });
  });

  describe('evaluation dataset coverage', () => {
    it('every case has a rationale and a scenario label', () => {
      for (const evaluationCase of EVALUATION_CASES) {
        expect(evaluationCase.scenario.length).toBeGreaterThan(0);
        expect(evaluationCase.rationale.length).toBeGreaterThan(0);
        expect(evaluationCase.expectedRelevantIds).toBeDefined();
        expect(evaluationCase.expectedExcludedIds).toBeDefined();
      }
    });

    it('only eligibility remains a known client-helper non-responsibility', () => {
      const gaps = EVALUATION_CASES
        .filter((evaluationCase) => evaluationCase.knownClientGap)
        .map((evaluationCase) => evaluationCase.id);

      expect(gaps).toEqual(['eligibility-draft']);
    });
  });
});

export type { EvaluationCase };
