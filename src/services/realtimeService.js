import {supabase} from '../supabaseClient';
import {store} from '../store';
import {markPlaylistSynced} from '../store/slices/playlistsSlice';

export const startRealtimePlaylistSync = () => {
  const channel = supabase
    .channel('playlists_changes')
    .on(
      'postgres_changes',
      {event: 'UPDATE', schema: 'public', table: 'playlists'},
      payload => {
        console.log('Playlist updated:', payload);
        // Ici, on pourrait déclencher une action Redux pour rafraîchir la playlist
        // store.dispatch(fetchPlaylist(payload.new.id));
      }
    )
    .on(
      'postgres_changes',
      {event: 'INSERT', schema: 'public', table: 'playlist_tracks'},
      payload => {
        console.log('Track added to playlist:', payload);
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
};
