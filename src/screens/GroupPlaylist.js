import React, {useCallback, useEffect, useState} from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AppButton from '../components/AppButton';
import useAuth from '../hooks/useAuth';
import {Colors, Radius, Spacing, Typography} from '../theme';
import {
  createRemotePlaylist,
  fetchSharedPlaylists,
  fetchUserPlaylists,
  sharePlaylist,
  togglePlaylistVisibility,
} from '../services/playlistService';

export default function GroupPlaylistScreen({navigation}) {
  const {user} = useAuth();
  const [playlistName, setPlaylistName] = useState('');
  const [isPublic, setIsPublic] = useState(true);
  const [loading, setLoading] = useState(false);
  const [playlists, setPlaylists] = useState([]);
  const [sharedPlaylists, setSharedPlaylists] = useState([]);
  const [refreshing, setRefreshing] = useState(true);

  const loadPlaylists = useCallback(async () => {
    if (!user) {
      setPlaylists([]);
      setSharedPlaylists([]);
      setRefreshing(false);
      return;
    }

    setRefreshing(true);
    try {
      const [mine, shared] = await Promise.all([
        fetchUserPlaylists(user.id),
        fetchSharedPlaylists(user.id),
      ]);
      setPlaylists(mine);
      setSharedPlaylists(shared);
    } catch (error) {
      Alert.alert('Erreur', error.message);
    } finally {
      setRefreshing(false);
    }
  }, [user]);

  useEffect(() => {
    loadPlaylists();
  }, [loadPlaylists]);

  const handleCreatePlaylist = async () => {
    if (!playlistName.trim()) {
      Alert.alert('Erreur', 'Veuillez entrer un nom de playlist.');
      return;
    }
    if (!user) {
      Alert.alert('Non authentifié', "Connectez-vous d'abord.");
      return;
    }

    setLoading(true);
    try {
      await createRemotePlaylist({
        name: playlistName,
        userId: user.id,
        isPublic,
      });
      setPlaylistName('');
      setIsPublic(true);
      await loadPlaylists();
      Alert.alert('Succès', 'Playlist créée et prête à être partagée.');
    } catch (error) {
      Alert.alert('Erreur', error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleTogglePublic = async playlist => {
    try {
      await togglePlaylistVisibility(playlist.id, !playlist.is_public);
      await loadPlaylists();
    } catch (error) {
      Alert.alert('Erreur', error.message);
    }
  };

  const renderPlaylistItem = ({item}) => (
    <TouchableOpacity
      style={styles.playlistCard}
      onPress={() =>
        navigation.navigate('MusicPage', {
          item: {
            ...item,
            title: item.name,
            artist: item.is_public ? 'Playlist partagée' : 'Playlist privée',
            canEdit: item.user_id === user?.id,
          },
        })
      }>
      <View style={styles.playlistTopRow}>
        <View style={styles.playlistSignal} />
        <View style={styles.playlistMeta}>
          <View style={styles.playlistHeader}>
            <Text style={styles.playlistName}>{item.name}</Text>
            <Text style={styles.playlistCount}>
              {item.is_public ? 'Public' : 'Privé'}
            </Text>
          </View>
          <Text style={styles.playlistDescription} numberOfLines={2}>
            {item.is_public
              ? 'Visible dans la bibliothèque partagée.'
              : 'Accessible uniquement depuis votre compte.'}
          </Text>
        </View>
        <View style={styles.actionColumn}>
          <Switch
            value={item.is_public}
            onValueChange={() => handleTogglePublic(item)}
            thumbColor={Colors.background}
            trackColor={{
              false: Colors.borderStrong,
              true: Colors.primary,
            }}
          />
          <TouchableOpacity
            onPress={() => sharePlaylist(item)}
            style={styles.iconAction}>
            <Ionicons
              name="share-social-outline"
              size={18}
              color={Colors.primary}
            />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="chevron-back" size={28} color={Colors.primary} />
          </TouchableOpacity>
          <View style={styles.headerCopy}>
            <Text style={styles.headerKicker}>Partage cloud</Text>
            <Text style={styles.headerTitle}>Playlists partagées</Text>
          </View>
        </View>

        <View style={styles.heroCard}>
          <Text style={styles.heroTitle}>
            Créez des playlists publiques, partagez-les et retrouvez celles des
            autres comptes.
          </Text>
          <Text style={styles.heroText}>
            La base étant déjà prête, cette vue pilote désormais les playlists
            partagées réelles au lieu d'un faux mode local.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Créer une playlist</Text>
          <TextInput
            style={styles.input}
            placeholder="Nom de la playlist..."
            placeholderTextColor={Colors.muted}
            value={playlistName}
            onChangeText={setPlaylistName}
          />
          <View style={styles.visibilityCard}>
            <View style={styles.flexFill}>
              <Text style={styles.visibilityTitle}>Visibilité publique</Text>
              <Text style={styles.visibilityText}>
                {isPublic
                  ? 'Elle sera visible dans la bibliothèque partagée.'
                  : "Elle restera privée tant que vous ne l'ouvrez pas."}
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
          <AppButton
            title="Créer la playlist"
            onPress={handleCreatePlaylist}
            loading={loading}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Mes playlists ({playlists.length})
          </Text>
          {refreshing ? (
            <ActivityIndicator
              color={Colors.primary}
              style={styles.loadingState}
            />
          ) : playlists.length > 0 ? (
            <FlatList
              data={playlists}
              renderItem={renderPlaylistItem}
              keyExtractor={item => item.id}
              scrollEnabled={false}
            />
          ) : (
            <Text style={styles.emptyText}>Aucune playlist créée encore.</Text>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Découvrir ({sharedPlaylists.length})
          </Text>
          {sharedPlaylists.length === 0 ? (
            <Text style={styles.emptyText}>
              Aucune playlist partagée disponible pour le moment.
            </Text>
          ) : (
            sharedPlaylists.map(item => (
              <TouchableOpacity
                key={item.id}
                style={styles.discoveryCard}
                onPress={() =>
                  navigation.navigate('MusicPage', {
                    item: {
                      ...item,
                      title: item.name,
                      artist: 'Playlist partagée',
                      canEdit: false,
                    },
                  })
                }>
                <View style={styles.discoveryAccent} />
                <View style={styles.discoveryMeta}>
                  <Text style={styles.playlistName}>{item.name}</Text>
                  <Text style={styles.playlistDescription}>
                    Disponible pour lecture, ajout à la file et partage.
                  </Text>
                </View>
                <Ionicons
                  name="chevron-forward"
                  size={18}
                  color={Colors.textSoft}
                />
              </TouchableOpacity>
            ))
          )}
        </View>
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
  visibilityCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
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
  playlistCard: {
    backgroundColor: Colors.card,
    paddingHorizontal: 14,
    paddingVertical: 14,
    borderRadius: Radius.lg,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: Colors.border,
  },
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
  actionColumn: {
    marginLeft: 10,
    alignItems: 'center',
    gap: 10,
  },
  iconAction: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.surfaceAccent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  discoveryCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingVertical: 16,
    paddingHorizontal: 14,
    marginBottom: 12,
  },
  discoveryAccent: {
    width: 4,
    alignSelf: 'stretch',
    backgroundColor: Colors.primary,
    borderRadius: Radius.pill,
    marginRight: 12,
  },
  discoveryMeta: {
    flex: 1,
  },
  emptyText: {
    color: Colors.muted,
    fontSize: 14,
    textAlign: 'center',
    paddingVertical: 20,
  },
  loadingState: {
    marginTop: 10,
  },
});
