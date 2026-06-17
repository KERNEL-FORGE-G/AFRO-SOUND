import {Share} from 'react-native';
import {supabase} from '../supabaseClient';
import {upsertTrack} from './musicApi';
import {DeepLinkingService} from './deepLinkingService';

// ... (existing helper function)

// ... (existing exports up to togglePlaylistVisibility)

export const sharePlaylist = async (playlist) => {
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
