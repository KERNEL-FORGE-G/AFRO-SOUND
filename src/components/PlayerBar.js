import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet, Image} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {Colors} from '../theme';
import Ionicons from 'react-native-vector-icons/Ionicons';
<<<<<<< HEAD

export default function PlayerBar() {
  const navigation = useNavigation();
=======
import {usePlayer, State, usePlaybackState} from '../context/PlayerContext';
import TrackPlayer from 'react-native-track-player';

export default function PlayerBar() {
  const navigation = useNavigation();
  const {currentTrack} = usePlayer();
  const playbackState = usePlaybackState();

  if (!currentTrack) {
    return null;
  }

  const isPlaying = playbackState.state === State.Playing;

  const togglePlayback = async () => {
    if (isPlaying) {
      await TrackPlayer.pause();
    } else {
      await TrackPlayer.play();
    }
  };
>>>>>>> upstream/main

  return (
    <TouchableOpacity
      style={styles.container}
<<<<<<< HEAD
      onPress={() => navigation.navigate('NowPlaying')}
      activeOpacity={0.9}>
      <View style={styles.info}>
        <Image
          source={require('../../logo.png')}
          style={styles.cover}
        />
        <View>
          <Text style={styles.title}>Ye</Text>
          <Text style={styles.artist}>Burna Boy</Text>
        </View>
      </View>
      <TouchableOpacity style={styles.playButton}>
        <Ionicons name="play" size={22} color={Colors.background} />
=======
      onPress={() => navigation.navigate('NowPlaying', {track: currentTrack})}
      activeOpacity={0.9}>
      <View style={styles.info}>
        <Image
          source={
            currentTrack.artwork
              ? {uri: currentTrack.artwork}
              : require('../../assets/images/logo.png')
          }
          style={styles.cover}
        />
        <View style={{flex: 1}}>
          <Text style={styles.title} numberOfLines={1}>
            {currentTrack.title}
          </Text>
          <Text style={styles.artist} numberOfLines={1}>
            {currentTrack.artist}
          </Text>
        </View>
      </View>
      <TouchableOpacity style={styles.playButton} onPress={togglePlayback}>
        <Ionicons
          name={isPlaying ? 'pause' : 'play'}
          size={22}
          color={Colors.background}
        />
>>>>>>> upstream/main
      </TouchableOpacity>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
<<<<<<< HEAD
    backgroundColor: Colors.surface,
=======
    backgroundColor: Colors.card,
>>>>>>> upstream/main
    borderTopWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
<<<<<<< HEAD
  info: {flexDirection: 'row', alignItems: 'center'},
=======
  info: {flexDirection: 'row', alignItems: 'center', flex: 1},
>>>>>>> upstream/main
  cover: {
    width: 46,
    height: 46,
    borderRadius: 8,
    marginRight: 12,
  },
  title: {color: Colors.text, fontSize: 14, fontWeight: '600'},
  artist: {color: Colors.muted, fontSize: 12, marginTop: 2},
  playButton: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
<<<<<<< HEAD
=======
    marginLeft: 16,
>>>>>>> upstream/main
  },
});
