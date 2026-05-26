import React from 'react';
import { View, Text, ImageBackground, StyleSheet, TouchableOpacity } from 'react-native';
import theme, { Colors } from '../theme';

export default function GetStarted({ navigation }) {
  return (
    <View style={styles.container}>
      <ImageBackground source={require('../../assets/images/get started.png')} style={styles.bg} resizeMode="cover">
        <View style={styles.overlay}>
          <View style={styles.contentContainer}>
            <Text style={styles.title}>La musique,{'\n'}réinventée.</Text>
            <Text style={styles.subtitle}>Des millions de titres. Sans carte de crédit.</Text>
            
            <TouchableOpacity style={styles.button} activeOpacity={0.8} onPress={() => navigation.replace('ChooseMode')}>
              <Text style={styles.buttonText}>Commencer</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#181411' },
  bg: { flex: 1 },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Assombrit l'image pour la lisibilité
    justifyContent: 'flex-end',
  },
  contentContainer: { 
    paddingHorizontal: 32, 
    paddingBottom: 60 
  },
  title: { 
    color: '#FDFBF7', 
    fontSize: 42, 
    fontWeight: '800', 
    marginBottom: 12,
    letterSpacing: -1,
  },
  subtitle: {
    color: '#C4A484',
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 40,
  },
  button: { 
    backgroundColor: '#E67E22', 
    height: 60, 
    borderRadius: 30, // Bouton en forme de pilule
    alignItems: 'center', 
    justifyContent: 'center',
    shadowColor: '#E67E22',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  buttonText: { color: '#181411', fontSize: 18, fontWeight: 'bold' }, 
});
