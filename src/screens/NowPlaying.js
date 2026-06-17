import React, {useEffect, useRef, useState, useCallback} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Easing,
  Alert,
  Share,
} from 'react-native';
import Slider from '@react-native-community/slider';
import theme, {Colors} from '../theme';
import Ionicons from 'react-native-vector-icons/Ionicons';
import TrackPlayer from 'react-native-track-player';
import {
  usePlayer,
  useProgress,
  State,
} from '../context/PlayerContext';
import {supabase} from '../supabaseClient';
import {upsertTrack} from '../services/musicApi';
import useAuth from '../hooks/useAuth';

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
    currentTrack,
    queue,
    togglePlayback,
    isPlaying,
    skipToNext,
    skipToPrevious,
    seekTo,
    repeatMode,
    toggleRepeat,
    isShuffle,
    toggleShuffle,
    downloadTrack,
  } = usePlayer();
  const {position, duration} = useProgress(500);
  const [isLiked, setIsLiked] = useState(false);
  const [isSeeking, setIsSeeking] = useState(false);
  const [seekPreview, setSeekPreview] = useState(0);

  const track = currentTrack || routeTrack || {};
  const displayedPosition = isSeeking ? seekPreview : position;
  const displayedDuration = duration || track.duration || 0;
  const artwork = getArtwork(track);

  // Synchronisation avec le lecteur natif
  useEffect(() => {
    const listener = TrackPlayer.addEventListener(
      'playbackActiveTrackChanged',
      async () => {
        const track = await TrackPlayer.getActiveTrack();
        if (track) {
          // Si on utilise une mise à jour globale dans le contexte, on pourrait l'utiliser ici
          // Pour l'instant, on se base sur la mise à jour via TrackPlayer directement
        }
      },
    );
    return () => listener.remove();
  }, []);

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
    try {
      const {data} = await supabase
        .from('favorites')
        .select('*')
        .eq('user_id', user.id)
        .eq('track_id', track.id)
        .single();

      if (data) {
        setIsLiked(true);
      } else {
        setIsLiked(false);
      }
    } catch (e) {
      setIsLiked(false);
    }
  }, [user?.id, track.id]);

  useEffect(() => {
    if (user && track.id) {
      checkIfLiked();
    }
  }, [user, track.id, checkIfLiked]);

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
      } else {
        // Ensure track exists in tracks table first using the backend service
        await upsertTrack(track);

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
      }
    } catch (e) {
      Alert.alert('Erreur', e.message);
    }
  };

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

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

  const bottomActions = [
    {
      icon: isLiked ? 'heart' : 'heart-outline',
      label: 'Like',
      onPress: toggleLike,
    },
    {
      icon: 'text-outline',
      label: 'Paroles',
      onPress: () => navigation.navigate('Lyrics'),
    },
    {
      icon: 'list-outline',
      label: 'File',
      onPress: () =>
        Alert.alert(
          "File d'attente",
          queue.length > 0
            ? `${queue.length} titre${queue.length > 1 ? 's' : ''} chargé${
                queue.length > 1 ? 's' : ''
              }.`
            : "Aucune file d'attente chargée.",
        ),
    },
    {
      icon: 'download-outline',
      label: 'Télécharger',
      onPress: () => {
        downloadTrack(track);
      },
    },
    {
      icon: 'share-social-outline',
      label: 'Partager',
      onPress: async () => {
        try {
          await Share.share({
            message: `Écoute ${track.title} de ${getArtist(track)} sur Afro Sound !`,
            url: track.url || track.audioUrl,
          });
        } catch (error) {
          Alert.alert('Erreur', error.message);
        }
      },
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
            Alert.alert('Options', 'Menu des options de la piste.')
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
          <View style={{flex: 1}}>
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

        <TouchableOpacity
          style={styles.bigBtn}
          onPress={() => togglePlayback()}>
          <Ionicons
            name={isPlaying ? 'pause' : 'play'}
            size={40}
            color={Colors.background}
            style={{marginLeft: isPlaying ? 0 : 4}}
          />
        </TouchableOpacity>

        <TouchableOpacity style={styles.smallBtn} onPress={handleSkipNext}>
          <Ionicons name="play-skip-forward" size={24} color={Colors.text} />
        </TouchableOpacity>

        <TouchableOpacity onPress={toggleRepeat}>
          <Ionicons
            name={repeatMode === 'track' ? 'repeat-outline' : 'repeat'}
            size={26}
            color={repeatMode === 'off' ? Colors.muted : Colors.primary}
          />
          {repeatMode === 'track' && (
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
  trackAlbum: {
    color: Colors.accent,
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
    marginTop: 4,
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
  bottomActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 28,
    paddingHorizontal: 16,
    paddingBottom: 24,
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
});
