import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {Alert, Platform} from 'react-native';
import TrackPlayer, {
  AppKilledPlaybackBehavior,
  Capability,
  Event,
  RepeatMode,
  State,
  useTrackPlayerEvents,
} from 'react-native-track-player';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RNFetchBlob from 'rn-fetch-blob';

const PlayerContext = createContext(null);

let playerSetupPromise = null;

const getTrackUrl = track =>
  track?.audioUrl || track?.url || track?.previewUrl || track?.audio_url;
const getTrackArtwork = track =>
  track?.artwork || track?.cover || track?.cover_url || '';
const getTrackArtist = track =>
  track?.artist || track?.artist_name || 'Artiste inconnu';
const getTrackAlbum = track => track?.album || track?.collectionName || '';
const getTrackDuration = track => {
  const duration = Number(track?.duration);
  return Number.isFinite(duration) && duration > 0 ? duration : 30;
};

export const getPlaybackStateValue = playbackState =>
  playbackState && typeof playbackState === 'object' && 'state' in playbackState
    ? playbackState.state
    : playbackState;

const normalizeTrack = track => ({
  ...track,
  id: String(track?.id || getTrackUrl(track) || track?.title || Date.now()),
  url: getTrackUrl(track),
  title: track?.title || 'Titre inconnu',
  artist: getTrackArtist(track),
  album: getTrackAlbum(track),
  artwork: getTrackArtwork(track),
  duration: getTrackDuration(track),
  source: track?.source || 'local',
});

const getLocalPath = async trackId => {
  try {
    const path = await AsyncStorage.getItem(`track_${trackId}`);
    if (path && (await RNFetchBlob.fs.exists(path))) {
      return path;
    }
  } catch (e) {
    console.warn('Error getting local path', e);
  }
  return null;
};

const buildDownloadName = track => {
  const rawName = `${track?.artist || 'artiste'}-${track?.title || 'titre'}`;
  return rawName.replace(/[^\w.-]+/g, '_');
};

const setupPlayer = async () => {
  if (!playerSetupPromise) {
    playerSetupPromise = (async () => {
      try {
        await TrackPlayer.setupPlayer();
      } catch (error) {
        const message = error?.message || '';
        if (!message.toLowerCase().includes('already been initialized')) {
          throw error;
        }
      }

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
          Capability.SeekTo,
          Capability.Stop,
        ],
        progressUpdateEventInterval: 1,
        android: {
          appKilledPlaybackBehavior:
            AppKilledPlaybackBehavior?.StopPlaybackAndRemoveNotification,
        },
        icon: require('../../logo.png'),
      });

      await TrackPlayer.setRepeatMode(RepeatMode.Off);
    })();
  }

  return playerSetupPromise;
};

