# AFRO SOUND — Application React Native

## Description

AFRO SOUND est une application de streaming musical axée sur les sonorités
africaines, offrant une interface élégante avec une palette de couleurs
terreuses et dorées.

## Architecture & Structure

Le projet suit une architecture modulaire :

- `src/screens/` : Écrans de l'application (Accueil, Recherche, Bibliothèque, Lecteur, Login, …).
- `src/components/` : Composants réutilisables (ex : `PlayerBar`).
- `src/context/` : État global du lecteur audio (`PlayerContext`).
- `src/store/` : Store Redux Toolkit (auth, playlists) avec `redux-persist`.
- `src/hooks/` : Hooks personnalisés (`useAuth`, `useGroupPlaylist`, `useOfflineSyncInit`).
- `src/services/` : Services API (Deezer, iTunes, Jamendo, Supabase, lecteur).
- `src/theme.js` : Définition de la palette de couleurs.
- `backend/` : Backend Express déployé sur Vercel (proxy Jamendo + accès Supabase).

## Fonctionnalités

### Lecteur Audio

- Lecture en arrière-plan native via `react-native-track-player`.
- Contrôles natifs synchronisés (Play/Pause, Suivant, Précédent), seek et barre de progression.
- Téléchargement de titres via `rn-fetch-blob`.

### Recherche

- Recherche combinée (Deezer, iTunes, Jamendo) avec filtrage par fournisseur.

### Bibliothèque & Playlists

- Favoris, playlists personnalisées et playlists de groupe.

## Backend & API

L'architecture cible est : **App → Backend Vercel → Supabase + APIs musicales**.

- **Supabase** : authentification email/mot de passe, OAuth Google/GitHub et base de données (voir `docs/SUPABASE_AUTH.md`).
- **APIs musicales** : Deezer et iTunes (sans clé, previews 30 s), Jamendo et
  Audius (titres complets, clés gratuites via le backend).

### Backend sur Vercel

- `backend/api/index.js` : point d'entrée de l'API (Express, format serverless).
- `vercel.json` : configuration du déploiement (rewrites `/api/*`).
- `src/config.js` : URL du backend côté application.

Variables d'environnement à définir dans Vercel :

- `JAMENDO_CLIENT_ID` : identifiant client Jamendo.
- `SUPABASE_URL` : URL du projet Supabase.
- `SUPABASE_SERVICE_ROLE_KEY` : clé service role Supabase (jamais côté app).

### Développement local du backend

1. `cd backend && npm install`
2. `node api/index.js` (ou `vercel dev`)
3. L'app pointe vers `http://10.0.2.2:3000` (émulateur Android) en mode dev.

## Installation & Build

### Prérequis

- Node.js 18 LTS
- Android SDK / JDK 17

### Commandes

- `npm start` : lance le bundler Metro.
- `npm run android` : build et installe l'APK Debug sur l'émulateur/appareil.
- `npm run build:debug` : génère l'APK Debug.
- `npm run build:release` : génère l'APK Release.
- `npm run lint` : vérification ESLint.
- `npm test` : tests Jest.

## Documentation

- `docs/SUPABASE_AUTH.md` : configuration de l'authentification Supabase
  (Google / GitHub) avec le branding « AFRO SOUND ».

---

_Documentation du projet AFRO SOUND._
