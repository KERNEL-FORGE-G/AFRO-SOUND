import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Image,
  ActivityIndicator,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {searchAll} from '../services/musicApi';
import {usePlayer} from '../context/PlayerContext';
import {Colors} from '../theme';

export default function SearchResults({route, navigation}) {
  const {query} = route.params;
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const {playTrack} = usePlayer();

  useEffect(() => {
    fetchResults();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  const fetchResults = async () => {
    setLoading(true);
    try {
      const data = await searchAll(query);
      setResults(data);
    } catch (e) {
      console.warn('Search results error:', e.message);
    } finally {
      setLoading(false);
    }
  };

  const renderItem = ({item}) => (
    <TouchableOpacity
      style={styles.item}
      onPress={async () => {
        await playTrack(item, results);
        navigation.navigate('NowPlaying', {track: item});
      }}>
      <Image
        source={
          item.cover
            ? {uri: item.cover}
            : item.cover_url
            ? {uri: item.cover_url}
            : require('../../logo.png')
        }
        style={styles.image}
      />
      <View style={styles.info}>
        <Text style={styles.titleText} numberOfLines={1}>{item.title}</Text>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Text style={styles.artistText} numberOfLines={1}>
            {item.artist || item.artist_name || 'Artiste inconnu'}
          </Text>
          <View
            style={[
              styles.sourcePill,
              item.source === 'itunes' && styles.itunesBadge,
              item.source === 'jamendo' && styles.jamendoBadge,
            ]}>
            <Text style={styles.sourceText}>{item.source}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={28} color={Colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1}>Résultats pour "{query}"</Text>
      </View>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={styles.emptyText}>Recherche en cours...</Text>
        </View>
      ) : (
        <FlatList
          data={results}
          renderItem={renderItem}
          keyExtractor={(item, index) => item.id || String(index)}
          contentContainerStyle={{paddingBottom: 100}}
          ListEmptyComponent={
            <Text style={styles.emptyText}>Aucun résultat.</Text>
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
    paddingTop: 60
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  headerTitle: {
    color: Colors.text,
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 16,
    flex: 1
  },
  item: {
    flexDirection: 'row',
    padding: 16,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  image: {width: 60, height: 60, borderRadius: 8},
  info: {marginLeft: 16, flex: 1},
  titleText: {color: Colors.text, fontSize: 16, fontWeight: 'bold'},
  artistText: {color: Colors.muted, fontSize: 14},
  sourcePill: {
    marginLeft: 8,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    backgroundColor: Colors.surfaceLight,
  },
  itunesBadge: {backgroundColor: '#1D1A29'},
  jamendoBadge: {backgroundColor: '#FF3333'},
  sourceText: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  emptyText: {color: Colors.muted, textAlign: 'center', marginTop: 20},
  center: {flex: 1, justifyContent: 'center', alignItems: 'center'}
});
