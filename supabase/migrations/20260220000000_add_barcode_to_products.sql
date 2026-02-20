-- Add barcode column to products table.
-- Run this in Supabase Dashboard: SQL Editor → New query → paste and run.
alter table public.products
  add column if not exists barcode text not null default '';

comment on column public.products.barcode is 'Scanned barcode value for the product';
