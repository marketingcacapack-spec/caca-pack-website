-- Run this entire script in Supabase Dashboard > SQL Editor.
-- Public visitors can read products. Only authenticated users can manage products.
create extension if not exists pgcrypto;

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null default '',
  image_url text not null,
  image_path text not null,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Explicit admin allowlist: only user IDs added to admin_users can manage catalog data.
create table if not exists public.admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);
alter table public.admin_users enable row level security;

create or replace function public.is_caca_admin()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (select 1 from public.admin_users where user_id = auth.uid());
$$;
revoke all on function public.is_caca_admin() from public;
grant execute on function public.is_caca_admin() to authenticated;

alter table public.products enable row level security;
drop policy if exists "Public can view products" on public.products;
create policy "Public can view products" on public.products for select using (true);
drop policy if exists "CACA admins can insert products" on public.products;
create policy "CACA admins can insert products" on public.products for insert to authenticated with check (public.is_caca_admin());
drop policy if exists "CACA admins can update products" on public.products;
create policy "CACA admins can update products" on public.products for update to authenticated using (public.is_caca_admin()) with check (public.is_caca_admin());
drop policy if exists "CACA admins can delete products" on public.products;
create policy "CACA admins can delete products" on public.products for delete to authenticated using (public.is_caca_admin());

insert into storage.buckets (id,name,public,file_size_limit,allowed_mime_types)
values ('product-images','product-images',true,5242880,array['image/jpeg','image/png','image/webp'])
on conflict (id) do update set public=true,file_size_limit=5242880,allowed_mime_types=array['image/jpeg','image/png','image/webp'];

drop policy if exists "Public can view product images" on storage.objects;
create policy "Public can view product images" on storage.objects for select using (bucket_id='product-images');
drop policy if exists "Authenticated admins can upload product images" on storage.objects;
create policy "Authenticated admins can upload product images" on storage.objects for insert to authenticated with check (bucket_id='product-images' and public.is_caca_admin());
drop policy if exists "Authenticated admins can update product images" on storage.objects;
create policy "Authenticated admins can update product images" on storage.objects for update to authenticated using (bucket_id='product-images' and public.is_caca_admin()) with check (bucket_id='product-images' and public.is_caca_admin());
drop policy if exists "Authenticated admins can delete product images" on storage.objects;
create policy "Authenticated admins can delete product images" on storage.objects for delete to authenticated using (bucket_id='product-images' and public.is_caca_admin());
