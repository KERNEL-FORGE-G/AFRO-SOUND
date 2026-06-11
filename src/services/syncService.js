import {supabase} from '../supabaseClient';
import {markPlaylistSynced} from '../store/slices/playlistsSlice';

// Offline sync service: consumes the offlineQueue from Redux state
// and synchronizes changes with the backend when network is available.
export class OfflineSyncService {
  static async syncQueue(offlineQueue, groupPlaylists, store) {
    if (!offlineQueue || offlineQueue.length === 0) {
      return;
    }

    const {dispatch} = store;
    const playlistIds = [...new Set(offlineQueue.map(a => a.playlistId))].filter(
      Boolean,
    );

    for (const id of playlistIds) {
      const playlist = groupPlaylists[id];
      if (!playlist) continue;

      try {
        // 1. Upsert playlist info
        const {error: plError} = await supabase.from('playlists').upsert({
          id: playlist.id,
          user_id: playlist.ownerId,
          name: playlist.name,
          is_public: false,
        });

        if (plError) throw plError;

        // 2. Sync tracks: Clear and Re-insert to keep order and consistency
        await supabase.from('playlist_tracks').delete().eq('playlist_id', id);

        if (playlist.tracks && playlist.tracks.length > 0) {
          // Ensure tracks exist in 'tracks' table
          const tracksToUpsert = playlist.tracks.map(t => ({
            id: t.id,
            title: t.title,
            artist: t.artist || 'Artiste inconnu',
            cover_url: t.artwork || t.cover || t.cover_url,
            audio_url: t.url || t.audioUrl,
            source: t.source || 'local',
            duration: t.duration || 0,
          }));

          await supabase.from('tracks').upsert(tracksToUpsert);

          const trackEntries = playlist.tracks.map((t, index) => ({
            playlist_id: id,
            track_id: t.id,
            position: index,
          }));

          const {error: tracksError} = await supabase
            .from('playlist_tracks')
            .insert(trackEntries);

          if (tracksError) throw tracksError;
        }

        dispatch(markPlaylistSynced({playlistId: id}));
        console.log(`[OfflineSyncService] Playlist ${id} synced successfully.`);
      } catch (error) {
        console.error(
          `[OfflineSyncService] Error syncing playlist ${id}:`,
          error.message,
        );
      }
    }
  }

  static async startAutoSync(store) {
    console.log('[OfflineSyncService] Auto-sync listener started.');
    // Periodic sync attempt every 60 seconds if there's a queue
    setInterval(() => {
      const state = store.getState();
      const {offlineQueue, groupPlaylists} = state.playlists;
      if (offlineQueue.length > 0) {
        this.syncQueue(offlineQueue, groupPlaylists, store);
      }
    }, 60000);
  }
}

export default OfflineSyncService;
