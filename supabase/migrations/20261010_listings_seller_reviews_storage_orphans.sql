-- 20261010_listings_seller_reviews_storage_orphans.sql
-- Reconstructs three tables that were created manually in production and
-- never captured in supabase/migrations. Brings the repo in sync with the
-- live DB so a fresh environment can be rebuilt from migrations alone.
--
-- Idempotent: every CREATE is guarded by IF NOT EXISTS.
-- Verified against live Supabase on 2026-10-07.

-- ═══════════════════════════════════════════════════════════════
-- TABLES
-- ═══════════════════════════════════════════════════════════════

create table if not exists public.listings (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  description text not null,
  price text not null,
  currency text not null default 'JOD',
  country_code text not null default 'JO',
  city text not null,
  neighborhood text,
  category_slug text not null,
  subcategory_slug text,
  images text[] default '{}'::text[],
  attributes jsonb default '{}'::jsonb,
  status text not null default 'active',
  views integer default 0,
  seller_name text,
  seller_phone text,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  bumps_today integer not null default 0,
  bumps_reset_date date not null default CURRENT_DATE
);

create index if not exists listings_country_idx on public.listings (country_code);
create index if not exists listings_category_idx on public.listings (category_slug);
create index if not exists listings_created_idx on public.listings (created_at desc);
create index if not exists idx_listings_bumps_reset on public.listings (bumps_reset_date);

alter table public.listings enable row level security;

create table if not exists public.seller_reviews (
  id uuid primary key default gen_random_uuid(),
  seller_id uuid not null references auth.users(id) on delete cascade,
  reviewer_id uuid not null references auth.users(id) on delete cascade,
  listing_id uuid,
  rating smallint not null check (rating >= 1 and rating <= 5),
  comment text check (char_length(comment) <= 500),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (seller_id, reviewer_id, listing_id)
);

create index if not exists idx_seller_reviews_seller on public.seller_reviews (seller_id);
create index if not exists idx_seller_reviews_listing on public.seller_reviews (listing_id);

alter table public.seller_reviews enable row level security;

create table if not exists public.storage_orphans (
  id uuid primary key default gen_random_uuid(),
  path text not null unique,
  size_bytes bigint,
  detected_at timestamptz not null default now(),
  scheduled_delete_at timestamptz not null default (now() + interval '7 days')
);

create index if not exists idx_storage_orphans_scheduled on public.storage_orphans (scheduled_delete_at);

alter table public.storage_orphans enable row level security;

-- ═══════════════════════════════════════════════════════════════
-- FUNCTIONS
-- ═══════════════════════════════════════════════════════════════

create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path to 'public' as $$
begin
  insert into public.profiles (id, first_name, last_name, avatar_url)
    values (
      new.id,
      coalesce(new.raw_user_meta_data->>'given_name', new.raw_user_meta_data->>'name', ''),
      coalesce(new.raw_user_meta_data->>'family_name', ''),
      coalesce(new.raw_user_meta_data->>'avatar_url', new.raw_user_meta_data->>'picture', '')
    )
    on conflict (id) do nothing;
  return new;
end;
$$;

create or replace function public.check_listing_rate_limit()
returns trigger language plpgsql security definer set search_path to 'public' as $$
declare recent_count integer;
begin
  select count(*) into recent_count
    from public.listings
    where user_id = new.user_id
      and created_at > now() - interval '1 hour';
  if recent_count >= 20 then
    raise exception 'Rate limit: max 20 listings per hour';
  end if;
  return new;
end;
$$;

create or replace function public.bump_listing(p_listing_id uuid)
returns integer language plpgsql security definer set search_path to 'public' as $$
declare v_new_count int;
begin
  if auth.uid() is null then raise exception 'not authenticated'; end if;

  update listings
    set
      bumps_today = case
        when bumps_reset_date = current_date then bumps_today + 1
        else 1
      end,
      bumps_reset_date = current_date,
      last_bumped_at = now()
    where id = p_listing_id and user_id = auth.uid()
    returning bumps_today into v_new_count;

  if v_new_count is null then
    raise exception 'listing not found or not owned by user';
  end if;

  return v_new_count;
end;
$$;

create or replace function public.refresh_seller_rating()
returns trigger language plpgsql security definer set search_path to 'public' as $$
declare v_seller uuid;
begin
  v_seller := coalesce(new.seller_id, old.seller_id);
  update public.profiles
    set rating_avg = coalesce(
          (select avg(rating)::numeric(3,2) from public.seller_reviews where seller_id = v_seller), 0),
        rating_count = (select count(*) from public.seller_reviews where seller_id = v_seller)
    where id = v_seller;
  return null;
end;
$$;

