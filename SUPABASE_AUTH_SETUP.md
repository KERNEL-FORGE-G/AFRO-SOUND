# Documentation Configuration Authentification Sociale (Supabase)

Ce document explique comment configurer l'authentification Google et GitHub pour l'application AFRO SOUND en utilisant Supabase Auth.

## 1. Configuration des Fournisseurs OAuth

### Configuration Google
1. Rendez-vous sur la [Google Cloud Console](https://console.cloud.google.com/).
2. Créez un projet et configurez l'**Écran de consentement OAuth** (User type: External, App name: AFRO SOUND).
3. Allez dans **Identifiants** > **Créer des identifiants** > **ID de client OAuth**.
4. Type d'application : **Application Web**.
5. Ajoutez l'URL de redirection fournie par Supabase (ex: `https://pijrddmcjivmfezfyvjf.supabase.co/auth/v1/callback`).
6. Copiez le **Client ID** et le **Client Secret**.
7. Dans le dashboard Supabase : **Authentication** > **Providers** > **Google**. Activez-le et collez les identifiants.

### Configuration GitHub
1. Allez dans vos [Paramètres GitHub](https://github.com/settings/developers) > **OAuth Apps** > **New OAuth App**.
2. Nom : AFRO SOUND.
3. Homepage URL : l'URL de votre site ou Vercel.
4. Authorization callback URL : L'URL fournie par Supabase (ex: `https://pijrddmcjivmfezfyvjf.supabase.co/auth/v1/callback`).
5. Copiez le **Client ID** et générez un **Client Secret**.
6. Dans le dashboard Supabase : **Authentication** > **Providers** > **GitHub**. Activez-le et collez les identifiants.

## 2. Configuration du Deep Linking (Mobile)

Pour que l'utilisateur revienne dans l'application après s'être connecté dans le navigateur :

1. Dans le dashboard Supabase, allez dans **Authentication** > **URL Configuration**.
2. Ajoutez `com.afrsound://auth/callback` dans les **Redirect URLs**.

### Android (`android/app/src/main/AndroidManifest.xml`)
Assurez-vous que l'intent-filter est présent dans l'activité principale :
```xml
<intent-filter>
  <action android:name="android.intent.action.VIEW" />
  <category android:name="android.intent.category.DEFAULT" />
  <category android:name="android.intent.category.BROWSABLE" />
  <data android:scheme="com.afrsound" android:host="auth" />
</intent-filter>
```

## 3. Utilisation dans le Code

L'application utilise déjà `AuthService.supabaseOAuth(provider)` qui gère le flux PKCE et l'ouverture du navigateur.

```javascript
import AuthService from '../services/authService';
import {OAUTH_PROVIDERS} from '../config/authConfig';

// Exemple d'appel
const result = await AuthService.supabaseOAuth(OAUTH_PROVIDERS.GOOGLE);
if (result.success) {
    // Session récupérée avec succès
}
```
