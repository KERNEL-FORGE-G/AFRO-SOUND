/**
 * musicApi.js - Service de musique AFRO SOUND
 * Utilise deux APIs gratuites sans clé :
 *  - Deezer API   → previews 30s, catalogue mondial + afrobeat
 *  - iTunes API   → previews 30s, catalogue Apple Music
 */

import {getApiUrl} from '../config';
import {supabase} from '../supabaseClient';

const DEEZER_BASE = 'https://api.deezer.com';
const ITUNES_BASE = 'https://itunes.apple.com';

/** Recherche via le nouveau backend (Jamendo) */
export const searchJamendo = async (query, limit = 10) => {
  try {
    const res = await fetch(
      `${getApiUrl('/api/jamendo/search')}?query=${encodeURIComponent(
        query,
      )}&limit=${limit}`,
    );
    return await res.json();
  } catch (e) {
    console.warn('[Jamendo search] Erreur:', e.message);
    return [];
  }
};

/**
 * Enregistre un titre dans la base de données via le backend
 */
export const upsertTrack = async track => {
  try {
    const res = await fetch(getApiUrl('/api/tracks/upsert'), {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        id: track.id,
        title: track.title,
        artist: track.artist,
        cover_url: track.cover,
        audio_url: track.audioUrl,
        source: track.source,
        duration: track.duration,
      }),
    });
    const data = await res.json();
    return data;
  } catch (e) {
    console.warn('[upsertTrack] Erreur:', e.message);
    return {success: false, error: e.message};
  }
};

/**
 * Ajoute un titre à une playlist via Supabase Client
 */
export const addTrackToPlaylist = async (playlistId, trackId) => {
  try {
    const {error} = await supabase
      .from('playlist_tracks')
      .upsert([{playlist_id: playlistId, track_id: trackId}], {
        onConflict: 'playlist_id,track_id',
      });
    if (error) {
      throw error;
    }
    return {success: true};
  } catch (e) {
    console.warn('[addTrackToPlaylist] Erreur:', e.message);
    return {success: false, error: e.message};
  }
};

