import {Linking, Share} from 'react-native';

const APP_SCHEME = 'afrosound://';
const WEB_URL = 'https://afro-sound.vercel.app'; // Fallback web URL

/**
 * Service centralisé pour la gestion des liens profonds (Deep Linking)
 * et le partage de contenu.
 */
export const DeepLinkingService = {
  
  /**
   * Génère un lien de partage pour un titre
   */
  getTrackLink: (trackId) => {
    return `${WEB_URL}/track/${trackId}`;
  },

  /**
   * Génère un lien de partage pour une playlist
   */
  getPlaylistLink: (playlistId) => {
    return `${WEB_URL}/playlist/${playlistId}`;
  },

  /**
   * Partage un titre avec un message et un lien
   */
  shareTrack: async (track) => {
    const url = DeepLinkingService.getTrackLink(track.id);
    const message = `Écoute "${track.title}" de ${track.artist || 'Artiste inconnu'} sur AFRO SOUND !\n\n${url}`;
    
    try {
      await Share.share({
        title: 'Partager ce titre',
        message,
        url: url, // iOS support
      });
    } catch (error) {
      console.warn('[DeepLinkingService] shareTrack error:', error.message);
    }
  },

  /**
   * Partage une playlist
   */
  sharePlaylist: async (playlist) => {
    const url = DeepLinkingService.getPlaylistLink(playlist.id);
    const message = `Rejoins ma playlist "${playlist.name}" sur AFRO SOUND !\n\n${url}`;
    
    try {
      await Share.share({
        title: 'Partager la playlist',
        message,
        url: url,
      });
    } catch (error) {
      console.warn('[DeepLinkingService] sharePlaylist error:', error.message);
    }
  },

  /**
   * Gère l'URL entrante et retourne un objet d'action
   */
  parseUrl: (url) => {
    if (!url) return null;

    try {
      const cleanUrl = url.replace(APP_SCHEME, '');
      const [path, id] = cleanUrl.split('/');

      if (path === 'track') {
        return { type: 'TRACK', id };
      }
      if (path === 'playlist') {
        return { type: 'PLAYLIST', id };
      }
    } catch (e) {
      console.warn('[DeepLinkingService] parseUrl error:', e.message);
    }
    
    return null;
  }
};
