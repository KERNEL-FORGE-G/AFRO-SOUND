import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import theme, {Colors} from '../theme';
import {supabase} from '../supabaseClient';
import useAuth from '../hooks/useAuth';

export default function Search({navigation}) {
  const {user} = useAuth();
  const [query, setQuery] = useState('');
  const [recentSearches, setRecentSearches] = useState([]);

  useEffect(() => {
    if (user) {
        fetchRecentSearches();
    }
  }, [user]);

  const fetchRecentSearches = async () => {
    try {
        const {data} = await supabase
            .from('search_history')
            .select('query')
            .eq('user_id', user.id)
            .order('searched_at', {ascending: false})
            .limit(10);

        if (data) {
            // Remove duplicates
            const unique = [...new Set(data.map(d => d.query))];
            setRecentSearches(unique);
        }
    } catch (e) {
        console.warn(e.message);
    }
  };

  const handleSearch = async (overrideQuery) => {
    const finalQuery = overrideQuery || query;
    if (finalQuery.trim().length > 0) {
      if (user) {
        // Enregistrer la recherche
        try {
            await supabase.from('search_history').insert([
                {user_id: user.id, query: finalQuery.trim()}
            ]);
            fetchRecentSearches();
        } catch (e) {}
      }
      navigation.navigate('SearchResults', {query: finalQuery.trim()});
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Rechercher</Text>
      <View style={styles.searchBar}>
        <Ionicons
          name="search"
          size={24}
          color={Colors.background}
          style={styles.searchIcon}
        />
        <TextInput
          style={styles.searchInput}
          placeholder="Que souhaitez-vous écouter sur AFRO SOUND ?"
          placeholderTextColor="#A69485"
          value={query}
          onChangeText={setQuery}
          onSubmitEditing={handleSearch}
          returnKeyType="search"
        />
      </View>

      <Text style={styles.recentTitle}>Recherches récentes</Text>
      <ScrollView
        style={styles.recentList}
        showsVerticalScrollIndicator={false}>
        {recentSearches.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={styles.recentItem}
            activeOpacity={0.8}
            onPress={() => handleSearch(item)}>
            <Ionicons name="time-outline" size={24} color={Colors.muted} />
            <Text style={styles.recentItemText}>{item}</Text>
            <Ionicons name="close-outline" size={24} color="#C4A484" />
          </TouchableOpacity>
        ))}
        {recentSearches.length === 0 && (
            <Text style={styles.emptyText}>Aucune recherche récente</Text>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    padding: 16,
    paddingTop: 60,
  },
  title: {
    color: Colors.text,
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  searchBar: {
    backgroundColor: '#FDFBF7',
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
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
  emptyText: {color: Colors.muted, textAlign: 'center', marginTop: 20},
});
