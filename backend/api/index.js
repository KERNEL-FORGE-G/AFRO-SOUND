const express = require('express');
const cors = require('cors');
const axios = require('axios');
const {createClient} = require('@supabase/supabase-js');
const DASHBOARD_HTML = require('./dashboard');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

let supabase = null;
if (process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) {
  supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
  );
}

const JAMENDO_CLIENT_ID = process.env.JAMENDO_CLIENT_ID;
const AUDIUS_APP_NAME = process.env.AUDIUS_APP_NAME || 'AFRO_SOUND';
const ADMIN_KEY = process.env.ADMIN_KEY || 'afrosound_secret_2026';

const AUDIUS_FALLBACK_HOST = 'https://discoveryprovider.audius.co';
let audiusHost = null;

async function getAudiusHost() {
  if (audiusHost) {
    return audiusHost;
  }
  try {
    const {data} = await axios.get('https://api.audius.co', {timeout: 5000});
    if (Array.isArray(data?.data) && data.data.length) {
      audiusHost = data.data[0];
    }
  } catch (e) {
    console.warn('[Audius] Host resolution failed:', e.message);
  }
  return audiusHost || AUDIUS_FALLBACK_HOST;
}

function normalizeAudius(track, host) {
  const art = track.artwork || {};
  return {
    id: `audius_${track.id}`,
    title: track.title,
    artist: track.user?.name || 'Unknown Artist',
    album: '',
    audioUrl: `${host}/v1/tracks/${track.id}/stream?app_name=${AUDIUS_APP_NAME}`,
    cover: art['480x480'] || art['1000x1000'] || art['150x150'] || null,
    source: 'audius',
    duration: track.duration || 0,
  };
}

// Middleware d'authentification simple
function auth(req, res, next) {
  const key = req.headers['x-admin-key'] || req.query.key;
  if (key === ADMIN_KEY) {
    next();
  } else {
    res.status(401).json({success: false, error: 'Unauthorized'});
  }
}

app.get(['/', '/dashboard'], (req, res) => {
  res.set('Content-Type', 'text/html; charset=utf-8').send(DASHBOARD_HTML);
});

app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    status: 'ok',
    message: 'AfroSound Backend is running',
  });
});

app.get('/api/status', async (req, res) => {
  let audiusReachable = false;
  try {
    audiusReachable = Boolean(await getAudiusHost());
  } catch (e) {
    audiusReachable = false;
  }
  res.json({
    success: true,
    uptimeSeconds: Math.round(process.uptime()),
    node: process.version,
    env: {
      supabase: Boolean(supabase),
      audiusAppName: AUDIUS_APP_NAME,
      jamendo: Boolean(JAMENDO_CLIENT_ID),
    },
    audiusReachable,
    timestamp: new Date().toISOString(),
  });
});

app.get('/api/audius/search', async (req, res) => {
  const {query, limit = 10} = req.query;
  if (!query) {
    return res
      .status(400)
      .json({success: false, error: 'Query parameter required'});
  }
  try {
    const host = await getAudiusHost();
    const response = await axios.get(`${host}/v1/tracks/search`, {
      params: {query, app_name: AUDIUS_APP_NAME, limit},
      timeout: 10000,
    });
    const tracks = (response.data?.data || []).map(t =>
      normalizeAudius(t, host),
    );
    res.json(tracks); // On garde le format array pour la compatibilité frontend
  } catch (error) {
    res.status(502).json({success: false, error: 'Audius fetch failed'});
  }
});

app.get('/api/audius/trending', async (req, res) => {
  const {genre, limit = 20} = req.query;
  try {
    const host = await getAudiusHost();
    const response = await axios.get(`${host}/v1/tracks/trending`, {
      params: {app_name: AUDIUS_APP_NAME, ...(genre ? {genre} : {})},
      timeout: 10000,
    });
    const tracks = (response.data?.data || [])
      .slice(0, Number(limit))
      .map(t => normalizeAudius(t, host));
    res.json(tracks); // Compatibilité
  } catch (error) {
    res
      .status(502)
      .json({success: false, error: 'Audius trending fetch failed'});
  }
});

