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
import { supabase } from '../supabaseClient';

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
    const { data, error } = await supabase.auth.signUp({
      email: email,
      password: password,
      options: {
        data: {
          username: username,
        },
      },
    });

    if (error) {
      Alert.alert('Erreur d\'inscription', error.message);
    } else {
      Alert.alert('Succès', 'Vérifiez votre boîte mail pour confirmer votre compte !');
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
          placeholderTextColor="#A69485"
          style={styles.input}
          value={username}
          onChangeText={setUsername}
          autoCapitalize="none"
        />

        <TextInput
          placeholder="Email"
          placeholderTextColor="#A69485"
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />
        
        <TextInput
          placeholder="Mot de passe"
          placeholderTextColor="#A69485"
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
            <ActivityIndicator color="#181411" />
          ) : (
            <Text style={styles.buttonText}>S'inscrire</Text>
          )}
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={{marginTop: 20, alignItems: 'center'}}
          onPress={() => navigation.navigate('Home')}>
          <Text style={{color: '#C4A484'}}>Continuer sans compte</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  title: {color: '#FDFBF7', fontSize: 24, fontWeight: '700', marginBottom: 12},
  input: {
    backgroundColor: '#2C241E',
    color: '#FDFBF7',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  button: {
    backgroundColor: '#E67E22',
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {color: '#181411', fontWeight: '700'},
});
