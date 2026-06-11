import React from 'react';
import {View, Text, StyleSheet, ScrollView, Image, TouchableOpacity} from 'react-native';
import {usePlayer} from '../context/PlayerContext';
import {Colors} from '../theme';
import Ionicons from 'react-native-vector-icons/Ionicons';

export default function Lyrics({navigation}) {
  const {currentTrack} = usePlayer();

  const title = currentTrack?.title || 'Titre inconnu';
  const artist = currentTrack?.artist || 'Artiste inconnu';
  const artwork = currentTrack?.artwork || '';

  const sampleLyrics = currentTrack?.lyrics ||
    'Couplet 1\nVoici les paroles de la chanson...\n\nRefrain\nLa la la...';

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-down" size={32} color={Colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Paroles</Text>
        <View style={{width: 32}} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.artworkContainer}>
          <Image
            source={artwork ? {uri: artwork} : require('../../logo.png')}
            style={styles.artwork}
          />
        </View>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.artist}>{artist}</Text>
        <Text style={styles.lyrics}>{sampleLyrics}</Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 48,
    paddingBottom: 16,
  },
  headerTitle: {
    color: Colors.text,
    fontSize: 18,
    fontWeight: '700',
  },
  scrollContent: {
    padding: 24,
    alignItems: 'center',
  },
  artworkContainer: {
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 10},
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  artwork: {
    width: 200,
    height: 200,
    borderRadius: 16,
  },
  title: {
    color: Colors.text,
    fontSize: 24,
    fontWeight: '800',
    marginBottom: 8,
    textAlign: 'center',
  },
  artist: {
    color: Colors.primary,
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 32,
    textAlign: 'center',
  },
  lyrics: {
    color: Colors.text,
    fontSize: 18,
    lineHeight: 28,
    textAlign: 'center',
    fontWeight: '500',
  },
});
