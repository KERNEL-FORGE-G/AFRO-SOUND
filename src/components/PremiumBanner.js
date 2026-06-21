import React, {useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Animated, Easing} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {Colors, Radius, Spacing} from '../theme';

export default function PremiumBanner({navigation, dismissable = true}) {
  const [visible, setVisible] = useState(true);
  const slideAnim = React.useRef(new Animated.Value(0)).current;

  const handleDismiss = () => {
    Animated.timing(slideAnim, {
      toValue: -100,
      duration: 300,
      easing: Easing.inOut(Easing.ease),
      useNativeDriver: true,
    }).start(() => setVisible(false));
  };

  const handleNavigate = () => {
    navigation.navigate('Premium');
  };

  if (!visible) return null;

  return (
    <Animated.View style={[styles.container, {transform: [{translateY: slideAnim}]}]}>
      <View style={styles.banner}>
        <View style={styles.iconContainer}>
          <Ionicons name="star" size={20} color={Colors.primary} />
        </View>
        <View style={styles.content}>
          <Text style={styles.title}>Premium disponible</Text>
          <Text style={styles.subtitle}>Écoutez sans limites</Text>
        </View>
        <TouchableOpacity
          style={styles.ctaButton}
          onPress={handleNavigate}>
          <Text style={styles.ctaText}>Essayer</Text>
        </TouchableOpacity>
        {dismissable && (
          <TouchableOpacity
            style={styles.closeButton}
            onPress={handleDismiss}>
            <Ionicons name="close" size={18} color={Colors.textSoft} />
          </TouchableOpacity>
        )}
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: Spacing.md,
    marginVertical: Spacing.sm,
  },
  banner: {
    backgroundColor: Colors.surfaceAccent,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: 'rgba(231, 165, 59, 0.3)',
    padding: Spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(231, 165, 59, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.sm,
  },
  content: {
    flex: 1,
    marginRight: Spacing.sm,
  },
  title: {
    color: Colors.text,
    fontSize: 13,
    fontWeight: '800',
  },
  subtitle: {
    color: Colors.textSoft,
    fontSize: 11,
    marginTop: 2,
  },
  ctaButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: Radius.pill,
    marginRight: Spacing.sm,
  },
  ctaText: {
    color: Colors.background,
    fontWeight: '700',
    fontSize: 12,
  },
  closeButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
