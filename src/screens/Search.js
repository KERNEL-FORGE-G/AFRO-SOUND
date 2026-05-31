import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {Colors} from '../theme';

const providers = ['all', 'jamendo', 'itunes', 'deezer'];

export default function Search({navigation}) {
  const [query, setQuery] = useState('');
  const [source, setSource] = useState('all');

  const handleSearch = () => {
    if (query.trim().length > 0) {
      navigation.navigate('SearchResults', {query, source});
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Rechercher</Text>
      <View style={styles.searchBar}>
        <Ionicons
          name="search"
          size={24}
          color="#181411"
          style={styles.searchIcon}
        />
        <TextInput
          style={styles.searchInput}
          placeholder="Que souhaitez-vous écouter ?"
          placeholderTextColor="#A69485"
          value={query}
          onChangeText={setQuery}
          onSubmitEditing={handleSearch}
          returnKeyType="search"
        />
      </View>

      <View style={styles.filterContainer}>
        {providers.map(p => (
          <TouchableOpacity
            key={p}
            style={[styles.filterBtn, source === p && styles.activeFilter]}
            onPress={() => setSource(p)}>
            <Text
              style={[
                styles.filterText,
                source === p && styles.activeFilterText,
              ]}>
              {p.toUpperCase()}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#181411', padding: 16, paddingTop: 60},
  title: {color: '#FDFBF7', fontSize: 24, fontWeight: 'bold', marginBottom: 20},
  searchBar: {
    backgroundColor: '#FDFBF7',
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchIcon: {marginRight: 12},
  searchInput: {flex: 1, fontSize: 16, color: '#181411'},
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  filterBtn: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#333',
  },
  activeFilter: {backgroundColor: Colors.primary},
  filterText: {color: '#FFF', fontSize: 12, fontWeight: 'bold'},
  activeFilterText: {color: Colors.background},
});
