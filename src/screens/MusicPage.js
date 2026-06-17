import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import theme, {Colors} from '../theme';
import {usePlayer} from '../context/PlayerContext';
import useAuth from '../hooks/useAuth';
import {
  addTrackToRemotePlaylist,
  fetchPlaylistTracks,
  fetchUserPlaylists,
  removeTrackFromRemotePlaylist,
  sharePlaylist,
} from '../services/playlistService';

const getTrackArtwork = track =>
  track?.cover_url || track?.cover || track?.artwork || '';

export default function MusicPage({route, navigation}) {
  const {user} = useAuth();
  const {item} = route.params || {};
  const {addToQueue, playTrack, toggleShuffle, isShuffle} = usePlayer();
  const [tracks, setTracks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [playlistModalVisible, setPlaylistModalVisible] = useState(false);
  const [userPlaylists, setUserPlaylists] = useState([]);
  const canEdit = Boolean(item?.canEdit);

  const artworkSource = useMemo(() => {
    if (typeof item?.image === 'number') {
      return item.image;
    }
    if (item?.image?.uri) {
      return item.image;
    }
    if (tracks[0] && getTrackArtwork(tracks[0])) {
      return {uri: getTrackArtwork(tracks[0])};
    }
    return require('../../logo.png');
  }, [item?.image, tracks]);

  const fetchTracks = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchPlaylistTracks(item?.id);
      setTracks(data);
    } catch (error) {
      console.error(error.message);
    } finally {
      setLoading(false);
    }
  }, [item?.id]);

  useEffect(() => {
    if (item?.id) {
      fetchTracks();
    } else {
      setLoading(false);
    }
  }, [fetchTracks, item?.id]);

  const handlePlayAll = async () => {
    if (tracks.length === 0) {
      return;
    }
    await playTrack(tracks[0], tracks);
    navigation.navigate('NowPlaying', {
      track: tracks[0],
      playlistId: item?.id,
      ownerId: item?.user_id,
    });
  };

  const handleQueueAll = async () => {
    if (tracks.length === 0) {
      return;
    }

    for (const track of tracks) {
      await addToQueue(track);
    }

    Alert.alert('File prête', `${tracks.length} titres ajoutés à la file.`);
  };

  const openAddToPlaylist = async track => {
    if (!user) {
      Alert.alert(
        'Connexion requise',
        'Connectez-vous pour dupliquer ce titre dans une autre playlist.',
      );
      return;
    }

    const playlists = await fetchUserPlaylists(user.id);
    setUserPlaylists(
      playlists.map(playlist => ({...playlist, selectedTrack: track})),
    );
    setPlaylistModalVisible(true);
  };

  const handleAddToOtherPlaylist = async playlist => {
    try {
      await addTrackToRemotePlaylist(playlist.id, playlist.selectedTrack);
      setPlaylistModalVisible(false);
      Alert.alert('Playlist mise à jour', 'Titre copié dans la playlist.');
    } catch (error) {
      Alert.alert('Erreur', error.message);
    }
  };

  const handleRemoveTrack = async track => {
    try {
      await removeTrackFromRemotePlaylist(item.id, track.id);
      await fetchTracks();
    } catch (error) {
      Alert.alert('Erreur', error.message);
    }
  };

  const renderTrackItem = ({item: track}) => (
    <TouchableOpacity
      style={styles.trackItem}
      onPress={async () => {
        await playTrack(track, tracks);
        navigation.navigate('NowPlaying', {
          track,
          playlistId: item?.id,
          ownerId: item?.user_id,
        });
      }}>
      <Image
        source={
          getTrackArtwork(track)
            ? {uri: getTrackArtwork(track)}
            : require('../../logo.png')
        }
        style={styles.trackThumb}
      />
      <View style={styles.trackMeta}>
        <Text style={styles.trackTitleSmall} numberOfLines={1}>
          {track.title}
        </Text>
        <Text style={styles.trackArtistSmall} numberOfLines={1}>
          {track.artist}
        </Text>
      </View>
      <View style={styles.trackActions}>
        <TouchableOpacity
          style={styles.trackActionButton}
          onPress={() => addToQueue(track)}>
          <Ionicons
            name="add-circle-outline"
            size={20}
            color={Colors.primary}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.trackActionButton}
          onPress={() => openAddToPlaylist(track)}>
          <Ionicons name="albums-outline" size={20} color={Colors.primary} />
        </TouchableOpacity>
        {canEdit && (
          <TouchableOpacity
            style={styles.trackActionButton}
            onPress={() => handleRemoveTrack(track)}>
            <Ionicons name="trash-outline" size={20} color={Colors.primary} />
          </TouchableOpacity>
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={theme.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={Colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Playlist</Text>
        <TouchableOpacity onPress={() => sharePlaylist(item)}>
          <Ionicons
            name="share-social-outline"
            size={22}
            color={Colors.primary}
          />
        </TouchableOpacity>
      </View>

      <FlatList
        ListHeaderComponent={
          <>
            <View style={styles.artContainer}>
              <Image source={artworkSource} style={styles.art} />
            </View>

            <View style={styles.infoBlock}>
              <Text style={styles.trackTitle}>{item?.title || 'Playlist'}</Text>
              <Text style={styles.trackArtist}>
                {item?.artist || 'Vos morceaux préférés'}
              </Text>
              <Text style={styles.supportingText}>
                {tracks.length} titre{tracks.length > 1 ? 's' : ''} •{' '}
                {item?.is_public ? 'Partagée' : 'Privée'}
              </Text>
            </View>

            <View style={styles.controls}>
              <TouchableOpacity
                style={[styles.smallBtn, isShuffle && styles.smallBtnActive]}
                onPress={toggleShuffle}>
                <Ionicons
                  name="shuffle"
                  size={24}
                  color={isShuffle ? Colors.background : Colors.text}
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.bigBtn}
                onPress={handlePlayAll}
                activeOpacity={0.9}>
                <Ionicons
                  name="play"
                  size={32}
                  color={Colors.background}
                  style={styles.playIcon}
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.smallBtn}
                onPress={handleQueueAll}>
                <Ionicons name="list-outline" size={24} color={Colors.text} />
              </TouchableOpacity>
            </View>

            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Titres ({tracks.length})</Text>
              {canEdit && (
                <Text style={styles.sectionMeta}>Suppression activée</Text>
              )}
            </View>
            {loading && (
              <ActivityIndicator color={Colors.primary} style={styles.loader} />
            )}
          </>
        }
        data={tracks}
        renderItem={renderTrackItem}
        keyExtractor={(track, index) => `${track.id}-${index}`}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          !loading && (
            <Text style={styles.emptyText}>
              Aucun titre dans cette playlist.
            </Text>
          )
        }
      />

      <Modal
        visible={playlistModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setPlaylistModalVisible(false)}>
        <View style={styles.modalBackdrop}>
          <View style={styles.modalSheet}>
            <Text style={styles.modalTitle}>Ajouter à une autre playlist</Text>
            {userPlaylists.length === 0 ? (
              <Text style={styles.modalEmpty}>Aucune playlist disponible.</Text>
            ) : (
              userPlaylists.map(playlist => (
                <TouchableOpacity
                  key={playlist.id}
                  style={styles.modalItem}
                  onPress={() => handleAddToOtherPlaylist(playlist)}>
                  <View>
                    <Text style={styles.modalItemTitle}>{playlist.name}</Text>
                    <Text style={styles.modalItemMeta}>
                      {playlist.is_public ? 'Publique' : 'Privée'}
                    </Text>
                  </View>
                  <Ionicons
                    name="add-circle-outline"
                    size={22}
                    color={Colors.primary}
                  />
                </TouchableOpacity>
              ))
            )}
            <TouchableOpacity
              style={styles.modalClose}
              onPress={() => setPlaylistModalVisible(false)}>
              <Text style={styles.modalCloseText}>Fermer</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 60,
  },
  headerTitle: {color: Colors.text, fontSize: 16, fontWeight: 'bold'},
  artContainer: {padding: 20, alignItems: 'center'},
  art: {width: 240, height: 240, borderRadius: 24},
  infoBlock: {paddingHorizontal: 20, alignItems: 'center'},
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
  supportingText: {
    color: Colors.textSoft,
    fontSize: 12,
    marginTop: 8,
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
  smallBtnActive: {
    backgroundColor: Colors.primary,
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
  playIcon: {
    marginLeft: 4,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 20,
    marginTop: 10,
    marginBottom: 15,
  },
  sectionTitle: {
    color: Colors.text,
    fontSize: 18,
    fontWeight: 'bold',
  },
  sectionMeta: {
    color: Colors.primary,
    fontWeight: '700',
    fontSize: 12,
  },
  trackItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  trackThumb: {width: 50, height: 50, borderRadius: 8, marginRight: 15},
  trackMeta: {flex: 1},
  trackTitleSmall: {color: Colors.text, fontSize: 15, fontWeight: '600'},
  trackArtistSmall: {color: Colors.muted, fontSize: 12, marginTop: 2},
  trackActions: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 12,
  },
  trackActionButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 6,
    backgroundColor: Colors.surface,
  },
  emptyText: {color: Colors.muted, textAlign: 'center', marginTop: 30},
  loader: {
    marginTop: 20,
  },
  listContent: {
    paddingBottom: 40,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.55)',
    justifyContent: 'flex-end',
  },
  modalSheet: {
    backgroundColor: Colors.card,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 28,
  },
  modalTitle: {
    color: Colors.text,
    fontSize: 20,
    fontWeight: '800',
    marginBottom: 16,
  },
  modalEmpty: {
    color: Colors.textSoft,
    lineHeight: 22,
    marginBottom: 18,
  },
  modalItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  modalItemTitle: {
    color: Colors.text,
    fontSize: 15,
    fontWeight: '700',
  },
  modalItemMeta: {
    color: Colors.textSoft,
    fontSize: 12,
    marginTop: 5,
  },
  modalClose: {
    marginTop: 18,
    backgroundColor: Colors.primary,
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: 'center',
  },
  modalCloseText: {
    color: Colors.background,
    fontWeight: '800',
  },
});
