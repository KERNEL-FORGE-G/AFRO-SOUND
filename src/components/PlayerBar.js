import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Colors } from '../theme';

export default function PlayerBar() {
  const navigation = useNavigation();

  return (
    <TouchableOpacity style={styles.container} onPress={() => navigation.navigate('NowPlaying')} activeOpacity={0.9}>
      <View style={styles.info}>
        <View style={styles.cover} />
        <View>
          <Text style={styles.title}>Dernière lecture</Text>
          <Text style={styles.artist}>En cours</Text>
        </View>
      </View>
      <View style={styles.playButton}>
        <Text style={styles.playText}>▶</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#181818',
    borderTopWidth: 1,
    borderColor: '#222',
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  info: { flexDirection: 'row', alignItems: 'center' },
  cover: { width: 46, height: 46, borderRadius: 8, backgroundColor: '#1DB954', marginRight: 12 },
  title: { color: '#fff', fontSize: 14, fontWeight: '600' },
  artist: { color: '#B3B3B3', fontSize: 12, marginTop: 2 },
  playButton: { width: 46, height: 46, borderRadius: 23, backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center' },
  playText: { color: '#000', fontSize: 16, fontWeight: '700' },
});
