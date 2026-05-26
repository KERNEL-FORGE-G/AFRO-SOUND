import React from 'react';
import { View, Text, StyleSheet, ImageBackground, TouchableOpacity } from 'react-native';
import theme, { Colors } from '../theme';

export default function ChooseMode({ navigation }) {
  return (
    <ImageBackground source={require('../../assets/images/choose mode.png')} style={styles.bg}>
      <View style={styles.container}>
        <Text style={styles.title}>Choisis ton mode</Text>

        <TouchableOpacity style={styles.bigButton} onPress={() => navigation.replace('Home')} activeOpacity={0.9}>
          <Text style={styles.buttonText}>Découvrir</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.bigButton, styles.alt]} onPress={() => navigation.replace('Register')} activeOpacity={0.9}>
          <Text style={[styles.buttonText, { color: '#FDFBF7' }]}>Se connecter / S'inscrire</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  bg: { flex: 1, resizeMode: 'cover' },
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 24 },
  title: { color: '#FDFBF7', fontSize: 28, fontWeight: '800', marginBottom: 24 },
  bigButton: { backgroundColor: '#E67E22', width: '100%', paddingVertical: 18, borderRadius: 14, alignItems: 'center', marginBottom: 12 },
  alt: { backgroundColor: '#2C241E' },
  buttonText: { color: '#181411', fontSize: 16, fontWeight: '700' },
});
