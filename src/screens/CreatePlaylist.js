import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
<<<<<<< HEAD
  Alert,
} from 'react-native';
import theme, {Colors} from '../theme';
import AppButton from '../components/AppButton';
=======
<<<<<<< HEAD
  Alert,
} from 'react-native';
import theme, {Colors} from '../theme';
import AppButton from '../components/AppButton';
=======
  TouchableOpacity,
  Alert,
} from 'react-native';
>>>>>>> upstream/main
>>>>>>> 6ca20f0853c25da4ea3c9ac371a85fe442bfef22

export default function CreatePlaylist({navigation}) {
  const [playlistName, setPlaylistName] = useState('');

  const handleCreate = () => {
    if (playlistName.trim().length === 0) {
      Alert.alert('Oups !', 'Veuillez entrer un nom pour votre playlist.');
      return;
    }

    // Redirige l'utilisateur vers sa bibliothèque en envoyant le nom de la nouvelle playlist
    navigation.navigate('Bibliothèque', {newPlaylist: playlistName});

    // Réinitialise le champ de texte pour la prochaine fois
    setPlaylistName('');
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
<<<<<<< HEAD
        placeholderTextColor={Colors.muted}
=======
<<<<<<< HEAD
        placeholderTextColor={Colors.muted}
=======
        placeholderTextColor="#A69485"
>>>>>>> upstream/main
>>>>>>> 6ca20f0853c25da4ea3c9ac371a85fe442bfef22
        value={playlistName}
        onChangeText={setPlaylistName}
        returnKeyType="done"
        onSubmitEditing={handleCreate}
      />

<<<<<<< HEAD
      <AppButton title="Créer" onPress={handleCreate} style={styles.button} />
=======
<<<<<<< HEAD
      <AppButton title="Créer" onPress={handleCreate} style={styles.button} />
=======
      <TouchableOpacity
        style={styles.button}
        onPress={handleCreate}
        activeOpacity={0.8}>
        <Text style={styles.buttonText}>Créer</Text>
      </TouchableOpacity>
>>>>>>> upstream/main
>>>>>>> 6ca20f0853c25da4ea3c9ac371a85fe442bfef22
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
<<<<<<< HEAD
    backgroundColor: Colors.background,
=======
<<<<<<< HEAD
    backgroundColor: Colors.background,
=======
    backgroundColor: '#181411',
>>>>>>> upstream/main
>>>>>>> 6ca20f0853c25da4ea3c9ac371a85fe442bfef22
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
<<<<<<< HEAD
  title: {color: Colors.text, fontSize: 24, fontWeight: 'bold', marginBottom: 12},
  subtitle: {
    color: Colors.muted,
=======
<<<<<<< HEAD
  title: {color: Colors.text, fontSize: 24, fontWeight: 'bold', marginBottom: 12},
  subtitle: {
    color: Colors.muted,
=======
  title: {color: '#FDFBF7', fontSize: 24, fontWeight: 'bold', marginBottom: 12},
  subtitle: {
    color: '#C4A484',
>>>>>>> upstream/main
>>>>>>> 6ca20f0853c25da4ea3c9ac371a85fe442bfef22
    fontSize: 16,
    marginBottom: 32,
    textAlign: 'center',
  },
  input: {
    width: '100%',
<<<<<<< HEAD
    backgroundColor: Colors.surface,
    color: Colors.text,
=======
<<<<<<< HEAD
    backgroundColor: Colors.surface,
    color: Colors.text,
=======
    backgroundColor: '#2C241E',
    color: '#FDFBF7',
>>>>>>> upstream/main
>>>>>>> 6ca20f0853c25da4ea3c9ac371a85fe442bfef22
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 8,
    fontSize: 16,
    marginBottom: 24,
  },
  button: {
<<<<<<< HEAD
    backgroundColor: Colors.accent,
=======
<<<<<<< HEAD
    backgroundColor: Colors.accent,
=======
    backgroundColor: '#E67E22',
>>>>>>> upstream/main
>>>>>>> 6ca20f0853c25da4ea3c9ac371a85fe442bfef22
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 30,
    width: '100%',
    alignItems: 'center',
  },
<<<<<<< HEAD
  buttonText: {color: Colors.background, fontSize: 18, fontWeight: 'bold'},
=======
<<<<<<< HEAD
  buttonText: {color: Colors.background, fontSize: 18, fontWeight: 'bold'},
=======
  buttonText: {color: '#181411', fontSize: 18, fontWeight: 'bold'},
>>>>>>> upstream/main
>>>>>>> 6ca20f0853c25da4ea3c9ac371a85fe442bfef22
});
