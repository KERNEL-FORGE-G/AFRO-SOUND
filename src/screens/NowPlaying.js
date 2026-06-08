<<<<<<< HEAD
import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Animated,
  Easing,
  Alert,
} from 'react-native';
import Slider from '@react-native-community/slider';
import theme, {Colors} from '../theme';
import Ionicons from 'react-native-vector-icons/Ionicons';

export default function NowPlaying({navigation, route}) {
  const { track } = route.params;
  const [isPlaying, setIsPlaying] = useState(true);
  const [isLiked, setIsLiked] = useState(false);
  const [position, setPosition] = useState(0);
  const duration = track.duration || 200;

  useEffect(() => {
    let interval;
    if (isPlaying && position < duration) {
      interval = setInterval(() => {
        setPosition(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, position, duration]);

  const spinValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const spinAnimation = Animated.loop(
      Animated.timing(spinValue, {
        toValue: 1,
        duration: 12000,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    );

    if (isPlaying) {
      spinAnimation.start();
    } else {
      spinAnimation.stop();
    }
    return () => spinAnimation.stop();
  }, [isPlaying, spinValue]);

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });
=======
import React, {useState} from 'react';
import {View, Text, StyleSheet, Alert, TouchableOpacity} from 'react-native';
import Slider from '@react-native-community/slider';
import {Colors} from '../theme';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {usePlayer, useProgress, State} from '../context/PlayerContext';
import TrackPlayer from 'react-native-track-player';

export default function NowPlaying({navigation, route}) {
  const {track} = route.params;
  const {downloadTrack, skipToNext, skipToPrevious} = usePlayer();
  const [isLiked, setIsLiked] = useState(false);

  const {position, duration} = useProgress();
  const percentage = duration > 0 ? Math.round((position / duration) * 100) : 0;

  const isPlaying = true; // Simplified for this iteration

  const toggleLike = () => {
    setIsLiked(!isLiked);
    Alert.alert(
      'Favoris',
      isLiked ? 'Retiré des favoris' : 'Ajouté aux favoris',
    );
  };
>>>>>>> upstream/main

  const formatTime = secs => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

<<<<<<< HEAD
  const bottomActions = [
    {icon: 'heart-outline', label: 'Like', onPress: () => setIsLiked(!isLiked)},
    {icon: 'text-outline', label: 'Paroles', onPress: () => navigation.navigate('Lyrics')},
    {icon: 'list-outline', label: 'File', onPress: () => Alert.alert('File', 'File d\'attente')},
    {icon: 'share-social-outline', label: 'Partager', onPress: () => Alert.alert('Partager', 'Partager ce titre')},
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
          onPress={() => Alert.alert('Options', 'Menu des options de la piste.')}>
          <Ionicons name="ellipsis-vertical" size={24} color={Colors.primary} />
=======
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.headerIcon}>
          <Ionicons name="chevron-down" size={28} color={Colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Lecture en cours</Text>
        <TouchableOpacity onPress={toggleLike} style={styles.headerIcon}>
          <Ionicons
            name={isLiked ? 'heart' : 'heart-outline'}
            size={24}
            color={isLiked ? Colors.primary : Colors.text}
          />
>>>>>>> upstream/main
        </TouchableOpacity>
      </View>

      <View style={styles.artContainer}>
<<<<<<< HEAD
        <Animated.Image
          source={track.cover_url ? {uri: track.cover_url} : require('../../logo.png')}
          style={[styles.art, {transform: [{rotate: spin}]}]}
        />
      </View>

      <View style={styles.trackInfo}>
        <View style={styles.titleRow}>
          <View style={{flex: 1}}>
            <Text style={styles.trackTitle}>{track.title}</Text>
            <View style={styles.artistRow}>
              <Text style={styles.trackArtist}>{track.artist}</Text>
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
=======
        <View style={styles.art} />
      </View>

      <View style={styles.trackInfo}>
        <Text style={styles.trackTitle}>{track.title}</Text>
        <Text style={styles.trackArtist}>{track.artist}</Text>
>>>>>>> upstream/main
      </View>

      <View style={styles.progressSection}>
        <Slider
          style={styles.slider}
          minimumValue={0}
          maximumValue={duration}
          value={position}
<<<<<<< HEAD
          onSlidingComplete={val => setPosition(Math.floor(val))}
          minimumTrackTintColor={Colors.primary}
          maximumTrackTintColor={Colors.accent}
=======
          minimumTrackTintColor={Colors.primary}
          maximumTrackTintColor={Colors.surfaceLight}
>>>>>>> upstream/main
          thumbTintColor={Colors.primary}
        />
        <View style={styles.timeRow}>
          <Text style={styles.timeText}>{formatTime(position)}</Text>
<<<<<<< HEAD
=======
          <Text style={styles.timeText}>{percentage}%</Text>
>>>>>>> upstream/main
          <Text style={styles.timeText}>{formatTime(duration)}</Text>
        </View>
      </View>

      <View style={styles.controls}>
<<<<<<< HEAD
        <TouchableOpacity
          onPress={() => Alert.alert('Mode Aléatoire', 'Lecture aléatoire activée/désactivée')}>
          <Ionicons name="shuffle" size={26} color={Colors.primary} />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.smallBtn}
          onPress={() => Alert.alert('Précédent', 'Retour à la piste précédente')}>
          <Ionicons name="play-skip-back" size={24} color={Colors.text} />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.bigBtn}
          onPress={() => setIsPlaying(!isPlaying)}>
=======
        <TouchableOpacity onPress={skipToPrevious}>
          <Ionicons name="play-skip-back" size={32} color={Colors.text} />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => TrackPlayer.play()}
          style={styles.bigBtn}>
>>>>>>> upstream/main
          <Ionicons
            name={isPlaying ? 'pause' : 'play'}
            size={40}
            color={Colors.background}
<<<<<<< HEAD
            style={{marginLeft: isPlaying ? 0 : 4}}
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.smallBtn}
          onPress={() => Alert.alert('Suivant', 'Passer à la piste suivante')}>
          <Ionicons name="play-skip-forward" size={24} color={Colors.text} />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => Alert.alert('Répéter', 'Mode répétition activé/désactivé')}>
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
=======
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={skipToNext}>
          <Ionicons name="play-skip-forward" size={32} color={Colors.text} />
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        onPress={() => downloadTrack(track)}
        style={styles.downloadBtn}>
        <Ionicons name="download-outline" size={24} color={Colors.primary} />
      </TouchableOpacity>
