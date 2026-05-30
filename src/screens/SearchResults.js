import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, FlatList, Image} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { supabase } from '../supabaseClient';
import { usePlayer } from '../context/PlayerContext';

export default function SearchResults({route, navigation}) {
  const {query} = route.params;
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const { playTrack } = usePlayer();

  useEffect(() => {
    fetchResults();
  }, [query]);

  const fetchResults = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('tracks')
      .select('*, artists(name)')
      .ilike('title', `%${query}%`);
    
    if (data) setResults(data);
    setLoading(false);
  };

  const renderItem = ({item}) => (
    <TouchableOpacity 
      style={styles.item}
      onPress={() => {
        playTrack(item, results);
        navigation.navigate('NowPlaying', {track: {...item, artist: item.artists?.name}});
      }}>
      <Image source={{uri: item.cover_url}} style={styles.image} />
      <View style={styles.info}>
        <Text style={styles.titleText}>{item.title}</Text>
        <Text style={styles.artistText}>{item.artists?.name}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={28} color="#FDFBF7" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Résultats pour "{query}"</Text>
      </View>

      {loading ? (
        <Text style={styles.emptyText}>Recherche en cours...</Text>
      ) : (
        <FlatList
          data={results}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          ListEmptyComponent={<Text style={styles.emptyText}>Aucun résultat.</Text>}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#181411', paddingTop: 60},
  header: {flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, marginBottom: 20},
  headerTitle: {color: '#FDFBF7', fontSize: 20, fontWeight: 'bold', marginLeft: 16},
  item: {flexDirection: 'row', padding: 16, alignItems: 'center'},
  image: {width: 60, height: 60, borderRadius: 8},
  info: {marginLeft: 16},
  titleText: {color: '#FDFBF7', fontSize: 16, fontWeight: 'bold'},
  artistText: {color: '#C4A484'},
  emptyText: {color: '#FDFBF7', textAlign: 'center', marginTop: 50},
});
