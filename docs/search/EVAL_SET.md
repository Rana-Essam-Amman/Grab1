# FOX Search Evaluation Set — 60 queries

> ⚠️ Fixture note: The listing IDs in section 4 are in-repo seed IDs (jo-1, jo-4, sa-1, ...) from src/data/seedListings/*.ts. Section 7 maps each seed ID to its current production UUID. Tests against production must use the UUIDs, not the seed IDs.

Canonical query count: 60 (A: 10, B: 10, C: 10, D: 5, E: 5, F: 5, G: 5, H: 5, I: 5).

## 1. Purpose

This file is the reference regression suite for FOX search, with fixed queries and expected listing relevance based on the repository's seed fixtures. Any change to search behavior must be validated against this suite before merge.

## 2. How to run

Run each query against the specified market and compare returned IDs with the expected top-1, included, and excluded IDs below.

Baseline:
select id, title from public.search_listings('<query>', '<market>', 20, 0);

Hybrid:
select id, title from public.search_listings_hybrid('<query>', null, '<market>', 20, 0, 0.85, null, null, null, null, null, null, null, null);

The hybrid path with a null vector degrades to FTS-only; for meaningful hybrid tests, produce the query vector via the embed-query edge function first. Replace the placeholders with SQL-escaped query and market values. These seed-derived expectations are fixtures, not a claim that the current production corpus contains every seed listing; verify fixture availability in the target test environment before interpreting a missing result as a search regression.

## 3. Scoring

- Precision@5 — out of the top five returned rows, how many are relevant to the query.
- nDCG@10 — ranking quality in the top ten, accounting for graded relevance (highly relevant results should rank above partially relevant ones).
- Zero-result rate — the share of queries that return zero rows when at least one relevant listing exists.

For exact-match rows, the first ID in Expected included (ids) is the expected top-1 unless a different ID is explicitly stated. PENDING DATA means the repository seed set does not support a defensible expected listing; resolve it against an approved fixture/corpus before treating it as a pass/fail assertion. Negative tests expect zero rows and therefore have no top-1 listing.

## 4. Queries (60 total, grouped)

### Group A — Arabic MSA exact match (10 queries)

| # | Query | Market | Language | Type | Expected top-1 (id) | Expected included (ids) | Must NOT include (ids) |
|---:|---|---|---|---|---|---|---|
| 1 | آيفون 15 برو ماكس | JO | Arabic | exact | jo-1 | jo-1 | jo-4, jo-5 |
| 2 | كيا سبورتاج 2022 | JO | Arabic | exact | jo-4 | jo-4 | jo-5, jo-8 |
| 3 | تويوتا كامري هايبرد 2021 | JO | Arabic | exact/description | jo-5 | jo-5 | jo-2, jo-4 |
| 4 | شقة مفروشة في الشميساني | JO | Arabic | exact/description | jo-3 | jo-3 | jo-6, jo-8 |
| 5 | فيلا للبيع في دابوق | JO | Arabic | exact/description | jo-6 | jo-6 | jo-3, jo-7 |
| 6 | شاشة سامسونج 65 بوصة | JO | Arabic | exact/description | jo-8 | jo-8 | jo-9, jo-10 |
| 7 | سامسونج جالكسي S24 بلس | JO | Arabic | exact/description | jo-10 | jo-10 | jo-1, jo-8 |
| 8 | طقم كنب زاوية | JO | Arabic | exact/description | jo-11 | jo-11 | jo-12, jo-13 |
| 9 | ساعة رولكس سابمارينر | JO | Arabic | exact/description | jo-14 | jo-14 | jo-15, jo-16 |
| 10 | حذاء رجالي جلد إيطالي | JO | Arabic | exact/description | jo-15 | jo-15 | jo-14, jo-16 |

### Group B — Arabic Jordanian colloquial (10 queries)

| # | Query | Market | Language | Type | Expected top-1 (id) | Expected included (ids) | Must NOT include (ids) |
|---:|---|---|---|---|---|---|---|
| 11 | بدي سيارة كيا | JO | Arabic colloquial | intent | jo-4 | jo-4 | jo-8, jo-11 |
| 12 | شو عندك موبايلات | JO | Arabic colloquial | category intent | jo-1 | jo-1, jo-10 | jo-4, jo-8 |
| 13 | كم سعر الكامري | JO | Arabic colloquial | attribute/model | jo-5 | jo-5 | jo-2, jo-4 |
| 14 | في شقة للإيجار؟ | JO | Arabic colloquial | intent | jo-3 | jo-3 | jo-6, jo-7 |
| 15 | بدي تلفزيون كبير | JO | Arabic colloquial | intent | jo-8 | jo-8 | jo-1, jo-10 |
| 16 | عندك بلايستيشن للبيع | JO | Arabic colloquial | intent | jo-9 | jo-9 | jo-8, jo-10 |
| 17 | بدي كنب للصالون | JO | Arabic colloquial | intent | jo-11 | jo-11 | jo-12, jo-13 |
| 18 | في ساعة رولكس؟ | JO | Arabic colloquial | intent | jo-14 | jo-14 | jo-15, jo-16 |
| 19 | بدي طاولة للحديقة | JO | Arabic colloquial | intent | jo-12 | jo-12 | jo-8, jo-11 |
| 20 | مين بنظف مكيفات بعمان | JO | Arabic colloquial | service intent | jo-16 | jo-16 | jo-4, jo-8 |

### Group C — English exact match (10 queries)

| # | Query | Market | Language | Type | Expected top-1 (id) | Expected included (ids) | Must NOT include (ids) |
|---:|---|---|---|---|---|---|---|
| 21 | iPhone 15 Pro Max 256GB Natural Titanium | JO | English | exact title | jo-1 | jo-1 | jo-10 |
| 22 | Hyundai Avante (Elantra) AD 2020 | JO | English | exact title | jo-2 | jo-2 | jo-4 |
| 23 | Modern Furnished Apartment 2 Beds in Shmeisani | JO | English | exact title | jo-3 | jo-3 | jo-6, jo-7 |
| 24 | Kia Sportage 2022 Full Option Panoramic | JO | English | exact title | jo-4 | jo-4 | jo-2, jo-5 |
| 25 | Toyota Camry Hybrid 2021 LE | JO | English | exact title | jo-5 | jo-5 | jo-2, jo-4 |
| 26 | Samsung 65 Inch QLED 4K Smart TV | JO | English | exact title | jo-8 | jo-8 | jo-9 |
| 27 | Sony PlayStation 5 Slim 1TB with 2 Controllers | JO | English | exact title | jo-9 | jo-9 | jo-8 |
| 28 | Samsung Galaxy S24 Plus 256GB Onyx Black | JO | English | exact title | jo-10 | jo-10 | jo-1 |
| 29 | Rolex Submariner Date 41mm Oystersteel | JO | English | exact title | jo-14 | jo-14 | jo-15 |
| 30 | Automatic Petrol Lawn Mower 170cc | JO | English | exact title | jo-13 | jo-13 | jo-12 |

### Group D — Mixed Arabic + English (5 queries)

| # | Query | Market | Language | Type | Expected top-1 (id) | Expected included (ids) | Must NOT include (ids) |
|---:|---|---|---|---|---|---|---|
| 31 | كامري Hybrid 2021 | JO | Mixed | mixed model | jo-5 | jo-5 | jo-2, jo-4 |
| 32 | كيا Sportage Automatic | JO | Mixed | mixed model/attribute | jo-4 | jo-4 | jo-5 |
| 33 | شاشة Samsung 65 Inch | JO | Mixed | mixed product | jo-8 | jo-8 | jo-10 |
| 34 | آيفون 15 Pro Max 256GB | JO | Mixed | mixed product | jo-1 | jo-1 | jo-10 |
| 35 | ساعة Rolex Submariner | JO | Mixed | mixed product | jo-14 | jo-14 | jo-15 |

### Group E — Category intent (5 queries)

| # | Query | Market | Language | Type | Expected top-1 (id) | Expected included (ids) | Must NOT include (ids) |
|---:|---|---|---|---|---|---|---|
| 36 | سيارات | JO | Arabic | category | jo-2 | jo-2, jo-4, jo-5 | jo-1, jo-8 |
| 37 | شقق | JO | Arabic | category | jo-3 | jo-3, jo-7 | jo-2, jo-8 |
| 38 | موبايلات | JO | Arabic | category | jo-1 | jo-1, jo-10 | jo-4, jo-9 |
| 39 | كتب | JO | Arabic | category | PENDING DATA | PENDING DATA | jo-2, jo-8 |
| 40 | ساعات | JO | Arabic | category | jo-14 | jo-14 | jo-1, jo-4 |

### Group F — Descriptive / semantic (5 queries)

| # | Query | Market | Language | Type | Expected top-1 (id) | Expected included (ids) | Must NOT include (ids) |
|---:|---|---|---|---|---|---|---|
| 41 | سيارة عائلية كبيرة | JO | Arabic | semantic | PENDING DATA | jo-2, jo-4, jo-5 (relevance to validate) | jo-8, jo-11 |
| 42 | شاشة للسينما المنزلية | JO | Arabic | semantic | jo-8 | jo-8 (top-3 must be relevant) | jo-2, jo-5 |
| 43 | لابتوب للألعاب | JO | Arabic | semantic | PENDING DATA | PENDING DATA | jo-2, jo-8 |
| 44 | أثاث مريح لغرفة المعيشة | JO | Arabic | semantic | jo-11 | jo-11 (top-3 must be relevant) | jo-2, jo-8 |
| 45 | خدمة صيانة منزلية | JO | Arabic | semantic | jo-16 | jo-16 (top-3 must be relevant) | jo-1, jo-5 |

### Group G — Negative tests (5 queries)

| # | Query | Market | Language | Type | Expected top-1 (id) | Expected included (ids) | Must NOT include (ids) |
|---:|---|---|---|---|---|---|---|
| 46 | Toyota Samsung | JO | English | negative conjunction | N/A (expect 0 rows) | none | all IDs |
| 47 | xyzabc123 | JO | English | negative gibberish | N/A (expect 0 rows) | none | all IDs |
| 48 | بيتزا فرن حجري | JO | Arabic | negative category | N/A (expect 0 rows) | none | all IDs |
| 49 | underwater moon bicycle | JO | English | negative unrelated phrase | N/A (expect 0 rows) | none | all IDs |
| 50 | كوكب بنفسجي يبيع المطر | JO | Arabic | negative unrelated phrase | N/A (expect 0 rows) | none | all IDs |

### Group H — Typo / near-match (5 queries)

| # | Query | Market | Language | Type | Expected top-1 (id) | Expected included (ids) | Must NOT include (ids) |
|---:|---|---|---|---|---|---|---|
| 51 | كيا سبورتاج | JO | Arabic | typo/near-match | jo-4 | jo-4 | jo-8, jo-10 |
| 52 | تويوتا كمرى | JO | Arabic | typo/near-match | jo-5 | jo-5 | jo-2, jo-4 |
| 53 | سامسونج جالاكسي | JO | Arabic | near-match | jo-10 | jo-10, jo-8 | jo-4 |
| 54 | Playstaton 5 Slim | JO | English | typo/near-match | jo-9 | jo-9 | jo-8 |
| 55 | Samsng 65 Inch QLED | JO | English | typo/near-match | jo-8 | jo-8 | jo-9, jo-10 |

### Group I — Multi-market scope (5 queries)

| # | Query | Market | Language | Type | Expected top-1 (id) | Expected included (ids) | Must NOT include (ids) |
|---:|---|---|---|---|---|---|---|
| 56 | Toyota Camry | JO | English | market scope | jo-5 | jo-5 | sa-1, sy-5 |
| 57 | تويوتا لاندكروزر | SA | Arabic | market scope | sa-1 | sa-1 | jo-5, sy-5 |
| 58 | iPhone 15 Pro Max | JO | English | market scope | jo-1 | jo-1 | sa-3, lb-8 |
| 59 | آيفون 15 بروماكس | SA | Arabic | market scope | sa-3 | sa-3 | jo-1, lb-8 |
| 60 | Kia | SA | English | market scope | PENDING DATA | PENDING DATA | jo-4, sy-5 |

## 5. Baseline snapshot

| Date | Commit SHA | Metric | Value |
|---|---|---|---|
|  |  |  |  |

## 6. Change log

| Date | Author | Reason |
|---|---|---|
| 2026-10-13 | ChatGPT | Initial 60-query search regression suite, curated from repository seed fixtures; unresolved categories/semantic expectations marked PENDING DATA. |
| 2026-10-13 | ChatGPT | Section 7 filled: 20/20 seed IDs matched production UUIDs by exact title query. |

## 7. ID translation to production

Mapping verified against current production listing titles using an exact-title query. All 20 requested titles matched exactly; no missing titles required partial-match lookup.

| Seed ID | Production UUID | Title (short) | Match |
|---|---|---|---|
| jo-1 | ef44ca01-0055-4e4a-b776-51e0d5558de9 | iPhone 15 Pro Max | exact |
| jo-2 | 4a681f0d-4e0e-4466-916a-602c3ea32836 | Hyundai Avante | exact |
| jo-3 | 4223f559-bd86-47ba-bb85-65847081ddb2 | Modern Furnished Apartment | exact |
| jo-4 | 1e71ace8-4dba-4b74-945c-20fa6fc12d4e | Kia Sportage | exact |
| jo-5 | d1cbcb30-5d70-4883-9a43-ebd563537fc1 | Toyota Camry Hybrid | exact |
| jo-6 | b680f15c-28a1-4557-ac60-586ad231bbab | Modern Villa | exact |
| jo-7 | 8ce41d7a-c5c4-487b-ac56-288e2c0aa280 | Spacious Apartment | exact |
| jo-8 | f92d41ef-1ad7-4e0f-9fcf-463da028fd4e | Samsung 65 Inch TV | exact |
| jo-9 | 6c47fd30-8e1e-48f8-8bda-d6982bc4b0d8 | Sony PlayStation 5 Slim | exact |
| jo-10 | 522cd6a5-fa44-4db5-a542-17f8e93a7afc | Samsung Galaxy S24 Plus | exact |
| jo-11 | 023e1d48-6019-4cdc-bfd3-ee7507e2ba1c | Luxury L-Shape Sofa | exact |
| jo-12 | 8d675cee-59a6-4aa8-8dd1-677b89143cfb | Outdoor Garden Dining Table | exact |
| jo-13 | 93ef8daa-2cd7-455f-b41a-1185220d8155 | Automatic Petrol Lawn Mower | exact |
| jo-14 | 1d62a7d5-63fd-4037-a46d-7adff060a24a | Rolex Submariner | exact |
| jo-15 | 0de7b0a6-67b6-44f4-b8f0-db40780ca443 | Handmade Italian Leather Shoes | exact |
| jo-16 | 84bc574b-d124-4948-8f62-4c02e9e16c72 | Professional Home AC Cleaning | exact |
| sa-1 | e87a1253-763f-4237-aadd-3c4e22fd62eb | تويوتا لاندكروزر VXR | exact |
| sa-3 | ab9ace8b-fceb-4199-94fb-d89f636fe068 | آيفون 15 بروماكس | exact |
| sy-5 | 5d084b6c-2e15-4bd9-a1af-73560baf8e73 | Kia Cerato 2018 | exact |
| lb-8 | 7a55d72c-e9ca-4365-81ba-77a875832940 | iPhone 15 Pro 128GB | exact |
