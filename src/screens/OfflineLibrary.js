import React, {useState, useEffect, useCallback} from 'react';
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RNFetchBlob from 'rn-fetch-blob';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {Colors, Radius, Spacing, Typography} from '../theme';
import {usePlayer} from '../context/PlayerContext';

export default function OfflineLibrary({navigation}) {
  const [downloadedTracks, setDownloadedTracks] = useState([]);
  const [loading, setLoading] = useState(true);
  const {playTrack} = usePlayer();

  const loadDownloadedTracks = useCallback(async () => {
    setLoading(true);
    try {
      const keys = await AsyncStorage.getAllKeys();
      const trackKeys = keys.filter(key => key.startsWith('track_'));
      const items = await AsyncStorage.multiGet(trackKeys);

      const tracks = [];
      for (const [key, path] of items) {
        if (path && (await RNFetchBlob.fs.exists(path))) {
          // Need a way to get track metadata from key or storage
          // For now, let's assume metadata is stored alongside path or we parse filename
          tracks.push({
            id: key.replace('track_', ''),
            path,
            title: 'Son téléchargé', // Placeholder
          });
        }
      }
      setDownloadedTracks(tracks);
    } catch (error) {
      console.error('Error loading offline tracks:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDownloadedTracks();
  }, [loadDownloadedTracks]);

  const renderTrack = ({item}) => (
    <TouchableOpacity
      style={styles.trackCard}
      onPress={() =>
        playTrack({id: item.id, url: `file://${item.path}`, title: item.title})
      }>
      <Ionicons name="musical-note" size={24} color={Colors.primary} />
      <View style={styles.trackInfo}>
        <Text style={styles.trackTitle}>{item.title}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mes téléchargements</Text>
      {loading ? (
        <ActivityIndicator
          size="large"
          color={Colors.primary}
          style={styles.loader}
        />
      ) : (
        <FlatList
          data={downloadedTracks}
          renderItem={renderTrack}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.list}
          ListEmptyComponent={
            <Text style={styles.emptyText}>Aucun son téléchargé.</Text>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    padding: Spacing.md,
    paddingTop: 50,
  },
  title: {
    color: Colors.text,
    fontSize: Typography.hero,
    fontWeight: '800',
    marginBottom: 20,
  },
  list: {paddingBottom: 100},
  trackCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    backgroundColor: Colors.card,
    borderRadius: Radius.lg,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  trackInfo: {marginLeft: 15},
  trackTitle: {color: Colors.text, fontSize: 16, fontWeight: '600'},
  loader: {marginTop: 40},
  emptyText: {color: Colors.textSoft, textAlign: 'center', marginTop: 40},
});
