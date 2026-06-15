/**
 * PlayerContext.js - Contexte global de lecture AFRO SOUND
 * Gère l'état du lecteur (piste en cours, file d'attente, play/pause)
 * partagé entre tous les écrans via React Context.
 */
import React, {createContext, useContext, useState, useCallback, useRef} from 'react';
import Sound from 'react-native-sound';
import {Alert} from 'react-native';
import RNFetchBlob from 'rn-fetch-blob';
import {supabase} from '../supabaseClient';

const PlayerContext = createContext(null);

// Configuration initiale pour react-native-sound
Sound.setCategory('Playback');

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
  const [isPlaying, setIsPlaying] = useState(false);
  const [repeatMode, setRepeatMode] = useState('off');
  const [isShuffle, setIsShuffle] = useState(false);
  const soundRef = useRef(null);

  const playTrack = useCallback(
    async (track, tracks = []) => {
      if (soundRef.current) {
        soundRef.current.release();
      }

      const url = getTrackUrl(track);
      if (!url) {
        Alert.alert('Erreur', 'Pas d\'URL.');
        return;
      }

      const sound = new Sound(url, null, (error) => {
        if (error) {
          Alert.alert('Erreur', 'Impossible de charger le son.');
          return;
        }
        sound.play((success) => {
          if (success) {
            setIsPlaying(false);
            setCurrentTrack(null);
          } else {
            Alert.alert('Erreur', 'Erreur de lecture.');
          }
        });
        setIsPlaying(true);
        setCurrentTrack(track);
      });
      soundRef.current = sound;
    },
    [],
  );

  const togglePlayback = useCallback(() => {
    if (!soundRef.current) return;
    if (isPlaying) {
      soundRef.current.pause();
    } else {
      soundRef.current.play();
    }
    setIsPlaying(!isPlaying);
  }, [isPlaying]);

  const seekTo = useCallback((position) => {
    if (soundRef.current) {
      soundRef.current.setCurrentTime(position);
    }
  }, []);

  const skipToNext = useCallback(async () => {
    // Logique simplifiée pour react-native-sound
  }, []);

  const skipToPrevious = useCallback(async () => {
    // Logique simplifiée pour react-native-sound
  }, []);

  return (
    <PlayerContext.Provider
      value={{
        currentTrack,
        isPlaying,
        playTrack,
        togglePlayback,
        seekTo,
        skipToNext,
        skipToPrevious,
        repeatMode,
        toggleRepeat,
        isShuffle,
        toggleShuffle,
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
