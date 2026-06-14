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
import {Colors, Radius, Spacing, Typography} from '../theme';
import AppButton from '../components/AppButton';
import useGroupPlaylist from '../hooks/useGroupPlaylist';
import useAuth from '../hooks/useAuth';
import Ionicons from 'react-native-vector-icons/Ionicons';

export default function GroupPlaylistScreen({navigation}) {
  const {user} = useAuth();
  const {groupPlaylists, createPlaylist, addMember} = useGroupPlaylist();
  const [playlistName, setPlaylistName] = useState('');
  const [playlistDescription, setPlaylistDescription] = useState('');
  const [newMemberEmail, setNewMemberEmail] = useState('');
  const [selectedPlaylistId, setSelectedPlaylistId] = useState(null);

  const handleCreatePlaylist = () => {
    if (!playlistName.trim()) {
      Alert.alert('Erreur', 'Veuillez entrer un nom de playlist.');
      return;
    }
    if (!user) {
      Alert.alert('Non authentifié', "Connectez-vous d'abord.");
      return;
    }

    createPlaylist(playlistName, user.id, [], {
      description: playlistDescription.trim(),
      visibility: 'shared',
    });
    Alert.alert('Succès', 'Playlist créée !');
    setPlaylistName('');
    setPlaylistDescription('');
    setSelectedPlaylistId(null);
  };

  const handleAddMember = () => {
    if (!newMemberEmail.trim() || !selectedPlaylistId) {
      Alert.alert(
        'Erreur',
        'Veuillez entrer un email et sélectionner une playlist.',
      );
      return;
    }

    addMember(selectedPlaylistId, newMemberEmail);
    Alert.alert('Succès', `Membre ${newMemberEmail} ajouté !`);
    setNewMemberEmail('');
  };

  const renderPlaylistItem = ({item}) => (
    <TouchableOpacity
      style={[
        styles.playlistCard,
        selectedPlaylistId === item.id && styles.playlistCardSelected,
      ]}
      onPress={() => setSelectedPlaylistId(item.id)}>
      <View style={styles.playlistTopRow}>
        <View style={styles.playlistSignal} />
        <View style={styles.playlistMeta}>
          <View style={styles.playlistHeader}>
            <Text style={styles.playlistName}>{item.name}</Text>
            <Text style={styles.playlistCount}>
              {item.tracks.length} titres
            </Text>
          </View>
          <Text style={styles.playlistDescription} numberOfLines={2}>
            {item.description ||
              'Playlist collaborative prête pour synchronisation locale.'}
          </Text>
          <Text style={styles.playlistMembers}>
            Membres: {item.members.length} • Changements:{' '}
            {item.pendingChanges || 0}
          </Text>
        </View>
        <View style={styles.statusBadge}>
          <Text style={styles.statusBadgeText}>
            {item.isSynced ? 'SYNC' : 'LOCAL'}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container]}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="chevron-back" size={28} color={Colors.primary} />
          </TouchableOpacity>
          <View style={styles.headerCopy}>
            <Text style={styles.headerKicker}>Collaboration locale</Text>
            <Text style={styles.headerTitle}>Playlists de groupe</Text>
          </View>
        </View>

        <View style={styles.heroCard}>
          <Text style={styles.heroTitle}>
            Partagez vos playlists, membres et ajouts hors ligne.
          </Text>
          <Text style={styles.heroText}>
            Le systeme stocke les changements localement pour une future
            synchronisation.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Creer une nouvelle playlist</Text>
          <TextInput
            style={styles.input}
            placeholder="Nom de la playlist..."
            placeholderTextColor={Colors.muted}
            value={playlistName}
            onChangeText={setPlaylistName}
          />
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Description courte..."
            placeholderTextColor={Colors.muted}
            value={playlistDescription}
            onChangeText={setPlaylistDescription}
            multiline
          />
          <AppButton title="Créer Playlist" onPress={handleCreatePlaylist} />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Mes Playlists ({Object.keys(groupPlaylists).length})
          </Text>
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
  content: {paddingBottom: 140},
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingTop: 28,
    paddingBottom: 20,
  },
  headerCopy: {marginLeft: 12},
  headerKicker: {
    color: Colors.primary,
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 1,
    fontWeight: '800',
    marginBottom: 6,
  },
  headerTitle: {
    color: Colors.text,
    fontSize: Typography.title,
    fontWeight: '800',
  },
  heroCard: {
    marginHorizontal: Spacing.md,
    marginBottom: 22,
    backgroundColor: Colors.surfaceAccent,
    borderRadius: Radius.xl,
    borderWidth: 1,
    borderColor: 'rgba(231, 165, 59, 0.18)',
    padding: 20,
  },
  heroTitle: {
    color: Colors.text,
    fontSize: 22,
    lineHeight: 30,
    fontWeight: '800',
    marginBottom: 10,
  },
  heroText: {
    color: Colors.textSoft,
    fontSize: 14,
    lineHeight: 22,
  },
  section: {
    paddingHorizontal: Spacing.md,
    paddingVertical: 20,
  },
  sectionTitle: {
    color: Colors.text,
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 12,
  },
  input: {
    backgroundColor: Colors.card,
    color: Colors.text,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: Radius.lg,
    marginBottom: 12,
    fontSize: 14,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  textArea: {
    minHeight: 92,
    textAlignVertical: 'top',
  },
  playlistCard: {
    backgroundColor: Colors.card,
    paddingHorizontal: 14,
    paddingVertical: 14,
    borderRadius: Radius.lg,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  playlistCardSelected: {borderColor: Colors.primary},
  playlistTopRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  playlistSignal: {
    width: 4,
    alignSelf: 'stretch',
    backgroundColor: Colors.primary,
    borderRadius: Radius.pill,
    marginRight: 12,
  },
  playlistMeta: {
    flex: 1,
  },
  playlistHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  playlistName: {color: Colors.text, fontSize: 15, fontWeight: '700'},
  playlistCount: {color: Colors.textSoft, fontSize: 12},
  playlistDescription: {
    color: Colors.textSoft,
    fontSize: 13,
    lineHeight: 20,
    marginBottom: 8,
  },
  playlistMembers: {color: Colors.muted, fontSize: 12},
  statusBadge: {
    marginLeft: 10,
    backgroundColor: Colors.surfaceAccent,
    borderRadius: Radius.pill,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  statusBadgeText: {
    color: Colors.primary,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  emptyText: {
    color: Colors.muted,
    fontSize: 14,
    textAlign: 'center',
    paddingVertical: 20,
  },
});
