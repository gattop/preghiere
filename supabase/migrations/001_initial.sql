-- =====================================================
-- 001_initial.sql — Spada dello Spirito database schema
-- Run via: supabase db push  or  supabase migration up
-- =====================================================

-- Extension for UUID generation (enabled by default in Supabase)
create extension if not exists "uuid-ossp";

-- ─────────────────────────────────────────────────────
-- PROFILES
-- One row per auth.users entry; created automatically
-- via the trigger below.
-- ─────────────────────────────────────────────────────
create table if not exists public.profiles (
  id                   uuid primary key references auth.users(id) on delete cascade,
  display_name         text,
  receive_daily_gospel boolean not null default false,
  is_admin             boolean not null default false,
  created_at           timestamptz not null default now()
);

alter table public.profiles enable row level security;

-- Users can read and update only their own profile
create policy "profiles: own read"   on public.profiles for select using (auth.uid() = id);
create policy "profiles: own update" on public.profiles for update using (auth.uid() = id);

-- Trigger: create a profile row whenever a new user signs up
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, display_name)
  values (new.id, new.raw_user_meta_data->>'display_name');
  return new;
end;
$$;

create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();


-- ─────────────────────────────────────────────────────
-- FAVORITES
-- ─────────────────────────────────────────────────────
create table if not exists public.favorites (
  id         uuid primary key default uuid_generate_v4(),
  user_id    uuid not null references auth.users(id) on delete cascade,
  prayer_id  text not null,
  created_at timestamptz not null default now(),
  unique (user_id, prayer_id)
);

alter table public.favorites enable row level security;

create policy "favorites: own all" on public.favorites
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);


-- ─────────────────────────────────────────────────────
-- PRAYER PROPOSALS
-- ─────────────────────────────────────────────────────
create type public.proposal_status as enum ('pending', 'approved', 'rejected');

create table if not exists public.prayer_proposals (
  id               uuid primary key default uuid_generate_v4(),
  user_id          uuid not null references auth.users(id) on delete cascade,
  title            text not null,
  content          text not null,
  author_note      text,
  suggested_folder text,
  status           public.proposal_status not null default 'pending',
  admin_note       text,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

alter table public.prayer_proposals enable row level security;

-- Authors can create proposals and see their own
create policy "proposals: own insert" on public.prayer_proposals
  for insert with check (auth.uid() = user_id);

create policy "proposals: own select" on public.prayer_proposals
  for select using (auth.uid() = user_id);

-- Admins can see and update all proposals
create policy "proposals: admin all" on public.prayer_proposals
  using (
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid() and profiles.is_admin = true
    )
  )
  with check (
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid() and profiles.is_admin = true
    )
  );

-- Auto-update updated_at on change
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create or replace trigger proposals_updated_at
  before update on public.prayer_proposals
  for each row execute procedure public.set_updated_at();


-- ─────────────────────────────────────────────────────
-- GOSPEL LOG
-- Tracks the last gospel item that was emailed out,
-- so the cron job can skip runs when the feed hasn't changed.
-- ─────────────────────────────────────────────────────
create table if not exists public.gospel_log (
  id         serial primary key,
  link       text not null,
  title      text not null,
  sent_at    timestamptz not null default now()
);

-- Only the service role (edge functions) can write to this table.
-- No RLS needed since it is never accessed by client-side code.
alter table public.gospel_log enable row level security;
