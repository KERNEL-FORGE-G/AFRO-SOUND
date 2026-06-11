# Documentation Configuration Authentification Sociale (Firebase)

Ce document explique comment configurer l'authentification Google et GitHub pour l'application AFRO SOUND en utilisant Firebase Authentication.

## 1. Configuration sur la Console Firebase

1. Rendez-vous sur la [Console Firebase](https://console.firebase.google.com/).
2. Créez un nouveau projet ou sélectionnez un projet existant.
3. Dans le menu de gauche, allez dans **Authentification** > **Sign-in method**.

### Configuration Google
1. Cliquez sur **Ajouter un fournisseur** et choisissez **Google**.
2. Activez-le.
3. Renseignez l'e-mail d'assistance du projet.
4. Pour Android :
   - Vous devrez générer une empreinte SHA-1 de votre clé de signature (debug et release).
   - `keytool -list -v -keystore ~/.android/debug.keystore -alias androiddebugkey -storepass android -keypass android`
   - Ajoutez le certificat SHA-1 dans les paramètres de votre projet Firebase (Paramètres du projet > Général > Vos applications).
5. Téléchargez le fichier `google-services.json` et placez-le dans `android/app/`.

### Configuration GitHub
1. Allez sur [GitHub Developer Settings](https://github.com/settings/developers).
2. Créez une nouvelle **OAuth App**.
3. Renseignez l'URL de rappel (Callback URL) fournie par la console Firebase (ex: `https://votre-projet.firebaseapp.com/__/auth/handler`).
4. Copiez le **Client ID** et le **Client Secret**.
5. Dans la console Firebase, cliquez sur **Ajouter un fournisseur** et choisissez **GitHub**.
6. Collez le Client ID et le Client Secret.
7. Enregistrez.

## 2. Intégration React Native (Android)

L'application utilise `@react-native-firebase/auth`. Assurez-vous que les dépendances sont installées.

### Fichiers à modifier
1. **android/build.gradle** :
   ```gradle
   dependencies {
       classpath 'com.google.gms:google-services:4.3.15'
   }
   ```
2. **android/app/build.gradle** :
   ```gradle
   apply plugin: 'com.google.gms.google-services'
   ```

## 3. Utilisation dans le code

Pour déclencher la connexion :

```javascript
import auth from '@react-native-firebase/auth';
import { GoogleSignin } from '@react-native-google-signin/google-signin';

// Pour Google
async function onGoogleButtonPress() {
  await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
  const { idToken } = await GoogleSignin.signIn();
  const googleCredential = auth.GoogleAuthProvider.credential(idToken);
  return auth().signInWithCredential(googleCredential);
}
```

## 4. Liaison avec le Backend Afro Sound

Une fois l'utilisateur connecté via Firebase sur le mobile, vous pouvez récupérer le Token ID et l'envoyer à votre backend pour créer ou mettre à jour le profil dans Supabase.

```javascript
const user = auth().currentUser;
if (user) {
  // Appel à votre API Supabase/Backend
}
```
