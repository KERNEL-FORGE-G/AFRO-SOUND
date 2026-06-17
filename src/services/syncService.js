import {supabase} from '../supabaseClient';
import TrackPlayer, {State} from 'react-native-track-player';
import {store} from '../store';

let syncChannel = null;
let isHost = false;
let currentPlaylistId = null;

export const SyncService = {
  /**
   * Rejoint une session de lecture synchronisée pour une playlist
   */
  joinSession: async (playlistId, userId, ownerId) => {
    if (syncChannel) {
      SyncService.leaveSession();
    }

    currentPlaylistId = playlistId;
    isHost = userId === ownerId;

    syncChannel = supabase.channel(`sync_playback_${playlistId}`, {
      config: {
        broadcast: {self: false},
      },
    });

    syncChannel
      .on('broadcast', {event: 'playback_state'}, ({payload}) => {
        if (!isHost) {
          SyncService.handleRemoteState(payload);
        }
      })
      .subscribe();

    console.log(`[SyncService] Joined session ${playlistId} as ${isHost ? 'Host' : 'Listener'}`);
  },

  /**
   * Quitte la session actuelle
   */
  leaveSession: () => {
    if (syncChannel) {
      supabase.removeChannel(syncChannel);
      syncChannel = null;
    }
    currentPlaylistId = null;
    isHost = false;
  },

  /**
   * Diffuse l'état actuel (uniquement si Host)
   */
  broadcastState: async (track, position, isPlaying) => {
    if (!syncChannel || !isHost) return;

    syncChannel.send({
      type: 'broadcast',
      event: 'playback_state',
      payload: {
        trackId: track?.id,
        track,
        position,
        isPlaying,
        timestamp: Date.now(),
      },
    });
  },

  /**
   * Gère la réception d'un état distant (uniquement si Listener)
   */
  handleRemoteState: async (payload) => {
    const {track, position, isPlaying, timestamp} = payload;
    
    // Calculer le délai de réseau pour ajuster la position
    const networkDelay = (Date.now() - timestamp) / 1000;
    const adjustedPosition = position + networkDelay;

    const currentTrack = await TrackPlayer.getActiveTrack();
    
    // 1. Changer de morceau si nécessaire
    if (!currentTrack || currentTrack.id !== track.id) {
      await TrackPlayer.add(track, 0);
      await TrackPlayer.skip(0);
      await TrackPlayer.play();
    }

    // 2. Synchroniser la position si l'écart est > 2 secondes
    const currentPos = await TrackPlayer.getPosition();
    if (Math.abs(currentPos - adjustedPosition) > 2) {
      await TrackPlayer.seekTo(adjustedPosition);
    }

    // 3. Synchroniser lecture/pause
    const state = (await TrackPlayer.getPlaybackState()).state;
    if (isPlaying && state !== State.Playing) {
      await TrackPlayer.play();
    } else if (!isPlaying && state === State.Playing) {
      await TrackPlayer.pause();
    }
  },

  /**
   * Ajoute un membre à la playlist (via Deep Link)
   */
  addMember: async (playlistId, userId) => {
    try {
      const {error} = await supabase
        .from('playlist_members')
        .upsert([{playlist_id: playlistId, user_id: userId}], {
          onConflict: 'playlist_id,user_id',
        });
      
      if (error) throw error;
      return true;
    } catch (e) {
      console.error('[SyncService] Failed to add member:', e.message);
      return false;
    }
  }
};
