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
  console.log('[AuthService] Callback URL reçue:', callbackUrl);
  
  const errorDescription = extractParam(callbackUrl, 'error_description');
  const errorCode = extractParam(callbackUrl, 'error');
  if (errorDescription || errorCode) {
    throw new Error(errorDescription || errorCode);
  }

  const code = extractParam(callbackUrl, 'code');
  console.log('[AuthService] Code extrait:', code);
  
  if (!code) {
    throw new Error('Code OAuth absent dans la redirection.');
  }

  const {data, error} = await supabaseClient.auth.exchangeCodeForSession(code);
  console.log('[AuthService] Résultat exchangeCodeForSession:', {data: !!data, error});
  
  if (error) {
    throw error;
  }

  return data?.session ?? null;
};

// Helper to create profile manually
const ensureProfileExists = async (user) => {
  if (!user) return;
  
  try {
    // On essaie d'insérer, si ça existe déjà (conflit sur id), on ne fait rien.
    const {data, error} = await supabaseClient
      .from('profiles')
      .select('id')
      .eq('id', user.id)
      .single();

    if (error && error.code === 'PGRST116') { // PGRST116 = Not found
      const {error: insertError} = await supabaseClient
        .from('profiles')
        .insert({
          id: user.id,
          username: user.user_metadata?.full_name || user.email?.split('@')[0] || 'user_' + user.id.slice(0, 8),
          avatar_url: user.user_metadata?.avatar_url || null,
        });
        
      if (insertError) console.error('[AuthService] Create profile error:', insertError);
    }
  } catch (e) {
    console.error('[AuthService] Exception in ensureProfileExists:', e);
  }
};

// OAuth Service for handling social logins (Google, GitHub) via Supabase
export class AuthService {
  static async emailPasswordLogin(email, password) {
    try {
      const {data, error} = await supabaseClient.auth.signInWithPassword({
        email: email.trim(),
        password,
      });
      if (error) throw error;
      
      // Ensure profile exists
      if (data.user) await ensureProfileExists(data.user);
      
      return {success: true, session: data?.session, user: data?.user};
    } catch (error) {
      console.error('[AuthService] Login error:', error.message);
      return {success: false, error: error.message};
    }
  }

  static async supabaseOAuth(provider) {
    try {
      const normalizedProvider = provider.toLowerCase().trim();
      
      if (!SUPPORTED_OAUTH_PROVIDERS.includes(normalizedProvider)) {
        throw new Error(`Provider OAuth non supporté: ${provider}`);
      }

      const {data, error} = await supabaseClient.auth.signInWithOAuth({
        provider: normalizedProvider,
        options: {
          redirectTo: supabaseOAuthConfig.redirectUrl,
          scopes: supabaseOAuthConfig.scopes[normalizedProvider].join(' '),
          skipBrowserRedirect: true,
        },
      });
      if (error) throw error;
      if (!data?.url) throw new Error("URL d'autorisation OAuth introuvable");

      const callbackUrl = await openOAuthUrlAndWaitForCallback(data.url);
      const session = await exchangeCallbackUrlForSession(callbackUrl);
      
      // Ensure profile exists
      if (session?.user) await ensureProfileExists(session.user);

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
