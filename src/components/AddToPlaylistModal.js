import React, {useState, useEffect} from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {Colors, Radius} from '../theme';
import {fetchUserPlaylists, addTrackToRemotePlaylist} from '../services/playlistService';
import useAuth from '../hooks/useAuth';

const AddToPlaylistModal = ({visible, onClose, track}) => {
  const {user} = useAuth();
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(false);
  const [addingTo, setAddingTo] = useState(null);

  useEffect(() => {
    if (visible && user) {
      loadPlaylists();
    }
  }, [visible, user]);

  const loadPlaylists = async () => {
    setLoading(true);
    try {
      const data = await fetchUserPlaylists(user.id);
      setPlaylists(data);
    } catch (error) {
      console.warn('[AddToPlaylistModal] Error loading playlists:', error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async (playlistId) => {
    setAddingTo(playlistId);
    try {
      await addTrackToRemotePlaylist(playlistId, track);
      Alert.alert('Succès', 'Morceau ajouté à la playlist !');
      onClose();
    } catch (error) {
      Alert.alert('Erreur', 'Impossible d\'ajouter le morceau à cette playlist.');
      console.warn('[AddToPlaylistModal] Error adding track:', error.message);
    } finally {
      setAddingTo(null);
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <TouchableOpacity 
        style={styles.backdrop} 
        activeOpacity={1} 
        onPress={onClose}
      >
        <View style={styles.sheet} onStartShouldSetResponder={() => true}>
          <View style={styles.header}>
            <Text style={styles.title}>Ajouter à une playlist</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Ionicons name="close" size={24} color={Colors.text} />
            </TouchableOpacity>
          </View>

          {loading ? (
            <ActivityIndicator color={Colors.primary} style={styles.loader} />
          ) : (
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.list}>
              {playlists.length === 0 ? (
                <Text style={styles.emptyText}>Vous n'avez pas encore de playlist.</Text>
              ) : (
                playlists.map((pl) => (
                  <TouchableOpacity 
                    key={pl.id} 
                    style={styles.item}
                    onPress={() => handleAdd(pl.id)}
                    disabled={addingTo !== null}
                  >
                    <View style={styles.itemInfo}>
                      <View style={styles.iconContainer}>
                        <Ionicons name="musical-notes" size={20} color={Colors.primary} />
                      </View>
                      <View>
                        <Text style={styles.itemName}>{pl.name}</Text>
                        <Text style={styles.itemMeta}>
                          {pl.is_public ? 'Publique' : 'Privée'}
                        </Text>
                      </View>
                    </View>
                    {addingTo === pl.id ? (
                      <ActivityIndicator size="small" color={Colors.primary} />
                    ) : (
                      <Ionicons name="add-circle" size={24} color={Colors.primary} />
                    )}
                  </TouchableOpacity>
                ))
              )}
            </ScrollView>
          )}

          <TouchableOpacity 
            style={styles.cancelBtn} 
            onPress={onClose}
          >
            <Text style={styles.cancelText}>Annuler</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: Colors.backgroundElevated,
    borderTopLeftRadius: Radius.xl,
    borderTopRightRadius: Radius.xl,
    padding: 20,
    maxHeight: '70%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    color: Colors.text,
    fontSize: 20,
    fontWeight: 'bold',
  },
  closeBtn: {
    padding: 4,
  },
  loader: {
    marginVertical: 40,
  },
  list: {
    paddingBottom: 20,
  },
  emptyText: {
    color: Colors.textSoft,
    textAlign: 'center',
    marginVertical: 30,
    fontSize: 16,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  itemInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: Radius.md,
    backgroundColor: Colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  itemName: {
    color: Colors.text,
    fontSize: 16,
    fontWeight: '600',
  },
  itemMeta: {
    color: Colors.textSoft,
    fontSize: 12,
    marginTop: 2,
  },
  cancelBtn: {
    marginTop: 10,
    paddingVertical: 14,
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
  },
  cancelText: {
    color: Colors.text,
    fontWeight: '700',
    fontSize: 16,
  },
});

export default AddToPlaylistModal;
