import RNFS from 'react-native-fs';
import {Alert} from 'react-native';

export const downloadTrack = async track => {
  const url = track.url || track.audioUrl || track.previewUrl;
  if (!url) {
    Alert.alert('Erreur', 'Impossible de trouver le lien de téléchargement.');
    return;
  }

  const fileName = `${track.id || Date.now()}.mp3`;
  const path = `${RNFS.DocumentDirectoryPath}/${fileName}`;

  try {
    const options = {
      fromUrl: url,
      toFile: path,
    };

    await RNFS.downloadFile(options).promise;
    Alert.alert('Succès', 'Le morceau a été téléchargé avec succès.');
  } catch (error) {
    console.error('Download error:', error);
    Alert.alert('Erreur', 'Échec du téléchargement.');
  }
};