app.get('/api/jamendo/search', async (req, res) => {
  const {query, limit = 10} = req.query;
  if (!query) {
    return res
      .status(400)
      .json({success: false, error: 'Query parameter required'});
  }
  try {
    const response = await axios.get('https://api.jamendo.com/v3.0/tracks/', {
      params: {
        client_id: JAMENDO_CLIENT_ID,
        format: 'json',
        limit: limit,
        namesearch: query,
        include: 'musicinfo',
      },
    });
    const tracks = response.data.results.map(track => ({
      id: `jamendo_${track.id}`,
      title: track.name,
      artist: track.artist_name,
      album: track.album_name,
      audioUrl: track.audio,
      cover: track.album_image,
      source: 'jamendo',
      duration: track.duration,
    }));
    res.json(tracks); // Compatibilité
  } catch (error) {
    res.status(500).json({success: false, error: 'Jamendo fetch failed'});
  }
});

app.get('/api/songs', async (req, res) => {
  if (!supabase) {
    return res
      .status(503)
      .json({success: false, error: 'Supabase not configured'});
  }
  try {
    let {data, error} = await supabase
      .from('tracks')
      .select('*')
      .order('created_at', {ascending: false});
    if (error) {
      throw error;
    }
    res.json(data || []); // Compatibilité
  } catch (error) {
    res.status(500).json({success: false, error: error.message});
  }
});

app.post('/api/tracks/upsert', async (req, res) => {
  if (!supabase) {
    return res
      .status(503)
      .json({success: false, error: 'Supabase indisponible'});
  }
  try {
    const {id, title, artist, cover_url, audio_url, source, duration} =
      req.body;
    if (!id || !title) {
      return res
        .status(400)
        .json({success: false, error: 'ID et Titre requis'});
    }

    const {data, error} = await supabase
      .from('tracks')
      .upsert([{id, title, artist, cover_url, audio_url, source, duration}], {
        onConflict: 'id',
      })
      .select();

    if (error) {
      throw error;
    }
    res.json({success: true, data: data[0]});
  } catch (error) {
    res.status(400).json({success: false, error: error.message});
  }
});

// --- ADMIN ROUTES (Protected) ---

app.get('/api/admin/ping/supabase', auth, async (req, res) => {
  if (!supabase) {
    return res
      .status(503)
      .json({success: false, error: 'Supabase non configuré'});
  }
  try {
    const {data, error} = await supabase.from('tracks').select('id').limit(1);
    if (error) {
      throw error;
    }
    res.json({success: true, message: 'Connexion Supabase OK', data});
  } catch (error) {
    res.status(500).json({success: false, error: error.message});
  }
});

app.get('/api/admin/ping/audio', auth, async (req, res) => {
  const {url} = req.query;
  if (!url) {
    return res.status(400).json({success: false, error: 'URL manquante'});
  }
  try {
    const response = await axios.head(url, {timeout: 5000});
    res.json({
      success: true,
      status: response.status,
      contentType: response.headers['content-type'],
    });
  } catch (error) {
    res.status(500).json({success: false, error: error.message});
  }
});

app.post('/api/admin/tracks', auth, async (req, res) => {
  if (!supabase) {
    return res
      .status(503)
      .json({success: false, error: 'Supabase indisponible'});
  }
  try {
    const {id, title, artist, cover_url, audio_url, source, duration} =
      req.body;
    const {data, error} = await supabase
      .from('tracks')
      .upsert([{id, title, artist, cover_url, audio_url, source, duration}]);
    if (error) {
      throw error;
    }
    res.json({success: true, data});
  } catch (error) {
    res.status(400).json({success: false, error: error.message});
  }
});

app.delete('/api/admin/tracks/:id', auth, async (req, res) => {
  if (!supabase) {
    return res
      .status(503)
      .json({success: false, error: 'Supabase indisponible'});
  }
  try {
    const {error} = await supabase
      .from('tracks')
      .delete()
      .eq('id', req.params.id);
    if (error) {
      throw error;
    }
    res.json({success: true});
  } catch (error) {
    res.status(400).json({success: false, error: error.message});
  }
});

