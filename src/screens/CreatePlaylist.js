import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Alert,
  ActivityIndicator,
} from 'react-native';
import theme, {Colors} from '../theme';
import AppButton from '../components/AppButton';
import {supabase} from '../supabaseClient';
import useAuth from '../hooks/useAuth';

export default function CreatePlaylist({navigation}) {
  const {user} = useAuth();
  const [playlistName, setPlaylistName] = useState('');
  const [loading, setLoading] = useState(false);

  const handleCreate = async () => {
    if (playlistName.trim().length === 0) {
      Alert.alert('Oups !', 'Veuillez entrer un nom pour votre playlist.');
      return;
    }

    if (!user) {
      Alert.alert('Erreur', 'Vous devez être connecté pour créer une playlist.');
      navigation.navigate('Login');
      return;
    }

    setLoading(true);
    try {
      const {error} = await supabase.from('playlists').insert([
        {
          name: playlistName.trim(),
          user_id: user.id,
          is_public: false,
        },
      ]);

      if (error) {
        throw error;
      }

      Alert.alert('Succès', 'Votre playlist a été créée !');
      // Redirige l'utilisateur vers sa bibliothèque avec un paramètre pour rafraîchir
      navigation.navigate('Bibliothèque', {refresh: Date.now()});
      setPlaylistName('');
    } catch (error) {
      Alert.alert('Erreur', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Nouvelle Playlist AFRO SOUND</Text>
      <Text style={styles.subtitle}>
        Partagez vos sons préférés avec le monde.
      </Text>

      <TextInput
        style={styles.input}
        placeholder="Ex: Ma super playlist..."
        placeholderTextColor={Colors.muted}
        value={playlistName}
        onChangeText={setPlaylistName}
        returnKeyType="done"
        onSubmitEditing={handleCreate}
      />

      {loading ? (
        <ActivityIndicator size="large" color={Colors.primary} />
      ) : (
        <AppButton title="Créer" onPress={handleCreate} style={styles.button} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  title: {
    color: Colors.text,
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  subtitle: {
    color: Colors.muted,
    fontSize: 16,
    marginBottom: 32,
    textAlign: 'center',
  },
  input: {
    width: '100%',
    backgroundColor: Colors.surface,
    color: Colors.text,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 8,
    fontSize: 16,
    marginBottom: 24,
  },
  button: {
    backgroundColor: Colors.accent,
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 30,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {color: Colors.background, fontSize: 18, fontWeight: 'bold'},
});
