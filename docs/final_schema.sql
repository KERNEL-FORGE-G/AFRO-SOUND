-- ============================================================
-- AFRO SOUND — Schéma Supabase Complet & Optimisé
-- Version : 1.1 (Support Multi-Sources + Stats)
-- ============================================================

-- Extensions
create extension if not exists "uuid-ossp";

-- 1. PROFILES (utilisateurs)
create table if not exists public.profiles (
  id          uuid references auth.users on delete cascade primary key,
  username    text unique,
  avatar_url  text,
  bio         text,
  created_at  timestamp with time zone default now()
);

-- 2. TRACKS (musiques - Support IDs externes Audius/Jamendo)
create table if not exists public.tracks (
  id          text primary key, -- ex: 'audius_123', 'jamendo_456'
  title       text not null,
  artist      text,             -- Nom de l'artiste (texte pour flexibilité)
  album       text,             -- Nom de l'album (texte pour flexibilité)
  cover_url   text,
  audio_url   text not null,
  source      text,             -- 'audius', 'jamendo', 'local', etc.
  duration    int default 0,    -- en secondes
  play_count  int default 0,
  created_at  timestamp with time zone default now()
);

-- 3. FAVORITES (musiques aimées)
create table if not exists public.favorites (
  user_id     uuid references auth.users(id) on delete cascade not null,
  track_id    text references public.tracks(id) on delete cascade not null,
  created_at  timestamp with time zone default now(),
  primary key (user_id, track_id)
);

-- 4. PLAYLISTS
create table if not exists public.playlists (
  id          uuid default uuid_generate_v4() primary key,
  user_id     uuid references auth.users(id) on delete cascade not null,
  name        text not null,
  cover_url   text,
  is_public   boolean not null default false,
  created_at  timestamp with time zone default now()
);

-- 5. PLAYLIST_TRACKS (relation playlist <-> musique)
create table if not exists public.playlist_tracks (
  playlist_id uuid references public.playlists(id) on delete cascade not null,
  track_id    text references public.tracks(id) on delete cascade not null,
  position    int not null default 0,
  added_at    timestamp with time zone default now(),
  primary key (playlist_id, track_id)
);

-- 6. PLAY_HISTORY (Historique d'écoute pour les stats)
create table if not exists public.play_history (
  id          bigint generated always as identity primary key,
  user_id     uuid references auth.users(id) on delete cascade,
  track_id    text references public.tracks(id) on delete cascade,
  played_at   timestamp with time zone default now()
);

-- 7. SEARCH_HISTORY (Historique des recherches pour les stats)
create table if not exists public.search_history (
  id          bigint generated always as identity primary key,
  user_id     uuid references auth.users(id) on delete cascade,
  query       text not null,
  created_at  timestamp with time zone default now()
);

-- ============================================================
-- INDEX & PERFORMANCE
-- ============================================================
create index if not exists idx_tracks_source     on public.tracks(source);
create index if not exists idx_playlists_user    on public.playlists(user_id);
create index if not exists idx_favorites_user    on public.favorites(user_id);
create index if not exists idx_play_history_user on public.play_history(user_id);

-- Recherche full-text sur les titres
create index if not exists idx_tracks_title_search on public.tracks using gin(to_tsvector('french', title));

-- ============================================================
-- FONCTIONS & TRIGGERS
-- ============================================================

-- Création automatique du profil à l'inscription
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, username, avatar_url)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'username', split_part(new.email, '@', 1)),
    new.raw_user_meta_data->>'avatar_url'
  )
  on conflict (id) do nothing;
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ============================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================
alter table public.profiles         enable row level security;
alter table public.tracks           enable row level security;
alter table public.favorites        enable row level security;
alter table public.playlists        enable row level security;
alter table public.playlist_tracks  enable row level security;
alter table public.play_history     enable row level security;
alter table public.search_history   enable row level security;

-- Policies (Simplifiées pour le dev, à restreindre pour la prod)

create policy "Lecture publique tracks" on public.tracks for select using (true);
create policy "Lecture publique profiles" on public.profiles for select using (true);

create policy "Gestion favoris perso" on public.favorites
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "Gestion playlists perso" on public.playlists
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "Lecture playlists publiques" on public.playlists
  for select using (is_public = true);

create policy "Gestion tracks playlist perso" on public.playlist_tracks
  for all using (
    exists (select 1 from public.playlists where id = playlist_id and user_id = auth.uid())
  );

create policy "Gestion historique perso" on public.play_history
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "Gestion recherches perso" on public.search_history
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
