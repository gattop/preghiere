-- =====================================================
-- 003_prayer_checkins.sql — "Ho pregato oggi" check-in
-- Traccia, per utente e preghiera, i giorni in cui è stata pregata.
-- =====================================================

create table if not exists public.prayer_checkins (
  id         uuid primary key default uuid_generate_v4(),
  user_id    uuid not null references auth.users(id) on delete cascade,
  prayer_id  text not null,
  prayed_on  date not null default current_date,
  created_at timestamptz not null default now(),
  unique (user_id, prayer_id, prayed_on)
);

alter table public.prayer_checkins enable row level security;

create policy "prayer_checkins: own all" on public.prayer_checkins
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
