import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from 'react-native';
import theme, {Colors} from '../theme';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {getHomeData} from '../services/musicApi';
import {usePlayer} from '../context/PlayerContext';
import TrackListItem from '../components/TrackListItem';

export default function Home({navigation}) {
  const [sections, setSections] = useState({
    afrobeats: [],
    topGlobal: [],
    audiusTrending: [],
    customSongs: [],
    recentTracks: [],
  });
  const [isLoading, setIsLoading] = useState(true);
  const {playTrack, currentTrack} = usePlayer();

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

  const renderRecentCard = (item, index, queue) => (
    <TouchableOpacity
      key={item.id || index}
      style={styles.recentCard}
      activeOpacity={0.8}
      onPress={() => handlePlay(item, queue)}>
      <Image
        source={
          item.cover || item.cover_url
            ? {uri: item.cover || item.cover_url}
            : require('../../logo.png')
        }
        style={styles.recentImage}
      />
      <Text style={styles.recentTitle} numberOfLines={2}>
        {item.title}
      </Text>
      {currentTrack?.id === item.id && (
        <Ionicons name="stats-chart" size={16} color={Colors.primary} style={{marginRight: 8}} />
      )}
    </TouchableOpacity>
  );

  const renderTrackCard = (p, index, queue) => (
    <TouchableOpacity
      key={p.id || index}
      style={styles.card}
      activeOpacity={0.9}
      onPress={() => handlePlay(p, queue)}>
      <View style={styles.cardImageContainer}>
        <Image
          source={
            p.cover || p.cover_url
              ? {uri: p.cover || p.cover_url}
              : require('../../logo.png')
          }
          style={styles.cardImage}
        />
        <View
          style={[
            styles.sourceBadge,
            p.source === 'itunes' && styles.itunesBadge,
            p.source === 'jamendo' && styles.jamendoBadge,
          ]}>
          <Text style={styles.sourceBadgeText}>
            {p.source || 'Local'}
          </Text>
        </View>
        {currentTrack?.id === p.id && (
          <View style={styles.cardPlayingOverlay}>
            <Ionicons name="play" size={32} color={Colors.primary} />
          </View>
        )}
      </View>
      <Text style={[styles.cardTitle, currentTrack?.id === p.id && {color: Colors.primary}]} numberOfLines={1}>
        {p.title}
      </Text>
      <Text style={styles.cardArtist} numberOfLines={1}>
        {p.artist || p.artist_name || 'Artiste inconnu'}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={[theme.container, styles.mainContainer]}>
      <ScrollView
        contentContainerStyle={{paddingBottom: 140}}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <TouchableOpacity
                onPress={() => navigation.navigate('Bibliothèque')}
                activeOpacity={0.8}>
                <View style={styles.profilePic}>
                  <Ionicons name="person" size={20} color={Colors.muted} />
                </View>
              </TouchableOpacity>
              <Text style={styles.greeting}>AFRO SOUND</Text>
            </View>
            <TouchableOpacity onPress={fetchData} activeOpacity={0.8}>
              <Ionicons
                name="notifications-outline"
                size={26}
                color={Colors.text}
              />
            </TouchableOpacity>
          </View>
          <View style={styles.filtersRow}>
            <TouchableOpacity style={[styles.filterPill, styles.activeFilter]}>
              <Text style={styles.activeFilterText}>Tout</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.filterPill}>
              <Text style={styles.filterText}>Musique</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.filterPill}>
              <Text style={styles.filterText}>Podcasts</Text>
            </TouchableOpacity>
          </View>
        </View>

        {isLoading ? (
          <View style={styles.loaderContainer}>
            <ActivityIndicator size="large" color={Colors.primary} />
          </View>
        ) : (
          <>
            <View style={styles.recentGrid}>
              {sections.recentTracks
                .slice(0, 6)
                .map((item, i) =>
                  renderRecentCard(item, i, sections.recentTracks),
                )}
            </View>

            {sections.customSongs.length > 0 && (
              <>
                <View style={styles.sectionHeader}>
                  <Text style={styles.sectionTitle}>Vos titres</Text>
                  <TouchableOpacity onPress={() => navigation.navigate('MusicPage', {item: {title: 'Vos titres'}, tracks: sections.customSongs})}>
                    <Text style={styles.seeAll}>Tout afficher</Text>
                  </TouchableOpacity>
                </View>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={{paddingLeft: 16, paddingRight: 8}}>
                  {sections.customSongs.map((p, i) =>
                    renderTrackCard(p, i, sections.customSongs),
                  )}
                </ScrollView>
              </>
            )}

            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Afrobeats</Text>
              <TouchableOpacity onPress={() => navigation.navigate('MusicPage', {item: {title: 'Afrobeats'}, tracks: sections.afrobeats})}>
                <Text style={styles.seeAll}>Tout afficher</Text>
              </TouchableOpacity>
            </View>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{paddingLeft: 16, paddingRight: 8}}>
              {sections.afrobeats.map((p, i) =>
                renderTrackCard(p, i, sections.afrobeats),
              )}
            </ScrollView>

            <View style={styles.bannerContainer}>
              <Image
                source={require('../../assets/2.jpg')}
                style={styles.bannerImage}
                resizeMode="cover"
              />
              <View style={styles.bannerOverlay}>
                <Text style={styles.bannerLabel}>À l'honneur</Text>
                <Text style={styles.bannerHeadline}>
                  L'Essence de l'Afrique
                </Text>
                <Text style={styles.bannerNote}>
                  Une sélection exclusive des meilleurs rythmes Afrobeats.
                </Text>
              </View>
            </View>

            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Top Mondial</Text>
              <TouchableOpacity onPress={() => navigation.navigate('MusicPage', {item: {title: 'Top Mondial'}, tracks: sections.topGlobal})}>
                <Text style={styles.seeAll}>Tout afficher</Text>
              </TouchableOpacity>
            </View>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{paddingLeft: 16, paddingRight: 8}}>
              {sections.topGlobal.map((p, i) =>
                renderTrackCard(p, i, sections.topGlobal),
              )}
            </ScrollView>

            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Tendances Audius</Text>
              <TouchableOpacity onPress={() => navigation.navigate('MusicPage', {item: {title: 'Audius Trending'}, tracks: sections.audiusTrending})}>
                <Text style={styles.seeAll}>Tout afficher</Text>
              </TouchableOpacity>
            </View>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{paddingLeft: 16, paddingRight: 8, paddingBottom: 20}}>
              {sections.audiusTrending.map((p, i) =>
                renderTrackCard(p, i, sections.audiusTrending),
              )}
            </ScrollView>
          </>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {flex: 1, backgroundColor: Colors.background},
  header: {paddingHorizontal: 16, paddingTop: 40, paddingBottom: 16},
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  profilePic: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.surface,
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  greeting: {
    color: Colors.text,
    fontSize: 22,
    fontWeight: 'bold',
    letterSpacing: -0.5,
  },
  filtersRow: {flexDirection: 'row', gap: 8},
  filterPill: {
    backgroundColor: Colors.surface,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  activeFilter: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  filterText: {color: Colors.text, fontSize: 13, fontWeight: '600'},
  activeFilterText: {color: Colors.background, fontSize: 13, fontWeight: '700'},
  loaderContainer: {marginTop: 100, alignItems: 'center'},
  recentGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 12,
    justifyContent: 'space-between',
  },
  recentCard: {
    width: '48%',
    backgroundColor: Colors.surface,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 6,
    marginBottom: 10,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.border + '33',
  },
  recentImage: {width: 56, height: 56},
  recentTitle: {
    flex: 1,
    color: Colors.text,
    fontSize: 12,
    fontWeight: '700',
    paddingHorizontal: 8,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingRight: 16,
    marginTop: 24,
    marginBottom: 16,
  },
  sectionTitle: {
    color: Colors.text,
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 16,
    letterSpacing: -0.5,
  },
  seeAll: {
    color: Colors.muted,
    fontSize: 13,
    fontWeight: '600',
  },
  card: {width: 160, marginRight: 16},
  cardImageContainer: {
    position: 'relative',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 5},
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  cardImage: {width: 160, height: 160, borderRadius: 12},
  cardPlayingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.4)',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardTitle: {
    color: Colors.text,
    marginTop: 12,
    fontSize: 14,
    fontWeight: '700',
  },
  cardArtist: {
    color: Colors.muted,
    marginTop: 4,
    fontSize: 13,
    fontWeight: '500'
  },
  sourceBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
    backdropFilter: 'blur(10px)',
  },
  itunesBadge: {backgroundColor: 'rgba(29,26,41,0.8)'},
  jamendoBadge: {backgroundColor: 'rgba(255,51,51,0.8)'},
  sourceBadgeText: {
    fontSize: 10,
    color: '#FFF',
    fontWeight: '800',
    textTransform: 'uppercase'
  },
  bannerContainer: {
    marginHorizontal: 16,
    marginTop: 32,
    borderRadius: 16,
    overflow: 'hidden',
    height: 160,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 10},
    shadowOpacity: 0.4,
    shadowRadius: 15,
  },
  bannerImage: {width: '100%', height: '100%'},
  bannerOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    padding: 20,
    justifyContent: 'flex-end',
  },
  bannerLabel: {
    color: Colors.primary,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 2,
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  bannerHeadline: {
    color: Colors.text,
    fontSize: 22,
    fontWeight: '900',
    marginBottom: 6,
  },
  bannerNote: {color: '#E0E0E0', fontSize: 13, fontWeight: '500', lineHeight: 18},
});
