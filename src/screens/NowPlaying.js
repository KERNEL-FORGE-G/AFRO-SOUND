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

  const formatTime = secs => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

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
        </TouchableOpacity>
      </View>

      <View style={styles.artContainer}>
        <View style={styles.art} />
      </View>

      <View style={styles.trackInfo}>
        <Text style={styles.trackTitle}>{track.title}</Text>
        <Text style={styles.trackArtist}>{track.artist}</Text>
      </View>

      <View style={styles.progressSection}>
        <Slider
          style={styles.slider}
          minimumValue={0}
          maximumValue={duration}
          value={position}
          minimumTrackTintColor={Colors.primary}
          maximumTrackTintColor={Colors.surfaceLight}
          thumbTintColor={Colors.primary}
        />
        <View style={styles.timeRow}>
          <Text style={styles.timeText}>{formatTime(position)}</Text>
          <Text style={styles.timeText}>{percentage}%</Text>
          <Text style={styles.timeText}>{formatTime(duration)}</Text>
        </View>
      </View>

      <View style={styles.controls}>
        <TouchableOpacity onPress={skipToPrevious}>
          <Ionicons name="play-skip-back" size={32} color={Colors.text} />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => TrackPlayer.play()}
          style={styles.bigBtn}>
          <Ionicons
            name={isPlaying ? 'pause' : 'play'}
            size={40}
            color={Colors.background}
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
});
