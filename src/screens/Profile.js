import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {Colors} from '../theme';
import useAuth from '../hooks/useAuth';
import {supabase} from '../supabaseClient';

export default function Profile({navigation}) {
  const {user, handleLogout} = useAuth();
  const [profileData, setProfileData] = useState(null);
  const [stats, setStats] = useState({favorites: 0, playlists: 0});
  const [recentPlays, setRecentPlays] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchProfile();
    } else {
        setLoading(false);
    }
  }, [user]);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      // Fetch profile info
      const {data: profile, error: pError} = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (pError) throw pError;
      setProfileData(profile);

      // Fetch stats
      const {count: favCount} = await supabase
        .from('favorites')
        .select('*', {count: 'exact', head: true})
        .eq('user_id', user.id);

      const {count: playCount} = await supabase
        .from('playlists')
        .select('*', {count: 'exact', head: true})
        .eq('user_id', user.id);

      setStats({favorites: favCount || 0, playlists: playCount || 0});

      // Fetch recent plays
      const {data: history} = await supabase
        .from('play_history')
        .select('*, tracks(*)')
        .eq('user_id', user.id)
        .order('played_at', {ascending: false})
        .limit(5);

      setRecentPlays(history || []);

    } catch (e) {
      console.error(e.message);
    } finally {
      setLoading(false);
    }
  };

  const onLogout = () => {
    Alert.alert('Déconnexion', 'Voulez-vous vraiment vous déconnecter ?', [
        {text: 'Annuler', style: 'cancel'},
        {text: 'Oui', onPress: () => {
            handleLogout();
            navigation.navigate('GetStarted');
        }}
    ]);
  };

  const handleUpdateUsername = () => {
    Alert.prompt(
        'Modifier le pseudo',
        'Entrez votre nouveau pseudo',
        [
            {text: 'Annuler', style: 'cancel'},
            {text: 'Valider', onPress: async (name) => {
                if (!name.trim()) return;
                try {
                    const {error} = await supabase
                        .from('profiles')
                        .update({username: name.trim()})
                        .eq('id', user.id);
                    if (error) throw error;
                    setProfileData({...profileData, username: name.trim()});
                } catch (e) {
                    Alert.alert('Erreur', e.message);
                }
            }}
        ],
        'plain-text',
        profileData?.username
    );
  };

  if (loading) return (
    <View style={styles.centered}><ActivityIndicator size="large" color={Colors.primary} /></View>
  );

  if (!user) return (
    <View style={styles.centered}>
        <Text style={styles.text}>Connectez-vous pour voir votre profil</Text>
        <TouchableOpacity style={styles.btn} onPress={() => navigation.navigate('Login')}>
            <Text style={styles.btnText}>Se connecter</Text>
        </TouchableOpacity>
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color={Colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Profil</Text>
        <TouchableOpacity onPress={onLogout}>
            <Ionicons name="log-out-outline" size={24} color={Colors.primary} />
        </TouchableOpacity>
      </View>

      <View style={styles.profileSection}>
        <Image
            source={profileData?.avatar_url ? {uri: profileData.avatar_url} : require('../../logo.png')}
            style={styles.avatar}
        />
        <Text style={styles.username}>{profileData?.username || 'Utilisateur'}</Text>
        <Text style={styles.email}>{user.email}</Text>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statBox}>
            <Text style={styles.statValue}>{stats.favorites}</Text>
            <Text style={styles.statLabel}>Favoris</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.statBox}>
            <Text style={styles.statValue}>{stats.playlists}</Text>
            <Text style={styles.statLabel}>Playlists</Text>
        </View>
      </View>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Écoutés récemment</Text>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.recentSection}>
        {recentPlays.length > 0 ? recentPlays.map((ph, idx) => (
            <TouchableOpacity key={idx} style={styles.recentItemCard}>
                <Image
                    source={ph.tracks?.cover_url ? {uri: ph.tracks.cover_url} : require('../../logo.png')}
                    style={styles.recentItemImage}
                />
                <Text style={styles.recentItemTitle} numberOfLines={1}>{ph.tracks?.title}</Text>
            </TouchableOpacity>
        )) : (
            <Text style={styles.emptyText}>Aucun historique</Text>
        )}
      </ScrollView>

      <View style={styles.menuSection}>
        <TouchableOpacity style={styles.menuItem} onPress={handleUpdateUsername}>
            <Ionicons name="person-outline" size={22} color={Colors.primary} />
            <Text style={styles.menuText}>Modifier le pseudo</Text>
            <Ionicons name="chevron-forward" size={18} color={Colors.muted} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem}>
            <Ionicons name="notifications-outline" size={22} color={Colors.primary} />
            <Text style={styles.menuText}>Notifications</Text>
            <Ionicons name="chevron-forward" size={18} color={Colors.muted} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('GroupPlaylist')}>
            <Ionicons name="people-outline" size={22} color={Colors.primary} />
            <Text style={styles.menuText}>Playlists de groupe</Text>
            <Ionicons name="chevron-forward" size={18} color={Colors.muted} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem}>
            <Ionicons name="settings-outline" size={22} color={Colors.primary} />
            <Text style={styles.menuText}>Paramètres</Text>
            <Ionicons name="chevron-forward" size={18} color={Colors.muted} />
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.logoutBtn} onPress={onLogout}>
        <Text style={styles.logoutText}>Se déconnecter</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: Colors.background},
  centered: {flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.background},
  header: {flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, paddingTop: 60},
  headerTitle: {color: Colors.text, fontSize: 18, fontWeight: 'bold'},
  profileSection: {alignItems: 'center', marginVertical: 30},
  avatar: {width: 100, height: 100, borderRadius: 50, marginBottom: 15, borderWidth: 2, borderColor: Colors.primary},
  username: {color: Colors.text, fontSize: 22, fontWeight: 'bold'},
  email: {color: Colors.muted, fontSize: 14, marginTop: 5},
  statsContainer: {flexDirection: 'row', backgroundColor: Colors.surface, marginHorizontal: 20, borderRadius: 15, padding: 20, alignItems: 'center', marginBottom: 30},
  statBox: {flex: 1, alignItems: 'center'},
  statValue: {color: Colors.text, fontSize: 20, fontWeight: 'bold'},
  statLabel: {color: Colors.muted, fontSize: 12, marginTop: 4},
  divider: {width: 1, height: 30, backgroundColor: Colors.border},
  sectionHeader: {paddingHorizontal: 20, marginBottom: 15},
  sectionTitle: {color: Colors.text, fontSize: 18, fontWeight: 'bold'},
  recentSection: {paddingLeft: 20, marginBottom: 30},
  recentItemCard: {marginRight: 15, width: 100},
  recentItemImage: {width: 100, height: 100, borderRadius: 12, marginBottom: 8},
  recentItemTitle: {color: Colors.text, fontSize: 12, textAlign: 'center'},
  emptyText: {color: Colors.muted, fontSize: 14, paddingVertical: 10},
  menuSection: {marginHorizontal: 20},
  menuItem: {flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.surface, padding: 15, borderRadius: 12, marginBottom: 10},
  menuText: {flex: 1, color: Colors.text, fontSize: 16, marginLeft: 15},
  logoutBtn: {margin: 40, alignItems: 'center'},
  logoutText: {color: '#ef4444', fontWeight: 'bold', fontSize: 16},
  btn: {backgroundColor: Colors.primary, paddingHorizontal: 30, paddingVertical: 12, borderRadius: 25, marginTop: 20},
  btnText: {color: Colors.background, fontWeight: 'bold'},
  text: {color: Colors.text}
});
