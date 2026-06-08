import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  FlatList,
} from 'react-native';
import {Colors} from '../theme';
import AppButton from '../components/AppButton';
import useGroupPlaylist from '../hooks/useGroupPlaylist';
import useAuth from '../hooks/useAuth';
import Ionicons from 'react-native-vector-icons/Ionicons';

export default function GroupPlaylistScreen({navigation}) {
  const {user} = useAuth();
  const {groupPlaylists, createPlaylist, addMember} = useGroupPlaylist();
  const [playlistName, setPlaylistName] = useState('');
  const [newMemberEmail, setNewMemberEmail] = useState('');
  const [selectedPlaylistId, setSelectedPlaylistId] = useState(null);

  const handleCreatePlaylist = () => {
    if (!playlistName.trim()) {
      Alert.alert('Erreur', 'Veuillez entrer un nom de playlist.');
      return;
    }
    if (!user) {
      Alert.alert('Non authentifié', 'Connectez-vous d\'abord.');
      return;
    }

    createPlaylist(playlistName, user.id, []);
    Alert.alert('Succès', 'Playlist créée !');
    setPlaylistName('');
    setSelectedPlaylistId(null);
  };

  const handleAddMember = () => {
    if (!newMemberEmail.trim() || !selectedPlaylistId) {
      Alert.alert('Erreur', 'Veuillez entrer un email et sélectionner une playlist.');
      return;
    }

    addMember(selectedPlaylistId, newMemberEmail);
    Alert.alert('Succès', `Membre ${newMemberEmail} ajouté !`);
    setNewMemberEmail('');
  };

  const renderPlaylistItem = ({item}) => (
    <TouchableOpacity
      style={[styles.playlistCard, selectedPlaylistId === item.id && styles.playlistCardSelected]}
      onPress={() => setSelectedPlaylistId(item.id)}>
      <View style={styles.playlistHeader}>
        <Text style={styles.playlistName}>{item.name}</Text>
        <Text style={styles.playlistCount}>{item.tracks.length} titres</Text>
      </View>
      <Text style={styles.playlistMembers}>Membres: {item.members.length}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container]}>
      <ScrollView contentContainerStyle={{paddingBottom: 100}}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="chevron-back" size={28} color={Colors.primary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Playlists de Groupe</Text>
        </View>

        {/* Create Playlist Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Créer une nouvelle playlist</Text>
          <TextInput
            style={styles.input}
            placeholder="Nom de la playlist..."
            placeholderTextColor={Colors.muted}
            value={playlistName}
            onChangeText={setPlaylistName}
          />
          <AppButton title="Créer Playlist" onPress={handleCreatePlaylist} />
        </View>

        {/* Existing Playlists */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Mes Playlists ({Object.keys(groupPlaylists).length})</Text>
          {Object.values(groupPlaylists).length > 0 ? (
            <FlatList
              data={Object.values(groupPlaylists)}
              renderItem={renderPlaylistItem}
              keyExtractor={item => item.id}
              scrollEnabled={false}
            />
          ) : (
            <Text style={styles.emptyText}>Aucune playlist créée encore.</Text>
          )}
        </View>

        {/* Add Member to Selected Playlist */}
        {selectedPlaylistId && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Ajouter un membre</Text>
            <TextInput
              style={styles.input}
              placeholder="Email du membre..."
              placeholderTextColor={Colors.muted}
              value={newMemberEmail}
              onChangeText={setNewMemberEmail}
              keyboardType="email-address"
            />
            <AppButton title="Ajouter Membre" onPress={handleAddMember} />
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: Colors.background},
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 20,
  },
  headerTitle: {color: Colors.text, fontSize: 24, fontWeight: 'bold', marginLeft: 12},
  section: {paddingHorizontal: 16, paddingVertical: 20, borderBottomWidth: 1, borderBottomColor: Colors.border},
  sectionTitle: {color: Colors.primary, fontSize: 16, fontWeight: '700', marginBottom: 12, textTransform: 'uppercase'},
  input: {
    backgroundColor: Colors.surface,
    color: Colors.text,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 12,
    fontSize: 14,
  },
  playlistCard: {
    backgroundColor: Colors.surface,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 8,
    borderLeftWidth: 4,
    borderLeftColor: Colors.muted,
  },
  playlistCardSelected: {borderLeftColor: Colors.primary},
  playlistHeader: {flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4},
  playlistName: {color: Colors.text, fontSize: 14, fontWeight: '600'},
  playlistCount: {color: Colors.muted, fontSize: 12},
  playlistMembers: {color: Colors.muted, fontSize: 12},
  emptyText: {color: Colors.muted, fontSize: 14, textAlign: 'center', paddingVertical: 20},
});
