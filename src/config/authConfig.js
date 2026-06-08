// OAuth Configuration for Supabase (Google, GitHub) and Spotify

export const OAUTH_PROVIDERS = {
  GOOGLE: 'google',
  GITHUB: 'github',
  SPOTIFY: 'spotify',
};

// Supabase OAuth (Google, GitHub)
// See: https://supabase.com/docs/guides/auth/oauth
export const supabaseOAuthConfig = {
  redirectUrl: 'com.afrSound://auth/callback', // Adjust scheme per your app.json
  scopes: ['openid', 'profile', 'email'],
};

// Spotify OAuth Configuration
// Docs: https://developer.spotify.com/documentation/web-api/concepts/authorization
export const spotifyOAuthConfig = {
  clientId: process.env.SPOTIFY_CLIENT_ID || 'YOUR_SPOTIFY_CLIENT_ID',
  redirectUrl: 'com.afrSound://spotify/callback',
  scopes: [
    'user-read-private',
    'user-read-email',
    'playlist-modify-public',
    'playlist-modify-private',
  ],
};

// TODO: Implement OAuth flows in authService.js using:
// - react-native-app-auth for Spotify
// - supabase-js signInWithOAuth for Google/GitHub
// - expo-auth-session for universal OAuth handling
