import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import {Colors, Radius, Shadows} from '../theme';

export default function AppButton({
  title,
  onPress,
  style,
  textStyle,
  activeOpacity = 0.8,
  disabled = false,
  loading = false,
  variant = 'primary',
}) {
  const isGhost = variant === 'ghost';

  return (
    <TouchableOpacity
      style={[
        styles.button,
        isGhost && styles.ghostButton,
        disabled && styles.buttonDisabled,
        style,
      ]}
      onPress={onPress}
      activeOpacity={activeOpacity}
      disabled={disabled || loading}>
      {loading ? (
        <ActivityIndicator
          color={isGhost ? Colors.primary : Colors.background}
        />
      ) : (
        <Text
          style={[
            styles.text,
            isGhost && styles.ghostText,
            disabled && styles.textDisabled,
            textStyle,
          ]}>
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: Colors.primary,
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: Radius.pill,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.primary,
    minHeight: 56,
    ...Shadows.glow,
  },
  ghostButton: {
    backgroundColor: Colors.surface,
    borderColor: Colors.borderStrong,
    ...Shadows.soft,
  },
  buttonDisabled: {
    opacity: 0.5,
    shadowOpacity: 0,
    elevation: 0,
  },
  text: {
    color: Colors.background,
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  ghostText: {
    color: Colors.text,
  },
  textDisabled: {
    color: Colors.textSoft,
  },
});
