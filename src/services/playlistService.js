import {Share} from 'react-native';
import {supabase} from '../supabaseClient';
import {upsertTrack} from './musicApi';

const normalizePlaylistTrack = track => ({
  ...track,
  artwork: track?.artwork || track?.cover || track?.cover_url || '',
  cover: track?.cover || track?.cover_url || track?.artwork || '',
  url: track?.url || track?.audio_url || track?.audioUrl || track?.previewUrl,
  audioUrl:
    track?.audioUrl || track?.audio_url || track?.url || track?.previewUrl,
  artist: track?.artist || track?.artist_name || 'Artiste inconnu',
});

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

  for (let index = 0; index < tracks.length; index += 1) {
    await addTrackToRemotePlaylist(data.id, tracks[index], index);
  }

  return data;
};

export const addTrackToRemotePlaylist = async (
  playlistId,
  track,
  forcedPosition = null,
) => {
  if (!playlistId || !track?.id) {
    throw new Error('Playlist ou titre invalide.');
  }

  await upsertTrack({
    ...track,
    cover: track.cover || track.cover_url || track.artwork,
    audioUrl: track.audioUrl || track.audio_url || track.url,
  });

  let position = forcedPosition;
  if (position === null || position === undefined) {
    const {data: positions, error: positionError} = await supabase
      .from('playlist_tracks')
      .select('position')
      .eq('playlist_id', playlistId)
      .order('position', {ascending: false})
      .limit(1);

    if (positionError) {
      throw positionError;
    }

    position =
      typeof positions?.[0]?.position === 'number'
        ? positions[0].position + 1
        : 0;
  }

  const {error} = await supabase.from('playlist_tracks').upsert(
    [
      {
        playlist_id: playlistId,
        track_id: track.id,
        position,
      },
    ],
    {
      onConflict: 'playlist_id,track_id',
    },
  );

  if (error) {
    throw error;
  }

  return true;
};

export const removeTrackFromRemotePlaylist = async (playlistId, trackId) => {
  const {error} = await supabase
    .from('playlist_tracks')
    .delete()
    .eq('playlist_id', playlistId)
    .eq('track_id', trackId);

  if (error) {
    throw error;
  }
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
  const message = [
    `Playlist AFRO SOUND : ${playlist?.name || 'Sans titre'}`,
    playlist?.is_public
      ? 'Disponible dans la section playlists partagées.'
      : 'Playlist privée.',
  ].join('\n');

  return Share.share({
    title: playlist?.name || 'Playlist AFRO SOUND',
    message,
  });
};

export const shareTrack = async track => {
  const message = [
    `${track?.title || 'Titre inconnu'} — ${
      track?.artist || track?.artist_name || 'Artiste inconnu'
    }`,
    track?.url || track?.audioUrl || track?.previewUrl || '',
  ]
    .filter(Boolean)
    .join('\n');

  return Share.share({
    title: track?.title || 'Titre AFRO SOUND',
    message,
  });
};
