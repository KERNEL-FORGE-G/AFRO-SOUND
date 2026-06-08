import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import theme, {Colors} from '../theme';
<<<<<<< HEAD
import { supabase } from '../supabaseClient';
=======
import {supabase} from '../supabaseClient';
>>>>>>> upstream/main

export default function Register({navigation}) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);

  const signUpWithEmail = async () => {
    if (!email || !password || !username) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs');
      return;
    }

    setLoading(true);
<<<<<<< HEAD
    const { data, error } = await supabase.auth.signUp({
=======
    const {data, error} = await supabase.auth.signUp({
>>>>>>> upstream/main
      email: email,
      password: password,
      options: {
        data: {
          username: username,
        },
      },
    });

    if (error) {
<<<<<<< HEAD
      Alert.alert('Erreur d\'inscription', error.message);
    } else {
      Alert.alert('Succès', 'Vérifiez votre boîte mail pour confirmer votre compte !');
=======
      Alert.alert("Erreur d'inscription", error.message);
    } else {
      Alert.alert(
        'Succès',
        'Vérifiez votre boîte mail pour confirmer votre compte !',
      );
>>>>>>> upstream/main
      navigation.replace('Home');
    }
    setLoading(false);
  };

  return (
    <View style={theme.container}>
      <View style={{padding: 24, marginTop: 40}}>
        <Text style={styles.title}>Créer un compte AFRO SOUND</Text>

        <TextInput
          placeholder="Nom d'utilisateur"
<<<<<<< HEAD
          placeholderTextColor={Colors.muted}
=======
          placeholderTextColor="#A69485"
>>>>>>> upstream/main
          style={styles.input}
          value={username}
          onChangeText={setUsername}
          autoCapitalize="none"
        />

        <TextInput
          placeholder="Email"
<<<<<<< HEAD
          placeholderTextColor={Colors.muted}
=======
          placeholderTextColor="#A69485"
>>>>>>> upstream/main
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />
<<<<<<< HEAD
        
        <TextInput
          placeholder="Mot de passe"
          placeholderTextColor={Colors.muted}
=======

        <TextInput
          placeholder="Mot de passe"
          placeholderTextColor="#A69485"
>>>>>>> upstream/main
          secureTextEntry
          style={styles.input}
          value={password}
          onChangeText={setPassword}
        />

        <TouchableOpacity
          style={styles.button}
          onPress={signUpWithEmail}
          disabled={loading}
          activeOpacity={0.9}>
          {loading ? (
<<<<<<< HEAD
            <ActivityIndicator color={Colors.background} />
=======
            <ActivityIndicator color="#181411" />
>>>>>>> upstream/main
          ) : (
            <Text style={styles.buttonText}>S'inscrire</Text>
          )}
        </TouchableOpacity>
<<<<<<< HEAD
        
        <TouchableOpacity 
          style={{marginTop: 20, alignItems: 'center'}}
          onPress={() => navigation.navigate('Home')}>
          <Text style={{color: Colors.muted}}>Continuer sans compte</Text>
=======

        <TouchableOpacity
          style={{marginTop: 20, alignItems: 'center'}}
          onPress={() => navigation.navigate('Home')}>
          <Text style={{color: '#C4A484'}}>Continuer sans compte</Text>
>>>>>>> upstream/main
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  title: {color: '#FDFBF7', fontSize: 24, fontWeight: '700', marginBottom: 12},
  input: {
<<<<<<< HEAD
    backgroundColor: Colors.surface,
    color: Colors.text,
=======
    backgroundColor: '#2C241E',
    color: '#FDFBF7',
>>>>>>> upstream/main
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  button: {
<<<<<<< HEAD
    backgroundColor: Colors.accent,
=======
    backgroundColor: '#E67E22',
>>>>>>> upstream/main
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
<<<<<<< HEAD
  buttonText: {color: Colors.background, fontWeight: '700'},
=======
  buttonText: {color: '#181411', fontWeight: '700'},
>>>>>>> upstream/main
});
