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
<<<<<<< HEAD
import theme, {Colors} from '../theme';

const recentSearches = [
  'Happier Than Ever',
  'Drake',
  'Mix Pop',
  'Podcasts Humour',
];

export default function Search({navigation}) {
  const [query, setQuery] = useState('');

  const handleSearch = () => {
    // On ne navigue que si le champ n'est pas vide
    if (query.trim().length > 0) {
      navigation.navigate('SearchResults', {query});
=======
import {Colors} from '../theme';

const providers = ['all', 'jamendo', 'itunes', 'deezer'];

export default function Search({navigation}) {
  const [query, setQuery] = useState('');
  const [source, setSource] = useState('all');

  const handleSearch = () => {
    if (query.trim().length > 0) {
      navigation.navigate('SearchResults', {query, source});
>>>>>>> upstream/main
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Rechercher</Text>
      <View style={styles.searchBar}>
        <Ionicons
          name="search"
          size={24}
<<<<<<< HEAD
          color={Colors.background}
=======
          color="#181411"
>>>>>>> upstream/main
          style={styles.searchIcon}
        />
        <TextInput
          style={styles.searchInput}
<<<<<<< HEAD
          placeholder="Que souhaitez-vous écouter sur AFRO SOUND ?"
=======
          placeholder="Que souhaitez-vous écouter ?"
>>>>>>> upstream/main
          placeholderTextColor="#A69485"
          value={query}
          onChangeText={setQuery}
          onSubmitEditing={handleSearch}
          returnKeyType="search"
        />
      </View>

<<<<<<< HEAD
      <Text style={styles.recentTitle}>Recherches récentes</Text>
      <ScrollView
        style={styles.recentList}
        showsVerticalScrollIndicator={false}>
        {recentSearches.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={styles.recentItem}
            activeOpacity={0.8}
            onPress={() => navigation.navigate('SearchResults', {query: item})}>
            <Ionicons name="time-outline" size={24} color={Colors.muted} />
            <Text style={styles.recentItemText}>{item}</Text>
            <Ionicons name="close-outline" size={24} color="#C4A484" />
          </TouchableOpacity>
        ))}
      </ScrollView>
=======
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
>>>>>>> upstream/main
    </View>
  );
}

const styles = StyleSheet.create({
<<<<<<< HEAD
  container: {flex: 1, backgroundColor: Colors.background, padding: 16, paddingTop: 60},
  title: {color: Colors.text, fontSize: 24, fontWeight: 'bold', marginBottom: 20},
=======
  container: {flex: 1, backgroundColor: '#181411', padding: 16, paddingTop: 60},
  title: {color: '#FDFBF7', fontSize: 24, fontWeight: 'bold', marginBottom: 20},
>>>>>>> upstream/main
  searchBar: {
    backgroundColor: '#FDFBF7',
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
<<<<<<< HEAD
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  searchIcon: {marginRight: 12},
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: Colors.background,
    padding: 0,
    fontWeight: '500',
  },
  recentTitle: {
    color: Colors.text,
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 32,
    marginBottom: 16,
  },
  recentList: {flex: 1},
  recentItem: {flexDirection: 'row', alignItems: 'center', marginBottom: 20},
  recentItemText: {flex: 1, color: Colors.text, fontSize: 16, marginLeft: 16},
=======
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
>>>>>>> upstream/main
});
