import RNFetchBlob from 'rn-fetch-blob';
import {Alert, Platform} from 'react-native';

// Tracking active downloads
const activeDownloads = {};

export const downloadTrack = async (track, onProgress = null) => {
  const url = track.url || track.audioUrl || track.previewUrl;
  if (!url) {
    Alert.alert('Erreur', 'Impossible de trouver le lien de téléchargement.');
    return false;
  }

  const trackId = track.id || `track_${Date.now()}`;
  
  // Prevent duplicate downloads
  if (activeDownloads[trackId]) {
    Alert.alert('Téléchargement en cours', 'Ce morceau est déjà en cours de téléchargement.');
    return false;
  }

  const {dirs} = RNFetchBlob.fs;
  const fileName = `${trackId}.mp3`;
  // On Android, use DownloadDir for better compatibility with DownloadManager
  const path = Platform.OS === 'android' 
    ? `${dirs.DownloadDir}/${fileName}` 
    : `${dirs.DocumentDir}/${fileName}`;

  try {
    activeDownloads[trackId] = true;

    const config = {
      fileCache: true,
      path: path,
      addAndroidDownloads: {
        useDownloadManager: true,
        notification: true,
        path: path,
        title: track.title || 'Téléchargement',
        description: `${track.artist || 'Artiste'} - ${track.title || 'Morceau'}`,
        mime: 'audio/mpeg',
      },
    };

    const response = await RNFetchBlob.config(config)
      .fetch('GET', url)
      .progress((received, total) => {
        if (onProgress) {
          const progress = Math.round((received / total) * 100);
          onProgress(progress);
        }
      });

    delete activeDownloads[trackId];

    if (response.respInfo.status === 200) {
      Alert.alert(
        'Succès',
        `"${track.title}" a été téléchargé avec succès.`,
      );
      return true;
    } else {
      throw new Error(`HTTP ${response.respInfo.status}`);
    }
  } catch (error) {
    delete activeDownloads[trackId];
    console.error('Download error:', error);
    Alert.alert(
      'Erreur de téléchargement',
      `Impossible de télécharger "${track.title}". Vérifiez votre connexion.`,
    );
    return false;
  }
};

export const cancelDownload = (trackId) => {
  if (activeDownloads[trackId]) {
    delete activeDownloads[trackId];
    return true;
  }
  return false;
};

export const isDownloading = (trackId) => {
  return !!activeDownloads[trackId];
};
