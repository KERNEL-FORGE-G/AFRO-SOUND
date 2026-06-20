import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet, Image} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {Colors, Radius, Shadows} from '../theme';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {usePlayer} from '../context/PlayerContext';

export default function PlayerBar() {
  const navigation = useNavigation();
  const {currentTrack, togglePlayback, isPlaying} = usePlayer();

  if (!currentTrack) {
    return null;
  }

  // isPlaying is already derived in PlayerContext and provided via usePlayer
  // const isPlaying = getPlaybackStateValue(playbackState) === State.Playing;

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => navigation.navigate('NowPlaying', {track: currentTrack})}
      activeOpacity={0.9}>
      <View style={styles.waveAccent} />
      <View style={styles.info}>
        <Image
          source={
            currentTrack.artwork || currentTrack.cover || currentTrack.cover_url
              ? {
                  uri:
                    currentTrack.artwork ||
                    currentTrack.cover ||
                    currentTrack.cover_url,
                }
              : require('../../logo.png')
          }
          style={styles.cover}
        />
        <View style={styles.meta}>
          <Text style={styles.title} numberOfLines={1}>
            {currentTrack.title}
          </Text>
          <Text style={styles.artist} numberOfLines={1}>
            {currentTrack.artist}
          </Text>
        </View>
      </View>
      <View style={styles.actions}>
        <TouchableOpacity
          style={styles.iconButton}
          onPress={() =>
            navigation.navigate('NowPlaying', {track: currentTrack})
          }>
          <Ionicons
            name="musical-notes-outline"
            size={18}
            color={Colors.text}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.playButton}
          onPress={() => togglePlayback()}>
          <Ionicons
            name={isPlaying ? 'pause' : 'play'}
            size={22}
            color={Colors.background}
          />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.backgroundElevated,
    borderWidth: 1,
    borderColor: Colors.borderStrong,
    marginHorizontal: 12,
    marginBottom: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: Radius.lg,
    overflow: 'hidden',
    ...Shadows.soft,
  },
  waveAccent: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 4,
    backgroundColor: Colors.primary,
  },
  info: {flexDirection: 'row', alignItems: 'center', flex: 1},
  meta: {flex: 1},
  cover: {
    width: 46,
    height: 46,
    borderRadius: 8,
    marginRight: 12,
  },
  title: {color: Colors.text, fontSize: 14, fontWeight: '700'},
  artist: {color: Colors.textSoft, fontSize: 12, marginTop: 2},
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 14,
  },
  iconButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: Colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
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
