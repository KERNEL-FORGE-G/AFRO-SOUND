import React, {useState, useRef} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Alert,
  ActivityIndicator,
  FlatList,
  TouchableOpacity,
  Image,
  Animated,
} from 'react-native';
import theme, {Colors} from '../theme';
import AppButton from '../components/AppButton';
import {supabase} from '../supabaseClient';
import useAuth from '../hooks/useAuth';
import {searchAll, upsertTrack, addTrackToPlaylist} from '../services/musicApi';
import Ionicons from 'react-native-vector-icons/Ionicons';

export default function CreatePlaylist({navigation}) {
  const {user} = useAuth();
  const [playlistName, setPlaylistName] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedTracks, setSelectedTracks] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    setIsSearching(true);
    try {
      const data = await searchAll(searchQuery, 10);
      setSearchResults(data);
    } catch (e) {
      console.warn(e);
    } finally {
      setIsSearching(false);
    }
  };

  const toggleTrack = track => {
    if (selectedTracks.find(t => t.id === track.id)) {
      setSelectedTracks(selectedTracks.filter(t => t.id !== track.id));
    } else {
      setSelectedTracks([...selectedTracks, track]);
    }
  };

  const handleCreate = async () => {
    if (playlistName.trim().length === 0) {
      Alert.alert('Oups !', 'Veuillez entrer un nom pour votre playlist.');
      return;
    }

    if (!user) {
      Alert.alert('Erreur', 'Vous devez être connecté pour créer une playlist.');
      navigation.navigate('Login');
      return;
    }

    setLoading(true);
    try {
      // 1. Création de la playlist
      const {data: playlistData, error: playlistError} = await supabase
        .from('playlists')
        .insert([
          {
            name: playlistName.trim(),
            user_id: user.id,
            is_public: true,
          },
        ])
        .select();

      if (playlistError) throw playlistError;
      const newPlaylist = playlistData[0];

      // 2. Upsert des tracks et ajout à la playlist
      for (const track of selectedTracks) {
        await upsertTrack(track);
        await addTrackToPlaylist(newPlaylist.id, track.id);
      }

      Alert.alert('Succès', `La playlist "${newPlaylist.name}" a été créée avec ${selectedTracks.length} titres !`);
      navigation.navigate('Bibliothèque', {refresh: Date.now()});
      setPlaylistName('');
      setSelectedTracks([]);
    } catch (error) {
      Alert.alert('Erreur', error.message);
    } finally {
      setLoading(false);
    }
  };

  const renderTrackItem = ({item, index}) => {
    const isSelected = selectedTracks.find(t => t.id === item.id);
    const anim = useRef(new Animated.Value(0)).current;

    React.useEffect(() => {
      Animated.spring(anim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        delay: index * 50,
        useNativeDriver: true,
      }).start();
    }, []);

    return (
      <Animated.View style={{opacity: anim, transform: [{scale: anim}]}}>
        <TouchableOpacity
          style={[styles.trackCard, isSelected && styles.trackCardSelected]}
          onPress={() => toggleTrack(item)}>
          <Image
            source={item.cover ? {uri: item.cover} : require('../../logo.png')}
            style={styles.trackImage}
          />
          <View style={styles.trackInfo}>
            <Text style={styles.trackTitle} numberOfLines={1}>{item.title}</Text>
            <Text style={styles.trackArtist} numberOfLines={1}>{item.artist}</Text>
          </View>
          <Ionicons
            name={isSelected ? "checkmark-circle" : "add-circle-outline"}
            size={24}
            color={isSelected ? Colors.primary : Colors.muted}
          />
        </TouchableOpacity>
      </Animated.View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={24} color={Colors.text} />
        </TouchableOpacity>
        <Text style={styles.title}>Nouvelle Playlist</Text>
      </View>

      <TextInput
        style={styles.input}
        placeholder="Nom de la playlist..."
        placeholderTextColor={Colors.muted}
        value={playlistName}
        onChangeText={setPlaylistName}
      />

      <View style={styles.searchSection}>
        <Text style={styles.sectionLabel}>Ajouter des titres ({selectedTracks.length} sélectionnés)</Text>
        <View style={styles.searchBar}>
            <TextInput
                style={styles.searchInput}
                placeholder="Rechercher des sons..."
                placeholderTextColor={Colors.muted}
                value={searchQuery}
                onChangeText={setSearchQuery}
                onSubmitEditing={handleSearch}
            />
            <TouchableOpacity onPress={handleSearch} style={styles.searchBtn}>
                <Ionicons name="search" size={20} color={Colors.text} />
            </TouchableOpacity>
        </View>
      </View>

      {isSearching ? (
        <ActivityIndicator color={Colors.primary} style={{marginVertical: 20}} />
      ) : (
        <FlatList
            data={searchResults}
            renderItem={renderTrackItem}
            keyExtractor={item => item.id}
            style={styles.list}
            contentContainerStyle={{paddingBottom: 20}}
            ListEmptyComponent={searchQuery ? <Text style={styles.emptyText}>Aucun résultat</Text> : null}
        />
      )}

      <View style={styles.footer}>
        {loading ? (
            <ActivityIndicator size="large" color={Colors.primary} />
        ) : (
            <AppButton
                title={selectedTracks.length > 0 ? `Créer avec ${selectedTracks.length} titres` : "Créer vide"}
                onPress={handleCreate}
                disabled={!playlistName.trim()}
            />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    paddingTop: 50,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  backBtn: {marginRight: 15},
  title: {
    color: Colors.text,
    fontSize: 22,
    fontWeight: 'bold',
  },
  input: {
    backgroundColor: Colors.surface,
    color: Colors.text,
    marginHorizontal: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    fontSize: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  searchSection: {
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  sectionLabel: {
    color: Colors.muted,
    fontSize: 14,
    marginBottom: 8,
    textTransform: 'uppercase',
    fontWeight: 'bold',
  },
  searchBar: {
    flexDirection: 'row',
    backgroundColor: Colors.surfaceLight,
    borderRadius: 10,
    alignItems: 'center',
    paddingRight: 10,
  },
  searchInput: {
    flex: 1,
    color: Colors.text,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  searchBtn: {padding: 5},
  list: {flex: 1, paddingHorizontal: 20},
  trackCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    padding: 10,
    borderRadius: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  trackCardSelected: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primary + '10',
  },
  trackImage: {width: 44, height: 44, borderRadius: 6, marginRight: 12},
  trackInfo: {flex: 1},
  trackTitle: {color: Colors.text, fontSize: 14, fontWeight: '600'},
  trackArtist: {color: Colors.muted, fontSize: 12},
  emptyText: {color: Colors.muted, textAlign: 'center', marginTop: 20},
  footer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    backgroundColor: Colors.background,
  }
});
