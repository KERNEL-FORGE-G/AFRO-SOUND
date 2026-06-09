import {Linking} from 'react-native';
import {supabase as supabaseClient} from '../supabaseClient';
import {OAUTH_PROVIDERS, supabaseOAuthConfig} from '../config/authConfig';

const OAUTH_TIMEOUT_MS = 120000;
const SUPPORTED_OAUTH_PROVIDERS = Object.values(OAUTH_PROVIDERS);

// Extrait un paramètre (query ou fragment) d'une URL de redirection.
const extractParam = (url, key) => {
  const match = url.match(new RegExp(`[?&#]${key}=([^&#]+)`));
  return match ? decodeURIComponent(match[1].replace(/\+/g, ' ')) : null;
};

const isAuthCallback = url =>
  Boolean(url && url.startsWith(supabaseOAuthConfig.redirectUrl));

const openOAuthUrlAndWaitForCallback = async authUrl => {
  let subscription = null;
  let timeoutId = null;

  return new Promise((resolve, reject) => {
    const cleanup = () => {
      if (subscription) {
        subscription.remove();
      }
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };

    const rejectWithCleanup = error => {
      cleanup();
      reject(error);
    };

    const resolveWithCleanup = url => {
      cleanup();
      resolve(url);
    };

    const handleUrl = ({url}) => {
      if (isAuthCallback(url)) {
        resolveWithCleanup(url);
      }
    };

    subscription = Linking.addEventListener('url', handleUrl);

    timeoutId = setTimeout(() => {
      rejectWithCleanup(
        new Error('Connexion annulée ou expirée. Réessayez depuis l’app.'),
      );
    }, OAUTH_TIMEOUT_MS);

    Linking.openURL(authUrl).catch(rejectWithCleanup);
  });
};

const exchangeCallbackUrlForSession = async callbackUrl => {
  const errorDescription = extractParam(callbackUrl, 'error_description');
  const errorCode = extractParam(callbackUrl, 'error');
  if (errorDescription || errorCode) {
    throw new Error(errorDescription || errorCode);
  }

  const code = extractParam(callbackUrl, 'code');
  if (!code) {
    throw new Error('Code OAuth absent dans la redirection.');
  }

  const {data, error} = await supabaseClient.auth.exchangeCodeForSession(code);
  if (error) {
    throw error;
  }

  return data?.session ?? null;
};

// OAuth Service for handling social logins (Google, GitHub) via Supabase
export class AuthService {
  /**
   * Connexion via email et mot de passe avec Supabase.
   */
  static async emailPasswordLogin(email, password) {
    try {
      const {data, error} = await supabaseClient.auth.signInWithPassword({
        email: email.trim(),
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
   *  3. on capte le deep link de retour `com.afrsound://auth/callback`,
   *  4. on échange le `code` contre une session Supabase.
   */
  static async supabaseOAuth(provider) {
    try {
      if (!SUPPORTED_OAUTH_PROVIDERS.includes(provider)) {
        throw new Error(`Provider OAuth non supporté: ${provider}`);
      }

      const {data, error} = await supabaseClient.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: supabaseOAuthConfig.redirectUrl,
          scopes: supabaseOAuthConfig.scopes[provider].join(' '),
          skipBrowserRedirect: true,
        },
      });
      if (error) {
        throw error;
      }
      if (!data?.url) {
        throw new Error("URL d'autorisation OAuth introuvable");
      }

      const callbackUrl = await openOAuthUrlAndWaitForCallback(data.url);
      const session = await exchangeCallbackUrlForSession(callbackUrl);

      return {success: true, session, user: session?.user, provider};
    } catch (error) {
      console.error(`[AuthService] Supabase ${provider} error:`, error.message);
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
      return {success: true, session: data?.session, user: data?.session?.user};
    } catch (error) {
      console.error('[AuthService] Session error:', error.message);
      return {success: false, error: error.message};
    }
  }
}

export default AuthService;
