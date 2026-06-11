import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import {Colors} from '../theme';
import {supabase} from '../supabaseClient';
import Ionicons from 'react-native-vector-icons/Ionicons';

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
    const {data, error} = await supabase.auth.signUp({
      email: email,
      password: password,
      options: {
        data: {
          username: username,
        },
      },
    });

    if (error) {
      Alert.alert("Erreur d'inscription", error.message);
    } else {
      Alert.alert(
        'Succès',
        'Vérifiez votre boîte mail pour confirmer votre compte !',
      );
      navigation.replace('Home');
    }
    setLoading(false);
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={28} color={Colors.text} />
        </TouchableOpacity>

        <View style={styles.header}>
          <Text style={styles.title}>Créer un compte</Text>
          <Text style={styles.subtitle}>Rejoignez la communauté AFRO SOUND</Text>
        </View>

        <View style={styles.form}>
          <View style={styles.inputContainer}>
            <Ionicons name="person-outline" size={20} color={Colors.muted} style={styles.inputIcon} />
            <TextInput
              placeholder="Nom d'utilisateur"
              placeholderTextColor={Colors.muted}
              style={styles.input}
              value={username}
              onChangeText={setUsername}
              autoCapitalize="none"
            />
          </View>

          <View style={styles.inputContainer}>
            <Ionicons name="mail-outline" size={20} color={Colors.muted} style={styles.inputIcon} />
            <TextInput
              placeholder="Email"
              placeholderTextColor={Colors.muted}
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
            />
          </View>

          <View style={styles.inputContainer}>
            <Ionicons name="lock-closed-outline" size={20} color={Colors.muted} style={styles.inputIcon} />
            <TextInput
              placeholder="Mot de passe"
              placeholderTextColor={Colors.muted}
              secureTextEntry
              style={styles.input}
              value={password}
              onChangeText={setPassword}
            />
          </View>

          <TouchableOpacity
            style={styles.button}
            onPress={signUpWithEmail}
            disabled={loading}
            activeOpacity={0.9}>
            {loading ? (
              <ActivityIndicator color={Colors.background} />
            ) : (
              <Text style={styles.buttonText}>S'inscrire</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.footerLink}
            onPress={() => navigation.navigate('Home')}>
            <Text style={styles.footerText}>Continuer sans compte</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background
  },
  scroll: {
    padding: 24,
    paddingTop: 60
  },
  backBtn: {
    marginBottom: 32,
    marginLeft: -8,
  },
  header: {
    marginBottom: 40,
  },
  title: {
    color: Colors.text,
    fontSize: 32,
    fontWeight: '800',
    marginBottom: 8
  },
  subtitle: {
    color: Colors.muted,
    fontSize: 16,
    fontWeight: '500'
  },
  form: {
    gap: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    color: Colors.text,
    paddingVertical: 14,
    fontSize: 16,
  },
  button: {
    backgroundColor: Colors.primary,
    padding: 18,
    borderRadius: 30,
    alignItems: 'center',
    marginTop: 12,
    elevation: 4,
    shadowColor: Colors.primary,
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  buttonText: {
    color: Colors.background,
    fontWeight: '800',
    fontSize: 16,
  },
  footerLink: {
    marginTop: 24,
    alignItems: 'center'
  },
  footerText: {
    color: Colors.muted,
    fontWeight: '600'
  },
});
