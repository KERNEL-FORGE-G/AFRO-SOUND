const express = require('express');
const cors = require('cors');
const axios = require('axios');
const {createClient} = require('@supabase/supabase-js');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Initialisation Supabase (paresseuse : on n'instancie le client que si les
// variables d'environnement sont présentes, sinon supabase-js lève une erreur
// au démarrage et fait planter TOUTE la fonction, y compris /api/health).
let supabase = null;
if (process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) {
  supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
  );
} else {
  console.warn(
    '[Backend] SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY manquants : ' +
      'les routes Supabase sont désactivées.',
  );
}

const JAMENDO_CLIENT_ID = process.env.JAMENDO_CLIENT_ID;

// ── Audius ────────────────────────────────────────────────────────────────
// La lecture/recherche Audius est gratuite et ne demande qu'un app_name.
const AUDIUS_APP_NAME = process.env.AUDIUS_APP_NAME || 'AFRO_SOUND';
const AUDIUS_FALLBACK_HOST = 'https://discoveryprovider.audius.co';
let audiusHost = null;

// Résout (et met en cache) un hôte "discovery provider" Audius.
async function getAudiusHost() {
  if (audiusHost) {
    return audiusHost;
  }
  try {
    const {data} = await axios.get('https://api.audius.co', {timeout: 8000});
    if (Array.isArray(data?.data) && data.data.length) {
      audiusHost = data.data[0];
    }
  } catch (e) {
    console.warn('[Audius] Résolution hôte échouée:', e.message);
  }
  return audiusHost || AUDIUS_FALLBACK_HOST;
}

// Normalise un track Audius vers l'objet unifié de l'app.
function normalizeAudius(track, host) {
  const art = track.artwork || {};
  return {
    id: `audius_${track.id}`,
    title: track.title,
    artist: track.user?.name || 'Artiste inconnu',
    album: '',
    audioUrl: `${host}/v1/tracks/${track.id}/stream?app_name=${AUDIUS_APP_NAME}`,
    cover: art['480x480'] || art['1000x1000'] || art['150x150'] || null,
    source: 'audius',
    duration: track.duration || 0,
  };
}

// Route de test
app.get('/api/health', (req, res) => {
  res.json({status: 'ok', message: 'AfroSound Backend is running'});
});

// Proxy Audius — recherche
app.get('/api/audius/search', async (req, res) => {
  const {query, limit = 10} = req.query;
  if (!query) {
    return res.status(400).json({error: 'Query parameter is required'});
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
    res.json(tracks);
  } catch (error) {
    console.error('Audius search error:', error.message);
    res.status(502).json({error: 'Failed to fetch from Audius'});
  }
});

// Proxy Audius — tendances (genre optionnel, ex. "Afrobeats")
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
    res.json(tracks);
  } catch (error) {
    console.error('Audius trending error:', error.message);
    res.status(502).json({error: 'Failed to fetch trending from Audius'});
  }
});

// Redirige vers le flux audio d'un track Audius (id sans le préfixe "audius_")
app.get('/api/audius/stream/:id', async (req, res) => {
  try {
    const host = await getAudiusHost();
    const id = req.params.id.replace(/^audius_/, '');
    res.redirect(
      302,
      `${host}/v1/tracks/${id}/stream?app_name=${AUDIUS_APP_NAME}`,
    );
  } catch (error) {
    console.error('Audius stream error:', error.message);
    res.status(502).json({error: 'Failed to resolve Audius stream'});
  }
});

// Proxy Jamendo
app.get('/api/jamendo/search', async (req, res) => {
  const {query, limit = 10} = req.query;

  if (!query) {
    return res.status(400).json({error: 'Query parameter is required'});
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

    res.json(tracks);
  } catch (error) {
    console.error('Jamendo API error:', error.message);
    res.status(500).json({error: 'Failed to fetch from Jamendo'});
  }
});

// Route pour récupérer les chansons depuis Supabase
app.get('/api/songs', async (req, res) => {
  if (!supabase) {
    return res
      .status(503)
      .json({error: 'Supabase non configuré sur le serveur'});
  }
  try {
    // On essaie d'abord 'songs', sinon 'tracks'
    let {data, error} = await supabase
      .from('songs')
      .select('*')
      .order('created_at', {ascending: false});

    if (error || !data || data.length === 0) {
      const {data: tracksData, error: tracksError} = await supabase
        .from('tracks')
        .select('*, artists(name)')
        .order('created_at', {ascending: false});

      if (!tracksError) {
        data = tracksData.map(t => ({
          ...t,
          artist: t.artists?.name || t.artist,
          cover: t.cover_url || t.cover,
        }));
      }
    }

    res.json(data || []);
  } catch (error) {
    res.status(500).json({error: error.message});
  }
});

// Exporter pour Vercel
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
}

module.exports = app;
