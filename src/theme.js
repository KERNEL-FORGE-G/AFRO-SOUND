import {StyleSheet} from 'react-native';

export const Colors = {
  background: '#090B10',
  backgroundElevated: '#11151F',
  backgroundSoft: '#171C29',
  surface: '#151B27',
  surfaceLight: '#1D2635',
  surfaceAccent: '#231A14',
  card: '#141A25',
  overlay: 'rgba(7, 8, 14, 0.72)',
  primary: '#E7A53B',
  primaryDark: '#B9731F',
  accent: '#FF7A18',
  accentDark: '#D85A00',
  success: '#2BCB82',
  warning: '#F6C453',
  danger: '#FF6B6B',
  text: '#F7F4EE',
  textSoft: '#D8CDB9',
  muted: '#9E927E',
  border: '#283244',
  borderStrong: '#394760',
  shadow: '#000000',
};

export const Spacing = {
  xs: 6,
  sm: 10,
  md: 16,
  lg: 20,
  xl: 28,
  xxl: 36,
};

export const Radius = {
  sm: 10,
  md: 16,
  lg: 22,
  xl: 28,
  pill: 999,
};

export const Typography = {
  hero: 30,
  title: 24,
  section: 20,
  body: 15,
  caption: 12,
};

export const Shadows = {
  soft: {
    shadowColor: Colors.shadow,
    shadowOffset: {width: 0, height: 10},
    shadowOpacity: 0.2,
    shadowRadius: 18,
    elevation: 7,
  },
  glow: {
    shadowColor: Colors.primary,
    shadowOffset: {width: 0, height: 10},
    shadowOpacity: 0.18,
    shadowRadius: 20,
    elevation: 8,
  },
};

const theme = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  screenPadding: {
    paddingHorizontal: Spacing.md,
  },
  sectionHeader: {
    color: Colors.text,
    fontSize: Typography.section,
    fontWeight: '700',
    letterSpacing: -0.4,
  },
  card: {
    backgroundColor: Colors.card,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    ...Shadows.soft,
  },
});

export default theme;
