import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Animated,
} from 'react-native';
import theme, {Colors} from '../theme';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {getHomeData} from '../services/musicApi';
import {usePlayer} from '../context/PlayerContext';

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

  const RecentCard = ({item, index, queue}) => {
    const anim = useRef(new Animated.Value(0)).current;
    useEffect(() => {
      Animated.spring(anim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        delay: index * 100,
        useNativeDriver: true,
      }).start();
    }, [index]);

    return (
      <Animated.View
        style={[
          styles.recentCard,
          {
            opacity: anim,
            transform: [
              {
                scale: anim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.8, 1],
                }),
              },
            ],
          },
        ]}>
        <TouchableOpacity
          style={{flexDirection: 'row', alignItems: 'center', flex: 1}}
          activeOpacity={0.8}
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
          <Text style={styles.recentTitle} numberOfLines={2}>
            {item.title}
          </Text>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  const TrackCard = ({p, index, queue}) => {
    const anim = useRef(new Animated.Value(0)).current;
    useEffect(() => {
      Animated.timing(anim, {
        toValue: 1,
        duration: 500,
        delay: index * 50,
        useNativeDriver: true,
      }).start();
    }, [index]);

    return (
      <Animated.View
        style={[
          styles.card,
          {
            opacity: anim,
            transform: [
              {
                translateX: anim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [20, 0],
                }),
              },
            ],
          },
        ]}>
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={() => handlePlay(p, queue)}>
          <View>
            <Image
              source={
                p.cover
                  ? {uri: p.cover}
                  : p.cover_url
                  ? {uri: p.cover_url}
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
                {p.source === 'itunes'
                  ? 'iTunes'
                  : p.source === 'deezer'
                  ? 'Deezer'
                  : p.source === 'jamendo'
                  ? 'Jamendo'
                  : p.source === 'audius'
                  ? 'Audius'
                  : 'Local'}
              </Text>
            </View>
          </View>
          <Text style={styles.cardTitle} numberOfLines={1}>
            {p.title}
          </Text>
          <Text style={styles.cardArtist} numberOfLines={1}>
            {p.artist || p.artist_name || 'Artiste inconnu'}
          </Text>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  return (
    <View style={[theme.container, styles.mainContainer]}>
      <ScrollView contentContainerStyle={{paddingBottom: 140}}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <TouchableOpacity
                onPress={() => navigation.navigate('Profile')}
                activeOpacity={0.8}>
                <View style={styles.profilePic} />
              </TouchableOpacity>
              <Text style={styles.greeting}>AFRO SOUND</Text>
            </View>
            <TouchableOpacity onPress={fetchData} activeOpacity={0.8}>
              <Ionicons
                name="refresh-outline"
                size={24}
                color={Colors.primary}
              />
            </TouchableOpacity>
          </View>
          <View style={styles.filtersRow}>
            <View style={styles.filterPill}>
              <Text style={styles.filterText}>Deezer</Text>
            </View>
            <View style={[styles.filterPill, {backgroundColor: '#1D1A29'}]}>
              <Text style={styles.filterText}>iTunes</Text>
            </View>
          </View>
        </View>

        {isLoading ? (
          <ActivityIndicator
            size="large"
            color={Colors.primary}
            style={{marginTop: 80}}
          />
        ) : (
          <>
            <View style={styles.recentGrid}>
              {Array.isArray(sections.recentTracks) && sections.recentTracks
                .slice(0, 6)
                .map((item, i) => (
                  <RecentCard key={item.id || i} item={item} index={i} queue={sections.recentTracks} />
                ))}
            </View>

            {Array.isArray(sections.customSongs) && sections.customSongs.length > 0 && (
              <>
                <Text style={[styles.sectionTitle, {marginTop: 28}]}>
                  Vos titres (Supabase)
                </Text>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={{paddingLeft: 16, paddingRight: 8}}>
                  {sections.customSongs.map((p, i) => (
                    <TrackCard key={p.id || i} p={p} index={i} queue={sections.customSongs} />
                  ))}
                </ScrollView>
              </>
            )}

            <Text style={styles.sectionTitle}>Afrobeats</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{paddingLeft: 16, paddingRight: 8}}>
              {Array.isArray(sections.afrobeats) && sections.afrobeats.map((p, i) => (
                <TrackCard key={p.id || i} p={p} index={i} queue={sections.afrobeats} />
              ))}
            </ScrollView>

            <Text style={[styles.sectionTitle, {marginTop: 28}]}>
              Top Mondial
            </Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{paddingLeft: 16, paddingRight: 8}}>
              {Array.isArray(sections.topGlobal) && sections.topGlobal.map((p, i) => (
                <TrackCard key={p.id || i} p={p} index={i} queue={sections.topGlobal} />
              ))}
            </ScrollView>

            <View style={styles.bannerContainer}>
              <Image
                source={require('../../assets/2.jpg')}
                style={styles.bannerImage}
                resizeMode="cover"
                blurRadius={4}
              />
              <View style={styles.bannerOverlay}>
                <Text style={styles.bannerLabel}>Découverte</Text>
                <Text style={styles.bannerHeadline}>
                  Les meilleures pistes du moment
                </Text>
                <Text style={styles.bannerNote}>
                  Explore les nouveautés Afrobeats et iTunes dans une ambiance
                  chaleureuse.
                </Text>
              </View>
            </View>

            <Text style={[styles.sectionTitle, {marginTop: 28}]}>
              Tendances Audius
            </Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{paddingLeft: 16, paddingRight: 8}}>
              {Array.isArray(sections.audiusTrending) && sections.audiusTrending.map((p, i) => (
                <TrackCard key={p.id || i} p={p} index={i} queue={sections.audiusTrending} />
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
  },
  greeting: {
    color: Colors.text,
    fontSize: 22,
    fontWeight: 'bold',
    letterSpacing: -0.5,
  },
  filtersRow: {flexDirection: 'row'},
  filterPill: {
    backgroundColor: Colors.surface,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginRight: 8,
  },
  filterText: {color: Colors.text, fontSize: 13, fontWeight: '500'},
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
    borderRadius: 4,
    marginBottom: 8,
    overflow: 'hidden',
  },
  recentImage: {width: 56, height: 56},
  recentTitle: {
    flex: 1,
    color: Colors.text,
    fontSize: 12,
    fontWeight: '600',
    paddingHorizontal: 8,
  },
  sectionTitle: {
    color: Colors.text,
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 16,
    marginTop: 24,
    marginBottom: 16,
    letterSpacing: -0.5,
  },
  card: {width: 150, marginRight: 16, position: 'relative'},
  cardImage: {width: 150, height: 150, borderRadius: 16},
  cardTitle: {
    color: Colors.text,
    marginTop: 10,
    fontSize: 13,
    fontWeight: '600',
  },
  cardArtist: {color: Colors.muted, marginTop: 2, fontSize: 12},
  sourceBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(0,0,0,0.65)',
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  itunesBadge: {backgroundColor: 'rgba(29,26,41,0.85)'},
  jamendoBadge: {backgroundColor: 'rgba(255,51,51,0.85)'},
  sourceBadgeText: {fontSize: 12},
  bannerContainer: {
    marginHorizontal: 16,
    marginTop: 28,
    borderRadius: 16,
    overflow: 'hidden',
  },
  bannerImage: {width: '100%', height: 140},
  bannerOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(10, 20, 10, 0.35)',
    padding: 16,
    justifyContent: 'flex-end',
  },
  bannerLabel: {
    color: Colors.primary,
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: 6,
  },
  bannerHeadline: {
    color: Colors.text,
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 4,
  },
  bannerNote: {color: Colors.muted, fontSize: 12, lineHeight: 18},
});
