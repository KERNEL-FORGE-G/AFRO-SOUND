import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from 'react-native';
import theme, {Colors} from '../theme';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {getSupabaseSongs} from '../services/musicApi';
import {usePlayer} from '../context/PlayerContext';

export default function Home({navigation}) {
  const [songs, setSongs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const {playTrack} = usePlayer();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const data = await getSupabaseSongs();
      setSongs(data);
    } catch (e) {
      console.error('Home fetchData error:', e.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePlay = (track, queue) => {
    playTrack(track, queue);
    navigation.navigate('NowPlaying', {track});
  };

  const renderTrackCard = (p, queue) => (
    <TouchableOpacity
      key={p.id}
      style={styles.card}
      activeOpacity={0.9}
      onPress={() => handlePlay(p, queue)}>
      <Image
        source={p.cover ? {uri: p.cover} : require('../../logo.png')}
        style={styles.cardImage}
      />
      <Text style={styles.cardTitle} numberOfLines={1}>
        {p.title}
      </Text>
      <Text style={styles.cardArtist} numberOfLines={1}>
        {p.artist || 'Artiste inconnu'}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={[theme.container, styles.mainContainer]}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <Text style={styles.greeting}>Bibliothèque</Text>
          <TouchableOpacity onPress={fetchData} activeOpacity={0.8}>
            <Ionicons name="refresh-outline" size={24} color={Colors.primary} />
          </TouchableOpacity>
        </View>
      </View>

      {isLoading ? (
        <ActivityIndicator
          size="large"
          color={Colors.primary}
          style={{marginTop: 80}}
        />
      ) : (
        <ScrollView contentContainerStyle={{padding: 16}}>
          <Text style={styles.sectionTitle}>Vos titres</Text>
          <View style={styles.grid}>
            {songs.map(p => renderTrackCard(p, songs))}
          </View>
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {flex: 1, backgroundColor: Colors.background},
  header: {paddingHorizontal: 16, paddingTop: 40, paddingBottom: 16},
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  greeting: {color: Colors.text, fontSize: 24, fontWeight: 'bold'},
  sectionTitle: {
    color: Colors.text,
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  card: {width: '47%', marginBottom: 16},
  cardImage: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: 16,
    backgroundColor: Colors.surface,
  },
  cardTitle: {
    color: Colors.text,
    marginTop: 8,
    fontSize: 14,
    fontWeight: '600',
  },
  cardArtist: {color: Colors.muted, fontSize: 12},
});
