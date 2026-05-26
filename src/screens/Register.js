import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert } from 'react-native';
import theme, { Colors } from '../theme';

export default function Register({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const submit = () => {
    Alert.alert('Info', "Inscription simulée (pas de backend)");
    navigation.replace('Home');
  };

  return (
    <View style={theme.container}>
      <View style={{ padding: 24 }}>
        <Text style={styles.title}>Créer un compte</Text>

        <TextInput placeholder="Email" placeholderTextColor="#A69485" style={styles.input} value={email} onChangeText={setEmail} />
        <TextInput placeholder="Mot de passe" placeholderTextColor="#A69485" secureTextEntry style={styles.input} value={password} onChangeText={setPassword} />

        <TouchableOpacity style={styles.button} onPress={submit} activeOpacity={0.9}>
          <Text style={styles.buttonText}>Créer</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  title: { color: '#FDFBF7', fontSize: 24, fontWeight: '700', marginBottom: 12 },
  input: { backgroundColor: '#2C241E', color: '#FDFBF7', padding: 12, borderRadius: 8, marginBottom: 12 },
  button: { backgroundColor: '#E67E22', padding: 14, borderRadius: 10, alignItems: 'center' },
  buttonText: { color: '#181411', fontWeight: '700' },
});