>>>>>>> upstream/main
    </View>
  );
}

const styles = StyleSheet.create({
<<<<<<< HEAD
=======
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    paddingHorizontal: 20,
  },
>>>>>>> upstream/main
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
<<<<<<< HEAD
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
=======
    paddingTop: 50,
  },
  headerTitle: {color: Colors.text, fontWeight: 'bold'},
  headerIcon: {width: 40, alignItems: 'center'},
  artContainer: {marginTop: 40, alignItems: 'center'},
  art: {
    width: 300,
    height: 300,
    borderRadius: 12,
    backgroundColor: Colors.surface,
  },
  trackInfo: {marginTop: 30, alignItems: 'center'},
  trackTitle: {color: Colors.text, fontSize: 24, fontWeight: '800'},
  trackArtist: {color: Colors.muted, fontSize: 16, marginTop: 4},
  progressSection: {marginTop: 30},
  slider: {width: '100%', height: 40},
  timeRow: {flexDirection: 'row', justifyContent: 'space-between'},
  timeText: {color: Colors.muted, fontSize: 12},
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    marginTop: 30,
  },
  bigBtn: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: Colors.text,
    justifyContent: 'center',
    alignItems: 'center',
  },
  downloadBtn: {alignItems: 'center', marginTop: 20},
>>>>>>> upstream/main
});
