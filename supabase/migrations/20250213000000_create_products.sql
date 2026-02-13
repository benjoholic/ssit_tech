-- Products table for admin product management.
-- Run this in Supabase Dashboard: SQL Editor → New query → paste and run.
-- Or, if using Supabase CLI: supabase db push
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

-- RLS: only server-side admin client (service role) can access; service role bypasses RLS
alter table public.products enable row level security;

-- No policy for anon/authenticated = only service role (used in server actions) can read/write
comment on table public.products is 'Admin-managed product catalog';
