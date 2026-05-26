import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

export default function SearchResults({ route, navigation }) {
  // On récupère le terme recherché depuis les paramètres
  const { query } = route.params;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton} activeOpacity={0.8}>
          <Ionicons name="arrow-back" size={28} color="#FDFBF7" />
        </TouchableOpacity>
        <Text style={styles.title} numberOfLines={1}>Résultats pour "{query}"</Text>
      </View>
      
      <View style={styles.content}>
        <Text style={styles.emptyText}>Aucun résultat trouvé pour le moment.</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#181411', paddingTop: 60 },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, marginBottom: 20 },
  backButton: { marginRight: 16 },
  title: { color: '#FDFBF7', fontSize: 20, fontWeight: 'bold', flex: 1 },
  content: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 32 },
  emptyText: { color: '#C4A484', fontSize: 16, textAlign: 'center' },
});