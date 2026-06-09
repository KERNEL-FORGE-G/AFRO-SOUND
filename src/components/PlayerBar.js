import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet, Image} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {Colors} from '../theme';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {
  usePlayer,
  State,
  usePlaybackState,
  getPlaybackStateValue,
} from '../context/PlayerContext';

export default function PlayerBar() {
  const navigation = useNavigation();
  const {currentTrack, togglePlayback} = usePlayer();
  const playbackState = usePlaybackState();

  if (!currentTrack) {
    return null;
  }

  const isPlaying = getPlaybackStateValue(playbackState) === State.Playing;

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => navigation.navigate('NowPlaying', {track: currentTrack})}
      activeOpacity={0.9}>
      <View style={styles.info}>
        <Image
          source={
            currentTrack.artwork
              ? {uri: currentTrack.artwork}
              : require('../../logo.png')
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
      <TouchableOpacity
        style={styles.playButton}
        onPress={() => togglePlayback(playbackState)}>
        <Ionicons
          name={isPlaying ? 'pause' : 'play'}
          size={22}
          color={Colors.background}
        />
      </TouchableOpacity>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.card,
    borderTopWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  info: {flexDirection: 'row', alignItems: 'center', flex: 1},
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
    marginLeft: 16,
  },
});