/** Recherche Audius (titres complets en streaming) via le backend */
export const searchAudius = async (query, limit = 10) => {
  try {
    const res = await fetch(
      `${getApiUrl('/api/audius/search')}?query=${encodeURIComponent(
        query,
      )}&limit=${limit}`,
    );
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch (e) {
    console.warn('[Audius search] Erreur:', e.message);
    return [];
  }
};

/** Tendances Audius (genre optionnel, ex. "Afrobeats") via le backend */
export const getAudiusTrending = async (limit = 20, genre = '') => {
  try {
    const url = `${getApiUrl('/api/audius/trending')}?limit=${limit}${
      genre ? `&genre=${encodeURIComponent(genre)}` : ''
    }`;
    const res = await fetch(url);
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch (e) {
    console.warn('[Audius trending] Erreur:', e.message);
    return [];
  }
};

// ─────────────────────────────────────────
// Helpers de normalisation
// ─────────────────────────────────────────

/** Formate un track Deezer en objet unifié */
const normalizeDeezer = track => ({
  id: `deezer_${track.id}`,
  title: track.title,
  artist: track.artist?.name || 'Artiste inconnu',
  album: track.album?.title || '',
  audioUrl: track.preview, // ← MP3 30s
  cover: track.album?.cover_xl || track.album?.cover_medium || null,
  source: 'deezer',
  duration: track.duration || 30,
});

/** Formate un track iTunes en objet unifié */
const normalizeItunes = track => ({
  id: `itunes_${track.trackId}`,
  title: track.trackName,
  artist: track.artistName,
  album: track.collectionName || '',
  audioUrl: track.previewUrl, // ← M4A 30s
  cover: track.artworkUrl100?.replace('100x100', '600x600') || null,
  source: 'itunes',
  duration: 30,
});

// ─────────────────────────────────────────
// RECHERCHES DIRECTES (Deezer / iTunes)
// ─────────────────────────────────────────

export const searchDeezer = async (query, limit = 10) => {
  try {
    const res = await fetch(
      `${DEEZER_BASE}/search?q=${encodeURIComponent(query)}&limit=${limit}`,
    );
    const data = await res.json();
    return (data.data || []).map(normalizeDeezer);
  } catch (e) {
    return [];
  }
};

export const searchItunes = async (query, limit = 10) => {
  try {
    const res = await fetch(
      `${ITUNES_BASE}/search?term=${encodeURIComponent(
        query,
      )}&limit=${limit}&entity=song`,
    );
    const data = await res.json();
    return (data.results || []).map(normalizeItunes);
  } catch (e) {
    return [];
  }
};

// ─────────────────────────────────────────
// SECTIONS HOME (Deezer)
// ─────────────────────────────────────────

export const getDeezerAfrobeats = async (limit = 10) => {
  try {
    const res = await fetch(
      `${DEEZER_BASE}/search?q=afrobeats&limit=${limit}&order=RANKING`,
    );
    const data = await res.json();
    return (data.data || []).map(normalizeDeezer);
  } catch (e) {
    return [];
  }
};

export const getDeezerTopGlobal = async (limit = 10) => {
  try {
    const res = await fetch(`${DEEZER_BASE}/chart/0/tracks?limit=${limit}`);
    const data = await res.json();
    return (data.data || []).map(normalizeDeezer);
  } catch (e) {
    return [];
  }
};

// ─────────────────────────────────────────
// FONCTIONS COMBINÉES (Deezer + iTunes)
// ─────────────────────────────────────────

/**
 * Helper pour ajouter un timeout à une promesse
 */
const withTimeout = (promise, ms) => {
  const timeout = new Promise((_, reject) =>
    setTimeout(() => reject(new Error('Timeout')), ms),
  );
  return Promise.race([promise, timeout]);
};

/**
 * Recherche combinée optimisée : Deezer, Jamendo (via backend) et iTunes
 * @param {string} query
 * @param {number} limit
 * @param {string} [source='all'] - 'all', 'deezer', 'itunes', ou 'jamendo'
 * @param {string} [sortBySource] - Si défini, priorise une source spécifique
 */
export const searchAll = async (query, limit = 10, source = 'all', sortBySource = null) => {
  const tasks = [];

  if (source === 'all' || source === 'deezer') {
    tasks.push(withTimeout(searchDeezer(query, limit), 5000));
  }
  if (source === 'all' || source === 'jamendo') {
    tasks.push(withTimeout(searchJamendo(query, limit), 5000));
  }
  if (source === 'all' || source === 'audius') {
    tasks.push(withTimeout(searchAudius(query, limit), 6000));
  }
  if (source === 'all' || source === 'itunes') {
    tasks.push(withTimeout(searchItunes(query, limit), 5000));
  }

  const results = await Promise.allSettled(tasks);

  const combined = [];

  results.forEach(result => {
    if (result.status === 'fulfilled') {
      combined.push(...result.value);
    }
  });

  // Tri si une source prioritaire est demandée
  if (sortBySource) {
    combined.sort((a, b) => {
      if (a.source === sortBySource && b.source !== sortBySource) return -1;
      if (a.source !== sortBySource && b.source === sortBySource) return 1;
      return 0;
    });
  }

  const uniqueById = new Map();
  combined.forEach(track => {
    if (!uniqueById.has(track.id)) {
      uniqueById.set(track.id, track);
    }
  });

  return Array.from(uniqueById.values());
};

/**
 * Récupère les titres stockés dans la base de données Supabase DIRECTEMENT
 * pour plus de rapidité (outre-passant le backend proxy)
 */
export const getSupabaseSongs = async () => {
  try {
    const {data, error} = await supabase
      .from('tracks')
      .select('*')
      .order('created_at', {ascending: false})
      .limit(20);
    
    if (error) throw error;
    
    return (data || []).map(track => ({
      ...track,
      id: track.id,
      audioUrl: track.audio_url,
      cover: track.cover_url,
    }));
  } catch (e) {
    console.warn('[Supabase songs direct] Erreur:', e.message);
    return [];
  }
};

/**
 * Récupère un titre par son ID
 */
export const fetchLyrics = async (artist, title) => {
  try {
    const res = await fetch(
      `https://api.lyrics.ovh/v1/${encodeURIComponent(artist)}/${encodeURIComponent(title)}`,
    );
    const data = await res.json();
    return data.lyrics || 'Paroles non disponibles.';
  } catch (e) {
    console.warn('[fetchLyrics] Erreur:', e.message);
    return 'Paroles non disponibles.';
  }
};

/**
 * Récupère les données de la page d'accueil
 */
export const getHomeData = async () => {
  const [afrobeats, topGlobal, audiusTrending, customSongs] = await Promise.all(
    [
      getDeezerAfrobeats(10),
      getDeezerTopGlobal(10),
      getAudiusTrending(10),
      getSupabaseSongs(),
    ],
  );

  return {
    afrobeats, // Section "Afrobeats"
    topGlobal, // Section "Top Mondial"
    audiusTrending, // Section "Tendances Audius" (streaming complet)
    customSongs, // Section "Vos titres"
    recentTracks: [...afrobeats.slice(0, 4), ...customSongs.slice(0, 2)],
  };
};
