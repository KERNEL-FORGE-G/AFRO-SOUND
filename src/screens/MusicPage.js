import React, {useEffect, useState, useCallback} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import theme, {Colors} from '../theme';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {supabase} from '../supabaseClient';
import {usePlayer} from '../context/PlayerContext';

export default function MusicPage({route, navigation}) {
  const {item} = route.params || {};
  const {playTrack} = usePlayer();
  const [tracks, setTracks] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPlaylistTracks = useCallback(async () => {
    setLoading(true);
    try {
      const {data, error} = await supabase
        .from('playlist_tracks')
        .select('*, tracks(*)')
        .eq('playlist_id', item.id)
        .order('position', {ascending: true});

      if (error) {
        throw error;
      }
      setTracks(data.map(d => d.tracks).filter(Boolean));
    } catch (e) {
      console.error(e.message);
    } finally {
      setLoading(false);
    }
  }, [item?.id]);

  useEffect(() => {
    if (item?.id) {
      fetchPlaylistTracks();
    } else {
      setLoading(false);
    }
  }, [item?.id, fetchPlaylistTracks]);

  const handlePlayAll = async () => {
    if (tracks.length > 0) {
      await playTrack(tracks[0], tracks);
      navigation.navigate('NowPlaying');
    }
  };

  const renderTrackItem = ({item: track}) => (
    <TouchableOpacity
      style={styles.trackItem}
      onPress={async () => {
        await playTrack(track, tracks);
        navigation.navigate('NowPlaying');
      }}>
      <Image
        source={
          track.cover_url ? {uri: track.cover_url} : require('../../logo.png')
        }
        style={styles.trackThumb}
      />
      <View style={{flex: 1}}>
        <Text style={styles.trackTitleSmall} numberOfLines={1}>
          {track.title}
        </Text>
        <Text style={styles.trackArtistSmall} numberOfLines={1}>
          {track.artist}
        </Text>
      </View>
      <Ionicons name="play-circle-outline" size={24} color={Colors.primary} />
    </TouchableOpacity>
  );

  return (
    <View style={theme.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={Colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Détails</Text>
        <View style={{width: 24}} />
      </View>

      <FlatList
        ListHeaderComponent={
          <>
            <View style={styles.artContainer}>
              <Image
                source={
                  item?.image ||
                  (tracks[0]?.cover_url
                    ? {uri: tracks[0].cover_url}
                    : require('../../assets/1.jpg'))
                }
                style={styles.art}
              />
            </View>

            <View style={{paddingHorizontal: 20, alignItems: 'center'}}>
              <Text style={styles.trackTitle}>{item?.title || 'Playlist'}</Text>
              <Text style={styles.trackArtist}>
                {item?.artist || 'Vos morceaux préférés'}
              </Text>
            </View>

            <View style={styles.controls}>
              <TouchableOpacity style={styles.smallBtn}>
                <Ionicons name="shuffle" size={24} color={Colors.text} />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.bigBtn}
                onPress={handlePlayAll}
                activeOpacity={0.9}>
                <Ionicons
                  name="play"
                  size={32}
                  color={Colors.background}
                  style={{marginLeft: 4}}
                />
              </TouchableOpacity>
              <TouchableOpacity style={styles.smallBtn}>
                <Ionicons name="heart-outline" size={24} color={Colors.text} />
              </TouchableOpacity>
            </View>

            <Text style={styles.sectionTitle}>Titres ({tracks.length})</Text>
            {loading && (
              <ActivityIndicator
                color={Colors.primary}
                style={{marginTop: 20}}
              />
            )}
          </>
        }
        data={tracks}
        renderItem={renderTrackItem}
        keyExtractor={t => t.id}
        contentContainerStyle={{paddingBottom: 40}}
        ListEmptyComponent={
          !loading && (
            <Text style={styles.emptyText}>
              Aucun titre dans cette playlist.
            </Text>
          )
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
    paddingTop: 60,
  },
  headerTitle: {color: Colors.text, fontSize: 16, fontWeight: 'bold'},
  artContainer: {padding: 20, alignItems: 'center'},
  art: {width: 240, height: 240, borderRadius: 24},
  trackTitle: {
    color: Colors.text,
    fontSize: 24,
    fontWeight: '800',
    textAlign: 'center',
  },
  trackArtist: {
    color: Colors.muted,
    fontSize: 14,
    marginTop: 4,
    textAlign: 'center',
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 30,
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  smallBtn: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: Colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bigBtn: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },
  sectionTitle: {
    color: Colors.text,
    fontSize: 18,
    fontWeight: 'bold',
    marginHorizontal: 20,
    marginTop: 10,
    marginBottom: 15,
  },
  trackItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  trackThumb: {width: 50, height: 50, borderRadius: 8, marginRight: 15},
  trackTitleSmall: {color: Colors.text, fontSize: 15, fontWeight: '600'},
  trackArtistSmall: {color: Colors.muted, fontSize: 12, marginTop: 2},
  emptyText: {color: Colors.muted, textAlign: 'center', marginTop: 30},
});
