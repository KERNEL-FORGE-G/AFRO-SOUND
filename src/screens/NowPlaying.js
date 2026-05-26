import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Animated, Easing, Alert } from 'react-native';
import Slider from '@react-native-community/slider';
import theme, { Colors } from '../theme';
import Ionicons from 'react-native-vector-icons/Ionicons';

export default function NowPlaying({ navigation }) {
  const [isPlaying, setIsPlaying] = useState(true);
  const [position, setPosition] = useState(0);
  const duration = 213; // Durée totale simulée (3 minutes 33 en secondes)

  // Moteur du lecteur : fait avancer le temps chaque seconde
  useEffect(() => {
    let interval;
    if (isPlaying && position < duration) {
      interval = setInterval(() => {
        setPosition(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, position]);

  // Moteur d'animation : fait tourner la pochette
  const spinValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const spinAnimation = Animated.loop(
      Animated.timing(spinValue, {
        toValue: 1,
        duration: 10000, // Fait un tour complet toutes les 10 secondes
        easing: Easing.linear, // Vitesse de rotation constante
        useNativeDriver: true, // Très important pour la fluidité
      })
    );

    if (isPlaying) {
      spinAnimation.start();
    } else {
      spinAnimation.stop();
    }
    return () => spinAnimation.stop();
  }, [isPlaying]);

  // Convertit la valeur d'animation (0 -> 1) en degrés (0deg -> 360deg)
  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  // Fonction pour formater les secondes en affichage mm:ss
  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <View style={theme.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} activeOpacity={0.8} style={styles.headerIcon}>
          <Ionicons name="chevron-down" size={32} color="#FDFBF7" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Lecture en cours</Text>
        <TouchableOpacity activeOpacity={0.8} style={styles.headerIcon} onPress={() => Alert.alert('Options', 'Menu des options de la piste.')}>
          <Ionicons name="ellipsis-horizontal" size={24} color="#FDFBF7" />
        </TouchableOpacity>
      </View>

      <View style={styles.artContainer}>
        <Animated.Image 
          source={require('../../assets/images/artics page.png')} 
          style={[styles.art, { transform: [{ rotate: spin }] }]} 
        />
      </View>

      <View style={{ paddingHorizontal: 20, marginTop: 18 }}>
        <Text style={styles.trackTitle}>Bad Guy</Text>
        <Text style={styles.trackArtist}>Billie Eilish</Text>
      </View>

      <View style={{ paddingHorizontal: 20, marginTop: 18 }}>
        {/* Barre de progression interactive (Slider) */}
        <Slider
          style={{ width: '100%', height: 40, marginVertical: -10 }}
          minimumValue={0}
          maximumValue={duration}
          value={position}
          onSlidingComplete={(val) => setPosition(Math.floor(val))}
          minimumTrackTintColor="#E67E22"
          maximumTrackTintColor="#4A3B32"
          thumbTintColor="#FDFBF7"
        />
        {/* Affichage des temps */}
        <View style={styles.timeRow}>
          <Text style={styles.timeText}>{formatTime(position)}</Text>
          <Text style={styles.timeText}>{formatTime(duration)}</Text>
        </View>
      </View>

      <View style={styles.controls}>
        <TouchableOpacity onPress={() => Alert.alert('Mode Aléatoire', 'Lecture aléatoire activée/désactivée')}>
          <Ionicons name="shuffle" size={28} color="#C4A484" />
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.smallBtn} onPress={() => Alert.alert('Précédent', 'Retour à la piste précédente')}>
          <Ionicons name="play-skip-back" size={22} color="#FDFBF7" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.bigBtn} onPress={() => setIsPlaying(!isPlaying)}>
          <Ionicons name={isPlaying ? "pause" : "play"} size={44} color="#181411" style={{ marginLeft: isPlaying ? 0 : 4 }} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.smallBtn} onPress={() => Alert.alert('Suivant', 'Passer à la piste suivante')}>
          <Ionicons name="play-skip-forward" size={22} color="#FDFBF7" />
        </TouchableOpacity>
        
        <TouchableOpacity onPress={() => Alert.alert('Répéter', 'Mode répétition activé/désactivé')}>
          <Ionicons name="repeat" size={28} color="#C4A484" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingTop: 40, paddingBottom: 20 },
  headerIcon: { width: 40, alignItems: 'center' },
  headerTitle: { color: '#FDFBF7', fontSize: 12, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 1.5 },
  artContainer: { padding: 24, alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 15 }, shadowOpacity: 0.4, shadowRadius: 20, elevation: 15 },
  art: { width: 320, height: 320, borderRadius: 160 }, // Transformé en cercle parfait
  trackTitle: { color: '#FDFBF7', fontSize: 24, fontWeight: '800' },
  trackArtist: { color: '#C4A484', marginTop: 6 },
  timeRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 8 },
  timeText: { color: '#C4A484', fontSize: 12, fontWeight: '500' },
  controls: { flexDirection: 'row', justifyContent: 'space-around', marginTop: 32, alignItems: 'center' },
  smallBtn: { width: 50, height: 50, borderRadius: 25, backgroundColor: '#2C241E', justifyContent: 'center', alignItems: 'center' },
  bigBtn: { width: 96, height: 96, borderRadius: 48, backgroundColor: '#E67E22', justifyContent: 'center', alignItems: 'center' },
});
