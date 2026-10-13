# Taxonomy → Search Sync

This document is the contract for adding new taxonomy items (categories,
subcategories, cities, neighborhoods, brands, keyword synonyms, intent
keywords) and ensuring they are immediately searchable. It is written for
any AI agent or engineer who adds taxonomy to FOX.

## Overview

FOX search is built from seven lookup tables and one trigger:

| Table | Purpose | Used by |
|---|---|---|
| `public.listings` | Every listing, with `search_text`, `fts`, `search_chars`, `search_version` | Trigger + all RPCs |
| `public.search_keywords` | Synonym groups (`group_key` = one concept, its rows are interchangeable) | `expand_search_keywords` |
| `public.search_intent_categories` | Keyword → category_slug map | `detect_query_category` |
| `public.search_intent_markers` | Intent markers (rental/sale/new/used) | `detect_query_intent` |
| `public.search_stopwords` | Function words ignored by v2 token guard | `search_text_has_all_tokens_v2`, `query_has_stopword` |
| `public.search_category_labels` | Category AR/EN labels | FTS trigger |
| `public.search_subcategory_labels` | Subcategory AR/EN labels | FTS trigger |

The trigger `public.set_listings_search_text` fires BEFORE INSERT/UPDATE on
`listings` and rebuilds `search_text` from:
  title, description, city, neighborhood, seller_name, seller_phone,
  category labels (AR + EN), subcategory labels (AR + EN), attributes.

## Rebuild rules by change type

Changing a lookup table does **not** automatically update existing rows.
The rebuild action depends on which table changed:

| You changed | What to rebuild | SQL |
|---|---|---|
| `search_category_labels` or `search_subcategory_labels` | `listings.search_text` (labels are baked in) | `update public.listings set updated_at = now();` |
| `search_keywords` (synonyms) | `listings.search_text` (expanded variants baked in) | `update public.listings set updated_at = now();` |
| `search_intent_categories` | Nothing — read at query time | — |
| `search_intent_markers` | Nothing — read at query time | — |
| `search_stopwords` | Nothing — read at query time | — |

The first three have an effect only when the trigger re-fires, which
requires a row update.

## Recipe 1 — add a synonym group

Use when two words mean the same thing and either should match the other's listings.

```sql
insert into public.search_keywords (group_key, keyword) values
  ('brand_lexus', 'لكزس'),
  ('brand_lexus', 'lexus')
on conflict do nothing;

-- Rebuild search_text on existing listings
update public.listings set updated_at = now();
```

**Rules:**
- `group_key` is ONE concept (e.g. `brand_lexus`), not a category.
- All rows in a group are interchangeable for search.
- **Never** use `search_keywords` for product families (e.g. "camry", "corolla").
  Those belong in `search_intent_categories` if they imply a category, or nowhere.

## Recipe 2 — add a category-intent keyword

Use when a query token should narrow results to one category. Example: "سيارات" → motors.

```sql
insert into public.search_intent_categories (keyword, category_slug) values
  ('باص', 'motors'),
  ('bus', 'motors')
on conflict (keyword) do update set category_slug = excluded.category_slug;
```

**Rules:**
- Only add keywords that uniquely identify one category.
- **Never** add generic words (طاولة / table / كرسي) — they exist across multiple
  categories and will over-filter. See Session 11 cleanup (20261051).
- No rebuild needed. `detect_query_category` reads at query time.

**Effect:** `searchListingsHybrid` calls `detect_query_category(query)` and passes
the result as `p_category_slug` to `search_listings_v2_intent`.

## Recipe 3 — add an intent marker

Use when a query word should hard-filter results by rental/sale/new/used.

```sql
insert into public.search_intent_markers (marker, kind) values
  ('للإيجار', 'rental'),
  ('للبيع', 'sale')
on conflict (marker) do nothing;
```

**Rules:**
- `kind` is one of: `rental`, `sale`, `new`, `used`.
- The query word is normalized and matched against `marker` after punctuation
  stripping. Punctuation inside the query ("للإيجار؟") is removed automatically.
- No rebuild needed.

**Effect:** `search_listings_v2_intent` excludes listings whose `search_text`
contains the contradiction marker (rental query excludes "للبيع" listings).

## Recipe 4 — add a stopword

Use when a word is a function word (فيه، بدي، شو) and should not affect token
matching. It will be ignored by the v2 token guard.

```sql
insert into public.search_stopwords (word) values
  ('هاظ'), ('هاي'), ('هادا')
on conflict (word) do nothing;
```

**Rules:**
- Function words only. **Never** add a product noun.
- No rebuild needed.

**Effect:**
- `search_text_has_all_tokens_v2` ignores the word when validating multi-token queries.
- `query_has_stopword` returns true → the v2 FTS-OR fallback activates.

## Recipe 5 — add a category or subcategory

```sql
insert into public.search_category_labels (category_slug, name_ar, name_en)
values ('boating', 'قوارب', 'Boating')
on conflict (category_slug) do update
  set name_ar = excluded.name_ar, name_en = excluded.name_en;

-- Rebuild search_text so listings pick up the new label
update public.listings set updated_at = now();
```

## Recipe 6 — add a city or neighborhood

Cities and neighborhoods live in `src/data/locations/*` (frontend), not in
Postgres lookup tables. Search uses `listing.city` and `listing.neighborhood`
directly (normalized via `normalize_search_text`).

To add a city:
1. Add it to `src/data/locations/capitals.ts` or the location file.
2. Add the AR/EN mapping to the same file's neighborhood section if needed.
3. Publish a listing in that city — the trigger picks up `listing.city`.

No SQL migration needed.

## Testing a taxonomy change

After any Recipe 1 or 5 change:

```sql
-- Confirm the trigger rebuilt search_text for at least one listing
select id, title, search_text from public.listings
where category_slug = '<affected_category>' limit 1;
```

After any change, run the affected queries via the production RPC:

```sql
select id, title
from public.search_listings_v2_intent(
  '<query>', 'JO', 5, 0,
  public.detect_query_category('<query>'),
  null, null, null, null, null, null
);
```

Expected: the new item appears in the top 5.

## Production RPCs that consume this taxonomy

| RPC | Reads |
|---|---|
| `search_listings` (v1) | `search_keywords`, `search_category_labels`, `search_subcategory_labels` |
| `search_listings_v2` | Above + `search_stopwords` (via `search_text_has_all_tokens_v2`, `query_has_stopword`) |
| `search_listings_v2_intent` | Above + `search_intent_markers` (via `detect_query_intent`) |
| `detect_query_category` | `search_intent_categories` |
| `detect_query_intent` | `search_intent_markers` |
| `set_listings_search_text` (trigger) | `search_keywords`, `search_category_labels`, `search_subcategory_labels` |

## Versioning

Each listing carries `search_version` (integer). The trigger sets it to `3`.
Future trigger logic changes should bump it and force a rebuild:

```sql
update public.listings set updated_at = now()
where search_version <> <new_version>;
```

## Common mistakes

| Mistake | Fix |
|---|---|
| Adding a generic noun to `search_intent_categories` | Remove it. Only category-specific keywords belong there. |
| Adding a product family to `search_keywords` | Move to `search_intent_categories` (if category) or leave out. |
| Adding a product noun to `search_stopwords` | Remove it. Only function words. |
| Forgetting the rebuild after Recipe 1 or 5 | Run `update public.listings set updated_at = now();` |
| Adding a keyword to `search_intent_categories` but the query still misses | Check if the query has punctuation; `detect_query_category` normalizes but does not strip punctuation from keywords themselves. |
