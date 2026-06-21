import React, {useState} from 'react';
import {
  TouchableOpacity,
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {Colors, Radius} from '../theme';
import {downloadTrack, isDownloading} from '../services/downloadService';

export default function DownloadButton({track, style, size = 'medium'}) {
  const [progress, setProgress] = useState(0);
  const [isDownloadingState, setIsDownloadingState] = useState(false);
  const trackId = track?.id || `track_${Date.now()}`;
  const currentlyDownloading = isDownloading(trackId) || isDownloadingState;

  const handleDownload = async () => {
    if (currentlyDownloading) return;
    
    setIsDownloadingState(true);
    const success = await downloadTrack(track, (prog) => {
      setProgress(prog);
    });
    setIsDownloadingState(false);
    if (success) {
      setProgress(0);
    }
  };

  const sizes = {
    small: {
      container: 32,
      icon: 16,
    },
    medium: {
      container: 44,
      icon: 20,
    },
    large: {
      container: 56,
      icon: 24,
    },
  };

  const {container, icon} = sizes[size];

  if (currentlyDownloading) {
    return (
      <View
        style={[
          styles.button,
          {width: container, height: container, borderRadius: container / 2},
          style,
        ]}>
        <View style={styles.progressContainer}>
          <View
            style={[
              styles.progressBar,
              {width: `${progress}%`},
            ]}
          />
        </View>
        <Text style={[styles.progressText, {fontSize: icon / 2}]}>
          {progress}%
        </Text>
      </View>
    );
  }

  return (
    <TouchableOpacity
      style={[
        styles.button,
        {width: container, height: container, borderRadius: container / 2},
        style,
      ]}
      onPress={handleDownload}
      activeOpacity={0.8}>
      <Ionicons
        name="cloud-download-outline"
        size={icon}
        color={Colors.primary}
      />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressContainer: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderRadius: 999,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: Colors.primary,
    opacity: 0.2,
  },
  progressText: {
    color: Colors.primary,
    fontWeight: '700',
  },
});
