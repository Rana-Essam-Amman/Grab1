import type { Listing } from './types';
import { apartmentsPack, type Pack } from './packs/apartments';
import { housesPack } from './packs/real-estate/houses';
import { landsPack } from './packs/real-estate/lands';
import { chaletsPack } from './packs/real-estate/chalets';
import { commercialPack } from './packs/real-estate/commercial';
import { assertGuarded } from './guard';
import { fingerprint } from './fingerprint';
import { advance, seedOf } from './seeded';

const VERSION = 'v3.2';
const cache = new Map<string, Listing>();
const seen = new Map<string, string>();

export class ListingEngine {
  constructor(private readonly packs: readonly Pack[]) {}

  choosePack(text: string): Pack {
    const pack = this.packs.find((item) => item.detect(text));
    if (!pack) throw new Error('no pack matched — refusing to guess');
    return pack;
  }

  generate(input: { userId: string; draft: string }): Listing {
    const key = `${input.userId}|${input.draft.trim()}`;
    const cached = cache.get(key);
    if (cached) return cached;
    const pack = this.choosePack(input.draft);
    let last = 'guard';
    for (let attempt = 0; attempt < 6; attempt++) {
      try {
        const listing = this.realize(pack, input.userId, input.draft, attempt);
        const owner = seen.get(listing.fingerprint);
        if (owner && owner !== key) {
          last = 'collision';
          continue;
        }
        seen.set(listing.fingerprint, key);
        cache.set(key, listing);
        return listing;
      } catch (error) {
        last = error instanceof Error ? error.message : 'guard';
      }
    }
    throw new Error(last);
  }

  private realize(pack: Pack, userId: string, draft: string, attempt: number): Listing {
    const facts = pack.extract(draft);
    const seed = advance(seedOf(userId, draft, VERSION), attempt);
    const planId = (['prose', 'compact', 'minimal'] as const)[seed % 3];
    const opening = pack.opening(facts, seed);
    const parts = opening ? [opening] : [];
    if (planId !== 'compact') {
      const line = pack.composition(facts);
      if (line) parts.push(line);
    }
    if (planId !== 'minimal') {
      const line = pack.details(facts);
      if (line) parts.push(line);
    }
    if (planId === 'prose') {
      const features = pack.features(facts);
      if (features) parts.push(features);
    }
    parts.push(pack.close(seed));
    const title = pack.title(facts);
    const description = parts.join('\n\n');
    assertGuarded(`${title}\n${description}`, facts.traced);
    if (description.startsWith(title)) throw new Error('duplicate title');
    return { title, description, planId, seed, fingerprint: fingerprint(title, description), facts };
  }
}

const engine = new ListingEngine([apartmentsPack, housesPack, landsPack, chaletsPack, commercialPack]);

export function generate(input: { userId: string; draft: string; categorySlug?: string; subcategorySlug?: string }): Listing {
  return engine.generate(input);
}
