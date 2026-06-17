# Documentation du Projet AFRO SOUND

## Introduction
AFRO SOUND est une application de streaming musical développée avec React Native. Elle permet aux utilisateurs d'écouter, de créer et de partager des playlists, avec une fonctionnalité de synchronisation en temps réel.

## Architecture
- **Framework :** React Native (0.72)
- **Navigation :** React Navigation (Stack & Tab)
- **État :** Redux Toolkit + Redux Persist
- **Backend/Base de données :** Supabase
- **Service Audio :** react-native-track-player
- **Deep Linking :** Configuration native (Android App Links) + service de gestion d'URL

## Services Clés
- `DeepLinkingService` : Génère et analyse les liens de partage (titres/playlists). Utilise le format `https://afro-sound.vercel.app/...`.
- `playlistService` : Gère les opérations CRUD sur les playlists distantes via Supabase.
- `PlayerService` : Orchestre la lecture audio.
- `SyncService` : Gère la synchronisation temps réel des playlists et de l'état de lecture.

## Fonctionnement des Liens (Deep Linking)
Les partages utilisent le protocole HTTPS pour garantir l'ouverture de l'application mobile :
1.  **Format :** `https://afro-sound.vercel.app/track/:id` ou `/playlist/:id`.
2.  **Configuration Android :** `AndroidManifest.xml` contient les intent-filters pour `https://afro-sound.vercel.app`.
3.  **Gestion :** `AppNavigator.js` utilise `Linking` pour intercepter ces URL et naviguer vers l'écran approprié.

## Développement & Installation
- **Prérequis :** Node.js >= 16, Android SDK, Keystore de signature.
- **Démarrage :** `npm start --reset-cache`.
- **Build Android :** `npm run android` ou `npm run build:release`.
