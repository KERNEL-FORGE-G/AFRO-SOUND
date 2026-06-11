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
  RepeatMode,
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
    isShuffle,
    repeatMode,
    togglePlayback,
    skipToNext,
    skipToPrevious,
    seekTo,
    toggleShuffle,
    cycleRepeatMode,
    downloadTrack,
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
        duration: 15000,
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
      console.warn('Skip Previous Error', error);
    }
  };

  const handleSkipNext = async () => {
    try {
      await skipToNext();
    } catch (error) {
      console.warn('Skip Next Error', error);
    }
  };

  const bottomActions = [
    {
      icon: isLiked ? 'heart' : 'heart-outline',
      label: 'Like',
      active: isLiked,
      onPress: () => setIsLiked(!isLiked),
    },
    {
      icon: 'text-outline',
      label: 'Paroles',
      onPress: () => navigation.navigate('Lyrics'),
    },
    {
      icon: 'download-outline',
      label: 'Télécharger',
      onPress: () => downloadTrack(track),
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
  ];

  const getRepeatIcon = () => {
    if (repeatMode === RepeatMode.Track) return 'repeat';
    return 'repeat';
  };

  const getRepeatColor = () => {
    if (repeatMode === RepeatMode.Off) return Colors.muted;
    return Colors.primary;
  };

  return (
    <View style={[theme.container, styles.main]}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          activeOpacity={0.8}
          style={styles.headerIcon}>
          <Ionicons name="chevron-down" size={32} color={Colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Lecture en cours</Text>
        <TouchableOpacity
          activeOpacity={0.8}
          style={styles.headerIcon}
          onPress={() =>
            Alert.alert('Options', 'Menu des options de la piste.')
          }>
          <Ionicons name="ellipsis-horizontal" size={24} color={Colors.text} />
        </TouchableOpacity>
      </View>

      <View style={styles.artContainer}>
        <View style={styles.artWrapper}>
          <Animated.Image
            source={artwork ? {uri: artwork} : require('../../logo.png')}
            style={[styles.art, {transform: [{rotate: spin}]}]}
          />
        </View>
      </View>

      <View style={styles.trackInfo}>
        <Text style={styles.trackTitle} numberOfLines={1}>
          {track.title || 'Titre inconnu'}
        </Text>
        <Text style={styles.trackArtist} numberOfLines={1}>
          {getArtist(track)}
        </Text>
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
          maximumTrackTintColor={Colors.border}
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
            size={28}
            color={isShuffle ? Colors.primary : Colors.muted}
          />
        </TouchableOpacity>

        <TouchableOpacity style={styles.skipBtn} onPress={handleSkipPrevious}>
          <Ionicons name="play-skip-back" size={32} color={Colors.text} />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.playBtn}
          onPress={() => togglePlayback(playbackState)}>
          <Ionicons
            name={isPlaying ? 'pause' : 'play'}
            size={36}
            color={Colors.background}
            style={{marginLeft: isPlaying ? 0 : 4}}
          />
        </TouchableOpacity>

        <TouchableOpacity style={styles.skipBtn} onPress={handleSkipNext}>
          <Ionicons name="play-skip-forward" size={32} color={Colors.text} />
        </TouchableOpacity>

        <TouchableOpacity onPress={cycleRepeatMode}>
          <View style={{position: 'relative'}}>
            <Ionicons name={getRepeatIcon()} size={28} color={getRepeatColor()} />
            {repeatMode === RepeatMode.Track && (
              <Text style={styles.repeatOneText}>1</Text>
            )}
          </View>
        </TouchableOpacity>
      </View>

      <View style={styles.bottomActions}>
        {bottomActions.map(action => (
          <TouchableOpacity
            key={action.label}
            style={styles.actionBtn}
            onPress={action.onPress}
            activeOpacity={0.8}>
            <Ionicons
              name={action.icon}
              size={24}
              color={action.active ? Colors.primary : Colors.text}
            />
            <Text style={[styles.actionLabel, action.active && {color: Colors.primary}]}>
              {action.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  main: {
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 48,
    paddingBottom: 20,
  },
  headerTitle: {
    color: Colors.text,
    fontSize: 16,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  headerIcon: {width: 40, alignItems: 'center'},
  artContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  artWrapper: {
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: Colors.surface,
    elevation: 20,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 15},
    shadowOpacity: 0.5,
    shadowRadius: 20,
    overflow: 'hidden',
    borderWidth: 8,
    borderColor: Colors.surfaceLight,
  },
  art: {
    width: '100%',
    height: '100%',
  },
  trackInfo: {
    alignItems: 'center',
    paddingHorizontal: 40,
    marginBottom: 30,
  },
  trackTitle: {
    color: Colors.text,
    fontSize: 26,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 8,
  },
  trackArtist: {
    color: Colors.primary,
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },
  progressSection: {
    paddingHorizontal: 30,
    marginBottom: 30,
  },
  slider: {
    width: '100%',
    height: 40,
  },
  timeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 5,
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
    paddingHorizontal: 30,
    marginBottom: 40,
  },
  playBtn: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: Colors.primary,
    shadowOffset: {width: 0, height: 10},
    shadowOpacity: 0.4,
    shadowRadius: 15,
    elevation: 10,
  },
  skipBtn: {
    padding: 10,
  },
  repeatOneText: {
    position: 'absolute',
    top: 8,
    left: 10,
    fontSize: 10,
    fontWeight: 'bold',
    color: Colors.primary,
  },
  bottomActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingBottom: 40,
    paddingHorizontal: 20,
  },
  actionBtn: {
    alignItems: 'center',
  },
  actionLabel: {
    color: Colors.muted,
    fontSize: 10,
    fontWeight: '600',
    marginTop: 6,
  },
});
