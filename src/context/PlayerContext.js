/**
 * PlayerContext.js - Contexte global de lecture AFRO SOUND
 * Gère l'état du lecteur (piste en cours, file d'attente, play/pause)
 * partagé entre tous les écrans via React Context.
 */
import React, {createContext, useContext, useState, useCallback} from 'react';
import TrackPlayer, {
  Capability,
  RepeatMode,
  State,
  usePlaybackState,
  useProgress,
  useTrackPlayerEvents,
  Event,
} from 'react-native-track-player';
import {Alert} from 'react-native';
import RNFetchBlob from 'rn-fetch-blob';

const PlayerContext = createContext(null);

let playerReady = false;

const getPlaybackStateValue = playbackState =>
  typeof playbackState === 'object' && playbackState !== null
    ? playbackState.state
    : playbackState;

const getTrackUrl = track => track?.audioUrl || track?.url || track?.previewUrl;
const getTrackArtwork = track =>
  track?.cover || track?.cover_url || track?.artwork || '';
const getTrackArtist = track =>
  track?.artist || track?.artist_name || 'Artiste inconnu';

const normalizeTrack = track => ({
  id: String(track.id || track.url || track.audioUrl || track.title),
  url: getTrackUrl(track),
  title: track.title || 'Titre inconnu',
  artist: getTrackArtist(track),
  album: track.album || '',
  artwork: getTrackArtwork(track),
  duration: track.duration || 30,
  source: track.source || '',
});

/**
 * Configure le player une seule fois au démarrage
 */
const setupPlayer = async () => {
  if (playerReady) {
    return;
  }
  try {
    await TrackPlayer.setupPlayer({
      maxCacheSize: 1024 * 5, // 5 MB de cache
    });
    await TrackPlayer.updateOptions({
      capabilities: [
        Capability.Play,
        Capability.Pause,
        Capability.SkipToNext,
        Capability.SkipToPrevious,
        Capability.SeekTo,
        Capability.Stop,
      ],
      compactCapabilities: [
        Capability.Play,
        Capability.Pause,
        Capability.SkipToNext,
        Capability.SkipToPrevious,
      ],
      notificationCapabilities: [
        Capability.Play,
        Capability.Pause,
        Capability.SkipToNext,
        Capability.SkipToPrevious,
      ],
      icon: require('../../logo.png'),
    });
    await TrackPlayer.setRepeatMode(RepeatMode.Queue);
    playerReady = true;
  } catch (e) {
    // Player déjà initialisé, on ignore
    playerReady = true;
  }
};

export function PlayerProvider({children}) {
  const [currentTrack, setCurrentTrack] = useState(null);
  const [queue, setQueue] = useState([]);
  const [isSetup, setIsSetup] = useState(false);

  // Écoute les changements de piste
  useTrackPlayerEvents([Event.PlaybackActiveTrackChanged], async event => {
    if (event.track) {
      setCurrentTrack(event.track);
    }
  });

  const ensureSetup = useCallback(async () => {
    if (!isSetup) {
      await setupPlayer();
      setIsSetup(true);
    }
  }, [isSetup]);

  const downloadTrack = useCallback(async track => {
    const url = getTrackUrl(track);
    if (!url) {
      Alert.alert('Erreur', 'Aucune URL audio disponible pour ce morceau.');
      return;
    }

    const {dirs} = RNFetchBlob.fs;
    const safeTitle = (track.title || 'afro_sound_track').replace(
      /[^a-z0-9_-]/gi,
      '_',
    );
    const filePath = `${dirs.DocumentDir}/${safeTitle}.mp3`;

    try {
      await RNFetchBlob.config({
        fileCache: true,
        path: filePath,
      }).fetch('GET', url);

      Alert.alert('Succès', 'Le morceau a été téléchargé.');
    } catch (error) {
      console.error(error);
      Alert.alert('Erreur', 'Le téléchargement a échoué.');
    }
  }, []);

  const skipToNext = useCallback(async () => {
    await TrackPlayer.skipToNext();
  }, []);

  const skipToPrevious = useCallback(async () => {
    await TrackPlayer.skipToPrevious();
  }, []);

  const seekTo = useCallback(async position => {
    await TrackPlayer.seekTo(position);
  }, []);

  const togglePlayback = useCallback(async playbackState => {
    const state = getPlaybackStateValue(playbackState);
    if (state === State.Playing || state === State.Buffering) {
      await TrackPlayer.pause();
      return;
    }
    await TrackPlayer.play();
  }, []);

  /**
   * Joue une piste (et charge la file d'attente si fournie)
   * @param {object} track  - La piste à lire
   * @param {Array}  tracks - La file d'attente complète (optionnel)
   */
  const playTrack = useCallback(
    async (track, tracks = []) => {
      try {
        await ensureSetup();

        const playableTracks = (tracks.length > 0 ? tracks : [track])
          .filter(item => getTrackUrl(item))
          .map(normalizeTrack);
        const selectedTrack = normalizeTrack(track);

        if (!selectedTrack.url || playableTracks.length === 0) {
          Alert.alert(
            'Erreur',
            'Ce titre ne contient pas de flux audio lisible.',
          );
          return;
        }

        await TrackPlayer.reset();
        await TrackPlayer.add(playableTracks);

        const idx = playableTracks.findIndex(t => t.id === selectedTrack.id);
        if (idx > 0) {
          await TrackPlayer.skip(idx);
        }

        await TrackPlayer.play();
        setCurrentTrack(selectedTrack);
        setQueue(playableTracks);
      } catch (e) {
        console.error('[PlayerContext] playTrack error:', e.message);
      }
    },
    [ensureSetup],
  );

  return (
    <PlayerContext.Provider
      value={{
        currentTrack,
        queue,
        playTrack,
        downloadTrack,
        skipToNext,
        skipToPrevious,
        seekTo,
        togglePlayback,
      }}>
      {children}
    </PlayerContext.Provider>
  );
}

export const usePlayer = () => {
  const ctx = useContext(PlayerContext);
  if (!ctx) {
    throw new Error('usePlayer must be inside PlayerProvider');
  }
  return ctx;
};

// Ré-exporte les hooks utiles de track-player pour les écrans
export {usePlaybackState, useProgress, State, getPlaybackStateValue};
