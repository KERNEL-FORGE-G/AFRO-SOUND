import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {Colors, Radius, Spacing} from '../theme';

export default function PremiumPrompt({navigation, onClose}) {
  const handleUpgrade = () => {
    navigation.navigate('Premium');
    if (onClose) onClose();
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Ionicons name="star" size={24} color={Colors.primary} />
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Ionicons name="close" size={20} color={Colors.textSoft} />
          </TouchableOpacity>
        </View>
        <Text style={styles.title}>Débloquez les téléchargements</Text>
        <Text style={styles.description}>
          Téléchargez cette musique pour l&apos;écouter hors ligne avec Premium.
        </Text>
        <TouchableOpacity style={styles.button} onPress={handleUpgrade}>
          <Text style={styles.buttonText}>Passer à Premium</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.background,
    borderTopLeftRadius: Radius.xl,
    borderTopRightRadius: Radius.xl,
    borderTopWidth: 1,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: Colors.border,
    padding: Spacing.lg,
    marginHorizontal: Spacing.md,
    marginBottom: Spacing.md,
  },
  content: {
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 12,
    alignItems: 'center',
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    color: Colors.text,
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 8,
    textAlign: 'center',
  },
  description: {
    color: Colors.textSoft,
    fontSize: 13,
    lineHeight: 20,
    textAlign: 'center',
    marginBottom: 16,
  },
  button: {
    backgroundColor: Colors.primary,
    borderRadius: Radius.pill,
    paddingHorizontal: 20,
    paddingVertical: 12,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    color: Colors.background,
    fontWeight: '800',
    fontSize: 14,
  },
});
