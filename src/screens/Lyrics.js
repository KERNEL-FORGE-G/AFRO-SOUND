import React from 'react';
import {View, Text, StyleSheet, ScrollView, Image, TouchableOpacity} from 'react-native';
import theme, {Colors} from '../theme';
import {usePlayer} from '../context/PlayerContext';
import Ionicons from 'react-native-vector-icons/Ionicons';

export default function Lyrics({navigation}) {
  const {currentTrack} = usePlayer();

  const lyrics = currentTrack?.lyrics || "Désolé, les paroles ne sont pas disponibles pour ce titre.";

  return (
    <View style={theme.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="chevron-down" size={30} color={Colors.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Paroles</Text>
        <View style={{width: 30}} />
      </View>

      <View style={{alignItems: 'center', paddingTop: 10}}>
        <Image
          source={currentTrack?.artwork ? {uri: currentTrack.artwork} : require('../../logo.png')}
          style={{width: 180, height: 180, borderRadius: 16}}
        />
      </View>

      <ScrollView style={{padding: 24}} contentContainerStyle={{paddingBottom: 60}}>
        <Text style={styles.title}>{currentTrack?.title || 'Titre inconnu'}</Text>
        <Text style={styles.artist}>{currentTrack?.artist || 'Artiste inconnu'}</Text>
        <View style={styles.lyricsContainer}>
            <Text style={styles.lyrics}>{lyrics}</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingTop: 50, paddingBottom: 10},
  headerTitle: {color: Colors.text, fontSize: 16, fontWeight: 'bold'},
  title: {color: Colors.text, fontSize: 24, fontWeight: '800', marginBottom: 4, textAlign: 'center'},
  artist: {color: Colors.primary, fontSize: 16, fontWeight: '600', marginBottom: 30, textAlign: 'center'},
  lyricsContainer: {backgroundColor: 'rgba(255,255,255,0.05)', padding: 20, borderRadius: 20},
  lyrics: {color: Colors.text, fontSize: 18, lineHeight: 32, fontWeight: '500'},
});
