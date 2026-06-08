import React, {useState, useEffect} from 'react';
<<<<<<< HEAD
import {View, Text, StyleSheet, TouchableOpacity, FlatList, Image} from 'react-native';
=======
<<<<<<< HEAD
import {View, Text, StyleSheet, TouchableOpacity, FlatList, Image} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { searchAll } from '../services/musicApi';
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
=======
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Image,
} from 'react-native';
>>>>>>> 6ca20f0853c25da4ea3c9ac371a85fe442bfef22
import Ionicons from 'react-native-vector-icons/Ionicons';
import { searchAll } from '../services/musicApi';
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
<<<<<<< HEAD
    <TouchableOpacity 
=======
    <TouchableOpacity
>>>>>>> upstream/main
>>>>>>> 6ca20f0853c25da4ea3c9ac371a85fe442bfef22
      style={styles.item}
      onPress={() => {
        playTrack(item, results);
        navigation.navigate('NowPlaying', {track: item});
      }}>
<<<<<<< HEAD
      <Image 
        source={
          item.cover 
            ? {uri: item.cover} 
            : item.cover_url 
            ? {uri: item.cover_url} 
            : require('../../logo.png')
        } 
        style={styles.image} 
=======
<<<<<<< HEAD
      <Image 
        source={
          item.cover 
            ? {uri: item.cover} 
            : item.cover_url 
            ? {uri: item.cover_url} 
            : require('../../logo.png')
        } 
        style={styles.image} 
=======
      <Image
        source={
          item.cover
            ? {uri: item.cover}
            : item.cover_url
            ? {uri: item.cover_url}
            : require('../../assets/images/logo.png')
        }
        style={styles.image}
>>>>>>> upstream/main
>>>>>>> 6ca20f0853c25da4ea3c9ac371a85fe442bfef22
      />
      <View style={styles.info}>
        <Text style={styles.titleText}>{item.title}</Text>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
<<<<<<< HEAD
=======
<<<<<<< HEAD
>>>>>>> 6ca20f0853c25da4ea3c9ac371a85fe442bfef22
          <Text style={styles.artistText}>{item.artist || item.artist_name || 'Artiste inconnu'}</Text>
          <View style={[
            styles.sourcePill,
            item.source === 'itunes' && styles.itunesBadge,
            item.source === 'jamendo' && styles.jamendoBadge
          ]}>
<<<<<<< HEAD
=======
=======
          <Text style={styles.artistText}>
            {item.artist || item.artist_name || 'Artiste inconnu'}
          </Text>
          <View
            style={[
              styles.sourcePill,
              item.source === 'itunes' && styles.itunesBadge,
              item.source === 'jamendo' && styles.jamendoBadge,
            ]}>
>>>>>>> upstream/main
>>>>>>> 6ca20f0853c25da4ea3c9ac371a85fe442bfef22
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
<<<<<<< HEAD
          keyExtractor={(item) => item.id}
          ListEmptyComponent={<Text style={styles.emptyText}>Aucun résultat.</Text>}
=======
<<<<<<< HEAD
          keyExtractor={(item) => item.id}
          ListEmptyComponent={<Text style={styles.emptyText}>Aucun résultat.</Text>}
=======
          keyExtractor={item => item.id}
          ListEmptyComponent={
            <Text style={styles.emptyText}>Aucun résultat.</Text>
          }
>>>>>>> upstream/main
>>>>>>> 6ca20f0853c25da4ea3c9ac371a85fe442bfef22
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#181411', paddingTop: 60},
<<<<<<< HEAD
  header: {flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, marginBottom: 20},
  headerTitle: {color: '#FDFBF7', fontSize: 20, fontWeight: 'bold', marginLeft: 16},
=======
<<<<<<< HEAD
  header: {flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, marginBottom: 20},
  headerTitle: {color: '#FDFBF7', fontSize: 20, fontWeight: 'bold', marginLeft: 16},
=======
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  headerTitle: {
    color: '#FDFBF7',
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 16,
  },
>>>>>>> upstream/main
>>>>>>> 6ca20f0853c25da4ea3c9ac371a85fe442bfef22
  item: {flexDirection: 'row', padding: 16, alignItems: 'center'},
  image: {width: 60, height: 60, borderRadius: 8},
  info: {marginLeft: 16},
  titleText: {color: '#FDFBF7', fontSize: 16, fontWeight: 'bold'},
  artistText: {color: '#C4A484'},
  sourcePill: {
    marginLeft: 8,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    backgroundColor: '#333',
  },
  itunesBadge: {backgroundColor: '#1D1A29'},
  jamendoBadge: {backgroundColor: '#FF3333'},
<<<<<<< HEAD
  sourceText: {color: '#FFF', fontSize: 10, fontWeight: 'bold', textTransform: 'uppercase'},
=======
<<<<<<< HEAD
  sourceText: {color: '#FFF', fontSize: 10, fontWeight: 'bold', textTransform: 'uppercase'},
=======
  sourceText: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
>>>>>>> upstream/main
>>>>>>> 6ca20f0853c25da4ea3c9ac371a85fe442bfef22
  emptyText: {color: '#FDFBF7', textAlign: 'center', marginTop: 50},
});
