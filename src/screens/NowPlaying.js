import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  Alert,
  Animated,
  Easing,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Slider from '@react-native-community/slider';
import Ionicons from 'react-native-vector-icons/Ionicons';
import theme, {Colors, Radius, Shadows} from '../theme';
import {
  State,
  getPlaybackStateValue,
  usePlaybackState,
  usePlayer,
  useProgress,
} from '../context/PlayerContext';
import {supabase} from '../supabaseClient';
import useAuth from '../hooks/useAuth';
import {SyncService} from '../services/syncService';
import {
  addTrackToRemotePlaylist,
  fetchUserPlaylists,
  shareTrack,
} from '../services/playlistService';
import {getTrackById} from '../services/musicApi';

const getArtwork = track => track?.artwork || track?.cover || track?.cover_url;
const getArtist = track =>
  track?.artist || track?.artist_name || 'Artiste inconnu';

const formatTime = secs => {
  const safeSecs = Number.isFinite(secs) ? Math.max(0, secs) : 0;
  const m = Math.floor(safeSecs / 60);
  const s = Math.floor(safeSecs % 60);
  return `${m}:${s < 10 ? '0' : ''}${s}`;
};

export default function NowPlaying({navigation, route}) {
  const {user} = useAuth();
  const routeTrack = route.params?.track;
  const trackId = route.params?.trackId; // ID depuis un deep link
  const playlistId = route.params?.playlistId;
  const ownerId = route.params?.ownerId;

  const {
    addToQueue,
    clearQueue,
    currentTrack,
    downloadTrack,
    playFromQueue,
    queue,
    queueIndex,
    removeFromQueue,
    repeatMode,
    toggleRepeat,
    isShuffle,
    toggleShuffle,
    playTrack,
    togglePlayback,
    seekTo,
    skipToNext,
    skipToPrevious,
  } = usePlayer();

  const playbackState = usePlaybackState();
  const {position, duration} = useProgress(500);
  const [isLiked, setIsLiked] = useState(false);
  const [isSeeking, setIsSeeking] = useState(false);
  const [seekPreview, setSeekPreview] = useState(0);
  const [playlistModalVisible, setPlaylistModalVisible] = useState(false);
  const [queueModalVisible, setQueueModalVisible] = useState(false);
  const [userPlaylists, setUserPlaylists] = useState([]);
  const [isLoadingPlaylists, setIsLoadingPlaylists] = useState(false);
  const [loadingTrack, setLoadingTrack] = useState(false);

  // Détermination du track à afficher
  const track = currentTrack || routeTrack || {};
  const playbackStateValue = getPlaybackStateValue(playbackState);
  const isPlaying = playbackStateValue === State.Playing;
  const displayedPosition = isSeeking ? seekPreview : position;
  const displayedDuration = duration || track.duration || 0;
  const artwork = getArtwork(track);

  // Gestion du chargement par ID (Deep Link)
  useEffect(() => {
    if (trackId && !routeTrack && !currentTrack) {
      loadTrackById(trackId);
    }
  }, [trackId]);

  const loadTrackById = async (id) => {
    setLoadingTrack(true);
    try {
      const data = await getTrackById(id);
      if (data) {
        await playTrack(data);
      } else {
        Alert.alert('Erreur', 'Impossible de trouver ce titre.');
      }
    } catch (error) {
      console.warn(error);
    } finally {
      setLoadingTrack(false);
    }
  };

  // Synchronisation en temps réel (Lecture simultanée)
  useEffect(() => {
    if (playlistId && user) {
      SyncService.joinSession(playlistId, user.id, ownerId);
    }
    return () => SyncService.leaveSession();
  }, [playlistId, user, ownerId]);

  // Diffusion de l'état (si Host)
  useEffect(() => {
    let interval = null;
    if (playlistId && user?.id === ownerId && isPlaying) {
      interval = setInterval(() => {
        SyncService.broadcastState(track, position, isPlaying);
      }, 3000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [playlistId, user, ownerId, track, position, isPlaying]);

  const spinValue = useRef(new Animated.Value(0)).current;
  const spinAnimation = useRef(null);

  useEffect(() => {
    spinAnimation.current = Animated.loop(
      Animated.timing(spinValue, {
        toValue: 1,
        duration: 12000,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    );

    return () => {
      spinAnimation.current?.stop();
    };
  }, [spinValue]);

  useEffect(() => {
    if (isPlaying) {
      spinAnimation.current?.start();
    } else {
      spinAnimation.current?.stop();
    }
  }, [isPlaying]);

  const checkIfLiked = useCallback(async () => {
    if (!user?.id || !track?.id) {
      setIsLiked(false);
      return;
    }

    try {
      const {data} = await supabase
        .from('favorites')
        .select('*')
        .eq('user_id', user.id)
        .eq('track_id', track.id)
        .maybeSingle();

      setIsLiked(Boolean(data));
    } catch (error) {
      setIsLiked(false);
    }
  }, [track?.id, user?.id]);

  useEffect(() => {
    checkIfLiked();
  }, [checkIfLiked]);

  const openPlaylistModal = async () => {
    if (!user) {
      Alert.alert(
        'Connexion requise',
        'Connectez-vous pour ajouter ce titre à une playlist.',
      );
      navigation.navigate('Login');
      return;
    }

    setPlaylistModalVisible(true);
    setIsLoadingPlaylists(true);
    try {
      const playlists = await fetchUserPlaylists(user.id);
      setUserPlaylists(playlists);
    } catch (error) {
      Alert.alert('Erreur', error.message);
    } finally {
      setIsLoadingPlaylists(false);
    }
  };

  const handleAddToPlaylist = async pid => {
    try {
      await addTrackToRemotePlaylist(pid, track);
      Alert.alert('Succès', 'Ajouté à la playlist !');
      setPlaylistModalVisible(false);
    } catch (error) {
      Alert.alert('Erreur', error.message);
    }
  };

  const toggleLike = async () => {
    if (!user) {
      Alert.alert('Connexion requise', 'Connectez-vous pour liker ce titre.');
      navigation.navigate('Login');
      return;
    }

    try {
      if (isLiked) {
        const {error} = await supabase
          .from('favorites')
          .delete()
          .eq('user_id', user.id)
          .eq('track_id', track.id);
        if (error) {
          throw error;
        }
        setIsLiked(false);
        return;
      }

      // Upsert track info to DB
      const {error: trackError} = await supabase.from('tracks').upsert([
        {
          id: track.id,
          title: track.title,
          artist: getArtist(track),
          album: track.album || '',
          cover_url: artwork,
          audio_url: track.url || track.audioUrl,
          source: track.source,
          duration: track.duration,
        },
      ]);
      if (trackError) throw trackError;

      const {error} = await supabase.from('favorites').insert([
        {
          user_id: user.id,
          track_id: track.id,
        },
      ]);
      if (error) {
        throw error;
      }
      setIsLiked(true);
    } catch (error) {
      Alert.alert('Erreur', error.message);
    }
  };

  const handleSeekComplete = async value => {
    const nextPosition = Math.floor(value);
    setSeekPreview(nextPosition);
    setIsSeeking(false);
    await seekTo(nextPosition);
  };

  const handleSkipPrevious = async () => {
    try {
      await skipToPrevious();
    } catch (error) {
      console.warn(error);
    }
  };

  const handleSkipNext = async () => {
    try {
      await skipToNext();
    } catch (error) {
      console.warn(error);
    }
  };

  const handleTrackShare = async () => {
    try {
      await shareTrack(track);
    } catch (error) {
      console.warn(error);
    }
  };

  const bottomActions = [
    {
      icon: 'list-outline',
      label: 'File',
      onPress: () => setQueueModalVisible(true),
    },
    {
      icon: 'add-circle-outline',
      label: 'Playlist',
      onPress: openPlaylistModal,
    },
    {
      icon: 'musical-notes-outline',
      label: 'Paroles',
      onPress: () => navigation.navigate('Lyrics'),
    },
    {
      icon: 'download-outline',
      label: 'Télécharger',
      onPress: () => downloadTrack(track),
    },
    {
      icon: 'share-social-outline',
      label: 'Partager',
      onPress: handleTrackShare,
    },
  ];

  if (loadingTrack) {
    return (
      <View style={[theme.container, {justifyContent: 'center'}]}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return (
    <View style={theme.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          activeOpacity={0.8}
          style={styles.headerIcon}>
          <Ionicons name="chevron-back" size={28} color={Colors.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Lecteur</Text>
        <TouchableOpacity
          activeOpacity={0.8}
          style={styles.headerIcon}
          onPress={() =>
            Alert.alert(
              'Options',
              `Source: ${(track.source || 'local').toUpperCase()}\nFile: ${
                queue.length
              } titre${queue.length > 1 ? 's' : ''}`,
            )
          }>
          <Ionicons name="ellipsis-vertical" size={24} color={Colors.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.artContainer}>
          <Animated.Image
            source={artwork ? {uri: artwork} : require('../../logo.png')}
            style={[styles.art, {transform: [{rotate: spin}]}]}
          />
        </View>

        <View style={styles.trackInfo}>
          <Text style={styles.trackTitle} numberOfLines={2}>
            {track.title || 'Titre inconnu'}
          </Text>
          <View style={styles.artistRow}>
            <Text style={styles.trackArtist} numberOfLines={1}>
              {getArtist(track)}
            </Text>
            <TouchableOpacity onPress={toggleLike} style={styles.likeIcon}>
              <Ionicons
                name={isLiked ? 'heart' : 'heart-outline'}
                size={24}
                color={Colors.primary}
              />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.progressSection}>
          <Slider
            style={styles.slider}
            minimumValue={0}
            maximumValue={Math.max(displayedDuration, 1)}
            value={Math.min(displayedPosition, Math.max(displayedDuration, 1))}
            onValueChange={value => {
              setIsSeeking(true);
              setSeekPreview(value);
            }}
            onSlidingComplete={handleSeekComplete}
            minimumTrackTintColor={Colors.primary}
            maximumTrackTintColor={Colors.borderStrong}
            thumbTintColor={Colors.primary}
          />
          <View style={styles.timeRow}>
            <Text style={styles.timeText}>{formatTime(displayedPosition)}</Text>
            <Text style={styles.timeText}>{formatTime(displayedDuration)}</Text>
          </View>
        </View>

        <View style={styles.controls}>
          <TouchableOpacity onPress={toggleShuffle} style={styles.controlSmall}>
            <Ionicons
              name="shuffle"
              size={24}
              color={isShuffle ? Colors.primary : Colors.muted}
            />
          </TouchableOpacity>

          <TouchableOpacity style={styles.controlBtn} onPress={handleSkipPrevious}>
            <Ionicons name="play-skip-back" size={28} color={Colors.text} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.bigBtn} onPress={togglePlayback}>
            <Ionicons
              name={isPlaying ? 'pause' : 'play'}
              size={44}
              color={Colors.background}
              style={isPlaying ? null : {marginLeft: 4}}
            />
          </TouchableOpacity>

          <TouchableOpacity style={styles.controlBtn} onPress={handleSkipNext}>
            <Ionicons name="play-skip-forward" size={28} color={Colors.text} />
          </TouchableOpacity>

          <TouchableOpacity onPress={toggleRepeat} style={styles.controlSmall}>
            <Ionicons
              name="repeat"
              size={24}
              color={repeatMode === 'off' ? Colors.muted : Colors.primary}
            />
            {repeatMode === 'one' && (
              <View style={styles.repeatBadge}>
                <Text style={styles.repeatBadgeText}>1</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        <View style={styles.actionsContainer}>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.bottomActions}
          >
            {bottomActions.map((action, idx) => (
              <TouchableOpacity
                key={idx}
                style={styles.actionBtn}
                onPress={action.onPress}
                activeOpacity={0.7}>
                <View style={styles.actionIconContainer}>
                  <Ionicons name={action.icon} size={22} color={Colors.primary} />
                </View>
                <Text style={styles.actionLabel}>{action.label}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <View style={styles.queueHint}>
          <Text style={styles.queueHintText}>
            File active: {queueIndex + 1}/{Math.max(queue.length, 1)}
          </Text>
          <TouchableOpacity onPress={() => setQueueModalVisible(true)}>
            <Text style={styles.queueHintAction}>Afficher la file</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <Modal
        visible={playlistModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setPlaylistModalVisible(false)}>
        <View style={styles.modalBackdrop}>
          <View style={styles.modalSheet}>
            <Text style={styles.modalTitle}>Ajouter à une playlist</Text>
            {isLoadingPlaylists ? (
              <ActivityIndicator size="small" color={Colors.primary} style={{margin: 20}} />
            ) : userPlaylists.length === 0 ? (
              <Text style={styles.modalEmpty}>
                Aucune playlist disponible. Créez-en une dans Bibliothèque.
              </Text>
            ) : (
              <ScrollView showsVerticalScrollIndicator={false}>
                {userPlaylists.map(playlist => (
                  <TouchableOpacity
                    key={playlist.id}
                    style={styles.modalItem}
                    onPress={() => handleAddToPlaylist(playlist.id)}>
                    <View>
                      <Text style={styles.modalItemTitle}>{playlist.name}</Text>
                      <Text style={styles.modalItemMeta}>
                        {playlist.is_public ? 'Partagée' : 'Privée'}
                      </Text>
                    </View>
                    <Ionicons
                      name="add-circle-outline"
                      size={22}
                      color={Colors.primary}
                    />
                  </TouchableOpacity>
                ))}
              </ScrollView>
            )}
            <TouchableOpacity
              style={styles.modalClose}
              onPress={() => setPlaylistModalVisible(false)}>
              <Text style={styles.modalCloseText}>Fermer</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal
        visible={queueModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setQueueModalVisible(false)}>
        <View style={styles.modalBackdrop}>
          <View style={styles.modalSheet}>
            <Text style={styles.modalTitle}>File d'attente</Text>
            {queue.length === 0 ? (
              <Text style={styles.modalEmpty}>Aucun titre dans la file.</Text>
            ) : (
              <ScrollView showsVerticalScrollIndicator={false}>
                {queue.map((queueTrack, index) => (
                  <View
                    key={`${queueTrack.id}-${index}`}
                    style={styles.modalItem}>
                    <TouchableOpacity
                      style={styles.modalItemMain}
                      onPress={async () => {
                        await playFromQueue(index);
                        setQueueModalVisible(false);
                      }}>
                      <Text style={styles.modalItemTitle} numberOfLines={1}>
                        {queueTrack.title}
                      </Text>
                      <Text style={styles.modalItemMeta} numberOfLines={1}>
                        {getArtist(queueTrack)}
                        {index === queueIndex ? ' • En cours' : ''}
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => removeFromQueue(queueTrack.id)}>
                      <Ionicons
                        name="trash-outline"
                        size={20}
                        color={Colors.primary}
                      />
                    </TouchableOpacity>
                  </View>
                ))}
              </ScrollView>
            )}
            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.clearBtn} onPress={clearQueue}>
                <Text style={styles.clearBtnText}>Vider la file</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalClose}
                onPress={() => setQueueModalVisible(false)}>
                <Text style={styles.modalCloseText}>Fermer</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 48,
    paddingBottom: 16,
    backgroundColor: Colors.background,
  },
  headerIcon: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 22,
    backgroundColor: Colors.surface,
  },
  headerTitle: {
    color: Colors.text,
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  scrollContent: {
    paddingBottom: 40,
  },
  artContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 24,
    paddingHorizontal: 24,
  },
  art: {
    width: 300,
    height: 300,
    borderRadius: 150,
    borderWidth: 8,
    borderColor: Colors.surfaceLight,
  },
  trackInfo: {
    paddingHorizontal: 24,
    alignItems: 'center',
    marginBottom: 24,
  },
  trackTitle: {
    color: Colors.text,
    fontSize: 26,
    fontWeight: '900',
    textAlign: 'center',
    marginBottom: 8,
  },
  artistRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  trackArtist: {
    color: Colors.primary,
    fontSize: 18,
    fontWeight: '600',
  },
  likeIcon: {
    padding: 4,
  },
  progressSection: {
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  slider: {
    width: '100%',
    height: 40,
  },
  timeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: -4,
    paddingHorizontal: 4,
  },
  timeText: {
    color: Colors.muted,
    fontSize: 12,
    fontWeight: '600',
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    marginBottom: 40,
  },
  controlBtn: {
    width: 50,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bigBtn: {
    width: 84,
    height: 84,
    borderRadius: 42,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    ...Shadows.glow,
  },
  controlSmall: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  repeatBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: Colors.primary,
    width: 14,
    height: 14,
    borderRadius: 7,
    alignItems: 'center',
    justifyContent: 'center',
  },
  repeatBadgeText: {
    color: Colors.background,
    fontSize: 9,
    fontWeight: '900',
  },
  actionsContainer: {
    marginBottom: 32,
  },
  bottomActions: {
    paddingHorizontal: 24,
    gap: 16,
  },
  actionBtn: {
    alignItems: 'center',
    width: 80,
  },
  actionIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  actionLabel: {
    color: Colors.textSoft,
    fontSize: 12,
    fontWeight: '600',
  },
  queueHint: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
  },
  queueHintText: {
    color: Colors.muted,
    fontSize: 13,
  },
  queueHintAction: {
    color: Colors.primary,
    fontSize: 13,
    fontWeight: '700',
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'flex-end',
  },
  modalSheet: {
    backgroundColor: Colors.backgroundElevated,
    borderTopLeftRadius: Radius.xl,
    borderTopRightRadius: Radius.xl,
    padding: 24,
    maxHeight: '80%',
  },
  modalTitle: {
    color: Colors.text,
    fontSize: 20,
    fontWeight: '800',
    marginBottom: 20,
  },
  modalItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  modalItemMain: {
    flex: 1,
  },
  modalItemTitle: {
    color: Colors.text,
    fontSize: 16,
    fontWeight: '600',
  },
  modalItemMeta: {
    color: Colors.muted,
    fontSize: 12,
    marginTop: 2,
  },
  modalEmpty: {
    color: Colors.muted,
    textAlign: 'center',
    marginVertical: 40,
  },
  modalClose: {
    marginTop: 20,
    alignItems: 'center',
    padding: 16,
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
  },
  modalCloseText: {
    color: Colors.text,
    fontWeight: '700',
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 10,
  },
  clearBtn: {
    flex: 1,
    marginTop: 20,
    alignItems: 'center',
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.danger,
    borderRadius: Radius.lg,
  },
  clearBtnText: {
    color: Colors.danger,
    fontWeight: '700',
  },
});
