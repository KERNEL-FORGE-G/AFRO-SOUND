import {Linking} from 'react-native';
import {supabase as supabaseClient} from '../supabaseClient';
import {OAUTH_PROVIDERS, supabaseOAuthConfig} from '../config/authConfig';

// Extrait un paramètre (query ou fragment) d'une URL de redirection.
const extractParam = (url, key) => {
  const match = url.match(new RegExp(`[?&#]${key}=([^&#]+)`));
  return match ? decodeURIComponent(match[1]) : null;
};

// OAuth Service for handling social logins (Google, GitHub) via Supabase
export class AuthService {
  /**
   * Connexion via email et mot de passe avec Supabase.
   */
  static async emailPasswordLogin(email, password) {
    try {
      const {data, error} = await supabaseClient.auth.signInWithPassword({
        email,
        password,
      });
      if (error) {
        throw error;
      }
      return {success: true, session: data?.session, user: data?.user};
    } catch (error) {
      console.error('[AuthService] Login error:', error.message);
      return {success: false, error: error.message};
    }
  }

  /**
   * Connexion via Supabase OAuth (Google ou GitHub) en flux PKCE :
   *  1. on récupère l'URL d'autorisation (sans redirection auto),
   *  2. on ouvre le navigateur système,
   *  3. on capte le deep link de retour `com.afrSound://auth/callback`,
   *  4. on échange le `code` contre une session Supabase.
   */
  static async supabaseOAuth(provider) {
    let subscription = null;
    try {
      const supaProvider =
        provider === OAUTH_PROVIDERS.GITHUB ? 'github' : 'google';

      const {data, error} = await supabaseClient.auth.signInWithOAuth({
        provider: supaProvider,
        options: {
          redirectTo: supabaseOAuthConfig.redirectUrl,
          scopes: supabaseOAuthConfig.scopes.join(' '),
          skipBrowserRedirect: true,
        },
      });
      if (error) {
        throw error;
      }
      if (!data?.url) {
        throw new Error("URL d'autorisation OAuth introuvable");
      }

      const session = await new Promise((resolve, reject) => {
        subscription = Linking.addEventListener('url', async ({url}) => {
          if (!url || !url.startsWith(supabaseOAuthConfig.redirectUrl)) {
            return;
          }
          try {
            const code = extractParam(url, 'code');
            if (!code) {
              const desc = extractParam(url, 'error_description');
              throw new Error(desc || 'Connexion annulée');
            }
            const {data: exchanged, error: exErr} =
              await supabaseClient.auth.exchangeCodeForSession(code);
            if (exErr) {
              throw exErr;
            }
            resolve(exchanged?.session ?? null);
          } catch (e) {
            reject(e);
          }
        });

        Linking.openURL(data.url).catch(reject);
      });

      return {success: true, session, user: session?.user};
    } catch (error) {
      console.error(`[AuthService] Supabase ${provider} error:`, error.message);
      return {success: false, error: error.message};
    } finally {
      if (subscription) {
        subscription.remove();
      }
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
