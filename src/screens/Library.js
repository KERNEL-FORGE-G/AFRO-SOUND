import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import useAuth from '../hooks/useAuth';
import {Colors, Radius, Spacing, Typography} from '../theme';
import {
  fetchSharedPlaylists,
  fetchUserPlaylists,
  sharePlaylist,
  togglePlaylistVisibility,
} from '../services/playlistService';

const sampleCovers = [
  require('../../assets/1.jpg'),
  require('../../assets/2.jpg'),
  require('../../assets/3.jpg'),
  require('../../logo.png'),
];

export default function Library({navigation, route}) {
  const {user} = useAuth();
  const [myPlaylists, setMyPlaylists] = useState([]);
  const [sharedPlaylists, setSharedPlaylists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingPlaylistId, setUpdatingPlaylistId] = useState(null);

  const summary = useMemo(
    () => ({
      personal: myPlaylists.length,
      shared: sharedPlaylists.length,
      session: user ? 'ON' : 'OFF',
    }),
    [myPlaylists.length, sharedPlaylists.length, user],
  );

  const loadPlaylists = useCallback(async () => {
    if (!user) {
      setMyPlaylists([]);
      setSharedPlaylists([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const [mine, shared] = await Promise.all([
        fetchUserPlaylists(user.id),
        fetchSharedPlaylists(user.id),
      ]);
      setMyPlaylists(mine);
      setSharedPlaylists(shared);
    } catch (error) {
      console.error('Error fetching playlists:', error.message);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    loadPlaylists();
  }, [loadPlaylists, route.params?.refresh]);

  const openPlaylist = playlist => {
    navigation.navigate('MusicPage', {
      item: {
        ...playlist,
        title: playlist.name,
        artist:
          playlist.user_id === user?.id
            ? playlist.is_public
              ? 'Votre playlist partagée'
              : 'Votre playlist privée'
            : 'Playlist partagée',
        image:
          sampleCovers[
            Math.abs((playlist.name || '').length) % sampleCovers.length
          ],
        canEdit: playlist.user_id === user?.id,
      },
    });
  };

  const handleToggleVisibility = async playlist => {
    setUpdatingPlaylistId(playlist.id);
    try {
      const updated = await togglePlaylistVisibility(
        playlist.id,
        !playlist.is_public,
      );
      setMyPlaylists(previous =>
        previous.map(item => (item.id === updated.id ? updated : item)),
      );
      await loadPlaylists();
    } catch (error) {
      console.error('Visibility update error:', error.message);
    } finally {
      setUpdatingPlaylistId(null);
    }
  };

  const renderPlaylistCard = (playlist, index, options = {}) => (
    <TouchableOpacity
      key={playlist.id || index}
      style={options.shared ? styles.sharedCard : styles.playlistCard}
      activeOpacity={0.86}
      onPress={() => openPlaylist(playlist)}>
      {!options.shared ? (
        <Image
          source={sampleCovers[index % sampleCovers.length]}
          style={styles.playlistCover}
        />
      ) : (
        <View style={styles.sharedAccent} />
      )}

      <View style={styles.playlistInfo}>
        <Text style={styles.playlistTitle}>{playlist.name}</Text>
        <Text style={styles.playlistSubtitle}>
          {options.shared
            ? 'Disponible pour lecture et partage'
            : playlist.is_public
            ? 'Playlist publique'
            : 'Playlist privée'}
        </Text>
      </View>

      {options.shared ? (
        <TouchableOpacity
          style={styles.shareIconBtn}
          onPress={() => sharePlaylist(playlist)}>
          <Ionicons
            name="share-social-outline"
            size={18}
            color={Colors.primary}
          />
        </TouchableOpacity>
      ) : (
        <View style={styles.visibilitySwitch}>
          {updatingPlaylistId === playlist.id ? (
            <ActivityIndicator size="small" color={Colors.primary} />
          ) : (
            <Switch
              value={playlist.is_public}
              onValueChange={() => handleToggleVisibility(playlist)}
              thumbColor={Colors.background}
              trackColor={{
                false: Colors.borderStrong,
                true: Colors.primary,
              }}
            />
          )}
        </View>
      )}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <View>
            <Text style={styles.kicker}>Collection personnelle</Text>
            <Text style={styles.title}>Votre bibliothèque</Text>
          </View>
          <View style={styles.headerActions}>
            <TouchableOpacity
              style={styles.actionIcon}
              onPress={() => navigation.navigate('Rechercher')}>
              <Ionicons name="search-outline" size={20} color={Colors.text} />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.actionIcon}
              onPress={() => navigation.navigate('Créer')}>
              <Ionicons name="add-outline" size={22} color={Colors.text} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.summaryRow}>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryValue}>{summary.personal}</Text>
            <Text style={styles.summaryLabel}>Playlists perso</Text>
          </View>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryValue}>{summary.shared}</Text>
            <Text style={styles.summaryLabel}>Playlists partagées</Text>
          </View>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryValue}>{summary.session}</Text>
            <Text style={styles.summaryLabel}>Session</Text>
          </View>
        </View>

        {loading ? (
          <ActivityIndicator
            size="large"
            color={Colors.primary}
            style={styles.loader}
          />
        ) : !user ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>Connexion requise</Text>
            <Text style={styles.emptyText}>
              Connectez-vous pour afficher vos playlists, vos historiques et vos
              favoris.
            </Text>
            <TouchableOpacity
              style={styles.loginBtn}
              onPress={() => navigation.navigate('Login')}>
              <Text style={styles.loginBtnText}>Se connecter</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Mes playlists</Text>
              <Text style={styles.sectionMeta}>
                {myPlaylists.length} élément{myPlaylists.length > 1 ? 's' : ''}
              </Text>
            </View>
            {myPlaylists.length === 0 ? (
              <View style={styles.emptyCard}>
                <Text style={styles.emptyTitle}>Aucune playlist</Text>
                <Text style={styles.emptyText}>
                  Créez votre première playlist puis rendez-la publique pour la
                  partager.
                </Text>
              </View>
            ) : (
              myPlaylists.map((playlist, index) =>
                renderPlaylistCard(playlist, index),
              )
            )}

            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Playlists partagées</Text>
              <TouchableOpacity
                onPress={() => navigation.navigate('GroupPlaylist')}>
                <Text style={styles.sectionAction}>Gérer</Text>
              </TouchableOpacity>
            </View>
            {sharedPlaylists.length === 0 ? (
              <View style={styles.emptyCard}>
                <Text style={styles.emptyTitle}>Aucune playlist publique</Text>
                <Text style={styles.emptyText}>
                  Publiez une de vos playlists ou attendez qu'un autre compte en
                  partage une.
                </Text>
              </View>
            ) : (
              sharedPlaylists.map((playlist, index) =>
                renderPlaylistCard(playlist, index, {shared: true}),
              )
            )}
          </>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: Colors.background},
  content: {
    paddingHorizontal: Spacing.md,
    paddingTop: 34,
    paddingBottom: 140,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  kicker: {
    color: Colors.primary,
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 1.1,
    fontWeight: '800',
    marginBottom: 8,
  },
  title: {color: Colors.text, fontSize: Typography.hero, fontWeight: '800'},
  headerActions: {flexDirection: 'row', alignItems: 'center'},
  actionIcon: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  summaryCard: {
    width: '31%',
    backgroundColor: Colors.card,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 16,
    alignItems: 'center',
  },
  summaryValue: {color: Colors.text, fontSize: 22, fontWeight: '800'},
  summaryLabel: {
    color: Colors.textSoft,
    fontSize: 12,
    marginTop: 6,
    textAlign: 'center',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    marginTop: 8,
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
  sectionAction: {color: Colors.primary, fontWeight: '800'},
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyCard: {
    backgroundColor: Colors.card,
    borderRadius: Radius.xl,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 20,
    marginBottom: 22,
  },
  emptyTitle: {
    color: Colors.text,
    fontSize: 17,
    fontWeight: '800',
    marginBottom: 8,
  },
  emptyText: {
    color: Colors.textSoft,
    fontSize: 14,
    lineHeight: 22,
  },
  playlistCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
    backgroundColor: Colors.card,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 10,
  },
  playlistCover: {
    width: 64,
    height: 64,
    backgroundColor: Colors.surface,
    borderRadius: Radius.md,
  },
  playlistInfo: {
    flex: 1,
    marginHorizontal: 12,
  },
  playlistTitle: {color: Colors.text, fontSize: 15, fontWeight: '700'},
  playlistSubtitle: {color: Colors.textSoft, fontSize: 12, marginTop: 6},
  visibilitySwitch: {
    marginLeft: 8,
  },
  sharedCard: {
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
  sharedAccent: {
    width: 4,
    alignSelf: 'stretch',
    backgroundColor: Colors.primary,
    borderRadius: Radius.pill,
    marginRight: 12,
  },
  shareIconBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.surfaceAccent,
  },
  loginBtn: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
    marginTop: 20,
  },
  loginBtnText: {
    color: Colors.background,
    fontWeight: '800',
    fontSize: 16,
  },
  loader: {
    marginTop: 40,
  },
});
