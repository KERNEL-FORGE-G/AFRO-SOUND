import React, {useState} from 'react';
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
  Switch,
  ScrollView,
} from 'react-native';
import theme, {Colors, Radius, Spacing, Typography} from '../theme';
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
  const [isPublic, setIsPublic] = useState(true);

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      return;
    }

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
      Alert.alert(
        'Erreur',
        'Vous devez être connecté pour créer une playlist.',
      );
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
            is_public: isPublic,
          },
        ])
        .select();

      if (playlistError) {
        throw playlistError;
      }
      const newPlaylist = playlistData[0];

      // 2. Upsert des tracks et ajout à la playlist
      for (const track of selectedTracks) {
        await upsertTrack(track);
        await addTrackToPlaylist(newPlaylist.id, track.id);
      }

      Alert.alert(
        'Succès',
        `La playlist "${newPlaylist.name}" a été créée avec ${selectedTracks.length} titres !`,
      );
      navigation.navigate('Bibliothèque', {refresh: Date.now()});
      setPlaylistName('');
      setSelectedTracks([]);
      setSearchQuery('');
      setSearchResults([]);
    } catch (error) {
      Alert.alert('Erreur', error.message);
    } finally {
      setLoading(false);
    }
  };

  const renderTrackItem = ({item}) => {
    const isSelected = selectedTracks.find(t => t.id === item.id);

    return (
      <TouchableOpacity
        style={[styles.trackCard, isSelected && styles.trackCardSelected]}
        onPress={() => toggleTrack(item)}>
        <Image
          source={item.cover ? {uri: item.cover} : require('../../logo.png')}
          style={styles.trackImage}
        />
        <View style={styles.trackInfo}>
          <Text style={styles.trackTitle} numberOfLines={1}>
            {item.title}
          </Text>
          <Text style={styles.trackArtist} numberOfLines={1}>
            {item.artist}
          </Text>
          <Text style={styles.trackSource}>
            {(item.source || 'local').toUpperCase()}
          </Text>
        </View>
        <Ionicons
          name={isSelected ? 'checkmark-circle' : 'add-circle-outline'}
          size={24}
          color={isSelected ? Colors.primary : Colors.textSoft}
        />
      </TouchableOpacity>
    );
  };

  return (
    <View style={[theme.container, styles.container]}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backBtn}>
          <Ionicons name="arrow-back" size={20} color={Colors.text} />
        </TouchableOpacity>
        <View style={styles.headerCopy}>
          <Text style={styles.kicker}>Creation guidee</Text>
          <Text style={styles.title}>Nouvelle playlist</Text>
        </View>
      </View>

      <FlatList
        data={searchResults}
        renderItem={renderTrackItem}
        keyExtractor={item => item.id}
        style={styles.list}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          <>
            <View style={styles.editorCard}>
              <Text style={styles.sectionTitle}>Identite de playlist</Text>
              <TextInput
                style={styles.input}
                placeholder="Nom de la playlist..."
                placeholderTextColor={Colors.muted}
                value={playlistName}
                onChangeText={setPlaylistName}
              />

              <View style={styles.visibilityCard}>
                <View style={styles.flexFill}>
                  <Text style={styles.visibilityTitle}>Visibilite</Text>
                  <Text style={styles.visibilityText}>
                    {isPublic
                      ? 'Playlist visible dans votre espace partage.'
                      : 'Playlist privee reservee a votre compte.'}
                  </Text>
                </View>
                <Switch
                  value={isPublic}
                  onValueChange={setIsPublic}
                  thumbColor={Colors.background}
                  trackColor={{
                    false: Colors.borderStrong,
                    true: Colors.primary,
                  }}
                />
              </View>
            </View>

            <View style={styles.searchSection}>
              <View style={styles.sectionHeading}>
                <Text style={styles.sectionTitle}>Ajouter des titres</Text>
                <Text style={styles.sectionMeta}>
                  {selectedTracks.length} selectionnes
                </Text>
              </View>
              <View style={styles.searchBar}>
                <TextInput
                  style={styles.searchInput}
                  placeholder="Rechercher des sons..."
                  placeholderTextColor={Colors.muted}
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                  onSubmitEditing={handleSearch}
                />
                <TouchableOpacity
                  onPress={handleSearch}
                  style={styles.searchBtn}>
                  <Ionicons name="search" size={18} color={Colors.background} />
                </TouchableOpacity>
              </View>
            </View>

            {selectedTracks.length > 0 && (
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.selectedStrip}>
                {selectedTracks.map(track => (
                  <View key={track.id} style={styles.selectedChip}>
                    <Text style={styles.selectedChipText} numberOfLines={1}>
                      {track.title}
                    </Text>
                  </View>
                ))}
              </ScrollView>
            )}

            {isSearching ? (
              <ActivityIndicator
                color={Colors.primary}
                style={styles.searchingLoader}
              />
            ) : searchQuery && searchResults.length === 0 ? (
              <View style={styles.emptyCard}>
                <Text style={styles.emptyTitle}>Aucun resultat</Text>
                <Text style={styles.emptyText}>
                  Essayez un artiste, un style ou un mot-cle plus large.
                </Text>
              </View>
            ) : null}
          </>
        }
        ListFooterComponent={
          <View style={styles.footer}>
            <AppButton
              title={
                selectedTracks.length > 0
                  ? `Creer avec ${selectedTracks.length} titres`
                  : 'Creer playlist'
              }
              onPress={handleCreate}
              disabled={!playlistName.trim()}
              loading={loading}
            />
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    paddingTop: 26,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    marginBottom: 20,
  },
  backBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  headerCopy: {flex: 1},
  kicker: {
    color: Colors.primary,
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 1,
    fontWeight: '800',
    marginBottom: 4,
  },
  title: {
    color: Colors.text,
    fontSize: Typography.title,
    fontWeight: '800',
  },
  list: {flex: 1},
  listContent: {
    paddingBottom: 140,
  },
  editorCard: {
    backgroundColor: Colors.card,
    borderRadius: Radius.xl,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: Spacing.md,
    marginHorizontal: Spacing.md,
    marginBottom: 20,
  },
  input: {
    backgroundColor: Colors.backgroundSoft,
    color: Colors.text,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: Radius.lg,
    fontSize: 16,
    marginTop: 14,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  visibilityCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    padding: 14,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  visibilityTitle: {
    color: Colors.text,
    fontWeight: '700',
    fontSize: 15,
    marginBottom: 4,
  },
  visibilityText: {
    color: Colors.textSoft,
    fontSize: 12,
    lineHeight: 18,
    paddingRight: 12,
  },
  flexFill: {
    flex: 1,
  },
  searchSection: {
    paddingHorizontal: Spacing.md,
    marginBottom: 10,
  },
  sectionHeading: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  sectionTitle: {
    color: Colors.text,
    fontSize: 18,
    fontWeight: '800',
  },
  sectionMeta: {
    color: Colors.textSoft,
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  searchBar: {
    flexDirection: 'row',
    backgroundColor: Colors.surfaceLight,
    borderRadius: Radius.pill,
    alignItems: 'center',
    paddingRight: 8,
    paddingLeft: 6,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  searchInput: {
    flex: 1,
    color: Colors.text,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  searchBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedStrip: {
    paddingHorizontal: Spacing.md,
    paddingBottom: 8,
  },
  selectedChip: {
    backgroundColor: Colors.surfaceAccent,
    borderWidth: 1,
    borderColor: 'rgba(231, 165, 59, 0.18)',
    borderRadius: Radius.pill,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginRight: 10,
  },
  selectedChipText: {
    color: Colors.text,
    fontWeight: '700',
    maxWidth: 140,
  },
  trackCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.card,
    padding: 12,
    borderRadius: Radius.lg,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: Colors.border,
    marginHorizontal: Spacing.md,
  },
  trackCardSelected: {
    borderColor: Colors.primary,
    backgroundColor: Colors.surfaceAccent,
  },
  trackImage: {width: 50, height: 50, borderRadius: Radius.md, marginRight: 12},
  trackInfo: {flex: 1},
  trackTitle: {color: Colors.text, fontSize: 14, fontWeight: '600'},
  trackArtist: {color: Colors.textSoft, fontSize: 12, marginTop: 4},
  trackSource: {
    color: Colors.primary,
    fontSize: 11,
    marginTop: 6,
    fontWeight: '800',
    letterSpacing: 0.7,
  },
  emptyCard: {
    backgroundColor: Colors.card,
    borderRadius: Radius.xl,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 20,
    marginHorizontal: Spacing.md,
    marginTop: 10,
  },
  emptyTitle: {
    color: Colors.text,
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 6,
  },
  emptyText: {color: Colors.textSoft, lineHeight: 20},
  searchingLoader: {
    marginVertical: 20,
  },
  footer: {
    paddingHorizontal: Spacing.md,
    paddingTop: 20,
    backgroundColor: Colors.background,
  },
});
