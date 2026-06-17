import {Share} from 'react-native';
import {supabase} from '../supabaseClient';
import {upsertTrack} from './musicApi';

const normalizePlaylistTrack = track => {
  if (!track) {
    return null;
  }
  return {
    ...track,
    artwork: track?.artwork || track?.cover || track?.cover_url || '',
    cover: track?.cover || track?.cover_url || track?.artwork || '',
    url: track?.url || track?.audio_url || track?.audioUrl || track?.previewUrl,
    audioUrl:
      track?.audioUrl || track?.audio_url || track?.url || track?.previewUrl,
    artist: track?.artist || track?.artist_name || 'Artiste inconnu',
  };
};

export const fetchUserPlaylists = async userId => {
  if (!userId) {
    return [];
  }

  const {data, error} = await supabase
    .from('playlists')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', {ascending: false});

  if (error) {
    throw error;
  }

  return data || [];
};

export const fetchSharedPlaylists = async userId => {
  let query = supabase
    .from('playlists')
    .select('*')
    .eq('is_public', true)
    .order('created_at', {ascending: false});

  if (userId) {
    query = query.neq('user_id', userId);
  }

  const {data, error} = await query;
  if (error) {
    throw error;
  }

  return data || [];
};

export const fetchPlaylistTracks = async playlistId => {
  if (!playlistId) {
    return [];
  }

  const {data, error} = await supabase
    .from('playlist_tracks')
    .select('position, tracks(*)')
    .eq('playlist_id', playlistId)
    .order('position', {ascending: true});

  if (error) {
    throw error;
  }

  return (data || [])
    .map(entry => normalizePlaylistTrack(entry.tracks))
    .filter(Boolean);
};

export const createRemotePlaylist = async ({
  name,
  userId,
  isPublic = false,
  tracks = [],
}) => {
  const trimmedName = name?.trim();
  if (!trimmedName) {
    throw new Error('Nom de playlist requis.');
  }
  if (!userId) {
    throw new Error('Utilisateur requis.');
  }

  const {data, error} = await supabase
    .from('playlists')
    .insert([
      {
        name: trimmedName,
        user_id: userId,
        is_public: isPublic,
      },
    ])
    .select()
    .single();

  if (error) {
    throw error;
  }

  if (tracks.length > 0) {
    const playlistId = data.id;
    const tracksToInsert = tracks.map((t, idx) => ({
      playlist_id: playlistId,
      track_id: t.id,
      position: idx,
    }));

    // S'assurer que les tracks existent dans la table 'tracks'
    for (const t of tracks) {
      await upsertTrack(t);
    }

    await supabase.from('playlist_tracks').insert(tracksToInsert);
  }

  return data;
};

export const addTrackToRemotePlaylist = async (playlistId, track) => {
  // 1. Upsert du track
  await upsertTrack(track);

  // 2. Récupérer la dernière position
  const {data: positions, error: positionError} = await supabase
    .from('playlist_tracks')
    .select('position')
    .eq('playlist_id', playlistId)
    .order('position', {ascending: false})
    .limit(1);

  const nextPosition =
    positions && positions.length > 0 ? positions[0].position + 1 : 0;

  // 3. Ajouter à la playlist
  const {error} = await supabase.from('playlist_tracks').upsert(
    [
      {
        playlist_id: playlistId,
        track_id: track.id,
        position: nextPosition,
      },
    ],
    {onConflict: 'playlist_id,track_id'},
  );

  if (error) {
    throw error;
  }
  return {success: true};
};

export const removeTrackFromPlaylist = async (playlistId, trackId) => {
  const {error} = await supabase
    .from('playlist_tracks')
    .delete()
    .eq('playlist_id', playlistId)
    .eq('track_id', trackId);

  if (error) {
    throw error;
  }
  return {success: true};
};

export const togglePlaylistVisibility = async (playlistId, isPublic) => {
  const {data, error} = await supabase
    .from('playlists')
    .update({is_public: isPublic})
    .eq('id', playlistId)
    .select()
    .single();

  if (error) {
    throw error;
  }
  return data;
};

export const sharePlaylist = async playlist => {
  const url = `afrosound://playlist/${playlist.id}`;
  try {
    await Share.share({
      title: 'Partager la playlist',
      message: `Rejoins ma playlist "${playlist.name}" sur AFRO SOUND !`,
      url,
    });
  } catch (error) {
    console.warn(error);
  }
};

export const shareTrack = async track => {
  // Deep link vers le titre
  const url = `afrosound://track/${track.id}`;
  try {
    await Share.share({
      title: 'Partager ce titre',
      message: `Écoute "${track.title}" de ${
        track.artist || 'Artiste inconnu'
      } sur AFRO SOUND !`,
      url,
    });
  } catch (error) {
    console.warn(error);
  }
};
