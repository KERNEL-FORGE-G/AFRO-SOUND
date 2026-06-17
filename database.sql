-- ============================================================================
-- AFRO SOUND — SCHÉMA FINAL (GESTION PROFIL CÔTÉ CLIENT)
-- ============================================================================

-- 1. Nettoyage TOTAL pour repartir sur une base saine
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

DROP TABLE IF EXISTS public.play_history CASCADE;
DROP TABLE IF EXISTS public.playlist_tracks CASCADE;
DROP TABLE IF EXISTS public.playlists CASCADE;
DROP TABLE IF EXISTS public.favorites CASCADE;
DROP TABLE IF EXISTS public.tracks CASCADE;
DROP TABLE IF EXISTS public.profiles CASCADE;

-- 2. Création des tables
CREATE TABLE public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE public.tracks (
  id text PRIMARY KEY,
  title text NOT NULL,
  artist text,
  album text,
  cover_url text,
  audio_url text,
  source text,
  duration int,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE public.favorites (
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  track_id text REFERENCES public.tracks(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now(),
  PRIMARY KEY (user_id, track_id)
);

CREATE TABLE public.playlists (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  is_public boolean DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE public.playlist_tracks (
  playlist_id uuid REFERENCES public.playlists(id) ON DELETE CASCADE,
  track_id text REFERENCES public.tracks(id) ON DELETE CASCADE,
  position int DEFAULT 0,
  PRIMARY KEY (playlist_id, track_id)
);

-- 3. Désactivation RLS (Pour faciliter le développement)
ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.tracks DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.favorites DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.playlists DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.playlist_tracks DISABLE ROW LEVEL SECURITY;
