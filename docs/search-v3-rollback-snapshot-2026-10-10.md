# Search V3 Pre-Migration Snapshot

**Date:** 2026-10-10
**Author:** Session 7 rollback safety net
**Reason:** Supabase Free plan has no automatic backups. This file is our recovery source before applying Search V3.

---

## Production Data — Listings (3 rows, all active)

### Listing 1
- id: `96ccbe26-b889-47db-8f50-be556fbbe713`
- title: `بنطلون جينز للبيع بسعر 10`
- category: `fashion` / `men`
- city: `عجلون`, neighborhood: `عبين`
- seller_name: `زائر`
- seller_phone: `null`
- price: `10` JOD

### Listing 2
- id: `6d9627bf-2063-4145-be16-496785d6eee9`
- title: `تويوتا كامري 2018 بحالة ممتازة`
- category: `motors` / `cars`
- city: `عمّان`, neighborhood: `عبدون`
- seller_name: `Sufyan User`
- seller_phone: `791234567`
- price: `12000` JOD

### Listing 3
- id: `b74304b9-2de6-4ce5-988d-6ad9128264f9`
- title: `Hgfddsssssss`
- category: `motors` / `cars`
- city: `عمّان`, neighborhood: `العبدلي`
- seller_name: `Sufyan Younis`
- seller_phone: `0782110622`
- price: `50` JOD

**Full JSON backup:** captured in ChatGPT session 2026-10-10. Recovery if needed: query ChatGPT history.

---

## Auth Users

**138 users.** No export on Free plan. Not affected by Search V3 migrations.

---

## Current Migrations (16 files in supabase/migrations/)

Key files:
- `20261015_listings_fts.sql` — original FTS setup
- `20261016_search_v2_category_aware.sql` — **SOURCE OF TRUTH for current search**

---

## Current Search Functions (in 20261016_search_v2_category_aware.sql)

- `normalize_arabic(t text)` — Arabic + Farsi normalization
- `arabic_word_variants(p_word text)` — prefix-strip variants
- `expand_arabic_variants(p_input text)` — variant expansion
- `build_prefix_tsquery(p_input text)` — prefix tsquery builder
- `set_listings_search_text()` — trigger function
- `search_listings(p_query, p_market, p_limit, p_offset)` — RPC

---

## Current Trigger

- Name: `set_listings_search_text_trigger`
- Table: `public.listings`
- Timing: `BEFORE INSERT OR UPDATE`
- Function: `set_listings_search_text()`

---

## Current Indexes on public.listings

13 index statements across migrations. Key GIN indexes:
- `listings_fts_idx` on `fts`
- `listings_search_text_trgm_idx` on `search_text` (trigram)

---

## RLS Policies on public.listings

**4 policies** found across migrations.

---

## Search Data

- Categories: 20
- Subcategories: 110
- Synonyms: 29

---

## Rollback Plan

**If V3 migration 2 (trigger) fails:**

1. DROP TRIGGER `set_listings_search_text_trigger` on `public.listings`
2. Restore `set_listings_search_text()` from `20261016_search_v2_category_aware.sql`
3. Restore `search_listings()` from same file
4. Recreate trigger: `CREATE TRIGGER set_listings_search_text_trigger BEFORE INSERT OR UPDATE ON public.listings FOR EACH ROW EXECUTE FUNCTION set_listings_search_text();`
5. Backfill: `UPDATE public.listings SET title = title;`
6. Verify: 3 listings exist, search_text populated

**If V3 migration 1 (schema) needs rollback:**

```sql
DROP INDEX IF EXISTS public.search_keywords_keyword_trgm_idx;
DROP INDEX IF EXISTS public.listings_search_chars_gin_idx;
DROP TABLE IF EXISTS public.search_keywords;
DROP FUNCTION IF EXISTS public.search_character_array(text);
DROP FUNCTION IF EXISTS public.expand_search_keywords(text);
DROP FUNCTION IF EXISTS public.search_json_values(jsonb);
DROP FUNCTION IF EXISTS public.normalize_search_text(text);
DROP FUNCTION IF EXISTS public.set_listings_search_text();
-- Restore set_listings_search_text from 20261016 migration
ALTER TABLE public.listings DROP COLUMN IF EXISTS search_chars;
ALTER TABLE public.listings DROP COLUMN IF EXISTS search_version;
