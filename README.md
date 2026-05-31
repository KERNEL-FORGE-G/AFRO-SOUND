This is a new [**React Native**](https://reactnative.dev) project, bootstrapped using [`@react-native-community/cli`](https://github.com/react-native-community/cli).

# Getting Started

>**Note**: Make sure you have completed the [React Native - Environment Setup](https://reactnative.dev/docs/environment-setup) instructions till "Creating a new application" step, before proceeding.

## Step 1: Start the Metro Server

First, you will need to start **Metro**, the JavaScript _bundler_ that ships _with_ React Native.
 
To start Metro, run the following command from the _root_ of your React Native project:

```bash
# using npm
npm start

# OR using Yarn
yarn start
```

## Step 2: Start your Application

 Let Metro Bundler run in its _own_ terminal. Open a _new_ terminal from the _root_ of your React Native project. Run the following command to start your Android app:
 
 ### For Android
 
 ```bash
 # using npm
 npm run android
 
 # OR using Yarn
 yarn android
If everything is set up _correctly_, you should see your new app running in your Android emulator shortly provided you have set up your emulator correctly.

This is one way to run your app — you can also run it directly from within Android Studio.

## Step 3: Modifying your App

Now that you have successfully run the app, let's modify it.

1. Open `App.tsx` in your text editor of choice and edit some lines.
2. For **Android**: Press the <kbd>R</kbd> key twice or select **"Reload"** from the **Developer Menu** (<kbd>Ctrl</kbd> + <kbd>M</kbd> on Windows/Linux or <kbd>Cmd ⌘</kbd> + <kbd>M</kbd> on macOS) to see your changes!

## Congratulations! :tada:

You've successfully run and modified your React Native App. :partying_face:

### Now what?

- If you want to add this new React Native code to an existing application, check out the [Integration guide](https://reactnative.dev/docs/integration-with-existing-apps).
- If you're curious to learn more about React Native, check out the [Introduction to React Native](https://reactnative.dev/docs/getting-started).

# Troubleshooting

If you can't get this to work, see the [Troubleshooting](https://reactnative.dev/docs/troubleshooting) page.

# AfroSound Backend

Ce projet inclut un backend conçu pour être hébergé sur **Vercel**. Il sert de pont sécurisé pour l'API Jamendo et la base de données Supabase.

## Structure du Backend

- `backend/api/index.js` : Point d'entrée de l'API (Express).
- `vercel.json` : Configuration pour le déploiement sur Vercel.
- `src/config.js` : Configuration du client pour pointer vers le backend.

## Déploiement sur Vercel

1. Connectez votre dépôt GitHub à Vercel.
2. Ajoutez les variables d'environnement suivantes dans le tableau de bord Vercel :
   - `JAMENDO_CLIENT_ID` : Votre ID client Jamendo.
   - `SUPABASE_URL` : L'URL de votre projet Supabase.
   - `SUPABASE_SERVICE_ROLE_KEY` : Votre clé de rôle de service Supabase.
3. Déployez.
4. Mettez à jour `BACKEND_URL` dans `src/config.js` avec l'URL fournie par Vercel.

## Développement Local

Pour tester le backend localement :
1. Allez dans le dossier `backend`.
2. Installez les dépendances : `npm install`.
3. Lancez le serveur : `node api/index.js` (ou utilisez `vercel dev`).
4. Assurez-vous que l'application pointe vers `http://10.0.2.2:3000` (pour Android) ou `http://localhost:3000`.

- [React Native Website](https://reactnative.dev) - learn more about React Native.
- [Getting Started](https://reactnative.dev/docs/environment-setup) - an **overview** of React Native and how setup your environment.
- [Learn the Basics](https://reactnative.dev/docs/getting-started) - a **guided tour** of the React Native **basics**.
- [Blog](https://reactnative.dev/blog) - read the latest official React Native **Blog** posts.
- [`@facebook/react-native`](https://github.com/facebook/react-native) - the Open Source; GitHub **repository** for React Native.
