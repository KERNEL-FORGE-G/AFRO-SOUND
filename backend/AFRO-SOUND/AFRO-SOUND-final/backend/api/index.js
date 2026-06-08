const express = require('express');
const cors = require('cors');
const axios = require('axios');
<<<<<<< HEAD:backend/AFRO-SOUND/AFRO-SOUND-final/backend/api/index.js
const { createClient } = require('@supabase/supabase-js');
=======
<<<<<<< HEAD
const { createClient } = require('@supabase/supabase-js');
=======
const {createClient} = require('@supabase/supabase-js');
>>>>>>> upstream/main
>>>>>>> 6ca20f0853c25da4ea3c9ac371a85fe442bfef22:backend/api/index.js
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Initialisation Supabase
const supabase = createClient(
  process.env.SUPABASE_URL || '',
<<<<<<< HEAD:backend/AFRO-SOUND/AFRO-SOUND-final/backend/api/index.js
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
=======
<<<<<<< HEAD
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
=======
  process.env.SUPABASE_SERVICE_ROLE_KEY || '',
>>>>>>> upstream/main
>>>>>>> 6ca20f0853c25da4ea3c9ac371a85fe442bfef22:backend/api/index.js
);

const JAMENDO_CLIENT_ID = process.env.JAMENDO_CLIENT_ID;

// Route de test
app.get('/api/health', (req, res) => {
<<<<<<< HEAD:backend/AFRO-SOUND/AFRO-SOUND-final/backend/api/index.js
  res.json({ status: 'ok', message: 'AfroSound Backend is running' });
=======
<<<<<<< HEAD
  res.json({ status: 'ok', message: 'AfroSound Backend is running' });
=======
  res.json({status: 'ok', message: 'AfroSound Backend is running'});
>>>>>>> upstream/main
>>>>>>> 6ca20f0853c25da4ea3c9ac371a85fe442bfef22:backend/api/index.js
});

// Proxy Jamendo
app.get('/api/jamendo/search', async (req, res) => {
<<<<<<< HEAD:backend/AFRO-SOUND/AFRO-SOUND-final/backend/api/index.js
  const { query, limit = 10 } = req.query;
  
  if (!query) {
    return res.status(400).json({ error: 'Query parameter is required' });
=======
<<<<<<< HEAD
  const { query, limit = 10 } = req.query;
  
  if (!query) {
    return res.status(400).json({ error: 'Query parameter is required' });
=======
  const {query, limit = 10} = req.query;

  if (!query) {
    return res.status(400).json({error: 'Query parameter is required'});
>>>>>>> upstream/main
>>>>>>> 6ca20f0853c25da4ea3c9ac371a85fe442bfef22:backend/api/index.js
  }

  try {
    const response = await axios.get('https://api.jamendo.com/v3.0/tracks/', {
      params: {
        client_id: JAMENDO_CLIENT_ID,
        format: 'json',
        limit: limit,
        namesearch: query,
<<<<<<< HEAD:backend/AFRO-SOUND/AFRO-SOUND-final/backend/api/index.js
        include: 'musicinfo'
      }
=======
<<<<<<< HEAD
        include: 'musicinfo'
      }
=======
        include: 'musicinfo',
      },
>>>>>>> upstream/main
>>>>>>> 6ca20f0853c25da4ea3c9ac371a85fe442bfef22:backend/api/index.js
    });

    const tracks = response.data.results.map(track => ({
      id: `jamendo_${track.id}`,
      title: track.name,
      artist: track.artist_name,
      album: track.album_name,
      audioUrl: track.audio,
      cover: track.album_image,
      source: 'jamendo',
<<<<<<< HEAD:backend/AFRO-SOUND/AFRO-SOUND-final/backend/api/index.js
      duration: track.duration
=======
<<<<<<< HEAD
      duration: track.duration
=======
      duration: track.duration,
>>>>>>> upstream/main
>>>>>>> 6ca20f0853c25da4ea3c9ac371a85fe442bfef22:backend/api/index.js
    }));

    res.json(tracks);
  } catch (error) {
    console.error('Jamendo API error:', error.message);
<<<<<<< HEAD:backend/AFRO-SOUND/AFRO-SOUND-final/backend/api/index.js
    res.status(500).json({ error: 'Failed to fetch from Jamendo' });
=======
<<<<<<< HEAD
    res.status(500).json({ error: 'Failed to fetch from Jamendo' });
=======
    res.status(500).json({error: 'Failed to fetch from Jamendo'});
>>>>>>> upstream/main
>>>>>>> 6ca20f0853c25da4ea3c9ac371a85fe442bfef22:backend/api/index.js
  }
});

// Route pour récupérer les chansons depuis Supabase
app.get('/api/songs', async (req, res) => {
  try {
    // On essaie d'abord 'songs', sinon 'tracks'
<<<<<<< HEAD:backend/AFRO-SOUND/AFRO-SOUND-final/backend/api/index.js
    let { data, error } = await supabase
=======
<<<<<<< HEAD
    let { data, error } = await supabase
      .from('songs')
      .select('*')
      .order('created_at', { ascending: false });

    if (error || !data || data.length === 0) {
      const { data: tracksData, error: tracksError } = await supabase
        .from('tracks')
        .select('*, artists(name)')
        .order('created_at', { ascending: false });
      
=======
    let {data, error} = await supabase
>>>>>>> 6ca20f0853c25da4ea3c9ac371a85fe442bfef22:backend/api/index.js
      .from('songs')
      .select('*')
      .order('created_at', { ascending: false });

    if (error || !data || data.length === 0) {
      const { data: tracksData, error: tracksError } = await supabase
        .from('tracks')
        .select('*, artists(name)')
<<<<<<< HEAD:backend/AFRO-SOUND/AFRO-SOUND-final/backend/api/index.js
        .order('created_at', { ascending: false });
      
=======
        .order('created_at', {ascending: false});

>>>>>>> upstream/main
>>>>>>> 6ca20f0853c25da4ea3c9ac371a85fe442bfef22:backend/api/index.js
      if (!tracksError) {
        data = tracksData.map(t => ({
          ...t,
          artist: t.artists?.name || t.artist,
<<<<<<< HEAD:backend/AFRO-SOUND/AFRO-SOUND-final/backend/api/index.js
          cover: t.cover_url || t.cover
=======
<<<<<<< HEAD
          cover: t.cover_url || t.cover
=======
          cover: t.cover_url || t.cover,
>>>>>>> upstream/main
>>>>>>> 6ca20f0853c25da4ea3c9ac371a85fe442bfef22:backend/api/index.js
        }));
      }
    }

    res.json(data || []);
  } catch (error) {
<<<<<<< HEAD:backend/AFRO-SOUND/AFRO-SOUND-final/backend/api/index.js
    res.status(500).json({ error: error.message });
=======
<<<<<<< HEAD
    res.status(500).json({ error: error.message });
=======
    res.status(500).json({error: error.message});
>>>>>>> upstream/main
>>>>>>> 6ca20f0853c25da4ea3c9ac371a85fe442bfef22:backend/api/index.js
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
