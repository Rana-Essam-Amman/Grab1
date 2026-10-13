-- 20261045_intent_punctuation_fix.sql
-- Session 10 — C3 iteration 3: intent token cleanup.
--
-- detect_query_intent tokenizes the normalized query with
-- regexp_split_to_table(norm, '\s+') and compares each token to the
-- normalized marker. Punctuation inside a token (?, !, ., ,) is not
-- stripped, so a query like "في شقة للإيجار؟" produces the token
-- "للايجار؟" which does not equal "للايجار". Intent detection returns
-- NULL and no exclusion happens.
--
-- Fix: strip punctuation characters from each token before comparing.
-- Signature and behavior otherwise unchanged.

begin;

create or replace function public.detect_query_intent(p_norm_query text)
returns text
language sql
stable
set search_path = public
as $func$
  select im.kind
  from regexp_split_to_table(
    btrim(coalesce(p_norm_query, '')), '[[:space:]]+'
  ) as raw_tok
  cross join lateral (
    select public.normalize_search_text(
      regexp_replace(raw_tok, '[[:punct:]]+', '', 'g')
    ) as tok
  ) as cleaned
  join public.search_intent_markers im
    on public.normalize_search_text(im.marker) = cleaned.tok
  where cleaned.tok <> ''
  limit 1;
$func$;

comment on function public.detect_query_intent(text) is
  'Returns the intent kind (rental/sale/new/used) implied by a query, or NULL. Punctuation-tolerant.';

commit;
