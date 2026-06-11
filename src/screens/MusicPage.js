import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import {Colors} from '../theme';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {usePlayer} from '../context/PlayerContext';
import TrackListItem from '../components/TrackListItem';

export default function MusicPage({route, navigation}) {
  const {item, tracks = []} = route.params || {};
  const {playTrack, currentTrack} = usePlayer();

  const title = item?.title || 'Playlist';
  const artist = item?.artist || 'Artiste inconnu';
  const image = item?.image || item?.cover || item?.cover_url;

  const handlePlayAll = async () => {
    if (tracks.length > 0) {
      await playTrack(tracks[0], tracks);
      navigation.navigate('NowPlaying');
    } else if (item) {
      await playTrack(item, [item]);
      navigation.navigate('NowPlaying');
    }
  };

  const renderHeader = () => (
    <View style={styles.headerContent}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Ionicons name="arrow-back" size={28} color={Colors.text} />
      </TouchableOpacity>

      <View style={styles.artContainer}>
        <Image
          source={typeof image === 'string' ? {uri: image} : image || require('../../assets/2.jpg')}
          style={styles.art}
        />
      </View>

      <View style={styles.infoContainer}>
        <Text style={styles.playlistTitle}>{title}</Text>
        <Text style={styles.playlistArtist}>{artist}</Text>
      </View>

      <View style={styles.controls}>
        <TouchableOpacity style={styles.playBtn} onPress={handlePlayAll}>
          <Ionicons name="play" size={28} color={Colors.background} />
          <Text style={styles.playBtnText}>Lecture</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionBtn}>
          <Ionicons name="shuffle" size={24} color={Colors.text} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionBtn}>
          <Ionicons name="heart-outline" size={24} color={Colors.text} />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={tracks.length > 0 ? tracks : item ? [item] : []}
        keyExtractor={(track, index) => track.id || String(index)}
        ListHeaderComponent={renderHeader}
        renderItem={({item: track}) => (
          <TrackListItem
            item={track}
            isActive={currentTrack?.id === track.id}
            onPress={async () => {
              await playTrack(track, tracks.length > 0 ? tracks : [item]);
              navigation.navigate('NowPlaying');
            }}
          />
        )}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  listContent: {
    paddingBottom: 100,
  },
  headerContent: {
    paddingTop: 40,
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  backButton: {
    alignSelf: 'flex-start',
    padding: 10,
    marginLeft: -10,
  },
  artContainer: {
    marginVertical: 20,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 10},
    shadowOpacity: 0.3,
    shadowRadius: 15,
  },
  art: {
    width: 220,
    height: 220,
    borderRadius: 12,
  },
  infoContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  playlistTitle: {
    color: Colors.text,
    fontSize: 24,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 4,
  },
  playlistArtist: {
    color: Colors.muted,
    fontSize: 16,
    fontWeight: '500',
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  playBtn: {
    backgroundColor: Colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 30,
    gap: 8,
  },
  playBtnText: {
    color: Colors.background,
    fontSize: 16,
    fontWeight: '700',
  },
  actionBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
