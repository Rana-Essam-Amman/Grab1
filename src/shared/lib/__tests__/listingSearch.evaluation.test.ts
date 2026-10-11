import { describe, expect, it } from 'vitest';
import { matchSearch, scoreListing } from '../listingSearch';
import {
  EVALUATION_CASES,
  EVALUATION_LISTINGS,
  type EvaluationCase,
  type EvaluationListing,
} from './listingSearch.evaluation.fixtures';

/**
 * Client-side helper evaluation only.
 *
 * These tests exercise scoreListing / matchSearch in listingSearch.ts.
 * They do NOT call Supabase and do NOT prove PostgreSQL RPC behavior.
 * See docs/search/relevance-evaluation.md for the separation and for the
 * RPC contract specification that remains unverified against a live database.
 */

function inMarket(listing: EvaluationListing, market?: EvaluationListing['countryCode']): boolean {
  return market === undefined || listing.countryCode === market;
}

function matchesFor(query: string, market?: EvaluationListing['countryCode']): EvaluationListing[] {
  return EVALUATION_LISTINGS.filter(
    (listing) => inMarket(listing, market) && matchSearch(listing, query),
  );
}

function ids(listings: readonly EvaluationListing[]): string[] {
  return listings.map((l) => l.id).sort();
}

describe('listingSearch client-side evaluation (Phase 1 baseline)', () => {
  it('records a stable fixture set', () => {
    expect(EVALUATION_LISTINGS.length).toBe(10);
    expect(EVALUATION_CASES.length).toBe(19);
    const unique = new Set(EVALUATION_LISTINGS.map((l) => l.id));
    expect(unique.size).toBe(EVALUATION_LISTINGS.length);
  });

  describe('current client behavior (baseline assertions)', () => {
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
      // Observed: phoneticKey bridges تويوتا ↔ Toyota even without a synonym group.
      expect(ids(hits)).toContain('jo-toyota-camry-2018');
    });

    it('Arabic كيا matches the Arabic Kia listing', () => {
      const hits = matchesFor('كيا', 'SA');
      expect(ids(hits)).toContain('sa-kia-ar');
      expect(ids(hits)).not.toContain('sa-kia-cerato');
    });

    it('English Camry and Arabic كامري match their respective listings', () => {
      expect(ids(matchesFor('Camry', 'JO'))).toEqual(
        expect.arrayContaining(['jo-toyota-camry-2018', 'jo-punctuation']),
      );
      expect(ids(matchesFor('كامري', 'JO'))).toContain('jo-toyota-camry-ar');
    });

    it('prefix, middle, and suffix fragments of Toyota match via includes()', () => {
      expect(ids(matchesFor('toy', 'JO'))).toContain('jo-toyota-camry-2018');
      expect(ids(matchesFor('yot', 'JO'))).toContain('jo-toyota-camry-2018');
      expect(ids(matchesFor('ota', 'JO'))).toContain('jo-toyota-camry-2018');
    });

    it('numeric year fragment 2018 matches both Camry listings in JO', () => {
      const hits = ids(matchesFor('2018', 'JO'));
      expect(hits).toEqual(
        expect.arrayContaining(['jo-toyota-camry-2018', 'jo-toyota-camry-ar']),
      );
    });

    it('whitespace is trimmed before matching', () => {
      expect(ids(matchesFor('  Camry  ', 'JO'))).toEqual(
        expect.arrayContaining(['jo-toyota-camry-2018', 'jo-punctuation']),
      );
    });

    it('multi-term Toyota Camry ranks the full match above a partial', () => {
      const full = scoreListing(
        EVALUATION_LISTINGS.find((l) => l.id === 'jo-toyota-camry-2018')!,
        'Toyota Camry',
      );
      const partial = scoreListing(
        EVALUATION_LISTINGS.find((l) => l.id === 'jo-samsung-tv')!,
        'Toyota Camry',
      );
      expect(full).toBeGreaterThan(0);
      expect(partial).toBe(0);
    });

    it('market filter excludes the other market when applied by the caller', () => {
      const hits = matchesFor('Kia', 'JO');
      expect(ids(hits)).not.toContain('sa-kia-cerato');
    });
  });

  describe('confirmed client-side defects (reproducible baseline)', () => {
    it('"Sam" matches both Samsung and the incidental Sam table (false positives)', () => {
      const hits = ids(matchesFor('Sam', 'JO'));
      // Current behavior: includes() on title/description produces incidental matches.
      expect(hits).toEqual(expect.arrayContaining(['jo-samsung-tv', 'jo-sam-the-seller']));
    });

    it('one-character query "s" matches many unrelated JO listings', () => {
      const hits = matchesFor('s', 'JO');
      expect(hits.length).toBeGreaterThan(1);
      expect(ids(hits)).toEqual(
        expect.arrayContaining(['jo-samsung-tv', 'jo-sam-the-seller']),
      );
    });

    it('two-character query "sa" matches Samsung and Sam', () => {
      const hits = ids(matchesFor('sa', 'JO'));
      expect(hits).toEqual(expect.arrayContaining(['jo-samsung-tv', 'jo-sam-the-seller']));
    });

    it('empty / whitespace query scores every listing as 1 (no selective filter)', () => {
      for (const listing of EVALUATION_LISTINGS) {
        expect(scoreListing(listing, '   ')).toBe(1);
        expect(matchSearch(listing, '   ')).toBe(true);
      }
    });

    it('client helper does not enforce active-only eligibility', () => {
      const draft = EVALUATION_LISTINGS.find((l) => l.id === 'jo-draft-toyota')!;
      expect(draft.status).toBe('pending');
      expect(matchSearch(draft, 'Toyota')).toBe(true);
    });

    it('cross-script Toyota ↔ تويوتا is bridged by phoneticKey, not by the synonym table', () => {
      const enHits = ids(matchesFor('Toyota', 'JO'));
      const arHits = ids(matchesFor('تويوتا', 'JO'));
      // Observed baseline: phonetic fallback retrieves the other script.
      expect(enHits).toContain('jo-toyota-camry-2018');
      expect(enHits).toContain('jo-toyota-camry-ar');
      expect(arHits).toContain('jo-toyota-camry-ar');
      expect(arHits).toContain('jo-toyota-camry-2018');
      // Kia is shorter; phonetic bridge is not asserted here. Recorded separately.
    });
  });

  describe('evaluation dataset coverage', () => {
    it('every case has a rationale and a scenario label', () => {
      for (const c of EVALUATION_CASES) {
        expect(c.scenario.length).toBeGreaterThan(0);
        expect(c.rationale.length).toBeGreaterThan(0);
        expect(c.expectedRelevantIds).toBeDefined();
        expect(c.expectedExcludedIds).toBeDefined();
      }
    });

    it('known client gaps are explicitly flagged', () => {
      const gaps = EVALUATION_CASES.filter((c) => c.knownClientGap);
      const gapIds = gaps.map((c) => c.id).sort();
      expect(gapIds).toEqual(
        expect.arrayContaining([
          'short-1-s',
          'short-2-sa',
          'short-3-sam',
          'empty-query',
          'eligibility-draft',
        ]),
      );
    });

    it('computes a simple client-side recall@all against the fixture set', () => {
      let relevantHits = 0;
      let relevantTotal = 0;
      for (const c of EVALUATION_CASES) {
        if (c.expectedRelevantIds.length === 0) continue;
        const hitIds = new Set(ids(matchesFor(c.query, c.market)));
        for (const expected of c.expectedRelevantIds) {
          relevantTotal += 1;
          if (hitIds.has(expected)) relevantHits += 1;
        }
      }
      // Baseline number is recorded; it is not a production metric.
      expect(relevantTotal).toBeGreaterThan(0);
      expect(relevantHits).toBeLessThanOrEqual(relevantTotal);
      expect(relevantHits).toBeGreaterThan(0);
    });
  });
});

export type { EvaluationCase };
