import React, {useState, useEffect, useCallback} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import theme, {Colors, Radius, Spacing, Typography} from '../theme';
import {supabase} from '../supabaseClient';
import useAuth from '../hooks/useAuth';

const TRENDING_QUERIES = [
  'Afrobeats 2026',
  'Amapiano',
  'Burna Boy',
  'Tems',
  'Chill afro soul',
];

export default function Search({navigation}) {
  const {user} = useAuth();
  const [query, setQuery] = useState('');
  const [recentSearches, setRecentSearches] = useState([]);

  const fetchRecentSearches = useCallback(async () => {
    if (!user) {
      setRecentSearches([]);
      return;
    }

    try {
      const {data} = await supabase
        .from('search_history')
        .select('query')
        .eq('user_id', user.id)
        .order('searched_at', {ascending: false})
        .limit(10);

      if (data) {
        const unique = [...new Set(data.map(d => d.query))];
        setRecentSearches(unique);
      }
    } catch (e) {
      console.warn(e.message);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      fetchRecentSearches();
    } else {
      setRecentSearches([]);
    }
  }, [user, fetchRecentSearches]);

  const handleSearch = async overrideQuery => {
    const finalQuery = overrideQuery || query;
    if (finalQuery.trim().length > 0) {
      if (user) {
        // Enregistrer la recherche
        try {
          await supabase
            .from('search_history')
            .insert([{user_id: user.id, query: finalQuery.trim()}]);
          fetchRecentSearches();
        } catch (e) {}
      }
      navigation.navigate('SearchResults', {query: finalQuery.trim()});
    }
  };

  return (
    <View style={[theme.container, styles.container]}>
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled">
        <Text style={styles.kicker}>Recherche federée</Text>
        <Text style={styles.title}>
          Trouvez le bon son en quelques secondes.
        </Text>
        <Text style={styles.subtitle}>
          Parcourez Deezer, iTunes, Jamendo et Audius depuis une seule entree.
        </Text>

        <View style={styles.searchPanel}>
          <View style={styles.searchBar}>
            <Ionicons
              name="search"
              size={22}
              color={Colors.textSoft}
              style={styles.searchIcon}
            />
            <TextInput
              style={styles.searchInput}
              placeholder="Afrobeats, artiste, mood ou playlist..."
              placeholderTextColor={Colors.muted}
              value={query}
              onChangeText={setQuery}
              onSubmitEditing={() => handleSearch()}
              returnKeyType="search"
            />
            <TouchableOpacity
              style={styles.searchAction}
              onPress={() => handleSearch()}>
              <Text style={styles.searchActionText}>Go</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.hintRow}>
            <Ionicons name="flash-outline" size={16} color={Colors.primary} />
            <Text style={styles.hintText}>
              Mode intelligent: suggestions multi-sources.
            </Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Tendances du moment</Text>
        <View style={styles.chips}>
          {TRENDING_QUERIES.map(item => (
            <TouchableOpacity
              key={item}
              style={styles.chip}
              activeOpacity={0.8}
              onPress={() => {
                setQuery(item);
                handleSearch(item);
              }}>
              <Text style={styles.chipText}>{item}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.recentHeader}>
          <Text style={styles.sectionTitle}>Recherches recentes</Text>
          <Text style={styles.sectionMeta}>
            {recentSearches.length} elements
          </Text>
        </View>

        <View style={styles.recentList}>
          {recentSearches.map((item, index) => (
            <TouchableOpacity
              key={`${item}-${index}`}
              style={styles.recentItem}
              activeOpacity={0.82}
              onPress={() => handleSearch(item)}>
              <View style={styles.recentIcon}>
                <Ionicons
                  name="time-outline"
                  size={18}
                  color={Colors.primary}
                />
              </View>
              <View style={styles.recentCopy}>
                <Text style={styles.recentItemText}>{item}</Text>
                <Text style={styles.recentItemSubtext}>
                  Relancer cette recherche
                </Text>
              </View>
              <Ionicons
                name="arrow-forward-outline"
                size={18}
                color={Colors.textSoft}
              />
            </TouchableOpacity>
          ))}
          {recentSearches.length === 0 && (
            <View style={styles.emptyCard}>
              <Ionicons
                name="search-outline"
                size={24}
                color={Colors.primary}
              />
              <Text style={styles.emptyTitle}>Aucune recherche en memoire</Text>
              <Text style={styles.emptyText}>
                Lancez une recherche pour remplir votre historique personnel.
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    paddingHorizontal: Spacing.md,
    paddingTop: 34,
    paddingBottom: 140,
  },
  kicker: {
    color: Colors.primary,
    fontSize: Typography.caption,
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    fontWeight: '800',
    marginBottom: 10,
  },
  title: {
    color: Colors.text,
    fontSize: Typography.hero,
    lineHeight: 36,
    fontWeight: '800',
    marginBottom: 10,
  },
  subtitle: {
    color: Colors.textSoft,
    fontSize: 14,
    lineHeight: 22,
    marginBottom: 22,
  },
  searchPanel: {
    backgroundColor: Colors.card,
    borderRadius: Radius.xl,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 16,
    marginBottom: 24,
  },
  searchBar: {
    backgroundColor: Colors.backgroundSoft,
    borderRadius: Radius.pill,
    paddingHorizontal: 16,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.borderStrong,
  },
  searchIcon: {marginRight: 12},
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: Colors.text,
    padding: 0,
    fontWeight: '600',
  },
  searchAction: {
    backgroundColor: Colors.primary,
    borderRadius: Radius.pill,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginLeft: 10,
  },
  searchActionText: {
    color: Colors.background,
    fontWeight: '800',
  },
  hintRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 14,
  },
  hintText: {
    color: Colors.textSoft,
    fontSize: 12,
    marginLeft: 8,
  },
  sectionTitle: {
    color: Colors.text,
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 14,
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 26,
  },
  chip: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.pill,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: Colors.border,
    marginRight: 10,
    marginBottom: 10,
  },
  chipText: {
    color: Colors.text,
    fontWeight: '700',
    fontSize: 13,
  },
  recentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  sectionMeta: {
    color: Colors.textSoft,
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  recentList: {flex: 1},
  recentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.card,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 12,
    padding: 14,
  },
  recentIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.surfaceAccent,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  recentCopy: {
    flex: 1,
  },
  recentItemText: {
    color: Colors.text,
    fontSize: 15,
    fontWeight: '700',
  },
  recentItemSubtext: {
    color: Colors.textSoft,
    fontSize: 12,
    marginTop: 4,
  },
  emptyCard: {
    backgroundColor: Colors.card,
    borderRadius: Radius.xl,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
    padding: 24,
    marginTop: 10,
  },
  emptyTitle: {
    color: Colors.text,
    fontSize: 16,
    fontWeight: '800',
    marginTop: 12,
    marginBottom: 6,
  },
  emptyText: {
    color: Colors.textSoft,
    textAlign: 'center',
    lineHeight: 20,
  },
});
