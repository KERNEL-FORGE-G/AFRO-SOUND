import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Easing,
  Alert,
} from 'react-native';
import Slider from '@react-native-community/slider';
import theme, {Colors} from '../theme';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {
  usePlayer,
  usePlaybackState,
  useProgress,
  State,
  getPlaybackStateValue,
} from '../context/PlayerContext';

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
  const routeTrack = route.params?.track;
  const {
    currentTrack,
    queue,
    togglePlayback,
    skipToNext,
    skipToPrevious,
    seekTo,
  } = usePlayer();
  const playbackState = usePlaybackState();
  const {position, duration} = useProgress(500);
  const [isLiked, setIsLiked] = useState(false);
  const [isSeeking, setIsSeeking] = useState(false);
  const [seekPreview, setSeekPreview] = useState(0);

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
      onPress: () => setIsLiked(!isLiked),
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
      icon: 'share-social-outline',
      label: 'Partager',
      onPress: () => Alert.alert('Partager', 'Partager ce titre'),
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
              <TouchableOpacity onPress={() => setIsLiked(!isLiked)}>
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
        <TouchableOpacity
          onPress={() =>
            Alert.alert(
              'Mode Aléatoire',
              'Lecture aléatoire activée/désactivée',
            )
          }>
          <Ionicons name="shuffle" size={26} color={Colors.primary} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.smallBtn} onPress={handleSkipPrevious}>
          <Ionicons name="play-skip-back" size={24} color={Colors.text} />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.bigBtn}
          onPress={() => togglePlayback(playbackState)}>
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

        <TouchableOpacity
          onPress={() =>
            Alert.alert('Répéter', 'Mode répétition activé/désactivé')
          }>
          <Ionicons name="repeat" size={26} color={Colors.primary} />
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
});
