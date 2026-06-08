/**
 * musicApi.js - Service de musique AFRO SOUND
 * Utilise deux APIs gratuites sans clé :
 *  - Deezer API   → previews 30s, catalogue mondial + afrobeat
 *  - iTunes API   → previews 30s, catalogue Apple Music
 */

<<<<<<< HEAD
import { getBaseUrl } from '../config';
=======
import {getBaseUrl} from '../config';
>>>>>>> upstream/main

const DEEZER_BASE = 'https://api.deezer.com';
const ITUNES_BASE = 'https://itunes.apple.com';

/** Recherche via le nouveau backend (Jamendo) */
export const searchJamendo = async (query, limit = 10) => {
  try {
    const baseUrl = getBaseUrl();
<<<<<<< HEAD
    const res = await fetch(`${baseUrl}/api/jamendo/search?query=${encodeURIComponent(query)}&limit=${limit}`);
=======
    const res = await fetch(
      `${baseUrl}/api/jamendo/search?query=${encodeURIComponent(
        query,
      )}&limit=${limit}`,
    );
>>>>>>> upstream/main
    return await res.json();
  } catch (e) {
    console.warn('[Jamendo search] Erreur:', e.message);
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
<<<<<<< HEAD
  audioUrl: track.preview,                          // ← MP3 30s
=======
  audioUrl: track.preview, // ← MP3 30s
>>>>>>> upstream/main
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
<<<<<<< HEAD
  audioUrl: track.previewUrl,                       // ← M4A 30s
=======
  audioUrl: track.previewUrl, // ← M4A 30s
>>>>>>> upstream/main
  cover: track.artworkUrl100?.replace('100x100', '600x600') || null,
  source: 'itunes',
  duration: 30,
});

// ─────────────────────────────────────────
// DEEZER API
// ─────────────────────────────────────────

/**
 * Recherche des titres via Deezer
 * @param {string} query - Terme de recherche
 * @param {number} limit - Nombre max de résultats
 */
export const searchDeezer = async (query, limit = 20) => {
  try {
    const res = await fetch(
      `${DEEZER_BASE}/search?q=${encodeURIComponent(query)}&limit=${limit}`,
    );
    const data = await res.json();
<<<<<<< HEAD
    if (!data.data) return [];
    return data.data
      .filter(t => t.preview)   // On ne garde que les titres avec preview
=======
    if (!data.data) {
      return [];
    }
    return data.data
      .filter(t => t.preview) // On ne garde que les titres avec preview
>>>>>>> upstream/main
      .map(normalizeDeezer);
  } catch (e) {
    console.warn('[Deezer search] Erreur:', e.message);
    return [];
  }
};

/**
 * Récupère le top Afrobeats de Deezer (chart genre 116)
 */
export const getDeezerAfrobeats = async (limit = 20) => {
  try {
<<<<<<< HEAD
    const res = await fetch(
      `${DEEZER_BASE}/chart/116/tracks?limit=${limit}`,
    );
    const data = await res.json();
    if (!data.data) return [];
=======
    const res = await fetch(`${DEEZER_BASE}/chart/116/tracks?limit=${limit}`);
    const data = await res.json();
    if (!data.data) {
      return [];
    }
>>>>>>> upstream/main
    return data.data.filter(t => t.preview).map(normalizeDeezer);
  } catch (e) {
    console.warn('[Deezer afrobeats] Erreur:', e.message);
    return [];
  }
};

/**
 * Récupère le top mondial Deezer
 */
export const getDeezerTopGlobal = async (limit = 20) => {
  try {
<<<<<<< HEAD
    const res = await fetch(
      `${DEEZER_BASE}/chart/0/tracks?limit=${limit}`,
    );
    const data = await res.json();
    if (!data.data) return [];
=======
    const res = await fetch(`${DEEZER_BASE}/chart/0/tracks?limit=${limit}`);
    const data = await res.json();
    if (!data.data) {
      return [];
    }
>>>>>>> upstream/main
    return data.data.filter(t => t.preview).map(normalizeDeezer);
  } catch (e) {
    console.warn('[Deezer top] Erreur:', e.message);
    return [];
  }
};

/**
 * Récupère les titres d'un artiste Deezer
 * @param {string} artistName
 */
