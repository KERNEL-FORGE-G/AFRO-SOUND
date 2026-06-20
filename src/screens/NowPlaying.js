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
  ActivityIndicator,
} from 'react-native';
import Slider from '@react-native-community/slider';
import Ionicons from 'react-native-vector-icons/Ionicons';
import theme, {Colors, Radius, Shadows} from '../theme';
import {useProgress} from 'react-native-track-player';
import {
  State,
  getPlaybackStateValue,
  usePlayer,
} from '../context/PlayerContext';
import {supabase} from '../supabaseClient';
import useAuth from '../hooks/useAuth';
import {SyncService} from '../services/syncService';
import {DeepLinkingService} from '../services/deepLinkingService';
import {getTrackById} from '../services/musicApi';
import AddToPlaylistModal from '../components/AddToPlaylistModal';

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
  const trackId = route.params?.trackId;
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
    isPlaying,
  } = usePlayer();

  const {position, duration} = useProgress(500);
  const [isLiked, setIsLiked] = useState(false);
  const [isSeeking, setIsSeeking] = useState(false);
  const [seekPreview, setSeekPreview] = useState(0);
  const [playlistModalVisible, setPlaylistModalVisible] = useState(false);
  const [queueModalVisible, setQueueModalVisible] = useState(false);
  const [optionsModalVisible, setOptionsModalVisible] = useState(false);
  const [loadingTrack, setLoadingTrack] = useState(false);

  const track = currentTrack || routeTrack || {};
  const displayedPosition = isSeeking ? seekPreview : position;
  const displayedDuration = duration || track.duration || 0;
  const artwork = getArtwork(track);

  useEffect(() => {
    if (trackId && !routeTrack && !currentTrack) {
      loadTrackById(trackId);
    }
  }, [trackId]);

  const loadTrackById = async id => {
    setLoadingTrack(true);
    try {
      const data = await getTrackById(id);
      if (data) {
        await playTrack(data);
      }
    } catch (error) {
      console.warn(error);
    } finally {
      setLoadingTrack(false);
    }
  };

  useEffect(() => {
    if (playlistId && user) {
      SyncService.joinSession(playlistId, user.id, ownerId);
    }
    return () => SyncService.leaveSession();
  }, [playlistId, user, ownerId]);

  useEffect(() => {
    let interval = null;
    if (playlistId && user?.id === ownerId && isPlaying) {
      interval = setInterval(() => {
        SyncService.broadcastState(track, position, isPlaying);
      }, 3000);
    }
    return () => {
      if (interval) {
        clearInterval(interval);
      }
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
    return () => spinAnimation.current?.stop();
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

  const openPlaylistModal = () => {
    if (!user) {
      navigation.navigate('Login');
      return;
    }
    setOptionsModalVisible(false);
    setPlaylistModalVisible(true);
  };

  const toggleLike = async () => {
    if (!user) {
      navigation.navigate('Login');
      return;
    }
    try {
      if (isLiked) {
        await supabase
          .from('favorites')
          .delete()
          .eq('user_id', user.id)
          .eq('track_id', track.id);
        setIsLiked(false);
        return;
      }
      await supabase.from('tracks').upsert([
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
      await supabase.from('favorites').insert([
        {
          user_id: user.id,
          track_id: track.id,
        },
      ]);
      setIsLiked(true);
    } catch (error) {
      console.warn(error);
    }
  };

  const handleSeekComplete = async value => {
    const nextPosition = Math.floor(value);
    setSeekPreview(nextPosition);
    setIsSeeking(false);
    await seekTo(nextPosition);
  };

  const handleTrackShare = async () => {
    setOptionsModalVisible(false);
    try {
      await DeepLinkingService.shareTrack(track);
    } catch (error) {
      console.warn(error);
    }
  };

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

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
      onPress: () => {
        setOptionsModalVisible(false);
        downloadTrack(track);
      },
    },
    {
      icon: 'share-social-outline',
      label: 'Partager',
      onPress: handleTrackShare,
    },
  ];

  const handleBack = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      navigation.navigate('Home');
    }
  };

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
          onPress={handleBack}
          activeOpacity={0.8}
          style={styles.headerIcon}>
          <Ionicons name="chevron-back" size={28} color={Colors.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Lecteur</Text>
        <TouchableOpacity
          activeOpacity={0.8}
          style={styles.headerIcon}
          onPress={() => setOptionsModalVisible(true)}>
          <Ionicons name="ellipsis-vertical" size={24} color={Colors.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
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

          <TouchableOpacity style={styles.controlBtn} onPress={skipToPrevious}>
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

          <TouchableOpacity style={styles.controlBtn} onPress={skipToNext}>
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
            contentContainerStyle={styles.bottomActions}>
            {bottomActions.map((action, idx) => (
              <TouchableOpacity
                key={idx}
                style={styles.actionBtn}
                onPress={action.onPress}
                activeOpacity={0.7}>
                <View style={styles.actionIconContainer}>
                  <Ionicons
                    name={action.icon}
                    size={22}
                    color={Colors.primary}
                  />
                </View>
                <Text style={styles.actionLabel}>{action.label}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <View style={styles.queueHint}>
          <Text style={styles.queueHintText}>
            File: {queueIndex + 1}/{Math.max(queue.length, 1)}
          </Text>
          <TouchableOpacity onPress={() => setQueueModalVisible(true)}>
            <Text style={styles.queueHintAction}>Voir tout</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Modal Options */}
      <Modal
        visible={optionsModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setOptionsModalVisible(false)}>
        <TouchableOpacity
          style={styles.modalBackdrop}
          activeOpacity={1}
          onPress={() => setOptionsModalVisible(false)}>
          <View style={styles.modalSheet}>
            <Text style={styles.modalTitle}>Options du morceau</Text>
            <TouchableOpacity
              style={styles.optionItem}
              onPress={openPlaylistModal}>
              <Ionicons
                name="add-circle-outline"
                size={24}
                color={Colors.text}
              />
              <Text style={styles.optionText}>Ajouter à une playlist</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.optionItem}
              onPress={handleTrackShare}>
              <Ionicons
                name="share-social-outline"
                size={24}
                color={Colors.text}
              />
              <Text style={styles.optionText}>Partager le morceau</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.optionItem}
              onPress={() => {
                setOptionsModalVisible(false);
                downloadTrack(track);
              }}>
              <Ionicons name="download-outline" size={24} color={Colors.text} />
              <Text style={styles.optionText}>Télécharger</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.modalClose}
              onPress={() => setOptionsModalVisible(false)}>
              <Text style={styles.modalCloseText}>Annuler</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      <AddToPlaylistModal
        visible={playlistModalVisible}
        onClose={() => setPlaylistModalVisible(false)}
        track={track}
      />

      {/* Modal Queue */}
      <Modal
        visible={queueModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setQueueModalVisible(false)}>
        <View style={styles.modalBackdrop}>
          <View style={styles.modalSheet}>
            <Text style={styles.modalTitle}>File d'attente</Text>
            <ScrollView>
              {queue.map((t, i) => (
                <TouchableOpacity
                  key={`${t.id}-${i}`}
                  style={styles.modalItem}
                  onPress={() => {
                    playFromQueue(i);
                    setQueueModalVisible(false);
                  }}>
                  <View style={{flex: 1}}>
                    <Text
                      style={[
                        styles.modalItemTitle,
                        i === queueIndex && {color: Colors.primary},
                      ]}>
                      {t.title}
                    </Text>
                    <Text style={styles.modalItemMeta}>{getArtist(t)}</Text>
                  </View>
                  <TouchableOpacity onPress={() => removeFromQueue(t.id)}>
                    <Ionicons
                      name="close-circle-outline"
                      size={22}
                      color={Colors.danger}
                    />
                  </TouchableOpacity>
                </TouchableOpacity>
              ))}
            </ScrollView>
            <View style={{flexDirection: 'row', gap: 10, marginTop: 10}}>
              <TouchableOpacity
                style={[
                  styles.clearBtn,
                  {backgroundColor: Colors.danger + '20'},
                ]}
                onPress={() => {
                  clearQueue();
                  setQueueModalVisible(false);
                }}>
                <Text style={{color: Colors.danger, fontWeight: 'bold'}}>
                  Vider
                </Text>
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
    backgroundColor: 'rgba(0,0,0,0.85)',
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
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  optionText: {
    color: Colors.text,
    fontSize: 16,
    fontWeight: '600',
  },
  modalItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
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
  modalClose: {
    marginTop: 20,
    alignItems: 'center',
    padding: 16,
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    flex: 1,
  },
  modalCloseText: {
    color: Colors.text,
    fontWeight: '700',
  },
  clearBtn: {
    marginTop: 20,
    alignItems: 'center',
    padding: 16,
    borderRadius: Radius.lg,
    flex: 0.5,
  },
});
