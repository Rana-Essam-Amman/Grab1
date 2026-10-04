-- 20261008_profiles_nickname.sql
-- Add editable nickname to profiles.
--
-- Rules: nullable, 2-50 chars, no uniqueness constraint (users may
-- share a nickname; the id remains the source of truth).
-- Fallback rendering handled by getUserDisplayName() in the client.

alter table public.profiles
  add column if not exists nickname text
    check (nickname is null or (char_length(nickname) between 2 and 50));

-- Lookup index for future features (search by nickname)
create index if not exists profiles_nickname_lower_idx
  on public.profiles (lower(nickname))
  where nickname is not null;
