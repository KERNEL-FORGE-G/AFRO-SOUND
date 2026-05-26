import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, ActivityIndicator, Alert } from 'react-native';
import theme, { Colors } from '../theme';
import Ionicons from 'react-native-vector-icons/Ionicons';

const playlists = [
  { title: 'Hits du moment', artist: 'Playlist • Spotify', image: require('../../assets/images/artics page.png') },
  { title: 'Scorpion', artist: 'Album • Drake', image: require('../../assets/images/artics page-1.png') },
  { title: 'Découverte', artist: 'Mix • Pour vous', image: require('../../assets/images/artics page.png') },
];

const recents = [
  { title: 'Happier Than Ever', image: require('../../assets/images/home page.png') },
  { title: 'Scorpion', image: require('../../assets/images/artics page-1.png') },
  { title: 'Mix Pop', image: require('../../assets/images/artics page.png') },
  { title: 'Billie Eilish', image: require('../../assets/images/home page.png') },
];

export default function Home({ navigation }) {
  // 1. Déclaration des variables d'état (vides au départ)
  const [dynamicRecents, setDynamicRecents] = useState([]);
  const [dynamicPlaylists, setDynamicPlaylists] = useState([]);
  const [isLoading, setIsLoading] = useState(true); // Gère l'affichage de l'icône de chargement

  // 2. Simulation de récupération de données depuis internet
  useEffect(() => {
    // Le setTimeout imite le temps d'attente d'un serveur (1,5 seconde)
    setTimeout(() => {
      // Plus tard, vous remplacerez ceci par un vrai appel API : await fetch('votre-url.com/api/musiques')
      setDynamicRecents(recents); 
      setDynamicPlaylists(playlists);
      setIsLoading(false); // Le chargement est terminé
    }, 1500);
  }, []);

  return (
    <View style={[theme.container, styles.mainContainer]}>
      <ScrollView contentContainerStyle={{ paddingBottom: 140 }}>
        
        {/* Header : Profil et Filtres */}
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <TouchableOpacity onPress={() => navigation.navigate('Bibliothèque')} activeOpacity={0.8}>
                <View style={styles.profilePic} />
              </TouchableOpacity>
              <Text style={styles.greeting}>Bonjour</Text>
            </View>
          </View>
          <View style={styles.filtersRow}>
            <TouchableOpacity style={styles.filterPill} onPress={() => Alert.alert('Filtre', 'Affichage de la musique.')}><Text style={styles.filterText}>Musique</Text></TouchableOpacity>
            <TouchableOpacity style={styles.filterPill} onPress={() => Alert.alert('Filtre', 'Affichage des podcasts.')}><Text style={styles.filterText}>Podcasts et émissions</Text></TouchableOpacity>
          </View>
        </View>

        {/* Grille des éléments récents (Style Spotify) */}
        <View style={styles.recentGrid}>
          {isLoading ? (
            // Si c'est en train de charger, on affiche une roue qui tourne
            <ActivityIndicator size="small" color="#E67E22" style={{ marginVertical: 20, marginLeft: '45%' }} />
          ) : (
            // Sinon, on affiche nos données dynamiques
            dynamicRecents.map((item, index) => (
              <TouchableOpacity key={index} style={styles.recentCard} activeOpacity={0.8} onPress={() => navigation.navigate('MusicPage')}>
                <Image source={item.image} style={styles.recentImage} />
                <Text style={styles.recentTitle} numberOfLines={2}>{item.title}</Text>
              </TouchableOpacity>
            ))
          )}
        </View>

        {/* Section Recommandations */}
        <Text style={styles.sectionTitle}>Conçu pour vous</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ paddingLeft: 16 }}>
          {isLoading ? (
            <ActivityIndicator size="small" color="#E67E22" style={{ margin: 20 }} />
          ) : (
            dynamicPlaylists.map((p, i) => (
              <TouchableOpacity key={i} style={styles.card} activeOpacity={0.9} onPress={() => navigation.navigate('MusicPage', { item: p })}>
                <Image source={p.image} style={styles.cardImage} />
                <Text style={styles.cardTitle} numberOfLines={1}>{p.title}</Text>
                <Text style={styles.cardArtist}>{p.artist}</Text>
              </TouchableOpacity>
            ))
          )}
        </ScrollView>

        {/* Section Récemment écouté */}
        <Text style={[styles.sectionTitle, { marginTop: 32 }]}>Récemment écouté</Text>
        <View style={{ paddingHorizontal: 16, marginTop: 12 }}>
          <TouchableOpacity style={styles.trackRow} activeOpacity={0.8} onPress={() => navigation.navigate('NowPlaying')}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Image source={require('../../assets/images/home page.png')} style={styles.trackCover} />
              <View style={{ marginLeft: 12 }}>
                <Text style={styles.trackTitle}>Happier Than Ever</Text>
                <Text style={styles.trackArtist}>Billie Eilish</Text>
              </View>
            </View>
            <View style={styles.playIconPlaceholder} />
          </TouchableOpacity>
        </View>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: { flex: 1, backgroundColor: '#181411' },
  header: { paddingHorizontal: 16, paddingTop: 40, paddingBottom: 16 },
  headerTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 },
  profilePic: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#2C241E', marginRight: 12 },
  greeting: { color: '#FDFBF7', fontSize: 24, fontWeight: 'bold', letterSpacing: -0.5 },
  filtersRow: { flexDirection: 'row' },
  filterPill: { backgroundColor: '#2C241E', paddingVertical: 8, paddingHorizontal: 16, borderRadius: 20, marginRight: 8 },
  filterText: { color: '#FDFBF7', fontSize: 13, fontWeight: '500' },
  
  recentGrid: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 12, justifyContent: 'space-between' },
  recentCard: { width: '48%', backgroundColor: '#2C241E', flexDirection: 'row', alignItems: 'center', borderRadius: 4, marginBottom: 8, overflow: 'hidden' },
  recentImage: { width: 56, height: 56 },
  recentTitle: { flex: 1, color: '#FDFBF7', fontSize: 13, fontWeight: '600', paddingHorizontal: 8 },
  
  sectionTitle: { color: '#FDFBF7', fontSize: 22, fontWeight: 'bold', marginLeft: 16, marginTop: 24, marginBottom: 16, letterSpacing: -0.5 },
  card: { width: 140, marginRight: 16 },
  cardImage: { width: 150, height: 150, borderRadius: 20 },
  cardTitle: { color: '#FDFBF7', marginTop: 12, fontSize: 14, fontWeight: '600' },
  cardArtist: { color: '#C4A484', marginTop: 4, fontSize: 13 },
  
  trackRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 8 },
  trackCover: { width: 56, height: 56, borderRadius: 4, backgroundColor: '#2C241E' },
  trackTitle: { color: '#FDFBF7', fontSize: 16, fontWeight: '600' },
  trackArtist: { color: '#C4A484', fontSize: 14, marginTop: 4 },
  playIconPlaceholder: { width: 24, height: 24, borderRadius: 12, borderWidth: 1, borderColor: '#C4A484' },
});
