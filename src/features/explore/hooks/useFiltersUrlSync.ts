import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { categories } from '@/data/categories';
import { subcategoriesByCategory } from '@/data/subcategories';
import type { SortBy } from '@/shared/router/filterParams';

export interface FilterDrafts {
  readonly category: string | null;
  readonly sub: string | null;
  readonly min: number | null;
  readonly max: number | null;
  readonly neigh: string | null;
  readonly sort: SortBy;
  readonly attrs: Record<string, string>;
}

const ATTR_PREFIX = 'f_';
const CATEGORY_SLUGS = new Set<string>(categories.map((c) => c.slug));

function isSubOfParent(cat: string, sub: string): boolean {
  return subcategoriesByCategory(cat).some((s) => s.slug === sub);
}

export function readDraftsFromUrl(fallback: FilterDrafts): FilterDrafts {
  if (typeof window === 'undefined') return fallback;
  const sp = new URLSearchParams(window.location.search);
  if (sp.toString() === '') return fallback;

  const catRaw = sp.get('cat');
  const cat = catRaw && CATEGORY_SLUGS.has(catRaw) ? catRaw : null;
  const subRaw = sp.get('sub');
  const sub = cat && subRaw && isSubOfParent(cat, subRaw) ? subRaw : null;

  const minRaw = sp.get('min');
  const maxRaw = sp.get('max');
  const sortRaw = sp.get('sort');
  const attrs: Record<string, string> = {};
  sp.forEach((v, k) => {
    if (k.startsWith(ATTR_PREFIX) && v) attrs[k.slice(ATTR_PREFIX.length)] = v;
  });
  const sort: SortBy = sortRaw === 'price-asc' || sortRaw === 'price-desc' ? sortRaw : 'newest';

  return {
    category: cat,
    sub,
    min: minRaw !== null && /^\d+$/.test(minRaw) ? Number(minRaw) : null,
    max: maxRaw !== null && /^\d+$/.test(maxRaw) ? Number(maxRaw) : null,
    neigh: sp.get('neigh'),
    sort,
    attrs,
  };
}

export function buildFiltersQuery(d: FilterDrafts): string {
  const sp = new URLSearchParams();
  if (d.category) sp.set('cat', d.category);
  if (d.sub) sp.set('sub', d.sub);
  if (d.min !== null) sp.set('min', String(d.min));
  if (d.max !== null) sp.set('max', String(d.max));
  if (d.neigh) sp.set('neigh', d.neigh);
  if (d.sort !== 'newest') sp.set('sort', d.sort);
  for (const [k, v] of Object.entries(d.attrs)) {
    if (v) sp.set(`${ATTR_PREFIX}${k}`, v);
  }
  const s = sp.toString();
  return s ? `?${s}` : '';
}

export function useFiltersUrlSync(drafts: FilterDrafts): void {
  const navigate = useNavigate();
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (window.location.pathname !== '/filters') return;
    const next = `/filters${buildFiltersQuery(drafts)}`;
    if (next !== window.location.pathname + window.location.search) {
      navigate(next, { replace: true });
    }
  }, [navigate, drafts.category, drafts.sub, drafts.min, drafts.max, drafts.neigh, drafts.sort, drafts.attrs]);
}
