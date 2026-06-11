import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Image,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {supabase} from '../supabaseClient';
import useAuth from '../hooks/useAuth';
import {Colors} from '../theme';

const sampleCovers = [
  require('../../assets/1.jpg'),
  require('../../assets/2.jpg'),
  require('../../assets/3.jpg'),
  require('../../logo.png'),
];

export default function Library({navigation, route}) {
  const {user} = useAuth();
  const [showMenu, setShowMenu] = useState(false);
  const [myPlaylists, setMyPlaylists] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchPlaylists();
    } else {
      setLoading(false);
    }
  }, [user, route.params?.refresh]);

  const fetchPlaylists = async () => {
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
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <TouchableOpacity
            onPress={() => navigation.navigate('Profile')}
            activeOpacity={0.8}>
            <View style={styles.profilePic} />
          </TouchableOpacity>
          <Text style={styles.title}>Bibliothèque</Text>
        </View>
        <View style={styles.headerActions}>
          <TouchableOpacity
            style={styles.actionIcon}
            onPress={() => navigation.navigate('Rechercher')}>
            <Ionicons name="search-outline" size={26} color="#FDFBF7" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionIcon}
            onPress={() => navigation.navigate('Créer')}>
            <Ionicons name="add-outline" size={30} color="#FDFBF7" />
          </TouchableOpacity>
        </View>
      </View>
      {/* Menu déroulant du profil */}
      {showMenu && (
        <View style={styles.profileMenu}>
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => {
              setShowMenu(false);
              Alert.alert('Notifications', 'Aucune nouvelle notification.');
            }}>
            <Ionicons name="notifications-outline" size={24} color="#FDFBF7" />
            <Text style={styles.menuText}>Notifications</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => {
              setShowMenu(false);
              Alert.alert('Historique', 'Historique des écoutes.');
            }}>
            <Ionicons name="time-outline" size={24} color="#FDFBF7" />
            <Text style={styles.menuText}>Historique</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => {
              setShowMenu(false);
              Alert.alert('Paramètres', 'Ouverture des paramètres...');
            }}>
            <Ionicons name="settings-outline" size={24} color="#FDFBF7" />
            <Text style={styles.menuText}>Paramètres</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Condition : Si la liste est vide, on affiche le texte, sinon on affiche les playlists */}
      {loading ? (
        <ActivityIndicator
          size="large"
          color={Colors.primary}
          style={{marginTop: 40}}
        />
      ) : !user ? (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <Text style={styles.emptyText}>
            Connectez-vous pour voir votre bibliothèque.
          </Text>
          <TouchableOpacity
            style={styles.loginBtn}
            onPress={() => navigation.navigate('Login')}>
            <Text style={styles.loginBtnText}>Se connecter</Text>
          </TouchableOpacity>
        </View>
      ) : myPlaylists.length === 0 ? (
        <Text style={styles.emptyText}>
          Votre bibliothèque est vide pour le moment.
        </Text>
      ) : (
        <ScrollView
          style={styles.playlistContainer}
          showsVerticalScrollIndicator={false}>
          {myPlaylists.map((playlist, index) => (
            <TouchableOpacity
              key={playlist.id || index}
              style={styles.playlistCard}
              activeOpacity={0.8}
              onPress={() =>
                navigation.navigate('MusicPage', {
                  item: {
                    title: playlist.name,
                    artist: 'Playlist • Vous',
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
                  {playlist.is_public ? 'Playlist publique' : 'Playlist privée'}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#181411', padding: 16, paddingTop: 60},
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  profilePic: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#2C241E',
    marginRight: 12,
  },
  title: {color: '#FDFBF7', fontSize: 24, fontWeight: 'bold'},
  headerActions: {flexDirection: 'row', alignItems: 'center'},
  actionIcon: {marginLeft: 20},
  profileMenu: {
    backgroundColor: '#2C241E',
    borderRadius: 12,
    padding: 8,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  menuText: {color: '#FDFBF7', fontSize: 16, marginLeft: 16, fontWeight: '600'},
  emptyText: {
    color: '#C4A484',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 40,
  },
  playlistContainer: {flex: 1, marginTop: 10},
  playlistCard: {flexDirection: 'row', alignItems: 'center', marginBottom: 16},
  playlistCover: {
    width: 64,
    height: 64,
    backgroundColor: '#2C241E',
    borderRadius: 8,
  },
  playlistSubtitle: {color: '#C4A484', fontSize: 14},
  loginBtn: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
    marginTop: 20,
  },
  loginBtnText: {
    color: Colors.background,
    fontWeight: 'bold',
    fontSize: 16,
  },
});
