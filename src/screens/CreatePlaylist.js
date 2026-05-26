import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert } from 'react-native';

export default function CreatePlaylist({ navigation }) {
  const [playlistName, setPlaylistName] = useState('');

  const handleCreate = () => {
    if (playlistName.trim().length === 0) {
      Alert.alert('Oups !', 'Veuillez entrer un nom pour votre playlist.');
      return;
    }
    
    // Redirige l'utilisateur vers sa bibliothèque en envoyant le nom de la nouvelle playlist
    navigation.navigate('Bibliothèque', { newPlaylist: playlistName });

    // Réinitialise le champ de texte pour la prochaine fois
    setPlaylistName('');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Créer une playlist</Text>
      <Text style={styles.subtitle}>Donnez un nom à votre nouvelle playlist.</Text>

      <TextInput
        style={styles.input}
        placeholder="Ex: Ma super playlist..."
        placeholderTextColor="#A69485"
        value={playlistName}
        onChangeText={setPlaylistName}
        returnKeyType="done"
        onSubmitEditing={handleCreate}
      />

      <TouchableOpacity style={styles.button} onPress={handleCreate} activeOpacity={0.8}>
        <Text style={styles.buttonText}>Créer</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#181411', justifyContent: 'center', alignItems: 'center', paddingHorizontal: 24 },
  title: { color: '#FDFBF7', fontSize: 24, fontWeight: 'bold', marginBottom: 12 },
  subtitle: { color: '#C4A484', fontSize: 16, marginBottom: 32, textAlign: 'center' },
  input: {
    width: '100%',
    backgroundColor: '#2C241E',
    color: '#FDFBF7',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 8,
    fontSize: 16,
    marginBottom: 24,
  },
  button: { backgroundColor: '#E67E22', paddingVertical: 16, paddingHorizontal: 32, borderRadius: 30, width: '100%', alignItems: 'center' },
  buttonText: { color: '#181411', fontSize: 18, fontWeight: 'bold' },
});