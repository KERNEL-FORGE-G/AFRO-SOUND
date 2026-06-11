import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Image,
  FlatList,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {Colors} from '../theme';
import TrackListItem from '../components/TrackListItem';
import {usePlayer} from '../context/PlayerContext';

const sampleCovers = [
  require('../../assets/1.jpg'),
  require('../../assets/2.jpg'),
  require('../../assets/3.jpg'),
  require('../../logo.png'),
];

export default function Library({navigation, route}) {
  const [showMenu, setShowMenu] = useState(false);
  const [myPlaylists, setMyPlaylists] = useState([]);
  const {currentTrack} = usePlayer();

  // Écoute les paramètres de navigation pour ajouter une nouvelle playlist
  useEffect(() => {
    if (route.params?.newPlaylist) {
      const newPlaylistName = route.params.newPlaylist;
      if (!myPlaylists.some(p => p.name === newPlaylistName)) {
        const newPlaylist = {
          id: 'pl_' + Date.now(),
          name: newPlaylistName,
          title: newPlaylistName, // compatible with TrackListItem expectations
          image: sampleCovers[myPlaylists.length % sampleCovers.length],
          artist: 'Playlist • Vous',
        };
        setMyPlaylists(prev => [newPlaylist, ...prev]);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [route.params?.newPlaylist]);

  const renderHeader = () => (
    <View style={styles.header}>
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        <TouchableOpacity
          onPress={() => setShowMenu(!showMenu)}
          activeOpacity={0.8}>
          <View style={styles.profilePic}>
            <Ionicons name="person" size={20} color={Colors.muted} />
          </View>
        </TouchableOpacity>
        <Text style={styles.title}>Bibliothèque</Text>
      </View>
      <View style={styles.headerActions}>
        <TouchableOpacity
          style={styles.actionIcon}
          onPress={() => navigation.navigate('Rechercher')}>
          <Ionicons name="search-outline" size={26} color={Colors.text} />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.actionIcon}
          onPress={() => navigation.navigate('Créer')}>
          <Ionicons name="add-outline" size={30} color={Colors.text} />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {renderHeader()}

      {/* Menu déroulant du profil */}
      {showMenu && (
        <View style={styles.profileMenu}>
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => {
              setShowMenu(false);
              Alert.alert('Notifications', 'Aucune nouvelle notification.');
            }}>
            <Ionicons name="notifications-outline" size={24} color={Colors.text} />
            <Text style={styles.menuText}>Notifications</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => {
              setShowMenu(false);
              Alert.alert('Historique', 'Historique des écoutes.');
            }}>
            <Ionicons name="time-outline" size={24} color={Colors.text} />
            <Text style={styles.menuText}>Historique</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => {
              setShowMenu(false);
              Alert.alert('Paramètres', 'Ouverture des paramètres...');
            }}>
            <Ionicons name="settings-outline" size={24} color={Colors.text} />
            <Text style={styles.menuText}>Paramètres</Text>
          </TouchableOpacity>
        </View>
      )}

      <View style={styles.filterRow}>
        <TouchableOpacity style={[styles.filterPill, styles.activePill]}>
          <Text style={styles.activeFilterText}>Playlists</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.filterPill}>
          <Text style={styles.filterText}>Artistes</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.filterPill}>
          <Text style={styles.filterText}>Albums</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={myPlaylists}
        keyExtractor={item => item.id}
        renderItem={({item}) => (
          <TrackListItem
            item={item}
            onPress={() =>
              navigation.navigate('MusicPage', {
                item: item,
              })
            }
          />
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="library-outline" size={64} color={Colors.surfaceLight} />
            <Text style={styles.emptyText}>
              Votre bibliothèque est vide pour le moment.
            </Text>
            <TouchableOpacity
              style={styles.createBtn}
              onPress={() => navigation.navigate('Créer')}
            >
              <Text style={styles.createBtnText}>Créer une playlist</Text>
            </TouchableOpacity>
          </View>
        }
        contentContainerStyle={{paddingBottom: 120}}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    paddingTop: 60
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
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
  title: {color: Colors.text, fontSize: 24, fontWeight: 'bold'},
  headerActions: {flexDirection: 'row', alignItems: 'center'},
  actionIcon: {marginLeft: 20},
  profileMenu: {
    position: 'absolute',
    top: 110,
    left: 16,
    right: 16,
    zIndex: 10,
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 8,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  menuText: {color: Colors.text, fontSize: 16, marginLeft: 16, fontWeight: '600'},
  filterRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginBottom: 20,
    gap: 10,
  },
  filterPill: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  activePill: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  filterText: {
    color: Colors.text,
    fontSize: 13,
    fontWeight: '600',
  },
  activeFilterText: {
    color: Colors.background,
    fontSize: 13,
    fontWeight: '700',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 80,
    paddingHorizontal: 40,
  },
  emptyText: {
    color: Colors.muted,
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
    lineHeight: 24,
  },
  createBtn: {
    marginTop: 24,
    backgroundColor: Colors.surface,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  createBtnText: {
    color: Colors.primary,
    fontWeight: '700',
    fontSize: 15,
  },
});
