import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
} from 'react-native';
import {Colors} from '../theme';

export default function ChooseMode({navigation}) {
  return (
    <ImageBackground source={require('../../assets/2.jpg')} style={styles.bg}>
      <View style={styles.overlay}>
        <View style={styles.container}>
          <Text style={styles.title}>AFRO SOUND</Text>
          <Text style={styles.subtitle}>
            Choisis ton mode
          </Text>

          <TouchableOpacity
            style={styles.bigButton}
            onPress={() => navigation.replace('Home')}
            activeOpacity={0.9}>
            <Text style={styles.buttonText}>Découvrir</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.bigButton, styles.alt]}
            onPress={() => navigation.replace('Login')}
            activeOpacity={0.9}>
            <Text style={[styles.buttonText, {color: Colors.text}]}>
              Se connecter / S'inscrire
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  bg: {flex: 1, resizeMode: 'cover'},
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
  },
  container: {
    paddingHorizontal: 32,
    alignItems: 'center',
  },
  title: {
    color: Colors.text,
    fontSize: 32,
    fontWeight: '900',
    marginBottom: 8,
    letterSpacing: -1,
  },
  subtitle: {
    color: Colors.muted,
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 48,
  },
  bigButton: {
    backgroundColor: Colors.primary,
    width: '100%',
    paddingVertical: 18,
    borderRadius: 30,
    alignItems: 'center',
    marginBottom: 16,
    elevation: 5,
    shadowColor: Colors.primary,
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  alt: {
    backgroundColor: Colors.surface,
    borderColor: Colors.border,
    borderWidth: 1,
    shadowColor: '#000',
  },
  buttonText: {color: Colors.background, fontSize: 16, fontWeight: '800'},
});