export function PlayerProvider({children}) {
  const [currentTrack, setCurrentTrack] = useState(null);
  const [queue, setQueue] = useState([]);
  const [queueIndex, setQueueIndex] = useState(0);
  const [repeatMode, setRepeatMode] = useState('off');
  const [isShuffle, setIsShuffle] = useState(false);
  const queueRef = useRef([]);
  const repeatModeRef = useRef('off');
  const shuffleRef = useRef(false);
  const mountedRef = useRef(true);

  const syncQueueState = useCallback(async () => {
    const activeTrack = await TrackPlayer.getActiveTrack();
    const activeIndex = await TrackPlayer.getActiveTrackIndex();
    const trackQueue = await TrackPlayer.getQueue();

    if (!mountedRef.current) {
      return;
    }

    queueRef.current = trackQueue;
    setQueue(trackQueue);
    setCurrentTrack(activeTrack || null);
    setQueueIndex(activeIndex >= 0 ? activeIndex : 0);
  }, []);

  useEffect(() => {
    repeatModeRef.current = repeatMode;
  }, [repeatMode]);

  useEffect(() => {
    shuffleRef.current = isShuffle;
  }, [isShuffle]);

  useEffect(() => {
    mountedRef.current = true;

    setupPlayer()
      .then(syncQueueState)
      .catch(error => {
        console.warn('[PlayerProvider] setup error:', error?.message || error);
      });

    return () => {
      mountedRef.current = false;
    };
  }, [syncQueueState]);

  useTrackPlayerEvents(
    [Event.PlaybackActiveTrackChanged, Event.PlaybackQueueEnded],
    async event => {
      if (event.type === Event.PlaybackActiveTrackChanged) {
        const nextTrack =
          event.track ||
          (typeof event.index === 'number'
            ? queueRef.current[event.index]
            : null);
        if (nextTrack) {
          setCurrentTrack(nextTrack);
        }
        if (typeof event.index === 'number' && event.index >= 0) {
          setQueueIndex(event.index);
        }
      }

      if (
        event.type === Event.PlaybackQueueEnded &&
        event.position > 0 &&
        repeatModeRef.current === 'one' &&
        currentTrack
      ) {
        try {
          await TrackPlayer.seekTo(0);
          await TrackPlayer.play();
        } catch (error) {
          console.warn('[PlayerProvider] repeat one error:', error?.message);
        }
      }
    },
  );

  const playTrack = useCallback(async (track, tracks = []) => {
    const baseQueue =
      Array.isArray(tracks) && tracks.length > 0
        ? tracks
        : [track].filter(Boolean);

    const processedQueue = await Promise.all(
      baseQueue.map(async t => {
        const normalized = normalizeTrack(t);
        const localPath = await getLocalPath(normalized.id);
        if (localPath) {
          return {...normalized, url: `file://${localPath}`};
        }
        return normalized;
      }),
    );

    const normalizedQueue = processedQueue.filter(item => item.url && item.id);

    if (normalizedQueue.length === 0) {
      Alert.alert('Lecture impossible', "Aucun flux audio n'est disponible.");
      return;
    }

    const normalizedTrack = normalizeTrack(track);
    const initialIndex = Math.max(
      normalizedQueue.findIndex(item => item.id === normalizedTrack.id),
      0,
    );

    let nextQueue = [...normalizedQueue];
    let nextIndex = initialIndex;

    if (shuffleRef.current) {
      const trackToKeep = normalizedQueue[initialIndex];
      const otherTracks = normalizedQueue
        .filter(item => item.id !== trackToKeep.id)
        .sort(() => Math.random() - 0.5);
      nextQueue = [trackToKeep, ...otherTracks];
      nextIndex = 0;
    }

    await setupPlayer();
    await TrackPlayer.reset();
    await TrackPlayer.add(nextQueue);
    if (nextIndex > 0) {
      await TrackPlayer.skip(nextIndex);
    }
    await TrackPlayer.play();

    queueRef.current = nextQueue;
    setQueue(nextQueue);
    setQueueIndex(nextIndex);
    setCurrentTrack(nextQueue[nextIndex] || nextQueue[0] || null);
  }, []);

  const togglePlayback = useCallback(async () => {
    await setupPlayer();
    const playbackState = getPlaybackStateValue(
      await TrackPlayer.getPlaybackState(),
    );

    if (playbackState === State.Playing) {
      await TrackPlayer.pause();
      return;
    }

    await TrackPlayer.play();
  }, []);

  const seekTo = useCallback(async position => {
    await setupPlayer();
    await TrackPlayer.seekTo(position);
  }, []);

  const skipToNext = useCallback(async () => {
    await setupPlayer();
    try {
      const activeIndex = await TrackPlayer.getActiveTrackIndex();
      const currentQueue = await TrackPlayer.getQueue();

      if (activeIndex === currentQueue.length - 1) {
        if (repeatModeRef.current === 'on') {
          await TrackPlayer.skip(0);
        } else {
          return; // Stop at end
        }
      } else {
        await TrackPlayer.skipToNext();
      }
      await TrackPlayer.play();
      await syncQueueState();
    } catch (error) {
      console.warn('[skipToNext] error:', error.message);
    }
  }, [syncQueueState]);

  const skipToPrevious = useCallback(async () => {
    await setupPlayer();
    try {
      const activeIndex = await TrackPlayer.getActiveTrackIndex();
      if (activeIndex === 0) {
        if (repeatModeRef.current === 'on') {
          const currentQueue = await TrackPlayer.getQueue();
          await TrackPlayer.skip(currentQueue.length - 1);
        } else {
          await TrackPlayer.seekTo(0);
        }
      } else {
        await TrackPlayer.skipToPrevious();
      }
      await TrackPlayer.play();
      await syncQueueState();
    } catch (error) {
      console.warn('[skipToPrevious] error:', error.message);
    }
  }, [syncQueueState]);

  const addToQueue = useCallback(async track => {
    const normalizedTrack = normalizeTrack(track);
    if (!normalizedTrack.url) {
      Alert.alert('Ajout impossible', "Ce titre n'a pas de source audio.");
      return false;
    }

    await setupPlayer();
    await TrackPlayer.add(normalizedTrack);
    const nextQueue = [...queueRef.current, normalizedTrack];
    queueRef.current = nextQueue;
    setQueue(nextQueue);
    return true;
  }, []);

  const removeFromQueue = useCallback(
    async trackId => {
      await setupPlayer();
      const index = queueRef.current.findIndex(track => track.id === trackId);
      if (index < 0) {
        return;
      }
      await TrackPlayer.remove([index]);
      await syncQueueState();
    },
    [syncQueueState],
  );

  const playFromQueue = useCallback(
    async index => {
      await setupPlayer();
      await TrackPlayer.skip(index);
      await TrackPlayer.play();
      await syncQueueState();
    },
    [syncQueueState],
  );

  const clearQueue = useCallback(async () => {
    await setupPlayer();
    await TrackPlayer.reset();
    queueRef.current = [];
    setQueue([]);
    setQueueIndex(0);
    setCurrentTrack(null);
  }, []);

  const toggleRepeat = useCallback(async () => {
    const modes = ['off', 'on', 'one'];
    const currentIndex = modes.indexOf(repeatModeRef.current);
    const nextMode = modes[(currentIndex + 1) % modes.length];

    let trackPlayerRepeatMode = RepeatMode.Off;
    if (nextMode === 'on') {
      trackPlayerRepeatMode = RepeatMode.Queue;
    }
    if (nextMode === 'one') {
      trackPlayerRepeatMode = RepeatMode.Track;
    }

    await setupPlayer();
    await TrackPlayer.setRepeatMode(trackPlayerRepeatMode);
    setRepeatMode(nextMode);
  }, []);

  const toggleShuffle = useCallback(async () => {
    const nextShuffle = !shuffleRef.current;
    setIsShuffle(nextShuffle);
    shuffleRef.current = nextShuffle;

    if (nextShuffle && queueRef.current.length > 1) {
      // Shuffle current queue keeping current track at index 0
      const currentIdx = await TrackPlayer.getActiveTrackIndex();
      const currentTrackObj = queueRef.current[currentIdx];
      const otherTracks = queueRef.current
        .filter((_, idx) => idx !== currentIdx)
        .sort(() => Math.random() - 0.5);

      const newQueue = [currentTrackObj, ...otherTracks];

      await TrackPlayer.reset();
      await TrackPlayer.add(newQueue);
      await TrackPlayer.play();

      queueRef.current = newQueue;
      setQueue(newQueue);
      setQueueIndex(0);
    } else if (!nextShuffle) {
      // In a real app, we might want to restore original order,
      // but here we just keep current state.
    }
  }, []);

  const downloadTrack = useCallback(async track => {
    const normalizedTrack = normalizeTrack(track);
    if (!normalizedTrack.url) {
      Alert.alert('Téléchargement impossible', 'Titre sans URL audio.');
      return null;
    }

    const baseDir = `${RNFetchBlob.fs.dirs.DocumentDir}/AFRO SOUND`;
    await RNFetchBlob.fs.mkdir(baseDir).catch(() => {}); // Create directory if not exists

    const extension =
      normalizedTrack.url.split('.').pop()?.split('?')[0] || 'mp3';
    const path = `${baseDir}/${buildDownloadName(
      normalizedTrack,
    )}.${extension}`;

    try {
      const response = await RNFetchBlob.config({
        path,
        fileCache: true,
        // Background download
        addAndroidDownloads:
          Platform.OS === 'android'
            ? {
                useDownloadManager: true,
                notification: true,
                path,
                title: normalizedTrack.title,
                description: 'Téléchargement AFRO SOUND',
                mime: 'audio/mpeg',
              }
            : undefined,
      }).fetch('GET', normalizedTrack.url);

      await AsyncStorage.setItem(
        `track_${normalizedTrack.id}`,
        response.path(),
      );
      Alert.alert('Téléchargement lancé', normalizedTrack.title);
      return response.path?.() || path;
    } catch (error) {
      Alert.alert('Erreur', error?.message || 'Le téléchargement a échoué.');
      return null;
    }
  }, []);

  const value = useMemo(
    () => ({
      currentTrack,
      queue,
      queueIndex,
      playTrack,
      togglePlayback,
      seekTo,
      skipToNext,
      skipToPrevious,
      repeatMode,
      toggleRepeat,
      isShuffle,
      toggleShuffle,
      addToQueue,
      removeFromQueue,
      playFromQueue,
      clearQueue,
      downloadTrack,
    }),
    [
      addToQueue,
      clearQueue,
      currentTrack,
      downloadTrack,
      isShuffle,
      playFromQueue,
      playTrack,
      queue,
      queueIndex,
      removeFromQueue,
      repeatMode,
      seekTo,
      skipToNext,
      skipToPrevious,
      togglePlayback,
      toggleRepeat,
      toggleShuffle,
    ],
  );

  return (
    <PlayerContext.Provider value={value}>{children}</PlayerContext.Provider>
  );
}

export const usePlayer = () => {
  const context = useContext(PlayerContext);
  if (!context) {
    throw new Error('usePlayer must be used within a PlayerProvider');
  }
  return context;
};

export {State, Event, RepeatMode};