export const getDeezerArtistTracks = async (artistName, limit = 10) => {
  try {
    const res = await fetch(
<<<<<<< HEAD
      `${DEEZER_BASE}/search?q=artist:"${encodeURIComponent(artistName)}"&limit=${limit}`,
    );
    const data = await res.json();
    if (!data.data) return [];
=======
      `${DEEZER_BASE}/search?q=artist:"${encodeURIComponent(
        artistName,
      )}"&limit=${limit}`,
    );
    const data = await res.json();
    if (!data.data) {
      return [];
    }
>>>>>>> upstream/main
    return data.data.filter(t => t.preview).map(normalizeDeezer);
  } catch (e) {
    console.warn('[Deezer artist] Erreur:', e.message);
    return [];
  }
};

// ─────────────────────────────────────────
// ITUNES API
// ─────────────────────────────────────────

/**
 * Recherche des titres via iTunes
 * @param {string} query
 * @param {number} limit
 */
export const searchItunes = async (query, limit = 20) => {
  try {
    const res = await fetch(
<<<<<<< HEAD
      `${ITUNES_BASE}/search?term=${encodeURIComponent(query)}&media=music&limit=${limit}&entity=song`,
    );
    const data = await res.json();
    if (!data.results) return [];
    return data.results
      .filter(t => t.previewUrl)
      .map(normalizeItunes);
=======
      `${ITUNES_BASE}/search?term=${encodeURIComponent(
        query,
      )}&media=music&limit=${limit}&entity=song`,
    );
    const data = await res.json();
    if (!data.results) {
      return [];
    }
    return data.results.filter(t => t.previewUrl).map(normalizeItunes);
>>>>>>> upstream/main
  } catch (e) {
    console.warn('[iTunes search] Erreur:', e.message);
    return [];
  }
};

/**
 * Recherche les titres afrobeat sur iTunes
 */
export const getItunesAfrobeats = async (limit = 20) => {
  return searchItunes('afrobeats 2024', limit);
};

// ─────────────────────────────────────────
// FONCTIONS COMBINÉES (Deezer + iTunes)
// ─────────────────────────────────────────

/**
<<<<<<< HEAD
 * Recherche combinée : Deezer, Jamendo (via backend) et iTunes
 */
export const searchAll = async (query, limit = 10) => {
  const [deezerResults, jamendoResults, itunesResults] = await Promise.all([
    searchDeezer(query, limit),
    searchJamendo(query, limit),
    searchItunes(query, limit),
  ]);

  // Intercale les résultats
  const combined = [];
  const maxLen = Math.max(deezerResults.length, jamendoResults.length, itunesResults.length);
  for (let i = 0; i < maxLen; i++) {
    if (deezerResults[i]) combined.push(deezerResults[i]);
    if (jamendoResults[i]) combined.push(jamendoResults[i]);
    if (itunesResults[i]) combined.push(itunesResults[i]);
  }
=======
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
 */
export const searchAll = async (query, limit = 10, source = 'all') => {
  const tasks = [];

  if (source === 'all' || source === 'deezer') {
    tasks.push(withTimeout(searchDeezer(query, limit), 5000));
  }
  if (source === 'all' || source === 'jamendo') {
    tasks.push(withTimeout(searchJamendo(query, limit), 5000));
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

>>>>>>> upstream/main
  return combined;
};

/**
 * Récupère les titres stockés dans la base de données Supabase via le backend
 */
export const getSupabaseSongs = async () => {
  try {
    const baseUrl = getBaseUrl();
    const res = await fetch(`${baseUrl}/api/songs`);
    return await res.json();
  } catch (e) {
    console.warn('[Supabase songs] Erreur:', e.message);
    return [];
  }
};

/**
 * Récupère les données de la page d'accueil
 */
export const getHomeData = async () => {
  const [afrobeats, topGlobal, itunesAfro, customSongs] = await Promise.all([
    getDeezerAfrobeats(10),
    getDeezerTopGlobal(10),
    getItunesAfrobeats(8),
    getSupabaseSongs(),
  ]);

  return {
<<<<<<< HEAD
    afrobeats,          // Section "Afrobeats"
    topGlobal,          // Section "Top Mondial"
    itunesAfro,         // Section "Découvertes"
    customSongs,        // Section "Vos titres"
=======
    afrobeats, // Section "Afrobeats"
    topGlobal, // Section "Top Mondial"
    itunesAfro, // Section "Découvertes"
    customSongs, // Section "Vos titres"
>>>>>>> upstream/main
    recentTracks: [...afrobeats.slice(0, 4), ...customSongs.slice(0, 2)],
  };
};
