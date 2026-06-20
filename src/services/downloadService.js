import RNFetchBlob from 'rn-fetch-blob';
import {Alert, Platform} from 'react-native';

export const downloadTrack = async track => {
  const url = track.url || track.audioUrl || track.previewUrl;
  if (!url) {
    Alert.alert('Erreur', 'Impossible de trouver le lien de téléchargement.');
    return;
  }

  const {dirs} = RNFetchBlob.fs;
  const fileName = `${track.id || Date.now()}.mp3`;
  const path = `${dirs.DocumentDir}/${fileName}`;

  try {
    const config = {
      fileCache: true,
      path: path,
      addAndroidDownloads: {
        useDownloadManager: true,
        notification: true,
        path: path,
        description: 'Téléchargement de musique',
      },
    };

    await RNFetchBlob.config(config).fetch('GET', url);
    Alert.alert('Succès', 'Le morceau a été téléchargé avec succès.');
  } catch (error) {
    console.error('Download error:', error);
    Alert.alert('Erreur', 'Échec du téléchargement.');
  }
};
