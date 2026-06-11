import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Image} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {Colors} from '../theme';

const TrackListItem = ({item, onPress, isActive = false}) => {
  const artwork = item.cover || item.cover_url || item.artwork;
  const artist = item.artist || item.artist_name || 'Artiste inconnu';

  return (
    <TouchableOpacity
      style={[styles.container, isActive && styles.activeContainer]}
      onPress={onPress}
      activeOpacity={0.7}>
      <View style={styles.imageContainer}>
        <Image
          source={artwork ? {uri: artwork} : require('../../logo.png')}
          style={styles.image}
        />
        {isActive && (
          <View style={styles.playingOverlay}>
            <Ionicons name="stats-chart" size={20} color={Colors.primary} />
          </View>
        )}
      </View>

      <View style={styles.info}>
        <Text
          style={[styles.title, isActive && styles.activeText]}
          numberOfLines={1}>
          {item.title}
        </Text>
        <View style={styles.artistRow}>
          <Text style={styles.artist} numberOfLines={1}>
            {artist}
          </Text>
          {item.source && (
            <View style={[
              styles.sourceBadge,
              item.source === 'itunes' && styles.itunesBadge,
              item.source === 'jamendo' && styles.jamendoBadge,
            ]}>
              <Text style={styles.sourceText}>{item.source}</Text>
            </View>
          )}
        </View>
      </View>

      <TouchableOpacity style={styles.moreButton}>
        <Ionicons name="ellipsis-vertical" size={20} color={Colors.muted} />
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border + '33', // 20% opacity
  },
  activeContainer: {
    backgroundColor: Colors.surface,
  },
  imageContainer: {
    position: 'relative',
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 6,
    backgroundColor: Colors.surface,
  },
  playingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  info: {
    flex: 1,
    marginLeft: 14,
    justifyContent: 'center',
  },
  title: {
    color: Colors.text,
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 4,
  },
  activeText: {
    color: Colors.primary,
  },
  artistRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  artist: {
    color: Colors.muted,
    fontSize: 13,
    maxWidth: '70%',
  },
  sourceBadge: {
    marginLeft: 8,
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 4,
    backgroundColor: Colors.surfaceLight,
  },
  itunesBadge: {backgroundColor: '#1D1A29'},
  jamendoBadge: {backgroundColor: '#FF3333'},
  sourceText: {
    color: '#FFF',
    fontSize: 9,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  moreButton: {
    padding: 8,
  },
});

export default TrackListItem;
