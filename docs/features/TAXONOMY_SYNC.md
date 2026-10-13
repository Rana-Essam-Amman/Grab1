# Taxonomy → Search Sync

This document is the contract for adding new taxonomy items (categories,
subcategories, cities, neighborhoods, brands, keyword synonyms) and
ensuring they are immediately searchable. It is written for any AI agent
or engineer who adds taxonomy to FOX.

## Overview

FOX search is built from four tables and one trigger:

| Table | Purpose |
|---|---|
| `public.listings` | Every listing, with `search_text`, `fts`, `search_chars`, `search_version` |
| `public.search_keywords` | Synonym groups (each `group_key` is ONE concept, its rows are interchangeable) |
| `public.search_intent_categories` | Keyword → category_slug map (used by `detect_query_category`) |
| `public.search_category_labels` | Category AR/EN labels (used by the FTS trigger) |
| `public.search_subcategory_labels` | Subcategory AR/EN labels (used by the FTS trigger) |

The trigger `public.set_listings_search_text` fires BEFORE INSERT/UPDATE on
`listings` and rebuilds `search_text` from:
  title, description, city, neighborhood, seller_name, seller_phone,
  category labels (AR + EN), subcategory labels (AR + EN), attributes.

Changes to any of the four lookup tables do NOT automatically rebuild
`search_text` on existing listings. You must force a rebuild:

```sql
update public.listings set updated_at = now();
