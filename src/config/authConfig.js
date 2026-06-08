// OAuth Configuration for Supabase (Google, GitHub) and Spotify

export const OAUTH_PROVIDERS = {
  GOOGLE: 'google',
  GITHUB: 'github',
};

// Schéma de deep link (doit rester en minuscules : Android met le scheme du
// manifest en minuscules, donc l'URL de retour doit correspondre exactement).
// C'est aussi la valeur à ajouter dans Supabase → Authentication →
// URL Configuration → Redirect URLs.
export const OAUTH_REDIRECT_URL = 'com.afrsound://auth/callback';

// Supabase OAuth (Google, GitHub)
// See: https://supabase.com/docs/guides/auth/oauth
export const supabaseOAuthConfig = {
  redirectUrl: OAUTH_REDIRECT_URL,
  scopes: ['openid', 'profile', 'email'],
};
