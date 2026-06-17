/**
 * PlayerContext.js - Contexte global de lecture AFRO SOUND
 */
import React, { createContext, useContext, useState, useCallback } from 'react';
import TrackPlayer, { Capability, RepeatMode, State, usePlaybackState, useProgress } from 'react-native-track-player';
import { downloadTrack } from '../services/downloadService';

const PlayerContext = createContext(null);

let playerReady = false;

const getTrackUrl = track => track?.audioUrl || track?.url || track?.previewUrl;
const getTrackArtwork = track => track?.cover || track?.cover_url || track?.artwork || '';
const getTrackArtist = track => track?.artist || track?.artist_name || 'Artiste inconnu';

const normalizeTrack = track => ({
  id: String(track.id || track.url || track.audioUrl || track.title),
  url: getTrackUrl(track),
  title: track.title || 'Titre inconnu',
  artist: getTrackArtist(track),
  album: track.album || '',
  artwork: getTrackArtwork(track),
  duration: track.duration || 30,
});

const setupPlayer = async () => {
  if (playerReady) return;
  try {
    await TrackPlayer.setupPlayer();
    await TrackPlayer.updateOptions({
      capabilities: [Capability.Play, Capability.Pause, Capability.SkipToNext, Capability.SkipToPrevious, Capability.SeekTo, Capability.Stop],
      compactCapabilities: [Capability.Play, Capability.Pause, Capability.SkipToNext, Capability.SkipToPrevious],
      notificationCapabilities: [Capability.Play, Capability.Pause, Capability.SkipToNext, Capability.SkipToPrevious],
    });
    playerReady = true;
  } catch (e) {
    playerReady = true;
  }
};

export function PlayerProvider({children}) {
  const [currentTrack, setCurrentTrack] = useState(null);
  const [queue, setQueue] = useState([]);
  const playbackState = usePlaybackState();
  const isPlaying = playbackState?.state === State.Playing;
  const [repeatMode, setRepeatMode] = useState('off');
  const [isShuffle, setIsShuffle] = useState(false);

  const toggleRepeat = useCallback(async () => {
    const modes = ['off', 'on', 'one'];
    const current = modes.indexOf(repeatMode);
    const nextMode = modes[(current + 1) % modes.length];
    setRepeatMode(nextMode);
    let trackPlayerMode = RepeatMode.Queue;
    if (nextMode === 'one') trackPlayerMode = RepeatMode.Track;
    else if (nextMode === 'off') trackPlayerMode = RepeatMode.Off;
    await TrackPlayer.setRepeatMode(trackPlayerMode);
  }, [repeatMode]);

  const toggleShuffle = useCallback(async () => setIsShuffle(!isShuffle), [isShuffle]);

  const playTrack = useCallback(async (track, tracks = []) => {
    await setupPlayer();
    const tracksToLoad = tracks.length > 0 ? tracks : [track];
    const normalizedTracks = tracksToLoad.map(normalizeTrack);
    await TrackPlayer.reset();
    await TrackPlayer.add(normalizedTracks);
    const trackIndex = normalizedTracks.findIndex(t => t.id === normalizeTrack(track).id);
    if (trackIndex !== -1) await TrackPlayer.skip(trackIndex);
    await TrackPlayer.play();
    setQueue(tracksToLoad);
    setCurrentTrack(track);
  }, []);

  const togglePlayback = useCallback(async () => {
    if (playbackState?.state === State.Playing) await TrackPlayer.pause();
    else await TrackPlayer.play();
  }, [playbackState]);

  const seekTo = useCallback(async (pos) => await TrackPlayer.seekTo(pos), []);

  const skipToNext = useCallback(async () => {
    await TrackPlayer.skipToNext();
    const track = await TrackPlayer.getActiveTrack();
    setCurrentTrack(track);
  }, []);

  const skipToPrevious = useCallback(async () => {
    await TrackPlayer.skipToPrevious();
    const track = await TrackPlayer.getActiveTrack();
    setCurrentTrack(track);
  }, []);

  return (
    <PlayerContext.Provider value={{ currentTrack, queue, isPlaying, playTrack, togglePlayback, seekTo, skipToNext, skipToPrevious, repeatMode, toggleRepeat, isShuffle, toggleShuffle, downloadTrack }}>
      {children}
    </PlayerContext.Provider>
  );
}

export const usePlayer = () => {
  const ctx = useContext(PlayerContext);
  if (!ctx) throw new Error('usePlayer must be inside PlayerProvider');
  return ctx;
};

export { useProgress, State };
