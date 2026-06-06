<<<<<<< HEAD
/**
 * PlayerContext.js - Contexte global de lecture AFRO SOUND
 * Gère l'état du lecteur (piste en cours, file d'attente, play/pause)
 * partagé entre tous les écrans via React Context.
 */
=======
>>>>>>> upstream/main
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
<<<<<<< HEAD
=======
import {Alert, Platform} from 'react-native';
import RNFetchBlob from 'rn-fetch-blob';
>>>>>>> upstream/main

const PlayerContext = createContext(null);

let playerReady = false;

/**
 * Configure le player une seule fois au démarrage
 */
const setupPlayer = async () => {
<<<<<<< HEAD
  if (playerReady) return;
=======
  if (playerReady) {
    return;
  }
>>>>>>> upstream/main
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
<<<<<<< HEAD
=======
        Capability.SkipToPrevious,
>>>>>>> upstream/main
      ],
      notificationCapabilities: [
        Capability.Play,
        Capability.Pause,
        Capability.SkipToNext,
        Capability.SkipToPrevious,
      ],
<<<<<<< HEAD
=======
      icon: require('../../logo.png'),
>>>>>>> upstream/main
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

<<<<<<< HEAD
=======
  const downloadTrack = useCallback(async track => {
    const {dirs} = RNFetchBlob.fs;
    const filePath = `${dirs.DocumentDir}/${track.title.replace(
      / /g,
      '_',
    )}.mp3`;

    try {
      await RNFetchBlob.config({
        fileCache: true,
        path: filePath,
      }).fetch('GET', track.audioUrl);

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

>>>>>>> upstream/main
  /**
   * Joue une piste (et charge la file d'attente si fournie)
   * @param {object} track  - La piste à lire
   * @param {Array}  tracks - La file d'attente complète (optionnel)
   */
<<<<<<< HEAD
  const playTrack = useCallback(async (track, tracks = []) => {
    try {
      if (!isSetup) {
        await setupPlayer();
        setIsSetup(true);
      }

      // Convertit en format TrackPlayer
      const toTP = t => ({
        id: t.id,
        url: t.audioUrl,
        title: t.title,
        artist: t.artist,
        album: t.album || '',
        artwork: t.cover || '',
        duration: t.duration || 30,
      });

      await TrackPlayer.reset();

      // Charge toute la file, ou juste la piste seule
      const trackList = tracks.length > 0 ? tracks : [track];
      await TrackPlayer.add(trackList.map(toTP));

      // Démarre à la bonne position dans la file
      const idx = trackList.findIndex(t => t.id === track.id);
      if (idx > 0) await TrackPlayer.skip(idx);

      await TrackPlayer.play();
      setCurrentTrack(toTP(track));
      setQueue(trackList);
    } catch (e) {
      console.error('[PlayerContext] playTrack error:', e.message);
    }
  }, [isSetup]);

  return (
    <PlayerContext.Provider value={{currentTrack, queue, playTrack}}>
=======
  const playTrack = useCallback(
    async (track, tracks = []) => {
      try {
        if (!isSetup) {
          await setupPlayer();
          setIsSetup(true);
        }

        // Convertit en format TrackPlayer
        const toTP = t => ({
          id: t.id,
          url: t.audioUrl,
          title: t.title,
          artist: t.artist,
          album: t.album || '',
          artwork: t.cover || '',
          duration: t.duration,
        });

        await TrackPlayer.reset();

        // Charge toute la file, ou juste la piste seule
        const trackList = tracks.length > 0 ? tracks : [track];
        await TrackPlayer.add(trackList.map(toTP));

        // Démarre à la bonne position dans la file
        const idx = trackList.findIndex(t => t.id === track.id);
        if (idx > 0) {
          await TrackPlayer.skip(idx);
        }

        await TrackPlayer.play();
        setCurrentTrack(toTP(track));
        setQueue(trackList);
      } catch (e) {
        console.error('[PlayerContext] playTrack error:', e.message);
      }
    },
    [isSetup],
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
      }}>
>>>>>>> upstream/main
      {children}
    </PlayerContext.Provider>
  );
}

export const usePlayer = () => {
  const ctx = useContext(PlayerContext);
<<<<<<< HEAD
  if (!ctx) throw new Error('usePlayer must be inside PlayerProvider');
=======
  if (!ctx) {
    throw new Error('usePlayer must be inside PlayerProvider');
  }
>>>>>>> upstream/main
  return ctx;
};

// Ré-exporte les hooks utiles de track-player pour les écrans
export {usePlaybackState, useProgress, State};
