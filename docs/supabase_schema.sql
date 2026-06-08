-- ============================================================================
-- AFRO SOUND — Schéma Supabase (à coller dans Supabase → SQL Editor → Run)
-- Inclut : tables, Row Level Security (RLS) + policies, trigger de profil auto.
-- Idempotent : peut être ré-exécuté sans erreur.
-- ============================================================================

-- ─────────────────────────────── Tables ───────────────────────────────────

-- Profils utilisateurs (1-1 avec auth.users)
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text unique,
  avatar_url text,
  created_at timestamptz default now()
);

-- Pistes (catalogue importé : Audius / Jamendo)
create table if not exists public.tracks (
  id text primary key,                 -- ex. "audius_9b5OvK0"
  title text not null,
  artist text,
  album text,
  cover_url text,
  audio_url text,
  source text,                         -- 'audius' | 'jamendo'
  duration int,
  created_at timestamptz default now()
);

-- Favoris
create table if not exists public.favorites (
  user_id uuid references auth.users(id) on delete cascade,
  track_id text references public.tracks(id) on delete cascade,
  created_at timestamptz default now(),
  primary key (user_id, track_id)
);

-- Playlists
create table if not exists public.playlists (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  name text not null,
  is_public boolean default false,
  created_at timestamptz default now()
);

create table if not exists public.playlist_tracks (
  playlist_id uuid references public.playlists(id) on delete cascade,
  track_id text references public.tracks(id) on delete cascade,
  position int default 0,
  primary key (playlist_id, track_id)
);

-- Historique d'écoute
create table if not exists public.play_history (
  id bigint generated always as identity primary key,
  user_id uuid references auth.users(id) on delete cascade,
  track_id text references public.tracks(id) on delete cascade,
  played_at timestamptz default now()
);

-- ─────────────────────────── Row Level Security ────────────────────────────

alter table public.profiles        enable row level security;
alter table public.favorites       enable row level security;
alter table public.playlists       enable row level security;
alter table public.playlist_tracks enable row level security;
alter table public.play_history    enable row level security;
alter table public.tracks          enable row level security;

-- profiles : chacun lit/écrit le sien
drop policy if exists "profiles_self" on public.profiles;
create policy "profiles_self" on public.profiles
  for all using (auth.uid() = id) with check (auth.uid() = id);

-- tracks : lecture publique, écriture réservée au backend (service_role bypasse la RLS)
drop policy if exists "tracks_read" on public.tracks;
create policy "tracks_read" on public.tracks for select using (true);

-- favorites : chacun gère les siens
drop policy if exists "favorites_own" on public.favorites;
create policy "favorites_own" on public.favorites
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- playlists : propriétaire (toutes opérations) + lecture des playlists publiques
drop policy if exists "playlists_owner" on public.playlists;
create policy "playlists_owner" on public.playlists
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
drop policy if exists "playlists_public_read" on public.playlists;
create policy "playlists_public_read" on public.playlists
  for select using (is_public = true);

-- playlist_tracks : accessibles via la playlist du propriétaire
drop policy if exists "playlist_tracks_owner" on public.playlist_tracks;
create policy "playlist_tracks_owner" on public.playlist_tracks
  for all using (exists (
    select 1 from public.playlists p
    where p.id = playlist_id and p.user_id = auth.uid()
  ));

-- historique : chacun le sien
drop policy if exists "history_own" on public.play_history;
create policy "history_own" on public.play_history
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- ─────────────────── Trigger : création auto du profil ─────────────────────

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into public.profiles (id, username, avatar_url)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'user_name', split_part(new.email,'@',1)),
    new.raw_user_meta_data->>'avatar_url'
  )
  on conflict (id) do nothing;
  return new;
end; $$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
