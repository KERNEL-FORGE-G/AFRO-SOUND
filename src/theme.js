import {StyleSheet} from 'react-native';

export const Colors = {
  // Palette terreuse
  background: '#2F2620', // Brun profond (terre)
  surface: '#4A3B30', // Brun moyen
  surfaceLight: '#6B5A4D', // Brun clair

  // Couleurs chaudes
  primary: '#C17A45', // Ocre/Argile
  primaryDark: '#A0522D', // Terracotta
  accent: '#D4AF37', // Or (pour les détails)

  text: '#F4E4BC', // Sable (plus doux pour les yeux)
  muted: '#A89F95',
  card: '#4A3B30',
  border: '#6B5A4D',
};

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
});
