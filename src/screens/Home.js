import React, {useState, useEffect, useMemo} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from 'react-native';
import theme, {Colors, Radius, Shadows, Spacing, Typography} from '../theme';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {getHomeData} from '../services/musicApi';
import {usePlayer} from '../context/PlayerContext';
import {getServerTargets} from '../config';

export default function Home({navigation}) {
  const [sections, setSections] = useState({
    afrobeats: [],
    topGlobal: [],
    audiusTrending: [],
    customSongs: [],
    recentTracks: [],
  });
  const [isLoading, setIsLoading] = useState(true);
  const {playTrack} = usePlayer();
  const serverTargets = useMemo(() => getServerTargets(), []);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const data = await getHomeData();
      setSections(data);
    } catch (e) {
      console.error('Home fetchData error:', e.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePlay = async (track, queue) => {
    await playTrack(track, queue);
    navigation.navigate('NowPlaying', {track});
  };

  const RecentCard = ({item, queue}) => (
    <TouchableOpacity
      style={styles.recentCard}
      activeOpacity={0.86}
      onPress={() => handlePlay(item, queue)}>
      <Image
        source={
          item.cover
            ? {uri: item.cover}
            : item.cover_url
            ? {uri: item.cover_url}
            : require('../../logo.png')
        }
        style={styles.recentImage}
      />
      <View style={styles.recentMeta}>
        <Text style={styles.recentTitle} numberOfLines={1}>
          {item.title}
        </Text>
        <Text style={styles.recentArtist} numberOfLines={1}>
          {item.artist || item.artist_name || 'Artiste inconnu'}
        </Text>
      </View>
      <View style={styles.recentPlay}>
        <Ionicons name="play" size={16} color={Colors.background} />
      </View>
    </TouchableOpacity>
  );

  const TrackCard = ({item, queue}) => (
    <TouchableOpacity
      activeOpacity={0.9}
      style={styles.card}
      onPress={() => handlePlay(item, queue)}>
      <View>
        <Image
          source={
            item.cover
              ? {uri: item.cover}
              : item.cover_url
              ? {uri: item.cover_url}
              : require('../../logo.png')
          }
          style={styles.cardImage}
        />
        <View style={styles.sourceBadge}>
          <Text style={styles.sourceBadgeText}>
            {(item.source || 'local').toUpperCase()}
          </Text>
        </View>
      </View>
      <Text style={styles.cardTitle} numberOfLines={1}>
        {item.title}
      </Text>
      <Text style={styles.cardArtist} numberOfLines={1}>
        {item.artist || item.artist_name || 'Artiste inconnu'}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={[theme.container, styles.mainContainer]}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <View>
              <Text style={styles.kicker}>Afro sonic experience</Text>
              <Text style={styles.greeting}>AFRO SOUND</Text>
            </View>
            <TouchableOpacity
              onPress={fetchData}
              activeOpacity={0.8}
              style={styles.refreshButton}>
              <Ionicons
                name="refresh-outline"
                size={20}
                color={Colors.primary}
              />
            </TouchableOpacity>
          </View>

          <View style={styles.heroCard}>
            <Image
              source={require('../../assets/2.jpg')}
              style={styles.heroImage}
              resizeMode="cover"
            />
            <View style={styles.heroOverlay} />
            <View style={styles.heroContent}>
              <View style={styles.heroBadge}>
                <Ionicons
                  name="radio-outline"
                  size={14}
                  color={Colors.primary}
                />
                <Text style={styles.heroBadgeText}>
                  {__DEV__ ? 'Serveur local actif' : 'Cloud Vercel actif'}
                </Text>
              </View>
              <Text style={styles.heroTitle}>
                Une interface premium pour explorer, jouer et partager la
                musique.
              </Text>
              <Text style={styles.heroSubtitle}>
                Catalogue multi-source, playlists collaboratives et connexion
                backend conservee.
              </Text>
              <View style={styles.heroActions}>
                <TouchableOpacity
                  style={styles.heroPrimaryAction}
                  onPress={() => navigation.navigate('Rechercher')}>
                  <Text style={styles.heroPrimaryText}>Explorer</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.heroSecondaryAction}
                  onPress={() => navigation.navigate('Créer')}>
                  <Text style={styles.heroSecondaryText}>Creer</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          <View style={styles.statusGrid}>
            <View style={styles.statusCard}>
              <Text style={styles.statusValue}>
                {sections.afrobeats.length}
              </Text>
              <Text style={styles.statusLabel}>Afrobeats</Text>
            </View>
            <View style={styles.statusCard}>
              <Text style={styles.statusValue}>
                {sections.audiusTrending.length}
              </Text>
              <Text style={styles.statusLabel}>Audius</Text>
            </View>
            <View style={styles.statusCardWide}>
              <Text style={styles.statusWideTitle}>Connexion</Text>
              <Text style={styles.statusWideValue} numberOfLines={1}>
                {serverTargets.active}
              </Text>
            </View>
          </View>

          <View style={styles.quickActions}>
            <TouchableOpacity
              style={styles.quickAction}
              onPress={() => navigation.navigate('Bibliothèque')}>
              <Ionicons
                name="library-outline"
                size={18}
                color={Colors.primary}
              />
              <Text style={styles.quickActionText}>Bibliotheque</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.quickAction}
              onPress={() => navigation.navigate('GroupPlaylist')}>
              <Ionicons
                name="people-outline"
                size={18}
                color={Colors.primary}
              />
              <Text style={styles.quickActionText}>Partage</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.quickAction}
              onPress={() => navigation.navigate('Profile')}>
              <Ionicons
                name="sparkles-outline"
                size={18}
                color={Colors.primary}
              />
              <Text style={styles.quickActionText}>Profil</Text>
            </TouchableOpacity>
          </View>
        </View>

        {isLoading ? (
          <ActivityIndicator
            size="large"
            color={Colors.primary}
            style={styles.loader}
          />
        ) : (
          <>
            <View style={styles.sectionHeaderRow}>
              <Text style={styles.sectionTitle}>Continuez l'ecoute</Text>
              <TouchableOpacity
                onPress={() => navigation.navigate('NowPlaying')}
                activeOpacity={0.8}>
                <Text style={styles.sectionLink}>Lecteur</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.recentGrid}>
              {Array.isArray(sections.recentTracks) &&
                sections.recentTracks
                  .slice(0, 4)
                  .map((item, index) => (
                    <RecentCard
                      key={item.id || index}
                      item={item}
                      queue={sections.recentTracks}
                    />
                  ))}
            </View>

            {Array.isArray(sections.customSongs) &&
              sections.customSongs.length > 0 && (
                <>
                  <View style={styles.sectionHeaderRow}>
                    <Text style={styles.sectionTitle}>Bibliotheque maison</Text>
                    <Text style={styles.sectionMeta}>Supabase</Text>
                  </View>
                  <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.horizontalList}>
                    {sections.customSongs.map((item, index) => (
                      <TrackCard
                        key={item.id || index}
                        item={item}
                        queue={sections.customSongs}
                      />
                    ))}
                  </ScrollView>
                </>
              )}

            <View style={styles.sectionHeaderRow}>
              <Text style={styles.sectionTitle}>Radar afrobeats</Text>
              <Text style={styles.sectionMeta}>Top picks</Text>
            </View>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.horizontalList}>
              {Array.isArray(sections.afrobeats) &&
                sections.afrobeats.map((item, index) => (
                  <TrackCard
                    key={item.id || index}
                    item={item}
                    queue={sections.afrobeats}
                  />
                ))}
            </ScrollView>

            <View style={styles.featureStrip}>
              <View style={styles.featureCopy}>
                <Text style={styles.featureLabel}>Mode collaboratif</Text>
                <Text style={styles.featureTitle}>
                  Construisez des playlists partagees prêtes a synchroniser.
                </Text>
                <Text style={styles.featureDescription}>
                  Ajoutez des membres, centralisez les titres et gardez la trace
                  des changements hors ligne.
                </Text>
              </View>
              <TouchableOpacity
                style={styles.featureButton}
                onPress={() => navigation.navigate('GroupPlaylist')}>
                <Ionicons
                  name="arrow-forward"
                  size={20}
                  color={Colors.background}
                />
              </TouchableOpacity>
            </View>

            <View style={styles.sectionHeaderRow}>
              <Text style={styles.sectionTitle}>Top mondial</Text>
              <Text style={styles.sectionMeta}>Deezer</Text>
            </View>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.horizontalList}>
              {Array.isArray(sections.topGlobal) &&
                sections.topGlobal.map((item, index) => (
                  <TrackCard
                    key={item.id || index}
                    item={item}
                    queue={sections.topGlobal}
                  />
                ))}
            </ScrollView>

            <View style={styles.sectionHeaderRow}>
              <Text style={styles.sectionTitle}>Tendances audius</Text>
              <Text style={styles.sectionMeta}>Streaming</Text>
            </View>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.horizontalList}>
              {Array.isArray(sections.audiusTrending) &&
                sections.audiusTrending.map((item, index) => (
                  <TrackCard
                    key={item.id || index}
                    item={item}
                    queue={sections.audiusTrending}
                  />
                ))}
            </ScrollView>
          </>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {flex: 1, backgroundColor: Colors.background},
  content: {
    paddingBottom: 150,
  },
  header: {
    paddingHorizontal: Spacing.md,
    paddingTop: 30,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: Spacing.lg,
  },
  kicker: {
    color: Colors.primary,
    fontSize: Typography.caption,
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    marginBottom: 6,
    fontWeight: '700',
  },
  greeting: {
    color: Colors.text,
    fontSize: Typography.hero,
    fontWeight: '800',
    letterSpacing: -0.8,
  },
  refreshButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    borderWidth: 1,
    borderColor: Colors.borderStrong,
    backgroundColor: Colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroCard: {
    minHeight: 250,
    borderRadius: Radius.xl,
    overflow: 'hidden',
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.borderStrong,
    ...Shadows.soft,
  },
  heroImage: {
    ...StyleSheet.absoluteFillObject,
    width: undefined,
    height: undefined,
  },
  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(8, 8, 15, 0.55)',
  },
  heroContent: {
    padding: Spacing.lg,
    justifyContent: 'flex-end',
    flex: 1,
  },
  heroBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(9, 11, 16, 0.68)',
    borderRadius: Radius.pill,
    borderWidth: 1,
    borderColor: 'rgba(231, 165, 59, 0.35)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 14,
  },
  heroBadgeText: {
    color: Colors.text,
    fontSize: 12,
    fontWeight: '700',
    marginLeft: 8,
  },
  heroTitle: {
    color: Colors.text,
    fontSize: 25,
    lineHeight: 31,
    fontWeight: '800',
    marginBottom: 10,
    maxWidth: '90%',
  },
  heroSubtitle: {
    color: Colors.textSoft,
    fontSize: 14,
    lineHeight: 22,
    maxWidth: '92%',
  },
  heroActions: {
    flexDirection: 'row',
    marginTop: 18,
  },
  heroPrimaryAction: {
    backgroundColor: Colors.primary,
    borderRadius: Radius.pill,
    paddingHorizontal: 18,
    paddingVertical: 12,
    marginRight: 10,
  },
  heroPrimaryText: {
    color: Colors.background,
    fontWeight: '800',
  },
  heroSecondaryAction: {
    borderRadius: Radius.pill,
    paddingHorizontal: 18,
    paddingVertical: 12,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
  },
  heroSecondaryText: {
    color: Colors.text,
    fontWeight: '700',
  },
  statusGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: Spacing.md,
    justifyContent: 'space-between',
  },
  statusCard: {
    width: '30%',
    backgroundColor: Colors.card,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 16,
  },
  statusCardWide: {
    width: '36%',
    backgroundColor: Colors.surfaceAccent,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: 'rgba(231, 165, 59, 0.24)',
    padding: 16,
  },
  statusValue: {
    color: Colors.text,
    fontSize: 24,
    fontWeight: '800',
    marginBottom: 6,
  },
  statusLabel: {
    color: Colors.textSoft,
    fontSize: 12,
  },
  statusWideTitle: {
    color: Colors.primary,
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  statusWideValue: {
    color: Colors.text,
    fontSize: 12,
    lineHeight: 18,
    fontWeight: '600',
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: Spacing.md,
  },
  quickAction: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    marginRight: 10,
    paddingVertical: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    marginTop: 28,
    marginBottom: 14,
  },
  sectionTitle: {
    color: Colors.text,
    fontSize: Typography.section,
    fontWeight: '800',
    letterSpacing: -0.4,
  },
  sectionLink: {
    color: Colors.primary,
    fontWeight: '700',
  },
  sectionMeta: {
    color: Colors.textSoft,
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  recentGrid: {
    paddingHorizontal: Spacing.md,
  },
  recentCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.card,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 10,
    marginBottom: 10,
  },
  recentImage: {
    width: 58,
    height: 58,
    borderRadius: 14,
  },
  recentMeta: {
    flex: 1,
    marginHorizontal: 12,
  },
  recentTitle: {
    color: Colors.text,
    fontSize: 14,
    fontWeight: '700',
  },
  recentArtist: {
    color: Colors.textSoft,
    fontSize: 12,
    marginTop: 4,
  },
  recentPlay: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  horizontalList: {
    paddingLeft: Spacing.md,
    paddingRight: 4,
  },
  card: {
    width: 170,
    marginRight: 14,
  },
  cardImage: {
    width: 170,
    height: 170,
    borderRadius: Radius.lg,
    marginBottom: 10,
  },
  cardTitle: {
    color: Colors.text,
    fontWeight: '700',
    fontSize: 14,
  },
  cardArtist: {
    color: Colors.textSoft,
    fontSize: 12,
    marginTop: 4,
  },
  sourceBadge: {
    position: 'absolute',
    left: 10,
    bottom: 10,
    backgroundColor: Colors.overlay,
    borderRadius: Radius.pill,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  sourceBadgeText: {
    color: Colors.text,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.7,
  },
  featureStrip: {
    marginTop: 28,
    marginHorizontal: Spacing.md,
    backgroundColor: Colors.surfaceAccent,
    borderRadius: Radius.xl,
    borderWidth: 1,
    borderColor: 'rgba(231, 165, 59, 0.2)',
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  featureCopy: {
    flex: 1,
    marginRight: 16,
  },
  featureLabel: {
    color: Colors.primary,
    fontSize: 12,
    textTransform: 'uppercase',
    fontWeight: '800',
    letterSpacing: 1.1,
    marginBottom: 10,
  },
  featureTitle: {
    color: Colors.text,
    fontSize: 20,
    lineHeight: 26,
    fontWeight: '800',
    marginBottom: 10,
  },
  featureDescription: {
    color: Colors.textSoft,
    fontSize: 13,
    lineHeight: 21,
  },
  featureButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quickActionText: {
    color: Colors.text,
    fontWeight: '700',
    marginTop: 8,
  },
  loader: {
    marginTop: 90,
  },
});
