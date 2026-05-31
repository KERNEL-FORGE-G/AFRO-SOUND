# AFRO SOUND - Projet React Native

## Description
AFRO SOUND est une application de streaming musical axée sur les sonorités africaines, offrant une interface élégante avec une palette de couleurs terreuses et dorées.

## Architecture & Structure
Le projet suit une architecture modulaire :
- `src/screens/` : Écrans de l'application (Accueil, Recherche, Bibliothèque, Lecteur).
- `src/components/` : Composants réutilisables (ex: PlayerBar).
- `src/context/` : Gestion d'état global (`PlayerContext` pour le lecteur audio, favoris).
- `src/services/` : Services API (Deezer, iTunes, Jamendo, Supabase).
- `src/theme.js` : Définition de la palette de couleurs.

## Fonctionnalités
### Lecteur Audio
- Support du background audio natif via `react-native-track-player`.
- Contrôles de lecture (Play/Pause, Suivant, Précédent).
- Barre de progression avec affichage du pourcentage de lecture.
- Téléchargement de titres via `rn-fetch-blob`.

### Recherche
- Recherche combinée (Deezer, iTunes, Jamendo) avec timeout.
- Filtrage par fournisseur (All, Jamendo, iTunes, Deezer).
- Historique de recherche local.

### Bibliothèque & Playlists
- **Favoris** : Système pour ajouter des titres favoris (persistance locale).
- **Playlists** : Création de playlists personnalisées.

## Backend & API
- **Supabase** : Authentification et stockage des données utilisateur.
- **APIs Musicales** : Intégration de Deezer, iTunes et Jamendo pour le catalogue.

## Installation & Build
### Prérequis
- Node.js (Version recommandée : 25)
- Android SDK / JDK 17+

### Commandes
- `npm run start` : Lance le bundler Metro avec nettoyage du cache.
- `npm run android` : Build et installation de l'APK Debug avec nettoyage du cache.
- `npm run build:release` : Génère l'APK Release.
- `npm run lint` : Vérification du code.

---
*Documentation générée pour le projet Afro Sound.*
