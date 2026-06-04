import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet, Image} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {Colors} from '../theme';
import Ionicons from 'react-native-vector-icons/Ionicons';

export default function PlayerBar() {
  const navigation = useNavigation();

  return (
    <TouchableOpacity
      style={styles.container}
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
      </TouchableOpacity>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.surface,
    borderTopWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  info: {flexDirection: 'row', alignItems: 'center'},
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
  },
});
