import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Image,
  ScrollView,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {Colors} from '../theme';

const sampleColors = [
  '#C17A45', // Ocre
  '#A0522D', // Terracotta
  '#D4AF37', // Or
  '#4A3B30', // Brun
];

export default function Library({navigation, route}) {
  const [showMenu, setShowMenu] = useState(false);
  const [myPlaylists, setMyPlaylists] = useState([]);
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    if (route.params?.newPlaylist) {
      const newPlaylistName = route.params.newPlaylist;
      if (!myPlaylists.some(p => p.name === newPlaylistName)) {
        const newPlaylist = {
          name: newPlaylistName,
          color: sampleColors[myPlaylists.length % sampleColors.length],
        };
        setMyPlaylists(prev => [newPlaylist, ...prev]);
      }
    }
  }, [route.params?.newPlaylist, myPlaylists]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <TouchableOpacity
            onPress={() => setShowMenu(!showMenu)}
            activeOpacity={0.8}>
            <View style={styles.profilePic} />
          </TouchableOpacity>
          <Text style={styles.title}>Bibliothèque</Text>
        </View>
        <View style={styles.headerActions}>
          <TouchableOpacity
            style={styles.actionIcon}
            onPress={() => navigation.navigate('Search')}>
            <Ionicons name="search-outline" size={26} color={Colors.text} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionIcon}
            onPress={() => navigation.navigate('CreatePlaylist')}>
            <Ionicons name="add-outline" size={30} color={Colors.text} />
          </TouchableOpacity>
        </View>
      </View>

      {showMenu && (
        <View style={styles.profileMenu}>
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => {
              setShowMenu(false);
              Alert.alert('Options', 'Paramètres à venir');
            }}>
            <Ionicons name="settings-outline" size={24} color={Colors.text} />
            <Text style={styles.menuText}>Paramètres</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => {
              setShowMenu(false);
              Alert.alert('Déconnexion');
            }}>
            <Ionicons name="log-out-outline" size={24} color={Colors.primary} />
            <Text style={styles.menuText}>Déconnexion</Text>
          </TouchableOpacity>
        </View>
      )}

      <Text style={styles.sectionTitle}>Favoris</Text>
      <ScrollView horizontal style={styles.favContainer}>
        {favorites.map((fav, index) => (
          <TouchableOpacity key={index} style={styles.favItem}>
            <View style={styles.favArt} />
            <Text style={styles.favTitle}>{fav.title}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <Text style={styles.sectionTitle}>Playlists</Text>
      {myPlaylists.length === 0 ? (
        <Text style={styles.emptyText}>Votre bibliothèque est vide.</Text>
      ) : (
        <ScrollView
          style={styles.playlistContainer}
          showsVerticalScrollIndicator={false}>
          {myPlaylists.map((playlist, index) => (
            <TouchableOpacity
              key={index}
              style={styles.playlistCard}
              activeOpacity={0.8}
              onPress={() =>
                navigation.navigate('MusicPage', {
                  item: {
                    title: playlist.name,
                    artist: 'Playlist • Vous',
                    color: playlist.color,
                  },
                })
              }>
              <View
                style={[
                  styles.playlistCover,
                  {backgroundColor: playlist.color},
                ]}
              />
              <View style={styles.playlistInfo}>
                <Text style={styles.playlistTitle}>{playlist.name}</Text>
                <Text style={styles.playlistSubtitle}>Playlist • Vous</Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    padding: 16,
    paddingTop: 60,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  profileMenu: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 8,
    marginBottom: 24,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  menuText: {
    color: Colors.text,
    fontSize: 16,
    marginLeft: 16,
    fontWeight: '600',
  },
  sectionTitle: {
    color: Colors.text,
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  favContainer: {flexGrow: 0, marginBottom: 20},
  favItem: {width: 100, marginRight: 16, alignItems: 'center'},
  favArt: {
    width: 100,
    height: 100,
    borderRadius: 8,
    backgroundColor: Colors.surface,
  },
  favTitle: {color: Colors.text, fontSize: 12, marginTop: 8},
  profilePic: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.surfaceLight,
    marginRight: 12,
  },
  title: {color: Colors.text, fontSize: 24, fontWeight: 'bold'},
  headerActions: {flexDirection: 'row', alignItems: 'center'},
  actionIcon: {marginLeft: 20},
  emptyText: {
    color: Colors.muted,
    fontSize: 16,
    textAlign: 'center',
    marginTop: 40,
  },
  playlistContainer: {flex: 1, marginTop: 10},
  playlistCard: {flexDirection: 'row', alignItems: 'center', marginBottom: 16},
  playlistCover: {
    width: 64,
    height: 64,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  playlistInfo: {marginLeft: 16, flex: 1},
  playlistTitle: {
    color: Colors.text,
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  playlistSubtitle: {color: Colors.muted, fontSize: 14},
});
