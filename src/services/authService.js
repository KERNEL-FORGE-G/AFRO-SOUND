import {supabase as supabaseClient} from '../supabaseClient';
import {
  OAUTH_PROVIDERS,
  supabaseOAuthConfig,
  spotifyOAuthConfig,
} from '../config/authConfig';

// OAuth Service for handling social logins (Google, GitHub, Spotify)
export class AuthService {
  /**
   * Sign in with Supabase OAuth (Google or GitHub).
   * Requires supabase-js + react-native-url-polyfill setup.
   */
  static async supabaseOAuth(provider) {
    try {
      const {data, error} = await supabaseClient.auth.signInWithOAuth({
        provider: provider === OAUTH_PROVIDERS.GOOGLE ? 'google' : 'github',
        options: {
          redirectTo: supabaseOAuthConfig.redirectUrl,
          scopes: supabaseOAuthConfig.scopes.join(' '),
        },
      });

      if (error) {
        throw error;
      }
      return {success: true, user: data?.user, session: data?.session};
    } catch (error) {
      console.error(`[AuthService] Supabase ${provider} error:`, error.message);
      return {success: false, error: error.message};
    }
  }

  /**
   * Sign in with Spotify.
   * Requires react-native-app-auth or expo-auth-session setup.
   * TODO: Implement real OAuth flow using the selected library.
   */
  static async spotifyOAuth() {
    try {
      // Placeholder: actual implementation would use:
      // - react-native-app-auth.authorize(spotifyOAuthConfig)
      // - or expo-auth-session with WebBrowser
      console.warn(
        '[AuthService] Spotify OAuth not yet implemented. See authService.js for setup.',
      );
      return {success: false, error: 'Spotify OAuth not configured'};
    } catch (error) {
      console.error('[AuthService] Spotify error:', error.message);
      return {success: false, error: error.message};
    }
  }

  /**
   * Sign out from current session.
   */
  static async logout() {
    try {
      const {error} = await supabaseClient.auth.signOut();
      if (error) {
        throw error;
      }
      return {success: true};
    } catch (error) {
      console.error('[AuthService] Logout error:', error.message);
      return {success: false, error: error.message};
    }
  }

  /**
   * Get current session.
   */
  static async getCurrentSession() {
    try {
      const {data, error} = await supabaseClient.auth.getSession();
      if (error) {
        throw error;
      }
      return {success: true, session: data?.session};
    } catch (error) {
      console.error('[AuthService] Session error:', error.message);
      return {success: false, error: error.message};
    }
  }
}

export default AuthService;
