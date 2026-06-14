import React, {useState, useEffect, useCallback} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {supabase} from '../supabaseClient';
import useAuth from '../hooks/useAuth';
import useGroupPlaylist from '../hooks/useGroupPlaylist';
import {Colors, Radius, Spacing, Typography} from '../theme';

const sampleCovers = [
  require('../../assets/1.jpg'),
  require('../../assets/2.jpg'),
  require('../../assets/3.jpg'),
  require('../../logo.png'),
];

export default function Library({navigation, route}) {
  const {user} = useAuth();
  const {groupPlaylists} = useGroupPlaylist();
  const [myPlaylists, setMyPlaylists] = useState([]);
  const [loading, setLoading] = useState(true);

  const sharedPlaylists = Object.values(groupPlaylists);

  const fetchPlaylists = useCallback(async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const {data, error} = await supabase
        .from('playlists')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', {ascending: false});

      if (error) {
        throw error;
      }
      setMyPlaylists(data || []);
    } catch (error) {
      console.error('Error fetching playlists:', error.message);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchPlaylists();
  }, [fetchPlaylists, route.params?.refresh]);

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
            <Text style={styles.summaryValue}>{myPlaylists.length}</Text>
            <Text style={styles.summaryLabel}>Playlists perso</Text>
          </View>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryValue}>{sharedPlaylists.length}</Text>
            <Text style={styles.summaryLabel}>Playlists partagees</Text>
          </View>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryValue}>{user ? 'ON' : 'OFF'}</Text>
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
              <Text style={styles.sectionTitle}>Playlists cloud</Text>
              <Text style={styles.sectionMeta}>
                {myPlaylists.length} elements
              </Text>
            </View>
            {myPlaylists.length === 0 ? (
              <View style={styles.emptyCard}>
                <Text style={styles.emptyTitle}>Aucune playlist distante</Text>
                <Text style={styles.emptyText}>
                  Créez votre premiere playlist et retrouvez-la ici avec les
                  donnees Supabase.
                </Text>
              </View>
            ) : (
              myPlaylists.map((playlist, index) => (
                <TouchableOpacity
                  key={playlist.id || index}
                  style={styles.playlistCard}
                  activeOpacity={0.86}
                  onPress={() =>
                    navigation.navigate('MusicPage', {
                      item: {
                        title: playlist.name,
                        artist: playlist.is_public
                          ? 'Playlist publique'
                          : 'Playlist privee',
                        image: sampleCovers[index % sampleCovers.length],
                      },
                    })
                  }>
                  <Image
                    source={sampleCovers[index % sampleCovers.length]}
                    style={styles.playlistCover}
                  />
                  <View style={styles.playlistInfo}>
                    <Text style={styles.playlistTitle}>{playlist.name}</Text>
                    <Text style={styles.playlistSubtitle}>
                      {playlist.is_public
                        ? 'Publiee pour partage'
                        : 'Reservee a votre compte'}
                    </Text>
                  </View>
                  <Ionicons
                    name="chevron-forward-outline"
                    size={18}
                    color={Colors.textSoft}
                  />
                </TouchableOpacity>
              ))
            )}

            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Playlists partagees</Text>
              <TouchableOpacity
                onPress={() => navigation.navigate('GroupPlaylist')}>
                <Text style={styles.sectionAction}>Ouvrir</Text>
              </TouchableOpacity>
            </View>
            {sharedPlaylists.length === 0 ? (
              <View style={styles.emptyCard}>
                <Text style={styles.emptyTitle}>
                  Aucune playlist collaborative
                </Text>
                <Text style={styles.emptyText}>
                  Lancez un espace partage pour inviter des membres et piloter
                  la synchronisation.
                </Text>
              </View>
            ) : (
              sharedPlaylists.map(playlist => (
                <TouchableOpacity
                  key={playlist.id}
                  style={styles.sharedCard}
                  activeOpacity={0.86}
                  onPress={() => navigation.navigate('GroupPlaylist')}>
                  <View style={styles.sharedAccent} />
                  <View style={styles.sharedMeta}>
                    <Text style={styles.playlistTitle}>{playlist.name}</Text>
                    <Text style={styles.playlistSubtitle}>
                      {playlist.members.length} membres •{' '}
                      {playlist.tracks.length} titres
                    </Text>
                  </View>
                  <View style={styles.syncBadge}>
                    <Text style={styles.syncBadgeText}>
                      {playlist.isSynced ? 'Syncee' : 'Locale'}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))
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
  sharedMeta: {
    flex: 1,
  },
  syncBadge: {
    backgroundColor: Colors.surfaceAccent,
    borderRadius: Radius.pill,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  syncBadgeText: {
    color: Colors.primary,
    fontSize: 11,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
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
