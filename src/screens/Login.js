import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  ScrollView,
  TextInput,
} from 'react-native';
import {Colors} from '../theme';
import AppButton from '../components/AppButton';
import useAuth from '../hooks/useAuth';
import AuthService from '../services/authService';
import {OAUTH_PROVIDERS} from '../config/authConfig';
import Ionicons from 'react-native-vector-icons/Ionicons';

export default function LoginScreen({navigation}) {
  const {user, handleLogout, setUserInfo, setTokenInfo, setProviderInfo} =
    useAuth();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const completeLogin = (result, providerName = 'email') => {
    setUserInfo(result.user);
    setTokenInfo(result.session?.access_token);
    setProviderInfo(providerName);
    Alert.alert(
      'Succès',
      `Connecté en tant que ${result.user?.email || 'utilisateur AFRO SOUND'}`,
    );
    navigation.navigate('Home');
  };

  const handleOAuthLogin = async provider => {
    setLoading(true);
    const result = await AuthService.supabaseOAuth(provider);
    setLoading(false);

    if (result.success) {
      completeLogin(result, provider);
    } else {
      const providerLabel =
        provider === OAUTH_PROVIDERS.GITHUB ? 'GitHub' : 'Google';
      Alert.alert(
        'Erreur',
        result.error || `Erreur lors de la connexion ${providerLabel}.`,
      );
    }
  };

  const handleEmailPasswordLogin = async () => {
    if (!email || !password) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs.');
      return;
    }
    setLoading(true);
    const result = await AuthService.emailPasswordLogin(email, password);
    setLoading(false);

    if (result.success) {
      completeLogin(result);
    } else {
      Alert.alert('Erreur', result.error || 'Erreur lors de la connexion.');
    }
  };

  const handleLogoutLocal = async () => {
    setLoading(true);
    const result = await AuthService.logout();
    setLoading(false);

    if (result.success) {
      handleLogout();
      Alert.alert('Succès', 'Déconnecté.');
    } else {
      Alert.alert('Erreur', result.error || 'Erreur lors de la déconnexion.');
    }
  };

  if (user) {
    return (
      <View style={styles.container}>
        <ScrollView
          contentContainerStyle={{flexGrow: 1, justifyContent: 'center'}}>
          <View style={styles.userCard}>
            <Ionicons
              name="checkmark-circle"
              size={64}
              color={Colors.primary}
              style={{marginBottom: 16}}
            />
            <Text style={styles.userEmail}>{user.email}</Text>
            <Text style={styles.userStatus}>Vous êtes connecté !</Text>
            <AppButton
              title="Se Déconnecter"
              onPress={handleLogoutLocal}
              style={{marginTop: 32}}
            />
          </View>
        </ScrollView>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={{paddingBottom: 40}}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>AFRO SOUND</Text>
          <Text style={styles.headerSubtitle}>
            Créez, partagez et écoutez ensemble
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Se connecter</Text>

          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor={Colors.muted}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            editable={!loading}
          />
          <TextInput
            style={styles.input}
            placeholder="Mot de passe"
            placeholderTextColor={Colors.muted}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            editable={!loading}
          />
          <AppButton
            title="Se connecter"
            onPress={handleEmailPasswordLogin}
            disabled={loading}
          />

          <View style={{marginVertical: 20}}>
            <Text style={styles.dividerText}>Ou se connecter avec</Text>
          </View>

          <TouchableOpacity
            style={styles.socialButton}
            onPress={() => handleOAuthLogin(OAUTH_PROVIDERS.GOOGLE)}
            disabled={loading}>
            <Ionicons name="logo-google" size={24} color={Colors.text} />
            <Text style={styles.socialButtonText}>Google</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.socialButton}
            onPress={() => handleOAuthLogin(OAUTH_PROVIDERS.GITHUB)}
            disabled={loading}>
            <Ionicons name="logo-github" size={24} color={Colors.text} />
            <Text style={styles.socialButtonText}>GitHub</Text>
          </TouchableOpacity>

          {loading && (
            <ActivityIndicator
              size="large"
              color={Colors.primary}
              style={{marginTop: 20}}
            />
          )}

          <TouchableOpacity
            style={{marginTop: 20, alignItems: 'center'}}
            onPress={() => navigation.navigate('Register')}>
            <Text style={{color: Colors.primary, fontWeight: 'bold'}}>
              Pas encore de compte ? S'inscrire
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.infoSection}>
          <Text style={styles.infoTitle}>Avantages de la connexion</Text>
          <Text style={styles.infoItem}>✓ Créer des playlists de groupe</Text>
          <Text style={styles.infoItem}>✓ Partager avec vos amis</Text>
          <Text style={styles.infoItem}>✓ Synchroniser offline</Text>
          <Text style={styles.infoItem}>✓ Accès à Spotify & Deezer</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: Colors.background},
  header: {
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 40,
    alignItems: 'center',
  },
  headerTitle: {
    color: Colors.primary,
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  headerSubtitle: {color: Colors.muted, fontSize: 14, textAlign: 'center'},
  section: {paddingHorizontal: 16, marginBottom: 40},
  sectionTitle: {
    color: Colors.text,
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  input: {
    backgroundColor: Colors.surface,
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    color: Colors.text,
    fontSize: 16,
  },
  dividerText: {color: Colors.muted, textAlign: 'center'},
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 12,
  },
  socialButtonText: {
    color: Colors.text,
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 12,
  },
  infoSection: {
    paddingHorizontal: 16,
    paddingVertical: 24,
    backgroundColor: Colors.surface,
    marginHorizontal: 16,
    borderRadius: 8,
  },
  infoTitle: {
    color: Colors.primary,
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 12,
    textTransform: 'uppercase',
  },
  infoItem: {color: Colors.muted, fontSize: 13, marginBottom: 8},
  userCard: {alignItems: 'center', paddingHorizontal: 16},
  userEmail: {color: Colors.text, fontSize: 18, fontWeight: 'bold'},
  userStatus: {color: Colors.primary, fontSize: 14, marginTop: 8},
});
