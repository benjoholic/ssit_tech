create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text not null default '',
  category text not null check (category in ('cctv', 'access_point', 'switch')),
  price numeric not null default 0 check (price >= 0),
  stocks integer not null default 0 check (stocks >= 0),
  image text not null default '',
  created_at timestamptz not null default now()
);

alter table public.products enable row level security;


comment on table public.products is 'Admin-managed product catalog';
