# Authentification Supabase — Google & GitHub (branding « AFRO SOUND »)

Ce guide explique comment configurer l'authentification sociale **Google** et
**GitHub** via **Supabase**, de manière à ce que l'écran de connexion / de
consentement affiche bien le nom et le logo de **ton application AFRO SOUND**
(et non « Supabase » ou un nom générique).

> Rappel : le code mobile utilise **Supabase Auth**. Il ne charge pas le SDK
> Firebase : Google/GitHub sont branchés comme fournisseurs OAuth de Supabase.
> Si tu voulais réellement Firebase Authentication, il faudrait ajouter le SDK
> Firebase et migrer le service d'authentification.

---

## 0. Informations du projet

- **Nom de l'app** : AFRO SOUND (déjà défini dans `app.json` → `displayName`).
- **URL Supabase** : `https://pijrddmcjivmfezfyvjf.supabase.co`
  (ton projet actuel côté app : `https://pijrddmcjivmfezfyvjf.supabase.co`,
  donc `PROJECT_REF = pijrddmcjivmfezfyvjf`).
- **URL de callback Supabase** (la même pour Google et GitHub) :
  ```
  https://pijrddmcjivmfezfyvjf.supabase.co/auth/v1/callback
  ```
- **Deep link mobile** (retour vers l'app après login) :
  `com.afrsound://auth/callback` (voir `src/config/authConfig.js`).

---

## 1. Pourquoi le nom affiché compte

Quand un utilisateur se connecte avec Google ou GitHub, c'est **Google/GitHub**
qui affichent l'écran de consentement, pas Supabase. Le nom et le logo montrés
proviennent de la **configuration de l'application OAuth** que tu crées chez
Google et GitHub. C'est donc **là** qu'il faut renseigner « AFRO SOUND ».

Supabase ne fait que relayer la connexion : il faut lui donner le `Client ID` et
le `Client Secret` issus de Google/GitHub.

---

## 2. Google — écran de consentement « AFRO SOUND »

### 2.1 Créer l'écran de consentement OAuth

1. Va sur [Google Cloud Console](https://console.cloud.google.com/) → crée (ou
   sélectionne) un projet.
2. **APIs & Services → OAuth consent screen**.
   - **User type** : External.
   - **App name** : `AFRO SOUND` ← **c'est ce nom qui s'affiche à l'utilisateur**.
   - **User support email** : ton email.
   - **App logo** : téléverse `logo.png` (le logo AFRO SOUND) pour qu'il
     apparaisse sur l'écran de connexion.
   - **Authorized domains** : ajoute `supabase.co`.
   - **Developer contact information** : ton email.
3. **Scopes** : ajoute `openid`, `.../auth/userinfo.email`,
   `.../auth/userinfo.profile`.
4. Publie l'écran (ou ajoute des « Test users » tant que l'app est en mode test).

### 2.2 Créer les identifiants OAuth

1. **APIs & Services → Credentials → Create Credentials → OAuth client ID**.
2. **Application type** : Web application.
3. **Name** : `AFRO SOUND Web` (usage interne).
4. **Authorized redirect URIs** : ajoute exactement
   ```
   https://pijrddmcjivmfezfyvjf.supabase.co/auth/v1/callback
   ```
5. Récupère le **Client ID** et le **Client Secret**.

### 2.3 Brancher dans Supabase

1. Dashboard Supabase → **Authentication → Providers → Google**.
2. Active le provider, colle le **Client ID** et le **Client Secret**.
3. Enregistre.

---

## 3. GitHub — OAuth App « AFRO SOUND »

1. GitHub → **Settings → Developer settings → OAuth Apps → New OAuth App**.
   - **Application name** : `AFRO SOUND` ← **nom affiché à l'utilisateur**.
   - **Homepage URL** : l'URL de ton app/landing (ex. l'URL Vercel).
   - **Application logo** (après création) : téléverse le logo AFRO SOUND.
   - **Authorization callback URL** :
     ```
     https://pijrddmcjivmfezfyvjf.supabase.co/auth/v1/callback
     ```
2. Crée l'app, génère un **Client Secret**, récupère **Client ID** + **Client Secret**.
3. Dashboard Supabase → **Authentication → Providers → GitHub** → active, colle
   les identifiants, enregistre.

---

## 4. Configuration Supabase (URLs de redirection)

Dashboard Supabase → **Authentication → URL Configuration** :

- **Site URL** : l'URL principale de l'app (ex. l'URL Vercel de production).
- **Redirect URLs** : ajoute le deep link mobile pour revenir dans l'app :
  ```
  com.afrsound://auth/callback
  ```

> Sans cette redirection autorisée, le retour dans l'app mobile après login
> échouera.

### Branding des emails (optionnel mais recommandé)

Dashboard Supabase → **Authentication → Emails** :

- **Sender name** : `AFRO SOUND` (pour que les emails de confirmation /
  réinitialisation viennent de « AFRO SOUND »).
- Personnalise les templates (sujet et contenu) avec le nom et le logo.

---

## 5. Configuration mobile (deep link Android)

Pour que `com.afrsound://auth/callback` ramène vers l'app, déclare le scheme
dans `android/app/src/main/AndroidManifest.xml`, dans l'activité principale :

```xml
<intent-filter>
  <action android:name="android.intent.action.VIEW" />
  <category android:name="android.intent.category.DEFAULT" />
  <category android:name="android.intent.category.BROWSABLE" />
  <data android:scheme="com.afrsound" android:host="auth" />
</intent-filter>
```

> ⚠️ **À vérifier** : l'`applicationId` Android est actuellement
> `com.helloworld` (`android/app/build.gradle`). Le scheme de deep link
> (`com.afrsound`) est indépendant de l'`applicationId`, mais il est recommandé
> d'aligner l'`applicationId` sur quelque chose comme `com.afrosound` pour la
> cohérence de la marque avant publication sur le Play Store.

---

## 6. Utilisation dans le code

Le service est déjà prévu dans `src/services/authService.js` :

```js
import AuthService from '../services/authService';
import {OAUTH_PROVIDERS} from '../config/authConfig';

// Connexion Google
await AuthService.supabaseOAuth(OAUTH_PROVIDERS.GOOGLE);

// Connexion GitHub
await AuthService.supabaseOAuth(OAUTH_PROVIDERS.GITHUB);
```

La configuration des redirections/scopes est centralisée dans
`src/config/authConfig.js` (`supabaseOAuthConfig`).

---

## 7. Checklist de validation

- [ ] Google : « App name » = AFRO SOUND + logo sur l'écran de consentement.
- [ ] Google : redirect URI = `https://pijrddmcjivmfezfyvjf.supabase.co/auth/v1/callback`.
- [ ] GitHub : « Application name » = AFRO SOUND + logo.
- [ ] GitHub : callback URL = `https://pijrddmcjivmfezfyvjf.supabase.co/auth/v1/callback`.
- [ ] Supabase : providers Google + GitHub activés avec Client ID/Secret.
- [ ] Supabase : `com.afrsound://auth/callback` ajouté aux Redirect URLs.
- [ ] Android : intent-filter du scheme `com.afrsound` présent.
- [ ] Test réel : l'écran de connexion affiche bien « AFRO SOUND ».
- [ ] Test réel : après le consentement Google/GitHub, le navigateur revient dans
      l'app via `com.afrsound://auth/callback` et la session est persistée.
