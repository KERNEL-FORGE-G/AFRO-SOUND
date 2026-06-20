import {Share} from 'react-native';
import {supabase} from '../supabaseClient';
import {upsertTrack} from './musicApi';
import {DeepLinkingService} from './deepLinkingService';

export const fetchUserPlaylists = async userId => {
  const {data, error} = await supabase
    .from('playlists')
    .select('*')
    .eq('user_id', userId);
  if (error) {
    throw error;
  }
  return data || [];
};

export const fetchSharedPlaylists = async userId => {
  // Fetch public playlists that are not owned by the current user
  const {data, error} = await supabase
    .from('playlists')
    .select('*')
    .eq('is_public', true)
    .neq('user_id', userId);
  if (error) {
    throw error;
  }
  return data || [];
};

export const fetchPlaylistTracks = async playlistId => {
  const {data, error} = await supabase
    .from('playlist_tracks')
    .select('tracks(*)')
    .eq('playlist_id', playlistId);
  if (error) {
    throw error;
  }
  return (data || []).map(item => item.tracks);
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

export const addTrackToRemotePlaylist = async (playlistId, trackId) => {
  const {error} = await supabase
    .from('playlist_tracks')
    .insert([{playlist_id: playlistId, track_id: trackId}]);
  if (error) {
    throw error;
  }
};

export const sharePlaylist = async playlist => {
  const url = DeepLinkingService.getPlaylistLink(playlist.id);
  const message = `Rejoins ma playlist "${playlist.name}" sur AFRO SOUND !\n\n${url}`;

  try {
    await Share.share({
      title: 'Partager la playlist',
      message,
      url,
    });
  } catch (error) {
    console.warn('[PlaylistService] sharePlaylist error:', error.message);
  }
};