create or replace function public.submit_seller_review(
  p_listing_id uuid,
  p_rating smallint,
  p_comment text default null
)
returns uuid language plpgsql security definer set search_path to 'public' as $$
declare v_seller uuid; v_review_id uuid;
begin
  if auth.uid() is null then raise exception 'not authenticated'; end if;
  if p_rating < 1 or p_rating > 5 then raise exception 'invalid rating'; end if;

  select user_id into v_seller from public.listings where id = p_listing_id;
  if v_seller is null then raise exception 'listing not found'; end if;
  if v_seller = auth.uid() then raise exception 'cannot review self'; end if;

  insert into public.seller_reviews (seller_id, reviewer_id, listing_id, rating, comment)
    values (v_seller, auth.uid(), p_listing_id, p_rating, nullif(trim(p_comment), ''))
    on conflict (seller_id, reviewer_id, listing_id)
      do update set rating = excluded.rating, comment = excluded.comment, updated_at = now()
    returning id into v_review_id;

  return v_review_id;
end;
$$;

create or replace function public.touch_conversation_on_new_message()
returns trigger language plpgsql security definer set search_path to 'public' as $$
begin
  update public.conversations set updated_at = now() where id = new.conversation_id;
  return new;
end;
$$;

create or replace function public.detect_orphan_images(p_min_age_hours integer default 24)
returns integer language plpgsql security definer set search_path to 'public' as $$
declare v_inserted int;
begin
  with referenced_paths as (
    select distinct regexp_replace(img, '^.*/storage/v1/object/public/listing-images/', '') as path
      from public.listings
      cross join lateral unnest(coalesce(images, array[]::text[])) as img
      where img like '%/storage/v1/object/public/listing-images/%'
  ),
  candidates as (
    select o.name as path, (o.metadata->>'size')::bigint as size_bytes
      from storage.objects o
      where o.bucket_id = 'listing-images'
        and o.created_at < now() - (p_min_age_hours || ' hours')::interval
        and o.name not in (select path from referenced_paths)
  )
  insert into public.storage_orphans (path, size_bytes)
    select path, size_bytes from candidates on conflict (path) do nothing;

  get diagnostics v_inserted = row_count;
  return v_inserted;
end;
$$;

create or replace function public.get_due_orphan_paths()
returns table(path text) language sql security definer set search_path to 'public' as $$
  select path from public.storage_orphans
    where scheduled_delete_at <= now()
    order by scheduled_delete_at asc
    limit 1000;
$$;

create or replace function public.confirm_orphan_deletion(p_paths text[])
returns integer language plpgsql security definer set search_path to 'public' as $$
declare v_deleted int;
begin
  delete from public.storage_orphans where path = any(p_paths);
  get diagnostics v_deleted = row_count;
  return v_deleted;
end;
$$;

-- ═══════════════════════════════════════════════════════════════
-- TRIGGERS
-- ═══════════════════════════════════════════════════════════════

drop trigger if exists listings_rate_limit on public.listings;
create trigger listings_rate_limit
  before insert on public.listings
  for each row execute function public.check_listing_rate_limit();

drop trigger if exists listings_set_updated_at on public.listings;
create trigger listings_set_updated_at
  before update on public.listings
  for each row execute function public.set_updated_at();

drop trigger if exists seller_reviews_set_updated_at on public.seller_reviews;
create trigger seller_reviews_set_updated_at
  before update on public.seller_reviews
  for each row execute function public.set_updated_at();

drop trigger if exists trg_refresh_seller_rating on public.seller_reviews;
create trigger trg_refresh_seller_rating
  after insert or update or delete on public.seller_reviews
  for each row execute function public.refresh_seller_rating();

drop trigger if exists handle_new_user on auth.users;
create trigger handle_new_user
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ═══════════════════════════════════════════════════════════════
-- RLS POLICIES
-- ═══════════════════════════════════════════════════════════════

drop policy if exists "listings_insert_own" on public.listings;
create policy "listings_insert_own" on public.listings
  for insert to authenticated
  with check (
    auth.uid() = user_id
    and (coalesce((auth.jwt() ->> 'is_anonymous')::boolean, false) = false)
    and country_code = (
      select country_code from public.profiles where id = auth.uid()
    )
  );

drop policy if exists "listings_read_all" on public.listings;
create policy "listings_read_all" on public.listings
  for select using (true);

drop policy if exists "listings_update_own" on public.listings;
create policy "listings_update_own" on public.listings
  for update to authenticated
  using (auth.uid() = user_id)
  with check (
    auth.uid() = user_id
    and country_code = (
      select country_code from public.profiles where id = auth.uid()
    )
  );

drop policy if exists "listings_delete_own" on public.listings;
create policy "listings_delete_own" on public.listings
  for delete to authenticated
  using (auth.uid() = user_id);

drop policy if exists "Anyone can read reviews" on public.seller_reviews;
create policy "Anyone can read reviews" on public.seller_reviews
  for select using (true);
