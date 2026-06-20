import React from 'react';
import {View} from 'react-native';
import {NavigationContainer, DefaultTheme} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import GetStarted from '../screens/GetStarted';
import Home from '../screens/Home';
import NowPlaying from '../screens/NowPlaying';
import ChooseMode from '../screens/ChooseMode';
import Loading from '../screens/Loading';
import Lyrics from '../screens/Lyrics';
import Register from '../screens/Register';
import MusicPage from '../screens/MusicPage';
import PlayerBar from '../components/PlayerBar';
import Search from '../screens/Search';
import Library from '../screens/Library';
import SearchResults from '../screens/SearchResults';
import CreatePlaylist from '../screens/CreatePlaylist';
import Login from '../screens/Login';
import GroupPlaylist from '../screens/GroupPlaylist';
import Profile from '../screens/Profile';
import OfflineLibrary from '../screens/OfflineLibrary';
import {Colors, Radius, Shadows} from '../theme';
import useAuth from '../hooks/useAuth';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const navigationTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: Colors.background,
    card: Colors.card,
    primary: Colors.primary,
    text: Colors.text,
    border: Colors.border,
    notification: Colors.accent,
  },
};

function MainTabs() {
  return (
    <View style={styles.shell}>
      <Tab.Navigator
        screenOptions={({route}) => ({
          headerShown: false,
          tabBarStyle: {
            position: 'absolute',
            left: 12,
            right: 12,
            bottom: 12,
            backgroundColor: Colors.backgroundElevated,
            borderTopColor: Colors.borderStrong,
            borderTopWidth: 1,
            height: 72,
            paddingBottom: 10,
            paddingTop: 10,
            borderRadius: Radius.xl,
            ...Shadows.soft,
          },
          tabBarLabelStyle: {
            fontSize: 11,
            fontWeight: '700',
            marginBottom: 4,
          },
          tabBarActiveTintColor: Colors.primary,
          tabBarInactiveTintColor: Colors.textSoft,
          tabBarIcon: ({focused, color, size}) => {
            let iconName;

            if (route.name === 'Accueil') {
              iconName = focused ? 'home' : 'home-outline';
            } else if (route.name === 'Rechercher') {
              iconName = focused ? 'search' : 'search-outline';
            } else if (route.name === 'Créer') {
              iconName = focused ? 'add-circle' : 'add-circle-outline';
            } else if (route.name === 'Hors-ligne') {
              iconName = focused ? 'cloud-offline' : 'cloud-offline-outline';
            }

            return <Ionicons name={iconName} size={size} color={color} />;
          },
        })}>
        <Tab.Screen name="Accueil" component={Home} />
        <Tab.Screen name="Rechercher" component={Search} />
        <Tab.Screen name="Créer" component={CreatePlaylist} />
        <Tab.Screen name="Hors-ligne" component={OfflineLibrary} />
      </Tab.Navigator>

      <View style={styles.playerBarWrapper}>
        <PlayerBar />
      </View>
    </View>
  );
}

import {Linking} from 'react-native';
import {SyncService} from '../services/syncService';
import {DeepLinkingService} from '../services/deepLinkingService';

const linking = {
  prefixes: [
    'com.afrosound://',
    'afrosound://',
    'https://afro-sound.vercel.app',
    'http://afro-sound.vercel.app',
  ],
  config: {
    screens: {
      MusicPage: 'playlist/:id',
      NowPlaying: 'track/:trackId',
      Home: 'home',
      Profile: 'profile',
      // Explicitly map paths that might come from the web dashboard
      // Assuming web dashboard uses similar URL structure
    },
  },
  // Add a helper to transform web URLs to app-friendly paths if necessary
  getPathFromState(state, options) {
    // Implement custom logic if standard navigation doesn't handle Vercel-to-App mapping correctly
    return null; // Let React Navigation handle default
  },
  getStateFromPath(path, options) {
    // Custom handling for web URLs that don't match exactly
    return null; // Let React Navigation handle default
  },

  async getInitialURL() {
    const url = await Linking.getInitialURL();
    return url;
  },
  subscribe(listener) {
    const onReceiveURL = ({url}) => listener(url);
    const subscription = Linking.addEventListener('url', onReceiveURL);
    return () => {
      subscription.remove();
    };
  },
};

export default function AppNavigator() {
  const {user} = useAuth();

  // Effet pour gérer l'ajout automatique lors d'un deep link de playlist
  React.useEffect(() => {
    const handleDeepLink = async (event) => {
      const {url} = event;
      if (!url || !user) return;

      const action = DeepLinkingService.parseUrl(url);
      if (action?.type === 'PLAYLIST' && action.id) {
        await SyncService.addMember(action.id, user.id);
      }
    };

    const sub = Linking.addEventListener('url', handleDeepLink);
    return () => sub.remove();
  }, [user]);

  return (
    <NavigationContainer theme={navigationTheme} linking={linking}>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          presentation: 'card',
          cardStyle: {backgroundColor: Colors.background},
          cardStyleInterpolator: ({current, layouts}) => {
            return {
              cardStyle: {
                transform: [
                  {
                    translateX: current.progress.interpolate({
                      inputRange: [0, 1],
                      outputRange: [layouts.screen.width, 0],
                    }),
                  },
                ],
              },
            };
          },
        }}>
        {!user ? (
          <>
            <Stack.Screen name="GetStarted" component={GetStarted} />
            <Stack.Screen name="ChooseMode" component={ChooseMode} />
            <Stack.Screen name="Login" component={Login} />
            <Stack.Screen name="Register" component={Register} />
            <Stack.Screen name="Home" component={MainTabs} />
          </>
        ) : (
          <>
            <Stack.Screen name="Home" component={MainTabs} />
          </>
        )}
        <Stack.Screen name="Loading" component={Loading} />
        <Stack.Screen name="GroupPlaylist" component={GroupPlaylist} />
        <Stack.Screen name="MusicPage" component={MusicPage} />
        <Stack.Screen name="NowPlaying" component={NowPlaying} />
        <Stack.Screen name="Lyrics" component={Lyrics} />
        <Stack.Screen name="SearchResults" component={SearchResults} />
        <Stack.Screen name="Profile" component={Profile} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = {
  shell: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  playerBarWrapper: {
    position: 'absolute',
    bottom: 84,
    left: 0,
    right: 0,
  },
};