app.get('/api/admin/playlists', auth, async (req, res) => {
  if (!supabase) {
    return res
      .status(503)
      .json({success: false, error: 'Supabase indisponible'});
  }
  try {
    const {data, error} = await supabase
      .from('playlists')
      .select('*, profiles(username)');
    if (error) {
      throw error;
    }
    res.json({success: true, data});
  } catch (error) {
    res.status(400).json({success: false, error: error.message});
  }
});

app.delete('/api/admin/playlists/:id', auth, async (req, res) => {
  if (!supabase) {
    return res
      .status(503)
      .json({success: false, error: 'Supabase indisponible'});
  }
  try {
    const {error} = await supabase
      .from('playlists')
      .delete()
      .eq('id', req.params.id);
    if (error) {
      throw error;
    }
    res.json({success: true});
  } catch (error) {
    res.status(400).json({success: false, error: error.message});
  }
});

app.get('/api/admin/profiles', auth, async (req, res) => {
  if (!supabase) {
    return res
      .status(503)
      .json({success: false, error: 'Supabase indisponible'});
  }
  try {
    const {data, error} = await supabase.from('profiles').select('*');
    if (error) {
      throw error;
    }
    res.json({success: true, data});
  } catch (error) {
    res.status(400).json({success: false, error: error.message});
  }
});

app.get('/api/admin/stats', auth, async (req, res) => {
  if (!supabase) {
    return res
      .status(503)
      .json({success: false, error: 'Supabase indisponible'});
  }
  try {
    // 1. Comptages globaux (Optimisé: head: true)
    const {count: profileCount} = await supabase
      .from('profiles')
      .select('*', {count: 'exact', head: true});
    const {count: trackCount} = await supabase
      .from('tracks')
      .select('*', {count: 'exact', head: true});
    const {count: playlistCount} = await supabase
      .from('playlists')
      .select('*', {count: 'exact', head: true});

    // 2. Répartition par source (Aggégration SQL simulée via select partiel)
    const {data: trackSources} = await supabase.from('tracks').select('source');
    const sourceCounts = (trackSources || []).reduce((acc, t) => {
      const s = t.source || 'inconnue';
      acc[s] = (acc[s] || 0) + 1;
      return acc;
    }, {});

    // 3. Répartition playlists (Optimisé)
    const {data: playlistVisibility} = await supabase
      .from('playlists')
      .select('is_public');
    const visibilityCounts = (playlistVisibility || []).reduce(
      (acc, p) => {
        const key = p.is_public ? 'publique' : 'privée';
        acc[key] = (acc[key] || 0) + 1;
        return acc;
      },
      {publique: 0, privée: 0},
    );

    // 4. Top 5 des morceaux les plus écoutés
    const {data: playHistory} = await supabase
      .from('play_history')
      .select('track_id, tracks(title, artist)')
      .limit(2000);

    const trackPlays = (playHistory || []).reduce((acc, ph) => {
      if (!ph.track_id) {
        return acc;
      }
      if (!acc[ph.track_id]) {
        acc[ph.track_id] = {
          count: 0,
          title: ph.tracks?.title || 'Titre inconnu',
          artist: ph.tracks?.artist || 'Artiste inconnu',
        };
      }
      acc[ph.track_id].count++;
      return acc;
    }, {});

    const topTracks = Object.values(trackPlays)
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    // 5. Recherches les plus fréquentes
    const {data: searchHistory} = await supabase
      .from('search_history')
      .select('query')
      .limit(1000);

    const searchCounts = (searchHistory || []).reduce((acc, s) => {
      const q = s.query?.toLowerCase().trim();
      if (q) {
        acc[q] = (acc[q] || 0) + 1;
      }
      return acc;
    }, {});

    const topSearches = Object.entries(searchCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([query, count]) => ({query, count}));

    res.json({
      success: true,
      data: {
        counts: {
          profiles: profileCount || 0,
          tracks: trackCount || 0,
          playlists: playlistCount || 0,
        },
        trackSources: sourceCounts,
        playlistVisibility: visibilityCounts,
        topTracks,
        topSearches,
      },
    });
  } catch (error) {
    res.status(500).json({success: false, error: error.message});
  }
});

if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () =>
    console.log(`Server running on http://localhost:${PORT}`),
  );
}

module.exports = app;
