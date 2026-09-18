create table if not exists users (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  phone text not null,
  phone_key text not null unique,
  account_country text not null check (account_country in ('JO','LB','PS','SY')),
  confirmed boolean not null default false,
  confirm_token text unique,
  created_at timestamptz not null default now()
);
create unique index if not exists users_email_key on users (email);
create unique index if not exists users_phone_key_uidx on users (phone_key);
create index if not exists users_country_idx on users (account_country);

create table if not exists listings (
  id uuid primary key default gen_random_uuid(),
  seller_email text not null,
  seller_phone text,
  country_code text not null check (country_code in ('JO','LB','PS','SY')),
  city text not null,
  neighborhood text not null,
  category_slug text not null,
  subcategory_slug text,
  title text not null,
  description text not null,
  price numeric not null,
  currency text not null,
  image_url text,
  attrs jsonb,
  created_at timestamptz not null default now()
);
create index if not exists listings_country_idx on listings (country_code, created_at desc);
create index if not exists listings_category_idx on listings (country_code, category_slug);
create index if not exists listings_seller_idx on listings (seller_email);

create table if not exists conversations (
  id uuid primary key default gen_random_uuid(),
  listing_id uuid not null references listings(id) on delete cascade,
  buyer_email text not null,
  seller_email text not null,
  country_code text not null check (country_code in ('JO','LB','PS','SY')),
  created_at timestamptz not null default now()
);
create index if not exists conversations_country_idx on conversations (country_code, created_at desc);
create index if not exists conversations_participants_idx on conversations (buyer_email, seller_email);

create table if not exists messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references conversations(id) on delete cascade,
  sender_email text not null,
  country_code text not null check (country_code in ('JO','LB','PS','SY')),
  text text not null,
  created_at timestamptz not null default now()
);
create index if not exists messages_conversation_idx on messages (conversation_id, created_at asc);
create index if not exists messages_country_idx on messages (country_code);
