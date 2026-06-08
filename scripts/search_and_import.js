require('dotenv').config();
const axios = require('axios');
<<<<<<< HEAD
const { createClient } = require('@supabase/supabase-js');
=======
const {createClient} = require('@supabase/supabase-js');
>>>>>>> upstream/main

// Initialisation sécurisée
const supabase = createClient(
  process.env.SUPABASE_URL,
<<<<<<< HEAD
  process.env.SUPABASE_SERVICE_ROLE_KEY
=======
  process.env.SUPABASE_SERVICE_ROLE_KEY,
>>>>>>> upstream/main
);

async function searchAndImport() {
  const query = process.argv[2]; // Récupère l'argument de recherche
  if (!query) {
<<<<<<< HEAD
    console.error("Veuillez fournir un terme de recherche. Exemple : node scripts/search_and_import.js 'burna boy'");
=======
    console.error(
      "Veuillez fournir un terme de recherche. Exemple : node scripts/search_and_import.js 'burna boy'",
    );
>>>>>>> upstream/main
    return;
  }

  try {
    console.log(`Recherche Jamendo pour : ${query}...`);
    const response = await axios.get('https://api.jamendo.com/v3.0/tracks/', {
      params: {
        client_id: process.env.JAMENDO_CLIENT_ID,
        format: 'json',
        limit: 10,
<<<<<<< HEAD
        namesearch: query
      }
    });

    const tracks = response.data.results;
    if (tracks.length === 0) { console.log("Aucun résultat."); return; }
=======
        namesearch: query,
      },
    });

    const tracks = response.data.results;
    if (tracks.length === 0) {
      console.log('Aucun résultat.');
      return;
    }
>>>>>>> upstream/main

    for (const track of tracks) {
      console.log(`Importation : ${track.name}`);
      // Insertion dans Supabase
<<<<<<< HEAD
      const { error } = await supabase.from('songs').insert([
=======
      const {error} = await supabase.from('songs').insert([
>>>>>>> upstream/main
        {
          title: track.name,
          artist: track.artist_name,
          audio_url: track.audio,
          cover_url: track.album_image,
<<<<<<< HEAD
          duration: track.duration
        }
      ]);
      if (error) console.error("Erreur insertion:", error.message);
    }
    console.log("Recherche et import terminés !");
  } catch (err) {
    console.error("Erreur:", err.message);
=======
          duration: track.duration,
        },
      ]);
      if (error) {
        console.error('Erreur insertion:', error.message);
      }
    }
    console.log('Recherche et import terminés !');
  } catch (err) {
    console.error('Erreur:', err.message);
>>>>>>> upstream/main
  }
}

searchAndImport();
