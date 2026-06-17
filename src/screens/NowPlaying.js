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
import theme, {Colors} from '../theme';
import {
  State,
  getPlaybackStateValue,
  usePlaybackState,
  usePlayer,
  useProgress,
} from '../context/PlayerContext';
import {supabase} from '../supabaseClient';
import useAuth from '../hooks/useAuth';
import {
  addTrackToRemotePlaylist,
  fetchUserPlaylists,
  shareTrack,
} from '../services/playlistService';

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
    seekTo,
    skipToNext,
    skipToPrevious,
    togglePlayback,
    toggleRepeat,
    toggleShuffle,
    isShuffle,
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

  const track = currentTrack || routeTrack || {};
  const playbackStateValue = getPlaybackStateValue(playbackState);
  const isPlaying = playbackStateValue === State.Playing;
  const displayedPosition = isSeeking ? seekPreview : position;
  const displayedDuration = duration || track.duration || 0;
  const artwork = getArtwork(track);

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

      await supabase.from('tracks').upsert([
        {
          id: track.id,
          title: track.title,
          artist: getArtist(track),
          album: track.album || '',
          cover_url: track.artwork || track.cover || track.cover_url,
          audio_url: track.url || track.audioUrl,
          source: track.source,
          duration: track.duration,
        },
      ]);

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
      Alert.alert('Précédent', 'Aucune piste précédente dans la file.');
    }
  };

  const handleSkipNext = async () => {
    try {
      await skipToNext();
    } catch (error) {
      Alert.alert('Suivant', 'Aucune piste suivante dans la file.');
    }
  };

  const handleAddCurrentTrackToQueue = async () => {
    const added = await addToQueue(track);
    if (added) {
      Alert.alert('File mise à jour', 'Le titre a été ajouté à la file.');
    }
  };

  const handleAddToPlaylist = async playlistId => {
    try {
      await addTrackToRemotePlaylist(playlistId, track);
      setPlaylistModalVisible(false);
      Alert.alert(
        'Playlist mise à jour',
        'Le titre a été ajouté à la playlist.',
      );
    } catch (error) {
      Alert.alert('Erreur', error.message);
    }
  };

  const handleTrackShare = async () => {
    try {
      await shareTrack(track);
    } catch (error) {
      Alert.alert('Partage impossible', error.message);
    }
  };

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const bottomActions = [
    {
      icon: isLiked ? 'heart' : 'heart-outline',
      label: 'Favori',
      onPress: toggleLike,
    },
    {
      icon: 'add-circle-outline',
      label: 'Playlist',
      onPress: openPlaylistModal,
    },
    {
      icon: 'list-outline',
      label: 'File',
      onPress: () => setQueueModalVisible(true),
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

  return (
    <View style={theme.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          activeOpacity={0.8}
          style={styles.headerIcon}>
          <Ionicons name="chevron-back" size={28} color={Colors.primary} />
        </TouchableOpacity>
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

      <View style={styles.artContainer}>
        <Animated.Image
          source={artwork ? {uri: artwork} : require('../../logo.png')}
          style={[styles.art, {transform: [{rotate: spin}]}]}
        />
      </View>

      <View style={styles.trackInfo}>
        <View style={styles.titleRow}>
          <View style={styles.titleBlock}>
            <Text style={styles.trackTitle} numberOfLines={2}>
              {track.title || 'Titre inconnu'}
            </Text>
            <View style={styles.artistRow}>
              <Text style={styles.trackArtist} numberOfLines={1}>
                {getArtist(track)}
              </Text>
              <TouchableOpacity onPress={toggleLike}>
                <Ionicons
                  name={isLiked ? 'heart' : 'heart-outline'}
                  size={22}
                  color={Colors.primary}
                />
              </TouchableOpacity>
            </View>
          </View>
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
          maximumTrackTintColor={Colors.accent}
          thumbTintColor={Colors.primary}
        />
        <View style={styles.timeRow}>
          <Text style={styles.timeText}>{formatTime(displayedPosition)}</Text>
          <Text style={styles.timeText}>{formatTime(displayedDuration)}</Text>
        </View>
      </View>

      <View style={styles.controls}>
        <TouchableOpacity onPress={toggleShuffle}>
          <Ionicons
            name="shuffle"
            size={26}
            color={isShuffle ? Colors.primary : Colors.muted}
          />
        </TouchableOpacity>

        <TouchableOpacity style={styles.smallBtn} onPress={handleSkipPrevious}>
          <Ionicons name="play-skip-back" size={24} color={Colors.text} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.bigBtn} onPress={togglePlayback}>
          <Ionicons
            name={isPlaying ? 'pause' : 'play'}
            size={40}
            color={Colors.background}
            style={isPlaying ? styles.playIconPaused : styles.playIcon}
          />
        </TouchableOpacity>

        <TouchableOpacity style={styles.smallBtn} onPress={handleSkipNext}>
          <Ionicons name="play-skip-forward" size={24} color={Colors.text} />
        </TouchableOpacity>

        <TouchableOpacity onPress={toggleRepeat} style={styles.repeatButton}>
          <Ionicons
            name="repeat"
            size={26}
            color={repeatMode === 'off' ? Colors.muted : Colors.primary}
          />
          {repeatMode === 'one' && (
            <View style={styles.repeatBadge}>
              <Text style={styles.repeatBadgeText}>1</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      <View style={styles.bottomActions}>
        {bottomActions.map(action => (
          <TouchableOpacity
            key={action.label}
            style={styles.actionBtn}
            onPress={action.onPress}
            activeOpacity={0.8}>
            <Ionicons name={action.icon} size={20} color={Colors.primary} />
            <Text style={styles.actionLabel}>{action.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.queueHint}>
        <Text style={styles.queueHintText}>
          File active: {queueIndex + 1}/{Math.max(queue.length, 1)}
        </Text>
        <TouchableOpacity onPress={handleAddCurrentTrackToQueue}>
          <Text style={styles.queueHintAction}>Dupliquer dans la file</Text>
        </TouchableOpacity>
      </View>

      <Modal
        visible={playlistModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setPlaylistModalVisible(false)}>
        <View style={styles.modalBackdrop}>
          <View style={styles.modalSheet}>
            <Text style={styles.modalTitle}>Ajouter à une playlist</Text>
            {isLoadingPlaylists ? (
              <Text style={styles.modalEmpty}>Chargement...</Text>
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
    paddingBottom: 8,
  },
  headerIcon: {width: 40, alignItems: 'center'},
  artContainer: {
    paddingHorizontal: 24,
    paddingTop: 8,
    alignItems: 'center',
  },
  art: {
    width: 320,
    height: 320,
    borderRadius: 24,
  },
  trackInfo: {
    paddingHorizontal: 24,
    marginTop: 20,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  titleBlock: {flex: 1},
  trackTitle: {
    color: Colors.text,
    fontSize: 28,
    fontWeight: '800',
    textAlign: 'center',
  },
  artistRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 6,
  },
  trackArtist: {
    color: Colors.primary,
    fontSize: 18,
    fontWeight: '600',
    maxWidth: '85%',
  },
  progressSection: {
    paddingHorizontal: 24,
    marginTop: 16,
  },
  slider: {
    width: '100%',
    height: 40,
    marginVertical: -8,
  },
  timeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 2,
  },
  timeText: {
    color: Colors.muted,
    fontSize: 12,
    fontWeight: '500',
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
    paddingHorizontal: 20,
  },
  smallBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bigBtn: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: Colors.primary,
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 6,
  },
  playIcon: {
    marginLeft: 4,
  },
  playIconPaused: {
    marginLeft: 0,
  },
  repeatButton: {
    width: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottomActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 28,
    paddingHorizontal: 16,
    paddingBottom: 12,
    flexWrap: 'wrap',
    rowGap: 10,
  },
  actionBtn: {
    borderWidth: 1.5,
    borderColor: Colors.primary,
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
    alignItems: 'center',
    minWidth: 72,
  },
  actionLabel: {
    color: Colors.primary,
    fontSize: 11,
    fontWeight: '600',
    marginTop: 4,
  },
  repeatBadge: {
    position: 'absolute',
    top: -2,
    right: -2,
    backgroundColor: Colors.primary,
    borderRadius: 6,
    width: 12,
    height: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  repeatBadgeText: {
    color: Colors.background,
    fontSize: 8,
    fontWeight: 'bold',
  },
  queueHint: {
    paddingHorizontal: 24,
    alignItems: 'center',
    gap: 6,
  },
  queueHintText: {
    color: Colors.textSoft,
    fontSize: 12,
    fontWeight: '600',
  },
  queueHintAction: {
    color: Colors.primary,
    fontSize: 12,
    fontWeight: '700',
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.55)',
    justifyContent: 'flex-end',
  },
  modalSheet: {
    backgroundColor: Colors.card,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 28,
    maxHeight: '70%',
  },
  modalTitle: {
    color: Colors.text,
    fontSize: 20,
    fontWeight: '800',
    marginBottom: 16,
  },
  modalEmpty: {
    color: Colors.textSoft,
    lineHeight: 22,
    marginBottom: 18,
  },
  modalItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  modalItemMain: {
    flex: 1,
    paddingRight: 12,
  },
  modalItemTitle: {
    color: Colors.text,
    fontSize: 15,
    fontWeight: '700',
  },
  modalItemMeta: {
    color: Colors.textSoft,
    fontSize: 12,
    marginTop: 5,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 18,
    gap: 12,
  },
  modalClose: {
    marginTop: 18,
    backgroundColor: Colors.primary,
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: 'center',
    flex: 1,
  },
  modalCloseText: {
    color: Colors.background,
    fontWeight: '800',
  },
  clearBtn: {
    marginTop: 18,
    borderWidth: 1,
    borderColor: Colors.borderStrong,
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: 'center',
    flex: 1,
  },
  clearBtnText: {
    color: Colors.text,
    fontWeight: '700',
  },
});
